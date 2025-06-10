import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import UserTable from '../../components/admin/UserTable';
import { FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    role: 'all',
    status: 'all',
    date: '',
    search: ''
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await adminService.getUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...users];

    if (filters.role !== 'all') {
      result = result.filter(user => user.role === filters.role);
    }

    if (filters.status !== 'all') {
      result = result.filter(user => user.status === filters.status);
    }

    if (filters.date) {
      result = result.filter(user =>
        new Date(user.created_at).toISOString().slice(0, 10) === filters.date
      );
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(user => 
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredUsers(result);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, users]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold leading-tight text-gray-900">Gestion des utilisateurs</h1>
          <p className="mt-2 text-sm text-gray-700">
            Liste complète de tous les utilisateurs enregistrés sur la plateforme
          </p>
        </div>
      </div>

      {/* Filtres */}
      <div className="mt-6 bg-white shadow rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Rôle
            </label>
            <select
              id="role"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              onChange={e => setFilters({ ...filters, role: e.target.value })}
            >
              <option value="all">Tous les rôles</option>
              <option value="client">Client</option>
              <option value="artisan">Artisan</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Statut
            </label>
            <select
              id="status"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              onChange={e => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="blocked">Bloqué</option>
            </select>
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date d'inscription
            </label>
            <input
              type="date"
              id="date"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              onChange={e => setFilters({ ...filters, date: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Recherche
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="search"
                className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Nom ou email"
                onChange={e => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>

      <UserTable 
        users={filteredUsers} 
        onStatusChange={fetchUsers} 
        loading={loading}
      />
    </div>
  );
};

export default Users;
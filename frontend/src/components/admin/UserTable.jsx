import React from 'react';
import { adminService } from '../../services/adminService';
import { EyeIcon, EyeSlashIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const UserTable = ({ users, onStatusChange, loading }) => {
  const [processing, setProcessing] = React.useState(null);

  const toggleStatus = async (user) => {
    setProcessing(user.id);
    try {
      const newStatus = user.status === 'active' ? 'blocked' : 'active';
      await adminService.updateUserStatus(user.id, newStatus);
      onStatusChange(); // Re-fetch users
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nom
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rôle
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Statut
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Inscription
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan="6" className="px-6 py-4 text-center">
                <div className="flex justify-center">
                  <ArrowPathIcon className="h-5 w-5 animate-spin" />
                </div>
              </td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                Aucun utilisateur trouvé
              </td>
            </tr>
          ) : (
            users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.role === 'artisan' ? 'bg-purple-100 text-purple-800' : 
                    user.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status === 'active' ? 'Actif' : 'Bloqué'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.created_at).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => toggleStatus(user)}
                    disabled={processing === user.id}
                    className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${
                      user.status === 'active' 
                        ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    } ${processing === user.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {processing === user.id ? (
                      <ArrowPathIcon className="h-4 w-4 animate-spin mr-1" />
                    ) : user.status === 'active' ? (
                      <>
                        <EyeSlashIcon className="h-4 w-4 mr-1" />
                        Bloquer
                      </>
                    ) : (
                      <>
                        <EyeIcon className="h-4 w-4 mr-1" />
                        Débloquer
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
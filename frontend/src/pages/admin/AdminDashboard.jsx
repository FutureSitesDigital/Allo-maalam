import { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import StatsCard from '../../components/admin/StatsCard';
import { FaUsers, FaUserTie, FaFolder, FaClock } from 'react-icons/fa';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    artisans: 0,
    categories: 0,
    pendingArtisans: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [users, artisans, categories] = await Promise.all([
          adminService.getUsers(),
          adminService.getPendingArtisans(),
          adminService.getCategories(),
        ]);

        setStats({
          users: users.length,
          artisans: artisans.length,
          categories: categories.length,
          pendingArtisans: artisans.filter(a => !a.is_approved).length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Tableau de bord</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatsCard 
          title="Utilisateurs" 
          count ={stats.users} 
          icon={<FaUsers />} color="blue" />
        <StatsCard 
          title="Artisans" 
          count ={stats.artisans} 
          icon={<FaUserTie />} color="green" />
        <StatsCard 
          title="Catégories" 
          count ={stats.categories} 
          icon={<FaFolder />} color="purple" />
        
        <StatsCard 
          title="En attente" 
          count ={stats.pendingArtisans} 
          icon={<FaClock />} color="orange" />
      </div>
    </div>
  );
};

export default AdminDashboard;
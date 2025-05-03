import { useAuth } from '../context/AuthContext';

export default function DashboardPage({ role }) {
  const { user } = useAuth();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Tableau de bord {role === 'admin' ? 'Admin' : 
                         role === 'artisan' ? 'Artisan' : 'Client'}
      </h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p>Bienvenue, {user?.name}!</p>
        <p>Email: {user?.email}</p>
        <p>Rôle: {user?.role}</p>
        
        {role === 'artisan' && user?.artisan_profile && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold">Informations professionnelles</h2>
            <p>Service: {user.artisan_profile.service}</p>
            <p>Description: {user.artisan_profile.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
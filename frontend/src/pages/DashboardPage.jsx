import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DashboardPage = ({ role })=> {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === 'artisan' && user?.artisan_profile?.statut_verification === 'en_attente') {
      navigate('/pending-verification');
    }
  }, [user, navigate]);

  return (
    <div className="container mx-auto p-4">
      {/* ... reste du code existant ... */}
    </div>
  );
}
export default DashboardPage;
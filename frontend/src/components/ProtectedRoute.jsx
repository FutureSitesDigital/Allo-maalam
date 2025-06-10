import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({  children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  // Vérifier d'abord si le token existe dans localStorage
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si token existe mais user pas encore chargé (pendant le rechargement)
  if (token && !user) {
    return <div>Chargement...</div>;
  }


  return children ? children : <Outlet />;
}
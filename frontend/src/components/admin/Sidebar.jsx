import { NavLink } from 'react-router-dom';
import { 
  ChartBarIcon,
  UsersIcon,
  FolderIcon,
  MapIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';

const Sidebar = () => {
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        const data = await adminService.getPendingArtisans();
        setPendingCount(data.length); // Utilisez directement la longueur du tableau
      } catch (error) {
        console.error("Erreur de chargement:", error);
      }
    };
    
    fetchPendingCount();
    
    // Option: Rafraîchir périodiquement (toutes les 2 minutes)
    const interval = setInterval(fetchPendingCount, 120000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { path: '/admin/dashboard', icon: <ChartBarIcon className="h-5 w-5"/>, label: 'Dashboard' },
    { path: '/admin/users', icon: <UsersIcon className="h-5 w-5"/>, label: 'Utilisateurs' },
    {
      path: '/admin/verify-artisans', 
      icon: <ShieldCheckIcon className="h-5 w-5"/>, 
      label: 'Vérification Artisans',
      badge: pendingCount > 0,
      count: pendingCount
    },
    { path: '/admin/categories', icon: <FolderIcon className="h-5 w-5"/>, label: 'Catégories' },
    { path: '/admin/locations', icon: <MapIcon className="h-5 w-5"/>, label: 'Localisations' },
  ];

  return (
    <div className="w-64 bg-blue-800 text-white fixed h-full z-50">
      <div className="p-4 text-xl font-bold border-b border-blue-700">
        Allo-Maalam
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({isActive}) => 
                  `flex items-center p-3 rounded-lg transition-colors ${
                    isActive ? 'bg-blue-700' : 'hover:bg-blue-600'
                  }`
                }
              >
                <span className="mr-3">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {item.count}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
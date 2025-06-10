import { Outlet } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar';
import TopNav from '../components/admin/TopNav';

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Contenu principal */}
      <div className="flex-1 flex flex-col overflow-hidden ml-64"> {/* ml-64 = largeur de la sidebar */}
        {/* Top Navigation */}
        <TopNav />
        
        {/* Contenu scrollable */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet /> {/* Ici s'affichera le Dashboard */}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
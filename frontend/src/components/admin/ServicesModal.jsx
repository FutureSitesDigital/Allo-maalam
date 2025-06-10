import { useState, useEffect } from 'react';
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { adminService } from '../../services/adminService';

const ServicesModal = ({ isOpen, onClose, category }) => {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && category) {
      const fetchServices = async () => {
        try {
          const data = await adminService.getServices();
          setServices(data.filter(s => s.category_id === category.id));
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      };
      fetchServices();
    }
  }, [isOpen, category]);

  const handleAddService = async () => {
    if (!newService.trim()) {
      setError('Le nom du service est requis');
      return;
    }

    try {
      const createdService = await adminService.createService({
        name: newService,
        category_id: category.id
      });
      setServices([...services, createdService]);
      setNewService('');
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteService = async (serviceId) => {
    try {
      await adminService.deleteService(serviceId);
      setServices(services.filter(s => s.id !== serviceId));
    } catch (err) {
      setError(err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h3 className="text-lg font-medium">Services pour {category.name}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6">
          {loading ? (
            <div>Chargement...</div>
          ) : error ? (
            <div className="text-red-500 mb-4">{error}</div>
          ) : null}

          <div className="flex mb-4">
            <input
              type="text"
              value={newService}
              onChange={(e) => setNewService(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nouveau service"
            />
            <button
              onClick={handleAddService}
              className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {services.map(service => (
              <div key={service.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span>{service.name}</span>
                <button
                  onClick={() => handleDeleteService(service.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesModal;
import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import CityTable from '../../components/admin/CityTable';
import AddCityModal from '../../components/admin/Modals/AddCityModal';
import EditCityModal from '../../components/admin/Modals/EditCityModal';
import ManageZonesModal from '../../components/admin/Modals/ManageZonesModal';

const Locations = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isZonesModalOpen, setIsZonesModalOpen] = useState(false);
  const [currentCity, setCurrentCity] = useState(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const data = await adminService.getVilles();
        setCities(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  const handleAddCity = async (cityData) => {
    try {
      const newCity = await adminService.createVille(cityData);
      setCities([...cities, newCity]);
      setIsAddModalOpen(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEditCity = async (cityData) => {
    try {
      const updatedCity = await adminService.updateVille(
        currentCity.id, 
        cityData
      );
      setCities(cities.map(city => 
        city.id === currentCity.id ? updatedCity : city
      ));
      setIsEditModalOpen(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteCity = async (cityId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette ville ?')) {
      try {
        await adminService.deleteVille(cityId);
        setCities(cities.filter(city => city.id !== cityId));
      } catch (error) {
        setError(error.message);
      }
    }
  };

  if (loading) return <div className="p-6">Chargement en cours...</div>;
  if (error) return <div className="p-6 text-red-500">Erreur: {error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Localisations</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Ajouter une Ville
        </button>
      </div>

      <CityTable
        cities={cities}
        onEdit={(city) => {
          setCurrentCity(city);
          setIsEditModalOpen(true);
        }}
        onDelete={handleDeleteCity}
        onManageZones={(city) => {
          setCurrentCity(city);
          setIsZonesModalOpen(true);
        }}
      />

      <AddCityModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddCity}
      />

      {currentCity && (
        <>
          <EditCityModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            city={currentCity}
            onSave={handleEditCity}
          />

          <ManageZonesModal
            isOpen={isZonesModalOpen}
            onClose={() => setIsZonesModalOpen(false)}
            city={currentCity}
          />
        </>
      )}
    </div>
  );
};

export default Locations;
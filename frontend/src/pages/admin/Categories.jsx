import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import CategoryTable from '../../components/admin/CategoryTable';
import AddCategoryModal from '../../components/admin/Modals/AddCategoryModal';
import EditCategoryModal from '../../components/admin/Modals/EditCategoryModal';
import ServicesModal from '../../components/admin/ServicesModal';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isServicesModalOpen, setIsServicesModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await adminService.getCategories();
        setCategories(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleAddCategory = async (categoryData) => {
    try {
      const newCategory = await adminService.createCategory(categoryData);
      setCategories([...categories, newCategory]);
      setIsAddModalOpen(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEditCategory = async (categoryData) => {
    try {
      const updatedCategory = await adminService.updateCategory(
        currentCategory.id, 
        categoryData
      );
      setCategories(categories.map(cat => 
        cat.id === currentCategory.id ? updatedCategory : cat
      ));
      setIsEditModalOpen(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      try {
        await adminService.deleteCategory(categoryId);
        setCategories(categories.filter(cat => cat.id !== categoryId));
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
        <h1 className="text-2xl font-bold">Gestion des Catégories</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Ajouter une Catégorie
        </button>
      </div>

      <CategoryTable
        categories={categories}
        onEdit={(category) => {
          setCurrentCategory(category);
          setIsEditModalOpen(true);
        }}
        onDelete={handleDeleteCategory}
        onManageServices={(category) => {
          setCurrentCategory(category);
          setIsServicesModalOpen(true);
        }}
      />

      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddCategory}
      />

      {currentCategory && (
        <>
          <EditCategoryModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            category={currentCategory}
            onSave={handleEditCategory}
          />

          <ServicesModal
            isOpen={isServicesModalOpen}
            onClose={() => setIsServicesModalOpen(false)}
            category={currentCategory}
          />
        </>
      )}
    </div>
  );
};

export default AdminCategories;
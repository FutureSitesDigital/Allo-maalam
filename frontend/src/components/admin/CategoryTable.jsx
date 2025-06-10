import { PencilIcon, TrashIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';

const CategoryTable = ({ 
  categories, 
  onEdit, 
  onDelete,
  onManageServices
}) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Services</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {categories.map(category => (
            <tr key={category.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{category.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {category.services?.length || 0} services
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => onManageServices(category)}
                    className="text-blue-600 hover:text-blue-900"
                    title="Gérer les services"
                  >
                    <WrenchScrewdriverIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onEdit(category)}
                    className="text-yellow-600 hover:text-yellow-900"
                    title="Modifier"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onDelete(category.id)}
                    className="text-red-600 hover:text-red-900"
                    title="Supprimer"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {categories.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          Aucune catégorie trouvée
        </div>
      )}
    </div>
  );
};

export default CategoryTable;
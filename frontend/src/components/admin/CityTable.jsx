import { PencilIcon, TrashIcon, MapPinIcon } from '@heroicons/react/24/outline';

const CityTable = ({ 
  cities, 
  onEdit, 
  onDelete,
  onManageZones
}) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zones</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {cities.map(city => (
            <tr key={city.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{city.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {city.zones?.length || 0} zones
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => onManageZones(city)}
                    className="text-blue-600 hover:text-blue-900"
                    title="Gérer les zones"
                  >
                    <MapPinIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onEdit(city)}
                    className="text-yellow-600 hover:text-yellow-900"
                    title="Modifier"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onDelete(city.id)}
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
      {cities.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          Aucune ville trouvée
        </div>
      )}
    </div>
  );
};

export default CityTable;
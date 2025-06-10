import { EyeIcon, TrashIcon } from '@heroicons/react/24/outline';

const VerifyArtisanTable = ({ artisans, onView, onDelete }) => {
    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ville</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Inscription</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {artisans.map(artisan => (
                        <tr key={artisan.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex-shrink-0 h-10 w-10">
                                    <img 
                                        src={artisan.profile_image || '/default-avatar.jpg'} 
                                        alt={artisan.name}
                                        className="h-10 w-10 rounded-full object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/default-avatar.jpg';
                                        }}
                                    />
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{artisan.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{artisan.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{artisan.service}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{artisan.ville}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                    ${artisan.status === 'approved' ? 'bg-green-100 text-green-800' :
                                      artisan.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                      'bg-yellow-100 text-yellow-800'}`}>
                                    {artisan.status === 'approved' ? 'Approuvé' :
                                     artisan.status === 'rejected' ? 'Rejeté' : 'En attente'}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(artisan.created_at).toLocaleDateString('fr-FR')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-2">
                                <button
                                    onClick={() => onView(artisan)}
                                    className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                                    title="Voir détails"
                                >
                                    <EyeIcon className="h-5 w-5" />
                                </button>
                                {artisan.status === 'rejected' && (
                                    <button
                                        onClick={() => onDelete(artisan.id)}
                                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                        title="Supprimer"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default VerifyArtisanTable;
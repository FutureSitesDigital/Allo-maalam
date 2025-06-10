import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import VerifyArtisanTable from '../../components/admin/VerifyArtisanTable';
import ViewArtisanModal from '../../components/admin/Modals/ViewArtisanModal';

const VerifyArtisans = () => {
    const [artisans, setArtisans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedArtisan, setSelectedArtisan] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArtisans = async () => {
            try {
                setLoading(true);
                const data = await adminService.getPendingArtisans();
                setArtisans(data);
                setError(null);
            } catch (error) {
                console.error('Fetch error:', error);
                setError('Erreur lors du chargement des artisans. Veuillez réessayer.');
            } finally {
                setLoading(false);
            }
        };
        
        fetchArtisans();
    }, []);

    const handleApprove = async (artisanId) => {
        try {
            await adminService.approveArtisan(artisanId);
            setArtisans(artisans.filter(a => a.id !== artisanId));
            setIsModalOpen(false);
            setError(null);
        } catch (error) {
            console.error('Error approving artisan:', error);
            setError("Erreur lors de l'approbation de l'artisan");
        }
    };

    const handleReject = async (artisanId, reason) => {
        try {
            await adminService.rejectArtisan(artisanId, reason);
            // Mettre à jour le statut plutôt que supprimer
            setArtisans(artisans.map(a => 
                a.id === artisanId ? {...a, status: 'rejected'} : a
            ));
            setIsModalOpen(false);
            setError(null);
        } catch (error) {
            console.error('Error rejecting artisan:', error);
            setError("Erreur lors du rejet de l'artisan");
        }
    };

    const handleDelete = async (artisanId) => {
        try {
            await adminService.deleteArtisan(artisanId);
            setArtisans(artisans.filter(a => a.id !== artisanId));
            setError(null);
        } catch (error) {
            console.error('Error deleting artisan:', error);
            setError("Erreur lors de la suppression de l'artisan");
        }
    };

    const refreshArtisans = async () => {
        try {
            setLoading(true);
            const data = await adminService.getPendingArtisans();
            setArtisans(data);
            setError(null);
        } catch (error) {
            console.error('Refresh error:', error);
            setError('Erreur lors du rafraîchissement de la liste');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Vérification des Artisans</h1>
                <button 
                    onClick={refreshArtisans}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Rafraîchir la liste
                </button>
            </div>
            
            {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            {artisans.length > 0 ? (
                <>
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <VerifyArtisanTable 
                            artisans={artisans} 
                            onView={(artisan) => {
                                setSelectedArtisan(artisan);
                                setIsModalOpen(true);
                            }}
                            onDelete={handleDelete}
                        />
                    </div>
                    
                    {selectedArtisan && (
                        <ViewArtisanModal
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            artisan={selectedArtisan}
                            onApprove={() => handleApprove(selectedArtisan.id)}
                            onReject={(reason) => handleReject(selectedArtisan.id, reason)}
                        />
                    )}
                </>
            ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <p className="text-gray-600 text-lg">Aucun artisan en attente de vérification</p>
                    <button 
                        onClick={refreshArtisans}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Vérifier à nouveau
                    </button>
                </div>
            )}
        </div>
    );
};

export default VerifyArtisans;
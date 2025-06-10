import { useState, useCallback, useMemo } from 'react';
import { XMarkIcon, DocumentTextIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

const ViewArtisanModal = ({ isOpen, onClose, artisan, onApprove, onReject }) => {
    const [rejectReason, setRejectReason] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageError, setImageError] = useState(false);

    const handleImageClick = useCallback((url) => {
        setSelectedImage(url);
        setImageError(false);
    }, []);

    const handleImageError = useCallback(() => {
        setImageError(true);
    }, []);

    const closeImagePreview = useCallback(() => {
        setSelectedImage(null);
        setImageError(false);
    }, []);

    const isImageFile = useCallback((url) => {
        return /\.(jpe?g|gif|png|webp|bmp)$/i.test(url);
    }, []);

    const artisanDetails = useMemo(() => {
        if (!artisan) return [];
        return [
            ['Nom Complet', artisan.name],
            ['Email', artisan.email],
            ['Téléphone', artisan.phone],
            ['Ville', artisan.ville],
            ['Zone', artisan.zone],
            ['Date Inscription', new Date(artisan.created_at).toLocaleDateString('fr-FR')]
        ];
    }, [artisan]);

    const handleApproveClick = useCallback(() => {
        onApprove();
        onClose();
    }, [onApprove, onClose]);

    const handleRejectClick = useCallback(() => {
        onReject(rejectReason);
        onClose();
    }, [onReject, rejectReason, onClose]);

    if (!isOpen || !artisan) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            {selectedImage && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="relative max-w-4xl max-h-[90vh]">
                        {!imageError ? (
                            <img
                                src={selectedImage}
                                alt="Aperçu agrandi"
                                className="max-w-full max-h-[80vh] object-contain"
                                onError={handleImageError}
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                <p className="text-gray-500">Impossible de charger l'image</p>
                            </div>
                        )}
                        <button
                            onClick={closeImagePreview}
                            className="absolute top-2 right-2 bg-white rounded-full p-1"
                            aria-label="Fermer l'aperçu"
                        >
                            <XMarkIcon className="h-6 w-6 text-gray-800" />
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center border-b px-6 py-4 sticky top-0 bg-white z-10">
                    <h3 className="text-lg font-medium">Détails de l'Artisan</h3>
                    <button 
                        onClick={onClose} 
                        className="text-gray-500 hover:text-gray-700"
                        aria-label="Fermer la modal"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="flex items-start space-x-6">
                        <div className="flex-shrink-0">
                            <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100 cursor-pointer">
                                <img
                                    src={artisan.profile_image || '/default-avatar.jpg'}
                                    alt={artisan.name}
                                    className="w-full h-full object-cover"
                                    onClick={() => artisan.profile_image && handleImageClick(artisan.profile_image)}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/default-avatar.jpg';
                                    }}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 flex-grow">
                            {artisanDetails.map(([label, value], i) => (
                                <div key={i}>
                                    <h4 className="font-medium text-gray-500">{label}</h4>
                                    <p className="mt-1">{value || 'Non renseigné'}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-medium text-gray-500">Catégorie</h4>
                            <p className="mt-1">{artisan.categorie || 'Non renseigné'}</p>
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-500">Service</h4>
                            <p className="mt-1">{artisan.service || 'Non renseigné'}</p>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-medium text-gray-500">Description</h4>
                        <p className="mt-1 whitespace-pre-line">
                            {artisan.description || 'Aucune description fournie'}
                        </p>
                    </div>

                    <div>
                        <h4 className="font-medium text-gray-500">CIN</h4>
                        <div className="mt-2 h-64 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                            {artisan.cin ? (
                                isImageFile(artisan.cin) ? (
                                    <img
                                        src={artisan.cin}
                                        alt="CIN"
                                        className="max-h-full max-w-full cursor-pointer object-contain"
                                        onClick={() => handleImageClick(artisan.cin)}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/document-placeholder.png';
                                        }}
                                    />
                                ) : (
                                    <div className="p-4 flex flex-col items-center">
                                        <DocumentTextIcon className="h-12 w-12 text-blue-500 mb-3" />
                                        <a
                                            href={artisan.cin}
                                            download
                                            className="text-blue-600 hover:underline flex items-center"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <ArrowDownTrayIcon className="h-5 w-5 mr-1" />
                                            Télécharger le CIN
                                        </a>
                                    </div>
                                )
                            ) : (
                                <span className="text-gray-500">Aucun document fourni</span>
                            )}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-medium text-gray-500">Diplômes</h4>
                        <div className="mt-2 space-y-3">
                            {artisan.diplomes?.length > 0 ? (
                                artisan.diplomes.map((d, i) => (
                                    <div
                                        key={i}
                                        className="h-64 bg-gray-100 rounded-lg flex items-center justify-center"
                                    >
                                        {isImageFile(d.fichier) ? (
                                            <img
                                                src={d.fichier}
                                                alt={`Diplôme ${i + 1}`}
                                                className="max-h-full max-w-full cursor-pointer object-contain"
                                                onClick={() => handleImageClick(d.fichier)}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = '/document-placeholder.png';
                                                }}
                                            />
                                        ) : (
                                            <div className="p-4 flex flex-col items-center">
                                                <DocumentTextIcon className="h-12 w-12 text-blue-500 mb-3" />
                                                <a
                                                    href={d.fichier}
                                                    download
                                                    className="text-blue-600 hover:underline flex items-center"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <ArrowDownTrayIcon className="h-5 w-5 mr-1" />
                                                    Télécharger Diplôme {i + 1}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <span className="text-gray-500">Aucun diplôme fourni</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-medium text-gray-500">Photos des réalisations</h4>
                        <div className="mt-2 grid grid-cols-3 gap-3">
                            {artisan.images?.length > 0 ? (
                                artisan.images.map((img, i) => (
                                    <div
                                        key={i}
                                        className="h-64 bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
                                        onClick={() => handleImageClick(img.image_path)}
                                    >
                                        <img
                                            src={img.image_path}
                                            alt={`Réalisation ${i + 1}`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/image-placeholder.png';
                                            }}
                                        />
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-3 h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <span className="text-gray-500">Aucune photo de réalisation fournie</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {onReject && (
                        <div className="mt-4">
                            <label className="block font-medium text-gray-700 mb-1">
                                Raison du rejet (si applicable)
                            </label>
                            <textarea
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                rows={3}
                                placeholder="Entrez la raison du rejet..."
                                required
                            />
                        </div>
                    )}
                </div>

                <div className="flex justify-end space-x-3 p-4 border-t sticky bottom-0 bg-white">
                    {onReject && (
                        <button
                            onClick={handleRejectClick}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-red-400 disabled:cursor-not-allowed"
                            disabled={!rejectReason.trim()}
                        >
                            Refuser
                        </button>
                    )}
                    {onApprove && (
                        <button
                            onClick={handleApproveClick}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            Accepter
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewArtisanModal;
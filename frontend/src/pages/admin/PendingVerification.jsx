export default function PendingVerification() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
        <div className="text-blue-500 mb-4">
          <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-4">Vérification en cours</h2>
        <p className="text-gray-600 mb-6">
          Votre compte artisan est en cours de vérification par notre équipe.
          Cette opération peut prendre jusqu'à 24 heures. Vous recevrez un email
          de confirmation une fois votre compte approuvé.
        </p>
        <button
          onClick={() => window.location.href = '/'}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
}
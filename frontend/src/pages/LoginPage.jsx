import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import InputField from '../components/InputField';
import logo from '../assets/Logo allo maalam.png';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);
    setLoginSuccess(false);

    // Validation simple
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email est requis';
    if (!formData.password) newErrors.password = 'Mot de passe est requis';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await login(formData);
      console.log('Réponse du serveur:', response); // Debug
      
      // Gestion des différents statuts de vérification
      if (response.statut === 'en_attente') {
        navigate('/pending-verification');
        return;
      }

      if (response.statut === 'rejete') {
        setErrors({
          general: `Votre compte a été rejeté. Raison: ${response.raison || 'Non spécifiée'}`
        });
        return;
      }

      if (response.requires_complement) {
        navigate(`/artisan/complement/${response.artisan_id}`);
        return;
      }

      setLoginSuccess(true);
      
      // Redirection après 1.5 secondes pour voir le message de succès
      setTimeout(() => {
        navigate(response.redirect_to || '/');
      }, 1500);
      
    } catch (error) {
      console.error('Erreur de connexion:', error); // Debug
      setErrors({
        general: error.message || 'Email ou mot de passe incorrect'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Effacer l'erreur quand l'utilisateur commence à taper
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Colonne gauche - Image */}
      <div className="hidden md:flex md:w-1/2 bg-blue-600 items-center justify-center p-8">
        <div className="max-w-md text-center text-white">
          <img src={logo} alt="Logo" className="w-32 mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">Bienvenue sur Allo-Maalam</h1>
          <p className="text-lg">
            Connectez-vous pour accéder à vos services
          </p>
        </div>
      </div>

      {/* Colonne droite - Formulaire */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800">Connexion</h2>
            <p className="mt-2 text-gray-600">Entrez vos informations de connexion</p>
          </div>

          {/* Message de succès */}
          {loginSuccess && (
            <div className="p-4 mb-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              Connexion réussie! Redirection en cours...
            </div>
          )}

          {/* Message d'erreur général */}
          {errors.general && (
            <div className="p-4 mb-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <InputField
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Adresse email"
              icon="email"
              error={errors.email}
              required
            />

            <InputField
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mot de passe"
              icon="password"
              error={errors.password}
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600">
                  Se souvenir de moi
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                  Mot de passe oublié?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connexion en cours...
                </>
              ) : 'Se connecter'}
            </button>
          </form>

          <div className="text-center text-sm text-gray-600">
            Pas encore de compte?{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
              Créez un compte
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
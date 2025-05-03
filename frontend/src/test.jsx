
import React from 'react';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-600 p-4 flex justify-between items-center">
        <div className="text-white text-xl">allo-maalam</div>
        <div className="flex space-x-6">
          <a href="#" className="text-white">Prestataires</a>
          <a href="#" className="text-white">Inscription</a>
          <a href="#" className="text-white">Connexion</a>
          <a href="#" className="text-white">Nous contacter</a>
          <div className="relative">
            <button className="text-white">
              <i className="fas fa-bell"></i>
            </button>
            {/* Notification badge */}
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2 py-1">1</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
          <h2 className="text-3xl font-semibold text-center mb-4">Connectez-vous</h2>
          <p className="text-center text-gray-600 mb-6">Accédez à votre espace personnel pour gérer votre allo-maalam</p>

          {/* Form */}
          <form>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Entrez votre email"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700">Mot de passe</label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Entrez votre mot de passe"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Se connecter
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

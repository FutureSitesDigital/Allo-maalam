import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import contact from '../assets/contact.jpg';
import reseau from '../assets/Reseau.jpg';
import temps from '../assets/temps.jpg';
import Casablancaa from '../assets/ville/Casablancaa.jpg';
import Fès from '../assets/ville/Fès.jpg';
import Marrakech from '../assets/ville/Marrakech.jpg';
import Rabat from '../assets/ville/Rabat.jpg';
import Tanger from '../assets/ville/Tanger.webp';
import logo from '../assets/Logo allo maalam.png'

const HomePage = () => {

  const villeImages = {
  'Casablanca': Casablancaa,
  'Fès': Fès,
  'Marrakech': Marrakech,
  'Rabat': Rabat,
  'Tanger': Tanger,
  'logo':logo
  // ... ajoutez toutes vos villes
};
  // Villes depuis la base de données (exemple)
  const [villes, setVilles] = useState([]);
  
  // État pour le carousel
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Simuler un chargement des villes depuis l'API
  useEffect(() => {
    // En production, vous feriez un appel API ici
    const villesExemple = [
      { id: 1, name: 'Casablanca', image: 'https://example.com/casa.jpg' },
      { id: 2, name: 'Rabat', image: 'https://example.com/rabat.jpg' },
      { id: 3, name: 'Marrakech', image: 'https://example.com/marrakech.jpg' },
      { id: 4, name: 'Tanger', image: 'https://example.com/tanger.jpg' },
      { id: 5, name: 'Fès', image: 'https://example.com/fes.jpg' },
    ];
    
    setVilles(villesExemple);
    
    // Configuration du carousel automatique
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % 3); // 3 slides
    }, 6000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fadeIn">
            Les meilleurs pros pour réussir vos travaux partout au Maroc
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Trouvez l'artisan qualifié pour tous vos projets de construction, rénovation et aménagement
          </p>
          <Link 
            to="/register" 
            className="inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition duration-300 shadow-lg"
          >
            Trouver un artisan
          </Link>
        </div>
      </section>

      {/* Villes Section */}

<section className="py-12 bg-white">
  <div className="container mx-auto px-4">
    <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
      Nos villes couvertes
    </h2>
    
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {villes.map((ville) => {
        // Trouver l'image correspondante ou une image par défaut
        const villeImage = villeImages[ville.name] || villeImages['logo'];
        
        return (
          <div 
            key={ville.id} 
            className="relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300 cursor-pointer group"
          >
            {/* Image de la ville */}
            <div className="h-40 bg-gray-200 overflow-hidden">
              <img 
                src={villeImage} 
                alt={ville.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
            </div>
            
            {/* Overlay et nom de la ville */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
              <h3 className="text-white font-semibold text-lg">{ville.name}</h3>
            </div>
          </div>
        );
      })}
    </div>
  </div>
</section>

      {/* Carousel Section */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-xl shadow-xl">
            <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              {/* Slide 1 */}
              <div className="w-full flex-shrink-0">
                <div className="md:flex">
                  <div className="md:w-1/2 bg-blue-700 text-white p-12">
                    <h3 className="text-3xl font-bold mb-4">Réseau d'experts</h3>
                    <p className="text-xl mb-6">
                      Plus de 5 000 artisans qualifiés dans tout le Maroc, vérifiés et notés par nos soins.
                    </p>
                    <Link 
                      to="/register" 
                      className="inline-block bg-white text-blue-700 font-bold py-2 px-6 rounded-full hover:bg-gray-100 transition duration-300"
                    >
                      En savoir plus
                    </Link>
                  </div>
                  <div className="md:w-1/2 bg-gray-200 h-64 md:h-auto">
                    {/* Image placeholder */}
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                      <img src={reseau} alt="" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Slide 2 */}
              <div className="w-full flex-shrink-0">
                <div className="md:flex">
                  <div className="md:w-1/2 bg-orange-600 text-white p-12">
                    <h3 className="text-3xl font-bold mb-4">Gain de temps</h3>
                    <p className="text-xl mb-6">
                      Obtenez jusqu'à 5 devis en 24h seulement et choisissez le professionnel qui vous convient.
                    </p>
                    <Link 
                      to="/register" 
                      className="inline-block bg-white text-orange-600 font-bold py-2 px-6 rounded-full hover:bg-gray-100 transition duration-300"
                    >
                      Demander un devis
                    </Link>
                  </div>
                  <div className="md:w-1/2 bg-gray-200 h-64 md:h-auto">
                    {/* Image placeholder */}
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                      <img src={temps} alt="" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Slide 3 */}
              <div className="w-full flex-shrink-0">
                <div className="md:flex">
                  <div className="md:w-1/2 bg-green-600 text-white p-12">
                    <h3 className="text-3xl font-bold mb-4">Contact simplifié</h3>
                    <p className="text-xl mb-6">
                      Une messagerie intégrée pour échanger directement avec les artisans sans partager vos coordonnées.
                    </p>
                    <Link 
                      to="/register" 
                      className="inline-block bg-white text-green-600 font-bold py-2 px-6 rounded-full hover:bg-gray-100 transition duration-300"
                    >
                      Commencer maintenant
                    </Link>
                  </div>
                  <div className="md:w-1/2 bg-gray-200 h-64 md:h-auto">
                    {/* Image placeholder */}
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                      <img src={contact} alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contrôles du carousel */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
              {[0, 1, 2].map((index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full ${currentSlide === index ? 'bg-white' : 'bg-white/50'}`}
                  aria-label={`Aller au slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Valeurs Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
            {/* Valeur 1 */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl">
                ✔
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Travaux de qualité</h3>
              <p className="text-gray-600">
                Les professionnels de notre réseau sont qualifiés et soigneusement vérifiés.
              </p>
            </div>
            
            {/* Valeur 2 */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-3xl">
                ✔
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Prix transparents</h3>
              <p className="text-gray-600">
                Comparez plusieurs devis et choisissez l'offre qui correspond à votre budget.
              </p>
            </div>
            
            {/* Valeur 3 */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-3xl">
                ✔
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Satisfaction garantie</h3>
              <p className="text-gray-600">
                Nous vous accompagnons jusqu'à la complète satisfaction de vos travaux.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Prêt à commencer vos travaux ?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Des milliers de clients nous font confiance pour leurs projets chaque jour.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/register" 
              className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition duration-300 shadow-lg"
            >
              Trouver un artisan
            </Link>
            <Link 
              to="/login" 
              className="bg-transparent border-2 border-white font-bold py-3 px-8 rounded-full hover:bg-white hover:text-blue-600 transition duration-300"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Allo-Maalam</h3>
              <p className="text-gray-400">
                La plateforme de référence pour trouver des artisans qualifiés au Maroc.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Liens utiles</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white">Accueil</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
                <li><Link to="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Services</h4>
              <ul className="space-y-2">
                <li><Link to="/services/bricolage" className="text-gray-400 hover:text-white">Bricolage</Link></li>
                <li><Link to="/services/plomberie" className="text-gray-400 hover:text-white">Plomberie</Link></li>
                <li><Link to="/services/electricite" className="text-gray-400 hover:text-white">Électricité</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <address className="text-gray-400 not-italic">
                <p>123 Avenue Mohammed V</p>
                <p>Témara, Maroc</p>
                <p>Email: alllomaalam@gmail.com</p>
                <p>Tél: +212 6 96 57 65 60</p>
              </address>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Allo-Maalam.ma - Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
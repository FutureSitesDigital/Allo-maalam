import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { StrictMode } from 'react';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PrestatairePage from './pages/PrestatairePage';
import ContactPage from './pages/ContactPage';
import ProtectedRoute from './components/ProtectedRoute'; // À créer

function App() {
  return (
    <StrictMode>
      <Router>
        <AuthProvider>
          <Navbar />
          <div className="pt-[60px]">
            <Routes>
              {/* Routes publiques */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Routes protégées */}
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/prestataire" element={<PrestatairePage />} />
                <Route path="/contact" element={<ContactPage />} />
              </Route>

              {/* Gestion des erreurs 404 */}
              <Route path="*" element={<div>404 - Page non trouvée</div>} />
            </Routes>
          </div>
        </AuthProvider>
      </Router>
    </StrictMode>
  );
}

export default App;
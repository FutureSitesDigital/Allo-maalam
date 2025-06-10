// src/App.js
import { StrictMode } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import  AuthProvider  from './context/AuthContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute'; 
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import Users from './pages/admin/Users';
import Categories from './pages/admin/Categories';
import Locations from './pages/admin/Locations';
import VerifyArtisans from './pages/admin/VerifyArtisans';
import PendingVerification from './pages/admin/PendingVerification.jsx';
import DashboardPage from './pages/DashboardPage.jsx';

function App() {
  return (
    <StrictMode>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
              element={
                <>
                  <Navbar />
                  <div className="pt-16 min-h-screen bg-gray-50">
                   
                  </div>
                </>
              }
            />
            <Route
              path="/login"
              element={
                <>
                  <Navbar />
                  <div className="pt-16 min-h-screen bg-gray-50">
                    <LoginPage />
                  </div>
                </>
              }
            />
            <Route
              path="/register"
              element={
                <>
                  <Navbar />
                  <div className="pt-16 min-h-screen bg-gray-50">
                    <RegisterPage />
                  </div>
                </>
              }
            />
            <Route path="/pending-verification" element={<PendingVerification />} />

            {/* Admin Routes */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute roles={['admin']}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<Users />} /> 
              <Route path="verify-artisans" element={<VerifyArtisans />} />
              <Route path="categories" element={<Categories />} />
              <Route path="locations" element={<Locations />} />
             
            </Route>

            {/* Artisan/Client Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute roles={['artisan', 'client']}>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            {/* 404 Page */}
            <Route path="*" element={<div>404 - Page Not Found</div>} />
          </Routes>
        </AuthProvider>
      </Router>
    </StrictMode>
  );
}

export default App;
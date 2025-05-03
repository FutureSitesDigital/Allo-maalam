// src/services/authService.js

import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour ajouter le token automatiquement
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: async (formData) => {
    try {
      const response = await api.post('/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      localStorage.setItem('token', response.data.token);

      return response.data;
    } catch (error) {
      console.error("Erreur backend:", error.response?.data);

      throw new Error(
        error.response?.data?.message ||
        Object.values(error.response?.data?.errors || {})[0]?.[0] ||
        error.response?.data?.error ||
        "Erreur lors de l'inscription"
      );
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);

      localStorage.setItem('token', response.data.token);

      return response.data;
    } catch (error) {
      console.error("Erreur backend:", error.response?.data);

      throw new Error(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Erreur lors de la connexion"
      );
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('token');
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  },

  getUser: async () => {
    try {
      const response = await api.get('/auth/user');
      return response.data;
    } catch (error) {
      throw new Error("Impossible de récupérer l'utilisateur");
    }
  }
};

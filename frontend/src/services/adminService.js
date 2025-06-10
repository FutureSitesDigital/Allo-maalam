import { api } from './authService';

export const adminService = {
  // Users
  getUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  updateUserStatus: async (userId, status) => {
    const response = await api.put(`/admin/users/${userId}/status`, { status });
    return response.data;
  },

  // Categories
  getCategories: async () => {
    const response = await api.get('/admin/categories');
    return response.data;
  },

  createCategory: async (data) => {
    const response = await api.post('/admin/categories', data);
    return response.data;
  },

  updateCategory: async (id, data) => {
    const response = await api.put(`/admin/categories/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id) => {
    await api.delete(`/admin/categories/${id}`);
  },

  // Services
  getServices: async (categoryId = null) => {
    const url = categoryId ? `/admin/services?category_id=${categoryId}` : '/admin/services';
    const response = await api.get(url);
    return response.data;
  },

  createService: async (data) => {
    const response = await api.post('/admin/services', data);
    return response.data;
  },

  deleteService: async (id) => {
    await api.delete(`/admin/services/${id}`);
  },

  // Villes
  getVilles: async () => {
    const response = await api.get('/admin/villes');
    return response.data;
  },

  createVille: async (data) => {
    const response = await api.post('/admin/villes', data);
    return response.data;
  },

  updateVille: async (id, data) => {
    const response = await api.put(`/admin/villes/${id}`, data);
    return response.data;
  },

  deleteVille: async (id) => {
    await api.delete(`/admin/villes/${id}`);
  },

  // Zones
  getZones: async (villeId = null) => {
    const url = villeId ? `/admin/zones?ville_id=${villeId}` : '/admin/zones';
    const response = await api.get(url);
    return response.data;
  },

  createZone: async (data) => {
    const response = await api.post('/admin/zones', data);
    return response.data;
  },

  updateZone: async (id, data) => {
    const response = await api.put(`/admin/zones/${id}`, data);
    return response.data;
  },

  deleteZone: async (id) => {
    await api.delete(`/admin/zones/${id}`);
  },

  // Ajoutez cette méthode
getArtisans: async () => {
    const response = await api.get('/admin/artisans');
    return response.data;
},

// Nouveaux endpoints pour la vérification des artisans
getPendingArtisansCount: async () => {
    const response = await api.get('/admin/verification/pending/count');
    return response.data;
  },
  
getPendingArtisans: async () => {
    const response = await api.get('/admin/artisans/pending');  // Changé de verification/pending à artisans/pending
    return response.data;
},
  approveArtisan: async (artisanId) => {
    const response = await api.post(`/admin/artisans/${artisanId}/approve`);
    return response.data;
},

rejectArtisan: async (artisanId, reason) => {
    const response = await api.post(`/admin/artisans/${artisanId}/reject`, { raison: reason });
    return response.data;
},
deleteArtisan: async (artisanId) => {
    const response = await api.delete(`/admin/artisans/${artisanId}`);
    return response.data;
},
}
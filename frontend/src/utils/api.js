import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Set Content-Type to application/json for non-FormData requests
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Only redirect to login if we're on a protected route
      const publicPaths = ['/', '/login', '/register', '/map', '/leaderboard'];
      const currentPath = window.location.pathname;
      
      if (!publicPaths.includes(currentPath) && !currentPath.startsWith('/listing/')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  updatePassword: (data) => api.put('/auth/password', data)
};

// Listings API
export const listingsAPI = {
  getAll: (params) => api.get('/listings', { params }),
  getOne: (id) => api.get(`/listings/${id}`),
  create: (data) => api.post('/listings', data),
  claim: (id) => api.post(`/listings/${id}/claim`),
  confirm: (id, action) => api.post(`/listings/${id}/confirm`, { action }),
  confirmClaim: (id, action) => api.post(`/listings/${id}/confirm`, { action }),
  complete: (id) => api.post(`/listings/${id}/complete`),
  updateETA: (id, eta) => api.put(`/listings/${id}/eta`, { eta }),
  getMyDonations: () => api.get('/listings/my/donations'),
  getMyClaims: () => api.get('/listings/my/claims'),
  cancel: (id) => api.delete(`/listings/${id}`),
  sendFeedback: (id, data) => api.post(`/listings/${id}/feedback`, data)
};

// Chat API
export const chatAPI = {
  getByListing: (listingId) => api.get(`/chat/listing/${listingId}`),
  getMy: () => api.get('/chat/my'),
  sendMessage: (chatId, data) => api.post(`/chat/${chatId}/message`, data),
  markAsRead: (chatId) => api.put(`/chat/${chatId}/read`)
};

// Admin API
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getVerifications: () => api.get('/admin/verifications'),
  verifyOrg: (userId) => api.put(`/admin/verify/${userId}`),
  toggleBan: (userId, reason) => api.put(`/admin/ban/${userId}`, { reason }),
  getUsers: (params) => api.get('/admin/users', { params }),
  getLeaderboard: (limit) => api.get('/admin/leaderboard', { params: { limit } }),
  exportData: (type) => api.get('/admin/export', { params: { type }, responseType: 'blob' }),
  createCheckpoint: (data) => api.post('/admin/checkpoints', data),
  getCheckpoints: (params) => api.get('/admin/checkpoints', { params }),
  updateCheckpoint: (id, data) => api.put(`/admin/checkpoints/${id}`, data),
  createReward: (data) => api.post('/admin/rewards', data),
  getRewards: (params) => api.get('/admin/rewards', { params })
};

// Notifications API
export const notificationsAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  delete: (id) => api.delete(`/notifications/${id}`)
};

// Nutrition API (Gemini AI)
export const nutritionAPI = {
  analyze: (foodItem) => api.post('/nutrition/analyze', { foodItem }),
  suggest: (dietaryNeeds) => api.post('/nutrition/suggest', { dietaryNeeds })
};

export default api;

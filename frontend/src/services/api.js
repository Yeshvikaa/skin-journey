import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://skin-journey-1.onrender.com',
  timeout: 30000,
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('sj_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('sj_token');
      localStorage.removeItem('sj_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const authAPI = {
  signup: (data) => API.post('/auth/signup', data),
  login: (data) => API.post('/auth/login', data),
  verifyOTP: (data) => API.post('/auth/verify-otp', data),
  resendOTP: (data) => API.post('/auth/resend-otp', data),
  forgotPassword: (data) => API.post('/auth/forgot-password', data),
  resetPassword: (data) => API.post('/auth/reset-password', data),
  getMe: () => API.get('/auth/me'),
};

// User
export const userAPI = {
  getProfile: () => API.get('/users/profile'),
  updateProfile: (data) => API.put('/users/profile', data),
  updateAvatar: (data) => API.put('/users/avatar', data),
  deleteAccount: () => API.delete('/users/account'),
};

// Scan
export const scanAPI = {
  analyzeIngredients: (data) => API.post('/scan/analyze-ingredients', data),
  conflictCheck: (data) => API.post('/scan/conflict-check', data),
  getHistory: () => API.get('/scan/history'),
  getReport: (id) => API.get(`/scan/report/${id}`),
};

// CareBot
export const carebotAPI = {
  chat: (data) => API.post('/carebot/chat', data),
  getHistory: () => API.get('/carebot/history'),
  buildRoutine: (data) => API.post('/carebot/build-routine', data),
  clearHistory: () => API.delete('/carebot/history'),
};

// Skin Journey
export const skinJourneyAPI = {
  getJourney: () => API.get('/skin-journey'),
  addEntry: (data) => API.post('/skin-journey/entry', data),
  getInsights: () => API.get('/skin-journey/insights'),
  getAnalytics: () => API.get('/skin-journey/analytics'),
};

// Cabinet
export const cabinetAPI = {
  getCabinet: () => API.get('/cabinet'),
  addItem: (data) => API.post('/cabinet/add', data),
  updateItem: (id, data) => API.put(`/cabinet/item/${id}`, data),
  removeItem: (id) => API.delete(`/cabinet/item/${id}`),
};

// Community
export const communityAPI = {
  getAlerts: (params) => API.get('/community/alerts', { params }),
  reportAlert: (data) => API.post('/community/report', data),
  upvoteAlert: (id) => API.post(`/community/upvote/${id}`),
};

// Notifications
export const notificationsAPI = {
  getAll: () => API.get('/notifications'),
  markRead: (id) => API.put(`/notifications/read/${id}`),
  markAllRead: () => API.put('/notifications/read-all'),
};

// Cycle Sync
export const cycleSyncAPI = {
  get: () => API.get('/cycle-sync'),
  setup: (data) => API.post('/cycle-sync/setup', data),
  getPredictions: () => API.get('/cycle-sync/predictions'),
};

// Products
export const productsAPI = {
  search: (params) => API.get('/products', { params }),
  getByBarcode: (barcode) => API.get(`/products/barcode/${barcode}`),
};

export default API;

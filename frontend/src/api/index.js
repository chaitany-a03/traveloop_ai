import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('traveloop_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('traveloop_token');
      localStorage.removeItem('traveloop_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteAccount: () => api.delete('/auth/account'),
};

// Trips
export const tripsAPI = {
  getAll: () => api.get('/trips'),
  getOne: (id) => api.get(`/trips/${id}`),
  create: (data) => api.post('/trips', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/trips/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/trips/${id}`),
  getPublic: (id) => api.get(`/trips/public/${id}`),
};

// Stops
export const stopsAPI = {
  getAll: (tripId) => api.get(`/trips/${tripId}/stops`),
  add: (tripId, data) => api.post(`/trips/${tripId}/stops`, data),
  update: (tripId, stopId, data) => api.put(`/trips/${tripId}/stops/${stopId}`, data),
  delete: (tripId, stopId) => api.delete(`/trips/${tripId}/stops/${stopId}`),
  reorder: (tripId, stops) => api.put(`/trips/${tripId}/stops/reorder`, { stops }),
};

// Activities
export const activitiesAPI = {
  getAll: (tripId, stopId) => api.get(`/trips/${tripId}/stops/${stopId}/activities`),
  add: (tripId, stopId, data) => api.post(`/trips/${tripId}/stops/${stopId}/activities`, data),
  update: (tripId, stopId, actId, data) => api.put(`/trips/${tripId}/stops/${stopId}/activities/${actId}`, data),
  delete: (tripId, stopId, actId) => api.delete(`/trips/${tripId}/stops/${stopId}/activities/${actId}`),
  search: (params) => api.get('/activities/search', { params }),
};

// Budget
export const budgetAPI = {
  get: (tripId) => api.get(`/trips/${tripId}/budget`),
  upsert: (tripId, data) => api.put(`/trips/${tripId}/budget`, data),
};

// Checklist
export const checklistAPI = {
  getAll: (tripId) => api.get(`/trips/${tripId}/checklist`),
  add: (tripId, data) => api.post(`/trips/${tripId}/checklist`, data),
  update: (tripId, itemId, data) => api.put(`/trips/${tripId}/checklist/${itemId}`, data),
  delete: (tripId, itemId) => api.delete(`/trips/${tripId}/checklist/${itemId}`),
};

// Notes
export const notesAPI = {
  getAll: (tripId) => api.get(`/trips/${tripId}/notes`),
  add: (tripId, data) => api.post(`/trips/${tripId}/notes`, data),
  update: (tripId, noteId, data) => api.put(`/trips/${tripId}/notes/${noteId}`, data),
  delete: (tripId, noteId) => api.delete(`/trips/${tripId}/notes/${noteId}`),
};

// AI Planner
export const plannerAPI = {
  generate: (data) => api.post('/planner/generate', data),
};

// Hidden Gems
export const hiddenGemsAPI = {
  getForTrip: (tripId) => api.get(`/hidden-gems/${tripId}`),
};

export default api;


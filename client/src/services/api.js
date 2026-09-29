import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  withCredentials: true,
});

// Auth
export const signup = (data) => api.post('/auth/signup', data);
export const login = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');
export const logout = () => api.post('/auth/logout');
export const generateUsername = () => api.get('/auth/generate-username');

// Resources
export const getResources = (params) => api.get('/resources', { params });
export const getResource = (id) => api.get(`/resources/${id}`);
export const createResource = (data) => api.post('/resources', data);
export const updateResource = (id, data) => api.put(`/resources/${id}`, data);
export const deleteResource = (id) => api.delete(`/resources/${id}`);

// Search
export const searchResources = (params) => api.get('/search', { params });

// Tags
export const getTags = () => api.get('/tags');
export const createTag = (name) => api.post('/tags', { name });

// Groups
export const getGroups = () => api.get('/groups');
export const createGroup = (name) => api.post('/groups', { name });
export const joinGroup = (id) => api.post(`/groups/${id}/join`);
export const getGroupResources = (id) => api.get(`/groups/${id}/resources`);
export const addResourceToGroup = (groupId, resource_id) =>
  api.post(`/groups/${groupId}/resources`, { resource_id });

// Upload
export const getSignedUrl = (filename, contentType) =>
  api.post('/upload/signed-url', { filename, contentType });

export default api;

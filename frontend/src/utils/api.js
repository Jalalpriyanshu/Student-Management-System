import axios from 'axios';

export const BASE_URL = process.env.REACT_APP_API_URL || 'https://student-management-system-svoj.onrender.com';

const API = axios.create({
  baseURL: BASE_URL,
});

// Helper for image URLs to avoid repeating the logic everywhere
export const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${BASE_URL}/${path.replace(/\\/g, '/')}`;
};

// Attach JWT token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If token expires or is invalid, redirect to login
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      // Only redirect if not already on login/register
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default API;

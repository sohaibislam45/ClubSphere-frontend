import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://clubsphere-backend.vercel.app',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Enhanced error handling for network errors
    if (!error.response) {
      // Network error - backend is not reachable
      if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
        error.message = 'Cannot connect to server. Please check if the backend is running on https://clubsphere-backend.vercel.app';
      }
    } else if (error.response?.status === 401) {
      // Handle unauthenticated - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Don't redirect if we're already on login/register page
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    } else if (error.response?.status === 403) {
      // Handle unauthorized (wrong role) - logout user
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;


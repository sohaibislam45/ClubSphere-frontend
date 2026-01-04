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
    } else {
      // If no token exists, ensure Authorization header is not set
      delete config.headers.Authorization;
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
      // Handle unauthenticated - only clear token if it's actually invalid
      // Don't clear token if error is "No token provided" - that means token wasn't sent
      const errorMessage = error.response?.data?.error || '';
      const currentPath = window.location.pathname;
      
      // Only clear token if it's invalid/expired, not if it wasn't provided
      if (errorMessage.includes('Invalid') || errorMessage.includes('expired') || errorMessage.includes('Unauthorized')) {
        if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
          const token = localStorage.getItem('token');
          if (token) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
      }
      // If error is "No token provided", don't clear anything - just let component handle it
    } else if (error.response?.status === 403) {
      // Handle unauthorized (wrong role) - don't clear token, just let component handle it
      // 403 means user is authenticated but doesn't have permission
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
        // Don't clear token on 403 - user is authenticated, just lacks permission
        // Components should handle this appropriately
      }
    }
    return Promise.reject(error);
  }
);

export default api;


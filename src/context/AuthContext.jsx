import { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        // Verify token is still valid by fetching current user
        fetchCurrentUser();
      } catch (error) {
        console.error('Error parsing stored user:', error);
        logout();
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get('/api/auth/me');
      const userData = response.data.user;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching current user:', error);
      logout();
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { token, user: userData } = response.data;
      
      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      // Redirect based on role - use window.location for reliability
      if (userData.role === 'admin') {
        window.location.href = '/dashboard/admin';
      } else if (userData.role === 'clubManager') {
        window.location.href = '/dashboard/club-manager';
      } else {
        window.location.href = '/dashboard/member';
      }

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Login failed. Please try again.'
      };
    }
  };

  const register = async (email, password, name, role = 'member') => {
    try {
      const response = await api.post('/api/auth/register', {
        email,
        password,
        name,
        role
      });
      const { token, user: userData } = response.data;
      
      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      // Redirect based on role - use window.location for reliability
      if (userData.role === 'admin') {
        window.location.href = '/dashboard/admin';
      } else if (userData.role === 'clubManager') {
        window.location.href = '/dashboard/club-manager';
      } else {
        window.location.href = '/dashboard/member';
      }

      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Registration failed. Please try again.'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  const isAuthenticated = () => {
    return !!user && !!localStorage.getItem('token');
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
    hasRole,
    fetchCurrentUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


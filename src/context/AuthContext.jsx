import { createContext, useContext, useState, useEffect } from 'react';
import { signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { auth, googleProvider } from '../firebase/firebase.init';
import api from '../lib/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleGoogleAuthResult = async (googleUser) => {
    try {
      // Get the ID token
      const idToken = await googleUser.getIdToken();
      
      // Send token to backend for verification and user creation/login
      const response = await api.post('/api/auth/google', {
        idToken,
        email: googleUser.email,
        name: googleUser.displayName,
        photoURL: googleUser.photoURL
      });
      
      const { token, user: userData } = response.data;
      
      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      // Redirect based on role
      if (userData.role === 'admin') {
        window.location.href = '/dashboard/admin';
      } else if (userData.role === 'clubManager') {
        window.location.href = '/dashboard/club-manager';
      } else {
        window.location.href = '/dashboard/member';
      }

      return { success: true };
    } catch (error) {
      console.error('Google auth result processing error:', error);
      throw error;
    }
  };

  // Check for existing token on mount and handle redirect results
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    // Check for Google OAuth redirect result
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          // User signed in via redirect, process the result
          return handleGoogleAuthResult(result.user);
        }
      })
      .catch((error) => {
        console.error('Redirect result error:', error);
      })
      .finally(() => {
        // Continue with normal token check
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
      });
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

  const loginWithGoogle = async () => {
    try {
      // Try popup first, fallback to redirect if it fails
      let result;
      try {
        result = await signInWithPopup(auth, googleProvider);
      } catch (popupError) {
        // If popup is blocked or fails due to COOP policy, use redirect
        if (popupError.code === 'auth/popup-blocked' || popupError.code === 'auth/popup-closed-by-user') {
          console.log('Popup blocked or closed, using redirect instead');
          await signInWithRedirect(auth, googleProvider);
          // Redirect will happen, so return early
          return { success: true, redirecting: true };
        }
        throw popupError;
      }
      
      // Process the popup result
      return await handleGoogleAuthResult(result.user);
    } catch (error) {
      console.error('Google login error:', error);
      
      // Better error messages
      let errorMessage = 'Google sign-in failed. Please try again.';
      
      if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Popup was blocked. Please allow popups and try again.';
      } else if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-in was cancelled.';
      } else if (error.code === 'auth/network-request-failed' || error.message?.includes('Network Error')) {
        errorMessage = 'Network error. Please check if the backend server is running on http://localhost:3000';
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    loginWithGoogle,
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


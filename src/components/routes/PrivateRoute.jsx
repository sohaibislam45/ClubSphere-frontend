import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, hasRole, loading, logout } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background-dark">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // If role is required and user doesn't have it, logout (unauthorized access)
  if (requiredRole && !hasRole(requiredRole)) {
    // Logout user for unauthorized access
    logout();
    return null;
  }

  // User is authenticated and has required role
  return children;
};

export default PrivateRoute;


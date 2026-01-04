import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../ui/Loader';
import NotFound from '../../pages/NotFound';

const PrivateRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, hasRole, loading, logout } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
        <Loader />
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // If role is required and user doesn't have it, show unauthorized access page
  if (requiredRole && !hasRole(requiredRole)) {
    // Logout user for unauthorized access
    logout();
    return <NotFound errorType="unauthorized" />;
  }

  // User is authenticated and has required role
  return children;
};

export default PrivateRoute;


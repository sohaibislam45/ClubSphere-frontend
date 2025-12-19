import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Clubs from '../pages/Clubs';
import ClubDetails from '../pages/ClubDetails';
import Events from '../pages/Events';
import EventDetails from '../pages/EventDetails';
import Login from '../pages/Login';
import Register from '../pages/Register';
import AdminDashboard from '../pages/AdminDashboard';
import AdminManageUsers from '../pages/AdminManageUsers';
import AdminManageClubs from '../pages/AdminManageClubs';
import AdminManageEvents from '../pages/AdminManageEvents';
import AdminViewFinances from '../pages/AdminViewFinances';
import ClubManagerDashboard from '../pages/ClubManagerDashboard';
import MemberDashboard from '../pages/MemberDashboard';
import PrivateRoute from '../components/routes/PrivateRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/clubs" element={<Clubs />} />
      <Route path="/clubs/:id" element={<ClubDetails />} />
      <Route path="/events" element={<Events />} />
      <Route path="/events/:id" element={<EventDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route 
        path="/dashboard/admin" 
        element={
          <PrivateRoute requiredRole="admin">
            <AdminDashboard />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/dashboard/admin/users" 
        element={
          <PrivateRoute requiredRole="admin">
            <AdminManageUsers />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/dashboard/admin/clubs" 
        element={
          <PrivateRoute requiredRole="admin">
            <AdminManageClubs />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/dashboard/admin/events" 
        element={
          <PrivateRoute requiredRole="admin">
            <AdminManageEvents />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/dashboard/admin/finances" 
        element={
          <PrivateRoute requiredRole="admin">
            <AdminViewFinances />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/dashboard/club-manager" 
        element={
          <PrivateRoute requiredRole="clubManager">
            <ClubManagerDashboard />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/dashboard/member" 
        element={
          <PrivateRoute requiredRole="member">
            <MemberDashboard />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default AppRoutes;


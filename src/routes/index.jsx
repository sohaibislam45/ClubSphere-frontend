import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Clubs from '../pages/Clubs';
import ClubDetails from '../pages/ClubDetails';
import Events from '../pages/Events';
import EventDetails from '../pages/EventDetails';
import EventCheckout from '../pages/EventCheckout';
import ClubCheckout from '../pages/ClubCheckout';
import ClubPaymentSuccess from '../pages/ClubPaymentSuccess';
import ClubPaymentCancel from '../pages/ClubPaymentCancel';
import PaymentSuccess from '../pages/PaymentSuccess';
import PaymentCancel from '../pages/PaymentCancel';
import Login from '../pages/Login';
import Register from '../pages/Register';
import AdminDashboard from '../pages/AdminDashboard';
import AdminManageUsers from '../pages/AdminManageUsers';
import AdminManageClubs from '../pages/AdminManageClubs';
import AdminManageEvents from '../pages/AdminManageEvents';
import AdminViewFinances from '../pages/AdminViewFinances';
import AdminManageCategories from '../pages/AdminManageCategories';
import ClubManagerDashboard from '../pages/ClubManagerDashboard';
import ManagerMyClubs from '../pages/ManagerMyClubs';
import ManagerClubMembers from '../pages/ManagerClubMembers';
import ManagerEventsManagement from '../pages/ManagerEventsManagement';
import ManagerEventRegistrations from '../pages/ManagerEventRegistrations';
import MemberDashboard from '../pages/MemberDashboard';
import MemberDiscover from '../pages/MemberDiscover';
import MemberMyClubs from '../pages/MemberMyClubs';
import MemberMyEvents from '../pages/MemberMyEvents';
import MemberPaymentHistory from '../pages/MemberPaymentHistory';
import MemberSettings from '../pages/MemberSettings';
import NotFound from '../pages/NotFound';
import PrivateRoute from '../components/routes/PrivateRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/clubs" element={<Clubs />} />
      <Route path="/clubs/:id" element={<ClubDetails />} />
      <Route 
        path="/clubs/:id/checkout" 
        element={
          <PrivateRoute>
            <ClubCheckout />
          </PrivateRoute>
        } 
      />
      <Route path="/events" element={<Events />} />
      <Route path="/events/:id" element={<EventDetails />} />
      <Route 
        path="/events/:id/checkout" 
        element={
          <PrivateRoute>
            <EventCheckout />
          </PrivateRoute>
        } 
      />
      <Route path="/payment/success" element={<PaymentSuccess />} />
      <Route path="/payment/cancel" element={<PaymentCancel />} />
      <Route path="/payment/club/success" element={<ClubPaymentSuccess />} />
      <Route path="/payment/club/cancel" element={<ClubPaymentCancel />} />
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
        path="/dashboard/admin/categories" 
        element={
          <PrivateRoute requiredRole="admin">
            <AdminManageCategories />
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
        path="/dashboard/club-manager/clubs" 
        element={
          <PrivateRoute requiredRole="clubManager">
            <ManagerMyClubs />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/dashboard/club-manager/events" 
        element={
          <PrivateRoute requiredRole="clubManager">
            <ManagerEventsManagement />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/dashboard/club-manager/members" 
        element={
          <PrivateRoute requiredRole="clubManager">
            <ManagerClubMembers />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/dashboard/club-manager/event-registrations" 
        element={
          <PrivateRoute requiredRole="clubManager">
            <ManagerEventRegistrations />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/dashboard/club-manager/clubs/:clubId/members" 
        element={
          <PrivateRoute requiredRole="clubManager">
            <ManagerClubMembers />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/dashboard/club-manager/events/:eventId/registrations" 
        element={
          <PrivateRoute requiredRole="clubManager">
            <ManagerEventRegistrations />
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
      <Route 
        path="/dashboard/member/discover" 
        element={
          <PrivateRoute requiredRole="member">
            <MemberDiscover />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/dashboard/member/clubs" 
        element={
          <PrivateRoute requiredRole="member">
            <MemberMyClubs />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/dashboard/member/events" 
        element={
          <PrivateRoute requiredRole="member">
            <MemberMyEvents />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/dashboard/member/payments" 
        element={
          <PrivateRoute requiredRole="member">
            <MemberPaymentHistory />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/dashboard/member/settings" 
        element={
          <PrivateRoute requiredRole="member">
            <MemberSettings />
          </PrivateRoute>
        } 
      />
      {/* Catch-all route for 404 pages */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;


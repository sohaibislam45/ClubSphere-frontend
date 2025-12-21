import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MemberSidebar from '../components/layout/MemberSidebar';
import Loader from '../components/ui/Loader';
import api from '../lib/api';
import Swal from '../lib/sweetalertConfig';

const MemberMyEvents = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    document.title = 'My Events - ClubSphere';
  }, []);
  const [activeTab, setActiveTab] = useState('my-joining');
  const [search, setSearch] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['myEvents', activeTab, search],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('tab', activeTab);
      if (search) params.append('search', search);
      
      const response = await api.get(`/api/member/events?${params.toString()}`);
      return response.data;
    }
  });

  const events = data?.events || [];
  const counts = data?.counts || { 'my-joining': 0, upcoming: 0, joined: 0, cancelled: 0 };

  const getStatusBadgeClass = (statusColor) => {
    switch (statusColor) {
      case 'primary':
        return 'bg-primary/20 text-primary border border-primary/20';
      case 'yellow':
        return 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/20';
      case 'blue':
        return 'bg-blue-500/20 text-blue-400 border border-blue-500/20';
      case 'red':
        return 'bg-red-500/20 text-red-400 border border-red-500/20';
      default:
        return 'bg-primary/20 text-primary border border-primary/20';
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  // Cancel registration mutation
  const cancelRegistrationMutation = useMutation({
    mutationFn: async (registrationId) => {
      const response = await api.delete(`/api/member/events/${registrationId}/cancel`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['myEvents']);
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Registration cancelled successfully',
        timer: 2000,
        showConfirmButton: false
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.error || 'Failed to cancel registration'
      });
    }
  });

  const handleCancelRegistration = async (event, registrationId) => {
    event.stopPropagation();
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Cancel Registration?',
      text: 'Are you sure you want to cancel your registration? This action cannot be undone.',
      showCancelButton: true,
      confirmButtonText: 'Yes, Cancel',
      cancelButtonText: 'No, Keep It',
      confirmButtonColor: '#ef4444'
    });

    if (result.isConfirmed) {
      cancelRegistrationMutation.mutate(registrationId);
    }
  };

  const handleViewTicket = (e, eventData) => {
    e.stopPropagation();
    setSelectedEvent(eventData);
    setIsTicketModalOpen(true);
  };

  const closeTicketModal = () => {
    setIsTicketModalOpen(false);
    setSelectedEvent(null);
  };

  // Generate ticket ID from registration ID or event ID
  const generateTicketId = (event) => {
    const id = event.id || event.eventId || '';
    // Format as TKT-XXXX-XXXX
    if (id.length >= 8) {
      return `TKT-${id.substring(0, 4).toUpperCase()}-${id.substring(4, 8).toUpperCase()}`;
    }
    return `TKT-${id.substring(0, 8).toUpperCase().padEnd(8, '0')}`;
  };

  const handleViewDetails = (event, eventId) => {
    event.stopPropagation();
    navigate(`/events/${eventId}`);
  };

  const handleManageWaitlist = (event, eventId) => {
    event.stopPropagation();
    navigate(`/events/${eventId}`);
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display antialiased overflow-hidden h-screen flex">
      <MemberSidebar />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-background-dark relative">
        {/* Top Gradient Accents */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 scroll-smooth">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <Loader />
            </div>
          ) : (
          <div className="max-w-6xl mx-auto flex flex-col gap-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 z-10 relative">
              <div className="flex flex-col gap-2">
                <h1 className="text-white text-4xl font-bold leading-tight tracking-tight">My Events</h1>
                <p className="text-gray-400 text-base max-w-xl">
                  Track your upcoming schedule, manage registrations, and view your event history.
                </p>
              </div>
              <Link 
                to="/dashboard/member/discover"
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-background-dark px-6 py-3 rounded-full font-bold transition-transform active:scale-95 shadow-lg shadow-primary/20"
              >
                <span className="material-symbols-outlined">explore</span>
                Browse Events
              </Link>
            </div>

            {/* Controls: Search & Tabs */}
            <div className="flex flex-col gap-6 z-10 relative">
              {/* Search Bar */}
              <div className="relative w-full md:max-w-md">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
                  <span className="material-symbols-outlined">search</span>
                </div>
                <input
                  className="w-full bg-surface-dark border-transparent focus:border-primary/50 focus:ring-0 text-white rounded-full py-3 pl-12 pr-4 placeholder-gray-500 font-medium transition-all"
                  placeholder="Search by event name, club, or location..."
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              
              {/* Tabs */}
              <div className="border-b border-white/10 w-full">
                <nav aria-label="Tabs" className="flex gap-8 overflow-x-auto no-scrollbar">
                  <button
                    onClick={() => setActiveTab('my-joining')}
                    className={`whitespace-nowrap pb-4 border-b-2 text-sm tracking-wide transition-colors ${
                      activeTab === 'my-joining'
                        ? 'border-primary text-white font-bold'
                        : 'border-transparent text-gray-400 hover:text-white font-medium hover:border-white/20'
                    }`}
                  >
                    Registered Events
                    <span className={`ml-2 text-xs py-0.5 px-2 rounded-full font-bold ${
                      activeTab === 'my-joining'
                        ? 'bg-primary text-background-dark'
                        : 'bg-surface-dark border border-white/10 text-gray-400'
                    }`}>
                      {counts['my-joining'] || 0}
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab('upcoming')}
                    className={`whitespace-nowrap pb-4 border-b-2 text-sm tracking-wide transition-colors ${
                      activeTab === 'upcoming'
                        ? 'border-primary text-white font-bold'
                        : 'border-transparent text-gray-400 hover:text-white font-medium hover:border-white/20'
                    }`}
                  >
                    Upcoming
                    <span className={`ml-2 text-xs py-0.5 px-2 rounded-full font-bold ${
                      activeTab === 'upcoming'
                        ? 'bg-primary text-background-dark'
                        : 'bg-surface-dark border border-white/10 text-gray-400'
                    }`}>
                      {counts.upcoming || 0}
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab('joined')}
                    className={`whitespace-nowrap pb-4 border-b-2 text-sm tracking-wide transition-colors ${
                      activeTab === 'joined'
                        ? 'border-primary text-white font-bold'
                        : 'border-transparent text-gray-400 hover:text-white font-medium hover:border-white/20'
                    }`}
                  >
                    Event History
                    <span className={`ml-2 text-xs py-0.5 px-2 rounded-full font-bold ${
                      activeTab === 'joined'
                        ? 'bg-primary text-background-dark'
                        : 'bg-surface-dark border border-white/10 text-gray-400'
                    }`}>
                      {counts.joined || 0}
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab('cancelled')}
                    className={`whitespace-nowrap pb-4 border-b-2 text-sm tracking-wide transition-colors ${
                      activeTab === 'cancelled'
                        ? 'border-primary text-white font-bold'
                        : 'border-transparent text-gray-400 hover:text-white font-medium hover:border-white/20'
                    }`}
                  >
                    Cancelled Events
                    <span className={`ml-2 text-xs py-0.5 px-2 rounded-full font-bold ${
                      activeTab === 'cancelled'
                        ? 'bg-primary text-background-dark'
                        : 'bg-surface-dark border border-white/10 text-gray-400'
                    }`}>
                      {counts.cancelled || 0}
                    </span>
                  </button>
                </nav>
              </div>
            </div>

            {/* Events Table */}
            {error ? (
              <div className="text-center py-20">
                <p className="text-red-400 mb-4">Error loading events</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="text-primary hover:underline"
                >
                  Try again
                </button>
              </div>
            ) : events.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-surface-dark overflow-hidden shadow-xl z-10 relative p-20 text-center">
                <div className="bg-surface-dark p-6 rounded-full mb-4 inline-block">
                  <span className="material-symbols-outlined text-6xl text-gray-600">event_busy</span>
                </div>
                <h3 className="text-xl font-bold text-white">
                  {activeTab === 'my-joining' ? 'No registered events' : 
                   activeTab === 'upcoming' ? 'No upcoming events' :
                   activeTab === 'joined' ? 'No event history' :
                   'No cancelled events'}
                </h3>
                <p className="text-gray-400 mt-2 mb-6">
                  {activeTab === 'my-joining' ? "You haven't registered for any upcoming events yet." :
                   activeTab === 'upcoming' ? "You don't have any upcoming events." :
                   activeTab === 'joined' ? "You haven't attended any past events yet." :
                   "You don't have any cancelled event registrations."}
                </p>
                <Link 
                  to="/dashboard/member/discover"
                  className="text-primary font-bold hover:underline"
                >
                  Explore Local Clubs
                </Link>
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-surface-dark overflow-hidden shadow-xl z-10 relative">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/10 text-gray-400 text-xs uppercase tracking-wider font-semibold">
                        <th className="px-6 py-4 w-[35%]">Event Details</th>
                        <th className="px-6 py-4">Date & Time</th>
                        <th className="px-6 py-4">Location</th>
                        <th className="px-6 py-4 text-center">Status</th>
                        <th className="px-6 py-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {events.map((event) => (
                        <tr 
                          key={event.id} 
                          className="group hover:bg-white/5 transition-colors cursor-pointer"
                          onClick={() => navigate(`/events/${event.eventId || event.id}`)}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div
                                className="h-12 w-12 rounded-xl bg-cover bg-center flex-shrink-0 bg-gray-700"
                                style={{ backgroundImage: `url("${event.image || 'https://via.placeholder.com/100'}")` }}
                              ></div>
                              <div className="flex flex-col">
                                <span className="text-white font-bold text-base group-hover:text-primary transition-colors">
                                  {event.name}
                                </span>
                                <span className="text-gray-400 text-sm">{event.clubName}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-white text-sm font-medium">{event.dateFormatted}</span>
                              <span className="text-gray-500 text-xs">{event.time}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-gray-300 text-sm">
                              <span className="material-symbols-outlined text-base text-gray-500">
                                {event.location?.includes('Trail') || event.location?.includes('Park') ? 'landscape' : 'location_on'}
                              </span>
                              {event.location}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold ${getStatusBadgeClass(event.statusColor)}`}>
                              {event.statusLabel}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            {event.status === 'cancelled' ? (
                              <button 
                                onClick={(e) => handleViewDetails(e, event.eventId || event.id)}
                                className="text-white hover:text-red-400 text-sm font-semibold transition-colors"
                              >
                                View Details
                              </button>
                            ) : event.statusColor === 'blue' ? (
                              <button 
                                onClick={(e) => handleCancelRegistration(e, event.id)}
                                className="text-white hover:text-red-400 text-sm font-semibold transition-colors"
                                disabled={cancelRegistrationMutation.isLoading}
                              >
                                {cancelRegistrationMutation.isLoading ? 'Cancelling...' : 'Cancel Request'}
                              </button>
                            ) : event.status === 'waitlisted' ? (
                              <button 
                                onClick={(e) => handleManageWaitlist(e, event.eventId || event.id)}
                                className="text-white hover:text-primary text-sm font-semibold transition-colors"
                              >
                                Manage
                              </button>
                            ) : (
                              <button 
                                onClick={(e) => handleViewTicket(e, event)}
                                className="text-white hover:text-primary text-sm font-semibold transition-colors"
                              >
                                View Ticket
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Pagination */}
                <div className="px-6 py-4 border-t border-white/10 flex justify-between items-center text-sm text-gray-400">
                  <span>Showing {events.length} of {events.length} events</span>
                  <div className="flex gap-2">
                    <button className="p-1 rounded-full hover:bg-white/10 disabled:opacity-50" disabled>
                      <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <button className="p-1 rounded-full hover:bg-white/10 disabled:opacity-50" disabled>
                      <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          )}
        </div>
      </main>

      {/* Ticket Modal */}
      {isTicketModalOpen && selectedEvent && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={closeTicketModal}
        >
          <div 
            className="relative bg-white dark:bg-surface-dark rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeTicketModal}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>

            {/* Ticket Content */}
            <div className="p-8">
              {/* Ticket Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <span className="material-symbols-outlined text-4xl text-primary">confirmation_number</span>
                </div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Event Ticket</h2>
                <p className="text-gray-500 dark:text-gray-400">Present this ticket at the event</p>
              </div>

              {/* Ticket Design */}
              <div className="relative bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 rounded-2xl border-2 border-primary/20 p-8 mb-6">
                {/* Perforated Edge Effect */}
                <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col items-center justify-center gap-2">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                  ))}
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-8 flex flex-col items-center justify-center gap-2">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                  ))}
                </div>

                {/* Ticket Content */}
                <div className="pl-4 pr-4">
                  {/* Event Image */}
                  {selectedEvent.image && (
                    <div className="w-full h-48 rounded-xl overflow-hidden mb-6 bg-gray-200 dark:bg-gray-800">
                      <img 
                        src={selectedEvent.image} 
                        alt={selectedEvent.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Event Name */}
                  <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
                    {selectedEvent.name}
                  </h3>
                  
                  {/* Club Name */}
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                    {selectedEvent.clubName}
                  </p>

                  {/* Ticket Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Ticket ID */}
                    <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-primary text-xl">tag</span>
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ticket ID</span>
                      </div>
                      <p className="text-lg font-black text-gray-900 dark:text-white font-mono">
                        {generateTicketId(selectedEvent)}
                      </p>
                    </div>

                    {/* User Name */}
                    <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-primary text-xl">person</span>
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Attendee</span>
                      </div>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {user?.name || 'Guest'}
                      </p>
                    </div>

                    {/* Event Date & Time */}
                    <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-primary text-xl">schedule</span>
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date & Time</span>
                      </div>
                      <p className="text-base font-bold text-gray-900 dark:text-white mb-1">
                        {selectedEvent.dateFormatted}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedEvent.time}
                      </p>
                    </div>

                    {/* Location */}
                    <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-primary text-xl">location_on</span>
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Location</span>
                      </div>
                      <p className="text-base font-bold text-gray-900 dark:text-white">
                        {selectedEvent.location || 'TBD'}
                      </p>
                    </div>
                  </div>

                  {/* QR Code Placeholder */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center">
                    <div className="w-48 h-48 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-4">
                      <div className="text-center">
                        <span className="material-symbols-outlined text-6xl text-gray-400 dark:text-gray-500 mb-2">qr_code_2</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">QR Code</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      Scan this code at the event entrance
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    // Print ticket
                    window.print();
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-background-dark px-6 py-3 rounded-xl font-bold transition-colors"
                >
                  <span className="material-symbols-outlined">print</span>
                  Print Ticket
                </button>
                <button
                  onClick={() => {
                    // Download as image (placeholder)
                    closeTicketModal();
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white px-6 py-3 rounded-xl font-bold transition-colors"
                >
                  <span className="material-symbols-outlined">download</span>
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberMyEvents;


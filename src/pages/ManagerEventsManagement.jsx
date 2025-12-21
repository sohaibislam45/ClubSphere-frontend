import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import ManagerSidebar from '../components/layout/ManagerSidebar';
import Loader from '../components/ui/Loader';

const ManagerEventsManagement = () => {
  const { user, logout } = useAuth();

  useEffect(() => {
    document.title = 'Events Management - Club Manager - ClubSphere';
  }, []);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const clubIdFromQuery = searchParams.get('clubId');
  
  const [filter, setFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    time: '',
    location: '',
    maxAttendees: '',
    price: '',
    isPaid: false,
    clubId: clubIdFromQuery || ''
  });

  const queryClient = useQueryClient();

  // Fetch events
  const { data: eventsData, isLoading } = useQuery({
    queryKey: ['managerEvents', filter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filter !== 'all') params.append('filter', filter);
      const response = await api.get(`/api/manager/events?${params.toString()}`);
      return response.data;
    }
  });

  // Fetch clubs for selector
  const { data: clubsData } = useQuery({
    queryKey: ['managerClubs'],
    queryFn: async () => {
      const response = await api.get('/api/manager/clubs');
      return response.data;
    }
  });

  const events = eventsData?.events || [];
  const stats = eventsData?.stats || { total: 0, upcoming: 0, revenue: 0 };
  const clubs = clubsData?.clubs || [];

  // Create event mutation
  const createMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/api/manager/events', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['managerEvents']);
      setShowCreateModal(false);
      setFormData({
        name: '',
        description: '',
        date: '',
        time: '',
        location: '',
        maxAttendees: '',
        price: '',
        isPaid: false,
        clubId: clubIdFromQuery || ''
      });
    }
  });

  // Delete event mutation
  const deleteMutation = useMutation({
    mutationFn: async (eventId) => {
      const response = await api.delete(`/api/manager/events/${eventId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['managerEvents']);
      setShowDeleteModal(false);
      setSelectedEventId(null);
    }
  });

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
  };

  const formatCurrency = (amount) => {
    if (!amount || amount === 0) return 'Free';
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  const getAttendancePercentage = (current, max) => {
    if (!max || max === 0) return 0;
    return Math.round((current / max) * 100);
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    const eventData = {
      ...formData,
      price: formData.isPaid ? parseFloat(formData.price) : 0,
      maxAttendees: parseInt(formData.maxAttendees) || 0
    };
    createMutation.mutate(eventData);
  };

  const handleDeleteEvent = () => {
    if (selectedEventId) {
      deleteMutation.mutate(selectedEventId);
    }
  };

  const handleEditEvent = (eventId) => {
    // TODO: Implement edit functionality
    console.log('Edit event:', eventId);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white antialiased">
      {/* Sidebar */}
      <ManagerSidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 lg:hidden">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">spa</span>
            <span className="text-lg font-bold">ClubMgr</span>
          </div>
          <button className="rounded-full bg-surface-dark p-2 text-white">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
        <div className="flex-1 w-full max-w-[1440px] mx-auto px-6 py-8 relative overflow-y-auto">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight mb-2">Events</h1>
            <p className="text-[#9eb7a8]">Manage your club's schedule, ticket sales, and attendance.</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-[#0a2012] px-6 py-3 rounded-full font-bold transition-all transform hover:scale-105 shadow-lg shadow-primary/20 group"
          >
            <span className="material-symbols-outlined">add</span>
            <span>Create New Event</span>
          </button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-surface-dark border border-[#29382f] rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-8xl text-white">event</span>
            </div>
            <div>
              <p className="text-[#9eb7a8] text-sm font-medium mb-1">Total Events Hosted</p>
              <h3 className="text-3xl font-bold text-white">{stats.total || 0}</h3>
            </div>
            <div className="mt-4 flex items-center gap-1 text-primary text-sm font-medium">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span>+12% this month</span>
            </div>
          </div>
          <div className="bg-surface-dark border border-[#29382f] rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-8xl text-white">upcoming</span>
            </div>
            <div>
              <p className="text-[#9eb7a8] text-sm font-medium mb-1">Upcoming Events</p>
              <h3 className="text-3xl font-bold text-white">{stats.upcoming || 0}</h3>
            </div>
            <div className="mt-4 flex items-center gap-1 text-primary text-sm font-medium">
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
              <span>Next: Friday Mixer</span>
            </div>
          </div>
          <div className="bg-surface-dark border border-[#29382f] rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-8xl text-white">payments</span>
            </div>
            <div>
              <p className="text-[#9eb7a8] text-sm font-medium mb-1">Total Revenue</p>
              <h3 className="text-3xl font-bold text-white">{formatCurrency(stats.revenue || 0)}</h3>
            </div>
            <div className="mt-4 flex items-center gap-1 text-orange-500 text-sm font-medium">
              <span className="material-symbols-outlined text-sm">trending_down</span>
              <span>-5% vs last month</span>
            </div>
          </div>
        </div>

        {/* Filters & Tools */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 bg-surface-dark/50 p-2 rounded-2xl border border-[#29382f]">
          <div className="flex items-center gap-1 p-1">
            {['all', 'upcoming', 'past', 'drafts'].map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  filter === filterType
                    ? 'bg-primary text-[#0a2012] font-bold shadow-sm'
                    : 'text-[#9eb7a8] hover:bg-[#29382f] hover:text-white'
                }`}
              >
                {filterType === 'all' ? 'All Events' : filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto px-2">
            <div className="flex items-center gap-2 text-[#9eb7a8] border-r border-[#29382f] pr-4">
              <span className="material-symbols-outlined text-sm">filter_list</span>
              <span className="text-sm font-medium cursor-pointer">Filter</span>
            </div>
            <div className="flex items-center gap-2 text-[#9eb7a8]">
              <span className="material-symbols-outlined text-sm">sort</span>
              <span className="text-sm font-medium cursor-pointer">Sort by Date</span>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-20">
            {events.map((event) => {
              const isPast = event.status === 'past';
              const attendancePercentage = getAttendancePercentage(event.currentAttendees, event.maxAttendees);
              
              return (
                <div
                  key={event.id}
                  className={`group bg-surface-dark border border-[#29382f] hover:border-primary/50 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 ${isPast ? 'opacity-75 hover:opacity-100' : ''}`}
                >
                  {/* Image */}
                  <div className="h-48 bg-cover bg-center relative">
                    {event.image ? (
                      <div
                        className="h-full w-full bg-cover bg-center"
                        style={{ backgroundImage: `url("${event.image}")` }}
                      ></div>
                    ) : (
                      <div className="h-full w-full bg-primary/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-6xl text-primary/50">event</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-dark to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      <span className={`${isPast ? 'bg-[#29382f]' : 'bg-primary/90'} backdrop-blur ${isPast ? 'text-white' : 'text-[#0a2012]'} text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider`}>
                        {isPast ? 'Past' : 'Upcoming'}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <button className="size-8 rounded-full bg-black/40 backdrop-blur hover:bg-white text-white hover:text-black flex items-center justify-center transition-colors">
                        <span className="material-symbols-outlined text-lg">more_horiz</span>
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className={`text-xl font-bold group-hover:text-primary transition-colors ${isPast ? 'text-[#9eb7a8]' : 'text-white'}`}>
                        {event.name}
                      </h3>
                      <span className={`flex items-center font-bold px-2 py-1 rounded-lg text-sm ${event.price > 0 ? 'text-primary bg-primary/10' : 'text-white bg-white/10'}`}>
                        {formatCurrency(event.price)}
                      </span>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className={`flex items-center gap-2 text-sm ${isPast ? 'text-[#5c6b62]' : 'text-[#9eb7a8]'}`}>
                        <span className="material-symbols-outlined text-base">calendar_today</span>
                        <span>{formatDate(event.date)} • {event.time}</span>
                      </div>
                      <div className={`flex items-center gap-2 text-sm ${isPast ? 'text-[#5c6b62]' : 'text-[#9eb7a8]'}`}>
                        <span className="material-symbols-outlined text-base">location_on</span>
                        <span>{event.location || 'Location TBD'}</span>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-[#29382f]">
                      <div className="flex justify-between items-end mb-1">
                        <span className={`text-xs font-medium ${isPast ? 'text-[#5c6b62]' : 'text-[#9eb7a8]'}`}>
                          {isPast ? 'Final Attendance' : 'Attendance'}
                        </span>
                        <span className={`text-xs font-bold ${isPast ? 'text-[#9eb7a8]' : 'text-white'}`}>
                          {event.currentAttendees} / {event.maxAttendees || '∞'}
                        </span>
                      </div>
                      <div className="w-full bg-[#29382f] rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${isPast ? 'bg-[#5c6b62]' : 'bg-primary'}`}
                          style={{ width: `${attendancePercentage}%` }}
                        ></div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        {isPast ? (
                          <button
                            onClick={() => navigate(`/dashboard/club-manager/events/${event.id}/registrations`)}
                            className="flex-1 py-2 rounded-xl bg-[#29382f] hover:bg-[#35483d] text-[#9eb7a8] hover:text-white text-sm font-medium transition-colors"
                          >
                            View Details
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditEvent(event.id)}
                              className="flex-1 py-2 rounded-xl bg-[#29382f] hover:bg-[#35483d] text-white text-sm font-medium transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                setSelectedEventId(event.id);
                                setShowDeleteModal(true);
                              }}
                              className="flex-1 py-2 rounded-xl bg-[#29382f] hover:bg-red-500/20 hover:text-red-400 text-[#9eb7a8] text-sm font-medium transition-colors"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Create Event Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
              onClick={() => setShowCreateModal(false)}
            ></div>
            {/* Drawer Panel */}
            <div className="relative w-full max-w-md h-full bg-surface-dark border-l border-[#29382f] shadow-2xl flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-[#29382f]">
                <h2 className="text-xl font-bold text-white">Create New Event</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-[#9eb7a8] hover:text-white transition-colors rounded-full p-1 hover:bg-[#29382f]"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              {/* Scrollable Content */}
              <form onSubmit={handleCreateEvent} className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Club Selector */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#9eb7a8]">Club</label>
                  <select
                    required
                    className="w-full bg-[#122017] border border-[#29382f] rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                    value={formData.clubId}
                    onChange={(e) => setFormData({ ...formData, clubId: e.target.value })}
                  >
                    <option value="">Select a club</option>
                    {clubs.map((club) => (
                      <option key={club.id} value={club.id}>
                        {club.name}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Title */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#9eb7a8]">Event Title</label>
                  <input
                    required
                    className="w-full bg-[#122017] border border-[#29382f] rounded-xl px-4 py-3 text-white placeholder-[#5c6b62] focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                    placeholder="e.g. Summer Music Festival"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                {/* Description */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#9eb7a8]">Description</label>
                  <textarea
                    className="w-full bg-[#122017] border border-[#29382f] rounded-xl px-4 py-3 text-white placeholder-[#5c6b62] focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none"
                    placeholder="Describe your event..."
                    rows="4"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  ></textarea>
                </div>
                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#9eb7a8]">Date</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-3 text-[#5c6b62] text-lg">calendar_today</span>
                      <input
                        required
                        className="w-full bg-[#122017] border border-[#29382f] rounded-xl pl-10 pr-4 py-3 text-white focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#9eb7a8]">Time</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-3 text-[#5c6b62] text-lg">schedule</span>
                      <input
                        required
                        className="w-full bg-[#122017] border border-[#29382f] rounded-xl pl-10 pr-4 py-3 text-white focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                {/* Location */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#9eb7a8]">Location</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-3 text-[#5c6b62] text-lg">location_on</span>
                    <input
                      className="w-full bg-[#122017] border border-[#29382f] rounded-xl pl-10 pr-4 py-3 text-white placeholder-[#5c6b62] focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                      placeholder="Venue name or address"
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                </div>
                {/* Max Attendees */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#9eb7a8]">Max Attendees</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-3 text-[#5c6b62] text-lg">group</span>
                    <input
                      className="w-full bg-[#122017] border border-[#29382f] rounded-xl pl-10 pr-4 py-3 text-white placeholder-[#5c6b62] focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                      placeholder="0"
                      type="number"
                      min="0"
                      value={formData.maxAttendees}
                      onChange={(e) => setFormData({ ...formData, maxAttendees: e.target.value })}
                    />
                  </div>
                </div>
                {/* Ticket Type */}
                <div className="p-4 rounded-xl bg-[#122017] border border-[#29382f] space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white">Paid Event</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={formData.isPaid}
                        onChange={(e) => setFormData({ ...formData, isPaid: e.target.checked })}
                      />
                      <div className="w-11 h-6 bg-[#29382f] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  {/* Fee Input (Conditional) */}
                  {formData.isPaid && (
                    <div>
                      <label className="text-xs font-medium text-[#9eb7a8] mb-1 block">Ticket Price</label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-3 text-[#5c6b62] text-lg">attach_money</span>
                        <input
                          required={formData.isPaid}
                          className="w-full bg-surface-dark border border-[#29382f] rounded-xl pl-10 pr-4 py-3 text-white focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        />
                      </div>
                    </div>
                  )}
                </div>
                {/* Footer Actions */}
                <div className="p-6 border-t border-[#29382f] bg-surface-dark flex gap-3 -mx-6 -mb-6">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-3 rounded-xl border border-[#29382f] text-white font-bold hover:bg-[#29382f] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isLoading}
                    className="flex-1 px-4 py-3 rounded-xl bg-primary text-[#0a2012] font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {createMutation.isLoading && (
                      <div className="w-5 h-5 border-2 border-[#0a2012] border-t-transparent rounded-full animate-spin"></div>
                    )}
                    {createMutation.isLoading ? 'Saving...' : 'Save Event'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)}></div>
            <div className="relative bg-surface-dark border border-[#29382f] w-full max-w-sm rounded-2xl p-6 shadow-2xl flex flex-col items-center text-center">
              <div className="size-12 rounded-full bg-red-500/20 flex items-center justify-center mb-4 text-red-500">
                <span className="material-symbols-outlined text-2xl">warning</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Delete Event?</h3>
              <p className="text-[#9eb7a8] text-sm mb-6">Are you sure you want to delete this event? This action cannot be undone and all data will be lost.</p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-3 rounded-xl bg-[#29382f] text-white font-medium hover:bg-[#35483d] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteEvent}
                  disabled={deleteMutation.isLoading}
                  className="flex-1 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deleteMutation.isLoading && (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {deleteMutation.isLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
      </main>
    </div>
  );
};

export default ManagerEventsManagement;


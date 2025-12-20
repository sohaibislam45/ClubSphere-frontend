import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import Swal from 'sweetalert2';
import Loader from '../components/ui/Loader';

const AdminManageEvents = () => {
  const { user, logout } = useAuth();

  useEffect(() => {
    document.title = 'Manage Events - Admin - ClubSphere';
  }, []);
  const location = useLocation();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('any');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const limit = 5;

  // Fetch events stats
  const { data: statsData } = useQuery({
    queryKey: ['admin-events-stats'],
    queryFn: async () => {
      const response = await api.get('/api/admin/events/stats');
      return response.data;
    }
  });

  // Fetch events
  const { data, isLoading } = useQuery({
    queryKey: ['admin-events', page, search, statusFilter, typeFilter],
    queryFn: async () => {
      const response = await api.get('/api/admin/events', {
        params: { page, limit, search, status: statusFilter, type: typeFilter }
      });
      return response.data;
    }
  });

  // Delete event mutation
  const deleteEventMutation = useMutation({
    mutationFn: async (eventId) => {
      await api.delete(`/api/admin/events/${eventId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-events']);
      queryClient.invalidateQueries(['admin-events-stats']);
      Swal.fire({
        icon: 'success',
        title: 'Event Deleted',
        text: 'Event has been deleted successfully',
        timer: 2000,
        showConfirmButton: false
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.error || 'Failed to delete event'
      });
    }
  });

  // Create event mutation
  const createEventMutation = useMutation({
    mutationFn: async (eventData) => {
      const response = await api.post('/api/admin/events', eventData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-events']);
      queryClient.invalidateQueries(['admin-events-stats']);
      setIsAddEventModalOpen(false);
      Swal.fire({
        icon: 'success',
        title: 'Event Created',
        text: 'Event has been created successfully',
        timer: 2000,
        showConfirmButton: false
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.error || 'Failed to create event'
      });
    }
  });

  const getUserInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  const events = data?.events || [];
  const pagination = data?.pagination || { total: 0, totalPages: 1 };
  const stats = statsData || { total: 0, upcoming: 0, revenue: 0 };

  const formatRevenue = (amount) => {
    if (amount >= 1000) {
      return `৳${(amount / 1000).toFixed(1)}k`;
    }
    return `৳${amount.toFixed(0)}`;
  };

  const getTypeBadge = (type) => {
    if (type === 'Paid' || type === 'paid') {
      return {
        bg: 'bg-primary/20',
        text: 'text-green-700 dark:text-primary',
        label: 'Paid'
      };
    }
    return {
      bg: 'bg-slate-200 dark:bg-slate-700',
      text: 'text-slate-600 dark:text-slate-300',
      label: 'Free'
    };
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 flex flex-col justify-between border-r border-surface-highlight bg-background-dark transition-all duration-300">
        <div className="flex flex-col gap-4 p-4">
          {/* Brand */}
          <div className="flex items-center gap-3 px-2">
            <div 
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 shrink-0 border-2 border-primary/20"
              style={{ 
                backgroundImage: user?.photoURL ? `url("${user.photoURL}")` : 'none',
                backgroundColor: '#1c2620'
              }}
            ></div>
            <h1 className="text-white text-lg font-bold leading-normal hidden lg:block tracking-wide">ClubSphere</h1>
          </div>
          {/* Nav Links */}
          <nav className="flex flex-col gap-2 mt-4">
            <Link to="/" className="flex items-center gap-3 px-3 py-3 rounded-full text-gray-400 hover:bg-surface-highlight hover:text-white transition-colors">
              <span className="material-symbols-outlined">home</span>
              <p className="text-sm font-medium leading-normal hidden lg:block">Home</p>
            </Link>
            <Link to="/dashboard/admin" className={`flex items-center gap-3 px-3 py-3 rounded-full transition-colors ${isActive('/dashboard/admin') ? 'bg-primary text-background-dark' : 'text-gray-400 hover:bg-surface-highlight hover:text-white'}`}>
              <span className="material-symbols-outlined">dashboard</span>
              <p className={`text-sm leading-normal hidden lg:block ${isActive('/dashboard/admin') ? 'font-bold' : 'font-medium'}`}>Dashboard</p>
            </Link>
            <Link to="/dashboard/admin/users" className={`flex items-center gap-3 px-3 py-3 rounded-full transition-colors ${isActive('/dashboard/admin/users') ? 'bg-primary text-background-dark' : 'text-gray-400 hover:bg-surface-highlight hover:text-white'}`}>
              <span className="material-symbols-outlined">group</span>
              <p className={`text-sm leading-normal hidden lg:block ${isActive('/dashboard/admin/users') ? 'font-bold' : 'font-medium'}`}>Users</p>
            </Link>
            <Link to="/dashboard/admin/clubs" className={`flex items-center gap-3 px-3 py-3 rounded-full transition-colors ${isActive('/dashboard/admin/clubs') ? 'bg-primary text-background-dark' : 'text-gray-400 hover:bg-surface-highlight hover:text-white'}`}>
              <span className="material-symbols-outlined">diversity_3</span>
              <p className={`text-sm leading-normal hidden lg:block ${isActive('/dashboard/admin/clubs') ? 'font-bold' : 'font-medium'}`}>Clubs</p>
            </Link>
            <Link to="/dashboard/admin/events" className={`flex items-center gap-3 px-3 py-3 rounded-full transition-colors ${isActive('/dashboard/admin/events') ? 'bg-primary text-background-dark' : 'text-gray-400 hover:bg-surface-highlight hover:text-white'}`}>
              <span className="material-symbols-outlined">calendar_today</span>
              <p className={`text-sm leading-normal hidden lg:block ${isActive('/dashboard/admin/events') ? 'font-bold' : 'font-medium'}`}>Events</p>
            </Link>
            <Link to="/dashboard/admin/finances" className={`flex items-center gap-3 px-3 py-3 rounded-full transition-colors ${isActive('/dashboard/admin/finances') ? 'bg-primary text-background-dark' : 'text-gray-400 hover:bg-surface-highlight hover:text-white'}`}>
              <span className="material-symbols-outlined">payments</span>
              <p className={`text-sm leading-normal hidden lg:block ${isActive('/dashboard/admin/finances') ? 'font-bold' : 'font-medium'}`}>Finances</p>
            </Link>
            <Link to="/dashboard/admin/categories" className={`flex items-center gap-3 px-3 py-3 rounded-full transition-colors ${isActive('/dashboard/admin/categories') ? 'bg-primary text-background-dark' : 'text-gray-400 hover:bg-surface-highlight hover:text-white'}`}>
              <span className="material-symbols-outlined">category</span>
              <p className={`text-sm leading-normal hidden lg:block ${isActive('/dashboard/admin/categories') ? 'font-bold' : 'font-medium'}`}>Categories</p>
            </Link>
          </nav>
        </div>
        {/* Bottom Settings */}
        <div className="p-4">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-3 py-3 rounded-full text-gray-400 hover:bg-surface-highlight hover:text-white transition-colors w-full"
          >
            <span className="material-symbols-outlined">settings</span>
            <p className="text-sm font-medium leading-normal hidden lg:block">Settings</p>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-background-light dark:bg-background-dark">
        {/* Header Section */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
          <div className="max-w-[1600px] mx-auto flex flex-col gap-6">
          {/* Title & Create Button */}
          <div className="flex flex-wrap justify-between items-end gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">Manage Events</h1>
              <p className="text-slate-500 dark:text-[#9eb7a8] text-base">Oversee all scheduled events across the platform</p>
            </div>
            <button 
              onClick={() => setIsAddEventModalOpen(true)}
              className="flex items-center justify-center gap-2 rounded-full h-12 px-6 bg-primary hover:bg-green-400 text-slate-900 text-sm font-bold tracking-wide transition-all shadow-lg shadow-primary/20"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              <span>Create Event</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1 rounded-xl p-6 border border-slate-200 dark:border-[#3d5245] bg-surface-light dark:bg-[#111714]">
              <div className="flex justify-between items-start">
                <p className="text-slate-500 dark:text-[#9eb7a8] text-sm font-medium uppercase tracking-wider">Total Events</p>
                <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-full">+5%</span>
              </div>
              <p className="text-3xl font-bold mt-2">{stats.total}</p>
            </div>
            <div className="flex flex-col gap-1 rounded-xl p-6 border border-slate-200 dark:border-[#3d5245] bg-surface-light dark:bg-[#111714]">
              <div className="flex justify-between items-start">
                <p className="text-slate-500 dark:text-[#9eb7a8] text-sm font-medium uppercase tracking-wider">Upcoming</p>
                <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-full">+12%</span>
              </div>
              <p className="text-3xl font-bold mt-2">{stats.upcoming}</p>
            </div>
            <div className="flex flex-col gap-1 rounded-xl p-6 border border-slate-200 dark:border-[#3d5245] bg-surface-light dark:bg-[#111714]">
              <div className="flex justify-between items-start">
                <p className="text-slate-500 dark:text-[#9eb7a8] text-sm font-medium uppercase tracking-wider">Revenue</p>
                <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-full">+8%</span>
              </div>
              <p className="text-3xl font-bold mt-2">{formatRevenue(stats.revenue)}</p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 items-center bg-surface-light dark:bg-[#1c2e24] p-2 rounded-2xl border border-slate-200 dark:border-[#3d5245]">
            {/* Search */}
            <div className="flex-1 w-full md:w-auto relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#9eb7a8] material-symbols-outlined">search</span>
              <input
                className="w-full h-12 pl-12 pr-4 bg-slate-100 dark:bg-[#29382f] text-slate-900 dark:text-white rounded-xl border-none focus:ring-2 focus:ring-primary placeholder:text-slate-400 dark:placeholder:text-[#9eb7a8] text-sm font-medium transition-all"
                placeholder="Search by event name or club..."
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {/* Chips */}
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar px-2">
              <button className="flex shrink-0 items-center gap-2 h-10 px-4 rounded-full bg-slate-100 dark:bg-[#29382f] text-slate-700 dark:text-white text-sm font-medium hover:bg-slate-200 dark:hover:bg-[#3d5245] transition-colors border border-transparent hover:border-slate-300 dark:hover:border-[#536b5c]">
                <span>Date Range</span>
                <span className="material-symbols-outlined text-[18px]">expand_more</span>
              </button>
              <button
                onClick={() => setStatusFilter(statusFilter === 'any' ? 'active' : statusFilter === 'active' ? 'cancelled' : 'any')}
                className="flex shrink-0 items-center gap-2 h-10 px-4 rounded-full bg-slate-100 dark:bg-[#29382f] text-slate-700 dark:text-white text-sm font-medium hover:bg-slate-200 dark:hover:bg-[#3d5245] transition-colors border border-transparent hover:border-slate-300 dark:hover:border-[#536b5c]"
              >
                <span>Status: {statusFilter === 'any' ? 'Any' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}</span>
                <span className="material-symbols-outlined text-[18px]">expand_more</span>
              </button>
              <button
                onClick={() => setTypeFilter(typeFilter === 'all' ? 'Paid' : typeFilter === 'Paid' ? 'Free' : 'all')}
                className="flex shrink-0 items-center gap-2 h-10 px-4 rounded-full bg-slate-100 dark:bg-[#29382f] text-slate-700 dark:text-white text-sm font-medium hover:bg-slate-200 dark:hover:bg-[#3d5245] transition-colors border border-transparent hover:border-slate-300 dark:hover:border-[#536b5c]"
              >
                <span>Type: {typeFilter === 'all' ? 'All' : typeFilter}</span>
                <span className="material-symbols-outlined text-[18px]">expand_more</span>
              </button>
            </div>
          </div>

          {/* Table Section */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-auto rounded-xl border border-slate-200 dark:border-[#3d5245] bg-surface-light dark:bg-[#111714]">
              <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-[#1c2e24] text-xs uppercase text-slate-500 dark:text-[#9eb7a8] font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-bold border-b border-slate-200 dark:border-[#3d5245]">Event Title</th>
                  <th className="px-6 py-4 font-bold border-b border-slate-200 dark:border-[#3d5245]">Club</th>
                  <th className="px-6 py-4 font-bold border-b border-slate-200 dark:border-[#3d5245]">Date & Time</th>
                  <th className="px-6 py-4 font-bold border-b border-slate-200 dark:border-[#3d5245]">Location</th>
                  <th className="px-6 py-4 font-bold border-b border-slate-200 dark:border-[#3d5245]">Type</th>
                  <th className="px-6 py-4 font-bold border-b border-slate-200 dark:border-[#3d5245] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-[#29382f]">
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4">
                      <div className="flex items-center justify-center">
                        <Loader />
                      </div>
                    </td>
                  </tr>
                ) : events.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-[#9eb7a8]">No events found</td>
                  </tr>
                ) : (
                  events.map((event) => {
                    const typeBadge = getTypeBadge(event.type);
                    return (
                      <tr key={event.id} className="group hover:bg-slate-50 dark:hover:bg-[#1c2e24] transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-4">
                            {event.image ? (
                              <img
                                src={event.image}
                                alt={event.name}
                                className="h-12 w-12 rounded-lg bg-cover bg-center shrink-0"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-lg bg-gray-700 flex items-center justify-center text-white font-bold text-xs shrink-0">
                                {event.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div className="flex flex-col">
                              <span className="text-slate-900 dark:text-white font-semibold text-sm">{event.name}</span>
                              <span className="text-slate-500 dark:text-[#9eb7a8] text-xs">{event.eventId}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {event.clubImage ? (
                              <img
                                src={event.clubImage}
                                alt={event.clubName}
                                className="h-6 w-6 rounded-full bg-cover bg-center"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="h-6 w-6 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold text-xs">
                                {event.clubName?.charAt(0).toUpperCase() || 'C'}
                              </div>
                            )}
                            <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{event.clubName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-sm text-slate-900 dark:text-white font-medium">{event.date}</span>
                            <span className="text-xs text-slate-500 dark:text-[#9eb7a8]">{event.time}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-slate-700 dark:text-slate-300">{event.location}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${typeBadge.bg} ${typeBadge.text}`}>
                            {typeBadge.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" title="View Stats">
                              <span className="material-symbols-outlined text-[20px]">bar_chart</span>
                            </button>
                            <button className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" title="Edit Event">
                              <span className="material-symbols-outlined text-[20px]">edit</span>
                            </button>
                            <button
                              onClick={() => {
                                Swal.fire({
                                  title: 'Delete Event?',
                                  text: `Are you sure you want to delete ${event.name}?`,
                                  icon: 'warning',
                                  showCancelButton: true,
                                  confirmButtonColor: '#ef4444',
                                  cancelButtonColor: '#29382f',
                                  confirmButtonText: 'Yes, delete it'
                                }).then((result) => {
                                  if (result.isConfirmed) {
                                    deleteEventMutation.mutate(event.id);
                                  }
                                });
                              }}
                              className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                              title="Delete"
                            >
                              <span className="material-symbols-outlined text-[20px]">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center py-4">
              <span className="text-sm text-slate-500 dark:text-[#9eb7a8]">Showing {((page - 1) * limit) + 1}-{Math.min(page * limit, pagination.total)} of {pagination.total} results</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 dark:border-[#3d5245] text-slate-500 dark:text-[#9eb7a8] hover:bg-slate-100 dark:hover:bg-[#29382f] disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                {[...Array(Math.min(3, pagination.totalPages))].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                        page === pageNum
                          ? 'bg-primary text-slate-900 font-bold shadow-md shadow-primary/20'
                          : 'border border-slate-200 dark:border-[#3d5245] text-slate-500 dark:text-[#9eb7a8] hover:bg-slate-100 dark:hover:bg-[#29382f]'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                {pagination.totalPages > 3 && <span className="flex items-center justify-center w-8 h-8 text-slate-500 dark:text-[#9eb7a8]">...</span>}
                <button
                  onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                  disabled={page >= pagination.totalPages}
                  className="flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 dark:border-[#3d5245] text-slate-500 dark:text-[#9eb7a8] hover:bg-slate-100 dark:hover:bg-[#29382f]"
                >
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
          </div>
        </div>
      </main>

      {/* Add Event Modal */}
      {isAddEventModalOpen && (
        <AddEventModal
          isOpen={isAddEventModalOpen}
          onClose={() => setIsAddEventModalOpen(false)}
          onSubmit={createEventMutation.mutate}
          isLoading={createEventMutation.isLoading}
        />
      )}
    </div>
  );
};

// Add Event Modal Component
const AddEventModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    location: '',
    clubId: '',
    isPaid: false,
    fee: '15.00',
    maxAttendees: ''
  });
  const [charCount, setCharCount] = useState(0);

  // Fetch clubs for dropdown
  const { data: clubsData } = useQuery({
    queryKey: ['admin-clubs-for-events'],
    queryFn: async () => {
      const response = await api.get('/api/admin/clubs', {
        params: { page: 1, limit: 100, status: 'active' }
      });
      return response.data;
    }
  });

  const clubs = clubsData?.clubs || [];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'description') {
      setCharCount(value.length);
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.description || !formData.date || !formData.location || !formData.clubId) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Fields',
        text: 'Please fill in all required fields.',
      });
      return;
    }

    // Parse datetime-local to separate date and time
    const dateTime = new Date(formData.date);
    const dateStr = dateTime.toISOString().split('T')[0];
    const timeStr = dateTime.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });

    // Submit form data
    onSubmit({
      name: formData.name,
      description: formData.description,
      date: dateStr,
      time: timeStr,
      location: formData.location,
      clubId: formData.clubId,
      type: formData.isPaid ? 'paid' : 'free',
      fee: formData.isPaid ? parseFloat(formData.fee) : 0,
      maxAttendees: formData.maxAttendees || null
    });

    // Reset form
    setFormData({
      name: '',
      description: '',
      date: '',
      location: '',
      clubId: '',
      isPaid: false,
      fee: '15.00',
      maxAttendees: ''
    });
    setCharCount(0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-[#111714] rounded-2xl border border-slate-200 dark:border-[#3d5245] w-full max-w-4xl my-8 shadow-sm max-h-[90vh] overflow-y-auto">
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">Create New Event</h1>
              <p className="text-slate-500 dark:text-[#9eb7a8] text-base">Fill in the details below to schedule a new event for the community.</p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-500 dark:text-[#9eb7a8] hover:text-slate-900 dark:hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-[#29382f]"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            {/* Basic Information */}
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                  <span className="material-symbols-outlined text-[20px]">info</span>
                </span>
                Basic Information
              </h2>
              <div className="grid grid-cols-1 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
                    Event Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full h-12 px-4 bg-slate-50 dark:bg-[#1c2e24] border border-slate-200 dark:border-[#3d5245] rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all outline-none"
                    placeholder="e.g. Saturday Night Jazz Concert"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className="w-full p-4 bg-slate-50 dark:bg-[#1c2e24] border border-slate-200 dark:border-[#3d5245] rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all outline-none resize-none"
                    placeholder="Describe what the event is about, what to expect, and any requirements..."
                    rows="5"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    maxLength={500}
                    required
                  />
                  <p className="text-xs text-slate-400 dark:text-[#9eb7a8] text-right">{charCount}/500 characters</p>
                </div>
              </div>
            </div>

            <hr className="border-slate-200 dark:border-[#29382f]" />

            {/* Logistics & Hosting */}
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                  <span className="material-symbols-outlined text-[20px]">location_on</span>
                </span>
                Logistics & Hosting
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
                    Event Date & Time <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">calendar_today</span>
                    <input
                      className="w-full h-12 pl-12 pr-4 bg-slate-50 dark:bg-[#1c2e24] border border-slate-200 dark:border-[#3d5245] rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all outline-none [color-scheme:light] dark:[color-scheme:dark]"
                      type="datetime-local"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">pin_drop</span>
                    <input
                      className="w-full h-12 pl-12 pr-4 bg-slate-50 dark:bg-[#1c2e24] border border-slate-200 dark:border-[#3d5245] rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all outline-none"
                      placeholder="e.g. Main St. Hall"
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
                    Associated Club <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">diversity_3</span>
                    <select
                      className="w-full h-12 pl-12 pr-10 bg-slate-50 dark:bg-[#1c2e24] border border-slate-200 dark:border-[#3d5245] rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900 dark:text-white transition-all outline-none appearance-none cursor-pointer"
                      name="clubId"
                      value={formData.clubId}
                      onChange={handleInputChange}
                      required
                    >
                      <option disabled value="">Select a club...</option>
                      {clubs.map((club) => (
                        <option key={club.id} value={club.id}>
                          {club.name}
                        </option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-slate-200 dark:border-[#29382f]" />

            {/* Ticketing & Capacity */}
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                  <span className="material-symbols-outlined text-[20px]">payments</span>
                </span>
                Ticketing & Capacity
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="bg-slate-50 dark:bg-[#1c2e24] border border-slate-200 dark:border-[#3d5245] rounded-xl p-5 flex flex-col gap-5">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <label className="text-sm font-bold text-slate-900 dark:text-white">Is this a paid event?</label>
                      <span className="text-xs text-slate-500 dark:text-[#9eb7a8]">Turn on if tickets are sold.</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        className="sr-only peer"
                        type="checkbox"
                        name="isPaid"
                        checked={formData.isPaid}
                        onChange={handleInputChange}
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary dark:peer-focus:ring-primary rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  {formData.isPaid && (
                    <div className="pt-4 border-t border-slate-200 dark:border-[#29382f] animate-fade-in-down">
                      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2 block">
                        Event Fee (৳)
                      </label>
                      <div className="relative group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">৳</span>
                        <input
                          className="w-full h-12 pl-8 pr-4 bg-white dark:bg-[#111714] border border-slate-200 dark:border-[#3d5245] rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none text-slate-900 dark:text-white"
                          min="0"
                          step="0.01"
                          type="number"
                          name="fee"
                          value={formData.fee}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
                    Max Attendees <span className="text-slate-400 font-normal normal-case ml-1">(Optional)</span>
                  </label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">group</span>
                    <input
                      className="w-full h-12 pl-12 pr-4 bg-slate-50 dark:bg-[#1c2e24] border border-slate-200 dark:border-[#3d5245] rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all outline-none"
                      min="1"
                      placeholder="e.g. 100"
                      type="number"
                      name="maxAttendees"
                      value={formData.maxAttendees}
                      onChange={handleInputChange}
                    />
                  </div>
                  <p className="text-xs text-slate-400 dark:text-[#9eb7a8] mt-1">Leave blank for unlimited capacity.</p>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col-reverse md:flex-row justify-end gap-4 mt-8 pt-6 border-t border-slate-200 dark:border-[#29382f]">
              <button
                type="button"
                onClick={onClose}
                className="h-12 px-8 rounded-full border border-slate-200 dark:border-[#3d5245] text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-[#29382f] transition-colors focus:ring-4 focus:ring-slate-100 dark:focus:ring-slate-800 outline-none disabled:opacity-50"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-12 px-8 rounded-full bg-primary hover:bg-green-400 text-slate-900 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all flex items-center justify-center gap-2 focus:ring-4 focus:ring-primary/30 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">add_circle</span>
                    <span>Create Event</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminManageEvents;


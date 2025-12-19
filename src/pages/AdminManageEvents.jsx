import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import Swal from 'sweetalert2';

const AdminManageEvents = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('any');
  const [typeFilter, setTypeFilter] = useState('all');
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
      return `$${(amount / 1000).toFixed(1)}k`;
    }
    return `$${amount.toFixed(0)}`;
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
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBjuschDidP2UNlYBKT4j1Q75XdF-c6Fs6Ft4n07qksKr1_mieQwsNxnQIZ5XIa08VFLDDHmsnzjKeB2nUshvggwb7mgzzC5h95UnkZclOKPWoOqzg_iiD0zJuDwGvR6_rpPvYzadxz93TcWfNV73IRJ-f1t3O5L0BYP0NwvuOHnA8CezIw_O0YHxs23Pv4V1zdR3OMAVioKtXjqm_HBLQC4wnzUkyk5XDN7ylBIV8s_oFPKFwNw2j_LdkTUNvrWodTzqKVRtetak5L")' }}
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
            <button className="flex items-center justify-center gap-2 rounded-full h-12 px-6 bg-primary hover:bg-green-400 text-slate-900 text-sm font-bold tracking-wide transition-all shadow-lg shadow-primary/20">
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
                  <th className="px-6 py-4 font-bold border-b border-slate-200 dark:border-[#3d5245]">Event Name</th>
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
                    <td colSpan="6" className="px-6 py-4 text-center text-[#9eb7a8]">Loading...</td>
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
    </div>
  );
};

export default AdminManageEvents;


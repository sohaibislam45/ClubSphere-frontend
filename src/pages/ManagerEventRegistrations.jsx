import { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import ManagerSidebar from '../components/layout/ManagerSidebar';
import Loader from '../components/ui/Loader';

const ManagerEventRegistrations = () => {
  const { user, logout } = useAuth();

  useEffect(() => {
    document.title = 'Event Registrations - Club Manager - ClubSphere';
  }, []);
  const { eventId: eventIdFromParams } = useParams();
  const navigate = useNavigate();
  const [selectedEventId, setSelectedEventId] = useState(eventIdFromParams || '');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [actionMenuOpen, setActionMenuOpen] = useState(null);
  const actionMenuRef = useRef(null);
  const limit = 10;

  // Fetch events for selector
  const { data: eventsData } = useQuery({
    queryKey: ['managerEvents'],
    queryFn: async () => {
      const response = await api.get('/api/manager/events?filter=all');
      return response.data;
    }
  });

  // Update selectedEventId when eventIdFromParams changes
  useEffect(() => {
    if (eventIdFromParams && eventIdFromParams !== selectedEventId) {
      setSelectedEventId(eventIdFromParams);
    }
  }, [eventIdFromParams]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to first page when search changes
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // Close action menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target)) {
        setActionMenuOpen(null);
      }
    };

    if (actionMenuOpen !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [actionMenuOpen]);

  // Fetch registrations
  const { data: registrationsData, isLoading, error } = useQuery({
    queryKey: ['eventRegistrations', selectedEventId, debouncedSearch, statusFilter, page],
    queryFn: async () => {
      if (!selectedEventId) return { registrations: [], stats: {}, pagination: {} };
      const params = new URLSearchParams();
      if (debouncedSearch) params.append('search', debouncedSearch);
      if (statusFilter && statusFilter !== 'all') params.append('status', statusFilter);
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      const response = await api.get(`/api/manager/events/${selectedEventId}/registrations?${params.toString()}`);
      return response.data;
    },
    enabled: !!selectedEventId
  });

  const registrations = registrationsData?.registrations || [];
  const stats = registrationsData?.stats || { totalRegistered: 0, newToday: 0, cancelled: 0 };
  const pagination = registrationsData?.pagination || { page: 1, totalPages: 1, total: 0 };
  const events = eventsData?.events || [];

  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase() || 'registered';
    if (statusLower === 'registered') {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
          <span className="size-1.5 rounded-full bg-emerald-500"></span>
          Registered
        </span>
      );
    } else if (statusLower === 'cancelled') {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 dark:bg-red-500/10 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:text-red-400 border border-red-200 dark:border-red-500/20">
          <span className="size-1.5 rounded-full bg-red-500"></span>
          Cancelled
        </span>
      );
    } else if (statusLower === 'waitlist') {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
          <span className="size-1.5 rounded-full bg-amber-500"></span>
          Waitlist
        </span>
      );
    }
    return null;
  };

  const handleEventChange = (newEventId) => {
    setSelectedEventId(newEventId);
    setPage(1);
    if (newEventId) {
      navigate(`/dashboard/club-manager/events/${newEventId}/registrations`);
    } else {
      navigate('/dashboard/club-manager/event-registrations');
    }
  };

  const handleExport = () => {
    if (!selectedEventId || !registrations.length) {
      alert('No registrations to export. Please select an event with registrations.');
      return;
    }

    // Create CSV content
    const headers = ['Name', 'Email', 'Phone', 'Status', 'Payment Status', 'Registration Date', 'Member ID'];
    const rows = registrations.map(reg => [
      reg.name || '',
      reg.email || '',
      reg.phone || '',
      reg.status || 'registered',
      reg.paymentStatus || 'pending',
      reg.registrationDate || '',
      reg.memberId || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    const eventName = selectedEvent?.name?.replace(/[^a-z0-9]/gi, '-') || 'event';
    link.setAttribute('download', `${eventName}-registrations-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const selectedEvent = events.find(e => e.id === selectedEventId);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white antialiased">
      {/* Sidebar */}
      <ManagerSidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-hidden h-full">
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
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <Loader />
            </div>
          ) : (
            <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
              {/* Breadcrumbs & Heading */}
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap gap-2 text-sm">
                  <Link to="/dashboard/club-manager" className="text-slate-500 dark:text-[#9da6b9] font-medium hover:text-primary">Dashboard</Link>
                  <span className="text-slate-500 dark:text-[#9da6b9] font-medium">/</span>
                  <Link to="/dashboard/club-manager/events" className="text-slate-500 dark:text-[#9da6b9] font-medium hover:text-primary">Events</Link>
                  <span className="text-slate-500 dark:text-[#9da6b9] font-medium">/</span>
                  <span className="text-slate-900 dark:text-white font-medium">{selectedEvent?.name || 'Event Registrations'}</span>
                </div>
                <div className="flex flex-wrap justify-between items-end gap-4">
                  <div>
                    <h1 className="text-slate-900 dark:text-white text-3xl font-bold leading-tight tracking-tight">Event Registrations</h1>
                    <p className="text-slate-500 dark:text-[#9da6b9] mt-1">Manage attendees, view status, and export lists.</p>
                  </div>
                  <div className="flex gap-3">
                    {selectedEventId && (
                      <button 
                        onClick={() => {
                          navigate('/dashboard/club-manager/events');
                        }}
                        className="flex items-center justify-center rounded-lg h-10 px-4 bg-white dark:bg-[#282e39] border border-slate-200 dark:border-[#3b4354] text-slate-900 dark:text-white text-sm font-medium hover:bg-slate-50 dark:hover:bg-[#3b4354] transition-colors"
                      >
                        <span className="material-symbols-outlined mr-2 text-[20px]">edit</span>
                        Edit Event
                      </button>
                    )}
                    <button
                      onClick={handleExport}
                      className="flex items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-blue-600 transition-colors"
                    >
                      <span className="material-symbols-outlined mr-2 text-[20px]">download</span>
                      Export List
                    </button>
                  </div>
                </div>
              </div>

              {/* Context & Stats Area */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Event Selector */}
                <div className="lg:col-span-1">
                  <label className="flex flex-col w-full h-full">
                    <span className="sr-only">Select Event</span>
                    <div className="relative h-full">
                      <select
                        className="appearance-none w-full h-full min-h-[100px] lg:min-h-0 rounded-xl border border-slate-200 dark:border-[#3b4354] bg-white dark:bg-[#1c1f27] text-slate-900 dark:text-white px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-medium shadow-sm"
                        value={selectedEventId}
                        onChange={(e) => handleEventChange(e.target.value)}
                      >
                        <option value="">Select an event</option>
                        {events.map((event) => (
                          <option key={event.id} value={event.id}>
                            {event.name}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 dark:text-slate-400">
                        <span className="material-symbols-outlined">expand_more</span>
                      </div>
                    </div>
                  </label>
                </div>
                {/* Stats Cards */}
                <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col justify-center p-4 rounded-xl bg-white dark:bg-[#1c1f27] border border-slate-200 dark:border-[#282e39] shadow-sm">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        <span className="material-symbols-outlined text-[24px]">group</span>
                      </div>
                      <span className="text-sm font-medium text-slate-500 dark:text-[#9da6b9]">Total Registered</span>
                    </div>
                    <span className="text-2xl font-bold text-slate-900 dark:text-white ml-1">{stats.totalRegistered || 0}</span>
                  </div>
                  <div className="flex flex-col justify-center p-4 rounded-xl bg-white dark:bg-[#1c1f27] border border-slate-200 dark:border-[#282e39] shadow-sm">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                        <span className="material-symbols-outlined text-[24px]">trending_up</span>
                      </div>
                      <span className="text-sm font-medium text-slate-500 dark:text-[#9da6b9]">New Today</span>
                    </div>
                    <span className="text-2xl font-bold text-slate-900 dark:text-white ml-1">{stats.newToday || 0}</span>
                  </div>
                  <div className="flex flex-col justify-center p-4 rounded-xl bg-white dark:bg-[#1c1f27] border border-slate-200 dark:border-[#282e39] shadow-sm">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="p-2 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400">
                        <span className="material-symbols-outlined text-[24px]">cancel</span>
                      </div>
                      <span className="text-sm font-medium text-slate-500 dark:text-[#9da6b9]">Cancelled</span>
                    </div>
                    <span className="text-2xl font-bold text-slate-900 dark:text-white ml-1">{stats.cancelled || 0}</span>
                  </div>
                </div>
              </div>

              {/* Filter & Table Section */}
              {!selectedEventId ? (
                <div className="flex items-center justify-center py-20 rounded-xl bg-white dark:bg-[#1c1f27] border border-slate-200 dark:border-[#282e39]">
                  <div className="text-slate-500 dark:text-[#9da6b9]">Please select an event to view registrations</div>
                </div>
              ) : (
                <div className="flex flex-col rounded-xl bg-white dark:bg-[#1c1f27] border border-slate-200 dark:border-[#282e39] shadow-sm overflow-hidden">
                  {/* Toolbar */}
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-b border-slate-200 dark:border-[#282e39]">
                    <div className="relative w-full sm:max-w-xs">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 dark:text-slate-400">
                        <span className="material-symbols-outlined text-[20px]">search</span>
                      </div>
                      <input
                        className="block w-full rounded-lg border-slate-200 dark:border-[#3b4354] bg-slate-50 dark:bg-[#111318] py-2.5 pl-10 pr-3 text-sm text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                        placeholder="Search attendees..."
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div className="relative flex-1 sm:flex-none">
                        <select
                          className="w-full sm:w-auto appearance-none rounded-lg border-slate-200 dark:border-[#3b4354] bg-slate-50 dark:bg-[#111318] py-2.5 pl-4 pr-10 text-sm text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none cursor-pointer"
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                        >
                          <option value="all">All Status</option>
                          <option value="registered">Registered</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="waitlist">Waitlist</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500 dark:text-slate-400">
                          <span className="material-symbols-outlined text-[20px]">expand_more</span>
                        </div>
                      </div>
                      <button className="flex items-center justify-center rounded-lg p-2.5 border border-slate-200 dark:border-[#3b4354] text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#282e39] transition-colors" title="Filter Settings">
                        <span className="material-symbols-outlined text-[20px]">filter_list</span>
                      </button>
                    </div>
                  </div>
                  {/* Table */}
                  {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                      <Loader />
                    </div>
                  ) : error ? (
                    <div className="flex items-center justify-center py-20">
                      <div className="text-red-400">Error loading registrations. Please try again.</div>
                    </div>
                  ) : (
                    <>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600 dark:text-[#9da6b9]">
                          <thead className="bg-slate-50 dark:bg-[#232731] text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">
                            <tr>
                              <th className="px-6 py-4" scope="col">Name</th>
                              <th className="px-6 py-4" scope="col">Contact Info</th>
                              <th className="px-6 py-4" scope="col">Status</th>
                              <th className="px-6 py-4" scope="col">Payment</th>
                              <th className="px-6 py-4" scope="col">Registration Date</th>
                              <th className="px-6 py-4 text-right" scope="col">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 dark:divide-[#282e39]">
                            {registrations.length === 0 ? (
                              <tr>
                                <td colSpan="6" className="px-6 py-8 text-center text-slate-500 dark:text-[#9da6b9]">
                                  No registrations found
                                </td>
                              </tr>
                            ) : (
                              registrations.map((registration) => (
                                <tr key={registration.id} className="hover:bg-slate-50 dark:hover:bg-[#20232c] transition-colors group">
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                      {registration.photoURL ? (
                                        <img
                                          src={registration.photoURL}
                                          alt={registration.name}
                                          className="size-10 rounded-full object-cover bg-slate-200"
                                          referrerPolicy="no-referrer"
                                        />
                                      ) : (
                                        <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                                          {registration.name?.charAt(0)?.toUpperCase() || 'U'}
                                        </div>
                                      )}
                                      <div className="flex flex-col">
                                        <span className="text-slate-900 dark:text-white font-medium">{registration.name}</span>
                                        <span className="text-xs text-slate-500 dark:text-slate-400">Member ID: {registration.memberId}</span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex flex-col">
                                      <span className="text-slate-900 dark:text-white">{registration.email}</span>
                                      <span className="text-xs text-slate-500 dark:text-slate-400">{registration.phone}</span>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    {getStatusBadge(registration.status)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    {registration.paymentStatus === 'paid' ? (
                                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                                        <span className="size-1.5 rounded-full bg-emerald-500"></span>
                                        Paid
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
                                        <span className="size-1.5 rounded-full bg-amber-500"></span>
                                        Pending
                                      </span>
                                    )}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-slate-500 dark:text-slate-400">
                                    {registration.registrationDate}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <div className="relative" ref={actionMenuOpen === registration.id ? actionMenuRef : null}>
                                      <button 
                                        onClick={() => setActionMenuOpen(actionMenuOpen === registration.id ? null : registration.id)}
                                        className="text-slate-400 hover:text-primary transition-colors p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-[#282e39]"
                                      >
                                        <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                      </button>
                                      {actionMenuOpen === registration.id && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1c1f27] border border-slate-200 dark:border-[#3b4354] rounded-xl shadow-lg z-50 overflow-hidden">
                                          <div className="py-1">
                                            <button
                                              onClick={() => {
                                                alert(`Registration Details:\n\nName: ${registration.name}\nEmail: ${registration.email}\nPhone: ${registration.phone}\nStatus: ${registration.status}\nPayment Status: ${registration.paymentStatus}\nRegistration Date: ${registration.registrationDate}`);
                                                setActionMenuOpen(null);
                                              }}
                                              className="w-full px-4 py-2 text-left text-sm text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-[#282e39] transition-colors flex items-center gap-2"
                                            >
                                              <span className="material-symbols-outlined text-lg">visibility</span>
                                              <span>View Details</span>
                                            </button>
                                            <button
                                              onClick={() => {
                                                window.location.href = `mailto:${registration.email}`;
                                                setActionMenuOpen(null);
                                              }}
                                              className="w-full px-4 py-2 text-left text-sm text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-[#282e39] transition-colors flex items-center gap-2"
                                            >
                                              <span className="material-symbols-outlined text-lg">email</span>
                                              <span>Send Email</span>
                                            </button>
                                            {registration.phone && registration.phone !== '--' && (
                                              <button
                                                onClick={() => {
                                                  window.location.href = `tel:${registration.phone}`;
                                                  setActionMenuOpen(null);
                                                }}
                                                className="w-full px-4 py-2 text-left text-sm text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-[#282e39] transition-colors flex items-center gap-2"
                                              >
                                                <span className="material-symbols-outlined text-lg">phone</span>
                                                <span>Call</span>
                                              </button>
                                            )}
                                            {registration.status === 'registered' && (
                                              <>
                                                <div className="border-t border-slate-200 dark:border-[#3b4354] my-1"></div>
                                                <button
                                                  onClick={() => {
                                                    if (window.confirm(`Are you sure you want to cancel ${registration.name}'s registration?`)) {
                                                      // TODO: Implement cancel registration API call
                                                      alert('Cancel registration functionality will be implemented soon.');
                                                      setActionMenuOpen(null);
                                                    }
                                                  }}
                                                  className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors flex items-center gap-2"
                                                >
                                                  <span className="material-symbols-outlined text-lg">cancel</span>
                                                  <span>Cancel Registration</span>
                                                </button>
                                              </>
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                      {/* Pagination */}
                      {pagination.totalPages > 1 && (
                        <div className="flex items-center justify-between border-t border-slate-200 dark:border-[#282e39] bg-slate-50 dark:bg-[#1c1f27] px-6 py-3">
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            Showing <span className="font-medium text-slate-900 dark:text-white">{((page - 1) * limit) + 1}</span> to{' '}
                            <span className="font-medium text-slate-900 dark:text-white">{Math.min(page * limit, pagination.total)}</span> of{' '}
                            <span className="font-medium text-slate-900 dark:text-white">{pagination.total}</span> results
                          </p>
                          <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                            <button
                              onClick={() => setPage(Math.max(1, page - 1))}
                              disabled={page === 1}
                              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-500 dark:text-slate-400 ring-1 ring-inset ring-slate-200 dark:ring-[#3b4354] hover:bg-slate-50 dark:hover:bg-[#282e39] focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                            >
                              <span className="sr-only">Previous</span>
                              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                            </button>
                            {(() => {
                              const maxPages = 5;
                              let startPage = Math.max(1, page - Math.floor(maxPages / 2));
                              let endPage = Math.min(pagination.totalPages, startPage + maxPages - 1);
                              
                              // Adjust start if we're near the end
                              if (endPage - startPage < maxPages - 1) {
                                startPage = Math.max(1, endPage - maxPages + 1);
                              }
                              
                              const pages = [];
                              for (let i = startPage; i <= endPage; i++) {
                                pages.push(i);
                              }
                              
                              return pages.map((pageNum) => (
                                <button
                                  key={pageNum}
                                  onClick={() => setPage(pageNum)}
                                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-slate-200 dark:ring-[#3b4354] hover:bg-slate-50 dark:hover:bg-[#282e39] focus:z-20 focus:outline-offset-0 ${
                                    page === pageNum
                                      ? 'bg-primary/20 text-primary dark:bg-primary/10 dark:text-primary'
                                      : 'text-slate-900 dark:text-white'
                                  }`}
                                >
                                  {pageNum}
                                </button>
                              ));
                            })()}
                            <button
                              onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
                              disabled={page === pagination.totalPages}
                              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-500 dark:text-slate-400 ring-1 ring-inset ring-slate-200 dark:ring-[#3b4354] hover:bg-slate-50 dark:hover:bg-[#282e39] focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                            >
                              <span className="sr-only">Next</span>
                              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                            </button>
                          </nav>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
          )}
        </main>
    </div>
  );
};

export default ManagerEventRegistrations;


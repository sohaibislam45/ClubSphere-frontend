import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

const ManagerEventRegistrations = () => {
  const { user, logout } = useAuth();
  const { eventId: eventIdFromParams } = useParams();
  const navigate = useNavigate();
  const [selectedEventId, setSelectedEventId] = useState(eventIdFromParams || '');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const limit = 10;

  // Fetch events for selector
  const { data: eventsData } = useQuery({
    queryKey: ['managerEvents'],
    queryFn: async () => {
      const response = await api.get('/api/manager/events?filter=all');
      return response.data;
    }
  });

  // Fetch registrations
  const { data: registrationsData, isLoading, error } = useQuery({
    queryKey: ['eventRegistrations', selectedEventId, search, statusFilter, page],
    queryFn: async () => {
      if (!selectedEventId) return { registrations: [], stats: {}, pagination: {} };
      const params = new URLSearchParams();
      if (search) params.append('search', search);
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
    navigate(`/dashboard/club-manager/events/${newEventId}/registrations`);
  };

  const handleExport = () => {
    // TODO: Implement CSV export
    console.log('Export CSV');
  };

  const selectedEvent = events.find(e => e.id === selectedEventId);

  return (
    <div className="flex flex-col h-screen w-full bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white overflow-hidden">
      {/* TopNavBar */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-[#282e39] bg-white dark:bg-[#111318] px-10 py-3 shrink-0 z-20">
        <div className="flex items-center gap-4 text-slate-900 dark:text-white">
          <Link to="/dashboard/club-manager" className="flex items-center gap-4">
            <div className="size-8 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-3xl">token</span>
            </div>
            <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Club Manager</h2>
          </Link>
        </div>
        <div className="flex flex-1 justify-end gap-8">
          <div className="flex gap-2">
            <button className="flex size-10 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-slate-100 dark:bg-[#282e39] text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-[#3b4354] transition-colors">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </button>
            <button className="flex size-10 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-slate-100 dark:bg-[#282e39] text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-[#3b4354] transition-colors">
              <span className="material-symbols-outlined text-[20px]">settings</span>
            </button>
          </div>
          {user?.photoURL ? (
            <img src={user.photoURL} alt={user?.name} className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border border-slate-200 dark:border-[#282e39] object-cover" referrerPolicy="no-referrer" />
          ) : (
            <div className="rounded-full size-10 border border-slate-200 dark:border-[#282e39] bg-primary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">person</span>
            </div>
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* SideNavBar */}
        <aside className="w-[280px] bg-white dark:bg-[#111318] border-r border-slate-200 dark:border-[#282e39] flex flex-col justify-between p-4 hidden lg:flex shrink-0 overflow-y-auto">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col px-3">
              <h1 className="text-slate-900 dark:text-white text-base font-medium leading-normal">Management</h1>
              <p className="text-slate-500 dark:text-[#9da6b9] text-sm font-normal leading-normal">Admin Console</p>
            </div>
            <div className="flex flex-col gap-1">
              <Link to="/dashboard/club-manager" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1c1f27] transition-colors group">
                <span className="material-symbols-outlined group-hover:text-primary transition-colors">dashboard</span>
                <p className="text-sm font-medium leading-normal">Dashboard</p>
              </Link>
              <Link to="/dashboard/club-manager/events" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary">
                <span className="material-symbols-outlined fill-current">calendar_today</span>
                <p className="text-sm font-medium leading-normal">Events</p>
              </Link>
              <Link to="/dashboard/club-manager/clubs/:clubId/members" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1c1f27] transition-colors group">
                <span className="material-symbols-outlined group-hover:text-primary transition-colors">group</span>
                <p className="text-sm font-medium leading-normal">Members</p>
              </Link>
              <Link to="/dashboard/club-manager" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1c1f27] transition-colors group">
                <span className="material-symbols-outlined group-hover:text-primary transition-colors">payments</span>
                <p className="text-sm font-medium leading-normal">Finances</p>
              </Link>
              <Link to="/dashboard/club-manager" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1c1f27] transition-colors group">
                <span className="material-symbols-outlined group-hover:text-primary transition-colors">settings</span>
                <p className="text-sm font-medium leading-normal">Settings</p>
              </Link>
            </div>
          </div>
          <div className="px-3 py-4 border-t border-slate-200 dark:border-[#282e39]">
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 p-3 rounded-lg bg-slate-100 dark:bg-[#1c1f27] hover:bg-slate-200 dark:hover:bg-[#282e39] transition-colors text-slate-500 dark:text-slate-400"
            >
              <span className="material-symbols-outlined">logout</span>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-900 dark:text-white">Log out</span>
              </div>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-hidden h-full">
          <div className="flex-1 overflow-y-auto p-4 md:p-8">
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
                    <button className="flex items-center justify-center rounded-lg h-10 px-4 bg-white dark:bg-[#282e39] border border-slate-200 dark:border-[#3b4354] text-slate-900 dark:text-white text-sm font-medium hover:bg-slate-50 dark:hover:bg-[#3b4354] transition-colors">
                      <span className="material-symbols-outlined mr-2 text-[20px]">edit</span>
                      Edit Event
                    </button>
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
                      <div className="text-slate-500 dark:text-[#9da6b9]">Loading registrations...</div>
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
                              <th className="px-6 py-4" scope="col">Registration Date</th>
                              <th className="px-6 py-4 text-right" scope="col">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 dark:divide-[#282e39]">
                            {registrations.length === 0 ? (
                              <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-slate-500 dark:text-[#9da6b9]">
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
                                  <td className="px-6 py-4 whitespace-nowrap text-slate-500 dark:text-slate-400">
                                    {registration.registrationDate}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <button className="text-slate-400 hover:text-primary transition-colors p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-[#282e39]">
                                      <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                    </button>
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
                          <div className="flex gap-2">
                            <button
                              onClick={() => setPage(Math.max(1, page - 1))}
                              disabled={page === 1}
                              className="rounded-lg border border-slate-200 dark:border-[#3b4354] bg-white dark:bg-[#111318] px-3 py-1 text-sm font-medium text-slate-500 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#282e39] disabled:opacity-50"
                            >
                              Previous
                            </button>
                            <button
                              onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
                              disabled={page === pagination.totalPages}
                              className="rounded-lg border border-slate-200 dark:border-[#3b4354] bg-white dark:bg-[#111318] px-3 py-1 text-sm font-medium text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-[#282e39] disabled:opacity-50"
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManagerEventRegistrations;


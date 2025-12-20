import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import MemberSidebar from '../components/layout/MemberSidebar';
import Loader from '../components/ui/Loader';
import api from '../lib/api';

const MemberMyEvents = () => {
  const { user } = useAuth();

  useEffect(() => {
    document.title = 'My Events - ClubSphere';
  }, []);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [search, setSearch] = useState('');

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
  const counts = data?.counts || { upcoming: 0, waitlist: 0, past: 0, cancelled: 0 };

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

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display antialiased overflow-hidden h-screen flex">
      <MemberSidebar />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-background-dark relative">
        {/* Top Gradient Accents */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 scroll-smooth">
          <div className="max-w-6xl mx-auto flex flex-col gap-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 z-10 relative">
              <div className="flex flex-col gap-2">
                <h1 className="text-white text-4xl font-bold leading-tight tracking-tight">My Events</h1>
                <p className="text-gray-400 text-base max-w-xl">
                  Track your upcoming schedule, manage registrations, and view your event history.
                </p>
              </div>
              <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-background-dark px-6 py-3 rounded-full font-bold transition-transform active:scale-95 shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined">explore</span>
                Browse Events
              </button>
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
                      {counts.upcoming}
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab('waitlist')}
                    className={`whitespace-nowrap pb-4 border-b-2 text-sm tracking-wide transition-colors ${
                      activeTab === 'waitlist'
                        ? 'border-primary text-white font-bold'
                        : 'border-transparent text-gray-400 hover:text-white font-medium hover:border-white/20'
                    }`}
                  >
                    Waitlist
                    <span className={`ml-2 text-xs py-0.5 px-2 rounded-full font-bold ${
                      activeTab === 'waitlist'
                        ? 'bg-primary text-background-dark'
                        : 'bg-surface-dark border border-white/10 text-gray-400'
                    }`}>
                      {counts.waitlist}
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab('past')}
                    className={`whitespace-nowrap pb-4 border-b-2 text-sm tracking-wide transition-colors ${
                      activeTab === 'past'
                        ? 'border-primary text-white font-bold'
                        : 'border-transparent text-gray-400 hover:text-white font-medium hover:border-white/20'
                    }`}
                  >
                    Past Events
                  </button>
                  <button
                    onClick={() => setActiveTab('cancelled')}
                    className={`whitespace-nowrap pb-4 border-b-2 text-sm tracking-wide transition-colors ${
                      activeTab === 'cancelled'
                        ? 'border-primary text-white font-bold'
                        : 'border-transparent text-gray-400 hover:text-white font-medium hover:border-white/20'
                    }`}
                  >
                    Cancelled
                  </button>
                </nav>
              </div>
            </div>

            {/* Events Table */}
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader />
              </div>
            ) : error ? (
              <div className="text-center py-20 text-red-400">Error loading events</div>
            ) : events.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-surface-dark overflow-hidden shadow-xl z-10 relative p-20 text-center">
                <div className="bg-surface-dark p-6 rounded-full mb-4 inline-block">
                  <span className="material-symbols-outlined text-6xl text-gray-600">event_busy</span>
                </div>
                <h3 className="text-xl font-bold text-white">No {activeTab} events</h3>
                <p className="text-gray-400 mt-2 mb-6">You haven't registered for any {activeTab} events yet.</p>
                <button className="text-primary font-bold hover:underline">Explore Local Clubs</button>
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
                        <tr key={event.id} className="group hover:bg-white/5 transition-colors">
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
                                {event.location.includes('Trail') || event.location.includes('Park') ? 'landscape' : 'location_on'}
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
                              <button className="text-white hover:text-red-400 text-sm font-semibold transition-colors">
                                View Details
                              </button>
                            ) : event.statusColor === 'blue' ? (
                              <button className="text-white hover:text-red-400 text-sm font-semibold transition-colors">
                                Cancel Request
                              </button>
                            ) : event.status === 'waitlisted' ? (
                              <button className="text-white hover:text-primary text-sm font-semibold transition-colors">
                                Manage
                              </button>
                            ) : (
                              <button className="text-white hover:text-primary text-sm font-semibold transition-colors">
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
        </div>
      </main>
    </div>
  );
};

export default MemberMyEvents;


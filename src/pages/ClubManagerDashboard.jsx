import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import ManagerSidebar from '../components/layout/ManagerSidebar';
import Loader from '../components/ui/Loader';
import api from '../lib/api';

const ClubManagerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    document.title = 'Club Manager Dashboard - ClubSphere';
  }, []);

  // Fetch clubs
  const { data: clubsData, isLoading: clubsLoading } = useQuery({
    queryKey: ['managerClubs'],
    queryFn: async () => {
      const response = await api.get('/api/manager/clubs');
      return response.data;
    }
  });

  // Fetch events
  const { data: eventsData, isLoading: eventsLoading } = useQuery({
    queryKey: ['managerEvents'],
    queryFn: async () => {
      const response = await api.get('/api/manager/events?filter=all');
      return response.data;
    }
  });

  const clubs = clubsData?.clubs || [];
  const events = eventsData?.events || [];

  // Format date helper (moved before use)
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  // Fetch recent activity (registrations and memberships)
  const { data: activityData, isLoading: activityLoading } = useQuery({
    queryKey: ['managerActivity', clubs.length, events.length],
    queryFn: async () => {
      const allActivity = [];

      // Use already fetched events data - get recent events
      const recentEvents = events
        .filter(event => event.createdAt) // Only events with createdAt
        .sort((a, b) => {
          const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return timeB - timeA; // Most recent first
        })
        .slice(0, 3)
        .map(event => {
          const club = clubs.find(c => (c.id || c._id) === event.clubId || (c.id || c._id) === event.clubId?.toString());
          const eventTimestamp = event.createdAt ? new Date(event.createdAt) : new Date(event.date || Date.now());
          return {
            type: 'event',
            eventName: event.name,
            clubName: club?.name || 'Unknown Club',
            date: formatDate(event.date || event.createdAt),
            timestamp: eventTimestamp
          };
        });
      allActivity.push(...recentEvents);

      // Fetch recent registrations for upcoming events only (limit to 3 most recent events)
      const upcomingEventIds = events
        .filter(event => {
          if (!event.date) return false;
          return new Date(event.date) >= new Date();
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 3)
        .map(event => event.id || event._id);

      for (const eventId of upcomingEventIds) {
        try {
          const regResponse = await api.get(`/api/manager/events/${eventId}/registrations?limit=5&page=1`);
          const registrations = regResponse.data.registrations || [];
          const event = events.find(e => (e.id || e._id) === eventId);
          registrations.forEach(reg => {
            // Parse formatted date string (e.g., "Jan 1, 2024") or use current time as fallback
            let regTimestamp = new Date();
            if (reg.registrationDate) {
              // Try to parse formatted date string
              const parsed = new Date(reg.registrationDate);
              if (!isNaN(parsed.getTime())) {
                regTimestamp = parsed;
              }
            }
            allActivity.push({
              type: 'registration',
              eventName: event?.name || 'Unknown Event',
              userName: reg.name,
              date: reg.registrationDate,
              timestamp: regTimestamp
            });
          });
        } catch (error) {
          // Skip if event doesn't exist or access denied
          console.error(`Error fetching registrations for event ${eventId}:`, error);
        }
      }

      // Fetch recent memberships for clubs (limit to 3 most recent clubs)
      const recentClubIds = clubs
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 3)
        .map(club => club.id || club._id);

      for (const clubId of recentClubIds) {
        try {
          const membersResponse = await api.get(`/api/manager/clubs/${clubId}/members?limit=5&page=1`);
          const members = membersResponse.data.members || [];
          const club = clubs.find(c => (c.id || c._id) === clubId);
          members.forEach(member => {
            // Parse formatted date string (e.g., "Jan 1, 2024") or use current time as fallback
            let memberTimestamp = new Date();
            if (member.joinDate) {
              // Try to parse formatted date string
              const parsed = new Date(member.joinDate);
              if (!isNaN(parsed.getTime())) {
                memberTimestamp = parsed;
              }
            }
            allActivity.push({
              type: 'membership',
              clubName: club?.name || 'Unknown Club',
              userName: member.name,
              date: member.joinDate,
              timestamp: memberTimestamp
            });
          });
        } catch (error) {
          // Skip if club doesn't exist or access denied
          console.error(`Error fetching members for club ${clubId}:`, error);
        }
      }

      // Sort by timestamp (most recent first) and return all activities
      // We'll display only top 6 in the UI, but keep all for "View All" functionality
      const sortedActivity = allActivity.sort((a, b) => {
        const timeA = a.timestamp instanceof Date && !isNaN(a.timestamp.getTime()) 
          ? a.timestamp.getTime() 
          : (a.timestamp ? new Date(a.timestamp).getTime() : 0);
        const timeB = b.timestamp instanceof Date && !isNaN(b.timestamp.getTime()) 
          ? b.timestamp.getTime() 
          : (b.timestamp ? new Date(b.timestamp).getTime() : 0);
        
        // If timestamps are equal or invalid, maintain order (backend already sorts correctly)
        if (timeA === timeB || (timeA === 0 && timeB === 0)) {
          return 0;
        }
        
        return timeB - timeA; // Descending order (most recent first)
      });
      
      return { 
        activity: sortedActivity
      };
    },
    enabled: !clubsLoading && !eventsLoading && clubs.length > 0, // Only fetch after clubs and events are loaded
    staleTime: 30000 // Cache for 30 seconds
  });

  // Combined loading state - show single loader if any query is loading
  const isLoading = clubsLoading || eventsLoading || activityLoading;

  // Calculate stats - use real revenue from API
  const stats = {
    totalClubs: clubs.length,
    totalMembers: clubs.reduce((sum, club) => sum + (club.memberCount || 0), 0),
    totalEvents: events.length,
    revenue: eventsData?.stats?.revenue || 0 // Use real revenue from API
  };

  // Get upcoming events (next 5)
  const now = new Date();
  const upcomingEvents = events
    .filter(event => {
      if (!event.date) return false;
      const eventDate = new Date(event.date);
      return eventDate >= now;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  // Get status badge
  const getStatusBadge = (event) => {
    if (!event.date) {
      return { text: 'Draft', color: 'yellow' };
    }
    const eventDate = new Date(event.date);
    const now = new Date();
    if (eventDate < now) {
      return { text: 'Past', color: 'gray' };
    }
    if (event.status === 'draft') {
      return { text: 'Draft', color: 'yellow' };
    }
    return { text: 'Published', color: 'green' };
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white antialiased">
      {/* Sidebar */}
      <ManagerSidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Header */}
        <header className="h-20 flex items-center justify-between px-8 py-4 border-b border-white/10 shrink-0 bg-background-light dark:bg-background-dark z-20">
          <div className="lg:hidden flex items-center gap-3 text-slate-900 dark:text-white">
            <button className="p-2"><span className="material-symbols-outlined">menu</span></button>
            <span className="font-bold text-lg">ClubSphere</span>
          </div>
          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-lg mx-auto">
            <div className="relative w-full group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors material-symbols-outlined">search</span>
              <input 
                className="w-full h-12 bg-white dark:bg-surface-dark border-none rounded-full pl-12 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-primary/50 transition-all shadow-sm" 
                placeholder="Search clubs, members, or events..." 
                type="text"
              />
            </div>
          </div>
          {/* Right Actions */}
          <div className="flex items-center gap-4 ml-auto pl-4">
            <button className="size-10 rounded-full bg-white dark:bg-surface-dark text-slate-600 dark:text-slate-300 hover:text-primary flex items-center justify-center transition-colors relative">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-2.5 right-2.5 size-2 bg-primary rounded-full border-2 border-surface-dark"></span>
            </button>
            <button 
              onClick={() => navigate('/dashboard/club-manager/events')}
              className="hidden sm:flex h-10 px-4 rounded-full bg-primary hover:bg-green-400 text-background-dark font-bold text-sm items-center gap-2 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              <span>Create Event</span>
            </button>
            <div className="h-8 w-px bg-white/10 dark:bg-slate-700"></div>
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 bg-white dark:bg-surface-dark hover:bg-gray-100 dark:hover:bg-surface-highlight transition-colors border border-gray-200 dark:border-surface-highlight"
              >
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user?.name || 'Club Manager avatar'}
                    className="size-8 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const fallback = e.target.nextElementSibling;
                      if (fallback) fallback.style.display = 'block';
                    }}
                  />
                ) : null}
                <div 
                  className={`size-8 rounded-full bg-cover bg-center ${user?.photoURL ? 'hidden' : ''}`}
                  style={{ 
                    backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCNwpKexkQoH8Xkuy2O1snTYiTknRQAjz97o6b88t752G8E3mZsKh54V3DZ_VsjMZUyA-EJXBgxHeD0HT22VXYXzwHVG7L8Uj3zEbNVsHB09oa8P06qRUaHRmnwZ8KZAGdSlqki5uplSH3MlQaU3PJoUnp_8wh7eYGGsS-dQAGzTkocaoa5OwAOClkkS7P7D4JVRJZbjtNFileMLE7t9U5h5LGtmBiz2SooNzps4u3rJd83jA8JHm1820HEeZ-E_eXOPUAS0CKvh7k3")',
                    backgroundColor: '#1c2620'
                  }}
                ></div>
                <span className="text-sm font-medium text-slate-900 dark:text-white hidden sm:block">{user?.name || 'Club Manager'}</span>
                <span className={`material-symbols-outlined text-slate-600 dark:text-gray-400 text-[18px] hidden sm:block transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}>expand_more</span>
              </button>
              
              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-white/10 shadow-lg z-50 overflow-hidden">
                  <div className="py-1">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-white/5">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{user?.name || 'Club Manager'}</p>
                      <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">{user?.email || ''}</p>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left text-sm text-slate-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors flex items-center gap-3"
                    >
                      <span className="material-symbols-outlined text-lg">logout</span>
                      <span>Log out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <Loader />
            </div>
          ) : (
          <div className="max-w-7xl mx-auto space-y-8 pb-10">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 text-slate-900 dark:text-white">Welcome back, {user?.name?.split(' ')[0] || 'Manager'} 👋</h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-2xl">Here is the latest performance overview for your managed clubs and recent activity.</p>
              </div>
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Last updated: {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Stat Card 1 */}
              <div className="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-sm flex flex-col justify-between h-40 group hover:ring-1 hover:ring-primary/30 transition-all">
                <div className="flex justify-between items-start">
                  <div className="size-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <span className="material-symbols-outlined">flag</span>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/5 text-slate-400">Active</span>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Managed Clubs</p>
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalClubs}</h3>
                </div>
              </div>

              {/* Stat Card 2 */}
              <div className="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-sm flex flex-col justify-between h-40 group hover:ring-1 hover:ring-primary/30 transition-all">
                <div className="flex justify-between items-start">
                  <div className="size-10 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined">groups</span>
                  </div>
                  <div className="flex items-center gap-1 text-primary bg-primary/10 px-2 py-1 rounded-full text-xs font-bold">
                    <span className="material-symbols-outlined text-xs">trending_up</span>
                    <span>12%</span>
                  </div>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Total Members</p>
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                    {stats.totalMembers.toLocaleString()}
                  </h3>
                </div>
              </div>

              {/* Stat Card 3 */}
              <div className="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-sm flex flex-col justify-between h-40 group hover:ring-1 hover:ring-primary/30 transition-all">
                <div className="flex justify-between items-start">
                  <div className="size-10 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center">
                    <span className="material-symbols-outlined">calendar_month</span>
                  </div>
                  <div className="flex items-center gap-1 text-primary bg-primary/10 px-2 py-1 rounded-full text-xs font-bold">
                    <span className="material-symbols-outlined text-xs">add</span>
                    <span>2 New</span>
                  </div>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Events Created</p>
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalEvents}</h3>
                </div>
              </div>

              {/* Stat Card 4 */}
              <div className="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-sm flex flex-col justify-between h-40 group hover:ring-1 hover:ring-primary/30 transition-all">
                <div className="flex justify-between items-start">
                  <div className="size-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <span className="material-symbols-outlined">payments</span>
                  </div>
                  {stats.revenue > 0 && (
                    <div className="flex items-center gap-1 text-primary bg-primary/10 px-2 py-1 rounded-full text-xs font-bold">
                      <span className="material-symbols-outlined text-xs">trending_up</span>
                      <span>Active</span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Total Revenue</p>
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                    ৳{stats.revenue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </h3>
                </div>
              </div>
            </div>

            {/* Split Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Main Left Column */}
              <div className="xl:col-span-2 space-y-6">
                {/* Active Clubs Section */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Your Clubs</h3>
                    <Link to="/dashboard/club-manager/clubs" className="text-primary text-sm font-bold hover:underline">
                      View All
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {clubs.slice(0, 4).map((club) => (
                        <Link
                          key={club.id || club._id}
                          to={`/dashboard/club-manager/clubs/${club.id || club._id}`}
                          className="bg-white dark:bg-surface-dark rounded-xl p-4 flex gap-4 items-center group cursor-pointer hover:bg-white/5 border border-transparent hover:border-primary/20 transition-all"
                        >
                          <div 
                            className="size-20 rounded-lg bg-cover bg-center shrink-0"
                            style={{ backgroundImage: club.image ? `url("${club.image}")` : 'none', backgroundColor: '#1c2620' }}
                          ></div>
                          <div className="flex flex-col flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <h4 className="font-bold text-lg text-slate-900 dark:text-white truncate">{club.name}</h4>
                              <span className="material-symbols-outlined text-slate-500 hover:text-primary transition-colors">more_horiz</span>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2 truncate">{club.description || 'No description'}</p>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-slate-400">{club.memberCount || 0} members</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                      {clubs.length === 0 && (
                        <div className="md:col-span-2 rounded-xl border-2 border-dashed border-slate-700 text-slate-500 p-8 flex flex-col items-center justify-center gap-2 min-h-[100px]">
                          <span className="material-symbols-outlined text-4xl">flag</span>
                          <p className="font-bold">No clubs yet</p>
                          <p className="text-sm">Create your first club to get started</p>
                        </div>
                      )}
                    </div>
                </div>

                {/* Upcoming Events Table */}
                <div className="bg-white dark:bg-surface-dark rounded-xl overflow-hidden shadow-sm">
                  <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Upcoming Events</h3>
                    <button className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-base">filter_list</span> Filter
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-black/5 dark:bg-black/20 text-xs uppercase text-slate-500">
                        <tr>
                          <th className="px-6 py-4 font-semibold tracking-wider">Event Name</th>
                          <th className="px-6 py-4 font-semibold tracking-wider">Club</th>
                          <th className="px-6 py-4 font-semibold tracking-wider">Date</th>
                          <th className="px-6 py-4 font-semibold tracking-wider">Status</th>
                          <th className="px-6 py-4 font-semibold tracking-wider text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-sm">
                        {upcomingEvents.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                              No upcoming events
                            </td>
                          </tr>
                        ) : (
                          upcomingEvents.map((event) => {
                            const statusBadge = getStatusBadge(event);
                            // Find club name
                            const club = clubs.find(c => (c.id || c._id) === event.clubId || (c.id || c._id) === event.clubId?.toString());
                            return (
                              <tr key={event.id || event._id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{event.name}</td>
                                <td className="px-6 py-4 text-slate-500">{club?.name || 'Unknown Club'}</td>
                                <td className="px-6 py-4 text-slate-500">{formatDate(event.date)}</td>
                                <td className="px-6 py-4">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    statusBadge.color === 'green' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                    statusBadge.color === 'yellow' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                                    'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                                  }`}>
                                    {statusBadge.text}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <Link 
                                    to={`/dashboard/club-manager/events/${event.id || event._id}/registrations`}
                                    className="text-slate-400 hover:text-white"
                                  >
                                    <span className="material-symbols-outlined">edit</span>
                                  </Link>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right Column: Recent Activity Feed */}
              <div className="xl:col-span-1 space-y-6">
                <div className="bg-white dark:bg-surface-dark rounded-xl p-6 h-full shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Recent Activity</h3>
                  <div className="relative pl-4 border-l border-white/10 space-y-8">
                    {activityData?.activity && activityData.activity.length > 0 ? (
                      activityData.activity.slice(0, 6).map((activity, index) => (
                        <div key={`${activity.type}-${index}-${activity.timestamp?.getTime() || index}`} className="relative">
                          <div className={`absolute -left-[21px] top-1 size-3 rounded-full border-2 border-surface-dark ${
                            index === 0 ? 'bg-primary' : 'bg-slate-600'
                          }`}></div>
                          <div className="flex flex-col gap-1">
                            <p className="text-sm text-slate-300">
                              {activity.type === 'registration' && (
                                <>
                                  <span className="font-medium text-white">{activity.userName}</span>
                                  {' '}registered for{' '}
                                  <span className="font-medium text-white">{activity.eventName}</span>
                                </>
                              )}
                              {activity.type === 'membership' && (
                                <>
                                  <span className="font-medium text-white">{activity.userName}</span>
                                  {' '}joined{' '}
                                  <span className="font-medium text-white">{activity.clubName}</span>
                                </>
                              )}
                              {activity.type === 'event' && (
                                <>
                                  New event{' '}
                                  <span className="font-medium text-white">{activity.eventName}</span>
                                  {' '}created
                                </>
                              )}
                            </p>
                            <span className="text-xs text-slate-500">
                              {activity.date || formatDate(activity.timestamp)}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : activityLoading ? (
                      <div className="text-sm text-slate-500 text-center py-4">
                        Loading activity...
                      </div>
                    ) : (
                      <div className="text-sm text-slate-500 text-center py-4">
                        No recent activity
                      </div>
                    )}
                  </div>
                  {activityData?.activity && activityData.activity.length > 6 && (
                    <button 
                      onClick={() => setActivityModalOpen(true)}
                      className="w-full mt-8 py-3 rounded-full border border-white/10 text-sm font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-center"
                    >
                      View All Activities ({activityData.activity.length})
                    </button>
                  )}
                  {(!activityData?.activity || activityData.activity.length <= 6) && (
                    <Link 
                      to="/dashboard/club-manager/events"
                      className="w-full mt-8 py-3 rounded-full border border-white/10 text-sm font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-center"
                    >
                      View All Events
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
          )}
        </div>
      </main>

      {/* Activity Modal */}
      {activityModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setActivityModalOpen(false)}
        >
          <div 
            className="bg-white dark:bg-surface-dark rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">All Activities</h2>
              <button
                onClick={() => setActivityModalOpen(false)}
                className="size-8 rounded-full bg-white dark:bg-surface-highlight text-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activityData?.activity && activityData.activity.length > 0 ? (
                <div className="relative pl-4 border-l border-white/10 space-y-6">
                  {activityData.activity.map((activity, index) => (
                    <div key={`${activity.type}-${index}-${activity.timestamp?.getTime() || index}`} className="relative">
                      <div className={`absolute -left-[21px] top-1 size-3 rounded-full border-2 border-surface-dark ${
                        index === 0 ? 'bg-primary' : 'bg-slate-600'
                      }`}></div>
                      <div className="flex flex-col gap-1">
                        <p className="text-sm text-slate-300">
                          {activity.type === 'registration' && (
                            <>
                              <span className="font-medium text-white">{activity.userName}</span>
                              {' '}registered for{' '}
                              <span className="font-medium text-white">{activity.eventName}</span>
                            </>
                          )}
                          {activity.type === 'membership' && (
                            <>
                              <span className="font-medium text-white">{activity.userName}</span>
                              {' '}joined{' '}
                              <span className="font-medium text-white">{activity.clubName}</span>
                            </>
                          )}
                          {activity.type === 'event' && (
                            <>
                              New event{' '}
                              <span className="font-medium text-white">{activity.eventName}</span>
                              {' '}created
                              {activity.clubName && (
                                <> in <span className="font-medium text-white">{activity.clubName}</span></>
                              )}
                            </>
                          )}
                        </p>
                        <span className="text-xs text-slate-500">
                          {activity.date || formatDate(activity.timestamp)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-slate-500 text-center py-8">
                  No activities found
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-white/10">
              <button
                onClick={() => setActivityModalOpen(false)}
                className="w-full py-3 rounded-full bg-primary hover:bg-primary-hover text-background-dark font-bold text-sm transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClubManagerDashboard;


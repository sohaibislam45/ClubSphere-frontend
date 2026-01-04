import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import MemberSidebar from '../components/layout/MemberSidebar';
import Loader from '../components/ui/Loader';
import api from '../lib/api';
import Swal from '../lib/sweetalertConfig';

const MemberDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    document.title = 'Member Dashboard - ClubSphere';
  }, []);

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

  // Fetch clubs
  const { data: clubsData, isLoading: clubsLoading } = useQuery({
    queryKey: ['memberClubs'],
    queryFn: async () => {
      const response = await api.get('/api/member/clubs');
      return response.data;
    }
  });

  // Fetch registered events (my-joining tab)
  const { data: registeredEventsData, isLoading: registeredEventsLoading } = useQuery({
    queryKey: ['memberRegisteredEvents'],
    queryFn: async () => {
      const response = await api.get('/api/member/events?tab=my-joining');
      return response.data;
    }
  });

  // Fetch all upcoming events
  const { data: upcomingEventsData, isLoading: upcomingEventsLoading } = useQuery({
    queryKey: ['memberUpcomingEvents'],
    queryFn: async () => {
      const response = await api.get('/api/member/events?tab=upcoming');
      return response.data;
    }
  });

  // Fetch past events for attended count
  const { data: pastEventsData } = useQuery({
    queryKey: ['memberPastEvents'],
    queryFn: async () => {
      const response = await api.get('/api/member/events?tab=joined');
      return response.data;
    }
  });

  // Fetch payments
  const { data: paymentsData, isLoading: paymentsLoading } = useQuery({
    queryKey: ['memberPayments'],
    queryFn: async () => {
      const response = await api.get('/api/member/payments');
      return response.data;
    }
  });

  const clubs = clubsData?.clubs || [];
  const registeredEvents = registeredEventsData?.events || [];
  const upcomingEvents = upcomingEventsData?.events || [];
  const pastEvents = pastEventsData?.events || [];
  const payments = paymentsData?.transactions || [];

  // Combined loading state - show single loader if any query is loading
  const isLoading = clubsLoading || registeredEventsLoading || upcomingEventsLoading || paymentsLoading;

  // Calculate statistics
  const stats = {
    totalClubs: clubs.length,
    eventsRegistered: registeredEvents.length,
    eventsAttended: pastEvents.length,
    nextPayment: payments.length > 0 ? payments[0] : null
  };

  // Format date for display
  const formatEventDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const eventDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const tomorrowDate = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());
    
    if (eventDate.getTime() === todayDate.getTime()) {
      return 'TODAY';
    } else if (eventDate.getTime() === tomorrowDate.getTime()) {
      return 'TOMORROW';
    } else {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
    }
  };

  // Get upcoming events to display (up to 3)
  const displayEvents = upcomingEvents.slice(0, 3);

  return (
    <div className="bg-dashboard-background dark:bg-background-dark text-dashboard-text-main dark:text-white font-display overflow-hidden h-screen flex">
      <MemberSidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-dashboard-background dark:bg-background-dark">
        {/* Top Navigation Bar */}
        <header className="h-20 shrink-0 border-b border-dashboard-border dark:border-white/5 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md z-10 sticky top-0 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4 lg:hidden">
            <button className="text-dashboard-text-main dark:text-white">
              <span className="material-symbols-outlined">menu</span>
            </button>
            <h2 className="text-dashboard-text-main dark:text-white text-lg font-bold">Dashboard</h2>
          </div>
          <div className="hidden lg:flex flex-col">
            <h2 className="text-dashboard-text-main dark:text-white text-xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-dashboard-text-muted dark:text-gray-400 text-xs">Overview</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center bg-dashboard-surface-hover dark:bg-surface-dark h-12 rounded-full px-4 w-80 border border-dashboard-border dark:border-white/5 focus-within:border-dashboard-primary dark:focus-within:border-primary/50 focus-within:bg-white dark:focus-within:bg-surface-dark focus-within:ring-2 focus-within:ring-dashboard-primary/10 dark:focus-within:ring-primary/10 transition-all">
              <span className="material-symbols-outlined text-dashboard-text-muted dark:text-gray-400">search</span>
              <input 
                className="bg-transparent border-none focus:ring-0 text-dashboard-text-main dark:text-white placeholder-dashboard-text-muted dark:placeholder-gray-500 w-full ml-2 text-sm font-medium" 
                placeholder="Search clubs, events..." 
                type="text"
              />
            </div>
            <div className="flex items-center gap-4">
              <button className="size-10 rounded-full bg-white dark:bg-surface-dark border border-dashboard-border dark:border-white/10 text-dashboard-text-muted dark:text-gray-400 hover:text-dashboard-primary dark:hover:text-white hover:bg-dashboard-surface-hover dark:hover:bg-surface-dark-hover flex items-center justify-center transition-colors relative shadow-sm">
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>notifications</span>
                <span className="absolute top-2.5 right-2.5 size-2 bg-red-500 rounded-full border border-white dark:border-surface-dark"></span>
              </button>
              <div className="h-8 w-px bg-dashboard-border dark:bg-white/10"></div>
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 group"
                >
                  {user?.photoURL ? (
                    <img
                      key={user.photoURL} // Force re-render when photoURL changes
                      src={user.photoURL}
                      alt={user?.name || 'User avatar'}
                      className="size-10 rounded-full object-cover border-2 border-transparent group-hover:border-primary transition-all shrink-0"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      onError={(e) => {
                        console.error('Failed to load Google photo:', user.photoURL);
                        console.error('Error event:', e);
                        // Only fallback if it's actually the Google photo that failed
                        if (e.target.src === user.photoURL) {
                          e.target.src = 'https://lh3.googleusercontent.com/aida-public/AB6AXuA905HuwzoL3J6Hn0Sl4XIIJzbR6IPNZbPOMGRUaFXfkY2aBHeN-VxHwYW4dhAJhgtUHW4DdNBaeFGOCxDkNYmguRofHkXkgTONLxG8Twyt9srdWrXmqamsThx_w9SGvHV4fxnZ6VA6zW6EQJBFnVcEQ9PDbnGGTuoAIZ0-T0gnO6dLwbu1ql6BxoEbyHZP1a71z_eEVtaksinsi6LWEmv4KqhZi6gLJ-7q9XaofobfY-pHbyUlLd_VNzJwzhmyxvA7Iz_DLv8tkUro';
                        }
                      }}
                    />
                  ) : (
                    <div 
                      className="size-10 rounded-full bg-cover bg-center border-2 border-transparent group-hover:border-primary transition-all shrink-0"
                      style={{ 
                        backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA905HuwzoL3J6Hn0Sl4XIIJzbR6IPNZbPOMGRUaFXfkY2aBHeN-VxHwYW4dhAJhgtUHW4DdNBaeFGOCxDkNYmguRofHkXkgTONLxG8Twyt9srdWrXmqamsThx_w9SGvHV4fxnZ6VA6zW6EQJBFnVcEQ9PDbnGGTuoAIZ0-T0gnO6dLwbu1ql6BxoEbyHZP1a71z_eEVtaksinsi6LWEmv4KqhZi6gLJ-7q9XaofobfY-pHbyUlLd_VNzJwzhmyxvA7Iz_DLv8tkUro")',
                        backgroundColor: '#1c2620'
                      }}
                    ></div>
                  )}
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-sm font-bold text-dashboard-text-main dark:text-white leading-none group-hover:text-dashboard-primary dark:group-hover:text-primary transition-colors">{user?.name || 'Member'}</span>
                  </div>
                  <span className={`material-symbols-outlined text-dashboard-text-muted dark:text-gray-400 group-hover:text-dashboard-text-main dark:group-hover:text-white transition-all hidden md:block ${dropdownOpen ? 'rotate-180' : ''}`}>expand_more</span>
                </button>
                
                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-surface-dark rounded-xl border border-dashboard-border dark:border-white/10 shadow-lg z-50 overflow-hidden">
                    <div className="py-1">
                      <div className="px-4 py-3 border-b border-dashboard-border dark:border-white/5">
                        <p className="text-sm font-bold text-dashboard-text-main dark:text-white">{user?.name || 'Member'}</p>
                        <p className="text-xs text-dashboard-text-muted dark:text-gray-400 mt-0.5">{user?.email || ''}</p>
                      </div>
                      <button
                        onClick={() => {
                          logout();
                          setDropdownOpen(false);
                        }}
                        className="w-full px-4 py-3 text-left text-sm text-dashboard-text-main dark:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors flex items-center gap-3"
                      >
                        <span className="material-symbols-outlined text-lg">logout</span>
                        <span>Log out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10 scroll-smooth">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <Loader />
            </div>
          ) : (
          <div className="max-w-7xl mx-auto space-y-10 pb-10">
            {/* Welcome Section */}
            <section className="flex flex-col md:flex-row gap-6 items-start md:items-end justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-dashboard-text-main dark:text-white mb-2 tracking-tight">
                  Welcome back, <span className="text-dashboard-primary dark:text-primary">{user?.name?.split(' ')[0] || 'Member'}!</span>
                </h1>
                <p className="text-dashboard-text-muted dark:text-gray-400 text-lg max-w-2xl">
                  {registeredEvents.length > 0 
                    ? `You have ${registeredEvents.length} registered event${registeredEvents.length > 1 ? 's' : ''} coming up. Ready to explore what's new in your area?`
                    : 'Ready to explore what\'s new in your area?'
                  }
                </p>
              </div>
              <Link
                to="/dashboard/member/discover"
                className="bg-dashboard-primary dark:bg-primary hover:bg-dashboard-primary-dark dark:hover:bg-primary-hover text-white font-bold py-3 px-6 rounded-full flex items-center gap-2 transition-all shadow-lg shadow-dashboard-primary/30 dark:shadow-primary/20 shrink-0"
              >
                <span className="material-symbols-outlined">add_circle</span>
                Find New Clubs
              </Link>
            </section>

            {/* Stats Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-dashboard-border dark:border-white/5 shadow-sm flex flex-col gap-1 relative overflow-hidden group hover:border-dashboard-primary/20 dark:hover:border-primary/20 transition-all">
                <div className="flex justify-between items-start mb-2">
                  <div className="bg-blue-50 dark:bg-blue-500/20 text-blue-500 dark:text-blue-400 p-2 rounded-lg border border-blue-100 dark:border-transparent">
                    <span className="material-symbols-outlined">groups</span>
                  </div>
                  <span className="text-dashboard-primary dark:text-primary text-sm font-bold bg-dashboard-primary/10 dark:bg-primary/10 px-2 py-1 rounded-md border border-dashboard-primary/10 dark:border-primary/10">+1 this month</span>
                </div>
                <h3 className="text-dashboard-text-muted dark:text-gray-400 text-sm font-medium">Total Clubs Joined</h3>
                <p className="text-3xl font-bold text-dashboard-text-main dark:text-white">{stats.totalClubs}</p>
              </div>
              <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-dashboard-border dark:border-white/5 shadow-sm flex flex-col gap-1 group hover:border-dashboard-primary/20 dark:hover:border-primary/20 transition-all">
                <div className="flex justify-between items-start mb-2">
                  <div className="bg-purple-50 dark:bg-purple-500/20 text-purple-500 dark:text-purple-400 p-2 rounded-lg border border-purple-100 dark:border-transparent">
                    <span className="material-symbols-outlined">event_available</span>
                  </div>
                  <span className="text-dashboard-primary dark:text-primary text-sm font-bold bg-dashboard-primary/10 dark:bg-primary/10 px-2 py-1 rounded-md border border-dashboard-primary/10 dark:border-primary/10">+2 this week</span>
                </div>
                <h3 className="text-dashboard-text-muted dark:text-gray-400 text-sm font-medium">Events Registered</h3>
                <p className="text-3xl font-bold text-dashboard-text-main dark:text-white">{stats.eventsRegistered}</p>
              </div>
              <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-dashboard-border dark:border-white/5 shadow-sm flex flex-col gap-1 group hover:border-dashboard-primary/20 dark:hover:border-primary/20 transition-all">
                <div className="flex justify-between items-start mb-2">
                  <div className="bg-orange-50 dark:bg-orange-500/20 text-orange-500 dark:text-orange-400 p-2 rounded-lg border border-orange-100 dark:border-transparent">
                    <span className="material-symbols-outlined">history</span>
                  </div>
                </div>
                <h3 className="text-dashboard-text-muted dark:text-gray-400 text-sm font-medium">Events Attended</h3>
                <p className="text-3xl font-bold text-dashboard-text-main dark:text-white">{stats.eventsAttended}</p>
              </div>
              <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-dashboard-border dark:border-white/5 shadow-sm flex flex-col gap-1 group hover:border-dashboard-primary/20 dark:hover:border-primary/20 transition-all">
                <div className="flex justify-between items-start mb-2">
                  <div className="bg-pink-50 dark:bg-pink-500/20 text-pink-500 dark:text-pink-400 p-2 rounded-lg border border-pink-100 dark:border-transparent">
                    <span className="material-symbols-outlined">savings</span>
                  </div>
                </div>
                <h3 className="text-dashboard-text-muted dark:text-gray-400 text-sm font-medium">Next Payment</h3>
                {stats.nextPayment ? (
                  <p className="text-xl font-bold text-dashboard-text-main dark:text-white mt-auto">{stats.nextPayment.date.split(',')[0]}</p>
                ) : (
                  <p className="text-lg font-medium text-dashboard-text-muted dark:text-gray-400 mt-auto">No upcoming</p>
                )}
              </div>
            </section>

            {/* Content Grid: Events & Clubs */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Upcoming Events */}
              <div className="xl:col-span-2 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-dashboard-text-main dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-dashboard-primary dark:text-primary">calendar_clock</span>
                    Upcoming Events
                  </h2>
                  <Link to="/dashboard/member/events" className="text-sm font-bold text-dashboard-primary dark:text-primary hover:text-dashboard-primary-dark dark:hover:text-primary-hover hover:underline">
                    View Calendar
                  </Link>
                </div>
                {displayEvents.length === 0 ? (
                  <div className="bg-white dark:bg-surface-dark border border-dashboard-border dark:border-white/5 rounded-2xl p-12 text-center shadow-sm">
                    <span className="material-symbols-outlined text-6xl text-gray-400 dark:text-gray-600 mb-4 block">event_busy</span>
                    <h3 className="text-xl font-bold text-dashboard-text-main dark:text-white mb-2">No upcoming events</h3>
                    <p className="text-dashboard-text-muted dark:text-gray-400 mb-6">Check out the upcoming tab to see all available events.</p>
                    <Link
                      to="/dashboard/member/events"
                      className="inline-flex items-center gap-2 bg-dashboard-primary dark:bg-primary hover:bg-dashboard-primary-dark dark:hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-full transition-all"
                    >
                      Browse Events
                    </Link>
                  </div>
                ) : (
                  displayEvents.map((event) => {
                    const eventDate = formatEventDate(event.date || event.eventDate);
                    const isRegistered = event.status === 'registered' || event.statusLabel === 'Registered';
                    
                    return (
                      <div 
                        key={event.id || event.eventId} 
                        onClick={() => navigate(`/events/${event.eventId || event.id}`)}
                        className="bg-white dark:bg-surface-dark hover:bg-slate-50 dark:hover:bg-surface-dark-hover border border-dashboard-border dark:border-white/5 hover:border-dashboard-primary/30 dark:hover:border-primary/30 rounded-2xl p-4 flex flex-col sm:flex-row gap-6 transition-all group cursor-pointer shadow-sm hover:shadow-md"
                      >
                        <div 
                          className="w-full sm:w-48 h-32 shrink-0 rounded-xl bg-cover bg-center relative overflow-hidden bg-gray-700"
                          style={{ backgroundImage: event.image ? `url("${event.image}")` : 'none' }}
                        >
                          <div className={`absolute top-2 left-2 bg-white/90 dark:bg-background-dark/80 backdrop-blur-sm text-dashboard-text-main dark:text-white text-xs font-bold px-2 py-1 rounded-md border border-black/5 dark:border-white/10 shadow-sm ${
                            eventDate === 'TODAY' ? '' : ''
                          }`}>
                            {eventDate}
                          </div>
                          {isRegistered && (
                            <div className="absolute top-2 right-2 backdrop-blur-sm bg-dashboard-primary dark:bg-primary/90 text-white text-xs font-bold px-2 py-1 rounded-md">
                              Registered
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col justify-between flex-1 py-1">
                          <div>
                            <div className="flex justify-between items-start">
                              <p className="text-xs font-bold uppercase tracking-wider mb-1 text-dashboard-primary dark:text-primary">{event.clubName || 'Event'}</p>
                              {event.time && (
                                <span className="text-dashboard-text-muted dark:text-gray-400 text-xs flex items-center gap-1">
                                  <span className="material-symbols-outlined text-[16px]">schedule</span> {event.time}
                                </span>
                              )}
                            </div>
                            <h3 className="text-lg font-bold text-dashboard-text-main dark:text-white mb-1 group-hover:text-dashboard-primary dark:group-hover:text-primary transition-colors">{event.name || event.title}</h3>
                            {event.clubName && (
                              <p className="text-dashboard-text-muted dark:text-gray-400 text-sm">Hosted by <span className="text-dashboard-text-main dark:text-white font-semibold">{event.clubName}</span></p>
                            )}
                          </div>
                          {event.location ? (
                            <div className="flex items-center gap-2 mt-4 sm:mt-0 text-dashboard-text-muted dark:text-gray-400 text-xs">
                              <span className="material-symbols-outlined text-[16px]">location_on</span> {event.location}
                            </div>
                          ) : (
                            <div className="mt-4 sm:mt-0">
                              {event.statusLabel && (
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${
                                  event.statusColor === 'primary' ? 'bg-dashboard-primary/20 dark:bg-primary/20 text-dashboard-primary dark:text-primary' :
                                  event.statusColor === 'yellow' ? 'bg-yellow-500/20 text-yellow-500' :
                                  'bg-blue-500/20 text-blue-400'
                                }`}>
                                  {event.statusLabel}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* My Clubs List */}
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-dashboard-text-main dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-dashboard-primary dark:text-primary">diversity_3</span>
                    My Clubs
                  </h2>
                  <Link
                    to="/dashboard/member/clubs"
                    className="size-8 rounded-full bg-white dark:bg-surface-dark border border-dashboard-border dark:border-white/10 flex items-center justify-center text-dashboard-primary dark:text-primary hover:bg-dashboard-primary dark:hover:bg-primary hover:text-white transition-all shadow-sm"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
                  </Link>
                </div>
                <div className="bg-white dark:bg-surface-dark rounded-2xl border border-dashboard-border dark:border-white/5 overflow-hidden shadow-sm">
                    {clubs.length === 0 ? (
                      <div className="p-12 text-center">
                        <span className="material-symbols-outlined text-6xl text-gray-400 dark:text-gray-600 mb-4 block">groups</span>
                        <h3 className="text-lg font-bold text-dashboard-text-main dark:text-white mb-2">No clubs yet</h3>
                        <p className="text-dashboard-text-muted dark:text-gray-400 mb-4">Start exploring and join your first club!</p>
                        <Link
                          to="/dashboard/member/discover"
                          className="inline-flex items-center gap-2 bg-dashboard-primary dark:bg-primary hover:bg-dashboard-primary-dark dark:hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-full transition-all text-sm"
                        >
                          Discover Clubs
                        </Link>
                      </div>
                    ) : (
                      clubs.slice(0, 5).map((club, index) => (
                        <div 
                          key={club.id || club.clubId} 
                          onClick={() => navigate(`/clubs/${club.clubId || club.id}`)}
                          className={`p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer ${
                            index < Math.min(clubs.length, 5) - 1 ? 'border-b border-dashboard-border dark:border-white/5' : ''
                          }`}
                        >
                          <div 
                            className={`size-12 rounded-xl bg-cover bg-center bg-gray-700 shadow-sm ${club.status === 'pending' || club.statusLabel === 'Pending' ? 'grayscale opacity-70 border border-dashboard-border dark:border-gray-700' : ''}`}
                            style={{ backgroundImage: club.image ? `url("${club.image}")` : 'none' }}
                          ></div>
                          <div className="flex-1 min-w-0">
                            <h4 className={`font-bold text-sm truncate ${club.status === 'pending' || club.statusLabel === 'Pending' ? 'text-dashboard-text-muted dark:text-gray-300' : 'text-dashboard-text-main dark:text-white'}`}>{club.name}</h4>
                            <p className={`text-xs truncate ${club.status === 'pending' || club.statusLabel === 'Pending' ? 'text-dashboard-text-muted dark:text-gray-500' : 'text-dashboard-text-muted dark:text-gray-400'}`}>
                              {club.joinDate ? `Member since ${club.joinDate.split(',')[1]?.trim() || club.joinDate}` : 'Member'}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded-md text-xs font-bold border shrink-0 ${
                            club.status === 'active' || club.statusLabel === 'Active'
                              ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-500 border-green-100 dark:border-green-500/20'
                              : club.status === 'pending' || club.statusLabel === 'Pending'
                              ? 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border-yellow-100 dark:border-yellow-500/20'
                              : 'bg-gray-500/10 text-gray-500 border-gray-500/20'
                          }`}>{club.statusLabel || club.status || 'Active'}</span>
                        </div>
                      ))
                    )}
                </div>
              </div>
            </div>

            {/* Recent Payments Section */}
            <section className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-dashboard-text-main dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-dashboard-primary dark:text-primary">receipt_long</span>
                  Payment History
                </h2>
                <Link to="/dashboard/member/payments" className="text-sm text-dashboard-text-muted dark:text-gray-400 hover:text-dashboard-text-main dark:hover:text-white transition-colors font-medium">
                  See all
                </Link>
              </div>
              <div className="bg-white dark:bg-surface-dark rounded-2xl border border-dashboard-border dark:border-white/5 overflow-x-auto shadow-sm">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead>
                    <tr className="text-dashboard-text-muted dark:text-gray-400 border-b border-dashboard-border dark:border-white/5 bg-slate-50 dark:bg-slate-800/50">
                      <th className="px-6 py-4 font-medium">Description</th>
                      <th className="px-6 py-4 font-medium">Club</th>
                      <th className="px-6 py-4 font-medium">Date</th>
                      <th className="px-6 py-4 font-medium">Amount</th>
                      <th className="px-6 py-4 font-medium text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-dashboard-text-main dark:text-white divide-y divide-dashboard-border dark:divide-white/5">
                    {payments.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center">
                          <span className="material-symbols-outlined text-6xl text-gray-400 dark:text-gray-600 mb-4 block">receipt_long</span>
                          <p className="text-dashboard-text-muted dark:text-gray-400">No payment history</p>
                        </td>
                      </tr>
                    ) : (
                      payments.slice(0, 5).map((payment) => {
                        const clubName = payment.description.includes(' - ') 
                          ? payment.description.split(' - ')[1] 
                          : payment.description.includes('Membership') || payment.description.includes('Event')
                          ? payment.description.split(' ')[0] + ' ' + (payment.description.split(' ')[1] || '')
                          : '';
                        const descriptionOnly = payment.description.includes(' - ')
                          ? payment.description.split(' - ')[0]
                          : payment.description;

                        return (
                          <tr key={payment.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 font-bold flex items-center gap-3">
                              <div className="bg-slate-100 dark:bg-white/10 text-dashboard-text-muted dark:text-gray-400 p-2 rounded-lg">
                                <span className="material-symbols-outlined text-sm">{payment.icon || 'receipt_long'}</span>
                              </div>
                              {descriptionOnly}
                            </td>
                            <td className="px-6 py-4 text-dashboard-text-muted dark:text-gray-400">{clubName || '-'}</td>
                            <td className="px-6 py-4 text-dashboard-text-muted dark:text-gray-400">{payment.date}</td>
                            <td className="px-6 py-4 font-mono font-medium">{payment.amount}</td>
                            <td className="px-6 py-4 text-right">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-500/20 ${
                                payment.status === 'success' || payment.status === 'Paid'
                                  ? ''
                                  : payment.status === 'pending' || payment.status === 'Pending'
                                  ? 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-100 dark:border-yellow-500/20'
                                  : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-100 dark:border-red-500/20'
                              }`}>
                                {payment.status === 'success' && <span className="size-1.5 rounded-full bg-green-500"></span>}
                                {payment.statusLabel || payment.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <footer className="pt-10 pb-4 text-center text-xs text-dashboard-text-muted dark:text-gray-500">
              © 2023 ClubSphere. All rights reserved.
            </footer>
          </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MemberDashboard;


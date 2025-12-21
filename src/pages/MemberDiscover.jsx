import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MemberSidebar from '../components/layout/MemberSidebar';
import Loader from '../components/ui/Loader';
import api from '../lib/api';
import Swal from '../lib/sweetalertConfig';

const MemberDiscover = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [filter, setFilter] = useState('');
  const [joiningClubId, setJoiningClubId] = useState(null);
  const [rsvpingEventId, setRsvpingEventId] = useState(null);

  useEffect(() => {
    document.title = 'Discover Clubs - ClubSphere';
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ['discover', search, category, filter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      if (filter) params.append('filter', filter);
      
      const response = await api.get(`/api/member/discover?${params.toString()}`);
      return response.data;
    }
  });

  const topPicks = data?.topPicks || [];
  const events = data?.events || [];

  const handleFilterClick = (filterType) => {
    if (filter === filterType) {
      setFilter('');
    } else {
      setFilter(filterType);
    }
  };

  const handleJoinClub = async (clubId, clubName) => {
    if (!isAuthenticated()) {
      Swal.fire({
        icon: 'info',
        title: 'Login Required',
        text: 'Please login to join this club.',
        showCancelButton: true,
        confirmButtonText: 'Login',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login', { state: { returnTo: '/dashboard/member/discover' } });
        }
      });
      return;
    }

    setJoiningClubId(clubId);
    try {
      // Check if club has membership fee by fetching club details
      const clubResponse = await api.get(`/api/clubs/${clubId}`);
      const club = clubResponse.data;

      // If club has membership fee, navigate to checkout
      if (club.membershipFee > 0) {
        navigate(`/clubs/${clubId}/checkout`);
        return;
      }

      // If club is free, register directly
      const response = await api.post('/api/payments/club/register-free', {
        clubId: clubId
      });

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Welcome to the Club!',
          text: `You have successfully joined ${clubName}.`,
          timer: 3000,
          showConfirmButton: false
        });
        
        // Refetch discover data to update the UI
        queryClient.invalidateQueries({ queryKey: ['discover'] });
      }
    } catch (error) {
      console.error('Join club error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Join Failed',
        text: error.response?.data?.error || 'Failed to join this club. Please try again.',
      });
    } finally {
      setJoiningClubId(null);
    }
  };

  const handleViewClub = (clubId) => {
    navigate(`/clubs/${clubId}`);
  };

  const handleRSVP = async (eventId, eventName) => {
    if (!isAuthenticated()) {
      Swal.fire({
        icon: 'info',
        title: 'Login Required',
        text: 'Please login to register for this event.',
        showCancelButton: true,
        confirmButtonText: 'Login',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login', { state: { returnTo: '/dashboard/member/discover' } });
        }
      });
      return;
    }

    setRsvpingEventId(eventId);
    try {
      // Check if event has fee by fetching event details
      const eventResponse = await api.get(`/api/events/${eventId}`);
      const event = eventResponse.data;

      // If event has a fee, navigate to checkout
      if (event.eventFee > 0) {
        navigate(`/events/${eventId}/checkout`);
        return;
      }

      // If event is free, register directly
      const response = await api.post('/api/payments/register-free', {
        eventId: eventId
      });

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful!',
          text: `You have successfully registered for ${eventName}.`,
          timer: 3000,
          showConfirmButton: false
        });
        
        // Refetch discover data to update the UI
        queryClient.invalidateQueries({ queryKey: ['discover'] });
      }
    } catch (error) {
      console.error('RSVP error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: error.response?.data?.error || 'Failed to register for this event. Please try again.',
      });
    } finally {
      setRsvpingEventId(null);
    }
  };


  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-gray-900 dark:text-white min-h-screen flex overflow-hidden">
      <MemberSidebar />
      
      <main className="flex-1 overflow-y-auto h-screen relative bg-background-light dark:bg-background-dark">
        {/* Header & Search Section */}
        <div className="max-w-7xl mx-auto px-8 pt-8 pb-6">
          <div className="flex flex-col gap-6">
            {/* Greeting */}
            <div>
              <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white mb-2">
                Discover new passions, {user?.name?.split(' ')[0] || 'Member'}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Explore local clubs and events happening around you.
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="relative w-full max-w-2xl">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-gray-400">search</span>
              </div>
              <input
                className="block w-full pl-12 pr-4 py-4 rounded-xl bg-white dark:bg-surface-dark border-transparent focus:border-primary focus:bg-white dark:focus:bg-surface-dark focus:ring-0 text-gray-900 dark:text-white focus:text-gray-900 dark:focus:text-white placeholder-gray-500 transition-all shadow-sm"
                placeholder="Search clubs, events, or interests..."
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            {/* Filter Chips */}
            <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
              <button
                onClick={() => handleFilterClick('trending')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm hover:bg-primary/90 transition-colors whitespace-nowrap ${
                  filter === 'trending'
                    ? 'bg-primary text-background-dark'
                    : 'bg-white dark:bg-surface-dark border border-gray-200 dark:border-transparent text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-surface-dark-alt2'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">local_fire_department</span>
                Trending
              </button>
              <button
                onClick={() => handleFilterClick('near_me')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-colors whitespace-nowrap ${
                  filter === 'near_me'
                    ? 'bg-primary text-background-dark font-bold'
                    : 'bg-white dark:bg-surface-dark border border-gray-200 dark:border-transparent text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-surface-dark-alt2'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">location_on</span>
                Near Me
              </button>
              <button
                onClick={() => setCategory(category === 'Sports' ? '' : 'Sports')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-colors whitespace-nowrap ${
                  category === 'Sports'
                    ? 'bg-primary text-background-dark font-bold'
                    : 'bg-white dark:bg-surface-dark border border-gray-200 dark:border-transparent text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-surface-dark-alt2'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">sports_soccer</span>
                Sports
              </button>
              <button
                onClick={() => setCategory(category === 'Tech' ? '' : 'Tech')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-colors whitespace-nowrap ${
                  category === 'Tech'
                    ? 'bg-primary text-background-dark font-bold'
                    : 'bg-white dark:bg-surface-dark border border-gray-200 dark:border-transparent text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-surface-dark-alt2'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">code</span>
                Tech
              </button>
              <button
                onClick={() => setCategory(category === 'Art & Design' ? '' : 'Art & Design')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-colors whitespace-nowrap ${
                  category === 'Art & Design'
                    ? 'bg-primary text-background-dark font-bold'
                    : 'bg-white dark:bg-surface-dark border border-gray-200 dark:border-transparent text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-surface-dark-alt2'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">palette</span>
                Art & Design
              </button>
              <button
                onClick={() => handleFilterClick('today')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-colors whitespace-nowrap ${
                  filter === 'today'
                    ? 'bg-primary text-background-dark font-bold'
                    : 'bg-white dark:bg-surface-dark border border-gray-200 dark:border-transparent text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-surface-dark-alt2'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">event_available</span>
                Today
              </button>
            </div>
          </div>
        </div>

        {/* Section 1: Top Picks */}
        <section className="max-w-7xl mx-auto px-8 mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Top Picks for You</h2>
            <Link to="/clubs" className="text-primary text-sm font-semibold hover:underline">View all</Link>
          </div>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader />
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-red-400 mb-4">Error loading clubs</p>
              <button 
                onClick={() => window.location.reload()} 
                className="text-primary hover:underline"
              >
                Try again
              </button>
            </div>
          ) : topPicks.length === 0 ? (
            <div className="text-center py-10 text-gray-400">No clubs found</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topPicks.map((club) => (
                <div
                  key={club.id}
                  className="group relative bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-transparent hover:border-primary/50"
                >
                  <div
                    className="h-48 w-full bg-cover bg-center relative cursor-pointer"
                    style={{ backgroundImage: `url("${club.image || 'https://via.placeholder.com/400x200'}")` }}
                    onClick={() => handleViewClub(club.id)}
                  >
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-primary">trending_up</span>
                      {club.matchPercentage}% Match
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <div 
                        className="flex-1 cursor-pointer"
                        onClick={() => handleViewClub(club.id)}
                      >
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 hover:text-primary transition-colors">{club.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{club.category}</p>
                      </div>
                      <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer">
                        <span className="material-symbols-outlined text-[20px]">bookmark</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[18px]">group</span>
                        {club.memberCount > 1000 ? `${(club.memberCount / 1000).toFixed(1)}k` : club.memberCount} Members
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[18px]">location_on</span>
                        {club.distance || club.location}
                      </div>
                    </div>
                    <button 
                      onClick={() => club.isJoined ? handleViewClub(club.id) : handleJoinClub(club.id, club.name)}
                      disabled={joiningClubId === club.id}
                      className="mt-5 w-full py-3 bg-gray-100 dark:bg-surface-dark-alt2 hover:bg-primary hover:text-background-dark text-gray-900 dark:text-white font-bold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {joiningClubId === club.id ? 'Joining...' : club.isJoined ? 'View Club' : 'Join Club'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Section 2: Happening This Week */}
        <section className="max-w-7xl mx-auto px-8 pb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Happening This Week</h2>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader />
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-red-400 mb-4">Error loading events</p>
              <button 
                onClick={() => window.location.reload()} 
                className="text-primary hover:underline"
              >
                Try again
              </button>
            </div>
          ) : (
            <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden border border-gray-100 dark:border-transparent">
              {events.length === 0 ? (
                <div className="p-10 text-center text-gray-400">No events this week</div>
              ) : (
                events.map((event, index) => (
                  <div
                    key={event.id}
                    className={`flex flex-col sm:flex-row gap-4 p-5 ${
                      index < events.length - 1 ? 'border-b border-gray-100 dark:border-gray-800' : ''
                    } hover:bg-gray-50 dark:hover:bg-surface-dark-alt2 transition-colors group`}
                  >
                    <Link
                      to={`/events/${event.id}`}
                      className="w-full sm:w-20 h-40 sm:h-20 flex-shrink-0 rounded-xl bg-gray-800 flex flex-col items-center justify-center text-center overflow-hidden relative cursor-pointer"
                    >
                      {event.image && (
                        <div
                          className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:scale-110 transition-transform duration-500"
                          style={{ backgroundImage: `url("${event.image}")` }}
                        ></div>
                      )}
                      <span className="relative z-10 text-xs font-bold text-primary uppercase">{event.month}</span>
                      <span className="relative z-10 text-2xl font-black text-white">{event.day}</span>
                    </Link>
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex justify-between items-start">
                        <Link to={`/events/${event.id}`} className="flex-1">
                          <h4 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                            {event.name}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {event.clubName} • {event.time}
                          </p>
                        </Link>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleRSVP(event.id, event.name);
                          }}
                          disabled={rsvpingEventId === event.id}
                          className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-semibold text-gray-900 dark:text-white hover:bg-primary hover:text-background-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-4"
                        >
                          {rsvpingEventId === event.id ? 'Registering...' : 'RSVP'}
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                          +{event.registrationCount} attending
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default MemberDiscover;


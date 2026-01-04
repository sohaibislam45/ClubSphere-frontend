import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import api from '../lib/api';
import Loader from '../components/ui/Loader';
import Swal from '../lib/sweetalertConfig';
import { useAuth } from '../context/AuthContext';
import ReviewCard from '../components/ui/ReviewCard';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      Swal.fire({
        icon: 'error',
        title: 'Email Required',
        text: 'Please enter your email address.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/api/newsletter/subscribe', { email });
      Swal.fire({
        icon: 'success',
        title: 'Subscribed!',
        text: 'Thank you for subscribing to our newsletter.',
        timer: 2000,
        showConfirmButton: false
      });
      setEmail('');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Subscription Failed',
        text: error.response?.data?.error || 'Failed to subscribe. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-20 flex justify-center bg-gray-900 dark:bg-card-dark text-white border-y border-gray-800 dark:border-border-dark">
      <div className="w-full max-w-[960px] text-center flex flex-col gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
            Stay in the Loop
          </h2>
          <p className="text-gray-300 dark:text-text-secondary text-lg max-w-2xl mx-auto">
            Get the latest updates on new clubs, events, and community features delivered straight to your inbox.
          </p>
        </motion.div>
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto w-full"
        >
          <input
            className="flex-1 px-6 py-4 rounded-full bg-white/10 dark:bg-white/5 border border-white/20 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            placeholder="Enter your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-4 bg-primary hover:bg-primary-hover text-[#111714] font-bold rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isSubmitting ? 'Subscribing...' : 'Subscribe'}
          </button>
        </motion.form>
      </div>
    </section>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Define hero slides
  const heroSlides = useMemo(() => [
    {
      id: 1,
      backgroundImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuApBJ-Lz2Q_ykm5UsHclqSM7cAbHW2XA7ujopesa4hjl022IcVeBT4nXY5QhVqxYx-beL4eFJIFRSKKxqpU6jT4pt8mtA8YLsGH-D0NWMoC7GOhT7PJjOSzWd-CzN3PwXvUyGVbcLs5Zmrj_Rggdmv7Ic10U_ZYbNcphuNUT6nNTlKcmY3Ono8FWfYhE3sPZfixQV0oZLj7Asdly7zUpXqqwnptbl0-7ymlPe9sqqqbLz-MKTzNqrNYqLGcRcvcF4AnO_jDs7lVm91X",
      title: t('home.heroTitle'),
      subtitle: t('home.heroSubtitle')
    },
    {
      id: 2,
      backgroundImage: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1600",
      title: "Connect with Like-Minded People",
      subtitle: "Join thousands of members in active communities across the globe"
    },
    {
      id: 3,
      backgroundImage: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1600",
      title: "Start Your Journey Today",
      subtitle: "Explore events, join clubs, and build lasting friendships"
    }
  ], [t]);
  
  useEffect(() => {
    document.title = 'Home - ClubSphere | Discover Local Communities';
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 2000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isPaused, heroSlides.length]);

  // Navigation functions
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  // Fetch featured clubs from API
  const { data: clubsData, isLoading: clubsLoading } = useQuery({
    queryKey: ['featured-clubs'],
    queryFn: async () => {
      const response = await api.get('/api/clubs/featured', { params: { limit: 8 } });
      return response.data;
    }
  });

  // Fetch user's club memberships (only if authenticated)
  const { data: membershipsData } = useQuery({
    queryKey: ['my-clubs'],
    queryFn: async () => {
      const response = await api.get('/api/memberships/my-clubs');
      return response.data;
    },
    enabled: isAuthenticated() && !!localStorage.getItem('token'),
    staleTime: 0,
    refetchOnMount: true,
  });

  // Create a Set of club IDs the user is a member of for quick lookup
  const joinedClubIds = useMemo(() => {
    if (!membershipsData?.clubIds) return new Set();
    return new Set(membershipsData.clubIds);
  }, [membershipsData]);

  // Fetch Running & Upcoming Events from API
  const { data: eventsData, isLoading: eventsLoading } = useQuery({
    queryKey: ['upcoming-events'],
    queryFn: async () => {
      const response = await api.get('/api/events/upcoming', { params: { limit: 6 } });
      return response.data;
    }
  });

  // Fetch platform statistics
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['public-stats'],
    queryFn: async () => {
      try {
        const response = await api.get('/api/public/stats');
        return response.data;
      } catch (error) {
        console.error('Error fetching stats:', error);
        return { totalClubs: 0, totalMembers: 0, totalEvents: 0, totalUsers: 0 };
      }
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const featuredClubs = clubsData?.clubs || [];
  const upcomingEvents = eventsData?.events || [];

  // Helper function to get category color
  const getCategoryColor = (category) => {
    const colorMap = {
      'Fitness': 'bg-primary',
      'Tech': 'bg-blue-400',
      'Arts': 'bg-purple-400',
      'Lifestyle': 'bg-green-400',
      'Photography': 'bg-pink-400',
      'Gaming': 'bg-orange-400',
      'Music': 'bg-red-400',
      'Social': 'bg-yellow-400'
    };
    return colorMap[category] || 'bg-primary';
  };

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/clubs?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/clubs');
    }
  };

  // Handle Enter key press in search input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark font-display text-gray-900 dark:text-white transition-colors duration-200">
      <Navbar />
      <main className="flex flex-col flex-1 w-full">
        {/* Hero Section */}
        <section className="w-full px-4 sm:px-6 lg:px-8 py-8 flex justify-center">
          <div className="w-full max-w-[1280px]">
            <div className="@container">
              <div
                className="flex min-h-[560px] flex-col gap-6 bg-cover bg-center bg-no-repeat rounded-xl sm:rounded-2xl lg:rounded-3xl items-center justify-center p-6 sm:p-12 relative overflow-hidden"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                {/* Background Images with Fade Transition */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 z-0"
                    style={{
                      backgroundImage: `linear-gradient(rgba(17, 23, 20, 0.5) 0%, rgba(17, 23, 20, 0.8) 100%), url("${heroSlides[currentSlide].backgroundImage}")`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat'
                    }}
                  />
                </AnimatePresence>

                {/* Navigation Arrows */}
                <button
                  onClick={prevSlide}
                  className="absolute left-4 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white transition-all"
                  aria-label="Previous slide"
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white transition-all"
                  aria-label="Next slide"
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>

                {/* Hero Content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col gap-4 text-center max-w-[800px] z-10"
                  >
                    <h1 className="text-white text-4xl sm:text-5xl lg:text-7xl font-black leading-tight tracking-[-0.033em]">
                      {heroSlides[currentSlide].title}
                    </h1>
                    <h2 className="text-gray-200 text-base sm:text-lg font-normal leading-relaxed max-w-[600px] mx-auto">
                      {heroSlides[currentSlide].subtitle}
                    </h2>
                  </motion.div>
                </AnimatePresence>
                
                {/* Search Bar */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="w-full max-w-[600px] mt-4 z-10"
                >
                  <form onSubmit={handleSearch} className="flex flex-col w-full h-14 sm:h-16">
                    <div className="flex w-full flex-1 items-stretch rounded-full h-full shadow-xl overflow-hidden group focus-within:ring-2 focus-within:ring-primary/50 transition-all bg-white">
                      <div className="text-gray-400 flex border-y border-l border-white bg-white items-center justify-center pl-6 pr-2">
                        <span className="material-symbols-outlined text-[24px]">search</span>
                      </div>
                      <input
                        className="flex w-full min-w-0 flex-1 resize-none bg-white text-gray-900 border-y border-white focus:outline-none focus:border-white h-full placeholder:text-gray-400 px-2 text-base font-normal leading-normal"
                        placeholder={t('home.searchPlaceholder')}
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={handleKeyPress}
                      />
                      <div className="flex items-center justify-center border-y border-r border-white bg-white pr-2 sm:pr-3">
                        <button 
                          type="submit"
                          className="flex cursor-pointer items-center justify-center rounded-full h-10 sm:h-12 px-6 bg-primary hover:bg-primary-hover transition-colors text-[#111714] text-sm sm:text-base font-bold leading-normal tracking-[0.015em]"
                        >
                          <span className="hidden sm:inline truncate">{t('home.findTribe')}</span>
                          <span className="sm:hidden material-symbols-outlined text-lg">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  </form>
                </motion.div>

                {/* Dots Navigation */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
                  {heroSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === currentSlide
                          ? 'w-8 bg-white'
                          : 'w-2 bg-white/50 hover:bg-white/75'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Clubs Header */}
        <section className="w-full px-4 sm:px-6 lg:px-8 pt-8 flex justify-center">
          <div className="w-full max-w-[1280px] flex items-end justify-between">
            <h2 className="text-gray-900 dark:text-white text-[32px] md:text-4xl font-bold leading-tight tracking-tight">{t('home.featuredClubs')}</h2>
            <Link to="/clubs" className="hidden sm:flex items-center gap-1 text-primary-hover dark:text-primary font-bold hover:underline">
              {t('home.viewAllClubs')} <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </section>

        {/* Featured Clubs Grid */}
        <section className="w-full px-4 sm:px-6 lg:px-8 py-8 flex justify-center">
          <div className="w-full max-w-[1280px]">
            {clubsLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader />
              </div>
            ) : featuredClubs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-text-muted dark:text-text-secondary text-lg">{t('home.noFeaturedClubs')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredClubs.map((club, index) => (
                  <motion.div
                    key={club.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    onClick={() => navigate(`/clubs/${club.id}`)}
                    className="group flex flex-col bg-white dark:bg-card-dark border border-gray-200 dark:border-border-dark rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-lg transition-all duration-300 cursor-pointer"
                  >
                    <div className="relative w-full h-48 overflow-hidden">
                      <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110 bg-white dark:bg-card-dark" 
                        style={{ backgroundImage: club.image ? `url("${club.image}")` : 'none' }}
                      ></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute top-4 left-4">
                        <span className={`${getCategoryColor(club.category)} text-[#111714] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider`}>
                          {club.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-5 flex flex-col gap-3 flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-bold leading-tight text-gray-900 dark:text-white group-hover:text-primary-hover dark:group-hover:text-primary transition-colors">{club.name}</h3>
                      </div>
                      <p className="text-text-muted dark:text-text-secondary text-sm line-clamp-2">{club.description || 'Join this amazing community and connect with like-minded people.'}</p>
                      <div className="mt-auto pt-4 border-t border-gray-100 dark:border-border-dark flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-text-muted dark:text-text-secondary">
                          <span className="material-symbols-outlined text-base">group</span> {club.members}
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/clubs/${club.id}`);
                          }}
                          className={`text-sm font-bold transition-colors flex items-center gap-1 ${
                            joinedClubIds.has(club.id)
                              ? 'text-slate-400 dark:text-slate-500 cursor-default'
                              : 'text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary'
                          }`}
                          disabled={joinedClubIds.has(club.id)}
                        >
                          {joinedClubIds.has(club.id) ? t('clubs.joined') : t('clubs.joinClub')} 
                          {!joinedClubIds.has(club.id) && <span className="material-symbols-outlined text-sm">chevron_right</span>}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Running & Upcoming Events Section */}
        <section className="w-full px-4 sm:px-6 lg:px-8 py-12 flex justify-center bg-white dark:bg-card-dark/20 border-y border-gray-200 dark:border-border-dark/50">
          <div className="w-full max-w-[1280px] flex flex-col gap-8">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-gray-900 dark:text-white text-[32px] md:text-4xl font-bold leading-tight tracking-tight">{t('home.upcomingEvents')}</h2>
                <p className="text-text-muted dark:text-text-secondary mt-2">{t('home.dontMiss')}</p>
              </div>
              <Link to="/events" className="hidden sm:flex items-center gap-1 text-primary-hover dark:text-primary font-bold hover:underline">
                {t('home.viewCalendar')} <span className="material-symbols-outlined text-sm">calendar_month</span>
              </Link>
            </div>
            {eventsLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader />
              </div>
            ) : upcomingEvents.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-text-muted dark:text-text-secondary text-lg">{t('home.noUpcomingEvents')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {upcomingEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                    onClick={() => navigate(`/events/${event.id}`)}
                    className="flex flex-col bg-white dark:bg-card-dark border border-gray-200 dark:border-border-dark rounded-2xl overflow-hidden group hover:border-primary/50 hover:shadow-lg transition-all duration-300 cursor-pointer"
                  >
                    <div className="relative h-48 w-full overflow-hidden">
                      <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105 bg-white dark:bg-card-dark" 
                        style={{ backgroundImage: event.image ? `url("${event.image}")` : 'none' }}
                      ></div>
                      <div className="absolute inset-0 bg-black/30 dark:bg-black/40 group-hover:bg-black/10 dark:group-hover:bg-black/20 transition-colors"></div>
                      <div className="absolute top-4 left-4 bg-white text-black rounded-xl p-2 min-w-[60px] flex flex-col items-center justify-center text-center shadow-lg">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{event.month}</span>
                        <span className="text-xl font-black leading-none">{event.day}</span>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col gap-3 flex-1">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-primary-hover dark:text-primary uppercase tracking-wide">{event.clubName}</span>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-hover dark:group-hover:text-primary transition-colors">{event.name}</h3>
                      </div>
                      <div className="flex flex-col gap-2 mt-2 text-sm text-text-muted dark:text-text-secondary">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-lg">schedule</span>
                          <span>{event.formattedDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-lg">location_on</span>
                          <span>{event.location || t('events.locationTBA')}</span>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          
                          // Check if user is authenticated
                          const isAuth = isAuthenticated() && !!localStorage.getItem('token');
                          
                          // If event has no clubId, allow RSVP (standalone event)
                          if (!event.clubId) {
                            if (isAuth) {
                              navigate(`/events/${event.id}`);
                            } else {
                              Swal.fire({
                                icon: 'info',
                                title: t('events.loginRequired'),
                                text: t('events.loginRequiredText'),
                                confirmButtonText: t('nav.login'),
                                showCancelButton: true,
                                cancelButtonText: t('events.cancel')
                              }).then((result) => {
                                if (result.isConfirmed) {
                                  navigate('/login', { state: { returnTo: `/events/${event.id}` } });
                                }
                              });
                            }
                            return;
                          }
                          
                          // Check if user is a member of the event's club
                          // Try both string and ObjectId formats
                          const clubIdStr = event.clubId?.toString();
                          const isMemberOfClub = clubIdStr && joinedClubIds.has(clubIdStr);
                          
                          // If user is authenticated and is a member, navigate to event details
                          if (isAuth && isMemberOfClub) {
                            navigate(`/events/${event.id}`);
                            return;
                          }
                          
                          // If user is not authenticated, prompt to login
                          if (!isAuth) {
                            Swal.fire({
                              icon: 'info',
                              title: t('events.loginRequired'),
                              text: t('events.loginRequiredText'),
                              confirmButtonText: t('nav.login'),
                              showCancelButton: true,
                              cancelButtonText: t('events.cancel')
                            }).then((result) => {
                              if (result.isConfirmed) {
                                navigate('/login', { state: { returnTo: `/events/${event.id}` } });
                              }
                            });
                            return;
                          }
                          
                          // If user is authenticated but not a member, show join club modal
                          Swal.fire({
                            icon: 'info',
                            title: t('events.joinClubRequired'),
                            text: t('events.joinClubRequiredText'),
                            confirmButtonText: t('events.goToClub'),
                            showCancelButton: true,
                            cancelButtonText: t('events.cancel')
                          }).then((result) => {
                            if (result.isConfirmed) {
                              if (event.clubId) {
                                navigate(`/clubs/${event.clubId}`);
                              } else {
                                Swal.fire({
                                  icon: 'error',
                                  title: 'Error',
                                  text: 'Club information not available. Please try again later.',
                                });
                              }
                            }
                          });
                        }}
                        className="mt-4 w-full py-2.5 rounded-lg bg-gray-100 dark:bg-[#29382f] text-gray-900 dark:text-white font-bold text-sm hover:bg-primary dark:hover:bg-primary hover:text-gray-900 dark:hover:text-background-dark transition-colors"
                      >
                        {t('events.rsvpNow')}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full px-4 sm:px-6 lg:px-8 py-16 flex justify-center mt-8">
          <div className="w-full max-w-[1280px]">
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-4 items-start">
                <h2 className="text-gray-900 dark:text-white text-3xl md:text-5xl font-black leading-tight tracking-tight max-w-[720px]">
                  {t('home.howItWorks')}
                </h2>
                <p className="text-text-muted dark:text-text-secondary text-lg font-normal leading-normal max-w-[720px]">{t('home.howItWorksSubtitle')}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { icon: "search", title: t('home.discover'), description: t('home.discoverDesc') },
                  { icon: "chat_bubble", title: t('home.connect'), description: t('home.connectDesc') },
                  { icon: "calendar_today", title: t('home.participate'), description: t('home.participateDesc') }
                ].map((step, index) => (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                    className="flex flex-1 gap-6 rounded-2xl border border-gray-200 dark:border-border-dark bg-white dark:bg-card-dark shadow-sm dark:shadow-none p-8 flex-col items-start hover:border-primary/50 hover:shadow-md dark:hover:shadow-none transition-all duration-300"
                  >
                    <div className="size-14 rounded-full bg-green-50 dark:bg-[#29382f] flex items-center justify-center text-green-600 dark:text-primary mb-2">
                      <span className="material-symbols-outlined text-3xl">{step.icon}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="text-gray-900 dark:text-white text-xl font-bold leading-tight">{step.title}</h3>
                      <p className="text-text-muted dark:text-text-secondary text-base font-normal leading-relaxed">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="w-full px-4 sm:px-6 lg:px-8 py-16 flex justify-center bg-white dark:bg-card-dark/20 border-y border-gray-200 dark:border-border-dark/50">
          <div className="w-full max-w-[1280px]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { 
                  label: 'Active Clubs', 
                  value: statsLoading ? '...' : (statsData?.totalClubs || 0).toLocaleString(),
                  icon: 'groups',
                  color: 'text-primary'
                },
                { 
                  label: 'Total Members', 
                  value: statsLoading ? '...' : (statsData?.totalMembers || 0).toLocaleString(),
                  icon: 'people',
                  color: 'text-blue-500'
                },
                { 
                  label: 'Upcoming Events', 
                  value: statsLoading ? '...' : (statsData?.totalEvents || 0).toLocaleString(),
                  icon: 'event',
                  color: 'text-purple-500'
                },
                { 
                  label: 'Total Users', 
                  value: statsLoading ? '...' : (statsData?.totalUsers || 0).toLocaleString(),
                  icon: 'person',
                  color: 'text-green-500'
                }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white dark:bg-card-dark border border-gray-200 dark:border-border-dark"
                >
                  <span className={`material-symbols-outlined text-4xl ${stat.color}`}>{stat.icon}</span>
                  <div className="text-center">
                    <p className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">{stat.value}</p>
                    <p className="text-sm font-medium text-text-muted dark:text-text-secondary mt-1">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Join (Bento Grid) Section */}
        <section className="w-full px-4 sm:px-6 lg:px-8 py-20 flex justify-center">
          <div className="w-full max-w-[1280px]">
            <div className="flex flex-col lg:flex-row gap-12 items-start">
              {/* Text Content */}
              <div className="lg:w-1/3 flex flex-col gap-6 sticky top-24">
                <span className="text-primary-hover dark:text-primary font-bold uppercase tracking-wider text-sm">{t('home.whyJoin')}</span>
                <h2 className="text-gray-900 dark:text-white text-4xl md:text-5xl font-black leading-tight tracking-tight">
                  {t('home.whyJoinTitle')}
                </h2>
                <p className="text-text-muted dark:text-text-secondary text-lg leading-relaxed">
                  {t('home.whyJoinDesc')}
                </p>
                <Link to="/register" className="w-fit flex cursor-pointer items-center justify-center rounded-full h-12 px-8 bg-gray-900 dark:bg-white text-white dark:text-background-dark text-base font-bold leading-normal tracking-[0.015em] hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-lg shadow-gray-200 dark:shadow-none">
                  {t('home.getStarted')}
                </Link>
              </div>
              
              {/* Bento Grid */}
              <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {/* Large Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                  className="md:col-span-2 rounded-[2rem] bg-white dark:bg-card-dark border border-gray-200 dark:border-border-dark p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group shadow-sm dark:shadow-none"
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-green-100 dark:bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none opacity-50"></div>
                  <div className="flex-1 z-10">
                    <div className="size-12 rounded-full bg-green-100 dark:bg-primary/20 text-green-600 dark:text-primary flex items-center justify-center mb-6">
                      <span className="material-symbols-outlined text-2xl">trending_up</span>
                    </div>
                    <h3 className="text-gray-900 dark:text-white text-2xl font-bold mb-3">{t('home.expandNetwork')}</h3>
                    <p className="text-text-muted dark:text-text-secondary">{t('home.expandNetworkDesc')}</p>
                  </div>
                  <div className="w-full md:w-48 h-32 md:h-auto rounded-2xl bg-gray-50 dark:bg-border-dark/50 border border-gray-100 dark:border-none flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 dark:opacity-30 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                    <span className="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-500">hub</span>
                  </div>
                </motion.div>
                
                {/* Medium Cards */}
                {[
                  { icon: "school", color: "blue", title: t('home.learnSkills'), description: t('home.learnSkillsDesc') },
                  { icon: "spa", color: "pink", title: t('home.mentalWellbeing'), description: t('home.mentalWellbeingDesc') }
                ].map((card, index) => (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.3 + index * 0.1 }}
                    className="rounded-[2rem] bg-white dark:bg-card-dark border border-gray-200 dark:border-border-dark p-8 flex flex-col gap-4 hover:border-blue-200 dark:hover:border-blue-200 hover:shadow-md dark:hover:shadow-none transition-all duration-300 shadow-sm dark:shadow-none"
                  >
                    <div className={`size-12 rounded-full flex items-center justify-center mb-2 ${
                      card.color === 'blue' ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400' : 'bg-pink-100 dark:bg-pink-500/20 text-pink-600 dark:text-pink-400'
                    }`}>
                      <span className="material-symbols-outlined text-2xl">{card.icon}</span>
                    </div>
                    <h3 className="text-gray-900 dark:text-white text-xl font-bold">{card.title}</h3>
                    <p className="text-text-muted dark:text-text-secondary text-sm">{card.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="w-full px-4 sm:px-6 lg:px-8 py-20 flex justify-center bg-white dark:bg-card-dark/20 border-y border-gray-200 dark:border-border-dark/50">
          <div className="w-full max-w-[1280px]">
            <div className="flex flex-col gap-12">
              <div className="text-center max-w-2xl mx-auto flex flex-col gap-4">
                <h2 className="text-gray-900 dark:text-white text-3xl md:text-4xl font-bold leading-tight">What Our Members Say</h2>
                <p className="text-text-muted dark:text-text-secondary text-lg">Real stories from real people in our community.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    quote: "ClubSphere completely transformed how I find local events. The community is vibrant and welcoming.",
                    author: "Alex Chen",
                    role: "Community Organizer",
                    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDBZ6CDB3iArjU_tvxrCupBUfSulecrz0Y9qLtIP8e3AcjWj4CPqyZd_o9WvE_-caFh2Kl8jlU4JL3YcpV7C1S8qDZm7jzPy-Umx63LT8vZJyrigp5I_aZLIUqO8HeDb66gFGZy4NqMMGkLQDd3QniZ8Z3M6H704nriZyvne7BNUopiiyqGNIsttPAvyWb6gvNd9K-L0_7pqdQ5Q4rsnY07Yui944jqM2dQq4-wbrku73IXnLPhq-yrJ-7VBoDiFVDb3p7M7HKnAPJc"
                  },
                  {
                    quote: "I've met some of my closest friends through clubs on this platform. It's amazing how technology can bring people together.",
                    author: "Sarah Johnson",
                    role: "Fitness Enthusiast",
                    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuA905HuwzoL3J6Hn0Sl4XIIJzbR6IPNZbPOMGRUaFXfkY2aBHeN-VxHwYW4dhAJhgtUHW4DdNBaeFGOCxDkNYmguRofHkXkgTONLxG8Twyt9srdWrXmqamsThx_w9SGvHV4fxnZ6VA6zW6EQJBFnVcEQ9PDbnGGTuoAIZ0-T0gnO6dLwbu1ql6BxoEbyHZP1a71z_eEVtaksinsi6LWEmv4KqhZi6gLJ-7q9XaofobfY-pHbyUlLd_VNzJwzhmyxvA7Iz_DLv8tkUro"
                  },
                  {
                    quote: "As a club manager, the tools provided make organizing events so much easier. Highly recommend!",
                    author: "Michael Torres",
                    role: "Tech Club Manager",
                    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuA9zqG3-2JnoqjGIKWNWeHge3KqIh7kIXdIcZ5_5CcSX2AV_z7LGRAtUOw6arXnuz2bHq60vM6pWztNijvI2P-6d8HRRlcim8z1_7xXb_YzIvvUXhsz-JFsJ0UOXPZs9UNth8T2TXtPDizQwtDM5gNBckPHiGMFEZkIoF4fOJXqZ_C10bSEZn_EtM-u7KKQQLAX_JfZOJPmQzr5m4I-fpoaLHMuGk8wChObqo7ZbaQpypqV7msw1WScyHoHCYi0-7EU5DAOSiVariW2"
                  }
                ].map((testimonial, index) => (
                  <motion.div
                    key={testimonial.author}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex flex-col gap-4 p-6 rounded-2xl bg-white dark:bg-card-dark border border-gray-200 dark:border-border-dark"
                  >
                    <div className="flex items-center gap-1 text-primary">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="material-symbols-outlined text-lg">star</span>
                      ))}
                    </div>
                    <p className="text-text-muted dark:text-text-secondary leading-relaxed flex-1">"{testimonial.quote}"</p>
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-border-dark">
                      <div
                        className="size-12 rounded-full bg-cover bg-center"
                        style={{ backgroundImage: `url("${testimonial.avatar}")` }}
                      ></div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">{testimonial.author}</p>
                        <p className="text-sm text-text-muted dark:text-text-secondary">{testimonial.role}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Categories Highlights Section */}
        <section className="w-full px-4 sm:px-6 lg:px-8 py-20 flex justify-center">
          <div className="w-full max-w-[1280px]">
            <div className="flex flex-col gap-12">
              <div className="text-center max-w-2xl mx-auto flex flex-col gap-4">
                <h2 className="text-gray-900 dark:text-white text-3xl md:text-4xl font-bold leading-tight">Explore by Category</h2>
                <p className="text-text-muted dark:text-text-secondary text-lg">Find clubs and events that match your interests.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'Fitness', icon: 'fitness_center', color: 'bg-primary', href: '/clubs?category=Fitness' },
                  { name: 'Tech', icon: 'computer', color: 'bg-blue-500', href: '/clubs?category=Tech' },
                  { name: 'Arts', icon: 'palette', color: 'bg-purple-500', href: '/clubs?category=Arts' },
                  { name: 'Sports', icon: 'sports_soccer', color: 'bg-green-500', href: '/clubs?category=Sports' },
                  { name: 'Music', icon: 'music_note', color: 'bg-red-500', href: '/clubs?category=Music' },
                  { name: 'Gaming', icon: 'sports_esports', color: 'bg-orange-500', href: '/clubs?category=Gaming' },
                  { name: 'Lifestyle', icon: 'spa', color: 'bg-pink-500', href: '/clubs?category=Lifestyle' },
                  { name: 'Social', icon: 'groups', color: 'bg-yellow-500', href: '/clubs?category=Social' }
                ].map((category, index) => (
                  <motion.div
                    key={category.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                  <Link
                    to={category.href}
                    className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white dark:bg-card-dark border border-gray-200 dark:border-border-dark hover:border-primary hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className={`size-14 rounded-full ${category.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                      <span className="material-symbols-outlined text-2xl">{category.icon}</span>
                    </div>
                    <p className="font-bold text-gray-900 dark:text-white text-sm">{category.name}</p>
                  </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full px-4 sm:px-6 lg:px-8 py-20 flex justify-center bg-white dark:bg-card-dark/20 border-y border-gray-200 dark:border-border-dark/50">
          <div className="w-full max-w-[1280px]">
            <div className="flex flex-col gap-12">
              <div className="text-center max-w-2xl mx-auto flex flex-col gap-4">
                <h2 className="text-gray-900 dark:text-white text-3xl md:text-4xl font-bold leading-tight">Powerful Features</h2>
                <p className="text-text-muted dark:text-text-secondary text-lg">Everything you need to build and manage thriving communities.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { icon: 'event', title: 'Event Management', description: 'Create, manage, and promote events with ease. Handle RSVPs, ticketing, and attendee management all in one place.' },
                  { icon: 'payments', title: 'Secure Payments', description: 'Integrated payment processing for membership fees and event tickets. Fast, secure, and reliable.' },
                  { icon: 'forum', title: 'Community Forums', description: 'Engage with members through discussions, announcements, and shared interests. Build stronger connections.' },
                  { icon: 'notifications', title: 'Smart Notifications', description: 'Stay informed with real-time updates about events, messages, and community activities.' },
                  { icon: 'analytics', title: 'Analytics & Insights', description: 'Track engagement, growth, and member activity with comprehensive analytics dashboards.' },
                  { icon: 'security', title: 'Safety & Moderation', description: 'Built-in tools to ensure safe, welcoming communities with moderation and reporting features.' }
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex flex-col gap-4 p-6 rounded-2xl bg-white dark:bg-card-dark border border-gray-200 dark:border-border-dark hover:border-primary/50 hover:shadow-md transition-all duration-300"
                  >
                    <div className="size-12 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-2xl">{feature.icon}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{feature.title}</h3>
                    <p className="text-text-muted dark:text-text-secondary leading-relaxed">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="w-full px-4 sm:px-6 lg:px-8 py-20 flex justify-center">
          <div className="w-full max-w-[1280px]">
            <div className="flex flex-col gap-12">
              <div className="text-center max-w-2xl mx-auto flex flex-col gap-4">
                <h2 className="text-gray-900 dark:text-white text-3xl md:text-4xl font-bold leading-tight">Our Services</h2>
                <p className="text-text-muted dark:text-text-secondary text-lg">Comprehensive solutions for community builders and members alike.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  {
                    title: 'For Members',
                    description: 'Discover and join clubs that match your interests, register for events, connect with like-minded people, and build meaningful relationships.',
                    features: ['Browse thousands of active clubs', 'RSVP to events seamlessly', 'Connect with community members', 'Track your activity and memberships'],
                    icon: 'person',
                    color: 'primary'
                  },
                  {
                    title: 'For Club Managers',
                    description: 'Manage your club with powerful tools including member management, event creation, payment processing, and analytics.',
                    features: ['Create and manage events', 'Process payments securely', 'Track member engagement', 'Access analytics dashboard'],
                    icon: 'groups',
                    color: 'blue'
                  }
                ].map((service, index) => (
                  <motion.div
                    key={service.title}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    className="flex flex-col gap-6 p-8 rounded-2xl bg-white dark:bg-card-dark border border-gray-200 dark:border-border-dark"
                  >
                    <div className={`size-16 rounded-2xl bg-${service.color === 'primary' ? 'primary' : 'blue-500'}/10 dark:bg-${service.color === 'primary' ? 'primary' : 'blue-500'}/20 text-${service.color === 'primary' ? 'primary' : 'blue-500'} flex items-center justify-center`}>
                      <span className="material-symbols-outlined text-3xl">{service.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{service.title}</h3>
                      <p className="text-text-muted dark:text-text-secondary leading-relaxed mb-4">{service.description}</p>
                      <ul className="flex flex-col gap-2">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-text-muted dark:text-text-secondary">
                            <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full px-4 sm:px-6 lg:px-8 py-20 flex justify-center bg-white dark:bg-card-dark/20 border-y border-gray-200 dark:border-border-dark/50">
          <div className="w-full max-w-[960px]">
            <div className="flex flex-col gap-12">
              <div className="text-center max-w-2xl mx-auto flex flex-col gap-4">
                <h2 className="text-gray-900 dark:text-white text-3xl md:text-4xl font-bold leading-tight">Frequently Asked Questions</h2>
                <p className="text-text-muted dark:text-text-secondary text-lg">Got questions? We've got answers.</p>
              </div>
              <div className="flex flex-col gap-4">
                {[
                  {
                    question: 'How do I join a club?',
                    answer: 'Simply browse clubs on our platform, find one that interests you, and click "Join Club". Some clubs may require a membership fee, while others are free to join.'
                  },
                  {
                    question: 'Can I create my own club?',
                    answer: 'Yes! If you\'re a club manager, you can create and manage your own clubs. Sign up and choose the club manager role to get started.'
                  },
                  {
                    question: 'How do event registrations work?',
                    answer: 'When you\'re a member of a club, you can register for events organized by that club. Some events may have fees, while others are free. You\'ll receive confirmation and updates via email.'
                  },
                  {
                    question: 'Is my payment information secure?',
                    answer: 'Absolutely. We use industry-standard encryption and secure payment processing to protect your financial information. We never store your full payment details.'
                  },
                  {
                    question: 'How can I contact club organizers?',
                    answer: 'Once you\'re a member of a club, you can interact with organizers and other members through the club\'s community features and messaging system.'
                  },
                  {
                    question: 'What if I want to leave a club?',
                    answer: 'You can leave a club at any time through your dashboard. Note that membership fees are non-refundable, but you\'ll retain access until the end of your membership period.'
                  }
                ].map((faq, index) => (
                  <motion.details
                    key={faq.question}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="group"
                  >
                    <summary className="flex items-center justify-between p-6 cursor-pointer bg-white dark:bg-card-dark border border-gray-200 dark:border-border-dark rounded-xl hover:border-primary transition-colors list-none">
                      <span className="font-bold text-gray-900 dark:text-white pr-4">{faq.question}</span>
                      <span className="material-symbols-outlined text-gray-400 group-open:rotate-180 transition-transform">expand_more</span>
                    </summary>
                    <div className="p-6 pt-0">
                      <p className="text-text-muted dark:text-text-secondary leading-relaxed">{faq.answer}</p>
                    </div>
                  </motion.details>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
};

export default Home;


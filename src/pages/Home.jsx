import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import api from '../lib/api';
import Loader from '../components/ui/Loader';
import Swal from '../lib/sweetalertConfig';

const Home = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    document.title = 'Home - ClubSphere | Discover Local Communities';
  }, []);
  // Fetch featured clubs from API
  const { data: clubsData, isLoading: clubsLoading } = useQuery({
    queryKey: ['featured-clubs'],
    queryFn: async () => {
      const response = await api.get('/api/clubs/featured', { params: { limit: 8 } });
      return response.data;
    }
  });

  // Fetch Running & Upcoming Events from API
  const { data: eventsData, isLoading: eventsLoading } = useQuery({
    queryKey: ['upcoming-events'],
    queryFn: async () => {
      const response = await api.get('/api/events/upcoming', { params: { limit: 6 } });
      return response.data;
    }
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

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark font-display text-gray-900 dark:text-white transition-colors duration-200">
      <Navbar />
      <main className="flex flex-col flex-1 w-full">
        {/* Hero Section */}
        <section className="w-full px-4 sm:px-6 lg:px-8 py-8 flex justify-center">
          <div className="w-full max-w-[1280px]">
            <div className="@container">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex min-h-[560px] flex-col gap-6 bg-cover bg-center bg-no-repeat rounded-xl sm:rounded-2xl lg:rounded-3xl items-center justify-center p-6 sm:p-12 relative overflow-hidden"
                style={{
                  backgroundImage: `linear-gradient(rgba(17, 23, 20, 0.5) 0%, rgba(17, 23, 20, 0.8) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuApBJ-Lz2Q_ykm5UsHclqSM7cAbHW2XA7ujopesa4hjl022IcVeBT4nXY5QhVqxYx-beL4eFJIFRSKKxqpU6jT4pt8mtA8YLsGH-D0NWMoC7GOhT7PJjOSzWd-CzN3PwXvUyGVbcLs5Zmrj_Rggdmv7Ic10U_ZYbNcphuNUT6nNTlKcmY3Ono8FWfYhE3sPZfixQV0oZLj7Asdly7zUpXqqwnptbl0-7ymlPe9sqqqbLz-MKTzNqrNYqLGcRcvcF4AnO_jDs7lVm91X")`
                }}
              >
                {/* Hero Content */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex flex-col gap-4 text-center max-w-[800px] z-10"
                >
                  <h1 className="text-white text-4xl sm:text-5xl lg:text-7xl font-black leading-tight tracking-[-0.033em]">
                    Discover Local Communities That Move You
                  </h1>
                  <h2 className="text-gray-200 text-base sm:text-lg font-normal leading-relaxed max-w-[600px] mx-auto">
                    From hiking groups to coding bootcamps, find your people with ClubSphere. Join a movement, start a conversation.
                  </h2>
                </motion.div>
                
                {/* Search Bar */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="w-full max-w-[600px] mt-4 z-10"
                >
                  <label className="flex flex-col w-full h-14 sm:h-16">
                    <div className="flex w-full flex-1 items-stretch rounded-full h-full shadow-lg overflow-hidden group focus-within:ring-2 focus-within:ring-primary/50 transition-all">
                      <div className="text-text-secondary flex border-y border-l border-border-dark bg-card-dark items-center justify-center pl-6 pr-2">
                        <span className="material-symbols-outlined text-[24px]">search</span>
                      </div>
                      <input
                        className="flex w-full min-w-0 flex-1 resize-none bg-card-dark text-white border-y border-border-dark focus:outline-none focus:border-border-dark h-full placeholder:text-text-secondary px-2 text-base font-normal leading-normal"
                        placeholder="Search by interest or location..."
                        type="text"
                      />
                      <div className="flex items-center justify-center border-y border-r border-border-dark bg-card-dark pr-2 sm:pr-3">
                        <button className="flex cursor-pointer items-center justify-center rounded-full h-10 sm:h-12 px-6 bg-primary hover:bg-primary-hover transition-colors text-[#111714] text-sm sm:text-base font-bold leading-normal tracking-[0.015em]">
                          <span className="hidden sm:inline truncate">Find Your Tribe</span>
                          <span className="sm:hidden material-symbols-outlined text-lg">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  </label>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Featured Clubs Header */}
        <section className="w-full px-4 sm:px-6 lg:px-8 pt-8 flex justify-center">
          <div className="w-full max-w-[1280px] flex items-end justify-between">
            <h2 className="text-[32px] md:text-4xl font-bold leading-tight tracking-tight">Featured Clubs</h2>
            <Link to="/clubs" className="hidden sm:flex items-center gap-1 text-primary font-medium hover:underline">
              View all clubs <span className="material-symbols-outlined text-sm">arrow_forward</span>
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
                <p className="text-text-secondary text-lg">No featured clubs available at the moment.</p>
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
                    className="group flex flex-col bg-card-dark border border-border-dark rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 cursor-pointer"
                  >
                    <div className="relative w-full h-48 overflow-hidden">
                      <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110 bg-card-dark" 
                        style={{ backgroundImage: club.image ? `url("${club.image}")` : 'none' }}
                      ></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-card-dark/90 to-transparent"></div>
                      <div className="absolute top-4 left-4">
                        <span className={`${getCategoryColor(club.category)} text-background-dark text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider`}>
                          {club.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-5 flex flex-col gap-3 flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-bold leading-tight text-white group-hover:text-primary transition-colors">{club.name}</h3>
                      </div>
                      <p className="text-text-secondary text-sm line-clamp-2">{club.description || 'Join this amazing community and connect with like-minded people.'}</p>
                      <div className="mt-auto pt-4 border-t border-border-dark flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-text-secondary">
                          <span className="material-symbols-outlined text-base">group</span> {club.members}
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/clubs/${club.id}`);
                          }}
                          className="text-sm font-bold text-white hover:text-primary transition-colors flex items-center gap-1"
                        >
                          Join Club <span className="material-symbols-outlined text-sm">chevron_right</span>
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
        <section className="w-full px-4 sm:px-6 lg:px-8 py-10 flex justify-center bg-card-dark/20 border-y border-border-dark/50">
          <div className="w-full max-w-[1280px] flex flex-col gap-8">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-[32px] md:text-4xl font-bold leading-tight tracking-tight">Running & Upcoming Events</h2>
                <p className="text-text-secondary mt-2">Don't miss out on what's happening this week.</p>
              </div>
              <Link to="/events" className="hidden sm:flex items-center gap-1 text-primary font-medium hover:underline">
                View Calendar <span className="material-symbols-outlined text-sm">calendar_month</span>
              </Link>
            </div>
            {eventsLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader />
              </div>
            ) : upcomingEvents.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-text-secondary text-lg">No Running & Upcoming Events at the moment.</p>
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
                    className="flex flex-col bg-card-dark border border-border-dark rounded-2xl overflow-hidden group hover:border-primary/50 transition-all duration-300 cursor-pointer"
                  >
                    <div className="relative h-48 w-full overflow-hidden">
                      <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105 bg-card-dark" 
                        style={{ backgroundImage: event.image ? `url("${event.image}")` : 'none' }}
                      ></div>
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                      <div className="absolute top-4 left-4 bg-white text-black rounded-xl p-2 min-w-[60px] flex flex-col items-center justify-center text-center shadow-lg">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{event.month}</span>
                        <span className="text-xl font-black leading-none">{event.day}</span>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col gap-3 flex-1">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-primary uppercase tracking-wide">{event.clubName}</span>
                        <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{event.name}</h3>
                      </div>
                      <div className="flex flex-col gap-2 mt-2 text-sm text-text-secondary">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-lg">schedule</span>
                          <span>{event.formattedDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-lg">location_on</span>
                          <span>{event.location || 'Location TBA'}</span>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          Swal.fire({
                            icon: 'info',
                            title: 'Join Club Required',
                            text: 'If you want to reserve event, then you have to join club first',
                            confirmButtonText: 'Go to Club',
                            showCancelButton: true,
                            cancelButtonText: 'Cancel'
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
                        className="mt-4 w-full py-2.5 rounded-lg bg-[#29382f] text-white font-bold text-sm hover:bg-primary hover:text-background-dark transition-colors"
                      >
                        RSVP Now
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full px-4 sm:px-6 lg:px-8 py-16 flex justify-center bg-card-dark/30 mt-8">
          <div className="w-full max-w-[1280px]">
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-4 items-start">
                <h2 className="text-3xl md:text-5xl font-black leading-tight tracking-tight max-w-[720px]">
                  How It Works
                </h2>
                <p className="text-text-secondary text-lg font-normal leading-normal max-w-[720px]">Three simple steps to finding your next adventure and making meaningful connections.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { icon: "search", title: "1. Discover", description: "Browse thousands of local clubs based on your interests and location. Filter by activity, size, and vibe." },
                  { icon: "chat_bubble", title: "2. Connect", description: "Join the conversation instantly. Meet like-minded individuals in your area through secure group chats." },
                  { icon: "calendar_today", title: "3. Participate", description: "Attend events, workshops, and meetups. RSVP with one click and get automated reminders." }
                ].map((step, index) => (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                    className="flex flex-1 gap-6 rounded-2xl border border-border-dark bg-card-dark p-8 flex-col items-start hover:border-primary/50 transition-colors duration-300"
                  >
                    <div className="size-14 rounded-full bg-[#29382f] flex items-center justify-center text-primary mb-2">
                      <span className="material-symbols-outlined text-3xl">{step.icon}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="text-xl font-bold leading-tight">{step.title}</h3>
                      <p className="text-text-secondary text-base font-normal leading-relaxed">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Why Join (Bento Grid) Section */}
        <section className="w-full px-4 sm:px-6 lg:px-8 py-20 flex justify-center">
          <div className="w-full max-w-[1280px]">
            <div className="flex flex-col lg:flex-row gap-12 items-start">
              {/* Text Content */}
              <div className="lg:w-1/3 flex flex-col gap-6 sticky top-24">
                <span className="text-primary font-bold uppercase tracking-wider text-sm">Why Join ClubSphere?</span>
                <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tight">
                  More Than Just A Platform
                </h2>
                <p className="text-text-secondary text-lg leading-relaxed">
                  We're building the future of community. Whether you want to boost your career, improve your health, or just have fun, it starts here.
                </p>
                <Link to="/register" className="w-fit flex cursor-pointer items-center justify-center rounded-full h-12 px-8 bg-white dark:bg-white text-background-dark text-base font-bold leading-normal tracking-[0.015em] hover:bg-gray-200 transition-colors">
                  Get Started Now
                </Link>
              </div>
              
              {/* Bento Grid */}
              <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {/* Large Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                  className="md:col-span-2 rounded-[2rem] bg-card-dark border border-border-dark p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                  <div className="flex-1 z-10">
                    <div className="size-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-6">
                      <span className="material-symbols-outlined text-2xl">trending_up</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Expand Your Network</h3>
                    <p className="text-text-secondary">Connect with professionals and hobbyists outside your usual circle. 80% of members report making a new close friend within 3 months.</p>
                  </div>
                  <div className="w-full md:w-48 h-32 md:h-auto rounded-2xl bg-border-dark/50 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                    <span className="material-symbols-outlined text-5xl text-gray-500">hub</span>
                  </div>
                </motion.div>
                
                {/* Medium Cards */}
                {[
                  { icon: "school", color: "blue", title: "Learn New Skills", description: "From pottery workshops to Python coding sessions, learn by doing with peers." },
                  { icon: "spa", color: "pink", title: "Mental Well-being", description: "Combat loneliness and burnout. Real world connection is the best medicine." }
                ].map((card, index) => (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.3 + index * 0.1 }}
                    className="rounded-[2rem] bg-card-dark border border-border-dark p-8 flex flex-col gap-4 hover:bg-[#222e26] transition-colors duration-300"
                  >
                    <div className={`size-12 rounded-full flex items-center justify-center mb-2 ${
                      card.color === 'blue' ? 'bg-blue-500/20 text-blue-400' : 'bg-pink-500/20 text-pink-400'
                    }`}>
                      <span className="material-symbols-outlined text-2xl">{card.icon}</span>
                    </div>
                    <h3 className="text-xl font-bold">{card.title}</h3>
                    <p className="text-text-secondary text-sm">{card.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;


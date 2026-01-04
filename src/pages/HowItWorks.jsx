import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import api from '../lib/api';
import Loader from '../components/ui/Loader';

const HowItWorks = () => {
  useEffect(() => {
    document.title = 'How It Works - ClubSphere';
  }, []);

  // Fetch featured clubs for Step 1
  const { data: clubsData, isLoading: clubsLoading } = useQuery({
    queryKey: ['featured-clubs-how-it-works'],
    queryFn: async () => {
      try {
        const response = await api.get('/api/clubs/featured', { params: { limit: 4 } });
        return response.data;
      } catch (error) {
        console.error('Error fetching featured clubs:', error);
        return { clubs: [] };
      }
    },
  });

  // Fetch upcoming events for Step 3
  const { data: eventsData, isLoading: eventsLoading } = useQuery({
    queryKey: ['upcoming-events-how-it-works'],
    queryFn: async () => {
      try {
        const response = await api.get('/api/events/upcoming', { params: { limit: 1 } });
        return response.data;
      } catch (error) {
        console.error('Error fetching upcoming events:', error);
        return { events: [] };
      }
    },
  });

  const featuredClubs = clubsData?.clubs || [];
  const upcomingEvent = eventsData?.events?.[0] || null;

  // Format event date
  const formatEventDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark font-display text-text-main dark:text-white transition-colors duration-200">
      <Navbar />
      <main className="flex flex-col flex-1 w-full">
        {/* Hero Section */}
        <section className="relative w-full px-4 sm:px-6 lg:px-8 py-20 lg:py-28 flex flex-col items-center text-center bg-white dark:bg-card-dark border-b border-gray-200 dark:border-border-dark overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[80%] rounded-full bg-primary/5 dark:bg-primary/10 blur-[100px]"></div>
            <div className="absolute top-[20%] -left-[10%] w-[40%] h-[60%] rounded-full bg-blue-50 dark:bg-blue-950/20 blur-[100px]"></div>
          </div>
          <div className="relative z-10 max-w-3xl mx-auto flex flex-col gap-6">
            <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-[#29382f] border border-gray-200 dark:border-border-dark w-fit mx-auto">
              <span className="size-2 rounded-full bg-primary"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-text-secondary">User Guide</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight text-gray-900 dark:text-white tracking-tight">
              Your Journey to <br/> <span className="text-primary">Community</span> Starts Here
            </h1>
            <p className="text-lg sm:text-xl text-text-muted dark:text-text-secondary leading-relaxed">
              ClubSphere makes it effortless to find your people, join clubs, and attend events. Here is how you can get the most out of the platform.
            </p>
          </div>
        </section>

        {/* Steps Section */}
        <section className="w-full px-4 sm:px-6 lg:px-8 py-20 bg-background-light dark:bg-background-dark">
          <div className="max-w-[1024px] mx-auto flex flex-col gap-24">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
              <div className="w-full md:w-1/2 flex justify-center">
                <div className="relative w-full max-w-sm aspect-square bg-white dark:bg-card-dark rounded-3xl shadow-xl shadow-gray-100 dark:shadow-none border border-gray-100 dark:border-border-dark flex items-center justify-center p-8 group hover:border-primary/30 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-50 dark:from-primary/5 to-transparent rounded-3xl opacity-50"></div>
                  <div className="relative z-10 flex flex-col gap-4 w-full">
                    <div className="bg-white dark:bg-[#29382f] rounded-xl shadow-sm border border-gray-100 dark:border-border-dark p-3 flex items-center gap-3">
                      <span className="material-symbols-outlined text-gray-400 dark:text-text-secondary">search</span>
                      <div className="h-2 w-32 bg-gray-100 dark:bg-border-dark rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {clubsLoading ? (
                        <>
                          <div className="aspect-[4/3] rounded-lg bg-gray-100 dark:bg-[#29382f] animate-pulse"></div>
                          <div className="aspect-[4/3] rounded-lg bg-gray-100 dark:bg-[#29382f] animate-pulse delay-75"></div>
                          <div className="aspect-[4/3] rounded-lg bg-gray-100 dark:bg-[#29382f] animate-pulse delay-150"></div>
                          <div className="aspect-[4/3] rounded-lg bg-gray-100 dark:bg-[#29382f] animate-pulse"></div>
                        </>
                      ) : featuredClubs.length > 0 ? (
                        featuredClubs.slice(0, 4).map((club, index) => (
                          <div key={club.id || index} className="aspect-[4/3] rounded-lg overflow-hidden relative group cursor-pointer" onClick={() => window.location.href = `/clubs/${club.id}`}>
                            {club.image ? (
                              <img src={club.image} alt={club.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary text-2xl">groups</span>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <p className="text-white text-xs font-bold truncate">{club.name}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <>
                          <div className="aspect-[4/3] rounded-lg bg-gray-100 dark:bg-[#29382f]"></div>
                          <div className="aspect-[4/3] rounded-lg bg-gray-100 dark:bg-[#29382f]"></div>
                          <div className="aspect-[4/3] rounded-lg bg-gray-100 dark:bg-[#29382f]"></div>
                          <div className="aspect-[4/3] rounded-lg bg-primary/20 dark:bg-primary/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary">add</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="absolute -right-4 -top-4 size-16 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg rotate-12 group-hover:rotate-0 transition-transform duration-500">
                    <span className="material-symbols-outlined text-3xl">explore</span>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2 flex flex-col gap-6 items-start">
                <div className="size-12 rounded-full bg-primary/10 dark:bg-primary/20 text-primary-hover dark:text-primary flex items-center justify-center font-black text-xl">1</div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Discover Local Clubs</h2>
                <p className="text-text-muted dark:text-text-secondary text-lg leading-relaxed">
                  Start by browsing through a diverse range of communities in your area. Use our smart filters to narrow down by interest—whether it's hiking, coding, pottery, or book clubs.
                </p>
                <ul className="flex flex-col gap-3 mt-2">
                  <li className="flex items-center gap-3 text-gray-700 dark:text-text-secondary font-medium">
                    <span className="material-symbols-outlined text-primary">check_circle</span>
                    Advanced location filtering
                  </li>
                  <li className="flex items-center gap-3 text-gray-700 dark:text-text-secondary font-medium">
                    <span className="material-symbols-outlined text-primary">check_circle</span>
                    Browse by category or popularity
                  </li>
                  <li className="flex items-center gap-3 text-gray-700 dark:text-text-secondary font-medium">
                    <span className="material-symbols-outlined text-primary">check_circle</span>
                    View club vibes and requirements
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-12 lg:gap-20">
              <div className="w-full md:w-1/2 flex justify-center">
                <div className="relative w-full max-w-sm aspect-square bg-white dark:bg-card-dark rounded-3xl shadow-xl shadow-gray-100 dark:shadow-none border border-gray-100 dark:border-border-dark flex items-center justify-center p-8 group hover:border-blue-200 dark:hover:border-blue-700/50 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-bl from-blue-50 dark:from-blue-950/20 to-transparent rounded-3xl opacity-50"></div>
                  <div className="relative z-10 flex flex-col items-center gap-4">
                    <div className="flex -space-x-4">
                      <div className="size-14 rounded-full border-4 border-white dark:border-card-dark bg-gray-200 dark:bg-[#29382f] flex items-center justify-center text-gray-500 dark:text-text-secondary font-bold">JD</div>
                      <div className="size-14 rounded-full border-4 border-white dark:border-card-dark bg-gray-300 dark:bg-border-dark flex items-center justify-center text-gray-600 dark:text-text-secondary font-bold">AS</div>
                      <div className="size-14 rounded-full border-4 border-white dark:border-card-dark bg-primary flex items-center justify-center text-[#111714] font-bold text-sm">You</div>
                    </div>
                    <div className="px-6 py-3 bg-white dark:bg-[#29382f] rounded-xl shadow-md border border-gray-100 dark:border-border-dark flex items-center gap-3 w-full max-w-[240px]">
                      <span className="material-symbols-outlined text-green-500 dark:text-primary">check</span>
                      <span className="text-sm font-bold text-gray-800 dark:text-white">Membership Approved</span>
                    </div>
                  </div>
                  <div className="absolute -left-4 -top-4 size-16 bg-blue-500 dark:bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg -rotate-12 group-hover:rotate-0 transition-transform duration-500">
                    <span className="material-symbols-outlined text-3xl">group_add</span>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2 flex flex-col gap-6 items-start">
                <div className="size-12 rounded-full bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-xl">2</div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Join & Connect</h2>
                <p className="text-text-muted dark:text-text-secondary text-lg leading-relaxed">
                  Once you find a club that sparks your interest, simply hit 'Join'. Some clubs are open to all, while others may require a quick approval. Once inside, you're part of the family.
                </p>
                <ul className="flex flex-col gap-3 mt-2">
                  <li className="flex items-center gap-3 text-gray-700 dark:text-text-secondary font-medium">
                    <span className="material-symbols-outlined text-primary">check_circle</span>
                    Instant access to community chats
                  </li>
                  <li className="flex items-center gap-3 text-gray-700 dark:text-text-secondary font-medium">
                    <span className="material-symbols-outlined text-primary">check_circle</span>
                    View member directories
                  </li>
                  <li className="flex items-center gap-3 text-gray-700 dark:text-text-secondary font-medium">
                    <span className="material-symbols-outlined text-primary">check_circle</span>
                    Personalize your club profile
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
              <div className="w-full md:w-1/2 flex justify-center">
                <div className="relative w-full max-w-sm aspect-square bg-white dark:bg-card-dark rounded-3xl shadow-xl shadow-gray-100 dark:shadow-none border border-gray-100 dark:border-border-dark flex items-center justify-center p-8 group hover:border-purple-200 dark:hover:border-purple-700/50 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-50 dark:from-purple-950/20 to-transparent rounded-3xl opacity-50"></div>
                  <div className="relative z-10 w-full bg-white dark:bg-[#29382f] rounded-2xl shadow-md border border-gray-100 dark:border-border-dark overflow-hidden">
                    {eventsLoading ? (
                      <>
                        <div className="h-24 bg-gray-100 dark:bg-border-dark flex items-center justify-center">
                          <span className="material-symbols-outlined text-gray-300 dark:text-text-secondary text-4xl">event</span>
                        </div>
                        <div className="p-4 flex flex-col gap-2">
                          <div className="h-4 w-3/4 bg-gray-800 dark:bg-white rounded-full opacity-10"></div>
                          <div className="h-3 w-1/2 bg-gray-400 dark:bg-text-secondary rounded-full opacity-10"></div>
                          <div className="mt-2 flex justify-between items-center">
                            <div className="flex -space-x-2">
                              <div className="size-6 rounded-full bg-gray-200 dark:bg-[#29382f]"></div>
                              <div className="size-6 rounded-full bg-gray-300 dark:bg-border-dark"></div>
                            </div>
                            <div className="px-3 py-1 bg-primary text-white dark:text-[#111714] text-xs font-bold rounded-lg">RSVP</div>
                          </div>
                        </div>
                      </>
                    ) : upcomingEvent ? (
                      <>
                        <div className="h-24 bg-cover bg-center relative" style={{ backgroundImage: upcomingEvent.image ? `url("${upcomingEvent.image}")` : 'none', backgroundColor: upcomingEvent.image ? 'transparent' : '#f3f4f6' }}>
                          {!upcomingEvent.image && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="material-symbols-outlined text-gray-300 dark:text-text-secondary text-4xl">event</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                        </div>
                        <div className="p-4 flex flex-col gap-2">
                          <h4 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">{upcomingEvent.name}</h4>
                          <p className="text-xs text-text-muted dark:text-text-secondary line-clamp-1">{upcomingEvent.formattedDate || formatEventDate(upcomingEvent.date)}</p>
                          <div className="mt-2 flex justify-between items-center">
                            <div className="flex -space-x-2">
                              <div className="size-6 rounded-full bg-gray-200 dark:bg-[#29382f] border-2 border-white dark:border-[#29382f]"></div>
                              <div className="size-6 rounded-full bg-gray-300 dark:bg-border-dark border-2 border-white dark:border-[#29382f]"></div>
                            </div>
                            <div className="px-3 py-1 bg-primary text-white dark:text-[#111714] text-xs font-bold rounded-lg cursor-pointer hover:bg-primary-hover transition-colors" onClick={() => window.location.href = `/events/${upcomingEvent.id}`}>RSVP</div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="h-24 bg-gray-100 dark:bg-border-dark flex items-center justify-center">
                          <span className="material-symbols-outlined text-gray-300 dark:text-text-secondary text-4xl">event</span>
                        </div>
                        <div className="p-4 flex flex-col gap-2">
                          <div className="h-4 w-3/4 bg-gray-800 dark:bg-white rounded-full opacity-10"></div>
                          <div className="h-3 w-1/2 bg-gray-400 dark:bg-text-secondary rounded-full opacity-10"></div>
                          <div className="mt-2 flex justify-between items-center">
                            <div className="flex -space-x-2">
                              <div className="size-6 rounded-full bg-gray-200 dark:bg-[#29382f]"></div>
                              <div className="size-6 rounded-full bg-gray-300 dark:bg-border-dark"></div>
                            </div>
                            <div className="px-3 py-1 bg-primary text-white dark:text-[#111714] text-xs font-bold rounded-lg">RSVP</div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="absolute -right-4 -bottom-4 size-16 bg-purple-500 dark:bg-purple-600 text-white rounded-2xl flex items-center justify-center shadow-lg rotate-6 group-hover:rotate-0 transition-transform duration-500">
                    <span className="material-symbols-outlined text-3xl">celebration</span>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2 flex flex-col gap-6 items-start">
                <div className="size-12 rounded-full bg-purple-100 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 flex items-center justify-center font-black text-xl">3</div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Participate in Events</h2>
                <p className="text-text-muted dark:text-text-secondary text-lg leading-relaxed">
                  The magic happens in person. Browse the calendar for upcoming workshops, social mixers, and outings. RSVP with a single click and sync them to your personal calendar.
                </p>
                <ul className="flex flex-col gap-3 mt-2">
                  <li className="flex items-center gap-3 text-gray-700 dark:text-text-secondary font-medium">
                    <span className="material-symbols-outlined text-primary">check_circle</span>
                    Automated reminders
                  </li>
                  <li className="flex items-center gap-3 text-gray-700 dark:text-text-secondary font-medium">
                    <span className="material-symbols-outlined text-primary">check_circle</span>
                    Event discussions and photos
                  </li>
                  <li className="flex items-center gap-3 text-gray-700 dark:text-text-secondary font-medium">
                    <span className="material-symbols-outlined text-primary">check_circle</span>
                    Host your own meetups
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-12 lg:gap-20">
              <div className="w-full md:w-1/2 flex justify-center">
                <div className="relative w-full max-w-sm aspect-square bg-white dark:bg-card-dark rounded-3xl shadow-xl shadow-gray-100 dark:shadow-none border border-gray-100 dark:border-border-dark flex items-center justify-center p-8 group hover:border-orange-200 dark:hover:border-orange-700/50 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-bl from-orange-50 dark:from-orange-950/20 to-transparent rounded-3xl opacity-50"></div>
                  <div className="relative z-10 grid grid-cols-2 gap-4 w-full">
                    <div className="bg-white dark:bg-[#29382f] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-border-dark flex flex-col items-center gap-2">
                      <span className="material-symbols-outlined text-orange-400 dark:text-orange-500">trending_up</span>
                      <span className="text-xs font-bold text-gray-600 dark:text-text-secondary">Growth</span>
                    </div>
                    <div className="bg-white dark:bg-[#29382f] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-border-dark flex flex-col items-center gap-2">
                      <span className="material-symbols-outlined text-orange-400 dark:text-orange-500">settings</span>
                      <span className="text-xs font-bold text-gray-600 dark:text-text-secondary">Manage</span>
                    </div>
                    <div className="bg-white dark:bg-[#29382f] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-border-dark flex flex-col items-center gap-2">
                      <span className="material-symbols-outlined text-orange-400 dark:text-orange-500">campaign</span>
                      <span className="text-xs font-bold text-gray-600 dark:text-text-secondary">Promote</span>
                    </div>
                    <div className="bg-white dark:bg-[#29382f] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-border-dark flex flex-col items-center gap-2">
                      <span className="material-symbols-outlined text-orange-400 dark:text-orange-500">star</span>
                      <span className="text-xs font-bold text-gray-600 dark:text-text-secondary">Feedback</span>
                    </div>
                  </div>
                  <div className="absolute -left-4 -bottom-4 size-16 bg-orange-500 dark:bg-orange-600 text-white rounded-2xl flex items-center justify-center shadow-lg -rotate-6 group-hover:rotate-0 transition-transform duration-500">
                    <span className="material-symbols-outlined text-3xl">admin_panel_settings</span>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2 flex flex-col gap-6 items-start">
                <div className="size-12 rounded-full bg-orange-100 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 flex items-center justify-center font-black text-xl">4</div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Manage & Grow</h2>
                <p className="text-text-muted dark:text-text-secondary text-lg leading-relaxed">
                  Ready to lead? Create your own club in minutes. You get a suite of tools to manage members, schedule events, and moderate discussions.
                </p>
                <ul className="flex flex-col gap-3 mt-2">
                  <li className="flex items-center gap-3 text-gray-700 dark:text-text-secondary font-medium">
                    <span className="material-symbols-outlined text-primary">check_circle</span>
                    Powerful dashboard analytics
                  </li>
                  <li className="flex items-center gap-3 text-gray-700 dark:text-text-secondary font-medium">
                    <span className="material-symbols-outlined text-primary">check_circle</span>
                    Custom roles and permissions
                  </li>
                  <li className="flex items-center gap-3 text-gray-700 dark:text-text-secondary font-medium">
                    <span className="material-symbols-outlined text-primary">check_circle</span>
                    Integration with social platforms
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full px-4 sm:px-6 lg:px-8 py-20 bg-white dark:bg-card-dark border-t border-gray-200 dark:border-border-dark">
          <div className="max-w-[1280px] mx-auto bg-gray-900 dark:bg-card-dark rounded-[2.5rem] p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative border border-gray-800 dark:border-border-dark">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
            <div className="flex flex-col gap-4 relative z-10 max-w-xl">
              <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">Ready to find your circle?</h2>
              <p className="text-gray-400 dark:text-text-secondary text-lg">Join thousands of others who have found new friends, hobbies, and passions through ClubSphere.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 relative z-10">
              <Link to="/register" className="flex cursor-pointer items-center justify-center rounded-full h-14 px-8 bg-primary hover:bg-primary-hover transition-colors text-[#111714] text-base font-bold tracking-[0.015em] shadow-lg shadow-primary/25">
                Create Account
              </Link>
              <Link to="/clubs" className="flex cursor-pointer items-center justify-center rounded-full h-14 px-8 bg-transparent border border-white/20 hover:bg-white/10 transition-colors text-white text-base font-bold tracking-[0.015em]">
                Explore Clubs
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorks;


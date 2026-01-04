import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import api from '../lib/api';

const AboutUs = () => {
  useEffect(() => {
    document.title = 'About Us - ClubSphere';
  }, []);

  // Fetch platform statistics
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['public-stats'],
    queryFn: async () => {
      try {
        const response = await api.get('/api/public/stats');
        return response.data;
      } catch (error) {
        console.error('Error fetching stats:', error);
        return { totalClubs: 0, totalMembers: 0 };
      }
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Format numbers with proper suffixes
  const formatNumber = (num) => {
    if (!num && num !== 0) return '0';
    if (num >= 1000) {
      const thousands = (num / 1000).toFixed(1);
      return thousands.endsWith('.0') ? `${thousands.slice(0, -2)}k+` : `${thousands}k+`;
    }
    return `${num}+`;
  };

  const totalClubs = statsData?.totalClubs || 0;
  const totalMembers = statsData?.totalMembers || 0;

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark font-display text-text-main dark:text-white transition-colors duration-200">
      <Navbar />
      <main className="flex flex-col flex-1 w-full">
        {/* Hero Section */}
        <section className="w-full px-4 sm:px-6 lg:px-8 py-20 lg:py-32 flex justify-center bg-white dark:bg-card-dark border-b border-gray-200 dark:border-border-dark relative overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-40">
            <svg className="w-full h-full" height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern height="40" id="smallGrid" patternUnits="userSpaceOnUse" width="40">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,0,0,0.05)" className="dark:stroke-white/5" strokeWidth="1"></path>
                </pattern>
              </defs>
              <rect fill="url(#smallGrid)" height="100%" width="100%"></rect>
            </svg>
          </div>
          <div className="w-full max-w-[960px] flex flex-col items-center text-center gap-6 relative z-10">
            <span className="text-primary font-bold uppercase tracking-wider text-sm bg-primary/10 dark:bg-primary/20 px-4 py-1.5 rounded-full">About ClubSphere</span>
            <h1 className="text-gray-900 dark:text-white text-5xl sm:text-6xl lg:text-7xl font-black leading-tight tracking-[-0.033em]">
              We're Building the Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-600">Community</span>
            </h1>
            <p className="text-text-muted dark:text-text-secondary text-lg sm:text-xl font-normal leading-relaxed max-w-[720px]">
              In a world that's more connected than ever, we often feel more isolated. ClubSphere exists to bridge the gap between online interests and offline experiences.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="w-full px-4 sm:px-6 lg:px-8 py-20 flex justify-center">
          <div className="w-full max-w-[1280px]">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              <div className="w-full lg:w-1/2 rounded-3xl overflow-hidden shadow-2xl shadow-gray-200 dark:shadow-none rotate-1 hover:rotate-0 transition-transform duration-700 ease-out border border-gray-200 dark:border-border-dark">
                <div className="aspect-[4/3] bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuApBJ-Lz2Q_ykm5UsHclqSM7cAbHW2XA7ujopesa4hjl022IcVeBT4nXY5QhVqxYx-beL4eFJIFRSKKxqpU6jT4pt8mtA8YLsGH-D0NWMoC7GOhT7PJjOSzWd-CzN3PwXvUyGVbcLs5Zmrj_Rggdmv7Ic10U_ZYbNcphuNUT6nNTlKcmY3Ono8FWfYhE3sPZfixQV0oZLj7Asdly7zUpXqqwnptbl0-7ymlPe9sqqqbLz-MKTzNqrNYqLGcRcvcF4AnO_jDs7lVm91X")' }}></div>
              </div>
              <div className="w-full lg:w-1/2 flex flex-col gap-6">
                <h2 className="text-gray-900 dark:text-white text-3xl md:text-4xl font-bold leading-tight">Our Mission</h2>
                <div className="w-12 h-1.5 bg-primary rounded-full"></div>
                <p className="text-text-muted dark:text-text-secondary text-lg leading-relaxed">
                  ClubSphere started with a simple observation: it's easy to find content online, but hard to find your people.
                </p>
                <p className="text-text-muted dark:text-text-secondary text-lg leading-relaxed">
                  We believe that shared passions are the strongest foundation for friendship. Whether it's coding, gardening, or night running, there's a tribe out there for everyone. Our platform removes the friction of organizing, finding, and joining these local communities.
                </p>
                <div className="grid grid-cols-2 gap-6 mt-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-3xl font-black text-gray-900 dark:text-white">
                      {statsLoading ? '...' : formatNumber(totalClubs)}
                    </span>
                    <span className="text-sm text-text-muted dark:text-text-secondary font-medium">Active Clubs</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-3xl font-black text-gray-900 dark:text-white">
                      {statsLoading ? '...' : formatNumber(totalMembers)}
                    </span>
                    <span className="text-sm text-text-muted dark:text-text-secondary font-medium">Members Joined</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="w-full px-4 sm:px-6 lg:px-8 py-20 bg-white dark:bg-card-dark border-y border-gray-200 dark:border-border-dark flex justify-center">
          <div className="w-full max-w-[1280px]">
            <div className="flex flex-col gap-12">
              <div className="text-center max-w-2xl mx-auto flex flex-col gap-4">
                <h2 className="text-gray-900 dark:text-white text-3xl md:text-4xl font-bold leading-tight">Core Values</h2>
                <p className="text-text-muted dark:text-text-secondary text-lg">The principles that guide every decision we make.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-background-light dark:bg-[#29382f] p-8 rounded-2xl flex flex-col gap-4 border border-transparent hover:border-primary/30 transition-colors">
                  <div className="size-12 rounded-xl bg-green-100 dark:bg-green-950/30 text-green-600 dark:text-green-400 flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">diversity_3</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Inclusivity First</h3>
                  <p className="text-text-muted dark:text-text-secondary">We build for everyone. We believe diverse communities are stronger communities, and we actively work to create safe spaces for all.</p>
                </div>
                <div className="bg-background-light dark:bg-[#29382f] p-8 rounded-2xl flex flex-col gap-4 border border-transparent hover:border-primary/30 transition-colors">
                  <div className="size-12 rounded-xl bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">verified_user</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Trust & Safety</h3>
                  <p className="text-text-muted dark:text-text-secondary">Real world meetups require real world trust. We verify organizers and provide tools to keep members safe at every event.</p>
                </div>
                <div className="bg-background-light dark:bg-[#29382f] p-8 rounded-2xl flex flex-col gap-4 border border-transparent hover:border-primary/30 transition-colors">
                  <div className="size-12 rounded-xl bg-purple-100 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">bolt</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Empowerment</h3>
                  <p className="text-text-muted dark:text-text-secondary">We give organizers the superpowers they need to lead. From ticketing to chat, we handle the logistics so they can focus on people.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="w-full px-4 sm:px-6 lg:px-8 py-20 flex justify-center">
          <div className="w-full max-w-[1280px]">
            <div className="flex flex-col gap-12">
              <div className="flex justify-between items-end">
                <div className="flex flex-col gap-2">
                  <h2 className="text-gray-900 dark:text-white text-3xl md:text-4xl font-bold leading-tight">Meet the Team</h2>
                  <p className="text-text-muted dark:text-text-secondary text-lg">The people working behind the scenes to bring you together.</p>
                </div>
                <a className="hidden sm:flex items-center gap-1 text-primary-hover dark:text-primary font-bold hover:underline" href="#">
                  See open positions <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="flex flex-col gap-4 group">
                  <div className="aspect-square rounded-2xl bg-gray-100 dark:bg-[#29382f] overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-200 dark:from-border-dark to-gray-300 dark:to-[#29382f] flex items-end justify-center">
                      <span className="material-symbols-outlined text-9xl text-white dark:text-text-secondary opacity-50 -mb-4">person</span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Alex Johnson</h3>
                    <span className="text-sm text-primary font-medium">Co-Founder & CEO</span>
                    <p className="text-text-muted dark:text-text-secondary text-sm mt-2">Former community organizer passionate about scalable social impact.</p>
                  </div>
                </div>
                <div className="flex flex-col gap-4 group">
                  <div className="aspect-square rounded-2xl bg-gray-100 dark:bg-[#29382f] overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-200 dark:from-border-dark to-gray-300 dark:to-[#29382f] flex items-end justify-center">
                      <span className="material-symbols-outlined text-9xl text-white dark:text-text-secondary opacity-50 -mb-4">person_4</span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Samantha Rivera</h3>
                    <span className="text-sm text-primary font-medium">Head of Product</span>
                    <p className="text-text-muted dark:text-text-secondary text-sm mt-2">Building intuitive experiences that make joining clubs effortless.</p>
                  </div>
                </div>
                <div className="flex flex-col gap-4 group">
                  <div className="aspect-square rounded-2xl bg-gray-100 dark:bg-[#29382f] overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-200 dark:from-border-dark to-gray-300 dark:to-[#29382f] flex items-end justify-center">
                      <span className="material-symbols-outlined text-9xl text-white dark:text-text-secondary opacity-50 -mb-4">person_3</span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Marcus Chen</h3>
                    <span className="text-sm text-primary font-medium">Lead Developer</span>
                    <p className="text-text-muted dark:text-text-secondary text-sm mt-2">Full-stack wizard ensuring the platform runs smoothly 24/7.</p>
                  </div>
                </div>
                <div className="flex flex-col gap-4 group">
                  <div className="aspect-square rounded-2xl bg-gray-100 dark:bg-[#29382f] overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-200 dark:from-border-dark to-gray-300 dark:to-[#29382f] flex items-end justify-center">
                      <span className="material-symbols-outlined text-9xl text-white dark:text-text-secondary opacity-50 -mb-4">person_2</span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Jordan Lee</h3>
                    <span className="text-sm text-primary font-medium">Community Manager</span>
                    <p className="text-text-muted dark:text-text-secondary text-sm mt-2">The friendly face helping our club organizers succeed.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full px-4 sm:px-6 lg:px-8 py-24 bg-gray-900 dark:bg-card-dark text-white flex justify-center relative overflow-hidden border-t border-gray-800 dark:border-border-dark">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary opacity-10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-600 opacity-10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="w-full max-w-[800px] text-center flex flex-col gap-8 relative z-10">
            <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tight">
              Ready to find your tribe?
            </h2>
            <p className="text-gray-300 dark:text-text-secondary text-lg leading-relaxed max-w-2xl mx-auto">
              Join thousands of others who have found new friends, new hobbies, and new adventures through ClubSphere.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
              <Link to="/clubs" className="cursor-pointer items-center justify-center rounded-full h-14 px-8 bg-primary hover:bg-primary-hover text-[#111714] text-base font-bold transition-colors flex">
                Explore Clubs
              </Link>
              <Link to="/register" className="cursor-pointer items-center justify-center rounded-full h-14 px-8 bg-transparent border border-white/20 hover:bg-white/10 text-white text-base font-bold transition-colors flex">
                Start a Club
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutUs;


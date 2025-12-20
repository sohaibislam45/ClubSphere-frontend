import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import EventCard from '../components/ui/EventCard';
import Loader from '../components/ui/Loader';
import api from '../lib/api';

const Events = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Fetch events - using mock data for now
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events', searchTerm, selectedFilter],
    queryFn: async () => {
      // TODO: Replace with actual API call
      // const response = await api.get('/events', { params: { search: searchTerm, filter: selectedFilter } });
      // return response.data;
      
      // Mock data
      const mockEvents = [
        {
          id: 1,
          title: "Neon Night Run",
          location: "Central Park, NY",
          eventDate: "2024-10-24T19:00:00",
          eventFee: 0,
          isPaid: false,
          clubName: "City Runners",
          clubImage: "https://via.placeholder.com/32",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAwhj2rEWhnFgzxlCMRBfgO0TYn8VE2XvZ4aSyaKZTm-mJiw6rqHQGYtVXkRo8iR_1mlfkH0lJ84kUdO68Gt6MbFxToEZOCmVWGdU-NhGr7MxdOx5mq2yJ_ph4th0DTQKc_WMzSUj96-wz4-OM3W0QWAQnqZQ0QZcOawHCXAMkNHP5S2f26rAJoAg3L_NldttCOysJ-SRQNgF7jC4opJf0oE4bgrmKQjBVVkp9gGvp_PrQJQLvxd5zOwd2ut8b0sqfiBxJs_fZSthBD"
        },
        {
          id: 2,
          title: "Pottery Workshop",
          location: "Makers Studio, Downtown",
          eventDate: "2024-11-02T14:00:00",
          eventFee: 15,
          isPaid: true,
          clubName: "Creative Souls",
          clubImage: "https://via.placeholder.com/32",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCsyd_7J1FqXTJQlhjNgvZG8zJUu75jceF8e7RPJAk0YIAHIevojqJxU2WUA4gw69SRzLxl2y8mmVGjsmeCsGZO1PfvzfKuWPnBlnxqsoYqlFwD-Psujd8WiJqBZnaP8N70SZO97FORTVv2RSNNmEtIXTyUc9vyh9hA9MnMr2JaK8hvbOvSHhq0pAA2NmPRv34KGmYWHZtc6Teb8Z2Z8KWwaZnfnu5gdXWmxlW5CdL3J_xct_W-7d51IEigG-hS-4rnqjA02Lpwnxa"
        },
        {
          id: 3,
          title: "Tech Networking Night",
          location: "Innovation Hub, SF",
          eventDate: "2024-11-05T18:00:00",
          eventFee: 0,
          isPaid: false,
          clubName: "Dev Connect",
          clubImage: "https://via.placeholder.com/32",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBMA55R4wyXmyRrcZVtCF2oRWQ6G_W_YHXwt_nVKin_sF6tVWcvkZp64cLcMfY9E0TWqipiVeCbXI1BngRbUf2Fsf48VXO8ye1UA4Z_p8OoSkHZgiiRVgVgJravbALpmzPDzBZ0f6PWzq-zdfbXvkzijApoPUsGVqFEed5A1-FnUp_fKQMkZXUirkkNc4xMZ5a8rREhCZuasICvkycN2OmH2CrWBNb-h9dpy7taigLIKKOMe4OahR-hLCz5yju8mA23L0MYPoKVi8t6"
        },
        {
          id: 4,
          title: "Community Garden Day",
          location: "Westside Green, Seattle",
          eventDate: "2024-11-07T09:00:00",
          eventFee: 0,
          isPaid: false,
          clubName: "Green Thumbs",
          clubImage: "https://via.placeholder.com/32",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4RFm9wsMRc1TAsZx0_Ml9ijI7SeV0ORFKGU5pEENXuz4IV47rarJj-hzl3eNjs3H3qsmy9WgbGvxbP5Po1k_w5s-IdpZxYmIOMDmL0wrmonNIqYTwkJReDWhM18hKwB2yeFGcHLaoT8k7blhVr7ezIEudA278mI3tjkO5uJAWL0YJSfLNc9RTG12d_Ex4GnY0pBl6hglcvftKuL1viDBHn-2qBSjli5NxDDHGcyGjY_SHK0aoQu5Qqaqo0RD8a_0fnwJ_8mjXo4_P"
        },
        {
          id: 5,
          title: "Jazz in the Park",
          location: "Amphitheater, Chicago",
          eventDate: "2024-11-12T19:30:00",
          eventFee: 20,
          isPaid: true,
          clubName: "City Vibes",
          clubImage: "https://via.placeholder.com/32",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCXRvaWMeXgBFwJ9QuSppOTQ8HgIgRqKVJt3NL1qPPArdO8BGJcorWeCfgSrT4RNwA9gAq0eOkSpeM_gyWQqRgqgw2kd75A3C7NSx6Y5vYJOxMPyGLAMuN_uR8QMJ_G9Bvdn8nTGtHUsZu4hljNZgHrse7fkSEw-5C0zHzBcz8kiLbcyPWdxqlOud_dV_jsRl0g8YnEDHqsPDN-qIcHRvhSz9NNpNghtJq4PeuTI8c1nH4eDWCVliwFExWSmkhRZ4gKy0wyvVSIcZYX"
        },
        {
          id: 6,
          title: "Coding Bootcamp Intro",
          location: "Online Event",
          eventDate: "2024-11-15T10:00:00",
          eventFee: 0,
          isPaid: false,
          clubName: "Code Academy",
          clubImage: "https://via.placeholder.com/32",
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC1oWRzQQjr1HdxtCWmxoeklVDd7Ssx0r6aGGYXtNgLIZ_GxYhAztrW7FpiVCwWuWUF8pCWCB0EfAx1Hy3aMdxYFm86cU4h2Ho9Bw2aEPm7lpMgjrfNbBuJ0W9REpdYYfT4FqbIexvzU74W7KqZ5XcDwk3C3K6sO0RmZqq3mYkrACYkO7poVuTB-2I0I2d189Q61PCQOsLB89xcDPJz5bt0StBQF4zZg9aK2THe9kbnE4eoOmJ7ps86UtSXs_3CuV3nURVo-W2JaTlx"
        }
      ];
      
      return mockEvents;
    },
  });

  const filteredEvents = events.filter((event) => {
    const matchesSearch = !searchTerm || 
      event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.clubName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'free') {
      return matchesSearch && event.eventFee === 0;
    }
    return matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark-alt text-slate-900 dark:text-white font-display">
      <Navbar />
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Page Header & Controls */}
        <div className="flex flex-col gap-8 mb-10">
          {/* Title */}
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
              Discover Local Events
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl">
              Browse and join upcoming gatherings, workshops, and meetups in your community.
            </p>
          </div>
          
          {/* Search & Filters Toolbar */}
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:max-w-md group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input
                className="w-full h-12 pl-11 pr-4 rounded-full bg-white dark:bg-surface-dark-alt2 border border-slate-200 dark:border-border-dark text-slate-900 dark:text-white placeholder-slate-400 focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
                placeholder="Search events by name, club, or location..."
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 lg:pb-0 hide-scrollbar">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`flex items-center gap-2 h-10 pl-4 pr-3 rounded-full text-sm font-semibold transition-colors ${
                  selectedFilter === 'all'
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-surface-dark'
                    : 'bg-white dark:bg-surface-dark-alt2 border border-slate-200 dark:border-border-dark text-slate-600 dark:text-slate-300 hover:border-primary dark:hover:border-primary hover:text-primary dark:hover:text-primary'
                }`}
              >
                All Dates
                <span className="material-symbols-outlined text-lg">expand_more</span>
              </button>
              <button
                onClick={() => setSelectedFilter('category')}
                className="flex items-center gap-2 h-10 pl-4 pr-3 rounded-full bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark text-slate-600 dark:text-slate-300 text-sm font-medium hover:border-primary dark:hover:border-primary hover:text-primary dark:hover:text-primary transition-colors shadow-sm"
              >
                Category
                <span className="material-symbols-outlined text-lg">expand_more</span>
              </button>
              <button
                onClick={() => setSelectedFilter('price')}
                className="flex items-center gap-2 h-10 pl-4 pr-3 rounded-full bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark text-slate-600 dark:text-slate-300 text-sm font-medium hover:border-primary dark:hover:border-primary hover:text-primary dark:hover:text-primary transition-colors shadow-sm"
              >
                Price
                <span className="material-symbols-outlined text-lg">expand_more</span>
              </button>
              <button
                onClick={() => setSelectedFilter('free')}
                className={`flex items-center gap-2 h-10 px-4 rounded-full text-sm font-medium transition-colors shadow-sm ${
                  selectedFilter === 'free'
                    ? 'bg-primary text-black'
                    : 'bg-white dark:bg-surface-dark-alt2 border border-slate-200 dark:border-border-dark text-slate-600 dark:text-slate-300 hover:border-primary dark:hover:border-primary hover:text-primary dark:hover:text-primary'
                }`}
              >
                Free Only
              </button>
            </div>
          </div>
        </div>

        {/* Event Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
            {filteredEvents.length === 0 && (
              <div className="text-center py-12">
                <p className="text-text-secondary text-lg">No events found. Try adjusting your search or filters.</p>
              </div>
            )}
            {filteredEvents.length > 0 && (
              <div className="flex justify-center mt-12 pb-12">
                <button className="group flex items-center justify-center gap-2 h-12 px-8 rounded-full bg-white dark:bg-surface-dark-alt2 border border-slate-200 dark:border-border-dark text-slate-900 dark:text-white font-bold hover:bg-primary dark:hover:bg-primary hover:text-black dark:hover:text-black hover:border-primary dark:hover:border-primary transition-all duration-300 shadow-sm">
                  Load More Events
                  <span className="material-symbols-outlined group-hover:translate-y-1 transition-transform">keyboard_arrow_down</span>
                </button>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Events;


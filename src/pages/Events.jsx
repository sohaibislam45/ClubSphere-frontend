import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import EventCard from '../components/ui/EventCard';
import Loader from '../components/ui/Loader';
import api from '../lib/api';

const Events = () => {
  useEffect(() => {
    document.title = 'Upcoming Events - ClubSphere';
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Fetch events from API
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events', searchTerm, selectedFilter],
    queryFn: async () => {
      const response = await api.get('/api/events', { 
        params: { 
          search: searchTerm, 
          filter: selectedFilter 
        } 
      });
      return response.data;
    },
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
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
            {events.length === 0 && (
              <div className="text-center py-12">
                <p className="text-text-secondary text-lg">No events found. Try adjusting your search or filters.</p>
              </div>
            )}
            {events.length > 0 && events.length >= 9 && (
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


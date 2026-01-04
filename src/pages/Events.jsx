import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import EventCard from '../components/ui/EventCard';
import Loader from '../components/ui/Loader';
import Pagination from '../components/ui/Pagination';
import api from '../lib/api';

const Events = () => {
  const { t } = useTranslation();
  useEffect(() => {
    document.title = 'Upcoming Events - ClubSphere';
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('oldest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedFilter, sortBy]);

  // Fetch events from API
  const { data, isLoading } = useQuery({
    queryKey: ['events', searchTerm, selectedFilter, sortBy, currentPage],
    queryFn: async () => {
      const response = await api.get('/api/events', { 
        params: { 
          search: searchTerm, 
          filter: selectedFilter,
          sortBy: sortBy,
          page: currentPage,
          limit: itemsPerPage
        } 
      });
      return response.data || { events: [], pagination: { page: 1, limit: itemsPerPage, total: 0, totalPages: 0 } };
    },
  });

  const events = data?.events || [];
  const pagination = data?.pagination || { page: 1, limit: itemsPerPage, total: 0, totalPages: 0 };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark-alt text-slate-900 dark:text-white font-display">
      <Navbar />
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Page Header & Controls */}
        <div className="flex flex-col gap-8 mb-10">
          {/* Title */}
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
              {t('events.title')}
            </h1>
            <p className="text-lg text-text-muted dark:text-slate-400 max-w-2xl">
              {t('events.subtitle')}
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
                placeholder={t('events.searchPlaceholder')}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-4 items-center">
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-10 pl-4 pr-10 rounded-full bg-white dark:bg-surface-dark-alt2 border border-slate-200 dark:border-border-dark text-slate-900 dark:text-white text-sm font-medium focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm appearance-none cursor-pointer hover:border-primary dark:hover:border-primary"
                >
                  <option value="newest">{t('events.newestFirst')}</option>
                  <option value="oldest">{t('events.oldestFirst')}</option>
                  <option value="highest_fee">{t('events.highestFee')}</option>
                  <option value="lowest_fee">{t('events.lowestFee')}</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="material-symbols-outlined text-lg text-slate-400">expand_more</span>
                </div>
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
                  {t('events.allDates')}
                  <span className="material-symbols-outlined text-lg">expand_more</span>
                </button>
                <button
                  onClick={() => setSelectedFilter('category')}
                  className="flex items-center gap-2 h-10 pl-4 pr-3 rounded-full bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark text-slate-600 dark:text-slate-300 text-sm font-medium hover:border-primary dark:hover:border-primary hover:text-primary dark:hover:text-primary transition-colors shadow-sm"
                >
                  {t('events.category')}
                  <span className="material-symbols-outlined text-lg">expand_more</span>
                </button>
                <button
                  onClick={() => setSelectedFilter('price')}
                  className="flex items-center gap-2 h-10 pl-4 pr-3 rounded-full bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark text-slate-600 dark:text-slate-300 text-sm font-medium hover:border-primary dark:hover:border-primary hover:text-primary dark:hover:text-primary transition-colors shadow-sm"
                >
                  {t('events.price')}
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
                  {t('events.freeOnly')}
                </button>
              </div>
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
                <p className="text-text-muted dark:text-text-secondary text-lg">{t('events.noEventsFound')}</p>
              </div>
            )}
            {pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
                totalItems={pagination.total}
                itemsPerPage={itemsPerPage}
              />
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Events;


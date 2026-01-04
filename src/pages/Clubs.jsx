import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ClubCard from '../components/ui/ClubCard';
import Loader from '../components/ui/Loader';
import api from '../lib/api';

const Clubs = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    document.title = 'Discover Clubs - ClubSphere';
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  // Sync search term with URL params when URL changes
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    setSearchTerm(urlSearch);
  }, [searchParams]);

  // Fetch clubs from API
  const { data: clubs = [], isLoading } = useQuery({
    queryKey: ['clubs', searchTerm, selectedCategory, sortBy],
    queryFn: async () => {
      try {
        const params = {};
        if (searchTerm) {
          params.search = searchTerm;
        }
        if (selectedCategory && selectedCategory !== 'all') {
          params.category = selectedCategory;
        }
        if (sortBy) {
          params.sortBy = sortBy;
        }
        const response = await api.get('/api/clubs', { params });
        return response.data || [];
      } catch (error) {
        console.error('Error fetching clubs:', error);
        // Return empty array on error instead of throwing
        return [];
      }
    },
  });

  const categories = ['all', 'Fitness', 'Tech', 'Lifestyle', 'Arts', 'Sports', 'Social'];

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark-alt text-slate-900 dark:text-white font-display">
      <Navbar />
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Page Header */}
        <div className="flex flex-col gap-8 mb-10">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
              {t('clubs.title')}
            </h1>
            <p className="text-lg text-text-muted dark:text-slate-400 max-w-2xl">
              {t('clubs.subtitle')}
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
                className="w-full h-12 pl-11 pr-4 rounded-full bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark text-slate-900 dark:text-white placeholder-slate-400 focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
                placeholder={t('clubs.searchPlaceholder')}
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
                  className="h-10 pl-4 pr-10 rounded-full bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark text-slate-900 dark:text-white text-sm font-medium focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm appearance-none cursor-pointer hover:border-primary dark:hover:border-primary"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest_fee">Highest Fee</option>
                  <option value="lowest_fee">Lowest Fee</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="material-symbols-outlined text-lg text-slate-400">expand_more</span>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 lg:pb-0 hide-scrollbar">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`flex items-center gap-2 h-10 pl-4 pr-3 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-surface-dark'
                        : 'bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark text-slate-600 dark:text-slate-300 hover:border-primary dark:hover:border-primary hover:text-primary dark:hover:text-primary'
                    }`}
                  >
                    {category === 'all' ? t('clubs.allCategories') : category}
                    {selectedCategory === category && (
                      <span className="material-symbols-outlined text-lg">check</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Clubs Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
              {clubs.map((club) => (
                <ClubCard key={club.id} club={club} />
              ))}
            </div>
            {clubs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-text-muted dark:text-text-secondary text-lg">{t('clubs.noClubsFound')}</p>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Clubs;


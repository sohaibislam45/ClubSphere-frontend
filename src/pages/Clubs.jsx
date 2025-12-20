import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ClubCard from '../components/ui/ClubCard';
import Loader from '../components/ui/Loader';
import api from '../lib/api';

const Clubs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Fetch clubs - using mock data for now since backend isn't ready
  const { data: clubs = [], isLoading } = useQuery({
    queryKey: ['clubs', searchTerm, selectedCategory],
    queryFn: async () => {
      // TODO: Replace with actual API call
      // const response = await api.get('/clubs', { params: { search: searchTerm, category: selectedCategory } });
      // return response.data;
      
      // Mock data for now
      return [
        {
          id: 1,
          clubName: "Neon Runners",
          category: "Fitness",
          location: "Seattle, WA",
          membershipFee: 10,
          memberCount: 1200,
          bannerImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuB1oVhmYN0DfGgB3WM3uMQa2TeHZMqqJxnDx34d1QAZLoETbEi83st3nfM8GceERbgrwfthKtMc2WNKhP76RH08ZBju-M5ig9sWeFJLn8HDmhUzlWfZ3KRgz5rd7RB-W4zOaWvrNgfJo_ZC8xpQfA59kE_Ke8L1r29e6laR5N_StIqoXR6B4ARg0OwgYyvz2L93Crrg3j3KeFItlJ2vW8KD64ThdOMAykMdix4bLJhrGLFj0VDuLthxAfIo9pUUHsEPmH0XQ7fK7fyK"
        },
        {
          id: 2,
          clubName: "Midnight Coders",
          category: "Tech",
          location: "San Francisco, CA",
          membershipFee: 0,
          memberCount: 850,
          bannerImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBteC4aGpO3UEQXOWahWRrPoqJZTbGLB5VqPjOoIiSE5a_L60C9b8AMfuZq2ipa-1QiCKKuciucMYXan_PuaVabc5oAy4LuO1YZ83f4d3RwOwX0De1CCG1X4N3evjKcde9HiedZVzjoBGmuL9iuFYMzoRE59AD9SF0H9vUMPh6m0irxXqE4UQTIJ6-P9k4R_If4xbyOIpeS8p0lh8J6c0_9zXotZrjUdk6SK0Kc-9HsiuC-GwEIcZ_YgKQyo7gUqyRVVUCFaGH1TT_i"
        },
        {
          id: 3,
          clubName: "Urban Gardeners",
          category: "Lifestyle",
          location: "Portland, OR",
          membershipFee: 5,
          memberCount: 300,
          bannerImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZ-wgSneLBqO6Sku_rwpzpS1eFz-IhhRGFH8KHnVT9FHHxZ_0cx1bfk7AkIAu2iIbrYOO6z6wWwusT58_gt2Xx6gGB-mr-HJHdsK0V1ioJgfjJ8zjp3_jEzrE4241ISMv3HZdPQHWyVsUUISVAkWZkvsQmfixjUV55qpJN9yBW3hFElFviW_UwgFnqcvoQl_nkYhx4PxLwqK3cI_GruSKoJ6oaoAJb8kqB7bpsFcSjfKo6W99B0RkLWxQdWdqeT_0FZ4qZ4ZgbsDPd"
        },
        {
          id: 4,
          clubName: "Canvas & Coffee",
          category: "Arts",
          location: "New York, NY",
          membershipFee: 15,
          memberCount: 150,
          bannerImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDkW4HrA3xdKEXDesEnRS4_i5RWy0V3PmwPD6VYkidpg8GaiVi_NvLKn3o__ILmJSXxp1QFMHXJ-xlyt78_VS0TTMJmiBwNwAcl5HFFdr5C_r2RTcC4noem9eZiHEvOphfr8D2tJ8DAyd1w78l0s0DeyDtO8R9D6v4Ps11GVF0ncUNffrUfHkh99vZ3u2FVPCdrvFa0Lj1Bu22DyWfdXHpBe-dnKS3VgAgfq2saI_sgJcQOeLb_rZtDTemwTQIi-kQfkGbNQLGV89aC"
        }
      ];
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
              Discover Local Clubs
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl">
              Browse and join clubs in your community. Find your people, share your passions.
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
                placeholder="Search clubs by name or location..."
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
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
                  {category === 'all' ? 'All Categories' : category}
                  {selectedCategory === category && (
                    <span className="material-symbols-outlined text-lg">check</span>
                  )}
                </button>
              ))}
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
              {clubs
                .filter((club) => {
                  const matchesSearch = !searchTerm || 
                    club.clubName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    club.location?.toLowerCase().includes(searchTerm.toLowerCase());
                  const matchesCategory = selectedCategory === 'all' || club.category === selectedCategory;
                  return matchesSearch && matchesCategory;
                })
                .map((club) => (
                  <ClubCard key={club.id} club={club} />
                ))}
            </div>
            {clubs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-text-secondary text-lg">No clubs found. Try adjusting your search or filters.</p>
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


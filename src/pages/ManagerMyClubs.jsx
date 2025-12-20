import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import ManagerSidebar from '../components/layout/ManagerSidebar';
import Loader from '../components/ui/Loader';

const ManagerMyClubs = () => {
  const { user, logout } = useAuth();

  useEffect(() => {
    document.title = 'My Clubs - Club Manager - ClubSphere';
  }, []);
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Clubs');

  // Fetch clubs
  const { data: clubsData, isLoading, error } = useQuery({
    queryKey: ['managerClubs', search, categoryFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (categoryFilter && categoryFilter !== 'All Clubs') params.append('category', categoryFilter);
      const response = await api.get(`/api/manager/clubs?${params.toString()}`);
      return response.data;
    }
  });

  const clubs = clubsData?.clubs || [];
  const categories = ['All Clubs', 'Sports', 'Technology', 'Lifestyle', 'Arts & Culture'];

  const handleManageClub = (clubId) => {
    navigate(`/dashboard/club-manager/clubs/${clubId}/members`);
  };

  const handleEditClub = (clubId) => {
    // TODO: Open edit modal or navigate to edit page
    console.log('Edit club:', clubId);
  };

  const handleCreateEvent = (clubId) => {
    navigate(`/dashboard/club-manager/events?clubId=${clubId}`);
  };

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <ManagerSidebar />

      {/* Main Content */}
      <main className="flex flex-1 flex-col overflow-y-auto bg-background-light dark:bg-background-dark">
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 lg:hidden">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">spa</span>
            <span className="text-lg font-bold">ClubMgr</span>
          </div>
          <button className="rounded-full bg-surface-dark p-2 text-white">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>

        <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col p-4 lg:p-10">
          {/* Page Heading & Actions */}
          <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl font-black leading-tight tracking-tight text-white md:text-5xl">My Clubs</h1>
              <p className="text-base text-[#9eb7a8]">View and manage your active communities</p>
            </div>
            <button className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-[#111714] shadow-lg shadow-primary/20 transition-transform hover:scale-105 active:scale-95">
              <span className="material-symbols-outlined text-[20px]">add</span>
              Create New Club
            </button>
          </div>

          {/* Filters & Search */}
          <div className="mb-8 flex flex-col gap-4 xl:flex-row xl:items-center">
            {/* Search Bar */}
            <div className="relative flex h-12 w-full max-w-md items-center rounded-xl bg-surface-dark transition-colors focus-within:bg-surface-hover">
              <div className="flex h-full w-12 items-center justify-center text-[#9eb7a8]">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input
                className="h-full flex-1 bg-transparent pr-4 text-base font-medium text-white placeholder-[#5d7365] focus:outline-none"
                placeholder="Search clubs by name..."
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {/* Filter Chips */}
            <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 xl:pb-0">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setCategoryFilter(category)}
                  className={`flex h-10 items-center justify-center rounded-full px-5 text-sm font-medium transition-colors ${
                    categoryFilter === category
                      ? 'bg-primary text-background-dark font-bold'
                      : 'bg-surface-dark text-[#9eb7a8] hover:bg-surface-hover hover:text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Layout */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-red-400">Error loading clubs. Please try again.</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
              {clubs.map((club) => (
                <div
                  key={club.id}
                  className="group relative flex flex-col overflow-hidden rounded-xl bg-surface-dark shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5"
                >
                  {/* Image */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-dark to-transparent opacity-60"></div>
                    {club.image ? (
                      <div
                        className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{ backgroundImage: `url("${club.image}")` }}
                      ></div>
                    ) : (
                      <div className="h-full w-full bg-primary/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-6xl text-primary/50">groups</span>
                      </div>
                    )}
                    <div className="absolute right-4 top-4 rounded-full bg-black/40 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                      {club.category}
                    </div>
                  </div>
                  {/* Content */}
                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <h3 className="mb-1 text-xl font-bold text-white">{club.name}</h3>
                        <p className="text-sm text-[#9eb7a8]">{club.schedule || club.description}</p>
                      </div>
                      <button className="text-[#9eb7a8] hover:text-white">
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>
                    </div>
                    {/* Stats */}
                    <div className="mb-6 grid grid-cols-2 gap-4 rounded-lg bg-black/20 p-3">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[20px]">group</span>
                        <div>
                          <p className="text-xs text-[#9eb7a8]">Members</p>
                          <p className="text-sm font-bold text-white">{club.memberCount || 0}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {club.upcomingEventCount > 0 ? (
                          <>
                            <span className="material-symbols-outlined text-primary text-[20px]">event</span>
                            <div>
                              <p className="text-xs text-[#9eb7a8]">Events</p>
                              <p className="text-sm font-bold text-white">{club.upcomingEventCount} Upcoming</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-[#9eb7a8] text-[20px]">event_busy</span>
                            <div>
                              <p className="text-xs text-[#9eb7a8]">Events</p>
                              <p className="text-sm font-bold text-white">None</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    {/* Actions */}
                    <div className="mt-auto flex gap-3">
                      <button
                        onClick={() => handleManageClub(club.id)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary py-2.5 text-sm font-bold text-[#111714] transition-colors hover:bg-[#2ecc71]"
                      >
                        Manage
                      </button>
                      <button
                        onClick={() => handleCreateEvent(club.id)}
                        className="flex size-10 items-center justify-center rounded-full border border-white/10 text-white transition-colors hover:bg-white/10"
                        title="Quick Event"
                      >
                        <span className="material-symbols-outlined text-[20px]">add_circle</span>
                      </button>
                      <button
                        onClick={() => handleEditClub(club.id)}
                        className="flex size-10 items-center justify-center rounded-full border border-white/10 text-white transition-colors hover:bg-white/10"
                        title="Edit Details"
                      >
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {/* Add New Club Card */}
              <div className="group relative flex flex-col overflow-hidden rounded-xl border border-dashed border-white/10 bg-transparent shadow-sm transition-all hover:border-primary/50">
                <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-4 p-8 text-center">
                  <div className="flex size-16 items-center justify-center rounded-full bg-surface-dark text-[#9eb7a8] transition-colors group-hover:bg-primary group-hover:text-background-dark">
                    <span className="material-symbols-outlined text-3xl">add</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Start a New Club</h3>
                    <p className="mt-1 text-sm text-[#9eb7a8]">Build a community around your passion</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ManagerMyClubs;


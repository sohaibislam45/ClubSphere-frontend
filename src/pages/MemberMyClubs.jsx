import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import MemberSidebar from '../components/layout/MemberSidebar';
import Loader from '../components/ui/Loader';
import api from '../lib/api';
import Swal from '../lib/sweetalertConfig';

const MemberMyClubs = () => {
  const { user } = useAuth();

  useEffect(() => {
    document.title = 'My Clubs - ClubSphere';
  }, []);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const { data, isLoading, error } = useQuery({
    queryKey: ['myClubs', search, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter !== 'All') params.append('status', statusFilter);
      
      const response = await api.get(`/api/member/clubs?${params.toString()}`);
      return response.data;
    }
  });

  const clubs = data?.clubs || [];

  const getStatusBadgeClass = (statusColor) => {
    switch (statusColor) {
      case 'primary':
        return 'bg-primary text-slate-900';
      case 'yellow':
        return 'bg-yellow-400 text-slate-900';
      case 'gray':
        return 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300';
      default:
        return 'bg-primary text-slate-900';
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white overflow-hidden h-screen flex">
      <MemberSidebar />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Navigation */}
        <header className="flex items-center justify-between border-b border-gray-200 dark:border-[#29382f] px-6 py-4 bg-background-light dark:bg-background-dark z-10">
          <div className="flex items-center gap-4 lg:hidden">
            <button className="text-slate-900 dark:text-white">
              <span className="material-symbols-outlined">menu</span>
            </button>
            <h2 className="text-lg font-bold">Member</h2>
          </div>
          <div className="hidden lg:block"></div>
          <div className="flex flex-1 justify-end gap-6 items-center">
            <div className="hidden md:flex items-center gap-6">
              <a className="text-sm font-medium text-slate-600 dark:text-[#9eb7a8] hover:text-primary transition-colors" href="#">
                Community
              </a>
              <a className="text-sm font-medium text-slate-600 dark:text-[#9eb7a8] hover:text-primary transition-colors" href="#">
                Support
              </a>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative text-slate-600 dark:text-white hover:text-primary transition-colors">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-0 right-0 size-2 bg-primary rounded-full border-2 border-background-light dark:border-background-dark"></span>
              </button>
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user?.name || 'User avatar'}
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-gray-200 dark:ring-[#29382f] object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-gray-200 dark:ring-[#29382f]"
                  style={{
                    backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBnJRDgIKAxru4eg8OyTzDB2XEyyalQzrU02fNByEltPepPKOWD98l2nXTSU8E1doDQai6vTw1DEkxFW01hsAMBB9AMbHCKkUdELqUO9u_Lh3rx2FItbSN1GdbFh6Umsy3A2y0F_HTXPU7jQLM_YmiDbMF17--PvfS3wjYLXRkG1KIubl8ZLr7SA3v79i7R3jToIX9RLXm5bdX2fGsrZ3VckewDz3Ehz9xsctYKVXqHUWiPToMSEcjYptM6GhomFslCJuZSDSRX3Z-Q")'
                  }}
                ></div>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:px-12 pb-20">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <Loader />
            </div>
          ) : (
          <div className="max-w-7xl mx-auto flex flex-col gap-8">
            {/* Breadcrumbs */}
            <nav className="flex flex-wrap gap-2 text-sm">
              <a className="text-slate-500 dark:text-[#9eb7a8] hover:text-primary font-medium" href="#">
                Home
              </a>
              <span className="text-slate-500 dark:text-[#9eb7a8] font-medium">/</span>
              <a className="text-slate-500 dark:text-[#9eb7a8] hover:text-primary font-medium" href="#">
                Dashboard
              </a>
              <span className="text-slate-500 dark:text-[#9eb7a8] font-medium">/</span>
              <span className="text-slate-900 dark:text-white font-medium">My Clubs</span>
            </nav>

            {/* Page Heading & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
                  My Clubs
                </h1>
                <p className="text-slate-500 dark:text-[#9eb7a8]">
                  Manage your memberships and explore new communities.
                </p>
              </div>
              <button className="flex items-center justify-center gap-2 bg-primary hover:bg-green-400 text-slate-900 font-bold rounded-full h-12 px-6 transition-all transform hover:scale-105 shadow-lg shadow-primary/20 whitespace-nowrap">
                <span className="material-symbols-outlined text-[20px]">add_circle</span>
                <span>Find New Clubs</span>
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Input */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-400 dark:text-[#9eb7a8]">search</span>
                </div>
                <input
                  className="w-full h-12 pl-12 pr-4 rounded-xl bg-white dark:bg-[#29382f] border border-gray-200 dark:border-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-[#9eb7a8] focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="Search clubs by name..."
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              
              {/* Filter Dropdown */}
              <div className="relative min-w-[180px]">
                <select
                  className="appearance-none w-full h-12 pl-4 pr-10 rounded-xl bg-white dark:bg-[#29382f] border border-gray-200 dark:border-transparent text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none cursor-pointer"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option>Status: All</option>
                  <option>Status: Active</option>
                  <option>Status: Expired</option>
                  <option>Status: Pending</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-400 dark:text-[#9eb7a8]">expand_more</span>
                </div>
              </div>
            </div>

            {/* Content Grid */}
            {error ? (
              <div className="text-center py-20">
                <p className="text-red-400 mb-4">Error loading clubs</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="text-primary hover:underline"
                >
                  Try again
                </button>
              </div>
            ) : clubs.length === 0 ? (
              <div className="text-center py-20 text-slate-400">
                <p className="text-lg mb-2">No clubs found</p>
                <p className="text-sm">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {clubs.map((club) => (
                  <article
                    key={club.id}
                    className={`group flex flex-col bg-white dark:bg-surface-dark rounded-2xl overflow-hidden border border-gray-100 dark:border-transparent transition-all duration-300 shadow-sm hover:shadow-xl ${
                      club.statusColor === 'yellow'
                        ? 'hover:border-yellow-400/50 dark:hover:border-yellow-400/50 hover:shadow-yellow-400/5'
                        : club.statusColor === 'gray'
                        ? 'opacity-75 hover:opacity-100'
                        : 'hover:border-primary/50 dark:hover:border-primary/50 hover:shadow-primary/5'
                    }`}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <div className="absolute top-4 left-4 z-10">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shadow-md ${getStatusBadgeClass(club.statusColor)}`}>
                          {club.statusLabel}
                        </span>
                      </div>
                      <img
                        className={`w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ${
                          club.statusColor === 'gray' ? 'grayscale' : ''
                        }`}
                        src={club.image || 'https://via.placeholder.com/400x200'}
                        alt={club.name}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>
                    <div className="flex flex-col flex-1 p-6 gap-4">
                      <div>
                        <h3 className={`text-xl font-bold mb-1 group-hover:text-primary transition-colors ${
                          club.statusColor === 'yellow' ? 'group-hover:text-yellow-400' : ''
                        } ${club.statusColor === 'gray' ? 'text-slate-900 dark:text-white' : 'text-slate-900 dark:text-white'}`}>
                          {club.name}
                        </h3>
                        <div className="flex items-center gap-1 text-slate-500 dark:text-[#9eb7a8] text-sm">
                          <span className="material-symbols-outlined text-[18px]">location_on</span>
                          <span>{club.location}</span>
                        </div>
                      </div>
                      <div className="w-full h-px bg-gray-100 dark:bg-[#29382f]"></div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex flex-col">
                          <span className="text-xs text-slate-400 dark:text-[#9eb7a8] uppercase tracking-wider font-semibold">
                            Valid Until
                          </span>
                          <span className={`font-medium ${
                            club.statusColor === 'yellow'
                              ? 'text-yellow-600 dark:text-yellow-400'
                              : club.statusColor === 'gray'
                              ? 'text-slate-500 dark:text-[#9eb7a8]'
                              : 'text-slate-700 dark:text-white'
                          }`}>
                            {club.validUntil}
                          </span>
                        </div>
                        {club.statusColor === 'yellow' ? (
                          <a
                            className="rounded-full bg-gray-100 dark:bg-[#29382f] hover:bg-yellow-400 text-slate-900 p-2 transition-colors"
                            href="#"
                          >
                            <span className="material-symbols-outlined">autorenew</span>
                          </a>
                        ) : club.statusColor === 'gray' ? (
                          <a
                            className="text-sm font-bold text-primary hover:underline"
                            href="#"
                          >
                            Renew Membership
                          </a>
                        ) : (
                          <a
                            className="rounded-full bg-gray-100 dark:bg-[#29382f] hover:bg-primary dark:hover:bg-primary text-slate-900 p-2 transition-colors"
                            href="#"
                          >
                            <span className="material-symbols-outlined">arrow_forward</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MemberMyClubs;


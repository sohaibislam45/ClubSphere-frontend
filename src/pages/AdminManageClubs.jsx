import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import Swal from 'sweetalert2';

const AdminManageClubs = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const limit = 5;

  // Fetch clubs stats
  const { data: statsData } = useQuery({
    queryKey: ['admin-clubs-stats'],
    queryFn: async () => {
      const response = await api.get('/api/admin/clubs/stats');
      return response.data;
    }
  });

  // Fetch clubs
  const { data, isLoading } = useQuery({
    queryKey: ['admin-clubs', page, search, statusFilter],
    queryFn: async () => {
      const response = await api.get('/api/admin/clubs', {
        params: { page, limit, search, status: statusFilter }
      });
      return response.data;
    }
  });

  // Approve club mutation
  const approveClubMutation = useMutation({
    mutationFn: async (clubId) => {
      await api.put(`/api/admin/clubs/${clubId}/approve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-clubs']);
      queryClient.invalidateQueries(['admin-clubs-stats']);
      Swal.fire({
        icon: 'success',
        title: 'Club Approved',
        text: 'Club has been approved successfully',
        timer: 2000,
        showConfirmButton: false
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.error || 'Failed to approve club'
      });
    }
  });

  // Reject club mutation
  const rejectClubMutation = useMutation({
    mutationFn: async (clubId) => {
      await api.put(`/api/admin/clubs/${clubId}/reject`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-clubs']);
      queryClient.invalidateQueries(['admin-clubs-stats']);
      Swal.fire({
        icon: 'success',
        title: 'Club Rejected',
        text: 'Club has been rejected',
        timer: 2000,
        showConfirmButton: false
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.error || 'Failed to reject club'
      });
    }
  });

  const getUserInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  const clubs = data?.clubs || [];
  const pagination = data?.pagination || { total: 0, totalPages: 1 };
  const stats = statsData || { pending: 0, active: 0, newThisMonth: 0, activeGrowth: 12, newGrowth: 5 };

  const getStatusBadge = (status) => {
    if (status === 'pending') {
      return {
        bg: 'bg-yellow-500/10',
        text: 'text-yellow-500',
        border: 'border-yellow-500/20',
        dot: 'bg-yellow-500',
        label: 'Pending'
      };
    } else if (status === 'active') {
      return {
        bg: 'bg-primary/10',
        text: 'text-primary',
        border: 'border-primary/20',
        dot: 'bg-primary',
        label: 'Active'
      };
    } else {
      return {
        bg: 'bg-red-500/10',
        text: 'text-red-500',
        border: 'border-red-500/20',
        dot: 'bg-red-500',
        label: 'Rejected'
      };
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 flex flex-col justify-between border-r border-surface-highlight bg-background-dark transition-all duration-300">
        <div className="flex flex-col gap-4 p-4">
          {/* Brand */}
          <div className="flex items-center gap-3 px-2">
            <div 
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 shrink-0 border-2 border-primary/20"
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBjuschDidP2UNlYBKT4j1Q75XdF-c6Fs6Ft4n07qksKr1_mieQwsNxnQIZ5XIa08VFLDDHmsnzjKeB2nUshvggwb7mgzzC5h95UnkZclOKPWoOqzg_iiD0zJuDwGvR6_rpPvYzadxz93TcWfNV73IRJ-f1t3O5L0BYP0NwvuOHnA8CezIw_O0YHxs23Pv4V1zdR3OMAVioKtXjqm_HBLQC4wnzUkyk5XDN7ylBIV8s_oFPKFwNw2j_LdkTUNvrWodTzqKVRtetak5L")' }}
            ></div>
            <h1 className="text-white text-lg font-bold leading-normal hidden lg:block tracking-wide">ClubSphere</h1>
          </div>
          {/* Nav Links */}
          <nav className="flex flex-col gap-2 mt-4">
            <Link to="/" className="flex items-center gap-3 px-3 py-3 rounded-full text-gray-400 hover:bg-surface-highlight hover:text-white transition-colors">
              <span className="material-symbols-outlined">home</span>
              <p className="text-sm font-medium leading-normal hidden lg:block">Home</p>
            </Link>
            <Link to="/dashboard/admin" className={`flex items-center gap-3 px-3 py-3 rounded-full transition-colors ${isActive('/dashboard/admin') ? 'bg-primary text-background-dark' : 'text-gray-400 hover:bg-surface-highlight hover:text-white'}`}>
              <span className="material-symbols-outlined">dashboard</span>
              <p className={`text-sm leading-normal hidden lg:block ${isActive('/dashboard/admin') ? 'font-bold' : 'font-medium'}`}>Dashboard</p>
            </Link>
            <Link to="/dashboard/admin/users" className={`flex items-center gap-3 px-3 py-3 rounded-full transition-colors ${isActive('/dashboard/admin/users') ? 'bg-primary text-background-dark' : 'text-gray-400 hover:bg-surface-highlight hover:text-white'}`}>
              <span className="material-symbols-outlined">group</span>
              <p className={`text-sm leading-normal hidden lg:block ${isActive('/dashboard/admin/users') ? 'font-bold' : 'font-medium'}`}>Users</p>
            </Link>
            <Link to="/dashboard/admin/clubs" className={`flex items-center gap-3 px-3 py-3 rounded-full transition-colors ${isActive('/dashboard/admin/clubs') ? 'bg-primary text-background-dark' : 'text-gray-400 hover:bg-surface-highlight hover:text-white'}`}>
              <span className="material-symbols-outlined">diversity_3</span>
              <p className={`text-sm leading-normal hidden lg:block ${isActive('/dashboard/admin/clubs') ? 'font-bold' : 'font-medium'}`}>Clubs</p>
            </Link>
            <Link to="/dashboard/admin/events" className={`flex items-center gap-3 px-3 py-3 rounded-full transition-colors ${isActive('/dashboard/admin/events') ? 'bg-primary text-background-dark' : 'text-gray-400 hover:bg-surface-highlight hover:text-white'}`}>
              <span className="material-symbols-outlined">calendar_today</span>
              <p className={`text-sm leading-normal hidden lg:block ${isActive('/dashboard/admin/events') ? 'font-bold' : 'font-medium'}`}>Events</p>
            </Link>
            <Link to="/dashboard/admin/finances" className={`flex items-center gap-3 px-3 py-3 rounded-full transition-colors ${isActive('/dashboard/admin/finances') ? 'bg-primary text-background-dark' : 'text-gray-400 hover:bg-surface-highlight hover:text-white'}`}>
              <span className="material-symbols-outlined">payments</span>
              <p className={`text-sm leading-normal hidden lg:block ${isActive('/dashboard/admin/finances') ? 'font-bold' : 'font-medium'}`}>Finances</p>
            </Link>
          </nav>
        </div>
        {/* Bottom Settings */}
        <div className="p-4">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-3 py-3 rounded-full text-gray-400 hover:bg-surface-highlight hover:text-white transition-colors w-full"
          >
            <span className="material-symbols-outlined">settings</span>
            <p className="text-sm font-medium leading-normal hidden lg:block">Settings</p>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-background-light dark:bg-background-dark">
        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
          <div className="max-w-[1200px] mx-auto flex flex-col gap-8">
            {/* Page Heading */}
            <div className="flex flex-wrap justify-between items-end gap-4">
              <div className="flex flex-col gap-2">
                <h1 className="text-white text-3xl md:text-4xl font-black leading-tight tracking-tight">Club Management</h1>
                <p className="text-[#9eb7a8] text-base font-normal">Manage club approvals, statuses, and details.</p>
              </div>
              <button className="flex items-center gap-2 bg-primary text-black px-4 py-2.5 rounded-lg font-bold text-sm hover:bg-opacity-90 transition-opacity shadow-[0_0_15px_rgba(54,226,123,0.3)]">
                <span className="material-symbols-outlined text-[20px]">add</span>
                <span>Add Club</span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1 rounded-xl p-5 border border-[#3d5245] bg-[#1a231f]">
                <div className="flex justify-between items-start">
                  <p className="text-[#9eb7a8] text-sm font-medium">Pending Reviews</p>
                  <div className="bg-yellow-500/10 p-1.5 rounded-md text-yellow-500">
                    <span className="material-symbols-outlined text-[20px]">pending_actions</span>
                  </div>
                </div>
                <p className="text-white text-3xl font-bold mt-2">{stats.pending}</p>
                <p className="text-yellow-500 text-xs font-medium">Requires attention</p>
              </div>
              <div className="flex flex-col gap-1 rounded-xl p-5 border border-[#3d5245] bg-[#1a231f]">
                <div className="flex justify-between items-start">
                  <p className="text-[#9eb7a8] text-sm font-medium">Active Clubs</p>
                  <div className="bg-primary/10 p-1.5 rounded-md text-primary">
                    <span className="material-symbols-outlined text-[20px]">check_circle</span>
                  </div>
                </div>
                <p className="text-white text-3xl font-bold mt-2">{stats.active}</p>
                <p className="text-primary text-xs font-medium">+{stats.activeGrowth}% from last month</p>
              </div>
              <div className="flex flex-col gap-1 rounded-xl p-5 border border-[#3d5245] bg-[#1a231f]">
                <div className="flex justify-between items-start">
                  <p className="text-[#9eb7a8] text-sm font-medium">New This Month</p>
                  <div className="bg-blue-500/10 p-1.5 rounded-md text-blue-500">
                    <span className="material-symbols-outlined text-[20px]">trending_up</span>
                  </div>
                </div>
                <p className="text-white text-3xl font-bold mt-2">{stats.newThisMonth}</p>
                <p className="text-primary text-xs font-medium">+{stats.newGrowth}% vs avg</p>
              </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-[#1a231f] border border-[#3d5245] rounded-xl p-4">
              <div className="flex-1 max-w-md">
                <label className="flex w-full items-center rounded-lg bg-[#29382f] border border-transparent focus-within:border-primary/50 transition-colors h-10 px-3 gap-2">
                  <span className="material-symbols-outlined text-[#9eb7a8] text-[20px]">search</span>
                  <input
                    className="bg-transparent border-none text-white text-sm placeholder:text-[#9eb7a8] focus:ring-0 w-full p-0"
                    placeholder="Search by club name or manager email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </label>
              </div>
              <div className="flex gap-3">
                <div className="relative group">
                  <button
                    onClick={() => setStatusFilter(statusFilter === 'all' ? 'pending' : statusFilter === 'pending' ? 'active' : statusFilter === 'active' ? 'rejected' : 'all')}
                    className="flex items-center gap-2 h-10 px-4 rounded-lg bg-[#29382f] border border-transparent text-[#9eb7a8] hover:text-white hover:bg-[#3d5245] transition-colors text-sm font-medium"
                  >
                    <span className="material-symbols-outlined text-[18px]">filter_list</span>
                    <span>Filter Status: {statusFilter === 'all' ? 'All' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}</span>
                  </button>
                </div>
                <button className="flex items-center gap-2 h-10 px-4 rounded-lg bg-[#29382f] border border-transparent text-[#9eb7a8] hover:text-white hover:bg-[#3d5245] transition-colors text-sm font-medium">
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  <span className="hidden sm:inline">Export</span>
                </button>
              </div>
            </div>

            {/* Data Table */}
            <div className="w-full overflow-hidden rounded-xl border border-[#3d5245] bg-[#1a231f]">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#29382f] border-b border-[#3d5245]">
                      <th className="p-4 pl-6 text-xs font-semibold tracking-wide text-[#9eb7a8] uppercase">Club Name</th>
                      <th className="p-4 text-xs font-semibold tracking-wide text-[#9eb7a8] uppercase">Manager</th>
                      <th className="p-4 text-xs font-semibold tracking-wide text-[#9eb7a8] uppercase">Stats</th>
                      <th className="p-4 text-xs font-semibold tracking-wide text-[#9eb7a8] uppercase">Fee</th>
                      <th className="p-4 text-xs font-semibold tracking-wide text-[#9eb7a8] uppercase">Status</th>
                      <th className="p-4 pr-6 text-right text-xs font-semibold tracking-wide text-[#9eb7a8] uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#29382f]">
                    {isLoading ? (
                      <tr>
                        <td colSpan="6" className="p-4 text-center text-[#9eb7a8]">Loading...</td>
                      </tr>
                    ) : clubs.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="p-4 text-center text-[#9eb7a8]">No clubs found</td>
                      </tr>
                    ) : (
                      clubs.map((club) => {
                        const statusBadge = getStatusBadge(club.status);
                        const joinedText = club.joinedDate || 'Recently';

                        return (
                          <tr key={club.id} className={`group hover:bg-[#202b25] transition-colors ${club.status === 'rejected' ? 'opacity-75' : ''}`}>
                            <td className="p-4 pl-6">
                              <div className="flex items-center gap-3">
                                {club.image ? (
                                  <img
                                    src={club.image}
                                    alt={club.name}
                                    className={`size-10 rounded-full bg-cover bg-center flex-shrink-0 bg-gray-700 ${club.status === 'rejected' ? 'grayscale' : ''}`}
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                    }}
                                  />
                                ) : (
                                  <div className="size-10 rounded-full bg-gray-700 flex-shrink-0 flex items-center justify-center text-white font-bold text-xs">
                                    {club.name.charAt(0).toUpperCase()}
                                  </div>
                                )}
                                <div>
                                  <p className="text-white text-sm font-semibold">{club.name}</p>
                                  <p className="text-[#9eb7a8] text-xs">{joinedText}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2 text-sm text-[#d1dcd6]">
                                <span className="material-symbols-outlined text-[16px] text-[#9eb7a8]">mail</span>
                                {club.managerEmail}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex gap-2">
                                <span className="inline-flex items-center gap-1 rounded bg-[#29382f] px-2 py-1 text-xs font-medium text-[#9eb7a8]">
                                  <span className="material-symbols-outlined text-[14px]">group</span> {club.memberCount}
                                </span>
                                <span className="inline-flex items-center gap-1 rounded bg-[#29382f] px-2 py-1 text-xs font-medium text-[#9eb7a8]">
                                  <span className="material-symbols-outlined text-[14px]">event</span> {club.eventCount}
                                </span>
                              </div>
                            </td>
                            <td className="p-4 text-sm text-white font-medium">{club.fee}</td>
                            <td className="p-4">
                              <span className={`inline-flex items-center gap-1.5 rounded-full ${statusBadge.bg} px-3 py-1 text-xs font-bold ${statusBadge.text} border ${statusBadge.border}`}>
                                <span className={`size-1.5 rounded-full ${statusBadge.dot}`}></span> {statusBadge.label}
                              </span>
                            </td>
                            <td className="p-4 pr-6 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {club.status === 'pending' ? (
                                  <>
                                    <button
                                      onClick={() => {
                                        Swal.fire({
                                          title: 'Reject Club?',
                                          text: `Are you sure you want to reject ${club.name}?`,
                                          icon: 'warning',
                                          showCancelButton: true,
                                          confirmButtonColor: '#ef4444',
                                          cancelButtonColor: '#29382f',
                                          confirmButtonText: 'Yes, reject it'
                                        }).then((result) => {
                                          if (result.isConfirmed) {
                                            rejectClubMutation.mutate(club.id);
                                          }
                                        });
                                      }}
                                      className="flex size-8 items-center justify-center rounded hover:bg-red-500/20 text-red-500 transition-colors"
                                      title="Reject"
                                    >
                                      <span className="material-symbols-outlined text-[20px]">close</span>
                                    </button>
                                    <button
                                      onClick={() => {
                                        Swal.fire({
                                          title: 'Approve Club?',
                                          text: `Are you sure you want to approve ${club.name}?`,
                                          icon: 'question',
                                          showCancelButton: true,
                                          confirmButtonColor: '#38e07b',
                                          cancelButtonColor: '#29382f',
                                          confirmButtonText: 'Yes, approve it'
                                        }).then((result) => {
                                          if (result.isConfirmed) {
                                            approveClubMutation.mutate(club.id);
                                          }
                                        });
                                      }}
                                      className="flex size-8 items-center justify-center rounded hover:bg-primary/20 text-primary transition-colors"
                                      title="Approve"
                                    >
                                      <span className="material-symbols-outlined text-[20px]">check</span>
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button className="flex size-8 items-center justify-center rounded hover:bg-[#29382f] text-[#9eb7a8] hover:text-white transition-colors" title="View Details">
                                      <span className="material-symbols-outlined text-[20px]">visibility</span>
                                    </button>
                                    <button className="flex size-8 items-center justify-center rounded hover:bg-[#29382f] text-[#9eb7a8] hover:text-white transition-colors" title="Edit">
                                      <span className="material-symbols-outlined text-[20px]">edit</span>
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between border-t border-[#3d5245] px-6 py-4">
                <p className="text-sm text-[#9eb7a8]">Showing <span className="text-white font-semibold">{((page - 1) * limit) + 1}-{Math.min(page * limit, pagination.total)}</span> of <span className="text-white font-semibold">{pagination.total}</span> clubs</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#3d5245] bg-[#1a231f] text-white disabled:opacity-50 hover:bg-[#29382f] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                  </button>
                  {[...Array(Math.min(3, pagination.totalPages))].map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`flex h-8 w-8 items-center justify-center rounded-lg border text-sm ${
                          page === pageNum
                            ? 'border-primary bg-primary text-black font-bold'
                            : 'border-[#3d5245] bg-[#1a231f] text-white hover:bg-[#29382f] transition-colors'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                    disabled={page >= pagination.totalPages}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#3d5245] bg-[#1a231f] text-white hover:bg-[#29382f] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminManageClubs;


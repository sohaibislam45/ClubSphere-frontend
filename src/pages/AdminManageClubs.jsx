import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import Swal from '../lib/sweetalertConfig';
import Loader from '../components/ui/Loader';

const AdminManageClubs = () => {
  const { user, logout } = useAuth();

  useEffect(() => {
    document.title = 'Manage Clubs - Admin - ClubSphere';
  }, []);
  const location = useLocation();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddClubModalOpen, setIsAddClubModalOpen] = useState(false);
  const [isViewClubModalOpen, setIsViewClubModalOpen] = useState(false);
  const [isEditClubModalOpen, setIsEditClubModalOpen] = useState(false);
  const [selectedClubId, setSelectedClubId] = useState(null);
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

  // Create club mutation
  const createClubMutation = useMutation({
    mutationFn: async (clubData) => {
      const response = await api.post('/api/admin/clubs', clubData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-clubs']);
      queryClient.invalidateQueries(['admin-clubs-stats']);
      queryClient.invalidateQueries(['featured-clubs']); // Invalidate featured clubs so home page updates
      setIsAddClubModalOpen(false);
      Swal.fire({
        icon: 'success',
        title: 'Club Created',
        text: 'Club has been created successfully',
        timer: 2000,
        showConfirmButton: false
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.error || 'Failed to create club'
      });
    }
  });

  // Update club mutation
  const updateClubMutation = useMutation({
    mutationFn: async ({ clubId, clubData }) => {
      const response = await api.put(`/api/admin/clubs/${clubId}`, clubData);
      return response.data;
    },
    onSuccess: (data, variables) => {
      const { clubId } = variables;
      queryClient.invalidateQueries(['admin-clubs']);
      queryClient.invalidateQueries(['admin-clubs-stats']);
      queryClient.invalidateQueries(['featured-clubs']);
      queryClient.invalidateQueries(['admin-club', clubId]);
      queryClient.invalidateQueries(['club', clubId]); // Invalidate club details page cache
      queryClient.invalidateQueries(['clubs']); // Invalidate clubs list cache
      setIsEditClubModalOpen(false);
      setSelectedClubId(null);
      Swal.fire({
        icon: 'success',
        title: 'Club Updated',
        text: 'Club has been updated successfully',
        timer: 2000,
        showConfirmButton: false
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.error || 'Failed to update club'
      });
    }
  });

  // Toggle club status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: async ({ clubId, currentStatus }) => {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      const response = await api.put(`/api/admin/clubs/${clubId}`, { status: newStatus });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['admin-clubs']);
      queryClient.invalidateQueries(['admin-clubs-stats']);
      queryClient.invalidateQueries(['featured-clubs']);
      const newStatus = variables.currentStatus === 'active' ? 'inactive' : 'active';
      Swal.fire({
        icon: 'success',
        title: 'Status Updated',
        text: `Club status has been changed to ${newStatus}`,
        timer: 2000,
        showConfirmButton: false
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.error || 'Failed to update club status'
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
    } else if (status === 'inactive') {
      return {
        bg: 'bg-gray-500/10',
        text: 'text-gray-400',
        border: 'border-gray-500/20',
        dot: 'bg-gray-400',
        label: 'Inactive'
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
              style={{ 
                backgroundImage: user?.photoURL ? `url("${user.photoURL}")` : 'none',
                backgroundColor: '#1c2620'
              }}
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
            <Link to="/dashboard/admin/categories" className={`flex items-center gap-3 px-3 py-3 rounded-full transition-colors ${isActive('/dashboard/admin/categories') ? 'bg-primary text-background-dark' : 'text-gray-400 hover:bg-surface-highlight hover:text-white'}`}>
              <span className="material-symbols-outlined">category</span>
              <p className={`text-sm leading-normal hidden lg:block ${isActive('/dashboard/admin/categories') ? 'font-bold' : 'font-medium'}`}>Categories</p>
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
              <button 
                onClick={() => setIsAddClubModalOpen(true)}
                className="flex items-center gap-2 bg-primary text-black px-4 py-2.5 rounded-lg font-bold text-sm hover:bg-opacity-90 transition-opacity shadow-[0_0_15px_rgba(54,226,123,0.3)]"
              >
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
                        <td colSpan="6" className="p-4">
                          <div className="flex items-center justify-center">
                            <Loader />
                          </div>
                        </td>
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
                              {(club.status === 'active' || club.status === 'inactive') ? (
                                <button
                                  onClick={() => {
                                    Swal.fire({
                                      title: `Change Status to ${club.status === 'active' ? 'Inactive' : 'Active'}?`,
                                      text: `Are you sure you want to ${club.status === 'active' ? 'deactivate' : 'activate'} ${club.name}?`,
                                      icon: 'question',
                                      showCancelButton: true,
                                      confirmButtonText: `Yes, make it ${club.status === 'active' ? 'inactive' : 'active'}`,
                                      cancelButtonText: 'Cancel'
                                    }).then((result) => {
                                      if (result.isConfirmed) {
                                        toggleStatusMutation.mutate({ 
                                          clubId: club.id, 
                                          currentStatus: club.status 
                                        });
                                      }
                                    });
                                  }}
                                  className={`inline-flex items-center gap-1.5 rounded-full ${statusBadge.bg} px-3 py-1 text-xs font-bold ${statusBadge.text} border ${statusBadge.border} hover:opacity-80 transition-opacity cursor-pointer`}
                                  title={`Click to change status to ${club.status === 'active' ? 'inactive' : 'active'}`}
                                >
                                  <span className={`size-1.5 rounded-full ${statusBadge.dot}`}></span> {statusBadge.label}
                                </button>
                              ) : (
                                <span className={`inline-flex items-center gap-1.5 rounded-full ${statusBadge.bg} px-3 py-1 text-xs font-bold ${statusBadge.text} border ${statusBadge.border}`}>
                                  <span className={`size-1.5 rounded-full ${statusBadge.dot}`}></span> {statusBadge.label}
                                </span>
                              )}
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
                                    <button 
                                      onClick={() => {
                                        setSelectedClubId(club.id);
                                        setIsViewClubModalOpen(true);
                                      }}
                                      className="flex size-8 items-center justify-center rounded hover:bg-[#29382f] text-[#9eb7a8] hover:text-white transition-colors" 
                                      title="View Details"
                                    >
                                      <span className="material-symbols-outlined text-[20px]">visibility</span>
                                    </button>
                                    <button 
                                      onClick={() => {
                                        setSelectedClubId(club.id);
                                        setIsEditClubModalOpen(true);
                                      }}
                                      className="flex size-8 items-center justify-center rounded hover:bg-[#29382f] text-[#9eb7a8] hover:text-white transition-colors" 
                                      title="Edit"
                                    >
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

      {/* Add Club Modal */}
      {isAddClubModalOpen && (
        <AddClubModal
          isOpen={isAddClubModalOpen}
          onClose={() => setIsAddClubModalOpen(false)}
          onSubmit={createClubMutation.mutate}
          isLoading={createClubMutation.isLoading}
        />
      )}

      {isViewClubModalOpen && selectedClubId && (
        <ViewClubDetailsModal
          isOpen={isViewClubModalOpen}
          onClose={() => {
            setIsViewClubModalOpen(false);
            setSelectedClubId(null);
          }}
          clubId={selectedClubId}
        />
      )}

      {isEditClubModalOpen && selectedClubId && (
        <EditClubModal
          isOpen={isEditClubModalOpen}
          onClose={() => {
            setIsEditClubModalOpen(false);
            setSelectedClubId(null);
          }}
          clubId={selectedClubId}
          onSubmit={(clubData) => updateClubMutation.mutate({ clubId: selectedClubId, clubData })}
          isLoading={updateClubMutation.isLoading}
        />
      )}
    </div>
  );
};

// Add Club Modal Component
const AddClubModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    location: '',
    fee: '',
    managerEmail: ''
  });
  const [bannerImage, setBannerImage] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const response = await api.get('/api/admin/categories');
      return response.data;
    }
  });

  const categories = categoriesData?.categories || [];

  // Upload image to ImgBB
  const uploadImageToImgBB = async (file) => {
    const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
    if (!apiKey) {
      console.warn('ImgBB API key is not configured. Skipping image upload.');
      return null;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || 'Failed to upload image');
      }

      const data = await response.json();
      if (data.success && data.data && data.data.url) {
        return data.data.url;
      } else {
        throw new Error('Failed to get image URL from ImgBB');
      }
    } catch (error) {
      console.error('Image upload failed:', error);
      throw error;
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid File',
          text: 'Please select an image file.',
        });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          icon: 'error',
          title: 'File Too Large',
          text: 'Please select an image smaller than 5MB.',
        });
        return;
      }

      setBannerImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.description || !formData.category || !formData.location || !formData.managerEmail) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Fields',
        text: 'Please fill in all required fields.',
      });
      return;
    }

    let imageURL = null;
    
    // Upload image if provided
    if (bannerImage) {
      setIsUploadingImage(true);
      try {
        imageURL = await uploadImageToImgBB(bannerImage);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Upload Failed',
          text: 'Failed to upload banner image. Please try again.',
        });
        setIsUploadingImage(false);
        return;
      }
      setIsUploadingImage(false);
    }

    // Submit form data
    onSubmit({
      name: formData.name,
      description: formData.description,
      category: formData.category,
      location: formData.location,
      fee: parseFloat(formData.fee) || 0,
      managerEmail: formData.managerEmail,
      image: imageURL
    });

    // Reset form
    setFormData({
      name: '',
      description: '',
      category: '',
      location: '',
      fee: '',
      managerEmail: ''
    });
    setBannerImage(null);
    setBannerPreview(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-[#1a231f] border border-[#3d5245] rounded-xl w-full max-w-[800px] max-h-[90vh] overflow-y-auto">
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-white text-3xl md:text-4xl font-black leading-tight tracking-tight">Add New Club</h1>
              <p className="text-[#9eb7a8] text-base font-normal">Create a new club profile and assign a manager to get started.</p>
            </div>
            <button
              onClick={onClose}
              className="text-[#9eb7a8] hover:text-white transition-colors p-2 rounded-lg hover:bg-[#29382f]"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Banner Image */}
            <div className="flex flex-col gap-2">
              <label className="text-[#9eb7a8] text-sm font-medium flex gap-1">
                Banner Image <span className="text-red-400">*</span>
              </label>
              <div className="group border-2 border-dashed border-[#3d5245] rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-[#202b25] hover:border-primary/50 transition-all cursor-pointer relative bg-[#29382f]/30">
                <input
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  type="file"
                  onChange={handleImageChange}
                />
                {bannerPreview ? (
                  <img src={bannerPreview} alt="Banner preview" className="w-full h-48 object-cover rounded-lg mb-3" />
                ) : (
                  <>
                    <div className="bg-[#29382f] p-3 rounded-full mb-3 text-[#9eb7a8] group-hover:text-white transition-colors shadow-sm">
                      <span className="material-symbols-outlined text-[24px]">cloud_upload</span>
                    </div>
                    <p className="text-white font-medium text-sm">Click to upload or drag and drop</p>
                    <p className="text-[#9eb7a8] text-xs mt-1">SVG, PNG, JPG or GIF (max. 1920x400px)</p>
                  </>
                )}
              </div>
            </div>

            {/* Club Name */}
            <div className="flex flex-col gap-2">
              <label className="text-[#9eb7a8] text-sm font-medium flex gap-1" htmlFor="clubName">
                Club Name <span className="text-red-400">*</span>
              </label>
              <input
                className="bg-[#29382f] border border-transparent focus:border-primary/50 focus:ring-0 rounded-lg text-white placeholder:text-[#5c7266] h-12 px-4 w-full transition-colors"
                id="clubName"
                name="name"
                placeholder="e.g. Downtown Runners"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <label className="text-[#9eb7a8] text-sm font-medium flex gap-1" htmlFor="description">
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                className="bg-[#29382f] border border-transparent focus:border-primary/50 focus:ring-0 rounded-lg text-white placeholder:text-[#5c7266] p-4 w-full transition-colors resize-none"
                id="description"
                name="description"
                placeholder="Describe the club's mission, activities, and who should join..."
                rows="4"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Category and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[#9eb7a8] text-sm font-medium flex gap-1" htmlFor="category">
                  Category <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <select
                    className="bg-[#29382f] border border-transparent focus:border-primary/50 focus:ring-0 rounded-lg text-white h-12 px-4 w-full transition-colors appearance-none cursor-pointer"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option disabled value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat._id || cat.id} value={cat.name}>
                        {cat.displayName}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#9eb7a8] pointer-events-none">expand_more</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[#9eb7a8] text-sm font-medium flex gap-1" htmlFor="location">
                  Location <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#5c7266]">location_on</span>
                  <input
                    className="bg-[#29382f] border border-transparent focus:border-primary/50 focus:ring-0 rounded-lg text-white placeholder:text-[#5c7266] h-12 pl-12 pr-4 w-full transition-colors"
                    id="location"
                    name="location"
                    placeholder="e.g. New York, NY"
                    type="text"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Fee and Manager Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[#9eb7a8] text-sm font-medium flex gap-1" htmlFor="fee">
                  Membership Fee (Monthly)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5c7266] font-bold">৳</span>
                  <input
                    className="bg-[#29382f] border border-transparent focus:border-primary/50 focus:ring-0 rounded-lg text-white placeholder:text-[#5c7266] h-12 pl-10 pr-4 w-full transition-colors"
                    id="fee"
                    name="fee"
                    min="0"
                    placeholder="0"
                    step="0.01"
                    type="number"
                    value={formData.fee}
                    onChange={handleInputChange}
                  />
                </div>
                <p className="text-xs text-[#5c7266] mt-1">Enter 0 for free clubs.</p>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[#9eb7a8] text-sm font-medium flex gap-1" htmlFor="managerEmail">
                  Manager Email <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#5c7266]">person</span>
                  <input
                    className="bg-[#29382f] border border-transparent focus:border-primary/50 focus:ring-0 rounded-lg text-white placeholder:text-[#5c7266] h-12 pl-12 pr-4 w-full transition-colors"
                    id="managerEmail"
                    name="managerEmail"
                    placeholder="user@example.com"
                    type="email"
                    value={formData.managerEmail}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <p className="text-xs text-[#5c7266] mt-1">Must be an existing registered user.</p>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-4 mt-6 pt-6 border-t border-[#3d5245]">
              <button
                type="button"
                onClick={onClose}
                className="text-[#9eb7a8] font-semibold hover:text-white px-6 py-2.5 transition-colors rounded-lg hover:bg-[#29382f]"
                disabled={isLoading || isUploadingImage}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-primary text-black px-8 py-2.5 rounded-lg font-bold hover:bg-opacity-90 transition-opacity shadow-[0_0_15px_rgba(54,226,123,0.3)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || isUploadingImage}
              >
                {isLoading || isUploadingImage ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    <span>{isUploadingImage ? 'Uploading...' : 'Creating...'}</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]">add_circle</span>
                    <span>Create Club</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// View Club Details Modal Component
const ViewClubDetailsModal = ({ isOpen, onClose, clubId }) => {
  const { data: club, isLoading } = useQuery({
    queryKey: ['admin-club', clubId],
    queryFn: async () => {
      const response = await api.get(`/api/admin/clubs/${clubId}`);
      return response.data;
    },
    enabled: !!clubId && isOpen
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#1a231f] border border-[#3d5245] rounded-xl w-full max-w-2xl my-8 max-h-[90vh] overflow-y-auto">
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white text-2xl font-bold">Club Details</h2>
            <button
              onClick={onClose}
              className="text-[#9eb7a8] hover:text-white transition-colors p-2 rounded-lg hover:bg-[#29382f]"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader />
            </div>
          ) : club ? (
            <div className="flex flex-col gap-6">
              {/* Club Image */}
              {club.image && (
                <div className="w-full h-48 rounded-xl overflow-hidden">
                  <img src={club.image} alt={club.name} className="w-full h-full object-cover" />
                </div>
              )}

              {/* Club Info */}
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-[#9eb7a8] text-sm font-medium">Club Name</label>
                  <p className="text-white text-lg font-bold mt-1">{club.name}</p>
                </div>

                {club.description && (
                  <div>
                    <label className="text-[#9eb7a8] text-sm font-medium">Description</label>
                    <p className="text-white text-sm mt-1 whitespace-pre-wrap">{club.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {club.category && (
                    <div>
                      <label className="text-[#9eb7a8] text-sm font-medium">Category</label>
                      <p className="text-white text-sm mt-1 capitalize">{club.category}</p>
                    </div>
                  )}
                  {club.location && (
                    <div>
                      <label className="text-[#9eb7a8] text-sm font-medium">Location</label>
                      <p className="text-white text-sm mt-1">{club.location}</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[#9eb7a8] text-sm font-medium">Membership Fee</label>
                    <p className="text-white text-sm mt-1">{club.fee === 0 || club.fee === 'Free' ? 'Free' : `৳${club.fee}`}</p>
                  </div>
                  <div>
                    <label className="text-[#9eb7a8] text-sm font-medium">Status</label>
                    <p className="text-white text-sm mt-1 capitalize">{club.status}</p>
                  </div>
                </div>

                <div>
                  <label className="text-[#9eb7a8] text-sm font-medium">Manager Email</label>
                  <p className="text-white text-sm mt-1">{club.managerEmail}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[#9eb7a8] text-sm font-medium">Members</label>
                    <p className="text-white text-sm mt-1">{club.memberCount || 0}</p>
                  </div>
                  <div>
                    <label className="text-[#9eb7a8] text-sm font-medium">Events</label>
                    <p className="text-white text-sm mt-1">{club.eventCount || 0}</p>
                  </div>
                </div>

                {club.joinedDate && (
                  <div>
                    <label className="text-[#9eb7a8] text-sm font-medium">Created Date</label>
                    <p className="text-white text-sm mt-1">{club.joinedDate}</p>
                  </div>
                )}
              </div>

              {/* Close Button */}
              <div className="flex justify-end pt-4 border-t border-[#3d5245]">
                <button
                  onClick={onClose}
                  className="text-[#9eb7a8] font-semibold hover:text-white px-6 py-2.5 transition-colors rounded-lg hover:bg-[#29382f]"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-[#9eb7a8]">Club not found</div>
          )}
        </div>
      </div>
    </div>
  );
};

// Edit Club Modal Component
const EditClubModal = ({ isOpen, onClose, clubId, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    location: '',
    fee: '',
    managerEmail: ''
  });
  const [bannerImage, setBannerImage] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const response = await api.get('/api/admin/categories');
      return response.data;
    }
  });

  const categories = categoriesData?.categories || [];

  // Fetch club data
  const { data: club, isLoading: isLoadingClub } = useQuery({
    queryKey: ['admin-club', clubId],
    queryFn: async () => {
      const response = await api.get(`/api/admin/clubs/${clubId}`);
      return response.data;
    },
    enabled: !!clubId && isOpen,
    refetchOnMount: true,
    staleTime: 0
  });

  // Update form data when club data is loaded
  useEffect(() => {
    if (club && isOpen && !isLoadingClub) {
      setFormData({
        name: club.name || '',
        description: club.description || '',
        category: club.category || '',
        location: club.location || '',
        fee: club.fee === 0 || club.fee === 'Free' || !club.fee ? '' : (typeof club.fee === 'number' ? club.fee.toString() : String(club.fee || '')),
        managerEmail: club.managerEmail || ''
      });
      if (club.image) {
        setBannerPreview(club.image);
      } else {
        setBannerPreview(null);
      }
      setBannerImage(null);
    }
  }, [club, isOpen, isLoadingClub]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: '',
        description: '',
        category: '',
        location: '',
        fee: '',
        managerEmail: ''
      });
      setBannerImage(null);
      setBannerPreview(null);
    }
  }, [isOpen]);

  // Upload image to ImgBB
  const uploadImageToImgBB = async (file) => {
    const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
    if (!apiKey) {
      console.warn('ImgBB API key is not configured. Skipping image upload.');
      return null;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || 'Failed to upload image');
      }

      const data = await response.json();
      if (data.success && data.data && data.data.url) {
        return data.data.url;
      } else {
        throw new Error('Failed to get image URL from ImgBB');
      }
    } catch (error) {
      console.error('Image upload failed:', error);
      throw error;
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid File',
          text: 'Please select an image file.',
        });
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          icon: 'error',
          title: 'File Too Large',
          text: 'Please select an image smaller than 5MB.',
        });
        return;
      }

      setBannerImage(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.category || !formData.location || !formData.managerEmail) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Fields',
        text: 'Please fill in all required fields.',
      });
      return;
    }

    let imageURL = club?.image || null;
    
    if (bannerImage) {
      setIsUploadingImage(true);
      try {
        imageURL = await uploadImageToImgBB(bannerImage);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Upload Failed',
          text: 'Failed to upload banner image. Please try again.',
        });
        setIsUploadingImage(false);
        return;
      }
      setIsUploadingImage(false);
    }

    onSubmit({
      name: formData.name,
      description: formData.description,
      category: formData.category,
      location: formData.location,
      fee: parseFloat(formData.fee) || 0,
      managerEmail: formData.managerEmail,
      image: imageURL
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#1a231f] border border-[#3d5245] rounded-xl w-full max-w-[800px] my-8 max-h-[90vh] overflow-y-auto">
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-white text-3xl md:text-4xl font-black leading-tight tracking-tight">Edit Club</h1>
              <p className="text-[#9eb7a8] text-base font-normal">Update club information and details.</p>
            </div>
            <button
              onClick={onClose}
              className="text-[#9eb7a8] hover:text-white transition-colors p-2 rounded-lg hover:bg-[#29382f]"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>
          </div>

          {isLoadingClub ? (
            <div className="flex items-center justify-center py-12">
              <Loader />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Banner Image */}
              <div className="flex flex-col gap-2">
                <label className="text-[#9eb7a8] text-sm font-medium flex gap-1">
                  Banner Image
                </label>
                <div className="group border-2 border-dashed border-[#3d5245] rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-[#202b25] hover:border-primary/50 transition-all cursor-pointer relative bg-[#29382f]/30">
                  <input
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    type="file"
                    onChange={handleImageChange}
                  />
                  {bannerPreview ? (
                    <img src={bannerPreview} alt="Banner preview" className="w-full h-48 object-cover rounded-lg mb-3" />
                  ) : (
                    <>
                      <div className="bg-[#29382f] p-3 rounded-full mb-3 text-[#9eb7a8] group-hover:text-white transition-colors shadow-sm">
                        <span className="material-symbols-outlined text-[24px]">cloud_upload</span>
                      </div>
                      <p className="text-white font-medium text-sm">Click to upload or drag and drop</p>
                      <p className="text-[#9eb7a8] text-xs mt-1">SVG, PNG, JPG or GIF (max. 1920x400px)</p>
                    </>
                  )}
                </div>
              </div>

              {/* Club Name */}
              <div className="flex flex-col gap-2">
                <label className="text-[#9eb7a8] text-sm font-medium flex gap-1" htmlFor="editClubName">
                  Club Name <span className="text-red-400">*</span>
                </label>
                <input
                  className="bg-[#29382f] border border-transparent focus:border-primary/50 focus:ring-0 rounded-lg text-white placeholder:text-[#5c7266] h-12 px-4 w-full transition-colors"
                  id="editClubName"
                  name="name"
                  placeholder="e.g. Downtown Runners"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-2">
                <label className="text-[#9eb7a8] text-sm font-medium flex gap-1" htmlFor="editDescription">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  className="bg-[#29382f] border border-transparent focus:border-primary/50 focus:ring-0 rounded-lg text-white placeholder:text-[#5c7266] p-4 w-full transition-colors resize-none"
                  id="editDescription"
                  name="description"
                  placeholder="Describe the club's mission, activities, and who should join..."
                  rows="4"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Category and Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[#9eb7a8] text-sm font-medium flex gap-1" htmlFor="editCategory">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      className="bg-[#29382f] border border-transparent focus:border-primary/50 focus:ring-0 rounded-lg text-white h-12 px-4 w-full transition-colors appearance-none cursor-pointer"
                      id="editCategory"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      >
                        <option disabled value="">Select a category</option>
                        {categories.map((cat) => (
                          <option key={cat._id || cat.id} value={cat.name}>
                            {cat.displayName}
                          </option>
                        ))}
                      </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#9eb7a8] pointer-events-none">expand_more</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[#9eb7a8] text-sm font-medium flex gap-1" htmlFor="editLocation">
                    Location <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#5c7266]">location_on</span>
                    <input
                      className="bg-[#29382f] border border-transparent focus:border-primary/50 focus:ring-0 rounded-lg text-white placeholder:text-[#5c7266] h-12 pl-12 pr-4 w-full transition-colors"
                      id="editLocation"
                      name="location"
                      placeholder="e.g. New York, NY"
                      type="text"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Fee and Manager Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[#9eb7a8] text-sm font-medium flex gap-1" htmlFor="editFee">
                    Membership Fee (Monthly)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5c7266] font-bold">৳</span>
                    <input
                      className="bg-[#29382f] border border-transparent focus:border-primary/50 focus:ring-0 rounded-lg text-white placeholder:text-[#5c7266] h-12 pl-10 pr-4 w-full transition-colors"
                      id="editFee"
                      name="fee"
                      min="0"
                      placeholder="0"
                      step="0.01"
                      type="number"
                      value={formData.fee}
                      onChange={handleInputChange}
                    />
                  </div>
                  <p className="text-xs text-[#5c7266] mt-1">Enter 0 for free clubs.</p>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[#9eb7a8] text-sm font-medium flex gap-1" htmlFor="editManagerEmail">
                    Manager Email <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#5c7266]">person</span>
                    <input
                      className="bg-[#29382f] border border-transparent focus:border-primary/50 focus:ring-0 rounded-lg text-white placeholder:text-[#5c7266] h-12 pl-12 pr-4 w-full transition-colors"
                      id="editManagerEmail"
                      name="managerEmail"
                      placeholder="user@example.com"
                      type="email"
                      value={formData.managerEmail}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <p className="text-xs text-[#5c7266] mt-1">Must be an existing registered user.</p>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-4 mt-6 pt-6 border-t border-[#3d5245]">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-[#9eb7a8] font-semibold hover:text-white px-6 py-2.5 transition-colors rounded-lg hover:bg-[#29382f]"
                  disabled={isLoading || isUploadingImage}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary text-black px-8 py-2.5 rounded-lg font-bold hover:bg-opacity-90 transition-opacity shadow-[0_0_15px_rgba(54,226,123,0.3)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading || isUploadingImage}
                >
                  {isLoading || isUploadingImage ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      <span>{isUploadingImage ? 'Uploading...' : 'Updating...'}</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[20px]">save</span>
                      <span>Update Club</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminManageClubs;


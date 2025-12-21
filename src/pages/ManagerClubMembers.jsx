import { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import ManagerSidebar from '../components/layout/ManagerSidebar';
import Loader from '../components/ui/Loader';

const ManagerClubMembers = () => {
  const { user, logout } = useAuth();
  const { clubId: clubIdFromParams } = useParams();
  const navigate = useNavigate();
  const [selectedClubId, setSelectedClubId] = useState(clubIdFromParams || '');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Members');
  const [actionMenuOpen, setActionMenuOpen] = useState(null);
  const actionMenuRef = useRef(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    document.title = 'Club Members - Club Manager - ClubSphere';
  }, []);
  const [page, setPage] = useState(1);
  const limit = 10;

  // Fetch manager's clubs for selector
  const { data: clubsData } = useQuery({
    queryKey: ['managerClubs'],
    queryFn: async () => {
      const response = await api.get('/api/manager/clubs');
      return response.data;
    }
  });

  const clubs = clubsData?.clubs || [];

  // Update selectedClubId when clubIdFromParams changes
  useEffect(() => {
    if (clubIdFromParams && clubIdFromParams !== selectedClubId) {
      setSelectedClubId(clubIdFromParams);
    }
  }, [clubIdFromParams]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to first page when search changes
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // Close action menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target)) {
        setActionMenuOpen(null);
      }
    };

    if (actionMenuOpen !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [actionMenuOpen]);

  const handleClubChange = (newClubId) => {
    setSelectedClubId(newClubId);
    setPage(1);
    if (newClubId) {
      navigate(`/dashboard/club-manager/clubs/${newClubId}/members`);
    } else {
      navigate('/dashboard/club-manager/members');
    }
  };

  // Fetch club members
  const { data: membersData, isLoading, error } = useQuery({
    queryKey: ['clubMembers', selectedClubId, debouncedSearch, statusFilter, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (debouncedSearch) params.append('search', debouncedSearch);
      if (statusFilter && statusFilter !== 'All Members') {
        // Map frontend filter names to backend status values
        const statusMap = {
          'Active': 'active',
          'Expired': 'expired',
          'Pending': 'pending'
        };
        params.append('status', statusMap[statusFilter] || statusFilter.toLowerCase());
      }
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      const response = await api.get(`/api/manager/clubs/${selectedClubId}/members?${params.toString()}`);
      return response.data;
    },
    enabled: !!selectedClubId
  });

  const members = membersData?.members || [];
  const stats = membersData?.stats || { totalMembers: 0, activeMembers: 0, pendingRenewals: 0 };
  const pagination = membersData?.pagination || { page: 1, totalPages: 1, total: 0 };

  const statusFilters = ['All Members', 'Active', 'Expired', 'Pending'];

  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase() || 'active';
    if (statusLower === 'active') {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary border border-primary/20">
          <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
          Active
        </span>
      );
    } else if (statusLower === 'expired') {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-500 border border-red-500/20">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
          Expired
        </span>
      );
    } else if (statusLower === 'pending') {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/10 px-2.5 py-1 text-xs font-medium text-orange-500 border border-orange-500/20">
          <span className="h-1.5 w-1.5 rounded-full bg-orange-500"></span>
          Pending
        </span>
      );
    }
    return null;
  };

  const handleExportCSV = () => {
    if (!selectedClubId || !members.length) {
      alert('No members to export. Please select a club with members.');
      return;
    }

    // Create CSV content
    const headers = ['Name', 'Email', 'Status', 'Join Date', 'Role', 'Member ID'];
    const rows = members.map(member => [
      member.name || '',
      member.email || '',
      member.status || 'active',
      member.joinDate || '',
      member.role || 'member',
      member.memberId || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `club-members-${selectedClubId}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar */}
      <ManagerSidebar />

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto bg-background-light dark:bg-background-dark">
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
        <div className="flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8 min-h-full">
          <div className="flex flex-col w-full max-w-[1024px] gap-6">
            {/* Page Heading & Actions */}
            <div className="flex flex-wrap justify-between gap-4 items-end">
              <div className="flex flex-col gap-1">
                <h2 className="text-white text-3xl font-bold leading-tight tracking-tight">Membership Roster</h2>
                <p className="text-text-secondary text-sm font-normal">Manage and view all current club members</p>
              </div>
              <button
                onClick={handleExportCSV}
                className="flex items-center justify-center gap-2 rounded-lg h-9 px-4 bg-surface-highlight border border-border-dark text-white text-sm font-medium hover:bg-surface-highlight/80 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                <span>Export CSV</span>
              </button>
            </div>

            {/* Club Selector */}
            {!selectedClubId && (
              <div className="flex flex-col gap-4">
                <label className="text-white text-sm font-medium">Select a Club</label>
                <select
                  className="w-full max-w-md rounded-lg border border-border-dark bg-surface-dark text-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={selectedClubId}
                  onChange={(e) => handleClubChange(e.target.value)}
                >
                  <option value="">Select a club...</option>
                  {clubs.map((club) => (
                    <option key={club.id} value={club.id}>
                      {club.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Club Selector (when club is selected, show it as a dropdown to change) */}
            {selectedClubId && (
              <div className="flex flex-col gap-4">
                <label className="text-white text-sm font-medium">Selected Club</label>
                <select
                  className="w-full max-w-md rounded-lg border border-border-dark bg-surface-dark text-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={selectedClubId}
                  onChange={(e) => handleClubChange(e.target.value)}
                >
                  <option value="">Select a different club...</option>
                  {clubs.map((club) => (
                    <option key={club.id} value={club.id}>
                      {club.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1 rounded-xl p-5 bg-surface-dark border border-border-dark shadow-sm">
                <div className="flex justify-between items-start">
                  <p className="text-text-secondary text-sm font-medium">Total Members</p>
                  <span className="material-symbols-outlined text-primary">groups</span>
                </div>
                <p className="text-white text-2xl font-bold mt-2">{stats.totalMembers || 0}</p>
                <p className="text-primary text-xs font-medium bg-primary/10 w-fit px-2 py-0.5 rounded flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">trending_up</span> 5%
                </p>
              </div>
              <div className="flex flex-col gap-1 rounded-xl p-5 bg-surface-dark border border-border-dark shadow-sm">
                <div className="flex justify-between items-start">
                  <p className="text-text-secondary text-sm font-medium">Active Members</p>
                  <span className="material-symbols-outlined text-primary">verified_user</span>
                </div>
                <p className="text-white text-2xl font-bold mt-2">{stats.activeMembers || 0}</p>
                <p className="text-primary text-xs font-medium bg-primary/10 w-fit px-2 py-0.5 rounded flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">trending_up</span> 2%
                </p>
              </div>
              <div className="flex flex-col gap-1 rounded-xl p-5 bg-surface-dark border border-border-dark shadow-sm">
                <div className="flex justify-between items-start">
                  <p className="text-text-secondary text-sm font-medium">Pending Renewals</p>
                  <span className="material-symbols-outlined text-[#fa5538]">pending_actions</span>
                </div>
                <p className="text-white text-2xl font-bold mt-2">{stats.pendingRenewals || 0}</p>
                <p className="text-[#fa5538] text-xs font-medium bg-[#fa5538]/10 w-fit px-2 py-0.5 rounded flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">trending_down</span> -1%
                </p>
              </div>
            </div>

            {/* Toolbar & Filters */}
            <div className="flex flex-col gap-4 bg-surface-dark rounded-xl border border-border-dark p-2">
              {/* Top Bar: Search & Add */}
              <div className="flex flex-wrap justify-between gap-3 p-2">
                <div className="flex flex-1 gap-2 max-w-md">
                  <div className="relative flex-1">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-[20px]">search</span>
                    <input
                      className="w-full bg-surface-highlight border-transparent focus:border-primary focus:ring-0 rounded-lg h-10 pl-10 pr-4 text-white text-sm placeholder-text-secondary/70"
                      placeholder="Search by name or email"
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <button className="h-10 w-10 flex items-center justify-center rounded-lg bg-surface-highlight text-white hover:bg-surface-highlight/80 transition-colors border border-transparent hover:border-border-dark">
                    <span className="material-symbols-outlined text-[20px]">tune</span>
                  </button>
                </div>
                <button 
                  onClick={() => {
                    // Note: Adding members is typically done through the club join flow
                    // This button could open a modal to invite members by email
                    alert('Member invitation feature coming soon. Members can join clubs through the public club pages.');
                  }}
                  className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-primary text-surface-dark text-sm font-bold hover:bg-primary/90 transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px] icon-filled">add</span>
                  <span>Add Member</span>
                </button>
              </div>
              {/* Chips */}
              <div className="flex gap-2 px-2 pb-2 overflow-x-auto">
                {statusFilters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setStatusFilter(filter)}
                    className={`flex items-center justify-center px-4 py-1.5 rounded-full border text-sm font-medium whitespace-nowrap transition-colors ${
                      statusFilter === filter
                        ? 'bg-primary/20 text-primary border-primary/20'
                        : 'bg-surface-highlight text-text-secondary border-transparent hover:border-border-dark'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Members Table */}
            {!selectedClubId ? (
              <div className="flex items-center justify-center py-20 rounded-xl bg-surface-dark border border-border-dark">
                <div className="text-text-secondary">Please select a club to view members</div>
              </div>
            ) : isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader />
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-red-400">Error loading members. Please try again.</div>
              </div>
            ) : (
              <div className="w-full overflow-hidden rounded-xl border border-border-dark bg-surface-dark">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border-dark bg-surface-highlight/30">
                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">Member</th>
                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">Status</th>
                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">Join Date</th>
                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">Role</th>
                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-dark">
                      {members.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-6 py-8 text-center text-text-secondary">
                            No members found
                          </td>
                        </tr>
                      ) : (
                        members.map((member) => (
                          <tr key={member.id} className="group hover:bg-surface-highlight/40 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                {member.photoURL ? (
                                  <img
                                    src={member.photoURL}
                                    alt={member.name}
                                    className="size-10 rounded-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-medium">
                                    {member.name?.charAt(0)?.toUpperCase() || 'U'}
                                  </div>
                                )}
                                <div className="flex flex-col">
                                  <span className="text-white text-sm font-medium">{member.name}</span>
                                  <span className="text-text-secondary text-xs">{member.email}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(member.status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                              {member.joinDate}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary capitalize">
                              {member.role}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <div className="relative" ref={actionMenuOpen === member.id ? actionMenuRef : null}>
                                <button 
                                  onClick={() => setActionMenuOpen(actionMenuOpen === member.id ? null : member.id)}
                                  className="text-text-secondary hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
                                >
                                  <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                </button>
                                {actionMenuOpen === member.id && (
                                  <div className="absolute right-0 mt-2 w-48 bg-surface-dark border border-border-dark rounded-xl shadow-lg z-50 overflow-hidden">
                                    <div className="py-1">
                                      <button
                                        onClick={() => {
                                          // View member details
                                          alert(`Member Details:\n\nName: ${member.name}\nEmail: ${member.email}\nStatus: ${member.status}\nRole: ${member.role}\nJoin Date: ${member.joinDate}`);
                                          setActionMenuOpen(null);
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-white hover:bg-surface-highlight transition-colors flex items-center gap-2"
                                      >
                                        <span className="material-symbols-outlined text-lg">visibility</span>
                                        <span>View Details</span>
                                      </button>
                                      <button
                                        onClick={() => {
                                          // Send message/email
                                          window.location.href = `mailto:${member.email}`;
                                          setActionMenuOpen(null);
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-white hover:bg-surface-highlight transition-colors flex items-center gap-2"
                                      >
                                        <span className="material-symbols-outlined text-lg">email</span>
                                        <span>Send Email</span>
                                      </button>
                                      <div className="border-t border-border-dark my-1"></div>
                                      <button
                                        onClick={() => {
                                          if (window.confirm(`Are you sure you want to remove ${member.name} from this club?`)) {
                                            // TODO: Implement remove member API call
                                            alert('Remove member functionality will be implemented soon.');
                                            setActionMenuOpen(null);
                                          }
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                                      >
                                        <span className="material-symbols-outlined text-lg">person_remove</span>
                                        <span>Remove Member</span>
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between border-t border-border-dark bg-surface-dark px-4 py-3 sm:px-6">
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-text-secondary">
                          Showing <span className="font-medium text-white">{((page - 1) * limit) + 1}</span> to{' '}
                          <span className="font-medium text-white">{Math.min(page * limit, pagination.total)}</span> of{' '}
                          <span className="font-medium text-white">{pagination.total}</span> results
                        </p>
                      </div>
                      <div>
                        <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                          <button
                            onClick={() => setPage(Math.max(1, page - 1))}
                            disabled={page === 1}
                            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-text-secondary ring-1 ring-inset ring-border-dark hover:bg-surface-highlight focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                          >
                            <span className="sr-only">Previous</span>
                            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                          </button>
                          {(() => {
                            const maxPages = 5;
                            let startPage = Math.max(1, page - Math.floor(maxPages / 2));
                            let endPage = Math.min(pagination.totalPages, startPage + maxPages - 1);
                            
                            // Adjust start if we're near the end
                            if (endPage - startPage < maxPages - 1) {
                              startPage = Math.max(1, endPage - maxPages + 1);
                            }
                            
                            const pages = [];
                            for (let i = startPage; i <= endPage; i++) {
                              pages.push(i);
                            }
                            
                            return pages.map((pageNum) => (
                              <button
                                key={pageNum}
                                onClick={() => setPage(pageNum)}
                                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-border-dark hover:bg-surface-highlight focus:z-20 focus:outline-offset-0 ${
                                  page === pageNum
                                    ? 'bg-primary/20 text-primary'
                                    : 'text-white'
                                }`}
                              >
                                {pageNum}
                              </button>
                            ));
                          })()}
                          <button
                            onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
                            disabled={page === pagination.totalPages}
                            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-text-secondary ring-1 ring-inset ring-border-dark hover:bg-surface-highlight focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                          >
                            <span className="sr-only">Next</span>
                            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ManagerClubMembers;


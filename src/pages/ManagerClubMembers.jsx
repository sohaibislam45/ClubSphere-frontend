import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

const ManagerClubMembers = () => {
  const { user, logout } = useAuth();
  const { clubId } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Members');
  const [page, setPage] = useState(1);
  const limit = 10;

  // Fetch club members
  const { data: membersData, isLoading, error } = useQuery({
    queryKey: ['clubMembers', clubId, search, statusFilter, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter && statusFilter !== 'All Members') params.append('status', statusFilter);
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      const response = await api.get(`/api/manager/clubs/${clubId}/members?${params.toString()}`);
      return response.data;
    },
    enabled: !!clubId
  });

  const members = membersData?.members || [];
  const stats = membersData?.stats || { totalMembers: 0, activeMembers: 0, pendingRenewals: 0 };
  const pagination = membersData?.pagination || { page: 1, totalPages: 1, total: 0 };

  const statusFilters = ['All Members', 'Active', 'Expired', 'Pending Payment'];

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
    // TODO: Implement CSV export
    console.log('Export CSV');
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 h-full border-r border-border-dark/30 bg-surface-dark hidden md:flex flex-col justify-between p-4">
        <div className="flex flex-col gap-6">
          {/* User Profile / App Header */}
          <div className="flex gap-3 items-center px-2">
            <div className="bg-primary/20 rounded-full size-10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">groups</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-white text-base font-medium leading-normal">Club Manager</h1>
              <p className="text-text-secondary text-xs font-normal leading-normal">Admin Panel</p>
            </div>
          </div>
          {/* Navigation */}
          <nav className="flex flex-col gap-2">
            <Link to="/dashboard/club-manager" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-highlight/50 transition-colors group">
              <span className="material-symbols-outlined text-text-secondary group-hover:text-white">dashboard</span>
              <p className="text-text-secondary group-hover:text-white text-sm font-medium leading-normal">Dashboard</p>
            </Link>
            <Link to="/dashboard/club-manager/events" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-highlight/50 transition-colors group">
              <span className="material-symbols-outlined text-text-secondary group-hover:text-white">calendar_today</span>
              <p className="text-text-secondary group-hover:text-white text-sm font-medium leading-normal">Events</p>
            </Link>
            {/* Active State */}
            {clubId && (
              <Link to={`/dashboard/club-manager/clubs/${clubId}/members`} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-surface-highlight border border-border-dark/50">
                <span className="material-symbols-outlined text-white icon-filled">group</span>
                <p className="text-white text-sm font-medium leading-normal">Members</p>
              </Link>
            )}
            <Link to="/dashboard/club-manager" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-highlight/50 transition-colors group">
              <span className="material-symbols-outlined text-text-secondary group-hover:text-white">settings</span>
              <p className="text-text-secondary group-hover:text-white text-sm font-medium leading-normal">Settings</p>
            </Link>
          </nav>
        </div>
        {/* Bottom Actions */}
        <div className="flex flex-col gap-2 border-t border-border-dark/30 pt-4">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-highlight/50 transition-colors text-text-secondary hover:text-white w-full text-left"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="text-sm font-medium">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto bg-background-light dark:bg-background-dark">
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
                <button className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-primary text-surface-dark text-sm font-bold hover:bg-primary/90 transition-colors">
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
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-text-secondary">Loading members...</div>
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
                              <button className="text-text-secondary hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors">
                                <span className="material-symbols-outlined text-[20px]">more_vert</span>
                              </button>
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
                          {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                            const pageNum = i + 1;
                            return (
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
                            );
                          })}
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
        </div>
      </main>
    </div>
  );
};

export default ManagerClubMembers;


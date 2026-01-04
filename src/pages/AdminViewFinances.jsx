import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../components/layout/AdminSidebar';
import api from '../lib/api';
import Loader from '../components/ui/Loader';

const AdminViewFinances = () => {
  const { user } = useAuth();

  useEffect(() => {
    document.title = 'Financial Records - Admin - ClubSphere';
  }, []);
  const location = useLocation();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const limit = 5;

  // Fetch finances stats
  const { data: statsData } = useQuery({
    queryKey: ['admin-finances-stats'],
    queryFn: async () => {
      const response = await api.get('/api/admin/finances/stats');
      return response.data;
    }
  });

  // Fetch transactions
  const { data, isLoading } = useQuery({
    queryKey: ['admin-finances', page, search, statusFilter, typeFilter],
    queryFn: async () => {
      const response = await api.get('/api/admin/finances', {
        params: { page, limit, search, status: statusFilter, type: typeFilter }
      });
      return response.data;
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

  const transactions = data?.transactions || [];
  const pagination = data?.pagination || { total: 0, totalPages: 1 };
  const stats = statsData || { totalRevenue: 0, pendingPayments: 0, transactions30d: 0 };

  const getStatusBadge = (status) => {
    if (status === 'paid') {
      return {
        bg: 'bg-primary/20',
        text: 'text-primary',
        border: 'border-primary/20',
        dot: 'bg-primary',
        label: 'Paid'
      };
    } else if (status === 'pending') {
      return {
        bg: 'bg-yellow-500/20',
        text: 'text-yellow-500',
        border: 'border-yellow-500/20',
        dot: 'bg-yellow-500',
        label: 'Pending'
      };
    } else {
      return {
        bg: 'bg-red-500/20',
        text: 'text-red-500',
        border: 'border-red-500/20',
        icon: 'close',
        label: 'Failed'
      };
    }
  };

  const getInitialsColor = (initials) => {
    const colors = [
      'bg-blue-500/20 text-blue-400',
      'bg-purple-500/20 text-purple-400',
      'bg-pink-500/20 text-pink-400',
      'bg-orange-500/20 text-orange-400',
      'bg-teal-500/20 text-teal-400',
      'bg-green-500/20 text-green-400'
    ];
    const index = (initials.charCodeAt(0) + (initials.charCodeAt(1) || 0)) % colors.length;
    return colors[index];
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white">
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-background-light dark:bg-background-dark">
        {/* Top Bar / Header */}
        <header className="w-full px-6 py-6 md:px-10 flex flex-col gap-6 flex-shrink-0">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-white text-3xl font-black leading-tight tracking-tight">Financial Records</h2>
              <p className="text-[#9eb7a8] text-base font-normal">Audit and manage all platform transactions</p>
            </div>
            <button className="flex items-center justify-center gap-2 rounded-full h-10 px-5 bg-primary text-black text-sm font-bold leading-normal tracking-wide hover:bg-[#2bc468] transition-colors shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-[20px]">download</span>
              <span>Export CSV</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1 */}
            <div className="flex flex-col gap-1 rounded-xl p-5 border border-[#3d5245] bg-[#1c2620] shadow-sm">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-primary/10 rounded-full text-primary">
                  <span className="material-symbols-outlined text-[20px]">payments</span>
                </div>
                <p className="text-[#9eb7a8] text-sm font-medium">Total Revenue</p>
              </div>
              <div className="flex items-end gap-3 mt-2">
                <p className="text-white text-3xl font-bold leading-none tracking-tight">৳{stats.totalRevenue.toLocaleString()}</p>
                <div className="flex items-center text-primary text-sm font-bold bg-primary/10 px-2 py-0.5 rounded-full">
                  <span className="material-symbols-outlined text-[16px]">trending_up</span>
                  <span className="ml-1">12%</span>
                </div>
              </div>
            </div>
            {/* Card 2 */}
            <div className="flex flex-col gap-1 rounded-xl p-5 border border-[#3d5245] bg-[#1c2620] shadow-sm">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-yellow-500/10 rounded-full text-yellow-500">
                  <span className="material-symbols-outlined text-[20px]">pending</span>
                </div>
                <p className="text-[#9eb7a8] text-sm font-medium">Pending Payments</p>
              </div>
              <div className="flex items-end gap-3 mt-2">
                <p className="text-white text-3xl font-bold leading-none tracking-tight">{stats.pendingPayments}</p>
                <div className="flex items-center text-yellow-500 text-sm font-bold bg-yellow-500/10 px-2 py-0.5 rounded-full">
                  <span className="material-symbols-outlined text-[16px]">trending_up</span>
                  <span className="ml-1">2%</span>
                </div>
              </div>
            </div>
            {/* Card 3 */}
            <div className="flex flex-col gap-1 rounded-xl p-5 border border-[#3d5245] bg-[#1c2620] shadow-sm">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-400/10 rounded-full text-blue-400">
                  <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                </div>
                <p className="text-[#9eb7a8] text-sm font-medium">Transactions (30d)</p>
              </div>
              <div className="flex items-end gap-3 mt-2">
                <p className="text-white text-3xl font-bold leading-none tracking-tight">{stats.transactions30d}</p>
                <div className="flex items-center text-primary text-sm font-bold bg-primary/10 px-2 py-0.5 rounded-full">
                  <span className="material-symbols-outlined text-[16px]">trending_up</span>
                  <span className="ml-1">5%</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-6 md:px-10 pb-10 scroll-smooth">
          <div className="flex flex-col gap-4 h-full">
            {/* Filters Toolbar */}
            <div className="flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center bg-[#1c2620]/50 p-4 rounded-xl border border-[#3d5245] backdrop-blur-sm sticky top-0 z-10">
              <div className="flex flex-1 w-full xl:w-auto items-stretch gap-3">
                {/* Search */}
                <div className="relative flex-1 min-w-[240px] max-w-[400px]">
                  <input
                    className="w-full h-10 pl-10 pr-4 rounded-full bg-[#122017] border border-[#3d5245] text-white placeholder-[#9eb7a8] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
                    placeholder="Search by User Email..."
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#9eb7a8] text-[20px]">search</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
                {/* Status Filter */}
                <div className="relative min-w-[140px]">
                  <select
                    className="w-full h-10 pl-4 pr-10 appearance-none rounded-full bg-[#122017] border border-[#3d5245] text-white text-sm focus:outline-none focus:border-primary cursor-pointer"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#9eb7a8] pointer-events-none text-[20px]">arrow_drop_down</span>
                </div>
                {/* Type Filter */}
                <div className="relative min-w-[160px]">
                  <select
                    className="w-full h-10 pl-4 pr-10 appearance-none rounded-full bg-[#122017] border border-[#3d5245] text-white text-sm focus:outline-none focus:border-primary cursor-pointer"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    <option value="Membership">Membership</option>
                    <option value="Event Ticket">Event Ticket</option>
                    <option value="Donation">Donation</option>
                    <option value="Sponsorship">Sponsorship</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#9eb7a8] pointer-events-none text-[20px]">arrow_drop_down</span>
                </div>
                {/* Date Button (Mock) */}
                <button className="h-10 px-4 rounded-full bg-[#122017] border border-[#3d5245] text-white text-sm hover:border-primary transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#9eb7a8]">calendar_today</span>
                  <span>This Month</span>
                </button>
              </div>
            </div>

            {/* Table Container */}
            <div className="w-full overflow-hidden rounded-xl border border-[#3d5245] bg-[#1c2620] flex flex-col flex-1 min-h-[400px]">
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#3d5245] bg-[#122017]/50 text-xs uppercase tracking-wider text-[#9eb7a8]">
                      <th className="p-5 font-semibold">User Email</th>
                      <th className="p-5 font-semibold text-right">Amount</th>
                      <th className="p-5 font-semibold">Type</th>
                      <th className="p-5 font-semibold">Associated Club/Event</th>
                      <th className="p-5 font-semibold">Date</th>
                      <th className="p-5 font-semibold">Status</th>
                      <th className="p-5 font-semibold w-[60px]"></th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-[#3d5245]">
                    {transactions.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="p-5 text-center text-[#9eb7a8]">No transactions found</td>
                      </tr>
                    ) : (
                      transactions.map((transaction) => {
                        const statusBadge = getStatusBadge(transaction.status);
                        const initials = transaction.userInitials || getUserInitials(transaction.userName || transaction.userEmail);
                        const colorClass = getInitialsColor(initials);

                        return (
                          <tr key={transaction.id} className="group hover:bg-white/5 transition-colors">
                            <td className="p-5">
                              <div className="flex items-center gap-3">
                                {transaction.userPhotoURL ? (
                                  <img
                                    src={transaction.userPhotoURL}
                                    alt={transaction.userEmail}
                                    className="size-8 rounded-full bg-cover bg-center"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      e.target.nextElementSibling.style.display = 'flex';
                                    }}
                                  />
                                ) : null}
                                <div className={`size-8 rounded-full ${colorClass} flex items-center justify-center text-xs font-bold ${transaction.userPhotoURL ? 'hidden' : 'flex'}`}>
                                  {initials}
                                </div>
                                <span className="text-white font-medium">{transaction.userEmail}</span>
                              </div>
                            </td>
                            <td className="p-5 text-right">
                              {transaction.status === 'failed' ? (
                                <span className="text-[#9eb7a8]">-</span>
                              ) : (
                                <span className="text-white font-mono font-medium">{transaction.amount}</span>
                              )}
                            </td>
                            <td className="p-5">
                              <span className="text-[#9eb7a8]">{transaction.type}</span>
                            </td>
                            <td className="p-5">
                              <span className="text-white">{transaction.associatedItem || '-'}</span>
                            </td>
                            <td className="p-5">
                              <span className="text-[#9eb7a8]">{transaction.date}</span>
                            </td>
                            <td className="p-5">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${statusBadge.bg} ${statusBadge.text} border ${statusBadge.border}`}>
                                {statusBadge.dot ? <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`}></span> : null}
                                {statusBadge.icon ? <span className="material-symbols-outlined text-[14px]">{statusBadge.icon}</span> : null}
                                {statusBadge.label}
                              </span>
                            </td>
                            <td className="p-5 text-right">
                              <button className="text-[#9eb7a8] hover:text-white p-1 rounded hover:bg-white/10 transition-colors">
                                <span className="material-symbols-outlined">more_vert</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="p-4 border-t border-[#3d5245] flex items-center justify-between bg-[#122017]/30">
                <div className="text-sm text-[#9eb7a8]">
                  Showing <span className="text-white font-medium">{((page - 1) * limit) + 1}-{Math.min(page * limit, pagination.total)}</span> of{' '}
                  <span className="text-white font-medium">{pagination.total}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="size-9 flex items-center justify-center rounded-full border border-[#3d5245] bg-[#1c2620] text-[#9eb7a8] hover:text-white hover:border-[#9eb7a8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                    disabled={page >= pagination.totalPages}
                    className="size-9 flex items-center justify-center rounded-full border border-[#3d5245] bg-[#1c2620] text-[#9eb7a8] hover:text-white hover:border-[#9eb7a8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

export default AdminViewFinances;


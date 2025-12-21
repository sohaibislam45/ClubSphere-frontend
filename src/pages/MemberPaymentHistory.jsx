import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import MemberSidebar from '../components/layout/MemberSidebar';
import Loader from '../components/ui/Loader';
import api from '../lib/api';
import Swal from '../lib/sweetalertConfig';

const MemberPaymentHistory = () => {
  const { user } = useAuth();

  useEffect(() => {
    document.title = 'Payment History - ClubSphere';
  }, []);
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [dateRange, setDateRange] = useState('this_year');

  const { data, isLoading, error } = useQuery({
    queryKey: ['payments', typeFilter, statusFilter, dateRange],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (typeFilter !== 'All Types') params.append('type', typeFilter);
      if (statusFilter !== 'All Status') params.append('status', statusFilter);
      if (dateRange) params.append('dateRange', dateRange);
      
      const response = await api.get(`/api/member/payments?${params.toString()}`);
      return response.data;
    }
  });

  const transactions = data?.transactions || [];
  const stats = data?.stats || { totalSpent: '0.00', lastPayment: null, activeSubscriptions: 0 };

  const getStatusBadgeClass = (statusColor) => {
    switch (statusColor) {
      case 'primary':
        return 'bg-primary/10 text-primary';
      case 'yellow':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'red':
        return 'bg-red-500/10 text-red-400';
      default:
        return 'bg-primary/10 text-primary';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'membership':
        return 'card_membership';
      case 'event':
        return 'event';
      case 'donation':
        return 'volunteer_activism';
      default:
        return 'receipt_long';
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display overflow-hidden h-screen flex">
      <MemberSidebar />
      
      <main className="flex flex-1 flex-col h-full overflow-hidden bg-background-light dark:bg-background-dark relative">
        {/* Top Navigation */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#29382f] px-8 py-4 bg-[#111714] dark:bg-background-dark z-10">
          <div className="flex items-center gap-8 w-full max-w-2xl">
            <div className="flex items-center gap-4 text-white lg:hidden">
              <span className="material-symbols-outlined">menu</span>
            </div>
            <label className="flex flex-col flex-1 h-12 max-w-md">
              <div className="flex w-full flex-1 items-stretch rounded-xl h-full focus-within:ring-2 focus-within:ring-primary/50 transition-all">
                <div className="text-[#9eb7a8] flex border-none bg-[#29382f] items-center justify-center pl-4 rounded-l-xl border-r-0">
                  <span className="material-symbols-outlined">search</span>
                </div>
                <input
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 border-none bg-[#29382f] h-full placeholder:text-[#9eb7a8] px-4 rounded-l-none pl-2 text-base font-normal leading-normal"
                  placeholder="Search invoices, dates..."
                  type="text"
                />
              </div>
            </label>
          </div>
          <div className="flex flex-1 justify-end gap-6 items-center">
            <div className="flex gap-2">
              <button className="flex items-center justify-center overflow-hidden rounded-full size-10 bg-[#29382f] hover:bg-[#384a3f] text-white transition-colors relative">
                <span className="material-symbols-outlined text-[20px]">notifications</span>
                <span className="absolute top-2.5 right-2.5 size-2 bg-primary rounded-full border border-[#29382f]"></span>
              </button>
              <button className="flex items-center justify-center overflow-hidden rounded-full size-10 bg-[#29382f] hover:bg-[#384a3f] text-white transition-colors">
                <span className="material-symbols-outlined text-[20px]">help</span>
              </button>
            </div>
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user?.name || 'User avatar'}
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-[#29382f] cursor-pointer object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-[#29382f] cursor-pointer"
                style={{
                  backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCBSxVoFYQbuZMYwZMy4AO5ikVaeak_qR7fs6a_FaBXZvWX2c6xZGFRWfFh5oScO_wr4zmD2uZw_-8m6tPepw4PYw4jAKvylJ103pJmB5Q3C15imv7iMF40CR50TpBj5cE0LG1J4oCqXgZKrF-YThE4GppwQs8_UXRMJYD8hQqLyQNY80R2XowhzKRZWJHGxUr50Fv9ZpdNzigSlWtEJXtpVDzAsNDslZRFC_FdlDrgVyle5oqxE2Pwmudz8PQqRD9O59Vvoyg5rc_j")'
                }}
              ></div>
            )}
          </div>
        </header>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
          <div className="mx-auto max-w-[1200px] flex flex-col gap-8 pb-10">
            {/* Page Heading */}
            <div className="flex flex-wrap justify-between items-end gap-4">
              <div className="flex flex-col gap-2">
                <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">Payment History</h1>
                <p className="text-[#9eb7a8] text-base font-normal leading-normal max-w-2xl">
                  View your past transactions, manage invoices, and track your spending across all your clubs and events.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setDateRange('this_year')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-colors border ${
                    dateRange === 'this_year'
                      ? 'bg-primary hover:bg-[#2ec569] text-[#111714] shadow-lg shadow-primary/20 border-transparent'
                      : 'bg-[#29382f] hover:bg-[#36493d] text-white border-transparent hover:border-[#9eb7a8]/20'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">date_range</span>
                  This Year
                </button>
                <button className="flex items-center gap-2 bg-primary hover:bg-[#2ec569] text-[#111714] px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-primary/20">
                  <span className="material-symbols-outlined text-[20px]">download</span>
                  Export CSV
                </button>
              </div>
            </div>

            {/* Stats Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-3 rounded-2xl p-6 bg-[#29382f] border border-white/5 hover:border-white/10 transition-colors shadow-lg shadow-black/20">
                <div className="flex justify-between items-start">
                  <div className="bg-[#1a251f] p-2 rounded-lg text-primary">
                    <span className="material-symbols-outlined">attach_money</span>
                  </div>
                  <span className="text-[#38e07b] bg-[#38e07b]/10 px-2 py-1 rounded text-xs font-bold">+12%</span>
                </div>
                <div>
                  <p className="text-[#9eb7a8] text-sm font-medium leading-normal mb-1">Total Spent (YTD)</p>
                  <p className="text-white tracking-tight text-3xl font-bold leading-tight">৳{stats.totalSpent}</p>
                </div>
              </div>
              <div className="flex flex-col gap-3 rounded-2xl p-6 bg-[#29382f] border border-white/5 hover:border-white/10 transition-colors shadow-lg shadow-black/20">
                <div className="flex justify-between items-start">
                  <div className="bg-[#1a251f] p-2 rounded-lg text-white">
                    <span className="material-symbols-outlined">receipt</span>
                  </div>
                </div>
                <div>
                  <p className="text-[#9eb7a8] text-sm font-medium leading-normal mb-1">Last Payment</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-white tracking-tight text-3xl font-bold leading-tight">
                      ৳{stats.lastPayment?.amount || '0.00'}
                    </p>
                    {stats.lastPayment && (
                      <span className="text-[#9eb7a8] text-sm">for {stats.lastPayment.description}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3 rounded-2xl p-6 bg-[#29382f] border border-white/5 hover:border-white/10 transition-colors shadow-lg shadow-black/20">
                <div className="flex justify-between items-start">
                  <div className="bg-[#1a251f] p-2 rounded-lg text-white">
                    <span className="material-symbols-outlined">card_membership</span>
                  </div>
                </div>
                <div>
                  <p className="text-[#9eb7a8] text-sm font-medium leading-normal mb-1">Active Subscriptions</p>
                  <p className="text-white tracking-tight text-3xl font-bold leading-tight">{stats.activeSubscriptions}</p>
                </div>
              </div>
            </div>

            {/* Controls and Filters */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-2">
              <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                <div className="relative group">
                  <select
                    className="appearance-none bg-[#29382f] text-white pl-10 pr-10 py-3 rounded-xl border-none focus:ring-1 focus:ring-primary cursor-pointer font-medium text-sm min-w-[140px]"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    <option>All Types</option>
                    <option>Memberships</option>
                    <option>Events</option>
                    <option>Donations</option>
                  </select>
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#9eb7a8] pointer-events-none text-[20px]">
                    filter_list
                  </span>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#9eb7a8] pointer-events-none text-[20px]">
                    expand_more
                  </span>
                </div>
                <div className="relative group">
                  <select
                    className="appearance-none bg-[#29382f] text-white pl-10 pr-10 py-3 rounded-xl border-none focus:ring-1 focus:ring-primary cursor-pointer font-medium text-sm min-w-[140px]"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option>All Status</option>
                    <option>Success</option>
                    <option>Pending</option>
                    <option>Failed</option>
                  </select>
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#9eb7a8] pointer-events-none text-[20px]">
                    check_circle
                  </span>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#9eb7a8] pointer-events-none text-[20px]">
                    expand_more
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#9eb7a8] text-sm">Showing 1-{transactions.length} of {transactions.length}</span>
              </div>
            </div>

            {/* Transaction Table */}
            {error ? (
              <div className="text-center py-20">
                <p className="text-red-400 mb-4">Error loading transactions</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="text-primary hover:underline"
                >
                  Try again
                </button>
              </div>
            ) : (
              <div className="flex flex-col overflow-hidden rounded-2xl border border-[#29382f] shadow-xl shadow-black/20">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-[#1a251f] text-white">
                      <tr>
                        <th className="p-5 text-xs font-bold uppercase tracking-wider text-[#9eb7a8]">Date</th>
                        <th className="p-5 text-xs font-bold uppercase tracking-wider text-[#9eb7a8]">Description</th>
                        <th className="p-5 text-xs font-bold uppercase tracking-wider text-[#9eb7a8]">Type</th>
                        <th className="p-5 text-xs font-bold uppercase tracking-wider text-[#9eb7a8]">Status</th>
                        <th className="p-5 text-xs font-bold uppercase tracking-wider text-[#9eb7a8] text-right">Amount</th>
                        <th className="p-5 text-xs font-bold uppercase tracking-wider text-[#9eb7a8] text-right">Invoice</th>
                      </tr>
                    </thead>
                    <tbody className="bg-[#29382f] divide-y divide-[#1a251f]">
                      {transactions.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="p-10 text-center text-gray-400">No transactions found</td>
                        </tr>
                      ) : (
                        transactions.map((transaction) => (
                          <tr key={transaction.id} className="group hover:bg-[#304036] transition-colors">
                            <td className="p-5 text-sm text-white whitespace-nowrap">{transaction.date}</td>
                            <td className="p-5 text-sm text-white font-medium">
                              <div className="flex items-center gap-3">
                                <div className="size-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                  <span className="material-symbols-outlined text-[18px]">{transaction.icon}</span>
                                </div>
                                {transaction.description}
                              </div>
                            </td>
                            <td className="p-5">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#1a251f] text-white border border-[#3e4f44]">
                                {transaction.typeLabel}
                              </span>
                            </td>
                            <td className="p-5">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${getStatusBadgeClass(transaction.statusColor)}`}>
                                <span className={`size-1.5 rounded-full ${
                                  transaction.statusColor === 'primary' ? 'bg-primary' :
                                  transaction.statusColor === 'yellow' ? 'bg-yellow-500' :
                                  transaction.statusColor === 'red' ? 'bg-red-500' : 'bg-primary'
                                }`}></span>
                                {transaction.statusLabel}
                              </span>
                            </td>
                            <td className="p-5 text-sm text-white font-bold text-right">৳{transaction.amount}</td>
                            <td className="p-5 text-right">
                              {transaction.status === 'failed' ? (
                                <button className="text-[#9eb7a8] hover:text-primary transition-colors p-2 hover:bg-primary/10 rounded-full opacity-50 cursor-not-allowed">
                                  <span className="material-symbols-outlined text-[20px]">block</span>
                                </button>
                              ) : (
                                <button className="text-[#9eb7a8] hover:text-primary transition-colors p-2 hover:bg-primary/10 rounded-full">
                                  <span className="material-symbols-outlined text-[20px]">download</span>
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                {/* Pagination */}
                {transactions.length > 0 && (
                  <div className="flex items-center justify-between border-t border-[#1a251f] bg-[#29382f] p-4">
                    <button className="flex items-center justify-center gap-2 rounded-lg border border-[#3e4f44] bg-[#1a251f] px-4 py-2 text-sm font-medium text-white hover:bg-[#25332b] hover:text-primary transition-colors disabled:opacity-50" disabled>
                      <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                      Previous
                    </button>
                    <div className="flex gap-2">
                      <button className="flex size-8 items-center justify-center rounded-lg bg-primary text-[#111714] text-sm font-bold">1</button>
                    </div>
                    <button className="flex items-center justify-center gap-2 rounded-lg border border-[#3e4f44] bg-[#1a251f] px-4 py-2 text-sm font-medium text-white hover:bg-[#25332b] hover:text-primary transition-colors">
                      Next
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </button>
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

export default MemberPaymentHistory;


import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import Loader from '../components/ui/Loader';
import Swal from '../lib/sweetalertConfig';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    document.title = 'Admin Dashboard - ClubSphere';
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  // Fetch dashboard stats
  const { data: dashboardStats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      const response = await api.get('/api/admin/dashboard/stats');
      return response.data;
    }
  });

  // Fetch pending clubs
  const { data: pendingClubsData, isLoading: pendingClubsLoading } = useQuery({
    queryKey: ['admin-pending-clubs'],
    queryFn: async () => {
      const response = await api.get('/api/admin/clubs', { 
        params: { status: 'pending', limit: 5 } 
      });
      return response.data;
    }
  });

  // Fetch pending deletion requests
  const { data: deletionRequestsData, isLoading: deletionRequestsLoading } = useQuery({
    queryKey: ['admin-deletion-requests'],
    queryFn: async () => {
      const response = await api.get('/api/admin/clubs', { 
        params: { type: 'deletion', limit: 5 } 
      });
      return response.data;
    }
  });

  // Fetch recent transactions
  const { data: transactionsData, isLoading: transactionsLoading } = useQuery({
    queryKey: ['admin-recent-transactions'],
    queryFn: async () => {
      const response = await api.get('/api/admin/finances', { 
        params: { limit: 10 } 
      });
      return response.data;
    }
  });

  // Fetch monthly revenue data for chart
  const [chartPeriod, setChartPeriod] = useState(6); // 6 months or 12 months
  const { data: monthlyRevenueData, isLoading: monthlyRevenueLoading } = useQuery({
    queryKey: ['admin-monthly-revenue', chartPeriod],
    queryFn: async () => {
      const response = await api.get('/api/admin/dashboard/monthly-revenue', {
        params: { months: chartPeriod }
      });
      return response.data;
    }
  });

  // Approve club mutation
  const approveClubMutation = useMutation({
    mutationFn: async (clubId) => {
      const response = await api.put(`/api/admin/clubs/${clubId}/approve`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-pending-clubs']);
      queryClient.invalidateQueries(['admin-dashboard-stats']);
    }
  });

  // Reject club mutation
  const rejectClubMutation = useMutation({
    mutationFn: async (clubId) => {
      const response = await api.put(`/api/admin/clubs/${clubId}/reject`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-pending-clubs']);
      queryClient.invalidateQueries(['admin-dashboard-stats']);
    }
  });

  // Approve deletion request mutation
  const approveDeletionMutation = useMutation({
    mutationFn: async (clubId) => {
      const response = await api.put(`/api/admin/clubs/${clubId}/approve-deletion`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-deletion-requests']);
      queryClient.invalidateQueries(['admin-dashboard-stats']);
      Swal.fire({
        icon: 'success',
        title: 'Club Deleted!',
        text: 'The club has been successfully deleted.',
        timer: 3000,
        showConfirmButton: false
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.error || 'Failed to delete club. Please try again.'
      });
    }
  });

  // Reject deletion request mutation
  const rejectDeletionMutation = useMutation({
    mutationFn: async (clubId) => {
      const response = await api.put(`/api/admin/clubs/${clubId}/reject-deletion`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-deletion-requests']);
      queryClient.invalidateQueries(['admin-dashboard-stats']);
      Swal.fire({
        icon: 'success',
        title: 'Deletion Request Rejected!',
        text: 'The deletion request has been rejected. The club remains active.',
        timer: 3000,
        showConfirmButton: false
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.error || 'Failed to reject deletion request. Please try again.'
      });
    }
  });

  const handleApproveClub = (clubId) => {
    if (window.confirm('Are you sure you want to approve this club?')) {
      approveClubMutation.mutate(clubId);
    }
  };

  const handleRejectClub = (clubId) => {
    if (window.confirm('Are you sure you want to reject this club?')) {
      rejectClubMutation.mutate(clubId);
    }
  };

  const handleApproveDeletion = (clubId) => {
    Swal.fire({
      title: 'Approve Club Deletion?',
      text: 'This action cannot be undone. The club will be permanently deleted along with all related data.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Delete Club',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        approveDeletionMutation.mutate(clubId);
      }
    });
  };

  const handleRejectDeletion = (clubId) => {
    Swal.fire({
      title: 'Reject Deletion Request?',
      text: 'The deletion request will be rejected and the club will remain active.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#38e07b',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Reject Request',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        rejectDeletionMutation.mutate(clubId);
      }
    });
  };

  const pendingClubs = pendingClubsData?.clubs || [];
  const deletionRequests = deletionRequestsData?.clubs || [];
  const transactions = transactionsData?.transactions || [];
  const monthlyRevenue = monthlyRevenueData?.monthlyData || [];

  // Combined loading state - show single loader if any query is loading
  const isLoading = statsLoading || pendingClubsLoading || deletionRequestsLoading || transactionsLoading || monthlyRevenueLoading;

  // Calculate chart data from monthly revenue
  const calculateChartData = () => {
    if (monthlyRevenue.length === 0) {
      // Return empty/default chart data
      return {
        maxValue: 1000,
        points: [],
        path: 'M0,200',
        areaPath: 'M0,200 L0,200 Z',
        monthLabels: []
      };
    }

    const maxRevenue = Math.max(...monthlyRevenue.map(m => m.revenue), 0);
    const maxValue = maxRevenue > 0 ? Math.ceil(maxRevenue * 1.2) : 1000; // Add 20% padding, or default to 1000 if no revenue
    const chartHeight = 200;
    const chartWidth = 800;
    const pointSpacing = monthlyRevenue.length > 1 ? chartWidth / (monthlyRevenue.length - 1) : 0;

    const points = monthlyRevenue.map((month, index) => {
      const x = monthlyRevenue.length === 1 ? chartWidth / 2 : index * pointSpacing;
      const y = maxValue > 0 
        ? chartHeight - (month.revenue / maxValue) * chartHeight 
        : chartHeight; // If no revenue, show at bottom
      return { x, y, revenue: month.revenue };
    });

    // Generate smooth path
    let path = '';
    let areaPath = '';
    if (points.length > 0) {
      path = `M${points[0].x},${points[0].y}`;
      areaPath = `M${points[0].x},${chartHeight} L${points[0].x},${points[0].y}`;
      
      if (points.length === 1) {
        // Single point - draw a small horizontal line
        path += ` L${points[0].x + 10},${points[0].y}`;
        areaPath += ` L${points[0].x + 10},${points[0].y} L${points[0].x + 10},${chartHeight} Z`;
      } else {
        // Multiple points - use smooth curves
        for (let i = 1; i < points.length; i++) {
          const prevPoint = points[i - 1];
          const currentPoint = points[i];
          const controlX1 = prevPoint.x + (currentPoint.x - prevPoint.x) / 3;
          const controlY1 = prevPoint.y;
          const controlX2 = currentPoint.x - (currentPoint.x - prevPoint.x) / 3;
          const controlY2 = currentPoint.y;
          
          path += ` C${controlX1},${controlY1} ${controlX2},${controlY2} ${currentPoint.x},${currentPoint.y}`;
          areaPath += ` C${controlX1},${controlY1} ${controlX2},${controlY2} ${currentPoint.x},${currentPoint.y}`;
        }
        
        areaPath += ` L${points[points.length - 1].x},${chartHeight} Z`;
      }
    }

    return {
      maxValue,
      points,
      path,
      areaPath,
      monthLabels: monthlyRevenue.map(m => m.month)
    };
  };

  const chartData = calculateChartData();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-dashboard-background dark:bg-background-dark font-display text-dashboard-text-main dark:text-white">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 flex flex-col justify-between border-r border-dashboard-border dark:border-surface-highlight bg-dashboard-sidebar dark:bg-background-dark transition-all duration-300 shadow-sm">
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
            <h1 className="text-dashboard-text-main dark:text-white text-lg font-bold leading-normal hidden lg:block tracking-wide">ClubSphere</h1>
          </div>
          {/* Nav Links */}
          <nav className="flex flex-col gap-2 mt-4">
            <Link to="/" className="flex items-center gap-3 px-3 py-3 rounded-full text-dashboard-text-muted dark:text-gray-400 hover:bg-dashboard-surface-hover dark:hover:bg-surface-highlight hover:text-dashboard-text-main dark:hover:text-white transition-colors">
              <span className="material-symbols-outlined">home</span>
              <p className="text-sm font-medium leading-normal hidden lg:block">Home</p>
            </Link>
            <Link to="/dashboard/admin" className={`flex items-center gap-3 px-3 py-3 rounded-full transition-colors ${location.pathname === '/dashboard/admin' ? 'bg-dashboard-primary dark:bg-primary text-white font-bold' : 'text-dashboard-text-muted dark:text-gray-400 hover:bg-dashboard-surface-hover dark:hover:bg-surface-highlight hover:text-dashboard-text-main dark:hover:text-white'}`}>
              <span className="material-symbols-outlined">dashboard</span>
              <p className={`text-sm leading-normal hidden lg:block ${location.pathname === '/dashboard/admin' ? 'font-bold' : 'font-medium'}`}>Dashboard</p>
            </Link>
            <Link to="/dashboard/admin/users" className={`flex items-center gap-3 px-3 py-3 rounded-full transition-colors ${location.pathname === '/dashboard/admin/users' ? 'bg-dashboard-primary dark:bg-primary text-white font-bold' : 'text-dashboard-text-muted dark:text-gray-400 hover:bg-dashboard-surface-hover dark:hover:bg-surface-highlight hover:text-dashboard-text-main dark:hover:text-white'}`}>
              <span className="material-symbols-outlined">group</span>
              <p className={`text-sm leading-normal hidden lg:block ${location.pathname === '/dashboard/admin/users' ? 'font-bold' : 'font-medium'}`}>Users</p>
            </Link>
            <Link to="/dashboard/admin/clubs" className={`flex items-center gap-3 px-3 py-3 rounded-full transition-colors ${location.pathname === '/dashboard/admin/clubs' ? 'bg-dashboard-primary dark:bg-primary text-white font-bold' : 'text-dashboard-text-muted dark:text-gray-400 hover:bg-dashboard-surface-hover dark:hover:bg-surface-highlight hover:text-dashboard-text-main dark:hover:text-white'}`}>
              <span className="material-symbols-outlined">diversity_3</span>
              <p className={`text-sm leading-normal hidden lg:block ${location.pathname === '/dashboard/admin/clubs' ? 'font-bold' : 'font-medium'}`}>Clubs</p>
            </Link>
            <Link to="/dashboard/admin/events" className={`flex items-center gap-3 px-3 py-3 rounded-full transition-colors ${location.pathname === '/dashboard/admin/events' ? 'bg-dashboard-primary dark:bg-primary text-white font-bold' : 'text-dashboard-text-muted dark:text-gray-400 hover:bg-dashboard-surface-hover dark:hover:bg-surface-highlight hover:text-dashboard-text-main dark:hover:text-white'}`}>
              <span className="material-symbols-outlined">calendar_today</span>
              <p className={`text-sm leading-normal hidden lg:block ${location.pathname === '/dashboard/admin/events' ? 'font-bold' : 'font-medium'}`}>Events</p>
            </Link>
            <Link to="/dashboard/admin/finances" className={`flex items-center gap-3 px-3 py-3 rounded-full transition-colors ${location.pathname === '/dashboard/admin/finances' ? 'bg-dashboard-primary dark:bg-primary text-white font-bold' : 'text-dashboard-text-muted dark:text-gray-400 hover:bg-dashboard-surface-hover dark:hover:bg-surface-highlight hover:text-dashboard-text-main dark:hover:text-white'}`}>
              <span className="material-symbols-outlined">payments</span>
              <p className={`text-sm leading-normal hidden lg:block ${location.pathname === '/dashboard/admin/finances' ? 'font-bold' : 'font-medium'}`}>Finances</p>
            </Link>
            <Link to="/dashboard/admin/categories" className={`flex items-center gap-3 px-3 py-3 rounded-full transition-colors ${location.pathname === '/dashboard/admin/categories' ? 'bg-dashboard-primary dark:bg-primary text-white font-bold' : 'text-dashboard-text-muted dark:text-gray-400 hover:bg-dashboard-surface-hover dark:hover:bg-surface-highlight hover:text-dashboard-text-main dark:hover:text-white'}`}>
              <span className="material-symbols-outlined">category</span>
              <p className={`text-sm leading-normal hidden lg:block ${location.pathname === '/dashboard/admin/categories' ? 'font-bold' : 'font-medium'}`}>Categories</p>
            </Link>
          </nav>
        </div>
        {/* Bottom Settings */}
        <div className="p-4">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-3 py-3 rounded-full text-dashboard-text-muted dark:text-gray-400 hover:bg-dashboard-surface-hover dark:hover:bg-surface-highlight hover:text-dashboard-text-main dark:hover:text-white transition-colors w-full"
          >
            <span className="material-symbols-outlined">settings</span>
            <p className="text-sm font-medium leading-normal hidden lg:block">Settings</p>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-dashboard-background dark:bg-background-dark">
        {/* Top Bar */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-dashboard-border dark:border-surface-highlight px-6 py-4 bg-white/80 dark:bg-background-dark/50 backdrop-blur-md z-10">
          <div className="flex items-center gap-8 w-full max-w-2xl">
            <h2 className="text-dashboard-text-main dark:text-white text-xl font-bold leading-tight hidden md:block">Admin Console</h2>
            {/* Search Bar */}
            <label className="flex flex-col w-full max-w-md h-11">
              <div className="flex w-full flex-1 items-center rounded-full bg-dashboard-surface-hover dark:bg-surface-dark border border-dashboard-border dark:border-transparent focus-within:border-dashboard-primary dark:focus-within:border-primary/50 focus-within:bg-white dark:focus-within:bg-surface-dark focus-within:ring-2 focus-within:ring-dashboard-primary/10 dark:focus-within:ring-primary/10 transition-colors px-4">
                <span className="material-symbols-outlined text-dashboard-text-muted dark:text-gray-400">search</span>
                <input 
                  className="w-full bg-transparent border-none text-dashboard-text-main dark:text-white placeholder-dashboard-text-muted dark:placeholder-gray-500 focus:ring-0 text-sm font-normal ml-2" 
                  placeholder="Search users, clubs, or events..." 
                />
              </div>
            </label>
          </div>
          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button className="flex items-center justify-center size-10 rounded-full bg-white dark:bg-surface-dark border border-dashboard-border dark:border-surface-highlight hover:bg-dashboard-surface-hover dark:hover:bg-surface-highlight text-dashboard-text-muted dark:text-gray-400 hover:text-dashboard-primary dark:hover:text-white transition-colors relative shadow-sm">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-surface-dark"></span>
            </button>
            <div className="h-8 w-px bg-dashboard-border dark:bg-surface-highlight mx-1"></div>
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 bg-surface-dark hover:bg-surface-highlight transition-colors border border-surface-highlight"
              >
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user?.name || 'Admin avatar'}
                    className="size-8 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const fallback = e.target.nextElementSibling;
                      if (fallback) fallback.style.display = 'block';
                    }}
                  />
                ) : null}
                <div 
                  className={`size-8 rounded-full bg-cover bg-center ${user?.photoURL ? 'hidden' : ''}`}
                  style={{ 
                    backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA9zqG3-2JnoqjGIKWNWeHge3KqIh7kIXdIcZ5_5CcSX2AV_z7LGRAtUOw6arXnuz2bHq60vM6pWztNijvI2P-6d8HRRlcim8z1_7xXb_YzIvvUXhsz-JFsJ0UOXPZs9UNth8T2TXtPDizQwtDM5gNBckPHiGMFEZkIoF4fOJXqZ_C10bSEZn_EtM-u7KKQQLAX_JfZOJPmQzr5m4I-fpoaLHMuGk8wChObqo7ZbaQpypqV7msw1WScyHoHCYi0-7EU5DAOSiVariW2")',
                    backgroundColor: '#1c2620'
                  }}
                ></div>
                <span className="text-sm font-medium text-white hidden sm:block">{user?.name || 'Admin'}</span>
                <span className={`material-symbols-outlined text-gray-400 text-[18px] hidden sm:block transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}>expand_more</span>
              </button>
              
              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-surface-dark rounded-xl border border-white/10 shadow-lg z-50 overflow-hidden">
                  <div className="py-1">
                    <div className="px-4 py-3 border-b border-white/5">
                      <p className="text-sm font-bold text-white">{user?.name || 'Admin'}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{user?.email || ''}</p>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left text-sm text-white hover:bg-white/5 transition-colors flex items-center gap-3"
                    >
                      <span className="material-symbols-outlined text-lg">logout</span>
                      <span>Log out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <Loader />
            </div>
          ) : (
          <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
            {/* Page Heading */}
            <div className="flex flex-col gap-2">
              <h1 className="text-dashboard-text-main dark:text-white text-3xl font-bold tracking-tight">Admin Overview</h1>
              <p className="text-dashboard-text-muted dark:text-gray-400 text-sm">Welcome back. Here is what needs your attention today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Users */}
                <div className="flex flex-col gap-4 rounded-[2rem] p-6 bg-white dark:bg-surface-dark border border-dashboard-border dark:border-surface-highlight hover:border-dashboard-primary/30 dark:hover:border-primary/30 transition-colors group shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-gray-400 text-sm font-medium">Total Users</p>
                    <span className="material-symbols-outlined text-gray-500 group-hover:text-primary transition-colors">group</span>
                  </div>
                  <div>
                    <p className="text-dashboard-text-main dark:text-white text-3xl font-bold">
                      {dashboardStats?.totalUsers?.toLocaleString() || '0'}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      {dashboardStats?.usersGrowth > 0 && (
                        <span className="material-symbols-outlined text-primary text-sm">trending_up</span>
                      )}
                      {dashboardStats?.usersGrowth < 0 && (
                        <span className="material-symbols-outlined text-red-400 text-sm">trending_down</span>
                      )}
                      <p className={`text-xs font-bold ${dashboardStats?.usersGrowth >= 0 ? 'text-primary' : 'text-red-400'}`}>
                        {dashboardStats?.usersGrowth >= 0 ? '+' : ''}{dashboardStats?.usersGrowth || 0}% 
                        <span className="text-gray-500 font-normal ml-1">from last month</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Pending Clubs */}
                <div className="flex flex-col gap-4 rounded-[2rem] p-6 bg-surface-dark border border-surface-highlight hover:border-primary/30 transition-colors group relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 w-20 h-20 bg-primary/10 rounded-full blur-xl group-hover:bg-primary/20 transition-all"></div>
                  <div className="flex items-center justify-between relative z-10">
                    <p className="text-gray-400 text-sm font-medium">Pending Clubs</p>
                    <span className="material-symbols-outlined text-white bg-primary/20 p-1 rounded-full text-[18px]">priority_high</span>
                  </div>
                  <div className="relative z-10">
                    <p className="text-dashboard-text-main dark:text-white text-3xl font-bold">{dashboardStats?.pendingClubs || 0}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {dashboardStats?.pendingClubsNew > 0 && (
                        <p className="text-primary text-xs font-bold">
                          +{dashboardStats.pendingClubsNew} <span className="text-gray-500 font-normal ml-1">since yesterday</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Total Revenue */}
                <div className="flex flex-col gap-4 rounded-[2rem] p-6 bg-white dark:bg-surface-dark border border-dashboard-border dark:border-surface-highlight hover:border-dashboard-primary/30 dark:hover:border-primary/30 transition-colors group shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-gray-400 text-sm font-medium">Total Revenue</p>
                    <span className="material-symbols-outlined text-gray-500 group-hover:text-primary transition-colors">payments</span>
                  </div>
                  <div>
                    <p className="text-dashboard-text-main dark:text-white text-3xl font-bold">
                      ৳{dashboardStats?.totalRevenue?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      {dashboardStats?.revenueGrowth > 0 && (
                        <span className="material-symbols-outlined text-primary text-sm">trending_up</span>
                      )}
                      {dashboardStats?.revenueGrowth < 0 && (
                        <span className="material-symbols-outlined text-red-400 text-sm">trending_down</span>
                      )}
                      <p className={`text-xs font-bold ${dashboardStats?.revenueGrowth >= 0 ? 'text-primary' : 'text-red-400'}`}>
                        {dashboardStats?.revenueGrowth >= 0 ? '+' : ''}{dashboardStats?.revenueGrowth || 0}% 
                        <span className="text-gray-500 font-normal ml-1">growth</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Active Events */}
                <div className="flex flex-col gap-4 rounded-[2rem] p-6 bg-white dark:bg-surface-dark border border-dashboard-border dark:border-surface-highlight hover:border-dashboard-primary/30 dark:hover:border-primary/30 transition-colors group shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-gray-400 text-sm font-medium">Active Events</p>
                    <span className="material-symbols-outlined text-gray-500 group-hover:text-primary transition-colors">event_available</span>
                  </div>
                  <div>
                    <p className="text-dashboard-text-main dark:text-white text-3xl font-bold">{dashboardStats?.activeEvents || 0}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <p className="text-primary text-xs font-bold">Upcoming events</p>
                    </div>
                  </div>
                </div>
              </div>

            {/* Main Grid Layout for Chart & Tables */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Chart Section */}
              <div className="xl:col-span-2 flex flex-col gap-4 p-6 rounded-[2rem] bg-surface-dark border border-surface-highlight">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-white text-lg font-bold">Monthly Revenue</p>
                    <p className="text-gray-400 text-sm">Income from memberships and event fees</p>
                  </div>
                  <div className="flex items-center gap-2 bg-background-dark rounded-full p-1 border border-surface-highlight">
                    <button 
                      onClick={() => setChartPeriod(6)}
                      className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm transition-colors ${
                        chartPeriod === 6 
                          ? 'bg-surface-highlight text-white' 
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      6 Months
                    </button>
                    <button 
                      onClick={() => setChartPeriod(12)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        chartPeriod === 12 
                          ? 'bg-surface-highlight text-white font-bold shadow-sm' 
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      1 Year
                    </button>
                  </div>
                </div>
                <div className="relative h-64 w-full mt-4">
                  {monthlyRevenueLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader />
                    </div>
                  ) : monthlyRevenue.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <p>No revenue data available</p>
                    </div>
                  ) : (
                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 800 200">
                      <defs>
                        <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#38e07b" stopOpacity="0.2"></stop>
                          <stop offset="100%" stopColor="#38e07b" stopOpacity="0"></stop>
                        </linearGradient>
                      </defs>
                      {/* Grid lines */}
                      <line stroke="#2a4034" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="800" y1="0" y2="0"></line>
                      <line stroke="#2a4034" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="800" y1="50" y2="50"></line>
                      <line stroke="#2a4034" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="800" y1="100" y2="100"></line>
                      <line stroke="#2a4034" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="800" y1="150" y2="150"></line>
                      {/* Area fill */}
                      <path d={chartData.areaPath} fill="url(#chartGradient)"></path>
                      {/* Line */}
                      <path d={chartData.path} fill="none" stroke="#38e07b" strokeLinecap="round" strokeWidth="3" vectorEffect="non-scaling-stroke"></path>
                      {/* Data points */}
                      {chartData.points.map((point, index) => (
                        <circle 
                          key={index}
                          cx={point.x} 
                          cy={point.y} 
                          fill="#122017" 
                          r="4" 
                          stroke="#38e07b" 
                          strokeWidth="2"
                        ></circle>
                      ))}
                    </svg>
                  )}
                  <div className="flex justify-between mt-2 px-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {chartData.monthLabels.length > 0 ? (
                      chartData.monthLabels.map((month, index) => (
                        <span key={index}>{month}</span>
                      ))
                    ) : (
                      <>
                        <span>Jan</span>
                        <span>Feb</span>
                        <span>Mar</span>
                        <span>Apr</span>
                        <span>May</span>
                        <span>Jun</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Pending Approvals Section */}
              <div className="flex flex-col gap-4 p-6 rounded-[2rem] bg-surface-dark border border-surface-highlight">
                <div className="flex items-center justify-between">
                  <h3 className="text-white text-lg font-bold">Pending Approval and Delete</h3>
                  <Link to="/dashboard/admin/clubs?status=pending" className="text-primary text-xs font-bold hover:underline">
                    View All
                  </Link>
                </div>
                {(pendingClubs.length === 0 && deletionRequests.length === 0) ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-sm">No pending approvals</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {/* New Club Requests */}
                    {pendingClubs.map((club) => (
                      <div key={club.id} className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-background-dark border border-surface-highlight/50">
                        <div className="flex items-center gap-3">
                          <div 
                            className="size-10 rounded-full bg-cover bg-center bg-card-dark"
                            style={{ backgroundImage: club.image ? `url("${club.image}")` : 'none' }}
                          ></div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <p className="text-white text-sm font-bold">{club.name}</p>
                              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold">New</span>
                            </div>
                            <p className="text-gray-500 text-xs">
                              {club.category || 'General'} • {club.memberCount || 0} Members
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleRejectClub(club.id)}
                            disabled={rejectClubMutation.isPending}
                            className="size-8 flex items-center justify-center rounded-full bg-surface-highlight text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-50" 
                            title="Reject"
                          >
                            <span className="material-symbols-outlined text-[18px]">close</span>
                          </button>
                          <button 
                            onClick={() => handleApproveClub(club.id)}
                            disabled={approveClubMutation.isPending}
                            className="size-8 flex items-center justify-center rounded-full bg-primary text-background-dark hover:bg-white transition-colors shadow-lg shadow-primary/20 disabled:opacity-50" 
                            title="Approve"
                          >
                            <span className="material-symbols-outlined text-[18px]">check</span>
                          </button>
                        </div>
                      </div>
                    ))}
                    {/* Deletion Requests */}
                    {deletionRequests.map((club) => (
                      <div key={club.id} className="flex items-center gap-3">
                        <div className="flex flex-1 items-center justify-between gap-3 p-3 rounded-2xl bg-background-dark border border-red-500/30">
                          <div className="flex items-center gap-3">
                            <div 
                              className="size-10 rounded-full bg-cover bg-center bg-card-dark"
                              style={{ backgroundImage: club.image ? `url("${club.image}")` : 'none' }}
                            ></div>
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <p className="text-white text-sm font-bold">{club.name}</p>
                                <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs font-bold">Delete</span>
                              </div>
                              <p className="text-gray-500 text-xs">
                                Requested by {club.deletionRequest?.requestedBy || 'Manager'} • {club.deletionRequest?.requestedAt || 'Recently'}
                              </p>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleRejectDeletion(club.id)}
                            disabled={rejectDeletionMutation.isPending}
                            className="size-8 flex items-center justify-center rounded-full bg-surface-highlight text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10 transition-colors disabled:opacity-50" 
                            title="Reject Deletion"
                          >
                            <span className="material-symbols-outlined text-[18px]">close</span>
                          </button>
                        </div>
                        <button 
                          onClick={() => handleApproveDeletion(club.id)}
                          disabled={approveDeletionMutation.isPending}
                          className="size-10 flex items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20 disabled:opacity-50 flex-shrink-0" 
                          title="Approve Deletion"
                        >
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Transactions Table */}
            <div className="flex flex-col xl:flex-row gap-6 mb-8">
              <div className="flex-1 flex flex-col rounded-[2rem] bg-surface-dark border border-surface-highlight overflow-hidden">
                <div className="flex items-center justify-between p-6 pb-4">
                  <h3 className="text-white text-lg font-bold">Recent Transactions</h3>
                  <Link to="/dashboard/admin/finances" className="flex items-center gap-1 text-gray-400 hover:text-white text-xs font-medium transition-colors">
                    View All <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>
                <div className="overflow-x-auto w-full">
                    <table className="w-full text-left">
                      <thead className="bg-surface-highlight/30 text-gray-400 text-xs uppercase tracking-wider">
                        <tr>
                          <th className="px-6 py-3 font-medium">User</th>
                          <th className="px-6 py-3 font-medium">Type</th>
                          <th className="px-6 py-3 font-medium">Date</th>
                          <th className="px-6 py-3 font-medium text-right">Amount</th>
                          <th className="px-6 py-3 font-medium text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-highlight/50">
                        {transactions.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="px-6 py-8 text-center text-gray-500 text-sm">
                              No transactions found
                            </td>
                          </tr>
                        ) : (
                          transactions.map((transaction) => (
                            <tr key={transaction.id} className="hover:bg-surface-highlight/10 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                  {transaction.userPhotoURL ? (
                                    <div 
                                      className="size-8 rounded-full bg-cover bg-center"
                                      style={{ backgroundImage: `url("${transaction.userPhotoURL}")` }}
                                    ></div>
                                  ) : (
                                    <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                                      {transaction.userInitials || 'U'}
                                    </div>
                                  )}
                                  <span className="text-white text-sm font-medium">
                                    {transaction.userName || transaction.userEmail || 'Unknown User'}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-400 text-sm">{transaction.type || 'N/A'}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-400 text-sm">{transaction.date || 'N/A'}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-white text-sm font-bold text-right">{transaction.amount || '৳0.00'}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  transaction.status === 'paid' || transaction.status === 'Completed'
                                    ? 'bg-green-900/50 text-green-400 border border-green-800'
                                    : transaction.status === 'pending' || transaction.status === 'Processing'
                                    ? 'bg-yellow-900/30 text-yellow-500 border border-yellow-800'
                                    : 'bg-gray-900/50 text-gray-400 border border-gray-800'
                                }`}>
                                  {transaction.status === 'paid' ? 'Completed' : transaction.status === 'pending' ? 'Processing' : transaction.status || 'Pending'}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
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

export default AdminDashboard;


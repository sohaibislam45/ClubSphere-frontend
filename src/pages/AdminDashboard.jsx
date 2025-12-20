import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    document.title = 'Admin Dashboard - ClubSphere';
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

  const pendingClubs = [
    {
      id: 1,
      name: 'Peak Hikers',
      category: 'Outdoor',
      members: 12,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFZXXm8mPoSpgRR3W8yGSfqdRx_EdDIKL1ra9rSVDnruQ5Q2DsdWNiTJcIkcZhEzAKDefG1G5LFiVntvwRyeTzWmY5E2MM_-J91v-l78zv8EFOswWclN7w8cU7bDF_83HKUNtdhXFfkfctR1hu6Z2pHMEE0cC1cMh86t1wnZU7KtfsO_1aur1dYh8rK6crJdTXQbu62gqazl0gjg1krYvywkuAwIMhoDsVkFehn2Ot7_jvWBVT2YB8xXLkHh8VmVpOwsypqvybOf0b'
    },
    {
      id: 2,
      name: 'Grandmasters',
      category: 'Strategy',
      members: 5,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCCpRcvw_GVaQOT0aQVwV45QIFeXYAgR7cQ7-w00OzgjZ6_W0QKpNkQsoR6yNE8e9EvhRFvw05crCHhBbgv9uo8A9lBU0HdSD5D0ss7j_b6dHHiOoqCfVaPHRxEMet5ZY7og1OilDiF1njuQEOg4q353M0YBh1PrRuQYvuRCjoeO46p49akBKtTB_m-VlMdqqL19sYZWubovG-dCq3T9ey-bOcwexiWfhj1HAsWBIQcKt223ArphZ86Tw8MNZ4-KqaEMwDfuLnb3ytY'
    },
    {
      id: 3,
      name: 'Night Readers',
      category: 'Literature',
      members: 24,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByYAGsCP7_sICl8l8lq1CiEbm92kAgktlUMJIxhELhDZmLrswsCREHJQjXhzmCkmb5-3qS8fSyjuon8kbC2kEmeIdLKuiUAcY9CGwRMZJjTH9ARnHmxFwAa0PCntO2DQZUHnzGtwmOFIwtijrIo9mSr-UOL7cTjd-oqhD2UoFuNYytnI0RD4axZaFUe0P57RFNxRNyg80cr5BUEfeLSH0bOUrCYvxWhiv4ZqKygonunenjZm94W9Hoo4LeanW6Nc5MBwn23SDpw2RR'
    }
  ];

  const transactions = [
    {
      id: 1,
      userName: 'Sarah Jenkins',
      userImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMQRoeWUSepmmgcAb5P1-OSIDCkkI3eOaIp44JbTSutqR15SFU1DxGWbHGzG9uT-D5UD2I7vIs5JY4gEbE8T0NpA8PBCgFSRZqKfg4UauSed43gN26gRdMo8WUe1qwfFNd1DjIMEui8PxuN4TvOsulF2w2QypvofSZSCxlPo2XDXMkabCENL16nWMQCtMnRwR3PH1blfIqmO7MceORI76VXkeYf6iACaF7949y-OBTRkTn6sivOqWeMMZx9AR-URK6hnN36kq8xwRt',
      type: 'Club Membership',
      date: 'Oct 24, 2023',
      amount: '৳25.00',
      status: 'Completed'
    },
    {
      id: 2,
      userName: 'Mike Thompson',
      userImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCvF930ehAJEagQS44RjrMtXub1h9GiRCUdtu63eQmmWFDlGgHvXsRO6lbAjwIozQttr8n5ERDbTibJl1WfOSSuCl380NTYxl3qifUETyLkJj3dAOm3e87EgEDyKDH0jsa4x79p5nJq-fnqDeQuEG88WRqlPKbZD2a4M2w6AhyGN0ewCV2EwRKIzvgDKaaDzTMfnW7e4CLySX1RuJbpcXMglzaG8a5VMhPH5pnBtgzXz8SvZHfpz76rUwyJN8qmMqVSWd833nFa_pz',
      type: 'Event Ticket',
      date: 'Oct 23, 2023',
      amount: '৳15.00',
      status: 'Completed'
    },
    {
      id: 3,
      userName: 'Alex Rivera',
      userImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2GdXyox6nfdq4M4Dl0JZHycOK85Sc9J3bHCLCEaAz65Y5VpdckQTo03GIXG7IRHrS8sM0leL4L21RH44e2dSU9218c3bV7-nvMEQ6YnBHsMibPAhX3mmiSqVW3kE2WyRHEPFEj6b7oEb4sqM_c2V0h6ZKFAQwHgZLqy7VSL5nQ1_T0X1Z_ITxUEgqmviWgoVhvrs4YIQ09TpCwKfAvBcyb0C_dMbZZHRPaaQAvjbHgtSER802KnaAy4N6kyI_hCpz4UkdDDxeuCBc',
      type: 'Donation',
      date: 'Oct 21, 2023',
      amount: '৳50.00',
      status: 'Processing'
    }
  ];

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
            <Link to="/dashboard/admin" className={`flex items-center gap-3 px-3 py-3 rounded-full transition-colors ${location.pathname === '/dashboard/admin' ? 'bg-primary text-background-dark' : 'text-gray-400 hover:bg-surface-highlight hover:text-white'}`}>
              <span className="material-symbols-outlined">dashboard</span>
              <p className={`text-sm leading-normal hidden lg:block ${location.pathname === '/dashboard/admin' ? 'font-bold' : 'font-medium'}`}>Dashboard</p>
            </Link>
            <Link to="/dashboard/admin/users" className={`flex items-center gap-3 px-3 py-3 rounded-full transition-colors ${location.pathname === '/dashboard/admin/users' ? 'bg-primary text-background-dark' : 'text-gray-400 hover:bg-surface-highlight hover:text-white'}`}>
              <span className="material-symbols-outlined">group</span>
              <p className={`text-sm leading-normal hidden lg:block ${location.pathname === '/dashboard/admin/users' ? 'font-bold' : 'font-medium'}`}>Users</p>
            </Link>
            <Link to="/dashboard/admin/clubs" className={`flex items-center gap-3 px-3 py-3 rounded-full transition-colors ${location.pathname === '/dashboard/admin/clubs' ? 'bg-primary text-background-dark' : 'text-gray-400 hover:bg-surface-highlight hover:text-white'}`}>
              <span className="material-symbols-outlined">diversity_3</span>
              <p className={`text-sm leading-normal hidden lg:block ${location.pathname === '/dashboard/admin/clubs' ? 'font-bold' : 'font-medium'}`}>Clubs</p>
            </Link>
            <Link to="/dashboard/admin/events" className={`flex items-center gap-3 px-3 py-3 rounded-full transition-colors ${location.pathname === '/dashboard/admin/events' ? 'bg-primary text-background-dark' : 'text-gray-400 hover:bg-surface-highlight hover:text-white'}`}>
              <span className="material-symbols-outlined">calendar_today</span>
              <p className={`text-sm leading-normal hidden lg:block ${location.pathname === '/dashboard/admin/events' ? 'font-bold' : 'font-medium'}`}>Events</p>
            </Link>
            <Link to="/dashboard/admin/finances" className={`flex items-center gap-3 px-3 py-3 rounded-full transition-colors ${location.pathname === '/dashboard/admin/finances' ? 'bg-primary text-background-dark' : 'text-gray-400 hover:bg-surface-highlight hover:text-white'}`}>
              <span className="material-symbols-outlined">payments</span>
              <p className={`text-sm leading-normal hidden lg:block ${location.pathname === '/dashboard/admin/finances' ? 'font-bold' : 'font-medium'}`}>Finances</p>
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
        {/* Top Bar */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-surface-highlight px-6 py-4 bg-background-dark/50 backdrop-blur-md z-10">
          <div className="flex items-center gap-8 w-full max-w-2xl">
            <h2 className="text-white text-xl font-bold leading-tight hidden md:block">Admin Console</h2>
            {/* Search Bar */}
            <label className="flex flex-col w-full max-w-md h-11">
              <div className="flex w-full flex-1 items-center rounded-full bg-surface-dark border border-transparent focus-within:border-primary/50 transition-colors px-4">
                <span className="material-symbols-outlined text-gray-400">search</span>
                <input 
                  className="w-full bg-transparent border-none text-white placeholder-gray-500 focus:ring-0 text-sm font-normal ml-2" 
                  placeholder="Search users, clubs, or events..." 
                />
              </div>
            </label>
          </div>
          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button className="flex items-center justify-center size-10 rounded-full bg-surface-dark hover:bg-surface-highlight text-white transition-colors relative">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-2 right-2 size-2 bg-primary rounded-full border border-surface-dark"></span>
            </button>
            <div className="h-8 w-px bg-surface-highlight mx-1"></div>
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
          <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
            {/* Page Heading */}
            <div className="flex flex-col gap-2">
              <h1 className="text-white text-3xl font-bold tracking-tight">Admin Overview</h1>
              <p className="text-gray-400 text-sm">Welcome back. Here is what needs your attention today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Users */}
              <div className="flex flex-col gap-4 rounded-[2rem] p-6 bg-surface-dark border border-surface-highlight hover:border-primary/30 transition-colors group">
                <div className="flex items-center justify-between">
                  <p className="text-gray-400 text-sm font-medium">Total Users</p>
                  <span className="material-symbols-outlined text-gray-500 group-hover:text-primary transition-colors">group</span>
                </div>
                <div>
                  <p className="text-white text-3xl font-bold">1,240</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-primary text-sm">trending_up</span>
                    <p className="text-primary text-xs font-bold">+12% <span className="text-gray-500 font-normal ml-1">from last month</span></p>
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
                  <p className="text-white text-3xl font-bold">5</p>
                  <div className="flex items-center gap-1 mt-1">
                    <p className="text-primary text-xs font-bold">+2 <span className="text-gray-500 font-normal ml-1">since yesterday</span></p>
                  </div>
                </div>
              </div>

              {/* Total Revenue */}
              <div className="flex flex-col gap-4 rounded-[2rem] p-6 bg-surface-dark border border-surface-highlight hover:border-primary/30 transition-colors group">
                <div className="flex items-center justify-between">
                  <p className="text-gray-400 text-sm font-medium">Total Revenue</p>
                  <span className="material-symbols-outlined text-gray-500 group-hover:text-primary transition-colors">payments</span>
                </div>
                <div>
                  <p className="text-white text-3xl font-bold">৳12,450</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-primary text-sm">trending_up</span>
                    <p className="text-primary text-xs font-bold">+8% <span className="text-gray-500 font-normal ml-1">growth</span></p>
                  </div>
                </div>
              </div>

              {/* Active Events */}
              <div className="flex flex-col gap-4 rounded-[2rem] p-6 bg-surface-dark border border-surface-highlight hover:border-primary/30 transition-colors group">
                <div className="flex items-center justify-between">
                  <p className="text-gray-400 text-sm font-medium">Active Events</p>
                  <span className="material-symbols-outlined text-gray-500 group-hover:text-primary transition-colors">event_available</span>
                </div>
                <div>
                  <p className="text-white text-3xl font-bold">34</p>
                  <div className="flex items-center gap-1 mt-1">
                    <p className="text-primary text-xs font-bold">+5% <span className="text-gray-500 font-normal ml-1">engagement</span></p>
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
                    <button className="px-3 py-1 rounded-full bg-surface-highlight text-white text-xs font-bold shadow-sm">6 Months</button>
                    <button className="px-3 py-1 rounded-full text-gray-400 hover:text-white text-xs font-medium transition-colors">1 Year</button>
                  </div>
                </div>
                <div className="relative h-64 w-full mt-4">
                  <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 800 200">
                    <defs>
                      <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#38e07b" stopOpacity="0.2"></stop>
                        <stop offset="100%" stopColor="#38e07b" stopOpacity="0"></stop>
                      </linearGradient>
                    </defs>
                    <line stroke="#2a4034" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="800" y1="0" y2="0"></line>
                    <line stroke="#2a4034" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="800" y1="50" y2="50"></line>
                    <line stroke="#2a4034" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="800" y1="100" y2="100"></line>
                    <line stroke="#2a4034" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="800" y1="150" y2="150"></line>
                    <path d="M0,150 C50,140 100,160 150,120 C200,80 250,90 300,70 C350,50 400,60 450,40 C500,20 550,30 600,20 C650,10 700,5 800,0 V200 H0 Z" fill="url(#chartGradient)"></path>
                    <path d="M0,150 C50,140 100,160 150,120 C200,80 250,90 300,70 C350,50 400,60 450,40 C500,20 550,30 600,20 C650,10 700,5 800,0" fill="none" stroke="#38e07b" strokeLinecap="round" strokeWidth="3" vectorEffect="non-scaling-stroke"></path>
                    <circle cx="150" cy="120" fill="#122017" r="4" stroke="#38e07b" strokeWidth="2"></circle>
                    <circle cx="300" cy="70" fill="#122017" r="4" stroke="#38e07b" strokeWidth="2"></circle>
                    <circle cx="450" cy="40" fill="#122017" r="4" stroke="#38e07b" strokeWidth="2"></circle>
                    <circle cx="600" cy="20" fill="#122017" r="4" stroke="#38e07b" strokeWidth="2"></circle>
                  </svg>
                  <div className="flex justify-between mt-2 px-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span>Apr</span>
                    <span>May</span>
                    <span>Jun</span>
                  </div>
                </div>
              </div>

              {/* Pending Clubs Section */}
              <div className="flex flex-col gap-4 p-6 rounded-[2rem] bg-surface-dark border border-surface-highlight">
                <div className="flex items-center justify-between">
                  <h3 className="text-white text-lg font-bold">Pending Approvals</h3>
                  <a className="text-primary text-xs font-bold hover:underline" href="#">View All</a>
                </div>
                {pendingClubs.map((club) => (
                  <div key={club.id} className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-background-dark border border-surface-highlight/50">
                    <div className="flex items-center gap-3">
                      <div 
                        className="size-10 rounded-full bg-cover bg-center"
                        style={{ backgroundImage: `url("${club.image}")` }}
                      ></div>
                      <div className="flex flex-col">
                        <p className="text-white text-sm font-bold">{club.name}</p>
                        <p className="text-gray-500 text-xs">{club.category} • {club.members} Members</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="size-8 flex items-center justify-center rounded-full bg-surface-highlight text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors" title="Reject">
                        <span className="material-symbols-outlined text-[18px]">close</span>
                      </button>
                      <button className="size-8 flex items-center justify-center rounded-full bg-primary text-background-dark hover:bg-white transition-colors shadow-lg shadow-primary/20" title="Approve">
                        <span className="material-symbols-outlined text-[18px]">check</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Transactions Table */}
            <div className="flex flex-col xl:flex-row gap-6 mb-8">
              <div className="flex-1 flex flex-col rounded-[2rem] bg-surface-dark border border-surface-highlight overflow-hidden">
                <div className="flex items-center justify-between p-6 pb-4">
                  <h3 className="text-white text-lg font-bold">Recent Transactions</h3>
                  <button className="flex items-center gap-1 text-gray-400 hover:text-white text-xs font-medium transition-colors">
                    Filter <span className="material-symbols-outlined text-[16px]">filter_list</span>
                  </button>
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
                      {transactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-surface-highlight/10 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div 
                                className="size-8 rounded-full bg-cover bg-center"
                                style={{ backgroundImage: `url("${transaction.userImage}")` }}
                              ></div>
                              <span className="text-white text-sm font-medium">{transaction.userName}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-400 text-sm">{transaction.type}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-400 text-sm">{transaction.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-white text-sm font-bold text-right">{transaction.amount}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              transaction.status === 'Completed' 
                                ? 'bg-green-900/50 text-green-400 border border-green-800'
                                : 'bg-yellow-900/30 text-yellow-500 border border-yellow-800'
                            }`}>
                              {transaction.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;


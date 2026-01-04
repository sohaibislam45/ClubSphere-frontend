import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const MemberSidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/dashboard/member') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-72 h-full hidden lg:flex flex-col bg-dashboard-sidebar dark:bg-background-dark border-r border-dashboard-border dark:border-gray-800 shrink-0 z-20 shadow-sm">
      <div className="p-6 pb-2">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12 shadow-md" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB5LCxjhrUt6Jpz3hHKQPLaPxgOP3bRdvA9gttj2HqJZJ9C5wpALxSC9KqgstOWlPZk6-5q_oc6APsj9SswCmt4ncO9vbBoWQmUYcizUNdMOUhcToufVOnHtPqxjdhzUZqxNi_XO9xx9HVrK3HY4uQcGwjteZFf8FA2BPA_D2QRKmKjtsIirhdvuCg0t8ss46Hz4ClD8U-q1JLsuRZHr2Uvjlbl-1xM4dTFIbKWL-4baVXgL-_2ZpGZHowWVY7t3a9SwOr8yS-D1SP-")' }}></div>
          <div className="flex flex-col">
            <h1 className="text-dashboard-text-main dark:text-white text-xl font-bold leading-tight tracking-tight">ClubSphere</h1>
            <p className="text-dashboard-primary dark:text-primary text-xs font-medium tracking-wide uppercase opacity-90">Member Portal</p>
          </div>
        </div>
        <nav className="flex flex-col gap-2">
          <Link 
            to="/" 
            className={`flex items-center gap-4 px-4 py-3 rounded-full hover:bg-dashboard-surface-hover dark:hover:bg-surface-dark-hover group transition-all text-dashboard-text-muted dark:text-gray-400 hover:text-dashboard-text-main dark:hover:text-white`}
          >
            <span className="material-symbols-outlined">home</span>
            <span className="font-medium">Home</span>
          </Link>
          <Link 
            to="/dashboard/member" 
            className={`flex items-center gap-4 px-4 py-3 rounded-full transition-all group ${
              isActive('/dashboard/member') && location.pathname === '/dashboard/member'
                ? 'bg-dashboard-primary/10 dark:bg-primary/20 border border-dashboard-primary/20 dark:border-primary/30'
                : 'hover:bg-dashboard-surface-hover dark:hover:bg-surface-dark-hover text-dashboard-text-muted dark:text-gray-400 hover:text-dashboard-text-main dark:hover:text-white'
            }`}
          >
            <span className={`material-symbols-outlined ${isActive('/dashboard/member') && location.pathname === '/dashboard/member' ? 'text-dashboard-primary dark:text-primary fill' : ''} transition-colors`}>
              dashboard
            </span>
            <span className={`${isActive('/dashboard/member') && location.pathname === '/dashboard/member' ? 'text-dashboard-primary dark:text-primary font-bold' : 'font-medium'}`}>Overview</span>
          </Link>
          <Link 
            to="/dashboard/member/discover" 
            className={`flex items-center gap-4 px-4 py-3 rounded-full transition-all group ${
              isActive('/dashboard/member/discover')
                ? 'bg-dashboard-primary/10 dark:bg-primary/20 border border-dashboard-primary/20 dark:border-primary/30'
                : 'hover:bg-dashboard-surface-hover dark:hover:bg-surface-dark-hover text-dashboard-text-muted dark:text-gray-400 hover:text-dashboard-text-main dark:hover:text-white'
            }`}
          >
            <span className={`material-symbols-outlined ${isActive('/dashboard/member/discover') ? 'text-dashboard-primary dark:text-primary fill' : ''} transition-colors`}>
              explore
            </span>
            <span className={`${isActive('/dashboard/member/discover') ? 'text-dashboard-primary dark:text-primary font-bold' : 'font-medium'}`}>Discover</span>
          </Link>
          <Link 
            to="/dashboard/member/clubs" 
            className={`flex items-center gap-4 px-4 py-3 rounded-full transition-all group ${
              isActive('/dashboard/member/clubs')
                ? 'bg-dashboard-primary/10 dark:bg-primary/20 border border-dashboard-primary/20 dark:border-primary/30'
                : 'hover:bg-dashboard-surface-hover dark:hover:bg-surface-dark-hover text-dashboard-text-muted dark:text-gray-400 hover:text-dashboard-text-main dark:hover:text-white'
            }`}
          >
            <span className={`material-symbols-outlined ${isActive('/dashboard/member/clubs') ? 'text-dashboard-primary dark:text-primary fill' : ''} transition-colors`}>
              groups
            </span>
            <span className={`${isActive('/dashboard/member/clubs') ? 'text-dashboard-primary dark:text-primary font-bold' : 'font-medium'}`}>My Clubs</span>
          </Link>
          <Link 
            to="/dashboard/member/events" 
            className={`flex items-center gap-4 px-4 py-3 rounded-full transition-all group ${
              isActive('/dashboard/member/events')
                ? 'bg-dashboard-primary/10 dark:bg-primary/20 border border-dashboard-primary/20 dark:border-primary/30'
                : 'hover:bg-dashboard-surface-hover dark:hover:bg-surface-dark-hover text-dashboard-text-muted dark:text-gray-400 hover:text-dashboard-text-main dark:hover:text-white'
            }`}
          >
            <span className={`material-symbols-outlined ${isActive('/dashboard/member/events') ? 'text-dashboard-primary dark:text-primary fill' : ''} transition-colors`}>
              calendar_month
            </span>
            <span className={`${isActive('/dashboard/member/events') ? 'text-dashboard-primary dark:text-primary font-bold' : 'font-medium'}`}>My Events</span>
          </Link>
          <Link 
            to="/dashboard/member/payments" 
            className={`flex items-center gap-4 px-4 py-3 rounded-full transition-all group ${
              isActive('/dashboard/member/payments')
                ? 'bg-dashboard-primary/10 dark:bg-primary/20 border border-dashboard-primary/20 dark:border-primary/30'
                : 'hover:bg-dashboard-surface-hover dark:hover:bg-surface-dark-hover text-dashboard-text-muted dark:text-gray-400 hover:text-dashboard-text-main dark:hover:text-white'
            }`}
          >
            <span className={`material-symbols-outlined ${isActive('/dashboard/member/payments') ? 'text-dashboard-primary dark:text-primary fill' : ''} transition-colors`}>
              credit_card
            </span>
            <span className={`${isActive('/dashboard/member/payments') ? 'text-dashboard-primary dark:text-primary font-bold' : 'font-medium'}`}>Payments</span>
          </Link>
          <Link 
            to="/dashboard/member/settings" 
            className={`flex items-center gap-4 px-4 py-3 rounded-full transition-all group ${
              isActive('/dashboard/member/settings')
                ? 'bg-dashboard-primary/10 dark:bg-primary/20 border border-dashboard-primary/20 dark:border-primary/30'
                : 'hover:bg-dashboard-surface-hover dark:hover:bg-surface-dark-hover text-dashboard-text-muted dark:text-gray-400 hover:text-dashboard-text-main dark:hover:text-white'
            }`}
          >
            <span className={`material-symbols-outlined ${isActive('/dashboard/member/settings') ? 'text-dashboard-primary dark:text-primary fill' : ''} transition-colors`}>
              settings
            </span>
            <span className={`${isActive('/dashboard/member/settings') ? 'text-dashboard-primary dark:text-primary font-bold' : 'font-medium'}`}>Settings</span>
          </Link>
        </nav>
      </div>
      <div className="mt-auto p-6">
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-dashboard-border dark:border-gray-700 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-dashboard-primary/5 dark:from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <span className="material-symbols-outlined text-dashboard-primary dark:text-primary">support_agent</span>
              <p className="font-bold text-sm text-dashboard-text-main dark:text-white">Need Help?</p>
            </div>
            <p className="text-xs text-dashboard-text-muted dark:text-gray-400 mb-3">Contact support for membership questions.</p>
            <button className="text-xs font-bold text-dashboard-text-main dark:text-white bg-white dark:bg-surface-dark hover:bg-gray-100 dark:hover:bg-surface-dark-hover border border-dashboard-border dark:border-gray-700 px-3 py-2 rounded-lg w-full transition-colors shadow-sm">Contact Support</button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default MemberSidebar;

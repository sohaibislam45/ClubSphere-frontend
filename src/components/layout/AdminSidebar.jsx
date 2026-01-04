import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/dashboard/admin') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-72 h-full hidden lg:flex flex-col bg-dashboard-sidebar dark:bg-background-dark border-r border-dashboard-border dark:border-gray-800 shrink-0 z-20 shadow-sm">
      <div className="p-6 pb-2">
        <div className="flex items-center gap-4 mb-8">
          <div 
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12 shadow-md"
            style={{ 
              backgroundImage: user?.photoURL ? `url("${user.photoURL}")` : 'none',
              backgroundColor: '#1c2620'
            }}
          ></div>
          <div className="flex flex-col">
            <h1 className="text-dashboard-text-main dark:text-white text-xl font-bold leading-tight tracking-tight">ClubSphere</h1>
            <p className="text-dashboard-primary dark:text-primary text-xs font-medium tracking-wide uppercase opacity-90">Admin Portal</p>
          </div>
        </div>
        <nav className="flex flex-col gap-2">
          <Link 
            to="/" 
            className="flex items-center gap-4 px-4 py-3 rounded-full hover:bg-dashboard-surface-hover dark:hover:bg-surface-dark-hover group transition-all text-dashboard-text-muted dark:text-gray-400 hover:text-dashboard-text-main dark:hover:text-white"
          >
            <span className="material-symbols-outlined">home</span>
            <span className="font-medium">Home</span>
          </Link>
          <Link 
            to="/dashboard/admin" 
            className={`flex items-center gap-4 px-4 py-3 rounded-full transition-all group ${
              isActive('/dashboard/admin')
                ? 'bg-dashboard-primary/10 dark:bg-primary/20 border border-dashboard-primary/20 dark:border-primary/30'
                : 'hover:bg-dashboard-surface-hover dark:hover:bg-surface-dark-hover text-dashboard-text-muted dark:text-gray-400 hover:text-dashboard-text-main dark:hover:text-white'
            }`}
          >
            <span className={`material-symbols-outlined ${isActive('/dashboard/admin') ? 'text-dashboard-primary dark:text-primary fill' : ''} transition-colors`}>
              dashboard
            </span>
            <span className={`${isActive('/dashboard/admin') ? 'text-dashboard-primary dark:text-primary font-bold' : 'font-medium'}`}>Dashboard</span>
          </Link>
          <Link 
            to="/dashboard/admin/users" 
            className={`flex items-center gap-4 px-4 py-3 rounded-full transition-all group ${
              isActive('/dashboard/admin/users')
                ? 'bg-dashboard-primary/10 dark:bg-primary/20 border border-dashboard-primary/20 dark:border-primary/30'
                : 'hover:bg-dashboard-surface-hover dark:hover:bg-surface-dark-hover text-dashboard-text-muted dark:text-gray-400 hover:text-dashboard-text-main dark:hover:text-white'
            }`}
          >
            <span className={`material-symbols-outlined ${isActive('/dashboard/admin/users') ? 'text-dashboard-primary dark:text-primary fill' : ''} transition-colors`}>
              group
            </span>
            <span className={`${isActive('/dashboard/admin/users') ? 'text-dashboard-primary dark:text-primary font-bold' : 'font-medium'}`}>Users</span>
          </Link>
          <Link 
            to="/dashboard/admin/clubs" 
            className={`flex items-center gap-4 px-4 py-3 rounded-full transition-all group ${
              isActive('/dashboard/admin/clubs')
                ? 'bg-dashboard-primary/10 dark:bg-primary/20 border border-dashboard-primary/20 dark:border-primary/30'
                : 'hover:bg-dashboard-surface-hover dark:hover:bg-surface-dark-hover text-dashboard-text-muted dark:text-gray-400 hover:text-dashboard-text-main dark:hover:text-white'
            }`}
          >
            <span className={`material-symbols-outlined ${isActive('/dashboard/admin/clubs') ? 'text-dashboard-primary dark:text-primary fill' : ''} transition-colors`}>
              diversity_3
            </span>
            <span className={`${isActive('/dashboard/admin/clubs') ? 'text-dashboard-primary dark:text-primary font-bold' : 'font-medium'}`}>Clubs</span>
          </Link>
          <Link 
            to="/dashboard/admin/events" 
            className={`flex items-center gap-4 px-4 py-3 rounded-full transition-all group ${
              isActive('/dashboard/admin/events')
                ? 'bg-dashboard-primary/10 dark:bg-primary/20 border border-dashboard-primary/20 dark:border-primary/30'
                : 'hover:bg-dashboard-surface-hover dark:hover:bg-surface-dark-hover text-dashboard-text-muted dark:text-gray-400 hover:text-dashboard-text-main dark:hover:text-white'
            }`}
          >
            <span className={`material-symbols-outlined ${isActive('/dashboard/admin/events') ? 'text-dashboard-primary dark:text-primary fill' : ''} transition-colors`}>
              calendar_today
            </span>
            <span className={`${isActive('/dashboard/admin/events') ? 'text-dashboard-primary dark:text-primary font-bold' : 'font-medium'}`}>Events</span>
          </Link>
          <Link 
            to="/dashboard/admin/finances" 
            className={`flex items-center gap-4 px-4 py-3 rounded-full transition-all group ${
              isActive('/dashboard/admin/finances')
                ? 'bg-dashboard-primary/10 dark:bg-primary/20 border border-dashboard-primary/20 dark:border-primary/30'
                : 'hover:bg-dashboard-surface-hover dark:hover:bg-surface-dark-hover text-dashboard-text-muted dark:text-gray-400 hover:text-dashboard-text-main dark:hover:text-white'
            }`}
          >
            <span className={`material-symbols-outlined ${isActive('/dashboard/admin/finances') ? 'text-dashboard-primary dark:text-primary fill' : ''} transition-colors`}>
              payments
            </span>
            <span className={`${isActive('/dashboard/admin/finances') ? 'text-dashboard-primary dark:text-primary font-bold' : 'font-medium'}`}>Finances</span>
          </Link>
          <Link 
            to="/dashboard/admin/categories" 
            className={`flex items-center gap-4 px-4 py-3 rounded-full transition-all group ${
              isActive('/dashboard/admin/categories')
                ? 'bg-dashboard-primary/10 dark:bg-primary/20 border border-dashboard-primary/20 dark:border-primary/30'
                : 'hover:bg-dashboard-surface-hover dark:hover:bg-surface-dark-hover text-dashboard-text-muted dark:text-gray-400 hover:text-dashboard-text-main dark:hover:text-white'
            }`}
          >
            <span className={`material-symbols-outlined ${isActive('/dashboard/admin/categories') ? 'text-dashboard-primary dark:text-primary fill' : ''} transition-colors`}>
              category
            </span>
            <span className={`${isActive('/dashboard/admin/categories') ? 'text-dashboard-primary dark:text-primary font-bold' : 'font-medium'}`}>Categories</span>
          </Link>
        </nav>
      </div>
      <div className="mt-auto p-6">
        <button 
          onClick={logout}
          className="flex items-center gap-4 px-4 py-3 rounded-full hover:bg-dashboard-surface-hover dark:hover:bg-surface-dark-hover group transition-all text-dashboard-text-muted dark:text-gray-400 hover:text-dashboard-text-main dark:hover:text-white w-full"
        >
          <span className="material-symbols-outlined">settings</span>
          <span className="font-medium">Settings</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;


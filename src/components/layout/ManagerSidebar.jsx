import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ManagerSidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/dashboard/club-manager') {
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
            <p className="text-dashboard-primary dark:text-primary text-xs font-medium tracking-wide uppercase opacity-90">Manager Portal</p>
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
            to="/dashboard/club-manager" 
            className={`flex items-center gap-4 px-4 py-3 rounded-full transition-all group ${
              isActive('/dashboard/club-manager') && location.pathname === '/dashboard/club-manager'
                ? 'bg-dashboard-primary/10 dark:bg-primary/20 border border-dashboard-primary/20 dark:border-primary/30'
                : 'hover:bg-dashboard-surface-hover dark:hover:bg-surface-dark-hover text-dashboard-text-muted dark:text-gray-400 hover:text-dashboard-text-main dark:hover:text-white'
            }`}
          >
            <span className={`material-symbols-outlined ${isActive('/dashboard/club-manager') && location.pathname === '/dashboard/club-manager' ? 'text-dashboard-primary dark:text-primary fill' : ''} transition-colors`}>
              dashboard
            </span>
            <span className={`${isActive('/dashboard/club-manager') && location.pathname === '/dashboard/club-manager' ? 'text-dashboard-primary dark:text-primary font-bold' : 'font-medium'}`}>Dashboard</span>
          </Link>
          <Link 
            to="/dashboard/club-manager/clubs" 
            className={`flex items-center gap-4 px-4 py-3 rounded-full transition-all group ${
              location.pathname.startsWith('/dashboard/club-manager/clubs') && !location.pathname.includes('/members')
                ? 'bg-dashboard-primary/10 dark:bg-primary/20 border border-dashboard-primary/20 dark:border-primary/30'
                : 'hover:bg-dashboard-surface-hover dark:hover:bg-surface-dark-hover text-dashboard-text-muted dark:text-gray-400 hover:text-dashboard-text-main dark:hover:text-white'
            }`}
          >
            <span className={`material-symbols-outlined ${location.pathname.startsWith('/dashboard/club-manager/clubs') && !location.pathname.includes('/members') ? 'text-dashboard-primary dark:text-primary fill' : ''} transition-colors`}>
              groups
            </span>
            <span className={`${location.pathname.startsWith('/dashboard/club-manager/clubs') && !location.pathname.includes('/members') ? 'text-dashboard-primary dark:text-primary font-bold' : 'font-medium'}`}>My Clubs</span>
          </Link>
          <Link 
            to="/dashboard/club-manager/events" 
            className={`flex items-center gap-4 px-4 py-3 rounded-full transition-all group ${
              location.pathname.startsWith('/dashboard/club-manager/events') && !location.pathname.includes('/registrations')
                ? 'bg-dashboard-primary/10 dark:bg-primary/20 border border-dashboard-primary/20 dark:border-primary/30'
                : 'hover:bg-dashboard-surface-hover dark:hover:bg-surface-dark-hover text-dashboard-text-muted dark:text-gray-400 hover:text-dashboard-text-main dark:hover:text-white'
            }`}
          >
            <span className={`material-symbols-outlined ${location.pathname.startsWith('/dashboard/club-manager/events') && !location.pathname.includes('/registrations') ? 'text-dashboard-primary dark:text-primary fill' : ''} transition-colors`}>
              event
            </span>
            <span className={`${location.pathname.startsWith('/dashboard/club-manager/events') && !location.pathname.includes('/registrations') ? 'text-dashboard-primary dark:text-primary font-bold' : 'font-medium'}`}>Events Management</span>
          </Link>
          <Link 
            to="/dashboard/club-manager/members" 
            className={`flex items-center gap-4 px-4 py-3 rounded-full transition-all group ${
              location.pathname.includes('/members')
                ? 'bg-dashboard-primary/10 dark:bg-primary/20 border border-dashboard-primary/20 dark:border-primary/30'
                : 'hover:bg-dashboard-surface-hover dark:hover:bg-surface-dark-hover text-dashboard-text-muted dark:text-gray-400 hover:text-dashboard-text-main dark:hover:text-white'
            }`}
          >
            <span className={`material-symbols-outlined ${location.pathname.includes('/members') ? 'text-dashboard-primary dark:text-primary fill' : ''} transition-colors`}>
              person
            </span>
            <span className={`${location.pathname.includes('/members') ? 'text-dashboard-primary dark:text-primary font-bold' : 'font-medium'}`}>Club Members</span>
          </Link>
          <Link 
            to="/dashboard/club-manager/event-registrations" 
            className={`flex items-center gap-4 px-4 py-3 rounded-full transition-all group ${
              location.pathname.includes('/registrations') || location.pathname === '/dashboard/club-manager/event-registrations'
                ? 'bg-dashboard-primary/10 dark:bg-primary/20 border border-dashboard-primary/20 dark:border-primary/30'
                : 'hover:bg-dashboard-surface-hover dark:hover:bg-surface-dark-hover text-dashboard-text-muted dark:text-gray-400 hover:text-dashboard-text-main dark:hover:text-white'
            }`}
          >
            <span className={`material-symbols-outlined ${location.pathname.includes('/registrations') || location.pathname === '/dashboard/club-manager/event-registrations' ? 'text-dashboard-primary dark:text-primary fill' : ''} transition-colors`}>
              assignment_ind
            </span>
            <span className={`${location.pathname.includes('/registrations') || location.pathname === '/dashboard/club-manager/event-registrations' ? 'text-dashboard-primary dark:text-primary font-bold' : 'font-medium'}`}>Event Registrations</span>
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

export default ManagerSidebar;

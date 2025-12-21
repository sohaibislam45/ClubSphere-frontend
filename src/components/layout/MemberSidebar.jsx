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
    <aside className="w-64 flex-shrink-0 flex flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-background-dark h-screen sticky top-0">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={user?.name || 'User avatar'}
              className="rounded-full h-12 w-12 border-2 border-primary object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.target.style.display = 'none';
                const fallback = e.target.nextElementSibling;
                if (fallback) fallback.style.display = 'block';
              }}
            />
          ) : null}
          <div 
            className={`rounded-full h-12 w-12 border-2 border-primary bg-cover bg-center ${user?.photoURL ? 'hidden' : ''}`}
            style={{ 
              backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBmcPbzWrCtRb8C5fXJUYdnrR_q7lt4Y5WrO8RVZ6gqcFf4tEdBovRwBQ0EllYu-p-X3zcnOtCyB9xRXTGJd90EAYXdFxrHtxv_SiDSH5T2KYArzTJp8AUF8XYjfK_Q0xrz8KoPyovGeFl-sj3n9bYBnZOgFZVfqtbs3ANRL6Kej_EvjPcKQNx6rUv0bxJxwEpF4enGJjhsnGO2O9z0lxDnGgS8AyK1x1kdPoMDiNy_ysCrUusKH-CHbZONz1p1BI8othzLwbRmDM9g")',
              backgroundColor: '#1c2620'
            }}
          ></div>
          <div className="flex flex-col">
            <h1 className="text-base font-bold leading-tight text-gray-900 dark:text-white">{user?.name || 'Member'}</h1>
            <p className="text-gray-500 dark:text-gray-400 text-xs font-normal">Premium Member</p>
          </div>
        </div>
        <nav className="flex flex-col gap-2">
          <Link 
            to="/" 
            className={`flex items-center gap-3 px-4 py-3 rounded-full transition-colors group ${
              location.pathname === '/'
                ? 'bg-surface-dark text-white'
                : 'hover:bg-gray-100 dark:hover:bg-surface-dark-hover text-gray-700 dark:text-gray-300'
            }`}
          >
            <span className={`material-symbols-outlined ${location.pathname === '/' ? 'text-primary filled' : 'text-gray-500 dark:text-gray-400 group-hover:text-primary'} transition-colors`}>
              home
            </span>
            <span className={`text-sm ${location.pathname === '/' ? 'font-bold' : 'font-medium'}`}>Home</span>
          </Link>
          <Link 
            to="/dashboard/member" 
            className={`flex items-center gap-3 px-4 py-3 rounded-full transition-colors group ${
              isActive('/dashboard/member') && location.pathname === '/dashboard/member'
                ? 'bg-surface-dark text-white'
                : 'hover:bg-gray-100 dark:hover:bg-surface-dark-hover text-gray-700 dark:text-gray-300'
            }`}
          >
            <span className={`material-symbols-outlined ${isActive('/dashboard/member') && location.pathname === '/dashboard/member' ? 'text-primary filled' : 'text-gray-500 dark:text-gray-400 group-hover:text-primary'} transition-colors`}>
              dashboard
            </span>
            <span className="text-sm font-medium">Dashboard</span>
          </Link>
          <Link 
            to="/dashboard/member/discover" 
            className={`flex items-center gap-3 px-4 py-3 rounded-full transition-colors group ${
              isActive('/dashboard/member/discover')
                ? 'bg-surface-dark text-white'
                : 'hover:bg-gray-100 dark:hover:bg-surface-dark-hover text-gray-700 dark:text-gray-300'
            }`}
          >
            <span className={`material-symbols-outlined ${isActive('/dashboard/member/discover') ? 'text-primary filled' : 'text-gray-500 dark:text-gray-400 group-hover:text-primary'} transition-colors`}>
              explore
            </span>
            <span className={`text-sm ${isActive('/dashboard/member/discover') ? 'font-bold' : 'font-medium'}`}>Discover</span>
          </Link>
          <Link 
            to="/dashboard/member/clubs" 
            className={`flex items-center gap-3 px-4 py-3 rounded-full transition-colors group ${
              isActive('/dashboard/member/clubs')
                ? 'bg-surface-dark text-white'
                : 'hover:bg-gray-100 dark:hover:bg-surface-dark-hover text-gray-700 dark:text-gray-300'
            }`}
          >
            <span className={`material-symbols-outlined ${isActive('/dashboard/member/clubs') ? 'text-primary filled' : 'text-gray-500 dark:text-gray-400 group-hover:text-primary'} transition-colors`}>
              groups
            </span>
            <span className={`text-sm ${isActive('/dashboard/member/clubs') ? 'font-bold' : 'font-medium'}`}>My Clubs</span>
          </Link>
          <Link 
            to="/dashboard/member/events" 
            className={`flex items-center gap-3 px-4 py-3 rounded-full transition-colors group ${
              isActive('/dashboard/member/events')
                ? 'bg-surface-dark text-white'
                : 'hover:bg-gray-100 dark:hover:bg-surface-dark-hover text-gray-700 dark:text-gray-300'
            }`}
          >
            <span className={`material-symbols-outlined ${isActive('/dashboard/member/events') ? 'text-primary filled' : 'text-gray-500 dark:text-gray-400 group-hover:text-primary'} transition-colors`}>
              calendar_month
            </span>
            <span className={`text-sm ${isActive('/dashboard/member/events') ? 'font-bold' : 'font-medium'}`}>Events</span>
          </Link>
          <Link 
            to="/dashboard/member/payments" 
            className={`flex items-center gap-3 px-4 py-3 rounded-full transition-colors group ${
              isActive('/dashboard/member/payments')
                ? 'bg-surface-dark text-white'
                : 'hover:bg-gray-100 dark:hover:bg-surface-dark-hover text-gray-700 dark:text-gray-300'
            }`}
          >
            <span className={`material-symbols-outlined ${isActive('/dashboard/member/payments') ? 'text-primary filled' : 'text-gray-500 dark:text-gray-400 group-hover:text-primary'} transition-colors`}>
              receipt_long
            </span>
            <span className={`text-sm ${isActive('/dashboard/member/payments') ? 'font-bold' : 'font-medium'}`}>Payments</span>
          </Link>
          <Link 
            to="/dashboard/member/settings" 
            className={`flex items-center gap-3 px-4 py-3 rounded-full transition-colors group ${
              isActive('/dashboard/member/settings')
                ? 'bg-surface-dark text-white'
                : 'hover:bg-gray-100 dark:hover:bg-surface-dark-hover text-gray-700 dark:text-gray-300'
            }`}
          >
            <span className={`material-symbols-outlined ${isActive('/dashboard/member/settings') ? 'text-primary filled' : 'text-gray-500 dark:text-gray-400 group-hover:text-primary'} transition-colors`}>
              account_circle
            </span>
            <span className={`text-sm ${isActive('/dashboard/member/settings') ? 'font-bold' : 'font-medium'}`}>Settings</span>
          </Link>
        </nav>
      </div>
    </aside>
  );
};

export default MemberSidebar;


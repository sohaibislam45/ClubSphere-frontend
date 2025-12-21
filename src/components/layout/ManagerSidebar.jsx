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

  // Check if we're on clubs or members pages
  const isClubsOrMembersPage = location.pathname.startsWith('/dashboard/club-manager/clubs') || 
                                 location.pathname.startsWith('/dashboard/club-manager/members');

  return (
    <aside className="hidden lg:flex flex-col w-72 h-full border-r border-white/10 bg-background-light dark:bg-background-dark p-6">
      {/* Brand */}
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="size-10 rounded-full bg-primary flex items-center justify-center text-background-dark">
          <span className="material-symbols-outlined text-2xl">sports_tennis</span>
        </div>
        <div>
          <h1 className={`text-xl font-bold tracking-tight ${isClubsOrMembersPage ? 'text-white' : ''}`}>ClubSphere</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Manager Portal</p>
        </div>
      </div>
      {/* Profile Picture Section */}
      <div className="mb-6 px-2">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-white/10">
          <div className="relative">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user?.name || 'Club Manager avatar'}
                className="size-12 rounded-full object-cover border-2 border-primary/30"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.target.style.display = 'none';
                  const fallback = e.target.nextElementSibling;
                  if (fallback) fallback.style.display = 'block';
                }}
              />
            ) : null}
            <div 
              className={`size-12 rounded-full bg-cover bg-center border-2 border-primary/30 ${user?.photoURL ? 'hidden' : ''}`}
              style={{ 
                backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCNwpKexkQoH8Xkuy2O1snTYiTknRQAjz97o6b88t752G8E3mZsKh54V3DZ_VsjMZUyA-EJXBgxHeD0HT22VXYXzwHVG7L8Uj3zEbNVsHB09oa8P06qRUaHRmnwZ8KZAGdSlqki5uplSH3MlQaU3PJoUnp_8wh7eYGGsS-dQAGzTkocaoa5OwAOClkkS7P7D4JVRJZbjtNFileMLE7t9U5h5LGtmBiz2SooNzps4u3rJd83jA8JHm1820HEeZ-E_eXOPUAS0CKvh7k3")',
                backgroundColor: '#1c2620'
              }}
            ></div>
            <div className="absolute bottom-0 right-0 size-3 bg-primary rounded-full border-2 border-background-light dark:border-background-dark"></div>
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className={`text-sm font-semibold truncate ${isClubsOrMembersPage ? 'text-white' : ''}`}>{user?.name || 'Club Manager'}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email || 'manager@clubsphere.com'}</span>
          </div>
        </div>
      </div>
      {/* Navigation */}
      <nav className="flex flex-col gap-2 flex-1">
        <Link 
          to="/" 
          className="flex items-center gap-4 px-4 py-3 rounded-full text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5 font-medium transition-colors"
        >
          <span className="material-symbols-outlined">home</span>
          <span>Home</span>
        </Link>
        <Link 
          to="/dashboard/club-manager" 
          className={`flex items-center gap-4 px-4 py-3 rounded-full font-medium transition-colors ${
            isActive('/dashboard/club-manager') && location.pathname === '/dashboard/club-manager'
              ? 'bg-primary text-background-dark font-semibold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <span className="material-symbols-outlined">dashboard</span>
          <span>Dashboard</span>
        </Link>
        <Link 
          to="/dashboard/club-manager/clubs" 
          className={`flex items-center gap-4 px-4 py-3 rounded-full font-medium transition-colors ${
            location.pathname.startsWith('/dashboard/club-manager/clubs') && !location.pathname.includes('/members')
              ? 'bg-primary text-background-dark font-semibold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <span className="material-symbols-outlined">groups</span>
          <span>My Clubs</span>
        </Link>
        <Link 
          to="/dashboard/club-manager/events" 
          className={`flex items-center gap-4 px-4 py-3 rounded-full font-medium transition-colors ${
            location.pathname.startsWith('/dashboard/club-manager/events') && !location.pathname.includes('/registrations')
              ? 'bg-primary text-background-dark font-semibold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <span className="material-symbols-outlined">event</span>
          <span>Events Management</span>
        </Link>
        <Link 
          to="/dashboard/club-manager/members" 
          className={`flex items-center gap-4 px-4 py-3 rounded-full font-medium transition-colors ${
            location.pathname.includes('/members')
              ? 'bg-primary text-background-dark font-semibold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <span className="material-symbols-outlined">person</span>
          <span>Club Members</span>
        </Link>
        <Link 
          to="/dashboard/club-manager/event-registrations" 
          className={`flex items-center gap-4 px-4 py-3 rounded-full font-medium transition-colors ${
            location.pathname.includes('/registrations') || location.pathname === '/dashboard/club-manager/event-registrations'
              ? 'bg-primary text-background-dark font-semibold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <span className="material-symbols-outlined">assignment_ind</span>
          <span>Event Registrations</span>
        </Link>
        <div className="mt-auto"></div>
        <div className="pt-4 mt-4 border-t border-white/10 flex items-center gap-3 px-2">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={user?.name || 'Club Manager avatar'}
              className="size-10 rounded-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.target.style.display = 'none';
                const fallback = e.target.nextElementSibling;
                if (fallback) fallback.style.display = 'block';
              }}
            />
          ) : null}
          <div 
            className={`size-10 rounded-full bg-cover bg-center ${user?.photoURL ? 'hidden' : ''}`}
            style={{ 
              backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCNwpKexkQoH8Xkuy2O1snTYiTknRQAjz97o6b88t752G8E3mZsKh54V3DZ_VsjMZUyA-EJXBgxHeD0HT22VXYXzwHVG7L8Uj3zEbNVsHB09oa8P06qRUaHRmnwZ8KZAGdSlqki5uplSH3MlQaU3PJoUnp_8wh7eYGGsS-dQAGzTkocaoa5OwAOClkkS7P7D4JVRJZbjtNFileMLE7t9U5h5LGtmBiz2SooNzps4u3rJd83jA8JHm1820HEeZ-E_eXOPUAS0CKvh7k3")',
              backgroundColor: '#1c2620'
            }}
          ></div>
          <div className="flex flex-col">
            <span className={`text-sm font-semibold ${isClubsOrMembersPage ? 'text-white' : ''}`}>{user?.name || 'Club Manager'}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Club Manager</span>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default ManagerSidebar;


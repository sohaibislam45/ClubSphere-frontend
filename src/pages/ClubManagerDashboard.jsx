import { useAuth } from '../context/AuthContext';

const ClubManagerDashboard = () => {
  const { user, logout } = useAuth();

  const clubs = [
    {
      id: 1,
      name: 'Grandmaster Chess',
      description: 'Weekly strategic meetups',
      members: 450,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD69HVW9YOVekWCKFaw_ghZLxjJsKbYVUwwqnssqw5Lgc0NShYlTUHqyGMYmnrsoQadxLoLViDzQhy17116d41eHtUrmJXvvAxrNCWjEKSIra2_9jXOtkEPBY5-OGKiATXxmomY6GGkR5fao9nUqFnoJ5hk08HjWQXbg_uRef25oibGKoOz7iY7QtdxT7Jo7d0tINLE54c-_OFHl0YnK75BPihQO236IWO_xGA7It81ZC6tcxZ_fj5n4Co_84WUAo_6h1It9_KpZjxp'
    },
    {
      id: 2,
      name: 'Alpine Hikers',
      description: 'Outdoor adventures',
      members: 720,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqfKkfLU2bsKiagacUkK08ocKRyLzOogGWW7u64YGLp8qZ2KB8TyK4UShHC3jYqrmiEL0nhpyhCZQWvcVZlnfaX6DYenWxsjLsQsnVeVrJcBkyZyjj2kYa08YnVlq-xfV4AHwn6-cE357qJZgakY7_CAionwU9w--ajzqTNH2wMEIIgG6804m2zzWUDhyKE_TWGzIxIOoD3-aLHxZ9uzcPoovbPIQ-JGTk9y08r8gEkFRRB-mZKPcPK5umRScDb8RW2p-NE6W9KPUj'
    }
  ];

  const events = [
    {
      id: 1,
      name: 'Summer Chess Tournament',
      club: 'Grandmaster Chess',
      date: 'Aug 12, 2023',
      status: 'Published',
      statusColor: 'green'
    },
    {
      id: 2,
      name: 'Mountain Trail Basics',
      club: 'Alpine Hikers',
      date: 'Aug 15, 2023',
      status: 'Draft',
      statusColor: 'yellow'
    },
    {
      id: 3,
      name: 'End of Season Gala',
      club: 'All Clubs',
      date: 'Sep 01, 2023',
      status: 'Planning',
      statusColor: 'blue'
    }
  ];

  const activities = [
    {
      id: 1,
      user: 'Sarah M.',
      action: 'registered for',
      target: 'Summer Chess Tournament',
      time: '2 mins ago',
      isPrimary: true
    },
    {
      id: 2,
      user: 'James K.',
      action: 'joined',
      target: 'Alpine Hikers',
      time: '1 hour ago',
      isPrimary: false
    },
    {
      id: 3,
      user: 'Elena R.',
      action: 'payment received',
      amount: '$45.00',
      time: '3 hours ago',
      isPrimary: false
    },
    {
      id: 4,
      action: 'You updated',
      target: 'Mountain Trail Basics',
      time: 'Yesterday',
      isPrimary: false
    },
    {
      id: 5,
      user: 'Michael B.',
      action: 'left',
      target: 'Grandmaster Chess',
      time: 'Yesterday',
      isPrimary: false
    }
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white antialiased">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 h-full border-r border-white/10 bg-background-light dark:bg-background-dark p-6">
        {/* Brand */}
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="size-10 rounded-full bg-primary flex items-center justify-center text-background-dark">
            <span className="material-symbols-outlined text-2xl">sports_tennis</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">ClubSphere</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Manager Portal</p>
          </div>
        </div>
        {/* Navigation */}
        <nav className="flex flex-col gap-2 flex-1">
          <a className="flex items-center gap-4 px-4 py-3 rounded-full bg-primary text-background-dark font-semibold transition-colors" href="#">
            <span className="material-symbols-outlined">dashboard</span>
            <span>Dashboard</span>
          </a>
          <a className="flex items-center gap-4 px-4 py-3 rounded-full text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5 font-medium transition-colors" href="#">
            <span className="material-symbols-outlined">groups</span>
            <span>My Clubs</span>
          </a>
          <a className="flex items-center gap-4 px-4 py-3 rounded-full text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5 font-medium transition-colors" href="#">
            <span className="material-symbols-outlined">diversity_3</span>
            <span>Club Members</span>
          </a>
          <a className="flex items-center gap-4 px-4 py-3 rounded-full text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5 font-medium transition-colors" href="#">
            <span className="material-symbols-outlined">event</span>
            <span>Events Management</span>
          </a>
          <a className="flex items-center gap-4 px-4 py-3 rounded-full text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5 font-medium transition-colors" href="#">
            <span className="material-symbols-outlined">assignment_ind</span>
            <span>Event Registrations</span>
          </a>
          <div className="mt-auto"></div>
          <button 
            onClick={logout}
            className="flex items-center gap-4 px-4 py-3 rounded-full text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5 font-medium transition-colors"
          >
            <span className="material-symbols-outlined">settings</span>
            <span>Settings</span>
          </button>
          <div className="pt-4 mt-4 border-t border-white/10 flex items-center gap-3 px-2">
            <div 
              className="size-10 rounded-full bg-cover bg-center"
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCNwpKexkQoH8Xkuy2O1snTYiTknRQAjz97o6b88t752G8E3mZsKh54V3DZ_VsjMZUyA-EJXBgxHeD0HT22VXYXzwHVG7L8Uj3zEbNVsHB09oa8P06qRUaHRmnwZ8KZAGdSlqki5uplSH3MlQaU3PJoUnp_8wh7eYGGsS-dQAGzTkocaoa5OwAOClkkS7P7D4JVRJZbjtNFileMLE7t9U5h5LGtmBiz2SooNzps4u3rJd83jA8JHm1820HEeZ-E_eXOPUAS0CKvh7k3")' }}
            ></div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{user?.name || 'Club Manager'}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Club Manager</span>
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Header */}
        <header className="h-20 flex items-center justify-between px-8 py-4 border-b border-white/10 shrink-0 bg-background-light dark:bg-background-dark z-20">
          <div className="lg:hidden flex items-center gap-3 text-slate-900 dark:text-white">
            <button className="p-2"><span className="material-symbols-outlined">menu</span></button>
            <span className="font-bold text-lg">ClubSphere</span>
          </div>
          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-lg mx-auto">
            <div className="relative w-full group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors material-symbols-outlined">search</span>
              <input 
                className="w-full h-12 bg-white dark:bg-surface-dark border-none rounded-full pl-12 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-primary/50 transition-all shadow-sm" 
                placeholder="Search clubs, members, or events..." 
                type="text"
              />
            </div>
          </div>
          {/* Right Actions */}
          <div className="flex items-center gap-4 ml-auto pl-4">
            <button className="size-10 rounded-full bg-white dark:bg-surface-dark text-slate-600 dark:text-slate-300 hover:text-primary flex items-center justify-center transition-colors relative">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-2.5 right-2.5 size-2 bg-primary rounded-full border-2 border-surface-dark"></span>
            </button>
            <button className="hidden sm:flex h-10 px-4 rounded-full bg-primary hover:bg-green-400 text-background-dark font-bold text-sm items-center gap-2 transition-colors">
              <span className="material-symbols-outlined text-lg">add</span>
              <span>Create Event</span>
            </button>
          </div>
        </header>

        {/* Scrollable Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-8 pb-10">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 text-slate-900 dark:text-white">Welcome back, {user?.name?.split(' ')[0] || 'Manager'} 👋</h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-2xl">Here is the latest performance overview for your managed clubs and recent activity.</p>
              </div>
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Last updated: Today, 9:41 AM</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Stat Card 1 */}
              <div className="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-sm flex flex-col justify-between h-40 group hover:ring-1 hover:ring-primary/30 transition-all">
                <div className="flex justify-between items-start">
                  <div className="size-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <span className="material-symbols-outlined">flag</span>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/5 text-slate-400">Active</span>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Managed Clubs</p>
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white">3</h3>
                </div>
              </div>

              {/* Stat Card 2 */}
              <div className="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-sm flex flex-col justify-between h-40 group hover:ring-1 hover:ring-primary/30 transition-all">
                <div className="flex justify-between items-start">
                  <div className="size-10 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined">groups</span>
                  </div>
                  <div className="flex items-center gap-1 text-primary bg-primary/10 px-2 py-1 rounded-full text-xs font-bold">
                    <span className="material-symbols-outlined text-xs">trending_up</span>
                    <span>12%</span>
                  </div>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Total Members</p>
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white">1,240</h3>
                </div>
              </div>

              {/* Stat Card 3 */}
              <div className="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-sm flex flex-col justify-between h-40 group hover:ring-1 hover:ring-primary/30 transition-all">
                <div className="flex justify-between items-start">
                  <div className="size-10 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center">
                    <span className="material-symbols-outlined">calendar_month</span>
                  </div>
                  <div className="flex items-center gap-1 text-primary bg-primary/10 px-2 py-1 rounded-full text-xs font-bold">
                    <span className="material-symbols-outlined text-xs">add</span>
                    <span>2 New</span>
                  </div>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Events Created</p>
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white">12</h3>
                </div>
              </div>

              {/* Stat Card 4 */}
              <div className="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-sm flex flex-col justify-between h-40 group hover:ring-1 hover:ring-primary/30 transition-all">
                <div className="flex justify-between items-start">
                  <div className="size-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <span className="material-symbols-outlined">payments</span>
                  </div>
                  <div className="flex items-center gap-1 text-primary bg-primary/10 px-2 py-1 rounded-full text-xs font-bold">
                    <span className="material-symbols-outlined text-xs">trending_up</span>
                    <span>$500</span>
                  </div>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Total Revenue</p>
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white">$4,500</h3>
                </div>
              </div>
            </div>

            {/* Split Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Main Left Column */}
              <div className="xl:col-span-2 space-y-6">
                {/* Active Clubs Section */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Your Clubs</h3>
                    <button className="text-primary text-sm font-bold hover:underline">View All</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {clubs.map((club) => (
                      <div key={club.id} className="bg-white dark:bg-surface-dark rounded-xl p-4 flex gap-4 items-center group cursor-pointer hover:bg-white/5 border border-transparent hover:border-primary/20 transition-all">
                        <div 
                          className="size-20 rounded-lg bg-cover bg-center shrink-0"
                          style={{ backgroundImage: `url("${club.image}")` }}
                        ></div>
                        <div className="flex flex-col flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-lg text-slate-900 dark:text-white truncate">{club.name}</h4>
                            <span className="material-symbols-outlined text-slate-500 hover:text-primary transition-colors">more_horiz</span>
                          </div>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mb-2 truncate">{club.description}</p>
                          <div className="flex items-center gap-2">
                            <div className="flex -space-x-2">
                              <div className="size-6 rounded-full border-2 border-surface-dark bg-slate-500"></div>
                              <div className="size-6 rounded-full border-2 border-surface-dark bg-slate-600"></div>
                              <div className="size-6 rounded-full border-2 border-surface-dark bg-slate-700"></div>
                            </div>
                            <span className="text-xs font-medium text-slate-400">+{club.members} members</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <button className="md:col-span-2 rounded-xl border-2 border-dashed border-slate-700 hover:border-primary/50 text-slate-500 hover:text-primary p-4 flex items-center justify-center gap-2 min-h-[100px] transition-all group">
                      <div className="size-10 rounded-full bg-slate-800 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                        <span className="material-symbols-outlined">add</span>
                      </div>
                      <span className="font-bold">Create New Club</span>
                    </button>
                  </div>
                </div>

                {/* Upcoming Events Table */}
                <div className="bg-white dark:bg-surface-dark rounded-xl overflow-hidden shadow-sm">
                  <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Upcoming Events</h3>
                    <button className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-base">filter_list</span> Filter
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-black/5 dark:bg-black/20 text-xs uppercase text-slate-500">
                        <tr>
                          <th className="px-6 py-4 font-semibold tracking-wider">Event Name</th>
                          <th className="px-6 py-4 font-semibold tracking-wider">Club</th>
                          <th className="px-6 py-4 font-semibold tracking-wider">Date</th>
                          <th className="px-6 py-4 font-semibold tracking-wider">Status</th>
                          <th className="px-6 py-4 font-semibold tracking-wider text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-sm">
                        {events.map((event) => (
                          <tr key={event.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{event.name}</td>
                            <td className="px-6 py-4 text-slate-500">{event.club}</td>
                            <td className="px-6 py-4 text-slate-500">{event.date}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                event.statusColor === 'green' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                event.statusColor === 'yellow' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                                'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              }`}>
                                {event.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button className="text-slate-400 hover:text-white"><span className="material-symbols-outlined">edit</span></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right Column: Recent Activity Feed */}
              <div className="xl:col-span-1 space-y-6">
                <div className="bg-white dark:bg-surface-dark rounded-xl p-6 h-full shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Recent Activity</h3>
                  <div className="relative pl-4 border-l border-white/10 space-y-8">
                    {activities.map((activity) => (
                      <div key={activity.id} className="relative">
                        <div className={`absolute -left-[21px] top-1 size-3 rounded-full border-2 border-surface-dark ${
                          activity.isPrimary ? 'bg-primary' : 'bg-slate-600'
                        }`}></div>
                        <div className="flex flex-col gap-1">
                          <p className="text-sm text-slate-300">
                            {activity.user && <span className="font-bold text-white">{activity.user}</span>} {activity.action}{' '}
                            {activity.target && (
                              <span className={activity.action === 'registered for' ? 'text-primary hover:underline cursor-pointer' : 'font-medium text-white'}>
                                {activity.target}
                              </span>
                            )}
                            {activity.amount && (
                              <>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="px-2 py-0.5 rounded bg-white/5 text-xs text-slate-400 font-mono">{activity.amount}</span>
                                  <span className="text-xs text-green-400">Success</span>
                                </div>
                              </>
                            )}
                          </p>
                          <span className="text-xs text-slate-500">{activity.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-8 py-3 rounded-full border border-white/10 text-sm font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                    View Full History
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

export default ClubManagerDashboard;


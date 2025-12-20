import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MemberSidebar from '../components/layout/MemberSidebar';

const MemberDashboard = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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


  const events = [
    {
      id: 1,
      category: 'Tech Talk',
      title: 'Intro to React Native',
      host: 'Dev Society',
      time: '14:00 PM',
      date: 'TODAY',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfZiskjbGrJ4URbsZoYaUQ4ynLWOIzZLf0Vmkr3XVKCVXKA4J2pwMWAFzPRf1ZVJFB7-Kh2mSeYbCQCmfyRIwJXMnAZHiiepHOmK00a_LhHpNpeWHkc5giVd1vuCRCsJrpMMK7yfhHUzmZisOXkCMOFiIn4JVz6USkENPJfikH0EdLvUDZ3YLaAOkWKvvcgiosy7aonQu9Y2tWqczEzTOB7KBou-Fn9onOtotSugQzTFRLb-PvWsIWh_HtyEoQmjfw7Bn93DaWQzpk',
      attendees: 12
    },
    {
      id: 2,
      category: 'Wellness',
      title: 'Saturday Morning Yoga',
      host: 'Zen Circle',
      time: '09:00 AM',
      date: 'TOMORROW',
      location: 'Central Park, West Lawn',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSjzLcxCBFlja2svcUnsNlAu-ATSUZXwk7fLvq2F5qtFyAPGvEQcPItONXlhepBzrVjqU6I7s40Wtm6TntXlKC4co6lPslx9WZOHAxuV-A0E2dZ5MwfYVGAh_aN4cwO5CJ-Xvxmeywn-TOPBOtAA3yM6AF9uQi8iqY6ENOR6PaoMHQrDySm_ZIBoEfXjkOEysQdNwM4nQR9zOoGCUON5GNroXbhYqR2B_JZITOu7YbEFL4t4rit5PzXbuQWpKqkMfqUEI4BvO4aXKs'
    }
  ];

  const clubs = [
    {
      id: 1,
      name: 'Dev Society',
      joinedDate: 'Member since 2022',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpnRaEOzVcurvwzs4P1cqN86Spt6VnC1LsMqKE1kwPJwYzc2vXdAYSRiVMMkDB-0NZohODpsKyRpItRtZmTzUfiuCl1QF3SIHRKc7COHbIap8lUrY5b0mEyWhH9BTACTX5SiMWXiyv8_Wu1Mz_bQwgY6-NhXFjhUnrYI9t3UHBH4y1FZSrTPpzUhDnhed4K2NdKODrvFAw40yfqEtNNjZ5Cc9vmdIL5WcwKaboysKis9jhTZ5r0yhOKNWHh7QGJlwuxbs_k2gZ_uSM',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Zen Circle',
      joinedDate: 'Member since 2023',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB00wpinIBQXsPyuCfhP0EZBMpKS42Ep3Rug1Z73gQ8SU7UiwF26y4WbRWpK_XQ6TL-LQi3YgxfvNIRSJOfwM2K9J_BoHGfBqS1ycFOnzxh6oQahaHs3NIa5UcrQdWtnTKMMTjyQ-L5fRcpJExP7pKSYDwsdPAFIHDGNjQtL89Hl3KlYIoKXOcj-0LTUUR_lOtSTzJz9dFi1qP-cjLcEXVbv64lOZqcXP3E1-PaQAXL4V4azWgFzTb0FC_w34D0xgwDi-jtE9nUihtd',
      status: 'Active'
    },
    {
      id: 3,
      name: 'City Runners',
      joinedDate: 'Approval Pending',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9ay6LWNPzNoplv9e7BNj8nvzQQpAiNmxy0YP5bzYMyXqHkxsIMDBFhHr4x0OufIcSnRqy-VNlB98ghv-0uHo9O8KonLwxE5t_zJiuwcQQIkoZrJI-gGRp-vgQ7UxR8jRzsRn5pdBZH7l_Vu3crqfNGAbLGuzdnZkDvntCyC6XhL08uPAWc9uAkLcxd5Us8YbexLQWAp88KJwIPyXI-kB1hO6cMIgSWUqHkApsITE-1deo2tn8Xx6KF4URMinTWYniX2jalbRbsKeY',
      status: 'Pending'
    }
  ];

  const payments = [
    {
      id: 1,
      description: 'Annual Membership',
      icon: 'card_membership',
      club: 'Dev Society',
      date: 'Oct 25, 2023',
      amount: '$50.00',
      status: 'Paid'
    },
    {
      id: 2,
      description: 'Event Ticket: Annual Gala',
      icon: 'confirmation_number',
      club: 'Zen Circle',
      date: 'Oct 12, 2023',
      amount: '$25.00',
      status: 'Paid'
    }
  ];

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display overflow-hidden h-screen flex">
      <MemberSidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-background-light dark:bg-background-dark">
        {/* Top Navigation Bar */}
        <header className="h-20 shrink-0 border-b border-white/5 bg-background-dark/80 backdrop-blur-md z-10 sticky top-0 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4 lg:hidden">
            <button className="text-white">
              <span className="material-symbols-outlined">menu</span>
            </button>
            <h2 className="text-white text-lg font-bold">Dashboard</h2>
          </div>
          <div className="hidden lg:flex flex-col">
            <h2 className="text-white text-xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-gray-400 text-xs">Overview</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center bg-surface-dark h-12 rounded-full px-4 w-80 border border-white/5 focus-within:border-primary/50 transition-colors">
              <span className="material-symbols-outlined text-gray-400">search</span>
              <input 
                className="bg-transparent border-none focus:ring-0 text-white placeholder-gray-500 w-full ml-2 text-sm font-medium" 
                placeholder="Search clubs, events..." 
                type="text"
              />
            </div>
            <div className="flex items-center gap-4">
              <button className="size-10 rounded-full bg-surface-dark text-white flex items-center justify-center hover:bg-surface-dark-hover transition-colors relative">
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>notifications</span>
                <span className="absolute top-2.5 right-2.5 size-2 bg-primary rounded-full border border-surface-dark"></span>
              </button>
              <div className="h-8 w-px bg-white/10"></div>
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 group"
                >
                  {user?.photoURL ? (
                    <img
                      key={user.photoURL} // Force re-render when photoURL changes
                      src={user.photoURL}
                      alt={user?.name || 'User avatar'}
                      className="size-10 rounded-full object-cover border-2 border-transparent group-hover:border-primary transition-all shrink-0"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      onError={(e) => {
                        console.error('Failed to load Google photo:', user.photoURL);
                        console.error('Error event:', e);
                        // Only fallback if it's actually the Google photo that failed
                        if (e.target.src === user.photoURL) {
                          e.target.src = 'https://lh3.googleusercontent.com/aida-public/AB6AXuA905HuwzoL3J6Hn0Sl4XIIJzbR6IPNZbPOMGRUaFXfkY2aBHeN-VxHwYW4dhAJhgtUHW4DdNBaeFGOCxDkNYmguRofHkXkgTONLxG8Twyt9srdWrXmqamsThx_w9SGvHV4fxnZ6VA6zW6EQJBFnVcEQ9PDbnGGTuoAIZ0-T0gnO6dLwbu1ql6BxoEbyHZP1a71z_eEVtaksinsi6LWEmv4KqhZi6gLJ-7q9XaofobfY-pHbyUlLd_VNzJwzhmyxvA7Iz_DLv8tkUro';
                        }
                      }}
                    />
                  ) : (
                    <div 
                      className="size-10 rounded-full bg-cover bg-center border-2 border-transparent group-hover:border-primary transition-all shrink-0"
                      style={{ 
                        backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA905HuwzoL3J6Hn0Sl4XIIJzbR6IPNZbPOMGRUaFXfkY2aBHeN-VxHwYW4dhAJhgtUHW4DdNBaeFGOCxDkNYmguRofHkXkgTONLxG8Twyt9srdWrXmqamsThx_w9SGvHV4fxnZ6VA6zW6EQJBFnVcEQ9PDbnGGTuoAIZ0-T0gnO6dLwbu1ql6BxoEbyHZP1a71z_eEVtaksinsi6LWEmv4KqhZi6gLJ-7q9XaofobfY-pHbyUlLd_VNzJwzhmyxvA7Iz_DLv8tkUro")',
                        backgroundColor: '#1c2620'
                      }}
                    ></div>
                  )}
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-sm font-bold text-white leading-none group-hover:text-primary transition-colors">{user?.name || 'Member'}</span>
                    <span className="text-xs text-gray-400 mt-1">Premium Member</span>
                  </div>
                  <span className={`material-symbols-outlined text-gray-400 group-hover:text-white transition-all hidden md:block ${dropdownOpen ? 'rotate-180' : ''}`}>expand_more</span>
                </button>
                
                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-surface-dark rounded-xl border border-white/10 shadow-lg z-50 overflow-hidden">
                    <div className="py-1">
                      <div className="px-4 py-3 border-b border-white/5">
                        <p className="text-sm font-bold text-white">{user?.name || 'Member'}</p>
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
          </div>
        </header>

        {/* Scrollable Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10 scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-10 pb-10">
            {/* Welcome Section */}
            <section className="flex flex-col md:flex-row gap-6 items-start md:items-end justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">
                  Welcome back, <span className="text-primary">{user?.name?.split(' ')[0] || 'Member'}!</span>
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl">
                  You have 3 upcoming events this week. Ready to explore what's new in your area?
                </p>
              </div>
              <Link
                to="/dashboard/member/discover"
                className="bg-primary hover:bg-primary/90 text-background-dark font-bold py-3 px-6 rounded-full flex items-center gap-2 transition-all shadow-lg shadow-primary/20 shrink-0"
              >
                <span className="material-symbols-outlined">add_circle</span>
                Find New Clubs
              </Link>
            </section>

            {/* Stats Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-surface-dark p-6 rounded-2xl border border-white/5 flex flex-col gap-1 relative overflow-hidden">
                <div className="flex justify-between items-start mb-2">
                  <div className="bg-blue-500/20 text-blue-400 p-2 rounded-lg">
                    <span className="material-symbols-outlined">groups</span>
                  </div>
                  <span className="text-primary text-sm font-bold bg-primary/10 px-2 py-1 rounded-md">+1 this month</span>
                </div>
                <h3 className="text-gray-400 text-sm font-medium">Total Clubs Joined</h3>
                <p className="text-3xl font-bold text-white">3</p>
              </div>
              <div className="bg-surface-dark p-6 rounded-2xl border border-white/5 flex flex-col gap-1">
                <div className="flex justify-between items-start mb-2">
                  <div className="bg-purple-500/20 text-purple-400 p-2 rounded-lg">
                    <span className="material-symbols-outlined">event_available</span>
                  </div>
                  <span className="text-primary text-sm font-bold bg-primary/10 px-2 py-1 rounded-md">+2 this week</span>
                </div>
                <h3 className="text-gray-400 text-sm font-medium">Events Registered</h3>
                <p className="text-3xl font-bold text-white">5</p>
              </div>
              <div className="bg-surface-dark p-6 rounded-2xl border border-white/5 flex flex-col gap-1">
                <div className="flex justify-between items-start mb-2">
                  <div className="bg-orange-500/20 text-orange-400 p-2 rounded-lg">
                    <span className="material-symbols-outlined">history</span>
                  </div>
                </div>
                <h3 className="text-gray-400 text-sm font-medium">Events Attended</h3>
                <p className="text-3xl font-bold text-white">12</p>
              </div>
              <div className="bg-surface-dark p-6 rounded-2xl border border-white/5 flex flex-col gap-1">
                <div className="flex justify-between items-start mb-2">
                  <div className="bg-pink-500/20 text-pink-400 p-2 rounded-lg">
                    <span className="material-symbols-outlined">savings</span>
                  </div>
                </div>
                <h3 className="text-gray-400 text-sm font-medium">Next Payment</h3>
                <p className="text-xl font-bold text-white mt-auto">Nov 25</p>
              </div>
            </section>

            {/* Content Grid: Events & Clubs */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Upcoming Events */}
              <div className="xl:col-span-2 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">calendar_clock</span>
                    Upcoming Events
                  </h2>
                  <Link to="/dashboard/member/events" className="text-sm font-bold text-primary hover:underline">
                    View Calendar
                  </Link>
                </div>
                {events.map((event) => (
                  <div key={event.id} className="bg-surface-dark hover:bg-surface-dark-hover border border-white/5 hover:border-primary/30 rounded-2xl p-4 flex flex-col sm:flex-row gap-6 transition-all group cursor-pointer">
                    <div 
                      className="w-full sm:w-48 h-32 shrink-0 rounded-xl bg-cover bg-center relative overflow-hidden"
                      style={{ backgroundImage: `url("${event.image}")` }}
                    >
                      <div className={`absolute top-2 left-2 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-md border border-white/10 ${
                        event.date === 'TODAY' ? 'bg-background-dark/80' : 'bg-white/20'
                      }`}>
                        {event.date}
                      </div>
                    </div>
                    <div className="flex flex-col justify-between flex-1 py-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${
                            event.category === 'Tech Talk' ? 'text-primary' : 'text-blue-400'
                          }`}>{event.category}</p>
                          {event.time && (
                            <span className="text-gray-400 text-xs flex items-center gap-1">
                              <span className="material-symbols-outlined text-[16px]">schedule</span> {event.time}
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors">{event.title}</h3>
                        <p className="text-gray-400 text-sm">Hosted by <span className="text-white">{event.host}</span></p>
                      </div>
                      {event.attendees ? (
                        <div className="flex items-center gap-2 mt-4 sm:mt-0">
                          <div className="flex -space-x-2">
                            <div className="w-6 h-6 rounded-full border border-background-dark bg-gray-500"></div>
                            <div className="w-6 h-6 rounded-full border border-background-dark bg-gray-600"></div>
                            <div className="w-6 h-6 rounded-full border border-background-dark bg-gray-700 text-[8px] flex items-center justify-center text-white font-bold">+{event.attendees}</div>
                          </div>
                          <span className="text-xs text-gray-500">attending</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 mt-4 sm:mt-0 text-gray-400 text-xs">
                          <span className="material-symbols-outlined text-[16px]">location_on</span> {event.location}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* My Clubs List */}
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">diversity_3</span>
                    My Clubs
                  </h2>
                  <Link
                    to="/dashboard/member/clubs"
                    className="size-8 rounded-full bg-surface-dark border border-white/10 flex items-center justify-center text-primary hover:bg-primary hover:text-background-dark transition-all"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
                  </Link>
                </div>
                <div className="bg-surface-dark rounded-2xl border border-white/5 overflow-hidden">
                  {clubs.map((club, index) => (
                    <div key={club.id} className={`p-4 flex items-center gap-4 hover:bg-white/5 transition-colors cursor-pointer ${
                      index < clubs.length - 1 ? 'border-b border-white/5' : ''
                    }`}>
                      <div 
                        className={`size-12 rounded-xl bg-cover bg-center ${club.status === 'Pending' ? 'grayscale opacity-70' : ''}`}
                        style={{ backgroundImage: `url("${club.image}")` }}
                      ></div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-bold text-sm truncate ${club.status === 'Pending' ? 'text-gray-300' : 'text-white'}`}>{club.name}</h4>
                        <p className={`text-xs truncate ${club.status === 'Pending' ? 'text-gray-500' : 'text-gray-400'}`}>{club.joinedDate}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-md text-xs font-bold border ${
                        club.status === 'Active' 
                          ? 'bg-green-500/10 text-green-500 border-green-500/20'
                          : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                      }`}>{club.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Payments Section */}
            <section className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">receipt_long</span>
                  Payment History
                </h2>
                <Link to="/dashboard/member/payments" className="text-sm text-gray-400 hover:text-white transition-colors">
                  See all
                </Link>
              </div>
              <div className="bg-surface-dark rounded-2xl border border-white/5 overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead>
                    <tr className="text-gray-400 border-b border-white/5">
                      <th className="px-6 py-4 font-medium">Description</th>
                      <th className="px-6 py-4 font-medium">Club</th>
                      <th className="px-6 py-4 font-medium">Date</th>
                      <th className="px-6 py-4 font-medium">Amount</th>
                      <th className="px-6 py-4 font-medium text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-white divide-y divide-white/5">
                    {payments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-bold flex items-center gap-3">
                          <div className="bg-white/10 p-2 rounded-lg">
                            <span className="material-symbols-outlined text-sm">{payment.icon}</span>
                          </div>
                          {payment.description}
                        </td>
                        <td className="px-6 py-4 text-gray-300">{payment.club}</td>
                        <td className="px-6 py-4 text-gray-400">{payment.date}</td>
                        <td className="px-6 py-4 font-mono">{payment.amount}</td>
                        <td className="px-6 py-4 text-right">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                            <span className="size-1.5 rounded-full bg-green-400"></span>
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <footer className="pt-10 pb-4 text-center text-xs text-gray-500">
              © 2023 ClubSphere. All rights reserved.
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MemberDashboard;


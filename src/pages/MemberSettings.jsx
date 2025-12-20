import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import MemberSidebar from '../components/layout/MemberSidebar';
import Loader from '../components/ui/Loader';
import api from '../lib/api';

const MemberSettings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    username: user?.email?.split('@')[0] || '',
    bio: '',
    location: '',
    photoURL: user?.photoURL || ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [notifications, setNotifications] = useState({
    emailDigests: false,
    eventReminders: false,
    newClubAlerts: false
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['memberSettings'],
    queryFn: async () => {
      const response = await api.get('/api/member/settings');
      return response.data;
    },
    onSuccess: (data) => {
      if (data) {
        setProfileData({
          name: data.profile?.name || user?.name || '',
          email: data.profile?.email || user?.email || '',
          username: data.profile?.username || user?.email?.split('@')[0] || '',
          bio: data.profile?.bio || '',
          location: data.profile?.location || '',
          photoURL: data.profile?.photoURL || user?.photoURL || ''
        });
        setNotifications(data.notifications || {
          emailDigests: false,
          eventReminders: false,
          newClubAlerts: false
        });
        setTwoFactorEnabled(data.security?.twoFactorEnabled || false);
      }
    },
    retry: 1,
    refetchOnWindowFocus: false
  });

  // Initialize with user data if available
  useEffect(() => {
    if (user && !data && !isLoading) {
      setProfileData(prev => ({
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
        username: prev.username || (user.email ? user.email.split('@')[0] : ''),
        bio: prev.bio || '',
        location: prev.location || '',
        photoURL: prev.photoURL || user.photoURL || ''
      }));
    }
  }, [user, data, isLoading]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.put('/api/member/settings/profile', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['memberSettings']);
      alert('Profile updated successfully');
    },
    onError: (error) => {
      alert(error.response?.data?.error || 'Failed to update profile');
    }
  });

  const updatePasswordMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.put('/api/member/settings/password', data);
      return response.data;
    },
    onSuccess: () => {
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      alert('Password updated successfully');
    },
    onError: (error) => {
      alert(error.response?.data?.error || 'Failed to update password');
    }
  });

  const updateNotificationsMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.put('/api/member/settings/notifications', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['memberSettings']);
      alert('Notification preferences updated successfully');
    }
  });

  const update2FAMutation = useMutation({
    mutationFn: async (enabled) => {
      const response = await api.put('/api/member/settings/security/2fa', { enabled });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['memberSettings']);
    }
  });

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateProfileMutation.mutate(profileData);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    updatePasswordMutation.mutate({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    });
  };

  const handleNotificationToggle = (key) => {
    const newNotifications = { ...notifications, [key]: !notifications[key] };
    setNotifications(newNotifications);
    updateNotificationsMutation.mutate(newNotifications);
  };

  const handle2FAToggle = () => {
    const newValue = !twoFactorEnabled;
    setTwoFactorEnabled(newValue);
    update2FAMutation.mutate(newValue);
  };

  // Show error state but still render the form with user data
  const hasError = error && !data;

  return (
    <div className="bg-background-light dark:bg-background-dark text-black dark:text-white font-display overflow-hidden h-screen flex">
      <MemberSidebar />
      
      <main className="flex-1 flex flex-col h-full overflow-y-auto bg-background-light dark:bg-background-dark scroll-smooth">
        <div className="w-full max-w-[1000px] mx-auto px-4 md:px-8 py-8 flex flex-col gap-8">
          {/* Loading Indicator */}
          {isLoading && !data && (
            <div className="flex items-center justify-center py-20">
              <Loader />
            </div>
          )}

          {/* Error Banner */}
          {hasError && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4">
              <p className="text-red-400 text-sm">
                Error loading settings: {error?.response?.data?.error || error?.message || 'Unknown error'}. 
                Using default values. You can still update your profile.
              </p>
            </div>
          )}

          {/* Page Header */}
          <div className="flex flex-col gap-2">
            <h1 className="text-white dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">Account Settings</h1>
            <p className="text-text-secondary dark:text-text-secondary text-base">Manage your profile details, security preferences, and notifications.</p>
          </div>

          {/* Tabs */}
          <div className="border-b border-border-dark">
            <div className="flex gap-8">
              <a
                href="#profile"
                className="flex items-center justify-center border-b-[3px] border-primary text-white pb-3 px-2"
              >
                <p className="text-sm font-bold tracking-[0.015em]">Profile</p>
              </a>
              <a
                href="#security"
                className="flex items-center justify-center border-b-[3px] border-transparent text-text-secondary hover:text-white pb-3 px-2 transition-colors"
              >
                <p className="text-sm font-bold tracking-[0.015em]">Security</p>
              </a>
              <a
                href="#notifications"
                className="flex items-center justify-center border-b-[3px] border-transparent text-text-secondary hover:text-white pb-3 px-2 transition-colors"
              >
                <p className="text-sm font-bold tracking-[0.015em]">Notifications</p>
              </a>
            </div>
          </div>

          {/* Profile Section */}
          <section className="flex flex-col gap-6 animate-fade-in" id="profile">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-2xl bg-surface-dark border border-border-dark">
                <div className="flex items-center gap-5">
                  <div className="relative group cursor-pointer">
                    {profileData.photoURL ? (
                      <img
                        src={profileData.photoURL}
                        alt={user?.name || 'Profile'}
                        className="bg-center bg-no-repeat bg-cover rounded-full size-24 border-4 border-[#111714] object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div
                        className="bg-center bg-no-repeat bg-cover rounded-full size-24 border-4 border-[#111714]"
                        style={{
                          backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCjMjCk6LIREUDGL0C5tIbZka4NyFT-EJjOcrTlMgv5Lw-lfNxdaqAjPUcqavklYhbazxqu0k2WLUb1IRctTRXkcAgSGeXVfauG4hRv2OyeYyfvPx-ZLWKMBma7nqYS-lGFgwDToaiFZ_aIKA1kuNfl707dfOBDe0HD9esIl7uxY52vL4S1M0Q0hmwhSDkVq0eJfWn70rJC0JprlBYfdoYb5atPoydtZQ3OQGrtk0OM8NX4-8FRlgMRUZi2JNoZBvBM18q0tBghYuM9")'
                        }}
                      ></div>
                    )}
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined text-white">edit</span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-white text-xl font-bold">{profileData.name || user?.name || 'Member'}</h3>
                    <p className="text-text-secondary">{profileData.email || user?.email || ''}</p>
                    <p className="text-xs text-primary mt-1 font-medium">Member since {data?.memberSince || user?.createdAt || '2023'}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="h-10 px-5 rounded-full border border-border-dark text-white text-sm font-bold hover:bg-border-dark transition-colors">
                    Remove
                  </button>
                  <button className="h-10 px-5 rounded-full bg-primary text-background-dark text-sm font-bold hover:bg-opacity-90 transition-colors">
                    Change Photo
                  </button>
                </div>
              </div>
              <form onSubmit={handleProfileSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-text-secondary text-sm font-medium ml-2">Display Name</label>
                  <input
                    className="bg-surface-dark text-white border border-border-dark rounded-full px-5 h-12 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none placeholder-[#50665b] transition-all"
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-text-secondary text-sm font-medium ml-2">Username</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-text-secondary">@</span>
                    <input
                      className="w-full bg-surface-dark text-white border border-border-dark rounded-full pl-9 pr-5 h-12 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none placeholder-[#50665b] transition-all"
                      type="text"
                      value={profileData.username}
                      onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-text-secondary text-sm font-medium ml-2">Bio</label>
                  <textarea
                    className="bg-surface-dark text-white border border-border-dark rounded-2xl p-5 h-32 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none placeholder-[#50665b] resize-none transition-all"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-text-secondary text-sm font-medium ml-2">Email Address</label>
                  <div className="relative">
                    <input
                      className="w-full bg-surface-dark text-white border border-border-dark rounded-full px-5 h-12 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none placeholder-[#50665b] transition-all"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary text-sm" title="Verified">
                      check_circle
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-text-secondary text-sm font-medium ml-2">Location</label>
                  <div className="relative">
                    <input
                      className="w-full bg-surface-dark text-white border border-border-dark rounded-full px-5 h-12 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none placeholder-[#50665b] transition-all"
                      type="text"
                      value={profileData.location}
                      onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-text-secondary">location_on</span>
                  </div>
                </div>
              </form>
              <div className="flex justify-end pt-4">
                <button
                  onClick={handleProfileSubmit}
                  className="h-12 px-8 rounded-full bg-primary text-background-dark font-bold hover:bg-opacity-90 transition-transform active:scale-95 shadow-[0_0_15px_rgba(56,224,123,0.3)]"
                >
                  Save Changes
                </button>
              </div>
          </section>
          <hr className="border-border-dark my-2" />

          {/* Security Section */}
          <section className="flex flex-col gap-6" id="security">
              <div className="flex flex-col gap-2 mb-2">
                <h2 className="text-white text-2xl font-bold">Security</h2>
                <p className="text-text-secondary text-sm">Update your password and secure your account.</p>
              </div>
              <div className="p-6 rounded-2xl bg-surface-dark border border-border-dark">
                <h3 className="text-white text-lg font-bold mb-6">Change Password</h3>
                <form onSubmit={handlePasswordSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-text-secondary text-sm font-medium ml-2">Current Password</label>
                    <input
                      className="bg-[#111714] text-white border border-border-dark rounded-full px-5 h-12 focus:border-primary focus:outline-none transition-all"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-text-secondary text-sm font-medium ml-2">New Password</label>
                    <input
                      className="bg-[#111714] text-white border border-border-dark rounded-full px-5 h-12 focus:border-primary focus:outline-none transition-all"
                      placeholder="Min 8 chars"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-text-secondary text-sm font-medium ml-2">Confirm Password</label>
                    <input
                      className="bg-[#111714] text-white border border-border-dark rounded-full px-5 h-12 focus:border-primary focus:outline-none transition-all"
                      placeholder="Repeat password"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    />
                  </div>
                </form>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handlePasswordSubmit}
                    className="text-sm font-bold text-white hover:text-primary transition-colors"
                  >
                    Update Password
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between p-6 rounded-2xl bg-surface-dark border border-border-dark">
                <div className="flex flex-col gap-1">
                  <h3 className="text-white text-lg font-bold">Two-Factor Authentication</h3>
                  <p className="text-text-secondary text-sm">Add an extra layer of security to your account.</p>
                </div>
                <button
                  onClick={handle2FAToggle}
                  className={`w-14 h-8 rounded-full border border-border-dark relative transition-colors focus:outline-none group ${
                    twoFactorEnabled ? 'bg-primary' : 'bg-[#111714]'
                  }`}
                >
                  <span
                    className={`absolute top-1 bg-text-secondary group-hover:bg-white w-6 h-6 rounded-full transition-transform duration-300 shadow-md ${
                      twoFactorEnabled ? 'right-1' : 'left-1'
                    }`}
                  ></span>
                </button>
              </div>
          </section>
          <hr className="border-border-dark my-2" />

          {/* Notifications Section */}
          <section className="flex flex-col gap-6" id="notifications">
              <div className="flex flex-col gap-2 mb-2">
                <h2 className="text-white text-2xl font-bold">Notifications</h2>
                <p className="text-text-secondary text-sm">Choose what we get in touch about.</p>
              </div>
              <div className="flex flex-col rounded-2xl bg-surface-dark border border-border-dark overflow-hidden">
                {/* Item 1 */}
                <div className="flex items-center justify-between p-6 border-b border-border-dark">
                  <div className="flex gap-4 items-center">
                    <div className="bg-[#111714] p-2 rounded-full text-white">
                      <span className="material-symbols-outlined">mail</span>
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-white font-bold">Email Digests</h3>
                      <p className="text-text-secondary text-sm">Weekly summary of top clubs and events.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleNotificationToggle('emailDigests')}
                    className={`w-14 h-8 rounded-full relative transition-colors focus:outline-none ${
                      notifications.emailDigests
                        ? 'bg-primary shadow-[0_0_10px_rgba(56,224,123,0.2)]'
                        : 'bg-[#111714] border border-border-dark'
                    }`}
                  >
                    <span
                      className={`absolute top-1 bg-background-dark w-6 h-6 rounded-full transition-transform duration-300 shadow-sm ${
                        notifications.emailDigests ? 'right-1' : 'left-1'
                      }`}
                    ></span>
                  </button>
                </div>
                {/* Item 2 */}
                <div className="flex items-center justify-between p-6 border-b border-border-dark">
                  <div className="flex gap-4 items-center">
                    <div className="bg-[#111714] p-2 rounded-full text-white">
                      <span className="material-symbols-outlined">event</span>
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-white font-bold">Event Reminders</h3>
                      <p className="text-text-secondary text-sm">Get notified 24h before an event starts.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleNotificationToggle('eventReminders')}
                    className={`w-14 h-8 rounded-full relative transition-colors focus:outline-none ${
                      notifications.eventReminders
                        ? 'bg-primary shadow-[0_0_10px_rgba(56,224,123,0.2)]'
                        : 'bg-[#111714] border border-border-dark'
                    }`}
                  >
                    <span
                      className={`absolute top-1 bg-background-dark w-6 h-6 rounded-full transition-transform duration-300 shadow-sm ${
                        notifications.eventReminders ? 'right-1' : 'left-1'
                      }`}
                    ></span>
                  </button>
                </div>
                {/* Item 3 */}
                <div className="flex items-center justify-between p-6">
                  <div className="flex gap-4 items-center">
                    <div className="bg-[#111714] p-2 rounded-full text-white">
                      <span className="material-symbols-outlined">campaign</span>
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-white font-bold">New Club Alerts</h3>
                      <p className="text-text-secondary text-sm">Notifications when new clubs open near you.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleNotificationToggle('newClubAlerts')}
                    className={`w-14 h-8 rounded-full relative transition-colors focus:outline-none ${
                      notifications.newClubAlerts
                        ? 'bg-primary shadow-[0_0_10px_rgba(56,224,123,0.2)]'
                        : 'bg-[#111714] border border-border-dark'
                    }`}
                  >
                    <span
                      className={`absolute top-1 bg-text-secondary group-hover:bg-white w-6 h-6 rounded-full transition-transform duration-300 shadow-md ${
                        notifications.newClubAlerts ? 'right-1' : 'left-1'
                      }`}
                    ></span>
                  </button>
                </div>
              </div>
          </section>
          <hr className="border-border-dark my-2" />

          {/* Danger Zone */}
          <section className="mb-12">
            <div className="p-6 rounded-2xl border border-red-900/30 bg-red-900/10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex flex-col gap-1">
                  <h3 className="text-red-500 font-bold text-lg">Danger Zone</h3>
                  <p className="text-red-400/70 text-sm">Once you delete your account, there is no going back. Please be certain.</p>
                </div>
                <button className="h-10 px-6 rounded-full bg-transparent border border-red-500/50 text-red-500 text-sm font-bold hover:bg-red-500 hover:text-white transition-colors">
                  Delete Account
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default MemberSettings;


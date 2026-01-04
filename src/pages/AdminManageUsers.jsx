import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../components/layout/AdminSidebar';
import api from '../lib/api';
import Swal from '../lib/sweetalertConfig';
import Loader from '../components/ui/Loader';

const AdminManageUsers = () => {
  const { user, logout } = useAuth();

  useEffect(() => {
    document.title = 'Manage Users - Admin - ClubSphere';
  }, []);
  const location = useLocation();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const limit = 5;

  // Fetch users
  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', page, search, roleFilter],
    queryFn: async () => {
      const response = await api.get('/api/admin/users', {
        params: { page, limit, search, role: roleFilter }
      });
      return response.data;
    }
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId) => {
      await api.delete(`/api/admin/users/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-users']);
      Swal.fire({
        icon: 'success',
        title: 'User Deleted',
        text: 'User has been deleted successfully',
        timer: 2000,
        showConfirmButton: false
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.error || 'Failed to delete user'
      });
    }
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, userData }) => {
      await api.put(`/api/admin/users/${userId}`, userData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-users']);
      Swal.fire({
        icon: 'success',
        title: 'User Updated',
        text: 'User has been updated successfully',
        timer: 2000,
        showConfirmButton: false
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.error || 'Failed to update user'
      });
    }
  });

  // Get user initials for avatar fallback
  const getUserInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  // Get role badge styling
  const getRoleBadge = (role) => {
    const badges = {
      admin: {
        bg: 'bg-primary/20',
        text: 'text-primary',
        border: 'border-primary/20',
        icon: 'shield_person',
        label: 'Admin'
      },
      clubManager: {
        bg: 'bg-purple-500/20',
        text: 'text-purple-300',
        border: 'border-purple-500/20',
        icon: 'badge',
        label: 'Club Manager'
      },
      member: {
        bg: 'bg-white/5',
        text: 'text-text-muted',
        border: 'border-white/10',
        icon: 'person',
        label: 'Member'
      }
    };
    return badges[role] || badges.member;
  };

  // Handle edit user
  const handleEditUser = (userItem) => {
    Swal.fire({
      title: 'Edit User',
      html: `
        <div style="text-align: left; margin-top: 1rem;">
          <label style="display: block; color: #9eb7a8; font-size: 0.875rem; margin-bottom: 0.5rem; font-weight: 500;">Name</label>
          <input id="swal-name" class="swal2-input" value="${userItem.name || ''}" placeholder="User name" style="margin-bottom: 1rem;">
          
          <label style="display: block; color: #9eb7a8; font-size: 0.875rem; margin-bottom: 0.5rem; font-weight: 500;">Email</label>
          <input id="swal-email" class="swal2-input" type="email" value="${userItem.email || ''}" placeholder="User email" style="margin-bottom: 1rem;">
          
          <label style="display: block; color: #9eb7a8; font-size: 0.875rem; margin-bottom: 0.5rem; font-weight: 500;">Role</label>
          <select id="swal-role" class="swal2-input" style="margin-bottom: 0;">
            <option value="member" ${userItem.role === 'member' ? 'selected' : ''}>Member</option>
            <option value="clubManager" ${userItem.role === 'clubManager' ? 'selected' : ''}>Club Manager</option>
            <option value="admin" ${userItem.role === 'admin' ? 'selected' : ''}>Admin</option>
          </select>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Save Changes',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#38e07b',
      cancelButtonColor: '#29382f',
      preConfirm: () => {
        const name = document.getElementById('swal-name').value.trim();
        const email = document.getElementById('swal-email').value.trim();
        const role = document.getElementById('swal-role').value;

        if (!name) {
          Swal.showValidationMessage('Name is required');
          return false;
        }

        if (!email) {
          Swal.showValidationMessage('Email is required');
          return false;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          Swal.showValidationMessage('Please enter a valid email address');
          return false;
        }

        return { name, email, role };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        updateUserMutation.mutate({
          userId: userItem.id,
          userData: result.value
        });
      }
    });
  };

  const users = data?.users || [];
  const pagination = data?.pagination || { total: 0, totalPages: 1 };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white">
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-background-light dark:bg-background-dark">
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <Loader />
            </div>
          ) : (
          <div className="max-w-7xl mx-auto flex flex-col gap-8">
            {/* Page Heading & Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-dashboard-text-main dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">User Management</h2>
                <p className="text-dashboard-text-muted dark:text-[#9eb7a8] mt-2 text-base">Manage access, roles, and user details across the platform.</p>
              </div>
              <button className="flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full h-12 px-6 bg-primary text-[#122017] text-sm font-bold hover:brightness-110 transition-all shadow-[0_0_20px_rgba(56,224,123,0.2)]">
                <span className="material-symbols-outlined text-[20px]">add</span>
                <span>Add New User</span>
              </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1 rounded-xl p-6 bg-white dark:bg-[#1a2620] border border-dashboard-border dark:border-[#29382f] relative overflow-hidden group shadow-sm">
                <div className="absolute right-0 top-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <span className="material-symbols-outlined text-6xl text-primary">group</span>
                </div>
                <p className="text-dashboard-text-muted dark:text-[#9eb7a8] text-sm font-medium">Total Users</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-dashboard-text-main dark:text-white text-3xl font-bold">{pagination.total || 0}</p>
                  <span className="text-primary text-sm font-bold flex items-center bg-primary/10 px-2 py-0.5 rounded-full">
                    <span className="material-symbols-outlined text-xs mr-1">trending_up</span>
                    +12%
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1 rounded-xl p-6 bg-white dark:bg-[#1a2620] border border-dashboard-border dark:border-[#29382f] relative overflow-hidden group shadow-sm">
                <div className="absolute right-0 top-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <span className="material-symbols-outlined text-6xl text-primary">person_add</span>
                </div>
                <p className="text-dashboard-text-muted dark:text-[#9eb7a8] text-sm font-medium">New (This Week)</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-dashboard-text-main dark:text-white text-3xl font-bold">45</p>
                  <span className="text-primary text-sm font-bold flex items-center bg-primary/10 px-2 py-0.5 rounded-full">
                    <span className="material-symbols-outlined text-xs mr-1">trending_up</span>
                    +5%
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1 rounded-xl p-6 bg-white dark:bg-[#1a2620] border border-dashboard-border dark:border-[#29382f] relative overflow-hidden group shadow-sm">
                <div className="absolute right-0 top-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <span className="material-symbols-outlined text-6xl text-primary">verified_user</span>
                </div>
                <p className="text-dashboard-text-muted dark:text-[#9eb7a8] text-sm font-medium">Active Club Managers</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-dashboard-text-main dark:text-white text-3xl font-bold">
                    {users.filter(u => u.role === 'clubManager').length}
                  </p>
                </div>
              </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between bg-white dark:bg-[#1a2620] p-2 rounded-xl border border-dashboard-border dark:border-[#29382f] shadow-sm">
              {/* Search */}
              <label className="flex items-center gap-3 px-4 h-12 w-full lg:w-96 rounded-lg bg-dashboard-surface-hover dark:bg-[#122017] border border-dashboard-border dark:border-[#29382f] focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all">
                <span className="material-symbols-outlined text-dashboard-text-muted dark:text-[#9eb7a8]">search</span>
                <input
                  className="bg-transparent border-none text-dashboard-text-main dark:text-white placeholder-dashboard-text-muted dark:placeholder-[#9eb7a8] w-full focus:ring-0 text-sm"
                  placeholder="Search users by name or email..."
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </label>
              {/* Filter Chips */}
              <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-hide px-2">
                <button
                  onClick={() => setRoleFilter(roleFilter === 'all' ? 'admin' : roleFilter === 'admin' ? 'clubManager' : roleFilter === 'clubManager' ? 'member' : 'all')}
                  className="flex h-9 shrink-0 items-center gap-2 rounded-full bg-dashboard-surface-hover dark:bg-[#29382f] px-4 hover:bg-dashboard-surface-hover/80 dark:hover:bg-white/10 transition-colors border border-dashboard-border dark:border-transparent"
                >
                  <span className="text-dashboard-text-main dark:text-white text-sm font-medium">Role: {roleFilter === 'all' ? 'All' : roleFilter.charAt(0).toUpperCase() + roleFilter.slice(1)}</span>
                  <span className="material-symbols-outlined text-dashboard-text-muted dark:text-[#9eb7a8] text-[18px]">keyboard_arrow_down</span>
                </button>
              </div>
            </div>

            {/* Data Table */}
            <div className="rounded-xl border border-dashboard-border dark:border-[#29382f] bg-white dark:bg-[#1a2620] overflow-hidden flex flex-col shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-dashboard-border dark:border-[#29382f] bg-dashboard-surface-hover dark:bg-[#122017]/50">
                      <th className="p-5 text-xs font-semibold uppercase tracking-wider text-dashboard-text-muted dark:text-[#9eb7a8]">User</th>
                      <th className="p-5 text-xs font-semibold uppercase tracking-wider text-dashboard-text-muted dark:text-[#9eb7a8]">Email</th>
                      <th className="p-5 text-xs font-semibold uppercase tracking-wider text-dashboard-text-muted dark:text-[#9eb7a8]">Role</th>
                      <th className="p-5 text-xs font-semibold uppercase tracking-wider text-dashboard-text-muted dark:text-[#9eb7a8]">Joined Date</th>
                      <th className="p-5 text-xs font-semibold uppercase tracking-wider text-dashboard-text-muted dark:text-[#9eb7a8] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dashboard-border dark:divide-[#29382f]">
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="p-5 text-center text-dashboard-text-muted dark:text-[#9eb7a8]">No users found</td>
                      </tr>
                    ) : (
                      users.map((userItem) => {
                        const roleBadge = getRoleBadge(userItem.role);
                        return (
                          <tr key={userItem.id} className="group hover:bg-dashboard-surface-hover dark:hover:bg-[#29382f]/30 transition-colors bg-white dark:bg-[#1a2620]">
                            <td className="p-5">
                              <div className="flex items-center gap-3">
                                {userItem.photoURL ? (
                                  <img
                                    src={userItem.photoURL}
                                    alt={userItem.name}
                                    className="bg-center bg-cover rounded-full size-10 shadow-inner"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      e.target.nextElementSibling.style.display = 'flex';
                                    }}
                                  />
                                ) : null}
                                <div
                                  className={`bg-center bg-cover rounded-full size-10 shadow-inner flex items-center justify-center text-xs font-bold ${userItem.photoURL ? 'hidden' : 'flex'}`}
                                  style={{
                                    backgroundColor: `hsl(${(userItem.id.charCodeAt(0) * 137.508) % 360}, 70%, 50%)`,
                                    color: 'white'
                                  }}
                                >
                                  {getUserInitials(userItem.name)}
                                </div>
                                <div>
                                  <p className="text-dashboard-text-main dark:text-white font-medium text-sm">{userItem.name}</p>
                                  <p className="text-dashboard-text-muted dark:text-[#9eb7a8] text-xs md:hidden">{userItem.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-5 text-sm text-dashboard-text-muted dark:text-[#9eb7a8] max-w-[200px] truncate">{userItem.email}</td>
                            <td className="p-5">
                              <span className={`inline-flex items-center gap-1.5 rounded-full ${roleBadge.bg} px-3 py-1 text-xs font-bold ${roleBadge.text} border ${roleBadge.border}`}>
                                <span className="material-symbols-outlined text-[14px]">{roleBadge.icon}</span>
                                {roleBadge.label}
                              </span>
                            </td>
                            <td className="p-5 text-sm text-dashboard-text-muted dark:text-[#9eb7a8] whitespace-nowrap">{userItem.joinedDate}</td>
                            <td className="p-5 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleEditUser(userItem)}
                                  disabled={updateUserMutation.isPending}
                                  className="size-8 flex items-center justify-center rounded-full hover:bg-dashboard-surface-hover dark:hover:bg-white/10 text-dashboard-text-muted dark:text-[#9eb7a8] hover:text-dashboard-text-main dark:hover:text-white transition-colors disabled:opacity-50"
                                  title="Edit User"
                                >
                                  <span className="material-symbols-outlined text-[20px]">edit</span>
                                </button>
                                <button
                                  onClick={() => {
                                    Swal.fire({
                                      title: 'Delete User?',
                                      text: `Are you sure you want to delete ${userItem.name}?`,
                                      icon: 'warning',
                                      showCancelButton: true,
                                      confirmButtonColor: '#ef4444',
                                      cancelButtonColor: '#29382f',
                                      confirmButtonText: 'Yes, delete it'
                                    }).then((result) => {
                                      if (result.isConfirmed) {
                                        deleteUserMutation.mutate(userItem.id);
                                      }
                                    });
                                  }}
                                  disabled={deleteUserMutation.isPending}
                                  className="size-8 flex items-center justify-center rounded-full hover:bg-red-500/20 text-dashboard-text-muted dark:text-[#9eb7a8] hover:text-red-400 transition-colors disabled:opacity-50"
                                  title="Delete User"
                                >
                                  <span className="material-symbols-outlined text-[20px]">delete</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between border-t border-dashboard-border dark:border-[#29382f] px-4 py-3 sm:px-6">
                <div className="flex flex-1 justify-between sm:hidden">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="relative inline-flex items-center rounded-md border border-dashboard-border dark:border-[#29382f] bg-dashboard-surface-hover dark:bg-[#122017] px-4 py-2 text-sm font-medium text-dashboard-text-muted dark:text-[#9eb7a8] hover:bg-dashboard-surface-hover/80 dark:hover:bg-white/5 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                    disabled={page >= pagination.totalPages}
                    className="relative ml-3 inline-flex items-center rounded-md border border-dashboard-border dark:border-[#29382f] bg-dashboard-surface-hover dark:bg-[#122017] px-4 py-2 text-sm font-medium text-dashboard-text-muted dark:text-[#9eb7a8] hover:bg-dashboard-surface-hover/80 dark:hover:bg-white/5 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-dashboard-text-muted dark:text-[#9eb7a8]">
                      Showing <span className="font-medium text-dashboard-text-main dark:text-white">{((page - 1) * limit) + 1}</span> to{' '}
                      <span className="font-medium text-dashboard-text-main dark:text-white">{Math.min(page * limit, pagination.total)}</span> of{' '}
                      <span className="font-medium text-dashboard-text-main dark:text-white">{pagination.total}</span> results
                    </p>
                  </div>
                  <div>
                    <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                      <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="relative inline-flex items-center rounded-l-md px-2 py-2 text-[#9eb7a8] ring-1 ring-inset ring-[#29382f] hover:bg-white/5 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                      >
                        <span className="sr-only">Previous</span>
                        <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                      </button>
                      {[...Array(Math.min(3, pagination.totalPages))].map((_, i) => {
                        const pageNum = i + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={`relative z-10 inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                              page === pageNum
                                ? 'bg-primary text-[#122017] focus-visible:outline-primary'
                                : 'text-[#9eb7a8] ring-1 ring-inset ring-[#29382f] hover:bg-white/5 focus:outline-offset-0'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      {pagination.totalPages > 3 && <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-[#9eb7a8] ring-1 ring-inset ring-[#29382f] focus:outline-offset-0">...</span>}
                      <button
                        onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                        disabled={page >= pagination.totalPages}
                        className="relative inline-flex items-center rounded-r-md px-2 py-2 text-[#9eb7a8] ring-1 ring-inset ring-[#29382f] hover:bg-white/5 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                      >
                        <span className="sr-only">Next</span>
                        <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Spacer */}
            <div className="h-10"></div>
          </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminManageUsers;


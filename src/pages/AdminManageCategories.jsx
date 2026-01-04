import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import Swal from '../lib/sweetalertConfig';
import Loader from '../components/ui/Loader';

const AdminManageCategories = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);

  // Fetch categories
  const { data, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const response = await api.get('/api/admin/categories');
      return response.data;
    }
  });

  // Create category mutation
  const createCategoryMutation = useMutation({
    mutationFn: async (categoryData) => {
      const response = await api.post('/api/admin/categories', categoryData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-categories']);
      setIsAddCategoryModalOpen(false);
      Swal.fire({
        icon: 'success',
        title: 'Category Created',
        text: 'Category has been created successfully',
        timer: 2000,
        showConfirmButton: false
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.error || 'Failed to create category'
      });
    }
  });

  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: async (categoryId) => {
      await api.delete(`/api/admin/categories/${categoryId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-categories']);
      Swal.fire({
        icon: 'success',
        title: 'Category Deleted',
        text: 'Category has been deleted successfully',
        timer: 2000,
        showConfirmButton: false
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.error || 'Failed to delete category'
      });
    }
  });

  const categories = data?.categories || [];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 flex flex-col justify-between border-r border-dashboard-border dark:border-surface-highlight bg-dashboard-sidebar dark:bg-background-dark transition-all duration-300 shadow-sm">
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
            <Link to="/dashboard/admin" className={`flex items-center gap-3 px-3 py-3 rounded-full transition-colors ${isActive('/dashboard/admin') ? 'bg-primary text-background-dark' : 'text-gray-400 hover:bg-surface-highlight hover:text-white'}`}>
              <span className="material-symbols-outlined">dashboard</span>
              <p className={`text-sm leading-normal hidden lg:block ${isActive('/dashboard/admin') ? 'font-bold' : 'font-medium'}`}>Dashboard</p>
            </Link>
            <Link to="/dashboard/admin/users" className={`flex items-center gap-3 px-3 py-3 rounded-full transition-colors ${isActive('/dashboard/admin/users') ? 'bg-primary text-background-dark' : 'text-gray-400 hover:bg-surface-highlight hover:text-white'}`}>
              <span className="material-symbols-outlined">group</span>
              <p className={`text-sm leading-normal hidden lg:block ${isActive('/dashboard/admin/users') ? 'font-bold' : 'font-medium'}`}>Users</p>
            </Link>
            <Link to="/dashboard/admin/clubs" className={`flex items-center gap-3 px-3 py-3 rounded-full transition-colors ${isActive('/dashboard/admin/clubs') ? 'bg-primary text-background-dark' : 'text-gray-400 hover:bg-surface-highlight hover:text-white'}`}>
              <span className="material-symbols-outlined">diversity_3</span>
              <p className={`text-sm leading-normal hidden lg:block ${isActive('/dashboard/admin/clubs') ? 'font-bold' : 'font-medium'}`}>Clubs</p>
            </Link>
            <Link to="/dashboard/admin/events" className={`flex items-center gap-3 px-3 py-3 rounded-full transition-colors ${isActive('/dashboard/admin/events') ? 'bg-primary text-background-dark' : 'text-gray-400 hover:bg-surface-highlight hover:text-white'}`}>
              <span className="material-symbols-outlined">calendar_today</span>
              <p className={`text-sm leading-normal hidden lg:block ${isActive('/dashboard/admin/events') ? 'font-bold' : 'font-medium'}`}>Events</p>
            </Link>
            <Link to="/dashboard/admin/finances" className={`flex items-center gap-3 px-3 py-3 rounded-full transition-colors ${isActive('/dashboard/admin/finances') ? 'bg-primary text-background-dark' : 'text-gray-400 hover:bg-surface-highlight hover:text-white'}`}>
              <span className="material-symbols-outlined">payments</span>
              <p className={`text-sm leading-normal hidden lg:block ${isActive('/dashboard/admin/finances') ? 'font-bold' : 'font-medium'}`}>Finances</p>
            </Link>
            <Link to="/dashboard/admin/categories" className={`flex items-center gap-3 px-3 py-3 rounded-full transition-colors ${isActive('/dashboard/admin/categories') ? 'bg-primary text-background-dark' : 'text-gray-400 hover:bg-surface-highlight hover:text-white'}`}>
              <span className="material-symbols-outlined">category</span>
              <p className={`text-sm leading-normal hidden lg:block ${isActive('/dashboard/admin/categories') ? 'font-bold' : 'font-medium'}`}>Categories</p>
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
        <div className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <Loader />
            </div>
          ) : (
          <div className="max-w-[1200px] mx-auto flex flex-col gap-8">
            {/* Page Heading */}
            <div className="flex flex-wrap justify-between items-end gap-4">
              <div className="flex flex-col gap-2">
                <h1 className="text-white text-3xl md:text-4xl font-black leading-tight tracking-tight">Category Management</h1>
                <p className="text-[#9eb7a8] text-base font-normal">Manage club categories for better organization.</p>
              </div>
              <button 
                onClick={() => setIsAddCategoryModalOpen(true)}
                className="flex items-center gap-2 bg-primary text-black px-4 py-2.5 rounded-lg font-bold text-sm hover:bg-opacity-90 transition-opacity shadow-[0_0_15px_rgba(54,226,123,0.3)]"
              >
                <span className="material-symbols-outlined text-[20px]">add</span>
                <span>Add Category</span>
              </button>
            </div>

            {/* Categories Grid */}
            {categories.length === 0 ? (
              <div className="text-center py-12 text-[#9eb7a8]">
                <p className="text-lg mb-2">No categories found</p>
                <p className="text-sm">Click "Add Category" to create your first category</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <div 
                    key={category._id || category.id} 
                    className="bg-[#1a231f] border border-[#3d5245] rounded-xl p-6 flex items-center justify-between hover:border-primary/50 transition-colors"
                  >
                    <div className="flex flex-col gap-1">
                      <h3 className="text-white text-lg font-bold">{category.displayName}</h3>
                      <p className="text-[#9eb7a8] text-sm">ID: {category.name}</p>
                    </div>
                    <button
                      onClick={() => {
                        Swal.fire({
                          title: 'Delete Category?',
                          text: `Are you sure you want to delete "${category.displayName}"?`,
                          icon: 'warning',
                          showCancelButton: true,
                          confirmButtonColor: '#ef4444',
                          cancelButtonColor: '#29382f',
                          confirmButtonText: 'Yes, delete it'
                        }).then((result) => {
                          if (result.isConfirmed) {
                            deleteCategoryMutation.mutate(category._id || category.id);
                          }
                        });
                      }}
                      className="flex size-8 items-center justify-center rounded hover:bg-red-500/20 text-red-500 transition-colors"
                      title="Delete Category"
                    >
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          )}
        </div>
      </main>

      {/* Add Category Modal */}
      {isAddCategoryModalOpen && (
        <AddCategoryModal
          isOpen={isAddCategoryModalOpen}
          onClose={() => setIsAddCategoryModalOpen(false)}
          onSubmit={createCategoryMutation.mutate}
          isLoading={createCategoryMutation.isLoading}
        />
      )}
    </div>
  );
};

// Add Category Modal Component
const AddCategoryModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    displayName: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.displayName) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Fields',
        text: 'Please fill in all fields.',
      });
      return;
    }

    onSubmit({
      name: formData.name.toLowerCase().replace(/\s+/g, '-'),
      displayName: formData.displayName
    });

    // Reset form
    setFormData({
      name: '',
      displayName: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-[#1a231f] border border-border-light dark:border-[#3d5245] rounded-xl w-full max-w-[500px] my-8 max-h-[90vh] overflow-y-auto">
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-text-main dark:text-white text-2xl font-bold">Add New Category</h1>
              <p className="text-text-muted dark:text-[#9eb7a8] text-sm">Create a new category for clubs</p>
            </div>
            <button
              onClick={onClose}
              className="text-text-muted dark:text-[#9eb7a8] hover:text-text-main dark:hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#29382f]"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Display Name */}
            <div className="flex flex-col gap-2">
              <label className="text-text-muted dark:text-[#9eb7a8] text-sm font-medium flex gap-1">
                Display Name <span className="text-red-400">*</span>
              </label>
              <input
                className="bg-gray-50 dark:bg-[#29382f] border border-border-light dark:border-transparent focus:border-primary/50 focus:ring-0 rounded-lg text-text-main dark:text-white placeholder:text-text-muted dark:placeholder:text-[#5c7266] h-12 px-4 w-full transition-colors"
                placeholder="e.g. Sports & Fitness"
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleInputChange}
                required
              />
              <p className="text-xs text-text-muted dark:text-[#5c7266]">This is the name shown to users</p>
            </div>

            {/* Category ID */}
            <div className="flex flex-col gap-2">
              <label className="text-text-muted dark:text-[#9eb7a8] text-sm font-medium flex gap-1">
                Category ID <span className="text-red-400">*</span>
              </label>
              <input
                className="bg-gray-50 dark:bg-[#29382f] border border-border-light dark:border-transparent focus:border-primary/50 focus:ring-0 rounded-lg text-text-main dark:text-white placeholder:text-text-muted dark:placeholder:text-[#5c7266] h-12 px-4 w-full transition-colors"
                placeholder="e.g. sports"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <p className="text-xs text-text-muted dark:text-[#5c7266]">Lowercase, no spaces (e.g., sports, tech, arts)</p>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-4 mt-6 pt-6 border-t border-border-light dark:border-[#3d5245]">
              <button
                type="button"
                onClick={onClose}
                className="text-text-muted dark:text-[#9eb7a8] font-semibold hover:text-text-main dark:hover:text-white px-6 py-2.5 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-[#29382f]"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-primary text-black px-8 py-2.5 rounded-lg font-bold hover:bg-opacity-90 transition-opacity shadow-[0_0_15px_rgba(54,226,123,0.3)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]">add_circle</span>
                    <span>Create Category</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminManageCategories;


import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import ManagerSidebar from '../components/layout/ManagerSidebar';
import Loader from '../components/ui/Loader';
import Swal from '../lib/sweetalertConfig';

const ManagerMyClubs = () => {
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Clubs');
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingClub, setEditingClub] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [deleteMenuOpen, setDeleteMenuOpen] = useState(null);

  useEffect(() => {
    document.title = 'My Clubs - Club Manager - ClubSphere';
  }, []);

  // Close delete menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (deleteMenuOpen && !event.target.closest('.relative')) {
        setDeleteMenuOpen(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [deleteMenuOpen]);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();
  const imageUrl = watch('image');

  // Fetch categories from backend
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/api/categories');
      return response.data;
    }
  });

  // Fetch clubs
  const { data: clubsData, isLoading, error } = useQuery({
    queryKey: ['managerClubs', search, categoryFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (categoryFilter && categoryFilter !== 'All Clubs') params.append('category', categoryFilter);
      const response = await api.get(`/api/manager/clubs?${params.toString()}`);
      return response.data;
    }
  });

  const clubs = clubsData?.clubs || [];
  const backendCategories = categoriesData?.categories || [];
  // Create filter categories list with "All Clubs" first, then backend categories
  const allCategories = ['All Clubs', ...backendCategories.map(cat => cat.displayName || cat.name)];
  // Show only first 4 categories (including "All Clubs") initially, or all if expanded
  const categories = showAllCategories ? allCategories : allCategories.slice(0, 4);
  // Create dropdown categories list (without "All Clubs")
  const clubCategories = backendCategories.map(cat => cat.displayName || cat.name);

  // Upload image to ImgBB
  const uploadImageToImgBB = async (file) => {
    if (!import.meta.env.VITE_IMGBB_API_KEY) {
      return null;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('key', import.meta.env.VITE_IMGBB_API_KEY);

    try {
      const response = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        return data.data.url;
      }
      return null;
    } catch (error) {
      console.error('Image upload failed:', error);
      return null;
    }
  };

  // Create club mutation
  const createClubMutation = useMutation({
    mutationFn: async (data) => {
      let imageURL = data.image || null;
      
      // Upload image if a file is selected
      if (selectedImage && import.meta.env.VITE_IMGBB_API_KEY) {
        setIsUploadingImage(true);
        try {
          imageURL = await uploadImageToImgBB(selectedImage);
        } catch (error) {
          console.warn('Image upload failed, continuing without image:', error);
        } finally {
          setIsUploadingImage(false);
        }
      }

      const response = await api.post('/api/manager/clubs', {
        name: data.name,
        description: data.description,
        category: data.category,
        schedule: data.schedule,
        location: data.location,
        fee: data.fee ? parseFloat(data.fee) : 0,
        image: imageURL
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['managerClubs']);
      setShowCreateModal(false);
      reset();
      setImagePreview(null);
      setSelectedImage(null);
      Swal.fire({
        icon: 'success',
        title: 'Club Created!',
        text: 'Your club has been created and is pending admin approval.',
        timer: 3000,
        showConfirmButton: false
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.error || 'Failed to create club. Please try again.'
      });
    }
  });

  // Delete club mutation
  const deleteClubMutation = useMutation({
    mutationFn: async (clubId) => {
      const response = await api.delete(`/api/manager/clubs/${clubId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['managerClubs']);
      setDeleteMenuOpen(null);
      Swal.fire({
        icon: 'success',
        title: 'Club Deleted!',
        text: 'Your club has been deleted successfully.',
        timer: 2000,
        showConfirmButton: false
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.error || 'Failed to delete club. Please try again.'
      });
    }
  });

  // Update club mutation
  const updateClubMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      let imageURL = data.image || editingClub?.image || null;
      
      // Upload image if a new file is selected
      if (selectedImage && import.meta.env.VITE_IMGBB_API_KEY) {
        setIsUploadingImage(true);
        try {
          imageURL = await uploadImageToImgBB(selectedImage);
        } catch (error) {
          console.warn('Image upload failed, keeping existing image:', error);
        } finally {
          setIsUploadingImage(false);
        }
      }

      const response = await api.put(`/api/manager/clubs/${id}`, {
        name: data.name,
        description: data.description,
        category: data.category,
        schedule: data.schedule,
        location: data.location,
        fee: data.fee ? parseFloat(data.fee) : 0,
        image: imageURL
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['managerClubs']);
      setShowEditModal(false);
      setEditingClub(null);
      reset();
      setImagePreview(null);
      setSelectedImage(null);
      Swal.fire({
        icon: 'success',
        title: 'Club Updated!',
        text: 'Your club has been updated successfully.',
        timer: 2000,
        showConfirmButton: false
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.error || 'Failed to update club. Please try again.'
      });
    }
  });

  const handleManageClub = (clubId) => {
    navigate(`/dashboard/club-manager/clubs/${clubId}/members`);
  };

  const handleEditClub = (club) => {
    setEditingClub(club);
    setValue('name', club.name);
    setValue('description', club.description || '');
    setValue('category', club.category || 'Sports');
    setValue('schedule', club.schedule || '');
    setValue('location', club.location || '');
    // Fee is already in taka from backend (converted from cents)
    setValue('fee', club.fee ? club.fee.toString() : '0');
    setValue('image', club.image || '');
    setImagePreview(club.image || null);
    setSelectedImage(null);
    setShowEditModal(true);
  };

  const handleCreateEvent = (clubId) => {
    navigate(`/dashboard/club-manager/events?clubId=${clubId}`);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid File',
          text: 'Please select an image file.'
        });
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          icon: 'error',
          title: 'File Too Large',
          text: 'Please select an image smaller than 5MB.'
        });
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmitCreate = (data) => {
    createClubMutation.mutate(data);
  };

  const onSubmitEdit = (data) => {
    if (editingClub) {
      updateClubMutation.mutate({ id: editingClub.id, data });
    }
  };

  const openCreateModal = () => {
    reset();
    // Set default category to first available category from backend (use name, not displayName)
    const defaultCategory = backendCategories.length > 0 ? backendCategories[0].name : '';
    setValue('category', defaultCategory);
    setImagePreview(null);
    setSelectedImage(null);
    setShowCreateModal(true);
  };

  const closeModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setEditingClub(null);
    reset();
    setImagePreview(null);
    setSelectedImage(null);
  };

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <ManagerSidebar />

      {/* Main Content */}
      <main className="flex flex-1 flex-col overflow-y-auto bg-background-light dark:bg-background-dark">
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 lg:hidden">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">spa</span>
            <span className="text-lg font-bold">ClubMgr</span>
          </div>
          <button className="rounded-full bg-surface-dark p-2 text-white">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>

        <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col p-4 lg:p-10">
          {/* Page Heading & Actions */}
          <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl font-black leading-tight tracking-tight text-white md:text-5xl">My Clubs</h1>
              <p className="text-base text-[#9eb7a8]">View and manage your active communities</p>
            </div>
            <button 
              onClick={openCreateModal}
              className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-[#111714] shadow-lg shadow-primary/20 transition-transform hover:scale-105 active:scale-95"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              Create New Club
            </button>
          </div>

          {/* Filters & Search */}
          <div className="mb-8 flex flex-col gap-4 xl:flex-row xl:items-center">
            {/* Search Bar */}
            <div className="relative flex h-12 w-full max-w-md items-center rounded-xl bg-surface-dark transition-colors focus-within:bg-surface-hover">
              <div className="flex h-full w-12 items-center justify-center text-[#9eb7a8]">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input
                className="h-full flex-1 bg-transparent pr-4 text-base font-medium text-white placeholder-[#5d7365] focus:outline-none"
                placeholder="Search clubs by name..."
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {/* Filter Chips */}
            <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 xl:pb-0">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setCategoryFilter(category)}
                  className={`flex h-10 items-center justify-center rounded-full px-5 text-sm font-medium transition-colors ${
                    categoryFilter === category
                      ? 'bg-primary text-background-dark font-bold'
                      : 'bg-surface-dark text-[#9eb7a8] hover:bg-surface-hover hover:text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
              {!showAllCategories && allCategories.length > 4 && (
                <button
                  onClick={() => setShowAllCategories(true)}
                  className="flex h-10 items-center justify-center gap-1 rounded-full px-5 text-sm font-medium bg-surface-dark text-[#9eb7a8] hover:bg-surface-hover hover:text-white transition-colors"
                >
                  See more
                  <span className="material-symbols-outlined text-base">expand_more</span>
                </button>
              )}
              {showAllCategories && allCategories.length > 4 && (
                <button
                  onClick={() => setShowAllCategories(false)}
                  className="flex h-10 items-center justify-center gap-1 rounded-full px-5 text-sm font-medium bg-surface-dark text-[#9eb7a8] hover:bg-surface-hover hover:text-white transition-colors"
                >
                  See less
                  <span className="material-symbols-outlined text-base">expand_less</span>
                </button>
              )}
            </div>
          </div>

          {/* Grid Layout */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-red-400">Error loading clubs. Please try again.</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
              {clubs.map((club) => (
                <div
                  key={club.id}
                  className="group relative flex flex-col overflow-hidden rounded-xl bg-surface-dark shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5"
                >
                  {/* Image */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-dark to-transparent opacity-60"></div>
                    {club.image ? (
                      <div
                        className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{ backgroundImage: `url("${club.image}")` }}
                      ></div>
                    ) : (
                      <div className="h-full w-full bg-primary/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-6xl text-primary/50">groups</span>
                      </div>
                    )}
                    <div className="absolute right-4 top-4 rounded-full bg-black/40 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                      {club.category}
                    </div>
                  </div>
                  {/* Content */}
                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <h3 className="mb-1 text-xl font-bold text-white">{club.name}</h3>
                        <p className="text-sm text-[#9eb7a8]">{club.schedule || club.description}</p>
                      </div>
                      <div className="relative">
                        <button 
                          onClick={() => setDeleteMenuOpen(deleteMenuOpen === club.id ? null : club.id)}
                          className="text-[#9eb7a8] hover:text-white transition-colors"
                        >
                          <span className="material-symbols-outlined">more_vert</span>
                        </button>
                        {deleteMenuOpen === club.id && (
                          <div className="absolute right-0 top-8 z-50 w-48 bg-surface-dark rounded-xl border border-border-dark shadow-lg overflow-hidden">
                            <button
                              onClick={() => {
                                setDeleteMenuOpen(null);
                                Swal.fire({
                                  title: 'Delete Club?',
                                  text: `Are you sure you want to delete "${club.name}"? This action cannot be undone.`,
                                  icon: 'warning',
                                  showCancelButton: true,
                                  confirmButtonColor: '#ef4444',
                                  cancelButtonColor: '#6b7280',
                                  confirmButtonText: 'Yes, Delete',
                                  cancelButtonText: 'Cancel',
                                  reverseButtons: true
                                }).then((result) => {
                                  if (result.isConfirmed) {
                                    deleteClubMutation.mutate(club.id);
                                  }
                                });
                              }}
                              className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                            >
                              <span className="material-symbols-outlined text-lg">delete</span>
                              Delete Club
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Stats */}
                    <div className="mb-6 grid grid-cols-2 gap-4 rounded-lg bg-black/20 p-3">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[20px]">group</span>
                        <div>
                          <p className="text-xs text-[#9eb7a8]">Members</p>
                          <p className="text-sm font-bold text-white">{club.memberCount || 0}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {club.upcomingEventCount > 0 ? (
                          <>
                            <span className="material-symbols-outlined text-primary text-[20px]">event</span>
                            <div>
                              <p className="text-xs text-[#9eb7a8]">Events</p>
                              <p className="text-sm font-bold text-white">{club.upcomingEventCount} Upcoming</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-[#9eb7a8] text-[20px]">event_busy</span>
                            <div>
                              <p className="text-xs text-[#9eb7a8]">Events</p>
                              <p className="text-sm font-bold text-white">None</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    {/* Actions */}
                    <div className="mt-auto flex gap-3">
                      <button
                        onClick={() => handleManageClub(club.id)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary py-2.5 text-sm font-bold text-[#111714] transition-colors hover:bg-[#2ecc71]"
                      >
                        Manage
                      </button>
                      <button
                        onClick={() => handleCreateEvent(club.id)}
                        className="flex size-10 items-center justify-center rounded-full border border-white/10 text-white transition-colors hover:bg-white/10"
                        title="Quick Event"
                      >
                        <span className="material-symbols-outlined text-[20px]">add_circle</span>
                      </button>
                      <button
                        onClick={() => handleEditClub(club)}
                        className="flex size-10 items-center justify-center rounded-full border border-white/10 text-white transition-colors hover:bg-white/10"
                        title="Edit Details"
                      >
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {/* Add New Club Card */}
              <button
                onClick={openCreateModal}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-dashed border-white/10 bg-transparent shadow-sm transition-all hover:border-primary/50 cursor-pointer"
              >
                <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-4 p-8 text-center">
                  <div className="flex size-16 items-center justify-center rounded-full bg-surface-dark text-[#9eb7a8] transition-colors group-hover:bg-primary group-hover:text-background-dark">
                    <span className="material-symbols-outlined text-3xl">add</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Start a New Club</h3>
                    <p className="mt-1 text-sm text-[#9eb7a8]">Build a community around your passion</p>
                  </div>
                </div>
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Create Club Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-surface-dark rounded-2xl border border-border-dark shadow-2xl">
            <div className="sticky top-0 bg-surface-dark border-b border-border-dark p-6 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-white">Create New Club</h2>
              <button
                onClick={closeModals}
                className="text-text-secondary hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmitCreate)} className="p-6 space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Club Image</label>
                <div className="flex items-center gap-4">
                  {imagePreview ? (
                    <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-border-dark">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setSelectedImage(null);
                          setValue('image', '');
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </div>
                  ) : (
                    <div className="w-32 h-32 rounded-xl border-2 border-dashed border-border-dark flex items-center justify-center bg-surface-highlight">
                      <span className="material-symbols-outlined text-4xl text-text-secondary">image</span>
                    </div>
                  )}
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="club-image-upload"
                    />
                    <label
                      htmlFor="club-image-upload"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-highlight text-white hover:bg-surface-highlight/80 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-lg">upload</span>
                      Upload Image
                    </label>
                    <p className="text-xs text-text-secondary mt-1">Max 5MB, JPG/PNG</p>
                  </div>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Club Name *</label>
                <input
                  {...register('name', { required: 'Club name is required' })}
                  type="text"
                  className="w-full px-4 py-3 rounded-lg bg-surface-highlight border border-border-dark text-white placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter club name"
                />
                {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Description</label>
                <textarea
                  {...register('description')}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-surface-highlight border border-border-dark text-white placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Describe your club..."
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Category *</label>
                <select
                  {...register('category', { required: 'Category is required' })}
                  className="w-full px-4 py-3 rounded-lg bg-surface-highlight border border-border-dark text-white focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                  style={{ 
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem',
                    backgroundColor: '#1c2620'
                  }}
                >
                  {backendCategories.map(cat => (
                    <option key={cat.id} value={cat.name} style={{ backgroundColor: '#1c2620', color: '#ffffff' }}>
                      {cat.displayName || cat.name}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="text-red-400 text-sm mt-1">{errors.category.message}</p>}
              </div>

              {/* Schedule */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Schedule</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-lg pointer-events-none" style={{ color: '#ffffff' }}>calendar_today</span>
                  <input
                    {...register('schedule')}
                    type="datetime-local"
                    className="w-full pl-12 pr-4 py-3 rounded-lg bg-surface-highlight border border-border-dark text-white placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Select date and time"
                  />
                </div>
                <p className="text-xs text-text-secondary mt-1">Or enter a recurring schedule like "Every Saturday, 10:00 AM"</p>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Location</label>
                <input
                  {...register('location')}
                  type="text"
                  className="w-full px-4 py-3 rounded-lg bg-surface-highlight border border-border-dark text-white placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="City, Country"
                />
              </div>

              {/* Membership Fee */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Membership Fee (৳)</label>
                <input
                  {...register('fee', { min: 0 })}
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 rounded-lg bg-surface-highlight border border-border-dark text-white placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="0.00"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModals}
                  className="flex-1 px-6 py-3 rounded-lg bg-surface-highlight text-white hover:bg-surface-highlight/80 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createClubMutation.isLoading || isUploadingImage}
                  className="flex-1 px-6 py-3 rounded-lg bg-primary text-background-dark hover:bg-primary-hover transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploadingImage ? 'Uploading...' : createClubMutation.isLoading ? 'Creating...' : 'Create Club'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Club Modal */}
      {showEditModal && editingClub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-surface-dark rounded-2xl border border-border-dark shadow-2xl">
            <div className="sticky top-0 bg-surface-dark border-b border-border-dark p-6 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-white">Edit Club</h2>
              <button
                onClick={closeModals}
                className="text-text-secondary hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmitEdit)} className="p-6 space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Club Image</label>
                <div className="flex items-center gap-4">
                  {imagePreview ? (
                    <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-border-dark">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setSelectedImage(null);
                          setValue('image', editingClub.image || '');
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </div>
                  ) : (
                    <div className="w-32 h-32 rounded-xl border-2 border-dashed border-border-dark flex items-center justify-center bg-surface-highlight">
                      <span className="material-symbols-outlined text-4xl text-text-secondary">image</span>
                    </div>
                  )}
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="club-image-edit-upload"
                    />
                    <label
                      htmlFor="club-image-edit-upload"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-highlight text-white hover:bg-surface-highlight/80 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-lg">upload</span>
                      {imagePreview ? 'Change Image' : 'Upload Image'}
                    </label>
                    <p className="text-xs text-text-secondary mt-1">Max 5MB, JPG/PNG</p>
                  </div>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Club Name *</label>
                <input
                  {...register('name', { required: 'Club name is required' })}
                  type="text"
                  className="w-full px-4 py-3 rounded-lg bg-surface-highlight border border-border-dark text-white placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter club name"
                />
                {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Description</label>
                <textarea
                  {...register('description')}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-surface-highlight border border-border-dark text-white placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Describe your club..."
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Category *</label>
                <select
                  {...register('category', { required: 'Category is required' })}
                  className="w-full px-4 py-3 rounded-lg bg-surface-highlight border border-border-dark text-white focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                  style={{ 
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem',
                    backgroundColor: '#1c2620'
                  }}
                >
                  {backendCategories.map(cat => (
                    <option key={cat.id} value={cat.name} style={{ backgroundColor: '#1c2620', color: '#ffffff' }}>
                      {cat.displayName || cat.name}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="text-red-400 text-sm mt-1">{errors.category.message}</p>}
              </div>

              {/* Schedule */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Schedule</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-lg pointer-events-none" style={{ color: '#ffffff' }}>calendar_today</span>
                  <input
                    {...register('schedule')}
                    type="datetime-local"
                    className="w-full pl-12 pr-4 py-3 rounded-lg bg-surface-highlight border border-border-dark text-white placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Select date and time"
                  />
                </div>
                <p className="text-xs text-text-secondary mt-1">Or enter a recurring schedule like "Every Saturday, 10:00 AM"</p>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Location</label>
                <input
                  {...register('location')}
                  type="text"
                  className="w-full px-4 py-3 rounded-lg bg-surface-highlight border border-border-dark text-white placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="City, Country"
                />
              </div>

              {/* Membership Fee */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Membership Fee (৳)</label>
                <input
                  {...register('fee', { min: 0 })}
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 rounded-lg bg-surface-highlight border border-border-dark text-white placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="0.00"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModals}
                  className="flex-1 px-6 py-3 rounded-lg bg-surface-highlight text-white hover:bg-surface-highlight/80 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateClubMutation.isLoading || isUploadingImage}
                  className="flex-1 px-6 py-3 rounded-lg bg-primary text-background-dark hover:bg-primary-hover transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploadingImage ? 'Uploading...' : updateClubMutation.isLoading ? 'Updating...' : 'Update Club'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerMyClubs;


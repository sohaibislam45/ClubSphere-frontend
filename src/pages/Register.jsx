import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Swal from '../lib/sweetalertConfig';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const { register: registerForm, handleSubmit, watch, formState: { errors } } = useForm();
  const { register: registerUser, loginWithGoogle } = useAuth();
  const password = watch('password', '');

  useEffect(() => {
    document.title = 'Register - ClubSphere';
  }, []);

  // Password validation rules
  const passwordRules = {
    minLength: password.length >= 6,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  };

  // Handle photo file selection
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid File',
          text: 'Please select an image file.',
        });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          icon: 'error',
          title: 'File Too Large',
          text: 'Please select an image smaller than 5MB.',
        });
        return;
      }

      setSelectedPhoto(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload photo to ImgBB
  const uploadPhotoToImgBB = async (file) => {
    const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
    if (!apiKey) {
      // Return null if API key is not configured - photo is optional
      console.warn('ImgBB API key is not configured. Skipping photo upload.');
      return null;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || 'Failed to upload image');
      }

      const data = await response.json();
      if (data.success && data.data && data.data.url) {
        return data.data.url;
      } else {
        throw new Error('Failed to get image URL from ImgBB');
      }
    } catch (error) {
      // If upload fails, log error but don't block registration (photo is optional)
      console.error('Photo upload failed:', error);
      return null;
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    let photoURL = null;

    try {
      // Upload photo to ImgBB if a photo is selected AND API key is configured
      if (selectedPhoto && import.meta.env.VITE_IMGBB_API_KEY) {
        setIsUploadingPhoto(true);
        try {
          photoURL = await uploadPhotoToImgBB(selectedPhoto);
        } catch (error) {
          // Silently skip photo upload if it fails - photo is optional
          console.warn('Photo upload failed, continuing without photo:', error);
        } finally {
          setIsUploadingPhoto(false);
        }
      }

      // Register user with photo URL (can be null if no photo or upload failed)
      const result = await registerUser(data.email, data.password, data.name, 'member', photoURL);
      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful!',
          text: 'Welcome to ClubSphere!',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: result.error || 'Something went wrong. Please try again.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: error.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    try {
      const result = await loginWithGoogle();
      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful!',
          text: 'Welcome to ClubSphere!',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Google Sign-Up Failed',
          text: result.error || 'Something went wrong. Please try again.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Google Sign-Up Failed',
        text: error.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white min-h-screen flex flex-col overflow-x-hidden">
      {/* Navigation */}
      <header className="w-full border-b border-[#29382f] bg-background-dark-alt/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="size-8 text-primary">
              <svg className="w-full h-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_6_543)">
                  <path d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z" fill="currentColor"></path>
                  <path clipRule="evenodd" d="M7.24189 26.4066C7.31369 26.4411 7.64204 26.5637 8.52504 26.3738C9.59462 26.1438 11.0343 25.5311 12.7183 24.4963C14.7583 23.2426 17.0256 21.4503 19.238 19.238C21.4503 17.0256 23.2426 14.7583 24.4963 12.7183C25.5311 11.0343 26.1438 9.59463 26.3738 8.52504C26.5637 7.64204 26.4411 7.31369 26.4066 7.24189C26.345 7.21246 26.143 7.14535 25.6664 7.1918C24.9745 7.25925 23.9954 7.5498 22.7699 8.14278C20.3369 9.32007 17.3369 11.4915 14.4142 14.4142C11.4915 17.3369 9.32007 20.3369 8.14278 22.7699C7.5498 23.9954 7.25925 24.9745 7.1918 25.6664C7.14534 26.143 7.21246 26.345 7.24189 26.4066ZM29.9001 10.7285C29.4519 12.0322 28.7617 13.4172 27.9042 14.8126C26.465 17.1544 24.4686 19.6641 22.0664 22.0664C19.6641 24.4686 17.1544 26.465 14.8126 27.9042C13.4172 28.7617 12.0322 29.4519 10.7285 29.9001L21.5754 40.747C21.6001 40.7606 21.8995 40.931 22.8729 40.7217C23.9424 40.4916 25.3821 39.879 27.0661 38.8441C29.1062 37.5904 31.3734 35.7982 33.5858 33.5858C35.7982 31.3734 37.5904 29.1062 38.8441 27.0661C39.879 25.3821 40.4916 23.9425 40.7216 22.8729C40.931 21.8995 40.7606 21.6001 40.747 21.5754L29.9001 10.7285ZM29.2403 4.41187L43.5881 18.7597C44.9757 20.1473 44.9743 22.1235 44.6322 23.7139C44.2714 25.3919 43.4158 27.2666 42.252 29.1604C40.8128 31.5022 38.8165 34.012 36.4142 36.4142C34.012 38.8165 31.5022 40.8128 29.1604 42.252C27.2666 43.4158 25.3919 44.2714 23.7139 44.6322C22.1235 44.9743 20.1473 44.9757 18.7597 43.5881L4.41187 29.2403C3.29027 28.1187 3.08209 26.5973 3.21067 25.2783C3.34099 23.9415 3.8369 22.4852 4.54214 21.0277C5.96129 18.0948 8.43335 14.7382 11.5858 11.5858C14.7382 8.43335 18.0948 5.9613 21.0277 4.54214C22.4852 3.8369 23.9415 3.34099 25.2783 3.21067C26.5973 3.08209 28.1187 3.29028 29.2403 4.41187Z" fill="currentColor" fillRule="evenodd"></path>
                </g>
                <defs>
                  <clipPath id="clip0_6_543"><rect fill="white" height="48" width="48"></rect></clipPath>
                </defs>
              </svg>
            </div>
            <h2 className="text-white text-xl font-bold tracking-tight">ClubSphere</h2>
          </Link>
          <Link to="/login" className="flex items-center justify-center rounded-full h-10 px-6 bg-[#29382f] hover:bg-[#34483c] transition-colors text-white text-sm font-bold border border-[#3e5246]">
            <span className="truncate">Log In</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Left Column: Branding / Image */}
          <div className="hidden lg:flex flex-col gap-6 sticky top-28">
            <div className="relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden group shadow-2xl shadow-primary/10">
              <img
                alt="Group of friends laughing and talking"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7qjkrhKh3UM82MQWVJi7E71EdEs0FN9y-dQGGk1nq2soAKpHEVt4P66krXc8W9-p47DhAT_e49NIzr5USOP3NAl5yjOSJqRoNPHByFYFs0TqUziNxRyNkL4MmS0mc-G-piR3F9F69--s9z_Up_-zcM616ST0Qy2llGVviAotqSbKD6l3PP26QPQCDwEIMOJPxwTD3yyRIjboVE_UyXkvLoM2VmS-Xv-z3Z7xr3RWoT56F7Vz06J6waeFh4TlLpezGLBwH4ayGaQxT"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background-dark/90 via-transparent to-transparent p-8 flex flex-col justify-end">
                <h1 className="text-4xl font-bold text-white mb-2 leading-tight">Join the club.</h1>
                <p className="text-gray-300 text-lg">Connect with people who share your passions and discover local events happening right now.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl-alt bg-surface-dark-alt3 border border-[#29382f]">
              <div className="flex -space-x-3">
                {[...Array(3)].map((_, i) => (
                  <img
                    key={i}
                    alt={`User avatar ${i + 1}`}
                    className="w-10 h-10 rounded-full border-2 border-[#1e2a23]"
                    src={`https://via.placeholder.com/40?text=U${i + 1}`}
                  />
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-[#1e2a23] bg-primary flex items-center justify-center text-[#111714] font-bold text-xs">+2k</div>
              </div>
              <div>
                <p className="text-white font-bold text-sm">Active Members</p>
                <p className="text-white/60 text-xs">Joining daily</p>
              </div>
            </div>
          </div>

          {/* Right Column: Registration Form */}
          <div className="flex flex-col w-full max-w-[520px] mx-auto lg:mx-0">
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-white text-3xl font-bold leading-tight tracking-[-0.015em] mb-2">Create your Account</h2>
              <p className="text-gray-400 text-base">Start your journey with ClubSphere today.</p>
            </div>

            {/* Google Auth */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={isGoogleLoading || isLoading}
              className="group relative flex w-full items-center justify-center gap-3 rounded-full bg-white hover:bg-gray-100 transition-all h-14 text-[#111714] font-bold text-base mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
              </svg>
              <span>{isGoogleLoading ? 'Signing up...' : 'Sign up with Google'}</span>
            </button>

            <div className="relative flex items-center gap-4 py-4 mb-6">
              <div className="h-px bg-[#29382f] flex-1"></div>
              <span className="text-sm font-medium text-gray-500">OR REGISTER WITH EMAIL</span>
              <div className="h-px bg-[#29382f] flex-1"></div>
            </div>

            <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
              {/* Name */}
              <label className="flex flex-col gap-2">
                <span className="text-white text-sm font-medium ml-1">Full Name</span>
                <div className="relative">
                  <input
                    className={`w-full bg-surface-dark-alt3 text-white border-2 ${
                      errors.name ? 'border-red-500' : 'border-transparent focus:border-primary'
                    } focus:ring-0 rounded-full h-14 px-6 placeholder:text-[#5a7063] transition-all outline-none`}
                    placeholder="Enter your full name"
                    type="text"
                    {...registerForm('name', {
                      required: 'Name is required',
                      minLength: {
                        value: 2,
                        message: 'Name must be at least 2 characters'
                      }
                    })}
                  />
                  <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-[#5a7063]">person</span>
                </div>
                {errors.name && (
                  <p className="text-red-500 text-xs ml-1">{errors.name.message}</p>
                )}
              </label>

              {/* Email */}
              <label className="flex flex-col gap-2">
                <span className="text-white text-sm font-medium ml-1">Email Address</span>
                <div className="relative">
                  <input
                    className={`w-full bg-surface-dark-alt3 text-white border-2 ${
                      errors.email ? 'border-red-500' : 'border-transparent focus:border-primary'
                    } focus:ring-0 rounded-full h-14 px-6 placeholder:text-[#5a7063] transition-all outline-none`}
                    placeholder="name@example.com"
                    type="email"
                    {...registerForm('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                  />
                  <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-[#5a7063]">mail</span>
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs ml-1">{errors.email.message}</p>
                )}
              </label>

              {/* Photo Upload & Preview */}
              <div className="flex gap-4 items-end">
                <label className="flex flex-col gap-2 flex-1">
                  <span className="text-white text-sm font-medium ml-1">
                    Profile Photo
                  </span>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      disabled={isUploadingPhoto}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label
                      htmlFor="photo-upload"
                      className={`flex items-center justify-center gap-2 w-full bg-surface-dark-alt3 text-white border-2 border-transparent focus:border-primary focus:ring-0 rounded-full h-14 px-6 cursor-pointer hover:bg-[#29382f] transition-all ${isUploadingPhoto ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <span className="material-symbols-outlined text-[#5a7063]">photo_camera</span>
                      <span className="text-sm font-medium">
                        {selectedPhoto ? selectedPhoto.name : 'Choose a photo'}
                      </span>
                    </label>
                  </div>
                  {isUploadingPhoto && (
                    <p className="text-primary text-xs ml-1">Uploading photo...</p>
                  )}
                </label>
                <div className="flex-shrink-0 size-14 rounded-full bg-surface-dark-alt3 border border-[#29382f] flex items-center justify-center overflow-hidden">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-[#5a7063] text-3xl">account_circle</span>
                  )}
                </div>
              </div>

              {/* Password */}
              <label className="flex flex-col gap-2">
                <span className="text-white text-sm font-medium ml-1">Password</span>
                <div className="relative">
                  <input
                    className={`w-full bg-surface-dark-alt3 text-white border-2 ${
                      errors.password ? 'border-red-500' : 'border-transparent focus:border-primary'
                    } focus:ring-0 rounded-full h-14 px-6 placeholder:text-[#5a7063] transition-all outline-none pr-12`}
                    placeholder="Create a secure password"
                    type={showPassword ? 'text' : 'password'}
                    {...registerForm('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      },
                      validate: {
                        hasUppercase: (value) => /[A-Z]/.test(value) || 'Password must contain at least one uppercase letter',
                        hasLowercase: (value) => /[a-z]/.test(value) || 'Password must contain at least one lowercase letter',
                      }
                    })}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-[#5a7063] hover:text-white transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined">
                      {showPassword ? 'visibility' : 'visibility_off'}
                    </span>
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs ml-1">{errors.password.message}</p>
                )}
              </label>

              {/* Validation Rules */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 px-2 mb-2">
                <div className={`flex items-center gap-2 text-xs font-medium ${
                  passwordRules.minLength ? 'text-primary' : 'text-[#5a7063]'
                }`}>
                  <span className={`material-symbols-outlined text-[16px] ${
                    passwordRules.minLength ? 'fill-current' : ''
                  }`}>
                    {passwordRules.minLength ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  <span>Min 6 characters</span>
                </div>
                <div className={`flex items-center gap-2 text-xs font-medium ${
                  passwordRules.hasUppercase ? 'text-primary' : 'text-[#5a7063]'
                }`}>
                  <span className={`material-symbols-outlined text-[16px] ${
                    passwordRules.hasUppercase ? 'fill-current' : ''
                  }`}>
                    {passwordRules.hasUppercase ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  <span>At least 1 uppercase</span>
                </div>
                <div className={`flex items-center gap-2 text-xs font-medium ${
                  passwordRules.hasLowercase ? 'text-primary' : 'text-[#5a7063]'
                }`}>
                  <span className={`material-symbols-outlined text-[16px] ${
                    passwordRules.hasLowercase ? 'fill-current' : ''
                  }`}>
                    {passwordRules.hasLowercase ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  <span>At least 1 lowercase</span>
                </div>
                <div className={`flex items-center gap-2 text-xs font-medium ${
                  passwordRules.hasNumber ? 'text-primary' : 'text-[#5a7063]'
                }`}>
                  <span className={`material-symbols-outlined text-[16px] ${
                    passwordRules.hasNumber ? 'fill-current' : ''
                  }`}>
                    {passwordRules.hasNumber ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  <span>At least 1 number</span>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading || isUploadingPhoto}
                className="w-full rounded-full bg-primary h-14 text-[#111714] font-bold text-lg hover:bg-[#32c96e] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(56,224,123,0.2)] mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploadingPhoto ? 'Uploading Photo...' : isLoading ? 'Creating Account...' : 'Create Account'}
              </button>

              <p className="text-center text-gray-400 text-sm mt-2">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:text-[#32c96e] font-bold hover:underline">
                  Sign In
                </Link>
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;


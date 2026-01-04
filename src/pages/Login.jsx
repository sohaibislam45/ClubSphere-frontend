import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Swal from '../lib/sweetalertConfig';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const returnTo = location.state?.returnTo || null;

  useEffect(() => {
    document.title = 'Login - ClubSphere';
  }, []);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const { login, loginWithGoogle } = useAuth();

  const handleDemoLogin = async (email, password) => {
    setIsLoading(true);
    try {
      const result = await login(email, password, returnTo);
      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: 'Login Successful!',
          text: 'Welcome back!',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: result.error || 'Invalid email or password',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await login(data.email, data.password, returnTo);
      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: 'Login Successful!',
          text: 'Welcome back!',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: result.error || 'Invalid email or password',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const result = await loginWithGoogle(returnTo);
      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: 'Login Successful!',
          text: 'Welcome back!',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Google Sign-In Failed',
          text: result.error || 'Something went wrong. Please try again.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Google Sign-In Failed',
        text: error.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full bg-background-light dark:bg-background-dark text-slate-900 dark:text-white antialiased overflow-x-hidden">
      {/* Left Section: Visual / Hero */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-10 bg-surface-dark overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center opacity-60 mix-blend-overlay"
            style={{
              backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBvCULZwDoWJg1mlEOI4ZYr7Ld8ayuSIk77OUeYMFizyx0xCj8d7QgCMbOaqT9qu5n9CsP3jUn7MpiJa2cEejJlkegmSf3yY50dSmz1ReNfPb-MNKMSaunodLAmY3qZWyfySNGuJzXXupepAo5RpHX5yAy1tK-v-lCGqSW7WVuFsoihuBxWQvC69FF3A8SxeWQO61a8GWXHoZRgZYLMe_RBSSEQ7RxH9J0L3w4EPGokWhhl4GU1zTzjTxI8C24F7GlTr2aOPmscAA8U')"
            }}
          ></div>
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-background-dark/30 to-background-dark/90"></div>
          <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
        </div>
        
        {/* Content over image */}
        <div className="relative z-10 flex items-center gap-3 text-white">
          <div className="size-8 text-primary">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_6_543)">
                <path d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z" fill="currentColor"></path>
                <path clipRule="evenodd" d="M7.24189 26.4066C7.31369 26.4411 7.64204 26.5637 8.52504 26.3738C9.59462 26.1438 11.0343 25.5311 12.7183 24.4963C14.7583 23.2426 17.0256 21.4503 19.238 19.238C21.4503 17.0256 23.2426 14.7583 24.4963 12.7183C25.5311 11.0343 26.1438 9.59463 26.3738 8.52504C26.5637 7.64204 26.4411 7.31369 26.4066 7.24189C26.345 7.21246 26.143 7.14535 25.6664 7.1918C24.9745 7.25925 23.9954 7.5498 22.7699 8.14278C20.3369 9.32007 17.3369 11.4915 14.4142 14.4142C11.4915 17.3369 9.32007 20.3369 8.14278 22.7699C7.5498 23.9954 7.25925 24.9745 7.1918 25.6664C7.14534 26.143 7.21246 26.345 7.24189 26.4066ZM29.9001 10.7285C29.4519 12.0322 28.7617 13.4172 27.9042 14.8126C26.465 17.1544 24.4686 19.6641 22.0664 22.0664C19.6641 24.4686 17.1544 26.465 14.8126 27.9042C13.4172 28.7617 12.0322 29.4519 10.7285 29.9001L21.5754 40.747C21.6001 40.7606 21.8995 40.931 22.8729 40.7217C23.9424 40.4916 25.3821 39.879 27.0661 38.8441C29.1062 37.5904 31.3734 35.7982 33.5858 33.5858C35.7982 31.3734 37.5904 29.1062 38.8441 27.0661C39.879 25.3821 40.4916 23.9425 40.7216 22.8729C40.931 21.8995 40.7606 21.6001 40.747 21.5754L29.9001 10.7285ZM29.2403 4.41187L43.5881 18.7597C44.9757 20.1473 44.9743 22.1235 44.6322 23.7139C44.2714 25.3919 43.4158 27.2666 42.252 29.1604C40.8128 31.5022 38.8165 34.012 36.4142 36.4142C34.012 38.8165 31.5022 40.8128 29.1604 42.252C27.2666 43.4158 25.3919 44.2714 23.7139 44.6322C22.1235 44.9743 20.1473 44.9757 18.7597 43.5881L4.41187 29.2403C3.29027 28.1187 3.08209 26.5973 3.21067 25.2783C3.34099 23.9415 3.8369 22.4852 4.54214 21.0277C5.96129 18.0948 8.43335 14.7382 11.5858 11.5858C14.7382 8.43335 18.0948 5.9613 21.0277 4.54214C22.4852 3.8369 23.9415 3.34099 25.2783 3.21067C26.5973 3.08209 28.1187 3.29028 29.2403 4.41187Z" fill="currentColor" fillRule="evenodd"></path>
              </g>
              <defs>
                <clipPath id="clip0_6_543"><rect fill="white" height="48" width="48"></rect></clipPath>
              </defs>
            </svg>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">ClubSphere</h2>
        </div>
        
        <div className="relative z-10 max-w-lg mt-auto mb-10">
          <blockquote className="text-2xl font-medium leading-relaxed mb-4">
            "ClubSphere completely transformed how I find local events. The community is vibrant and welcoming."
          </blockquote>
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-full bg-cover bg-center"
              style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDBZ6CDB3iArjU_tvxrCupBUfSulecrz0Y9qLtIP8e3AcjWj4CPqyZd_o9WvE_-caFh2Kl8jlU4JL3YcpV7C1S8qDZm7jzPy-Umx63LT8vZJyrigp5I_aZLIUqO8HeDb66gFGZy4NqMMGkLQDd3QniZ8Z3M6H704nriZyvne7BNUopiiyqGNIsttPAvyWb6gvNd9K-L0_7pqdQ5Q4rsnY07Yui944jqM2dQq4-wbrku73IXnLPhq-yrJ-7VBoDiFVDb3p7M7HKnAPJc')" }}
            ></div>
            <div>
              <p className="font-bold">Alex Chen</p>
              <p className="text-text-muted text-sm">Community Organizer</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-20 bg-background-light dark:bg-background-dark">
        <div className="w-full max-w-[440px] flex flex-col gap-8">
          {/* Mobile Branding */}
          <div className="lg:hidden flex items-center gap-2 text-white mb-4">
            <div className="size-6 text-primary">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z" fill="currentColor"></path>
              </svg>
            </div>
            <span className="font-bold text-lg">ClubSphere</span>
          </div>

          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-4xl font-black leading-tight tracking-[-0.033em] text-white">
              Welcome Back
            </h1>
            <p className="text-text-muted text-base font-normal">
              Discover your next community and manage your events.
            </p>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-white text-sm font-medium leading-normal ml-1" htmlFor="email">
                Email Address
              </label>
              <div className="relative flex items-center w-full group">
                <div className="absolute left-4 text-text-muted flex items-center justify-center pointer-events-none transition-colors group-focus-within:text-primary">
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>mail</span>
                </div>
                <input
                  className={`form-input flex w-full h-14 pl-12 pr-4 rounded-full bg-surface-dark border ${
                    errors.email ? 'border-red-500' : 'border-border-dark-alt'
                  } text-white placeholder:text-text-muted focus:outline-0 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200`}
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs ml-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-white text-sm font-medium leading-normal" htmlFor="password">
                  Password
                </label>
              </div>
              <div className="relative flex items-center w-full group">
                <div className="absolute left-4 text-text-muted flex items-center justify-center pointer-events-none transition-colors group-focus-within:text-primary">
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>lock</span>
                </div>
                <input
                  className={`form-input flex w-full h-14 pl-12 pr-12 rounded-full bg-surface-dark border ${
                    errors.password ? 'border-red-500' : 'border-border-dark-alt'
                  } text-white placeholder:text-text-muted focus:outline-0 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200`}
                  id="password"
                  placeholder="Enter your password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                />
                <button
                  type="button"
                  className="absolute right-4 text-text-muted hover:text-white transition-colors flex items-center justify-center cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                    {showPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs ml-1">{errors.password.message}</p>
              )}
              <div className="flex justify-end mt-1 px-2">
                <a className="text-sm font-medium text-primary hover:text-primary/80 transition-colors" href="#">
                  Forgot Password?
                </a>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full cursor-pointer items-center justify-center rounded-full h-12 px-5 bg-primary hover:bg-primary/90 hover:scale-[1.01] active:scale-[0.99] transition-all text-background-dark text-base font-bold leading-normal tracking-[0.015em] mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>

            {/* Divider */}
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-border-dark-alt"></div>
              <span className="flex-shrink-0 mx-4 text-text-muted text-xs font-medium uppercase tracking-wider">Or</span>
              <div className="flex-grow border-t border-border-dark-alt"></div>
            </div>

            {/* Google Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading || isLoading}
              className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-full h-12 px-5 bg-white hover:bg-gray-100 transition-colors text-surface-dark text-base font-bold leading-normal tracking-[0.015em] border border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg aria-hidden="true" className="w-5 h-5" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <g fill="none" fillRule="evenodd">
                  <path d="M20.64 12.2c0-.63-.06-1.25-.16-1.84H12v3.49h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.92a8.78 8.78 0 0 0 2.68-6.62z" fill="#4285F4"></path>
                  <path d="M12 21a8.6 8.6 0 0 0 5.96-2.18l-2.91-2.26a5.41 5.41 0 0 1-8.09-2.85h-3v2.33A9 9 0 0 0 12 21z" fill="#34A853"></path>
                  <path d="M6.96 13.71a5.41 5.41 0 0 1 0-3.42V7.96h-3a9 9 0 0 0 0 8.08l3-2.33z" fill="#FBBC05"></path>
                  <path d="M12 4.8c1.32 0 2.5.45 3.44 1.34l2.58-2.58A9 9 0 0 0 3.96 7.96l3 2.33A5.36 5.36 0 0 1 12 4.8z" fill="#EA4335"></path>
                </g>
              </svg>
              {isGoogleLoading ? 'Signing in...' : 'Continue with Google'}
            </button>

            {/* Divider */}
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-border-dark-alt"></div>
              <span className="flex-shrink-0 mx-4 text-text-muted text-xs font-medium uppercase tracking-wider">Or</span>
              <div className="flex-grow border-t border-border-dark-alt"></div>
            </div>

            {/* Demo Credentials Tips */}
            <div className="bg-primary/10 dark:bg-primary/20 border border-primary/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-xl flex-shrink-0 mt-0.5">lightbulb</span>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-bold text-white">Quick Demo Login</p>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Use the demo buttons below to instantly log in as User, Manager, or Admin without registration. This saves time and lets you explore the platform immediately. The standard login and registration options above remain fully functional if you prefer to create your own account or explore those features.
                  </p>
                </div>
              </div>
            </div>

            {/* Demo Credentials Buttons */}
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => handleDemoLogin('demouser@gmail.com', 'User123')}
                disabled={isLoading || isGoogleLoading}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full h-12 px-5 bg-green-600 hover:bg-green-700 transition-colors text-white text-base font-bold leading-normal tracking-[0.015em] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-lg">person</span>
                Login as Demo User
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('demomanager@gmail.com', 'Manager123')}
                disabled={isLoading || isGoogleLoading}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full h-12 px-5 bg-blue-600 hover:bg-blue-700 transition-colors text-white text-base font-bold leading-normal tracking-[0.015em] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-lg">groups</span>
                Login as Demo Manager
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('demoadmin@gmail.com', 'Admin123')}
                disabled={isLoading || isGoogleLoading}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full h-12 px-5 bg-purple-600 hover:bg-purple-700 transition-colors text-white text-base font-bold leading-normal tracking-[0.015em] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
                Login as Demo Admin
              </button>
            </div>
          </form>

          {/* Footer */}
          <p className="text-center text-text-muted text-sm">
            New here?{' '}
            <Link to="/register" className="text-primary font-bold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;


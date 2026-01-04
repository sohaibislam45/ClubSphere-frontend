import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Check if a nav link is active
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

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

  // Get dashboard path based on user role
  const getDashboardPath = () => {
    if (!user) return '/';
    if (user.role === 'admin') return '/dashboard/admin';
    if (user.role === 'clubManager') return '/dashboard/club-manager';
    return '/dashboard/member';
  };

  // Toggle language between English and Bangla
  const toggleLanguage = () => {
    const newLang = currentLanguage === 'en' ? 'bn' : 'en';
    changeLanguage(newLang);
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background-light/90 dark:bg-background-dark/90 border-b border-gray-200 dark:border-border-dark">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
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
            <h2 className="text-xl font-bold leading-tight tracking-[-0.015em] text-gray-900 dark:text-white">ClubSphere</h2>
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link 
              to="/" 
              className={`text-sm font-medium leading-normal transition-colors ${
                isActive('/') && location.pathname === '/'
                  ? 'text-primary font-bold'
                  : 'text-gray-600 dark:text-gray-400 hover:text-primary'
              }`}
            >
              {t('nav.home')}
            </Link>
            <Link 
              to="/clubs" 
              className={`text-sm font-medium leading-normal transition-colors ${
                isActive('/clubs')
                  ? 'text-primary font-bold'
                  : 'text-gray-600 dark:text-gray-400 hover:text-primary'
              }`}
            >
              {t('nav.clubs')}
            </Link>
            <Link 
              to="/events" 
              className={`text-sm font-medium leading-normal transition-colors ${
                isActive('/events')
                  ? 'text-primary font-bold'
                  : 'text-gray-600 dark:text-gray-400 hover:text-primary'
              }`}
            >
              {t('nav.events')}
            </Link>
            <Link 
              to="/how-it-works" 
              className={`text-sm font-medium leading-normal transition-colors ${
                isActive('/how-it-works')
                  ? 'text-primary font-bold'
                  : 'text-gray-600 dark:text-gray-400 hover:text-primary'
              }`}
            >
              How It Works
            </Link>
            <Link 
              to="/about-us" 
              className={`text-sm font-medium leading-normal transition-colors ${
                isActive('/about-us')
                  ? 'text-primary font-bold'
                  : 'text-gray-600 dark:text-gray-400 hover:text-primary'
              }`}
            >
              About Us
            </Link>
            <Link 
              to="/careers" 
              className={`text-sm font-medium leading-normal transition-colors ${
                isActive('/careers')
                  ? 'text-primary font-bold'
                  : 'text-gray-600 dark:text-gray-400 hover:text-primary'
              }`}
            >
              Careers
            </Link>
            {user && (
              <Link 
                to={getDashboardPath()} 
                className={`text-sm font-medium leading-normal transition-colors ${
                  isActive('/dashboard')
                    ? 'text-primary font-bold'
                    : 'text-gray-600 dark:text-gray-400 hover:text-primary'
                }`}
              >
                {t('nav.dashboard')}
              </Link>
            )}
          </nav>
          
          {/* Language Toggle, Theme Toggle & Auth Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-transparent border border-gray-300 dark:border-[#29382f] text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#29382f] transition-colors"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <span className="material-symbols-outlined text-lg">
                {theme === 'dark' ? 'light_mode' : 'dark_mode'}
              </span>
            </button>

            {/* Language Toggle Button */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-transparent border border-gray-300 dark:border-[#29382f] text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#29382f] transition-colors text-sm font-medium"
              title={currentLanguage === 'en' ? 'বাংলা' : 'English'}
            >
              <span className="text-xs font-bold">{currentLanguage === 'en' ? 'বাংলা' : 'EN'}</span>
            </button>

            {user ? (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 group"
              >
                {user?.photoURL ? (
                  <img
                    key={user.photoURL}
                    src={user.photoURL}
                    alt={user?.name || 'User avatar'}
                    className="size-10 rounded-full object-cover border-2 border-transparent group-hover:border-primary transition-all shrink-0"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    onError={(e) => {
                      console.error('Failed to load user photo:', user.photoURL);
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
                  <span className="text-sm font-bold text-gray-900 dark:text-white leading-none group-hover:text-primary transition-colors">{user?.name || 'User'}</span>
                </div>
                <span className={`material-symbols-outlined text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-all hidden md:block ${dropdownOpen ? 'rotate-180' : ''}`}>expand_more</span>
              </button>
              
              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-white/10 shadow-lg z-50 overflow-hidden">
                  <div className="py-1">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-white/5">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{user?.name || 'User'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{user?.email || ''}</p>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors flex items-center gap-3"
                    >
                      <span className="material-symbols-outlined text-lg">logout</span>
                      <span>{t('nav.logout')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            ) : (
              <div className="flex gap-3">
                <Link to="/login" className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-6 bg-transparent border border-gray-300 dark:border-[#29382f] text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#29382f] transition-colors text-sm font-bold tracking-[0.015em]">
                  <span className="truncate">{t('nav.login')}</span>
                </Link>
                <Link to="/register" className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-6 bg-primary hover:bg-primary-hover transition-colors text-[#111714] text-sm font-bold tracking-[0.015em]">
                  <span className="truncate">{t('nav.register')}</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;


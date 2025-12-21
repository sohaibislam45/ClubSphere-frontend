import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Lottie from 'lottie-react';

const NotFound = ({ errorType = 'page' }) => {
  const navigate = useNavigate();
  const [animationData, setAnimationData] = useState(null);

  // Determine error type configuration
  const errorConfig = {
    page: {
      title: 'Page Not Found',
      description: 'It looks like the club you are looking for has disbanded, moved locations, or simply vanished into the digital void.',
      animationUrl: 'https://assets5.lottiefiles.com/packages/lf20_khtt8ejx.json',
      documentTitle: '404 - Page Not Found | ClubSphere'
    },
    club: {
      title: 'Club Not Found',
      description: 'The club you are looking for doesn\'t exist or has been removed.',
      animationUrl: 'https://assets5.lottiefiles.com/packages/lf20_khtt8ejx.json',
      documentTitle: 'Club Not Found | ClubSphere'
    },
    event: {
      title: 'Event Not Found',
      description: 'The event you are looking for doesn\'t exist or has been removed.',
      animationUrl: 'https://assets5.lottiefiles.com/packages/lf20_khtt8ejx.json',
      documentTitle: 'Event Not Found | ClubSphere'
    },
    unauthorized: {
      title: 'Unauthorized Access',
      description: 'You don\'t have permission to access this page. Please contact an administrator if you believe this is an error.',
      animationUrl: 'https://assets5.lottiefiles.com/packages/lf20_jcikwtux.json',
      documentTitle: 'Unauthorized Access | ClubSphere'
    }
  };

  const config = errorConfig[errorType] || errorConfig.page;

  useEffect(() => {
    document.title = config.documentTitle;
    
    // Load Lottie animation from a free animation
    // You can replace this URL with any Lottie animation JSON from LottieFiles.com
    fetch(config.animationUrl)
      .then(response => {
        if (!response.ok) throw new Error('Failed to load animation');
        return response.json();
      })
      .then(data => setAnimationData(data))
      .catch(error => {
        console.error('Error loading animation:', error);
        // Animation will gracefully fail and show fallback icon
      });
  }, [config.animationUrl, config.documentTitle]);

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="relative flex min-h-screen w-full bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display antialiased overflow-x-hidden">
      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-4 relative overflow-hidden w-full">
        {/* Decorative Background Element: Watermark */}
        {errorType !== 'unauthorized' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-[0.03]">
            <span className="text-[20rem] md:text-[30rem] font-bold text-white tracking-tighter leading-none">404</span>
          </div>
        )}

        <div className="z-10 flex flex-col items-center gap-8 max-w-2xl text-center">
          {/* Hero Illustration with Lottie Animation */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-emerald-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-surface-dark rounded-xl w-full sm:w-[480px] h-[360px] shadow-2xl border border-white/5 overflow-hidden flex items-center justify-center">
              {animationData ? (
                <Lottie
                  animationData={animationData}
                  loop={true}
                  autoplay={true}
                  style={{ width: '100%', height: '100%' }}
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full">
                  <div className="bg-background-dark/40 backdrop-blur-md p-4 rounded-full border border-white/10 shadow-lg">
                    <span className="material-symbols-outlined text-primary text-6xl">
                      {errorType === 'unauthorized' ? 'block' : 'link_off'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Error Message Content */}
          <div className="flex flex-col items-center gap-4 px-4">
            <h1 className="text-slate-900 dark:text-white text-3xl md:text-5xl font-bold leading-tight tracking-tight">
              {config.title}
            </h1>
            <p className="text-slate-500 dark:text-[#9eb7a8] text-base md:text-lg font-normal leading-relaxed max-w-[480px]">
              {config.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full justify-center">
              <button
                onClick={handleGoHome}
                className="group flex items-center justify-center gap-2 min-w-[160px] cursor-pointer rounded-full h-12 px-6 bg-primary hover:bg-emerald-400 text-background-dark text-base font-bold leading-normal transition-all duration-300 shadow-[0_0_20px_rgba(54,226,123,0.3)] hover:shadow-[0_0_30px_rgba(54,226,123,0.5)]"
              >
                <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
                <span>Go Back Home</span>
              </button>
              <Link
                to="/clubs"
                className="flex items-center justify-center gap-2 min-w-[160px] cursor-pointer rounded-full h-12 px-6 bg-white/5 hover:bg-white/10 text-white text-base font-medium leading-normal transition-all border border-white/10"
              >
                <span className="material-symbols-outlined text-[20px]">search</span>
                <span>Browse Clubs</span>
              </Link>
            </div>
          </div>

          {/* Meta/Secondary Links */}
          <div className="mt-4 pt-6 border-t border-white/5 w-full max-w-[300px]">
            <div className="flex items-center justify-center gap-4 text-sm text-[#9eb7a8]">
              <a 
                href="#" 
                className="hover:text-primary underline decoration-primary/30 hover:decoration-primary transition-all"
                onClick={(e) => {
                  e.preventDefault();
                  // TODO: Add Help Center link when available
                }}
              >
                Help Center
              </a>
              <span className="w-1 h-1 rounded-full bg-[#9eb7a8]/50"></span>
              <a 
                href="#" 
                className="hover:text-primary underline decoration-primary/30 hover:decoration-primary transition-all"
                onClick={(e) => {
                  e.preventDefault();
                  // TODO: Add Report Issue link when available
                }}
              >
                Report Issue
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotFound;


import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-200 dark:border-border-dark bg-white dark:bg-[#0e1210] pt-16 pb-8">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          {/* Brand */}
          <div className="flex flex-col gap-4 max-w-sm">
            <div className="flex items-center gap-2 text-gray-900 dark:text-white">
              <div className="size-6 text-primary">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z" fill="currentColor"></path>
                </svg>
              </div>
              <span className="text-lg font-bold">ClubSphere</span>
            </div>
            <p className="text-text-muted dark:text-text-secondary text-sm">Connecting people through passions. The world's fastest growing community platform.</p>
            {/* Socials */}
            <div className="flex gap-4 mt-2">
              <a className="text-gray-400 dark:text-text-secondary hover:text-primary dark:hover:text-white transition-colors" href="#"><span className="material-symbols-outlined">public</span></a>
              <a className="text-gray-400 dark:text-text-secondary hover:text-primary dark:hover:text-white transition-colors" href="#"><span className="material-symbols-outlined">alternate_email</span></a>
              <a className="text-gray-400 dark:text-text-secondary hover:text-primary dark:hover:text-white transition-colors" href="#"><span className="material-symbols-outlined">photo_camera</span></a>
            </div>
          </div>
          
          {/* Links Columns */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16">
            <div className="flex flex-col gap-3">
              <h4 className="text-gray-900 dark:text-white font-bold">Platform</h4>
              <a className="text-text-muted dark:text-text-secondary hover:text-primary text-sm transition-colors" href="/clubs">Browse Clubs</a>
              <a className="text-text-muted dark:text-text-secondary hover:text-primary text-sm transition-colors" href="/events">Events</a>
              <a className="text-text-muted dark:text-text-secondary hover:text-primary text-sm transition-colors" href="#">Start a Club</a>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="text-gray-900 dark:text-white font-bold">Company</h4>
              <Link to="/about-us" className="text-text-muted dark:text-text-secondary hover:text-primary text-sm transition-colors">About Us</Link>
              <Link to="/careers" className="text-text-muted dark:text-text-secondary hover:text-primary text-sm transition-colors">Careers</Link>
              <a className="text-text-muted dark:text-text-secondary hover:text-primary text-sm transition-colors" href="#">Blog</a>
            </div>
            <div className="flex flex-col gap-3 col-span-2 md:col-span-1">
              <h4 className="text-gray-900 dark:text-white font-bold">Stay Updated</h4>
              <form className="flex w-full" onSubmit={handleNewsletterSubmit}>
                <input 
                  className="bg-gray-50 dark:bg-card-dark border border-gray-200 dark:border-border-dark text-gray-900 dark:text-white text-sm rounded-l-full px-4 py-2 w-full focus:ring-1 focus:ring-primary focus:border-primary outline-none" 
                  placeholder="Email address" 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                />
                <button 
                  className="bg-primary hover:bg-primary-hover text-[#111714] rounded-r-full px-4 font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '...' : 'Join'}
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-100 dark:border-border-dark pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-text-muted dark:text-text-secondary">
          <p>© 2024 ClubSphere Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-primary dark:hover:text-white">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary dark:hover:text-white">Terms of Service</Link>
            <Link to="/contact" className="hover:text-primary dark:hover:text-white">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


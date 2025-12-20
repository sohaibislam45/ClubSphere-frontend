import { Link } from 'react-router-dom';

const ClubCard = ({ club }) => {
  return (
    <Link to={`/clubs/${club.id}`} className="group relative flex flex-col bg-white dark:bg-surface-dark-alt2 rounded-[2rem] overflow-hidden border border-slate-200 dark:border-border-dark hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative h-60 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
        <img
          alt={club.clubName || club.name}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          src={club.bannerImage || club.image || "https://via.placeholder.com/400x300"}
        />
        {/* Category Badge */}
        {club.category && (
          <div className="absolute top-4 left-4 z-20">
            <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-primary/90 text-background-dark text-xs font-bold uppercase tracking-wider shadow-lg">
              {club.category}
            </span>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="flex flex-col flex-1 p-6 gap-4">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight mb-1 group-hover:text-primary transition-colors">
              {club.clubName || club.name}
            </h3>
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm">
              <span className="material-symbols-outlined text-lg">location_on</span>
              <span>{club.location || "Location TBD"}</span>
            </div>
          </div>
        </div>
        
        {/* Club Info */}
        <div className="flex items-center justify-between py-3 border-t border-slate-100 dark:border-border-dark mt-auto">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span className="material-symbols-outlined text-base">group</span>
            <span>{club.memberCount || club.members || "0"} Members</span>
          </div>
          <div className="text-sm font-bold text-primary">
            {club.membershipFee > 0 ? `৳${club.membershipFee}` : "Free"}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ClubCard;


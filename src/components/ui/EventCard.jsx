import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return {
      month: date.toLocaleString('default', { month: 'short' }).toUpperCase(),
      day: date.getDate()
    };
  };

  const dateInfo = formatDate(event.eventDate);

  return (
    <Link to={`/events/${event.id}`} className="group relative flex flex-col bg-white dark:bg-surface-dark-alt2 rounded-[2rem] overflow-hidden border border-slate-200 dark:border-border-dark hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative h-60 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
        <img
          alt={event.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          src={event.image || "https://via.placeholder.com/400x300"}
        />
        {/* Date Badge */}
        {dateInfo.month && (
          <div className="absolute top-4 left-4 z-20 flex flex-col items-center justify-center size-14 rounded-2xl bg-white/90 dark:bg-black/80 backdrop-blur-md text-center shadow-lg">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{dateInfo.month}</span>
            <span className="text-xl font-bold leading-none text-slate-900 dark:text-white">{dateInfo.day}</span>
          </div>
        )}
        {/* Price Tag */}
        <div className="absolute top-4 right-4 z-20">
          <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
            event.eventFee > 0 
              ? 'bg-slate-900 dark:bg-white text-white dark:text-black'
              : 'bg-primary text-black'
          }`}>
            {event.eventFee > 0 ? `৳${event.eventFee.toFixed(2)}` : 'Free'}
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex flex-col flex-1 p-6 gap-4">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight mb-1 group-hover:text-primary transition-colors">
              {event.title}
            </h3>
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm">
              <span className="material-symbols-outlined text-lg">location_on</span>
              <span>{event.location || "Location TBD"}</span>
            </div>
          </div>
        </div>
        
        {/* Club Info */}
        <div className="flex items-center gap-3 py-3 border-t border-slate-100 dark:border-border-dark mt-auto">
          <div className="size-8 rounded-full bg-slate-200 overflow-hidden">
            <img alt="Club logo" className="w-full h-full object-cover" src={event.clubImage || "https://via.placeholder.com/32"} />
          </div>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{event.clubName || "Club"}</span>
          <button
            onClick={(e) => {
              e.preventDefault();
              // Handle registration
            }}
            className="ml-auto text-sm font-bold text-primary hover:text-primary-dark transition-colors"
          >
            {event.isPaid ? 'Register' : 'Join Event'}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;


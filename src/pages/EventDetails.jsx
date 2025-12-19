import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import api from '../lib/api';

const EventDetails = () => {
  const { id } = useParams();

  // Fetch event details - using mock data for now
  const { data: event, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      // TODO: Replace with actual API call
      // const response = await api.get(`/events/${id}`);
      // return response.data;
      
      // Mock data
      return {
        id: 1,
        title: "Neon Night Run",
        description: "Join us for an exhilarating night run through Central Park! We'll be running with neon gear and headlamps, creating an amazing visual experience. All fitness levels welcome.",
        eventDate: "2024-10-24T19:00:00",
        location: "Central Park, New York, NY",
        eventFee: 0,
        isPaid: false,
        maxAttendees: 100,
        currentAttendees: 45,
        clubName: "City Runners",
        clubId: 1,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAwhj2rEWhnFgzxlCMRBfgO0TYn8VE2XvZ4aSyaKZTm-mJiw6rqHQGYtVXkRo8iR_1mlfkH0lJ84kUdO68Gt6MbFxToEZOCmVWGdU-NhGr7MxdOx5mq2yJ_ph4th0DTQKc_WMzSUj96-wz4-OM3W0QWAQnqZQ0QZcOawHCXAMkNHP5S2f26rAJoAg3L_NldttCOysJ-SRQNgF7jC4opJf0oE4bgrmKQjBVVkp9gGvp_PrQJQLvxd5zOwd2ut8b0sqfiBxJs_fZSthBD"
      };
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark-alt text-slate-900 dark:text-white font-display">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-text-secondary">Loading...</div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark-alt text-slate-900 dark:text-white font-display">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-text-secondary">Event not found</div>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.eventDate);
  const formattedDate = eventDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const formattedTime = eventDate.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit' 
  });

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark-alt text-slate-900 dark:text-white font-display">
      <Navbar />
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 mb-6 text-sm text-slate-500 dark:text-[#9eb7a8]">
          <a href="/" className="hover:text-primary transition-colors">Home</a>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <a href="/events" className="hover:text-primary transition-colors">Events</a>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-slate-900 dark:text-white font-medium">{event.title}</span>
        </nav>

        {/* Hero Image */}
        <div className="w-full h-[250px] md:h-[350px] rounded-2xl overflow-hidden relative mb-8 group">
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 to-transparent z-10"></div>
          <div
            className="w-full h-full bg-center bg-cover transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url("${event.image}")` }}
          ></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column (Main Content) */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* Header Info */}
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">{event.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-slate-500 dark:text-[#9eb7a8]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">schedule</span>
                  <span className="text-lg">{formattedDate} at {formattedTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">location_on</span>
                  <span className="text-lg">{event.location}</span>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-surface-light dark:bg-surface-dark-alt2 rounded-lg-alt p-6 md:p-8">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">info</span>
                About This Event
              </h3>
              <div className="text-slate-600 dark:text-[#9eb7a8] leading-relaxed">
                <p>{event.description}</p>
              </div>
            </div>

            {/* Attendees Section */}
            <div>
              <h3 className="text-2xl font-bold mb-6">Attendees</h3>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[...Array(Math.min(event.currentAttendees, 5))].map((_, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-background-light dark:border-background-dark-alt bg-gray-300 bg-cover"
                      style={{ backgroundImage: `url("https://via.placeholder.com/40")` }}
                    ></div>
                  ))}
                  {event.currentAttendees > 5 && (
                    <div className="w-10 h-10 rounded-full border-2 border-background-light dark:border-background-dark-alt bg-surface-dark-alt2 flex items-center justify-center text-xs font-bold text-white">
                      +{event.currentAttendees - 5}
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium text-slate-500 dark:text-[#9eb7a8]">
                  {event.currentAttendees} of {event.maxAttendees || '∞'} attending
                </span>
              </div>
            </div>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Register Card (Sticky) */}
            <div className="sticky top-24">
              <div className="bg-surface-light dark:bg-surface-dark-alt2 rounded-lg-alt p-6 border border-slate-200 dark:border-[#29382f] shadow-lg shadow-black/20">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-[#9eb7a8] font-medium">Event Fee</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black">
                        {event.eventFee > 0 ? `$${event.eventFee}` : 'Free'}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="w-full bg-primary text-black font-bold text-lg py-4 rounded-xl hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_-5px_rgba(56,224,123,0.4)] mb-4">
                  {event.isPaid ? 'Register Now' : 'RSVP'}
                </button>
                <p className="text-center text-xs text-slate-400 dark:text-[#6b7d72] mb-6">
                  {event.maxAttendees && `${event.maxAttendees - event.currentAttendees} spots remaining`}
                </p>
                <hr className="border-slate-200 dark:border-[#29382f] mb-6" />
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-slate-100 dark:bg-[#122017] p-2 rounded-lg shrink-0">
                      <span className="material-symbols-outlined text-primary">calendar_today</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold">Date & Time</p>
                      <p className="text-sm text-slate-500 dark:text-[#9eb7a8]">{formattedDate}</p>
                      <p className="text-sm text-slate-500 dark:text-[#9eb7a8]">{formattedTime}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-slate-100 dark:bg-[#122017] p-2 rounded-lg shrink-0">
                      <span className="material-symbols-outlined text-primary">location_on</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold">Location</p>
                      <p className="text-sm text-slate-500 dark:text-[#9eb7a8]">{event.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EventDetails;


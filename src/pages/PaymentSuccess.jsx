import { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '../components/layout/Navbar';
import Loader from '../components/ui/Loader';
import api from '../lib/api';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const eventId = searchParams.get('eventId');
  const registrationId = searchParams.get('registrationId');
  const [registration, setRegistration] = useState(null);

  // Fetch event details
  const { data: event, isLoading: eventLoading } = useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      if (!eventId) return null;
      const response = await api.get(`/api/events/${eventId}`);
      return response.data;
    },
    enabled: !!eventId,
  });

  // Fetch registration details if available
  useEffect(() => {
    if (registrationId) {
      // You can fetch registration details here if needed
      setRegistration({ id: registrationId });
    }
  }, [registrationId]);

  useEffect(() => {
    document.title = 'Payment Successful - ClubSphere';
  }, []);

  if (eventLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader />
        </div>
      </div>
    );
  }

  if (!eventId || !event) {
    return (
      <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-text-secondary mb-4">Event information not found</p>
            <Link to="/events" className="text-primary hover:underline">Browse Events</Link>
          </div>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.eventDate);
  const formattedDate = eventDate.toLocaleDateString('en-US', { 
    weekday: 'long',
    month: 'long', 
    day: 'numeric',
    year: 'numeric'
  });
  const formattedTime = eventDate.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit' 
  });

  const serviceFee = 0;
  const total = event.eventFee;

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display">
      <Navbar />
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Success Icon and Message */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-6">
              <span className="material-symbols-outlined text-5xl text-primary">check_circle</span>
            </div>
            <h1 className="text-4xl font-black mb-4">Payment Successful!</h1>
            <p className="text-lg text-slate-500 dark:text-slate-400">
              Your registration has been confirmed. We'll send you a confirmation email shortly.
            </p>
            {registrationId && (
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">
                Registration ID: <span className="font-mono">{registrationId}</span>
              </p>
            )}
          </div>

          {/* Event Details Card */}
          <div className="bg-white dark:bg-surface-dark border border-black/5 dark:border-white/5 rounded-[2rem] p-6 md:p-8 shadow-xl mb-8">
            <h2 className="text-2xl font-bold mb-6">Event Details</h2>
            <div className="flex gap-4 p-4 rounded-2xl bg-white dark:bg-[#29382f] border border-black/5 dark:border-white/10 mb-6">
              <div
                className="w-24 h-24 shrink-0 rounded-xl bg-cover bg-center border border-black/5 dark:border-white/10"
                style={{ backgroundImage: `url("${event.image || 'https://via.placeholder.com/96'}")` }}
              ></div>
              <div className="flex flex-col justify-center gap-2 flex-1 min-w-0">
                <h3 className="font-bold text-xl text-slate-900 dark:text-white truncate">{event.title}</h3>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 text-sm">
                  <span className="material-symbols-outlined text-lg">schedule</span>
                  <span>{formattedDate} at {formattedTime}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 text-sm">
                  <span className="material-symbols-outlined text-lg">location_on</span>
                  <span className="truncate">{event.location}</span>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="space-y-3 pt-6 border-t border-black/5 dark:border-white/5">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600 dark:text-slate-400">Event Fee</span>
                <span className="font-medium text-slate-900 dark:text-white">৳{event.eventFee.toFixed(2)}</span>
              </div>
              <div className="border-t border-dashed border-slate-300 dark:border-slate-600 my-3"></div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-slate-900 dark:text-white">Total Paid</span>
                <span className="text-2xl font-bold text-primary">৳{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to={`/events/${eventId}`}
              className="flex-1 bg-primary hover:bg-[#2dc065] text-surface-dark font-bold text-lg py-4 rounded-xl transition-all transform active:scale-[0.99] shadow-[0_0_20px_rgba(56,224,123,0.3)] hover:shadow-[0_0_30px_rgba(56,224,123,0.5)] flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">event</span>
              View Event Details
            </Link>
            <Link
              to="/dashboard/member/events"
              className="flex-1 bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-surface-dark-lighter text-slate-900 dark:text-white font-bold text-lg py-4 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">calendar_month</span>
              Go to My Events
            </Link>
            <Link
              to="/events"
              className="flex-1 bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-surface-dark-lighter text-slate-900 dark:text-white font-bold text-lg py-4 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">explore</span>
              Browse More Events
            </Link>
          </div>

          {/* Help Section */}
          <div className="mt-8 bg-primary/10 rounded-2xl p-6 border border-primary/20">
            <div className="flex gap-4">
              <span className="material-symbols-outlined text-primary">info</span>
              <div className="text-sm">
                <p className="font-bold text-slate-900 dark:text-white mb-1">Need help?</p>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  If you have any questions about your registration, please contact the event organizer directly.
                </p>
                <a className="text-primary font-bold mt-2 inline-block hover:underline" href="#">
                  Contact Organizer
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaymentSuccess;


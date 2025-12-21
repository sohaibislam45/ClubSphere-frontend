import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '../components/layout/Navbar';
import Loader from '../components/ui/Loader';
import api from '../lib/api';

const ClubPaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const clubId = searchParams.get('clubId');
  const membershipId = searchParams.get('membershipId');
  const [membership, setMembership] = useState(null);

  // Fetch club details
  const { data: club, isLoading: clubLoading } = useQuery({
    queryKey: ['club', clubId],
    queryFn: async () => {
      if (!clubId) return null;
      const response = await api.get(`/api/clubs/${clubId}`);
      return response.data;
    },
    enabled: !!clubId,
  });

  useEffect(() => {
    if (membershipId) {
      setMembership({ id: membershipId });
    }
  }, [membershipId]);

  useEffect(() => {
    document.title = 'Membership Successful - ClubSphere';
  }, []);

  if (clubLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader />
        </div>
      </div>
    );
  }

  if (!clubId || !club) {
    return (
      <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-text-secondary mb-4">Club information not found</p>
            <Link to="/clubs" className="text-primary hover:underline">Browse Clubs</Link>
          </div>
        </div>
      </div>
    );
  }

  const serviceFee = 0;
  const total = club.membershipFee;

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
            <h1 className="text-4xl font-black mb-4">Welcome to the Club!</h1>
            <p className="text-lg text-slate-500 dark:text-slate-400">
              Your membership has been confirmed. You now have access to all club activities and events.
            </p>
            {membershipId && (
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">
                Membership ID: <span className="font-mono">{membershipId}</span>
              </p>
            )}
          </div>

          {/* Club Details Card */}
          <div className="bg-white dark:bg-surface-dark border border-black/5 dark:border-white/5 rounded-[2rem] p-6 md:p-8 shadow-xl mb-8">
            <h2 className="text-2xl font-bold mb-6">Club Details</h2>
            <div className="flex gap-4 p-4 rounded-2xl bg-background-light dark:bg-surface-dark-lighter border border-black/5 dark:border-white/5 mb-6">
              <div
                className="w-24 h-24 shrink-0 rounded-xl bg-cover bg-center"
                style={{ backgroundImage: `url("${club.bannerImage || club.image || 'https://via.placeholder.com/96'}")` }}
              ></div>
              <div className="flex flex-col justify-center gap-2 flex-1">
                <h3 className="font-bold text-xl text-slate-900 dark:text-white">{club.clubName}</h3>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                  <span className="material-symbols-outlined text-lg">category</span>
                  <span>{club.category}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                  <span className="material-symbols-outlined text-lg">location_on</span>
                  <span>{club.location}</span>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="space-y-3 pt-6 border-t border-black/5 dark:border-white/5">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600 dark:text-slate-400">Monthly Membership</span>
                <span className="font-medium text-slate-900 dark:text-white">৳{club.membershipFee.toFixed(2)}</span>
              </div>
              <div className="border-t border-dashed border-slate-300 dark:border-slate-600 my-3"></div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-slate-900 dark:text-white">Total Paid</span>
                <span className="text-2xl font-bold text-primary">৳{total.toFixed(2)}</span>
              </div>
              <div className="bg-primary/10 rounded-xl p-3 mt-4">
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  <span className="font-bold">14-day free trial</span> included. Your membership will renew monthly.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to={`/clubs/${clubId}`}
              className="flex-1 bg-primary hover:bg-[#2dc065] text-surface-dark font-bold text-lg py-4 rounded-xl transition-all transform active:scale-[0.99] shadow-[0_0_20px_rgba(56,224,123,0.3)] hover:shadow-[0_0_30px_rgba(56,224,123,0.5)] flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">groups</span>
              View Club
            </Link>
            <Link
              to="/dashboard/member/clubs"
              className="flex-1 bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-surface-dark-lighter text-slate-900 dark:text-white font-bold text-lg py-4 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">dashboard</span>
              My Clubs
            </Link>
            <Link
              to="/clubs"
              className="flex-1 bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-surface-dark-lighter text-slate-900 dark:text-white font-bold text-lg py-4 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">explore</span>
              Browse More Clubs
            </Link>
          </div>

          {/* Help Section */}
          <div className="mt-8 bg-primary/10 rounded-2xl p-6 border border-primary/20">
            <div className="flex gap-4">
              <span className="material-symbols-outlined text-primary">info</span>
              <div className="text-sm">
                <p className="font-bold text-slate-900 dark:text-white mb-1">Need help?</p>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  If you have any questions about your membership, please contact the club organizer directly.
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

export default ClubPaymentSuccess;


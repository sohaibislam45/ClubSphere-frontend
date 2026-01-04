import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Loader from '../components/ui/Loader';
import ReviewCard from '../components/ui/ReviewCard';
import StarRating from '../components/ui/StarRating';
import NotFound from './NotFound';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import Swal from '../lib/sweetalertConfig';

const ClubDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [isJoining, setIsJoining] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const queryClient = useQueryClient();

  // Fetch club details from API
  const { data: club, isLoading } = useQuery({
    queryKey: ['club', id],
    queryFn: async () => {
      const response = await api.get(`/api/clubs/${id}`);
      return response.data;
    },
  });

  // Fetch membership status (only if user is authenticated)
  const { data: membershipData, isLoading: membershipLoading, refetch: refetchMembership } = useQuery({
    queryKey: ['club-membership', id],
    queryFn: async () => {
      const response = await api.get(`/api/clubs/${id}/membership`);
      return response.data;
    },
    enabled: !!id && (!!localStorage.getItem('token') || !!user), // Only fetch if club ID exists and user has token or user object
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0, // Always consider data stale to ensure fresh checks
  });

  const isMember = membershipData?.isMember || false;

  // Refetch membership when user becomes available or when component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');
    if ((user || token) && id) {
      refetchMembership();
    }
  }, [user, id, refetchMembership]);

  // Fetch upcoming events for this club
  const { data: eventsData, isLoading: eventsLoading } = useQuery({
    queryKey: ['club-events', id],
    queryFn: async () => {
      const response = await api.get(`/api/clubs/${id}/events`, { params: { limit: 5 } });
      return response.data;
    },
    enabled: !!id, // Only fetch if club ID exists
  });

  const upcomingEvents = eventsData?.events || [];

  // Fetch reviews for this club
  const { data: reviewsData, isLoading: reviewsLoading, refetch: refetchReviews } = useQuery({
    queryKey: ['club-reviews', id],
    queryFn: async () => {
      const response = await api.get(`/api/clubs/${id}/reviews`);
      return response.data;
    },
    enabled: !!id,
  });

  const reviews = reviewsData?.reviews || [];
  const averageRating = reviewsData?.averageRating || 0;
  const totalReviews = reviewsData?.totalReviews || 0;

  // Submit review mutation
  const submitReviewMutation = useMutation({
    mutationFn: async ({ rating, comment }) => {
      const response = await api.post(`/api/clubs/${id}/reviews`, { rating, comment });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['club-reviews', id]);
      setShowReviewForm(false);
      setReviewRating(0);
      setReviewComment('');
      Swal.fire({
        icon: 'success',
        title: 'Review Submitted!',
        text: 'Thank you for your review.',
        timer: 2000,
        showConfirmButton: false
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.error || 'Failed to submit review. Please try again.',
      });
    }
  });

  const handleSubmitReview = () => {
    if (!reviewRating || reviewRating < 1) {
      Swal.fire({
        icon: 'error',
        title: 'Rating Required',
        text: 'Please select a rating.',
      });
      return;
    }
    if (!reviewComment.trim() || reviewComment.trim().length < 10) {
      Swal.fire({
        icon: 'error',
        title: 'Comment Required',
        text: 'Please enter a comment of at least 10 characters.',
      });
      return;
    }
    submitReviewMutation.mutate({ rating: reviewRating, comment: reviewComment });
  };

  const handleJoinClick = async () => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      Swal.fire({
        icon: 'info',
        title: 'Login Required',
        text: 'Please login to join this club.',
        showCancelButton: true,
        confirmButtonText: 'Login',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login', { state: { returnTo: `/clubs/${id}` } });
        }
      });
      return;
    }

    // If club has membership fee, navigate to checkout
    if (club.membershipFee > 0) {
      navigate(`/clubs/${id}/checkout`);
      return;
    }

    // If club is free, register directly
    setIsJoining(true);
    try {
      const response = await api.post('/api/payments/club/register-free', {
        clubId: id
      });

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Welcome to the Club!',
          text: 'You have successfully joined this club.',
          timer: 3000,
          showConfirmButton: false
        }).then(() => {
          // Refetch membership status and club data
          refetchMembership();
          // Refresh club data to update member count
          window.location.reload();
        });
      }
    } catch (error) {
      console.error('Join club error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Join Failed',
        text: error.response?.data?.error || 'Failed to join this club. Please try again.',
      });
    } finally {
      setIsJoining(false);
    }
  };

  // Set document title - must be called before any early returns (Rules of Hooks)
  useEffect(() => {
    if (club) {
      document.title = `${club.clubName} - ClubSphere`;
    } else {
      document.title = 'Club Details - ClubSphere';
    }
  }, [club]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark-alt text-slate-900 dark:text-white font-display antialiased">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader />
        </div>
      </div>
    );
  }

  if (!club) {
    return <NotFound errorType="club" />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark-alt text-slate-900 dark:text-white font-display antialiased selection:bg-primary selection:text-black">
      <Navbar />
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 mb-6 text-sm text-slate-500 dark:text-[#9eb7a8]">
          <a href="/" className="hover:text-primary transition-colors">Home</a>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <a href="/clubs" className="hover:text-primary transition-colors">Explore</a>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-slate-900 dark:text-white font-medium">{club.clubName}</span>
        </nav>

        {/* Hero Image */}
        <div className="w-full h-[250px] md:h-[350px] rounded-2xl overflow-hidden relative mb-8 group">
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 to-transparent z-10"></div>
          <div
            className="w-full h-full bg-center bg-cover transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url("${club.bannerImage}")` }}
          ></div>
          <div className="absolute bottom-6 left-6 z-20 flex flex-col gap-1">
            <span className="px-3 py-1 bg-primary text-background-dark text-xs font-bold uppercase tracking-wider rounded-full w-fit">
              {club.category}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column (Main Content) */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* Header Info */}
            <div>
              <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                <div>
                  <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">{club.clubName}</h1>
                  <div className="flex items-center gap-2 text-slate-500 dark:text-[#9eb7a8]">
                    <span className="material-symbols-outlined text-primary">location_on</span>
                    <span className="text-lg">{club.location}</span>
                  </div>
                </div>
                {/* Social Proof */}
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-3">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full border-2 border-background-light dark:border-background-dark bg-gray-300 bg-cover"
                        style={{ backgroundImage: `url("https://via.placeholder.com/40")` }}
                      ></div>
                    ))}
                    <div className="w-10 h-10 rounded-full border-2 border-background-light dark:border-background-dark bg-surface-dark flex items-center justify-center text-xs font-bold text-white">
                      +{club.memberCount - 3}
                    </div>
                  </div>
                  <span className="text-sm font-medium text-slate-500 dark:text-[#9eb7a8]">Active members</span>
                </div>
              </div>
              {/* Chips */}
              <div className="flex flex-wrap gap-2">
                {club.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 rounded-full bg-slate-200 dark:bg-[#29382f] text-sm font-medium hover:bg-primary/20 hover:text-primary transition-colors cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* About Section */}
            <div className="bg-surface-light dark:bg-surface-dark-alt rounded-lg-alt p-6 md:p-8">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">info</span>
                About Us
              </h3>
              <div className="text-slate-600 dark:text-[#9eb7a8] leading-relaxed space-y-4">
                {club.description?.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Upcoming Events</h3>
                <a className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1" href="/events">
                  View all <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </a>
              </div>
              {eventsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader />
                </div>
              ) : upcomingEvents.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-text-secondary">No upcoming events scheduled for this club.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="group flex flex-col sm:flex-row bg-surface-light dark:bg-surface-dark-alt hover:bg-slate-50 dark:hover:bg-[#23362b] rounded-lg-alt overflow-hidden transition-all duration-300 border border-transparent dark:hover:border-primary/20">
                      <div 
                        className="sm:w-48 h-32 sm:h-auto bg-cover bg-center bg-card-dark" 
                        style={{ backgroundImage: event.image ? `url("${event.image}")` : 'none' }}
                      ></div>
                      <div className="flex-1 p-5 flex flex-col justify-center">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-primary font-bold text-sm uppercase tracking-wider">{event.dayOfWeek || 'Upcoming'}</span>
                          <span className="hidden sm:inline-block bg-slate-100 dark:bg-[#122017] px-3 py-1 rounded-lg text-xs font-bold text-slate-500 dark:text-slate-400">
                            {event.month} {event.day}
                          </span>
                        </div>
                        <h4 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">{event.name || event.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-[#9eb7a8] mb-4">
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-base">schedule</span>
                            {event.time || 'TBA'}
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-base">location_on</span>
                            {event.location || 'Location TBA'}
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex -space-x-2">
                            <div className="w-6 h-6 rounded-full border border-surface-light dark:border-surface-dark bg-gray-400"></div>
                            <div className="w-6 h-6 rounded-full border border-surface-light dark:border-surface-dark bg-gray-500"></div>
                            <span className="text-xs text-slate-500 ml-3 pl-1">+{Math.floor(Math.random() * 20)} attending</span>
                          </div>
                          <a 
                            href={`/events/${event.id}`}
                            className="px-4 py-2 rounded-full bg-slate-200 dark:bg-[#29382f] text-sm font-medium hover:bg-primary hover:text-black transition-all"
                          >
                            Register
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Reviews Section */}
            <div className="bg-surface-light dark:bg-surface-dark-alt rounded-lg-alt p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">rate_review</span>
                    Reviews
                  </h3>
                  {totalReviews > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <StarRating rating={Math.round(averageRating)} interactive={false} size="md" />
                        <span className="text-lg font-bold text-gray-900 dark:text-white ml-2">
                          {averageRating.toFixed(1)}
                        </span>
                      </div>
                      <span className="text-text-muted dark:text-text-secondary">
                        ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
                      </span>
                    </div>
                  )}
                </div>
                {isMember && !showReviewForm && (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="px-4 py-2 bg-primary hover:bg-primary-hover text-[#111714] font-bold rounded-xl transition-colors"
                  >
                    Write a Review
                  </button>
                )}
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <div className="mb-6 p-6 bg-white dark:bg-card-dark border border-gray-200 dark:border-border-dark rounded-xl">
                  <h4 className="text-lg font-bold mb-4">Write a Review</h4>
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="block text-sm font-bold mb-2">Rating</label>
                      <StarRating
                        rating={reviewRating}
                        onRate={setReviewRating}
                        interactive={true}
                        size="lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">Your Review</label>
                      <textarea
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Share your experience with this club..."
                        rows="4"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-[#29382f] border border-gray-200 dark:border-border-dark rounded-xl text-gray-900 dark:text-white placeholder:text-text-muted dark:placeholder:text-text-secondary focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleSubmitReview}
                        disabled={submitReviewMutation.isPending}
                        className="px-6 py-2 bg-primary hover:bg-primary-hover text-[#111714] font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submitReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
                      </button>
                      <button
                        onClick={() => {
                          setShowReviewForm(false);
                          setReviewRating(0);
                          setReviewComment('');
                        }}
                        className="px-6 py-2 bg-gray-100 dark:bg-[#29382f] text-gray-900 dark:text-white font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-border-dark transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Reviews List */}
              {reviewsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader />
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-text-muted dark:text-text-secondary">No reviews yet. Be the first to review this club!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Join Card (Sticky) */}
            <div className="sticky top-24 space-y-6">
              <div className="bg-surface-light dark:bg-surface-dark-alt rounded-lg-alt p-6 border border-slate-200 dark:border-[#29382f] shadow-lg shadow-black/20">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-[#9eb7a8] font-medium">Membership Fee</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black">৳{club.membershipFee || 0}</span>
                      <span className="text-sm text-slate-500 dark:text-[#9eb7a8]">/ month</span>
                    </div>
                  </div>
                  <div className="bg-primary/10 p-2 rounded-full">
                    <span className="material-symbols-outlined text-primary text-2xl">verified</span>
                  </div>
                </div>
                <button 
                  onClick={handleJoinClick}
                  disabled={isJoining || isMember || membershipLoading}
                  className={`w-full font-bold text-lg py-4 rounded-xl transition-all shadow-[0_0_20px_-5px_rgba(56,224,123,0.4)] mb-4 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isMember 
                      ? 'bg-slate-200 dark:bg-[#29382f] text-slate-600 dark:text-slate-400 cursor-not-allowed' 
                      : 'bg-primary text-black hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]'
                  }`}
                >
                  {membershipLoading ? 'Checking...' : isJoining ? 'Processing...' : isMember ? 'Joined' : 'Join Club'}
                </button>
                <p className="text-center text-xs text-slate-400 dark:text-[#6b7d72] mb-6">Cancel anytime. 14-day free trial included.</p>
                <hr className="border-slate-200 dark:border-[#29382f] mb-6" />
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-slate-100 dark:bg-[#122017] p-2 rounded-lg shrink-0">
                      <span className="material-symbols-outlined text-primary">pin_drop</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold">Meeting Point</p>
                      <p className="text-sm text-slate-500 dark:text-[#9eb7a8]">{club.meetingPoint}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Organizer Card */}
              <div className="bg-surface-light dark:bg-surface-dark-alt rounded-lg-alt p-6 border border-slate-200 dark:border-[#29382f]">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Organizer</p>
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-full bg-cover bg-center border-2 border-primary"
                    style={{ backgroundImage: `url("${club.managerPhoto}")` }}
                  ></div>
                  <div>
                    <p className="font-bold text-lg">{club.managerName}</p>
                    <p className="text-sm text-primary">{club.managerRole}</p>
                  </div>
                </div>
                <button className="mt-4 w-full py-2 rounded-lg border border-slate-300 dark:border-[#29382f] text-sm font-medium hover:bg-slate-100 dark:hover:bg-[#29382f] transition-colors">
                  Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ClubDetails;


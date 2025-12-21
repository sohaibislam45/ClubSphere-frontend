import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Navbar from '../components/layout/Navbar';
import Loader from '../components/ui/Loader';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import Swal from '../lib/sweetalertConfig';

// Initialize Stripe (using publishable key from environment variable)
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51Sel9TEUORonO8t1ajChbAAsGeZDpxiTln2akDFmhc54czA41d0nCjl7IXUu2vkUhSjp516lV6F9w3hyA7WpAe0900hKQXMb29';

if (!STRIPE_PUBLISHABLE_KEY || !STRIPE_PUBLISHABLE_KEY.startsWith('pk_')) {
  console.error('Invalid Stripe publishable key. Please check VITE_STRIPE_PUBLISHABLE_KEY in your .env file.');
}

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ club, clientSecret, paymentIntentId, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [email, setEmail] = useState(user?.email || '');
  const [nameOnCard, setNameOnCard] = useState(user?.name || '');
  const [keepUpdated, setKeepUpdated] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      // Get all card elements
      const cardNumberElement = elements.getElement(CardNumberElement);
      const cardExpiryElement = elements.getElement(CardExpiryElement);
      const cardCvcElement = elements.getElement(CardCvcElement);

      if (!cardNumberElement || !cardExpiryElement || !cardCvcElement) {
        Swal.fire({
          icon: 'error',
          title: 'Payment Error',
          text: 'Please fill in all card details.',
        });
        setIsProcessing(false);
        return;
      }

      // Create payment method first (required when using separate card elements)
      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardNumberElement,
        billing_details: {
          name: nameOnCard,
          email: email
        }
      });

      if (pmError) {
        Swal.fire({
          icon: 'error',
          title: 'Payment Failed',
          text: pmError.message || 'Failed to process card information. Please try again.',
        });
        setIsProcessing(false);
        return;
      }

      // Confirm payment with the created payment method
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id
      });

      if (error) {
        // Payment failed
        if (error.type === 'card_error' || error.type === 'validation_error') {
          Swal.fire({
            icon: 'error',
            title: 'Payment Failed',
            text: error.message || 'Your card was declined. Please try again.',
          });
        } else {
          // User cancelled
          onCancel();
          return;
        }
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Payment succeeded, confirm with backend
        try {
          // Check if token exists before making the request
          const token = localStorage.getItem('token');
          if (!token) {
            Swal.fire({
              icon: 'warning',
              title: 'Authentication Required',
              text: 'Your session has expired. Please login again.',
              confirmButtonText: 'Login'
            }).then(() => {
              window.location.href = '/login';
            });
            setIsProcessing(false);
            return;
          }

          const response = await api.post('/api/payments/club/confirm', {
            paymentIntentId,
            clubId: club.id
          });

          if (response.data.success) {
            // Redirect to success page
            onSuccess(response.data.membershipId);
          }
        } catch (error) {
          console.error('Confirm payment error:', error);
          let errorMessage = 'Failed to complete membership. Please contact support.';
          
          if (error.response?.status === 401) {
            errorMessage = 'Your session has expired. Please login again.';
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            Swal.fire({
              icon: 'warning',
              title: 'Session Expired',
              text: errorMessage,
              confirmButtonText: 'Login'
            }).then(() => {
              window.location.href = '/login';
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Membership Failed',
              text: error.response?.data?.error || errorMessage,
            });
          }
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Payment Error',
        text: 'An error occurred during payment. Please try again.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#ffffff',
        '::placeholder': {
          color: '#9eb7a8',
        },
        fontFamily: 'Noto Sans, sans-serif',
        backgroundColor: 'transparent',
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
  };

  const serviceFee = 0;
  const total = club.membershipFee;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Contact Information */}
      <div className="bg-white dark:bg-surface-dark border border-black/5 dark:border-white/5 rounded-[2rem] p-6 md:p-8 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
          Contact Information
        </h3>
        <div className="flex items-start gap-4 mb-6 pb-6 border-b border-black/5 dark:border-white/5">
          <div className="w-16 h-16 rounded-full bg-cover bg-center border-2 border-primary/20 flex-shrink-0" style={{ backgroundImage: `url("${user?.photoURL || user?.photo || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name || 'User') + '&background=38e07b&color=fff&size=128'}")` }}></div>
          <div className="flex-1">
            <p className="font-semibold text-slate-900 dark:text-white">{user?.name || 'User'}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email || ''}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#29382f] p-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              placeholder="you@example.com"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={keepUpdated}
              onChange={(e) => setKeepUpdated(e.target.checked)}
              className="rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-[#29382f] text-primary focus:ring-primary/50"
            />
            <label className="text-sm text-slate-500 dark:text-slate-400">
              Keep me updated on club activities and events
            </label>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div className="bg-white dark:bg-surface-dark border border-black/5 dark:border-white/5 rounded-[2rem] p-6 md:p-8 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
          Payment Details
        </h3>
        
        {/* Payment Method - Card Only */}
        <div className="mb-8">
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-primary bg-primary/10 text-primary">
            <span className="material-symbols-outlined">credit_card</span>
            <span className="font-medium">Card Payment</span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Name on Card</label>
            <input
              type="text"
              value={nameOnCard}
              onChange={(e) => setNameOnCard(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#29382f] p-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              placeholder="Alex Runner"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Card Information</label>
            <div className="relative rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#29382f] p-3">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 z-10">
                <span className="material-symbols-outlined">credit_card</span>
              </div>
              <div className="pl-10 pr-20">
                <CardNumberElement options={cardElementOptions} />
              </div>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none gap-1 z-10">
                <div className="h-4 w-6 bg-slate-300 dark:bg-slate-600 rounded"></div>
                <div className="h-4 w-6 bg-slate-300 dark:bg-slate-600 rounded"></div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Expiration</label>
              <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#29382f] p-3">
                <CardExpiryElement options={cardElementOptions} />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex justify-between">
                CVC
                <span className="material-symbols-outlined text-slate-400 text-[16px] cursor-help" title="3-digit security code on back of card">help</span>
              </label>
              <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#29382f] p-3">
                <CardCvcElement options={cardElementOptions} />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Billing ZIP / Postal Code</label>
            <input
              type="text"
              className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#29382f] p-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              placeholder="10001"
            />
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-black/5 dark:border-white/5">
          <button
            type="submit"
            disabled={!stripe || isProcessing}
            className="w-full bg-primary hover:bg-[#2dc065] text-surface-dark font-bold text-lg py-4 rounded-xl transition-all transform active:scale-[0.99] shadow-[0_0_20px_rgba(56,224,123,0.3)] hover:shadow-[0_0_30px_rgba(56,224,123,0.5)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <Loader />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>Confirm Payment ৳{total.toFixed(2)}</span>
                <span className="material-symbols-outlined text-[20px]">lock</span>
              </>
            )}
          </button>
          <div className="flex justify-center mt-4">
            <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">verified_user</span>
              Payments processed securely by Stripe
            </p>
          </div>
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-surface-dark hover:bg-slate-50 dark:hover:bg-surface-dark-lighter text-slate-700 dark:text-slate-300 font-medium text-sm transition-colors flex items-center gap-2 mx-auto"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
              Cancel Payment
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

const ClubCheckout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [clientSecret, setClientSecret] = useState(null);
  const [paymentIntentId, setPaymentIntentId] = useState(null);
  const [isCreatingIntent, setIsCreatingIntent] = useState(false);

  // Fetch club details
  const { data: club, isLoading: clubLoading } = useQuery({
    queryKey: ['club', id],
    queryFn: async () => {
      const response = await api.get(`/api/clubs/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  // Create payment intent when club is loaded
  useEffect(() => {
    if (club && club.membershipFee > 0 && !clientSecret) {
      createPaymentIntent();
    }
  }, [club]);

  const createPaymentIntent = async () => {
    setIsCreatingIntent(true);
    try {
      // Check if user is authenticated
      const token = localStorage.getItem('token');
      if (!token) {
        Swal.fire({
          icon: 'warning',
          title: 'Authentication Required',
          text: 'Please login to continue with payment.',
          confirmButtonText: 'Login'
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/login', { state: { returnTo: `/clubs/${id}/checkout` } });
          } else {
            navigate(`/clubs/${id}`);
          }
        });
        return;
      }

      const response = await api.post('/api/payments/club/create-intent', {
        clubId: id
      });
      setClientSecret(response.data.clientSecret);
      setPaymentIntentId(response.data.paymentIntentId);
    } catch (error) {
      console.error('Create payment intent error:', error);
      let errorMessage = 'Failed to initialize payment. Please try again.';
      
      if (error.response?.status === 401) {
        errorMessage = 'Your session has expired. Please login again.';
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        Swal.fire({
          icon: 'warning',
          title: 'Session Expired',
          text: errorMessage,
          confirmButtonText: 'Login'
        }).then(() => {
          navigate('/login', { state: { returnTo: `/clubs/${id}/checkout` } });
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.error || errorMessage,
        }).then(() => {
          navigate(`/clubs/${id}`);
        });
      }
    } finally {
      setIsCreatingIntent(false);
    }
  };

  const handleSuccess = (membershipId) => {
    navigate(`/payment/club/success?clubId=${id}&membershipId=${membershipId}`);
  };

  const handleCancel = () => {
    navigate(`/payment/club/cancel?clubId=${id}`);
  };

  useEffect(() => {
    if (club) {
      document.title = `Payment - ${club.clubName} - ClubSphere`;
    } else {
      document.title = 'Payment - ClubSphere';
    }
  }, [club]);

  if (clubLoading || isCreatingIntent) {
    return (
      <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader />
        </div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-text-secondary mb-4">Club not found</p>
            <Link to="/clubs" className="text-primary hover:underline">Browse Clubs</Link>
          </div>
        </div>
      </div>
    );
  }

  if (!club.membershipFee || club.membershipFee <= 0) {
    return (
      <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-text-secondary mb-4">This club is free. Please use the Join Club button on the club page.</p>
            <Link to={`/clubs/${id}`} className="text-primary hover:underline">Back to Club</Link>
          </div>
        </div>
      </div>
    );
  }

  const serviceFee = 0;
  const total = club.membershipFee;

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display antialiased">
      <Navbar />
      <main className="layout-container flex grow flex-col w-full max-w-[1280px] mx-auto p-4 md:p-8 lg:p-10">
        <Link
          to={`/clubs/${id}`}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-6 text-sm font-medium w-fit"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back to Club Details
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Checkout Form */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Checkout</h1>
            {clientSecret ? (
              <Elements key={clientSecret} stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm
                  club={club}
                  clientSecret={clientSecret}
                  paymentIntentId={paymentIntentId}
                  onSuccess={handleSuccess}
                  onCancel={handleCancel}
                />
              </Elements>
            ) : (
              <div className="flex items-center justify-center py-12">
                <Loader />
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-28 flex flex-col gap-6">
              <div className="bg-white dark:bg-surface-dark border border-black/5 dark:border-white/5 rounded-[2rem] p-6 shadow-xl overflow-hidden relative group">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
                <div className="flex flex-col gap-6 relative z-10">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Order Summary</h2>
                  <div className="flex gap-4 p-4 rounded-2xl bg-background-light dark:bg-[#29382f] border border-black/5 dark:border-white/10">
                    <div
                      className="w-20 h-20 shrink-0 rounded-xl bg-cover bg-center border border-black/5 dark:border-white/10"
                      style={{ backgroundImage: `url("${club.bannerImage || club.image || 'https://via.placeholder.com/80'}")` }}
                    ></div>
                    <div className="flex flex-col justify-center gap-1 flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 dark:text-white leading-tight truncate">{club.clubName || 'Club'}</h4>
                      {club.category && (
                        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">{club.category}</p>
                      )}
                      {club.location && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{club.location}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex flex-col">
                        <span className="text-slate-900 dark:text-white font-medium">Monthly Membership</span>
                        <span className="text-slate-500 dark:text-slate-400 text-xs">Membership fee x 1</span>
                      </div>
                      <span className="text-slate-900 dark:text-white font-medium">৳{club.membershipFee.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-dashed border-slate-300 dark:border-slate-600 my-2"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-slate-900 dark:text-white">Total</span>
                      <div className="text-right">
                        <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold mr-1">BDT</span>
                        <span className="text-2xl font-bold text-primary">৳{total.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="bg-primary/10 rounded-xl p-3 mt-4">
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        <span className="font-bold">14-day free trial</span> included. Cancel anytime.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-primary/10 rounded-2xl p-6 border border-primary/20">
                <div className="flex gap-4">
                  <span className="material-symbols-outlined text-primary">info</span>
                  <div className="text-sm">
                    <p className="font-bold text-slate-900 dark:text-white mb-1">Need help?</p>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      If you have any questions about membership, please contact the club organizer directly.
                    </p>
                    <a className="text-primary font-bold mt-2 inline-block hover:underline" href="#">
                      Contact Organizer
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClubCheckout;


import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Navbar from '../components/layout/Navbar';
import Loader from '../components/ui/Loader';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import Swal from '../lib/sweetalertConfig';

// Initialize Stripe (using test publishable key - replace with your actual key)
const stripePromise = loadStripe('pk_test_51SgdYyRL1cjj2uXLHqiGAoCLVWljzojO3MJX8YUo7pEadJJEQnQpHYmokTsYrXt2xdVoYLGfgAfJDrQjynljf3Ao00NTD7EOWq');

const CheckoutForm = ({ event, clientSecret, paymentIntentId, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [email, setEmail] = useState(user?.email || '');
  const [nameOnCard, setNameOnCard] = useState(user?.name || '');
  const [keepUpdated, setKeepUpdated] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('card');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: nameOnCard,
            email: email
          }
        }
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
          const response = await api.post('/api/payments/confirm', {
            paymentIntentId,
            eventId: event.id
          });

          if (response.data.success) {
            // Redirect to success page
            onSuccess(response.data.registrationId);
          }
        } catch (error) {
          console.error('Confirm payment error:', error);
          Swal.fire({
            icon: 'error',
            title: 'Registration Failed',
            text: error.response?.data?.error || 'Failed to complete registration. Please contact support.',
          });
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
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
    hidePostalCode: true,
  };

  const serviceFee = event.eventFee * 0.1 >= 1.50 ? event.eventFee * 0.1 : 1.50;
  const total = event.eventFee + serviceFee;

  const eventDate = new Date(event.eventDate);
  const formattedDate = eventDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
  const formattedTime = eventDate.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit' 
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Contact Information */}
      <div className="bg-white dark:bg-surface-dark border border-black/5 dark:border-white/5 rounded-[2rem] p-6 md:p-8 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-background-light dark:bg-surface-dark-lighter text-sm">1</span>
          Contact Information
        </h3>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input w-full rounded-xl border-slate-200 dark:border-white/10 bg-background-light dark:bg-surface-dark-lighter p-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0 focus:border-primary transition-colors"
              placeholder="you@example.com"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={keepUpdated}
              onChange={(e) => setKeepUpdated(e.target.checked)}
              className="rounded border-slate-300 bg-background-light dark:bg-surface-dark-lighter text-primary focus:ring-primary/50"
            />
            <label className="text-sm text-slate-500 dark:text-slate-400">
              Keep me updated on future events from {event.clubName || 'this club'}
            </label>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div className="bg-white dark:bg-surface-dark border border-black/5 dark:border-white/5 rounded-[2rem] p-6 md:p-8 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-background-light dark:bg-surface-dark-lighter text-sm">2</span>
          Payment Details
        </h3>
        
        {/* Payment Method Selection */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <label className="cursor-pointer">
            <input
              type="radio"
              name="payment-type"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={() => setPaymentMethod('card')}
              className="peer sr-only"
            />
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-primary bg-primary/10 text-primary transition-all peer-checked:ring-2 peer-checked:ring-primary peer-checked:ring-offset-2 peer-checked:ring-offset-surface-dark">
              <span className="material-symbols-outlined">credit_card</span>
              <span className="font-medium whitespace-nowrap">Card</span>
            </div>
          </label>
          <label className="cursor-pointer">
            <input
              type="radio"
              name="payment-type"
              value="googlepay"
              checked={paymentMethod === 'googlepay'}
              onChange={() => setPaymentMethod('googlepay')}
              className="peer sr-only"
            />
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-background-light dark:hover:bg-surface-dark-lighter text-slate-600 dark:text-slate-400 transition-all peer-checked:border-primary peer-checked:text-primary">
              <span className="material-symbols-outlined">account_balance_wallet</span>
              <span className="font-medium whitespace-nowrap">Google Pay</span>
            </div>
          </label>
        </div>

        {paymentMethod === 'card' && (
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Name on Card</label>
              <input
                type="text"
                value={nameOnCard}
                onChange={(e) => setNameOnCard(e.target.value)}
                required
                className="form-input w-full rounded-xl border-slate-200 dark:border-white/10 bg-background-light dark:bg-surface-dark-lighter p-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0 focus:border-primary transition-colors"
                placeholder="Alex Runner"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Card Information</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                  <span className="material-symbols-outlined">credit_card</span>
                </div>
                <div className="pl-10 pr-20">
                  <CardElement options={cardElementOptions} />
                </div>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none gap-1">
                  <div className="h-4 w-6 bg-slate-300 dark:bg-slate-600 rounded"></div>
                  <div className="h-4 w-6 bg-slate-300 dark:bg-slate-600 rounded"></div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Expiration</label>
                <input
                  type="text"
                  className="form-input w-full rounded-xl border-slate-200 dark:border-white/10 bg-background-light dark:bg-surface-dark-lighter p-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0 focus:border-primary transition-colors"
                  placeholder="MM / YY"
                  disabled
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex justify-between">
                  CVC
                  <span className="material-symbols-outlined text-slate-400 text-[16px] cursor-help" title="3-digit security code on back of card">help</span>
                </label>
                <input
                  type="text"
                  className="form-input w-full rounded-xl border-slate-200 dark:border-white/10 bg-background-light dark:bg-surface-dark-lighter p-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0 focus:border-primary transition-colors"
                  placeholder="123"
                  disabled
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Billing ZIP / Postal Code</label>
              <input
                type="text"
                className="form-input w-full rounded-xl border-slate-200 dark:border-white/10 bg-background-light dark:bg-surface-dark-lighter p-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0 focus:border-primary transition-colors"
                placeholder="10001"
              />
            </div>
          </div>
        )}

        {paymentMethod === 'googlepay' && (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            Google Pay is coming soon. Please use card payment for now.
          </div>
        )}

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
              className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white text-sm font-medium transition-colors"
            >
              Cancel Payment
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

const EventCheckout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [clientSecret, setClientSecret] = useState(null);
  const [paymentIntentId, setPaymentIntentId] = useState(null);
  const [isCreatingIntent, setIsCreatingIntent] = useState(false);

  // Fetch event details
  const { data: event, isLoading: eventLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const response = await api.get(`/api/events/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  // Create payment intent when event is loaded
  useEffect(() => {
    if (event && event.isPaid && event.eventFee > 0 && !clientSecret) {
      createPaymentIntent();
    }
  }, [event]);

  const createPaymentIntent = async () => {
    setIsCreatingIntent(true);
    try {
      const response = await api.post('/api/payments/create-intent', {
        eventId: id
      });
      setClientSecret(response.data.clientSecret);
      setPaymentIntentId(response.data.paymentIntentId);
    } catch (error) {
      console.error('Create payment intent error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.error || 'Failed to initialize payment. Please try again.',
      }).then(() => {
        navigate(`/events/${id}`);
      });
    } finally {
      setIsCreatingIntent(false);
    }
  };

  const handleSuccess = (registrationId) => {
    navigate(`/payment/success?eventId=${id}&registrationId=${registrationId}`);
  };

  const handleCancel = () => {
    navigate(`/payment/cancel?eventId=${id}`);
  };

  useEffect(() => {
    if (event) {
      document.title = `Payment - ${event.title} - ClubSphere`;
    } else {
      document.title = 'Payment - ClubSphere';
    }
  }, [event]);

  if (eventLoading || isCreatingIntent) {
    return (
      <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-text-secondary mb-4">Event not found</p>
            <Link to="/events" className="text-primary hover:underline">Browse Events</Link>
          </div>
        </div>
      </div>
    );
  }

  if (!event.isPaid || event.eventFee <= 0) {
    return (
      <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-text-secondary mb-4">This event is free. Please use the RSVP button on the event page.</p>
            <Link to={`/events/${id}`} className="text-primary hover:underline">Back to Event</Link>
          </div>
        </div>
      </div>
    );
  }

  const serviceFee = event.eventFee * 0.1 >= 1.50 ? event.eventFee * 0.1 : 1.50;
  const total = event.eventFee + serviceFee;

  const eventDate = new Date(event.eventDate);
  const formattedDate = eventDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
  const formattedTime = eventDate.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit' 
  });

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display antialiased">
      <Navbar />
      <main className="layout-container flex grow flex-col w-full max-w-[1280px] mx-auto p-4 md:p-8 lg:p-10">
        <Link
          to={`/events/${id}`}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-6 text-sm font-medium w-fit"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back to Event Details
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Checkout Form */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Checkout</h1>
            {clientSecret && (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm
                  event={event}
                  clientSecret={clientSecret}
                  paymentIntentId={paymentIntentId}
                  onSuccess={handleSuccess}
                  onCancel={handleCancel}
                />
              </Elements>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-28 flex flex-col gap-6">
              <div className="bg-white dark:bg-surface-dark border border-black/5 dark:border-white/5 rounded-[2rem] p-6 shadow-xl overflow-hidden relative group">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
                <div className="flex flex-col gap-6 relative z-10">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Order Summary</h2>
                  <div className="flex gap-4 p-4 rounded-2xl bg-background-light dark:bg-surface-dark-lighter border border-black/5 dark:border-white/5">
                    <div
                      className="w-20 h-20 shrink-0 rounded-xl bg-cover bg-center"
                      style={{ backgroundImage: `url("${event.image || 'https://via.placeholder.com/80'}")` }}
                    ></div>
                    <div className="flex flex-col justify-center gap-1">
                      <h4 className="font-bold text-slate-900 dark:text-white leading-tight">{event.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{formattedDate} • {formattedTime}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{event.location}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex flex-col">
                        <span className="text-slate-900 dark:text-white font-medium">General Admission</span>
                        <span className="text-slate-500 dark:text-slate-400 text-xs">Tier 1 Ticket x 1</span>
                      </div>
                      <span className="text-slate-900 dark:text-white font-medium">৳{event.eventFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex flex-col">
                        <span className="text-slate-900 dark:text-white font-medium">Service Fee</span>
                        <span className="text-slate-500 dark:text-slate-400 text-xs">Processing & handling</span>
                      </div>
                      <span className="text-slate-900 dark:text-white font-medium">৳{serviceFee.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-dashed border-slate-300 dark:border-slate-600 my-2"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-slate-900 dark:text-white">Total</span>
                      <div className="text-right">
                        <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold mr-1">BDT</span>
                        <span className="text-2xl font-bold text-primary">৳{total.toFixed(2)}</span>
                      </div>
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
                      If you have any questions about your registration, please contact the event organizer directly.
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

export default EventCheckout;


import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import api from '../lib/api';
import Swal from '../lib/sweetalertConfig';

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    document.title = 'Contact Us - ClubSphere';
  }, []);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await api.post('/api/contact', data);
      Swal.fire({
        icon: 'success',
        title: 'Message Sent!',
        text: 'Thank you for contacting us. We\'ll get back to you as soon as possible.',
        timer: 3000,
        showConfirmButton: false
      });
      reset();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.error || 'Failed to send message. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark font-display text-text-main dark:text-white transition-colors duration-200">
      <Navbar />
      <main className="flex flex-col flex-1 w-full">
        {/* Hero Section */}
        <section className="w-full px-4 sm:px-6 lg:px-8 py-20 lg:py-32 flex justify-center bg-white dark:bg-card-dark border-b border-gray-200 dark:border-border-dark relative overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-40">
            <svg className="w-full h-full" height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern height="40" id="smallGrid" patternUnits="userSpaceOnUse" width="40">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,0,0,0.05)" className="dark:stroke-white/5" strokeWidth="1"></path>
                </pattern>
              </defs>
              <rect fill="url(#smallGrid)" height="100%" width="100%"></rect>
            </svg>
          </div>
          <div className="w-full max-w-[960px] flex flex-col items-center text-center gap-6 relative z-10">
            <span className="text-primary font-bold uppercase tracking-wider text-sm bg-primary/10 dark:bg-primary/20 px-4 py-1.5 rounded-full">Get in Touch</span>
            <h1 className="text-gray-900 dark:text-white text-5xl sm:text-6xl lg:text-7xl font-black leading-tight tracking-[-0.033em]">
              We'd Love to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-600">Hear From You</span>
            </h1>
            <p className="text-text-muted dark:text-text-secondary text-lg sm:text-xl font-normal leading-relaxed max-w-[720px]">
              Have a question, suggestion, or just want to say hello? Fill out the form below and we'll get back to you as soon as possible.
            </p>
          </div>
        </section>

        {/* Contact Form & Info Section */}
        <section className="w-full px-4 sm:px-6 lg:px-8 py-20 flex justify-center">
          <div className="w-full max-w-[1280px]">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Contact Information */}
              <div className="lg:col-span-1 flex flex-col gap-8">
                <div>
                  <h2 className="text-gray-900 dark:text-white text-2xl font-bold mb-6">Contact Information</h2>
                  <div className="flex flex-col gap-6">
                    <div className="flex items-start gap-4">
                      <div className="size-12 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-primary text-2xl">mail</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold text-text-muted dark:text-text-secondary uppercase tracking-wider">Email</span>
                        <a href="mailto:support@clubsphere.com" className="text-gray-900 dark:text-white font-medium hover:text-primary transition-colors">
                          support@clubsphere.com
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="size-12 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-primary text-2xl">phone</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold text-text-muted dark:text-text-secondary uppercase tracking-wider">Phone</span>
                        <a href="tel:+11234567890" className="text-gray-900 dark:text-white font-medium hover:text-primary transition-colors">
                          +1 (123) 456-7890
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="size-12 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-primary text-2xl">location_on</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold text-text-muted dark:text-text-secondary uppercase tracking-wider">Address</span>
                        <p className="text-gray-900 dark:text-white font-medium">
                          123 Community Street<br />
                          San Francisco, CA 94102<br />
                          United States
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-6 border-t border-gray-200 dark:border-border-dark">
                  <h3 className="text-gray-900 dark:text-white text-lg font-bold mb-4">Business Hours</h3>
                  <div className="flex flex-col gap-2 text-text-muted dark:text-text-secondary">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span className="font-medium">9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span className="font-medium">10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span className="font-medium">Closed</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="name" className="text-sm font-bold text-gray-900 dark:text-white">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        {...register('name', {
                          required: 'Name is required',
                          minLength: { value: 2, message: 'Name must be at least 2 characters' }
                        })}
                        className={`px-4 py-3 bg-white dark:bg-[#29382f] border rounded-xl text-gray-900 dark:text-white placeholder:text-text-muted dark:placeholder:text-text-secondary focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all ${
                          errors.name ? 'border-red-500' : 'border-gray-200 dark:border-border-dark'
                        }`}
                        placeholder="John Doe"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-xs">{errors.name.message}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="email" className="text-sm font-bold text-gray-900 dark:text-white">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        {...register('email', {
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address'
                          }
                        })}
                        className={`px-4 py-3 bg-white dark:bg-[#29382f] border rounded-xl text-gray-900 dark:text-white placeholder:text-text-muted dark:placeholder:text-text-secondary focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all ${
                          errors.email ? 'border-red-500' : 'border-gray-200 dark:border-border-dark'
                        }`}
                        placeholder="john.doe@example.com"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs">{errors.email.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="subject" className="text-sm font-bold text-gray-900 dark:text-white">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="subject"
                      type="text"
                      {...register('subject', {
                        required: 'Subject is required',
                        minLength: { value: 3, message: 'Subject must be at least 3 characters' }
                      })}
                      className={`px-4 py-3 bg-white dark:bg-[#29382f] border rounded-xl text-gray-900 dark:text-white placeholder:text-text-muted dark:placeholder:text-text-secondary focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all ${
                        errors.subject ? 'border-red-500' : 'border-gray-200 dark:border-border-dark'
                      }`}
                      placeholder="How can we help?"
                    />
                    {errors.subject && (
                      <p className="text-red-500 text-xs">{errors.subject.message}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="message" className="text-sm font-bold text-gray-900 dark:text-white">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      rows="6"
                      {...register('message', {
                        required: 'Message is required',
                        minLength: { value: 10, message: 'Message must be at least 10 characters' }
                      })}
                      className={`px-4 py-3 bg-white dark:bg-[#29382f] border rounded-xl text-gray-900 dark:text-white placeholder:text-text-muted dark:placeholder:text-text-secondary focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none ${
                        errors.message ? 'border-red-500' : 'border-gray-200 dark:border-border-dark'
                      }`}
                      placeholder="Tell us more about your inquiry..."
                    ></textarea>
                    {errors.message && (
                      <p className="text-red-500 text-xs">{errors.message.message}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-auto px-8 py-3 bg-primary hover:bg-primary-hover text-[#111714] font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="material-symbols-outlined animate-spin">sync</span>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <span className="material-symbols-outlined text-lg">send</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;


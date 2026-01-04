import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Swal from '../lib/sweetalertConfig';

const Careers = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    resume: null,
    coverLetter: ''
  });

  useEffect(() => {
    document.title = 'Careers - ClubSphere';
  }, []);

  const jobs = [
    {
      id: 'senior-frontend-engineer',
      title: 'Senior Frontend Engineer',
      category: 'Engineering',
      categoryColor: 'green'
    },
    {
      id: 'product-designer',
      title: 'Product Designer',
      category: 'Design',
      categoryColor: 'purple'
    },
    {
      id: 'community-manager',
      title: 'Community Manager',
      category: 'Operations',
      categoryColor: 'blue'
    },
    {
      id: 'backend-developer',
      title: 'Backend Developer (Go)',
      category: 'Engineering',
      categoryColor: 'green'
    }
  ];

  const handleApplyClick = (jobTitle) => {
    const job = jobs.find(j => j.title === jobTitle);
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      resume: null,
      coverLetter: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      resume: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      handleCloseModal();
      Swal.fire({
        icon: 'success',
        title: 'Application Submitted!',
        text: `Thank you for applying to ${selectedJob?.title}. We'll review your application and get back to you soon.`,
        confirmButtonText: 'Close',
        confirmButtonColor: '#38e07b'
      });
    }, 1000);
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
            <span className="text-primary font-bold uppercase tracking-wider text-sm bg-primary/10 dark:bg-primary/20 px-4 py-1.5 rounded-full">We're Hiring</span>
            <h1 className="text-gray-900 dark:text-white text-5xl sm:text-6xl lg:text-7xl font-black leading-tight tracking-[-0.033em]">
              Join Our Mission to Connect <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-600">The World</span>
            </h1>
            <p className="text-text-muted dark:text-text-secondary text-lg sm:text-xl font-normal leading-relaxed max-w-[720px]">
              At ClubSphere, we're building the digital infrastructure for real-world communities. We are looking for dreamers, builders, and doers to help us shape the future of social connection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-2">
              <a href="#positions" className="cursor-pointer flex items-center justify-center rounded-full h-12 px-8 bg-primary hover:bg-primary-hover text-[#111714] text-base font-bold transition-colors">
                View Openings
              </a>
            </div>
          </div>
        </section>

        {/* Life at ClubSphere Section */}
        <section className="w-full px-4 sm:px-6 lg:px-8 py-20 flex justify-center">
          <div className="w-full max-w-[1280px]">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              <div className="w-full lg:w-1/2 rounded-3xl overflow-hidden shadow-2xl shadow-gray-200 dark:shadow-none rotate-1 hover:rotate-0 transition-transform duration-700 ease-out border border-gray-200 dark:border-border-dark">
                <div className="aspect-[4/3] bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuApBJ-Lz2Q_ykm5UsHclqSM7cAbHW2XA7ujopesa4hjl022IcVeBT4nXY5QhVqxYx-beL4eFJIFRSKKxqpU6jT4pt8mtA8YLsGH-D0NWMoC7GOhT7PJjOSzWd-CzN3PwXvUyGVbcLs5Zmrj_Rggdmv7Ic10U_ZYbNcphuNUT6nNTlKcmY3Ono8FWfYhE3sPZfixQV0oZLj7Asdly7zUpXqqwnptbl0-7ymlPe9sqqqbLz-MKTzNqrNYqLGcRcvcF4AnO_jDs7lVm91X")' }}></div>
              </div>
              <div className="w-full lg:w-1/2 flex flex-col gap-6">
                <h2 className="text-gray-900 dark:text-white text-3xl md:text-4xl font-bold leading-tight">Life at ClubSphere</h2>
                <div className="w-12 h-1.5 bg-primary rounded-full"></div>
                <p className="text-text-muted dark:text-text-secondary text-lg leading-relaxed">
                  We believe that the best work happens when you bring your whole self to the table. Our culture is built on trust, transparency, and a relentless focus on our users.
                </p>
                <p className="text-text-muted dark:text-text-secondary text-lg leading-relaxed">
                  We are a remote-first company with hubs in major cities around the world. We value output over hours and autonomy over micromanagement. When we do get together, it's about building bonds that last a lifetime.
                </p>
                <div className="grid grid-cols-2 gap-6 mt-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-3xl font-black text-gray-900 dark:text-white">100%</span>
                    <span className="text-sm text-text-muted dark:text-text-secondary font-medium">Remote Friendly</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-3xl font-black text-gray-900 dark:text-white">15+</span>
                    <span className="text-sm text-text-muted dark:text-text-secondary font-medium">Countries Represented</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Perks & Benefits Section */}
        <section className="w-full px-4 sm:px-6 lg:px-8 py-20 bg-white dark:bg-card-dark border-y border-gray-200 dark:border-border-dark flex justify-center">
          <div className="w-full max-w-[1280px]">
            <div className="flex flex-col gap-12">
              <div className="text-center max-w-2xl mx-auto flex flex-col gap-4">
                <h2 className="text-gray-900 dark:text-white text-3xl md:text-4xl font-bold leading-tight">Perks & Benefits</h2>
                <p className="text-text-muted dark:text-text-secondary text-lg">We take care of our team so they can take care of our community.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-background-light dark:bg-[#29382f] p-8 rounded-2xl flex flex-col gap-4 border border-transparent hover:border-primary/30 transition-colors">
                  <div className="size-12 rounded-xl bg-green-100 dark:bg-green-950/30 text-green-600 dark:text-green-400 flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">favorite</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Health & Wellness</h3>
                  <p className="text-text-muted dark:text-text-secondary">Comprehensive medical, dental, and vision coverage for you and your dependents. Plus a monthly wellness stipend.</p>
                </div>
                <div className="bg-background-light dark:bg-[#29382f] p-8 rounded-2xl flex flex-col gap-4 border border-transparent hover:border-primary/30 transition-colors">
                  <div className="size-12 rounded-xl bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">laptop_mac</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Flexible Work</h3>
                  <p className="text-text-muted dark:text-text-secondary">Work from anywhere. We provide a generous home office setup budget and flexible hours to suit your lifestyle.</p>
                </div>
                <div className="bg-background-light dark:bg-[#29382f] p-8 rounded-2xl flex flex-col gap-4 border border-transparent hover:border-primary/30 transition-colors">
                  <div className="size-12 rounded-xl bg-purple-100 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">school</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Growth & Learning</h3>
                  <p className="text-text-muted dark:text-text-secondary">Annual learning budget for conferences, courses, and books. We're committed to your professional development.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Open Positions Section */}
        <section className="w-full px-4 sm:px-6 lg:px-8 py-20 flex justify-center bg-background-light dark:bg-background-dark" id="positions">
          <div className="w-full max-w-[1024px]">
            <div className="flex flex-col gap-12">
              <div className="flex flex-col items-center text-center gap-2">
                <h2 className="text-gray-900 dark:text-white text-3xl md:text-4xl font-bold leading-tight">Open Positions</h2>
                <p className="text-text-muted dark:text-text-secondary text-lg">Find the role that fits you best.</p>
              </div>
              <div className="flex flex-col gap-4">
                {/* Job Listing 1 */}
                <div className="group p-6 md:p-8 bg-white dark:bg-card-dark border border-gray-200 dark:border-border-dark rounded-2xl hover:border-primary/50 hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">Senior Frontend Engineer</h3>
                      <span className="bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide">Engineering</span>
                    </div>
                    <p className="text-text-muted dark:text-text-secondary text-sm max-w-lg">Build the interfaces that millions of users interact with daily. Experience with React and Tailwind CSS required.</p>
                    <div className="flex gap-4 text-sm text-text-muted dark:text-text-secondary mt-1 font-medium flex-wrap">
                      <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-lg">public</span> Remote (Global)</span>
                      <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-lg">schedule</span> Full-time</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleApplyClick('Senior Frontend Engineer')}
                    className="w-full md:w-auto px-6 py-3 bg-white dark:bg-[#29382f] border-2 border-gray-100 dark:border-border-dark text-gray-900 dark:text-white font-bold rounded-xl hover:bg-primary hover:border-primary hover:text-white dark:hover:text-[#111714] transition-all whitespace-nowrap"
                  >
                    Apply Now
                  </button>
                </div>

                {/* Job Listing 2 */}
                <div className="group p-6 md:p-8 bg-white dark:bg-card-dark border border-gray-200 dark:border-border-dark rounded-2xl hover:border-primary/50 hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">Product Designer</h3>
                      <span className="bg-purple-100 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide">Design</span>
                    </div>
                    <p className="text-text-muted dark:text-text-secondary text-sm max-w-lg">Shape the visual language of our platform. We look for strong systems thinkers with an eye for detail.</p>
                    <div className="flex gap-4 text-sm text-text-muted dark:text-text-secondary mt-1 font-medium flex-wrap">
                      <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-lg">location_on</span> New York, NY</span>
                      <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-lg">schedule</span> Full-time</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleApplyClick('Product Designer')}
                    className="w-full md:w-auto px-6 py-3 bg-white dark:bg-[#29382f] border-2 border-gray-100 dark:border-border-dark text-gray-900 dark:text-white font-bold rounded-xl hover:bg-primary hover:border-primary hover:text-white dark:hover:text-[#111714] transition-all whitespace-nowrap"
                  >
                    Apply Now
                  </button>
                </div>

                {/* Job Listing 3 */}
                <div className="group p-6 md:p-8 bg-white dark:bg-card-dark border border-gray-200 dark:border-border-dark rounded-2xl hover:border-primary/50 hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">Community Manager</h3>
                      <span className="bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide">Operations</span>
                    </div>
                    <p className="text-text-muted dark:text-text-secondary text-sm max-w-lg">Be the voice of ClubSphere. Engage with our top organizers and help them build thriving local clubs.</p>
                    <div className="flex gap-4 text-sm text-text-muted dark:text-text-secondary mt-1 font-medium flex-wrap">
                      <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-lg">location_on</span> London, UK</span>
                      <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-lg">schedule</span> Full-time</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleApplyClick('Community Manager')}
                    className="w-full md:w-auto px-6 py-3 bg-white dark:bg-[#29382f] border-2 border-gray-100 dark:border-border-dark text-gray-900 dark:text-white font-bold rounded-xl hover:bg-primary hover:border-primary hover:text-white dark:hover:text-[#111714] transition-all whitespace-nowrap"
                  >
                    Apply Now
                  </button>
                </div>

                {/* Job Listing 4 */}
                <div className="group p-6 md:p-8 bg-white dark:bg-card-dark border border-gray-200 dark:border-border-dark rounded-2xl hover:border-primary/50 hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">Backend Developer (Go)</h3>
                      <span className="bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide">Engineering</span>
                    </div>
                    <p className="text-text-muted dark:text-text-secondary text-sm max-w-lg">Scale our infrastructure to support millions of concurrent connections. Experience with microservices is a plus.</p>
                    <div className="flex gap-4 text-sm text-text-muted dark:text-text-secondary mt-1 font-medium flex-wrap">
                      <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-lg">public</span> Remote (Americas)</span>
                      <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-lg">schedule</span> Full-time</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleApplyClick('Backend Developer (Go)')}
                    className="w-full md:w-auto px-6 py-3 bg-white dark:bg-[#29382f] border-2 border-gray-100 dark:border-border-dark text-gray-900 dark:text-white font-bold rounded-xl hover:bg-primary hover:border-primary hover:text-white dark:hover:text-[#111714] transition-all whitespace-nowrap"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
              <div className="text-center mt-8">
                <p className="text-text-muted dark:text-text-secondary">Don't see your role? <a className="text-primary font-bold hover:underline" href="mailto:careers@clubsphere.com">Email us your resume</a> and we'll keep you in mind.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      {/* Job Application Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={handleCloseModal}>
          <div className="relative w-full max-w-2xl bg-white dark:bg-card-dark rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="sticky top-0 bg-white dark:bg-card-dark border-b border-gray-200 dark:border-border-dark px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Apply for Position</h2>
                <p className="text-sm text-text-muted dark:text-text-secondary mt-1">{selectedJob?.title}</p>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#29382f] transition-colors"
              >
                <span className="material-symbols-outlined text-gray-600 dark:text-text-secondary">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-[#29382f] border border-gray-200 dark:border-border-dark rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-[#29382f] border border-gray-200 dark:border-border-dark rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  placeholder="john.doe@example.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-[#29382f] border border-gray-200 dark:border-border-dark rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label htmlFor="resume" className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                  Resume/CV <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  id="resume"
                  name="resume"
                  required
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-[#29382f] border border-gray-200 dark:border-border-dark rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-primary file:text-[#111714] file:cursor-pointer hover:file:bg-primary-hover"
                />
                <p className="text-xs text-text-muted dark:text-text-secondary mt-2">Accepted formats: PDF, DOC, DOCX (Max 5MB)</p>
              </div>

              <div>
                <label htmlFor="coverLetter" className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                  Cover Letter
                </label>
                <textarea
                  id="coverLetter"
                  name="coverLetter"
                  rows="6"
                  value={formData.coverLetter}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-[#29382f] border border-gray-200 dark:border-border-dark rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
                  placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                ></textarea>
              </div>

              {/* Modal Footer */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-border-dark">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-6 py-3 bg-gray-100 dark:bg-[#29382f] text-gray-900 dark:text-white font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-border-dark transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-primary hover:bg-primary-hover text-[#111714] font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="material-symbols-outlined animate-spin">sync</span>
                      Submitting...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Careers;


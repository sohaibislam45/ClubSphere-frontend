import { useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const TermsOfService = () => {
  useEffect(() => {
    document.title = 'Terms of Service - ClubSphere';
  }, []);

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
            <span className="text-primary font-bold uppercase tracking-wider text-sm bg-primary/10 dark:bg-primary/20 px-4 py-1.5 rounded-full">Legal</span>
            <h1 className="text-gray-900 dark:text-white text-5xl sm:text-6xl lg:text-7xl font-black leading-tight tracking-[-0.033em]">
              Terms of <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-600">Service</span>
            </h1>
            <p className="text-text-muted dark:text-text-secondary text-lg sm:text-xl font-normal leading-relaxed max-w-[720px]">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="w-full px-4 sm:px-6 lg:px-8 py-20 flex justify-center">
          <div className="w-full max-w-[960px]">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div className="flex flex-col gap-8 text-text-muted dark:text-text-secondary leading-relaxed">
                <div>
                  <h2 className="text-gray-900 dark:text-white text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
                  <p>
                    By accessing and using ClubSphere ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use our Service.
                  </p>
                </div>

                <div>
                  <h2 className="text-gray-900 dark:text-white text-2xl font-bold mb-4">2. Description of Service</h2>
                  <p>
                    ClubSphere is a platform that connects individuals with local clubs and communities based on shared interests. We provide tools for organizing events, managing memberships, and facilitating community engagement.
                  </p>
                </div>

                <div>
                  <h2 className="text-gray-900 dark:text-white text-2xl font-bold mb-4">3. User Accounts</h2>
                  <h3 className="text-gray-900 dark:text-white text-xl font-bold mb-3 mt-4">3.1 Registration</h3>
                  <p>To use certain features of the Service, you must register for an account. You agree to:</p>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                    <li>Provide accurate, current, and complete information</li>
                    <li>Maintain and update your information as necessary</li>
                    <li>Maintain the security of your account credentials</li>
                    <li>Accept responsibility for all activities under your account</li>
                  </ul>

                  <h3 className="text-gray-900 dark:text-white text-xl font-bold mb-3 mt-4">3.2 Account Responsibilities</h3>
                  <p>You are responsible for maintaining the confidentiality of your account and password and for restricting access to your account.</p>
                </div>

                <div>
                  <h2 className="text-gray-900 dark:text-white text-2xl font-bold mb-4">4. User Conduct</h2>
                  <p>You agree not to:</p>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                    <li>Violate any applicable laws or regulations</li>
                    <li>Infringe on the rights of others</li>
                    <li>Post false, misleading, or fraudulent information</li>
                    <li>Spam or harass other users</li>
                    <li>Upload malicious code or viruses</li>
                    <li>Interfere with or disrupt the Service</li>
                    <li>Use the Service for any illegal or unauthorized purpose</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-gray-900 dark:text-white text-2xl font-bold mb-4">5. Club and Event Management</h2>
                  <h3 className="text-gray-900 dark:text-white text-xl font-bold mb-3 mt-4">5.1 Club Creation</h3>
                  <p>
                    Users may create clubs and organize events. Club organizers are responsible for managing their clubs and events in accordance with these Terms and applicable laws.
                  </p>

                  <h3 className="text-gray-900 dark:text-white text-xl font-bold mb-3 mt-4">5.2 Event Liability</h3>
                  <p>
                    ClubSphere is not responsible for the content, conduct, or safety of events organized through our platform. Event organizers are solely responsible for their events.
                  </p>
                </div>

                <div>
                  <h2 className="text-gray-900 dark:text-white text-2xl font-bold mb-4">6. Payments and Fees</h2>
                  <p>
                    Some features of the Service may require payment of fees. By purchasing paid features, you agree to pay all fees associated with your use of the Service. All fees are non-refundable unless otherwise stated.
                  </p>
                </div>

                <div>
                  <h2 className="text-gray-900 dark:text-white text-2xl font-bold mb-4">7. Intellectual Property</h2>
                  <p>
                    The Service and its original content, features, and functionality are owned by ClubSphere and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                  </p>
                </div>

                <div>
                  <h2 className="text-gray-900 dark:text-white text-2xl font-bold mb-4">8. Content Ownership</h2>
                  <p>
                    You retain ownership of any content you post on the Service. By posting content, you grant ClubSphere a worldwide, non-exclusive, royalty-free license to use, reproduce, and display your content in connection with the Service.
                  </p>
                </div>

                <div>
                  <h2 className="text-gray-900 dark:text-white text-2xl font-bold mb-4">9. Termination</h2>
                  <p>
                    We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including if you breach the Terms. Upon termination, your right to use the Service will cease immediately.
                  </p>
                </div>

                <div>
                  <h2 className="text-gray-900 dark:text-white text-2xl font-bold mb-4">10. Disclaimers</h2>
                  <p>
                    THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.
                  </p>
                </div>

                <div>
                  <h2 className="text-gray-900 dark:text-white text-2xl font-bold mb-4">11. Limitation of Liability</h2>
                  <p>
                    IN NO EVENT SHALL CLUBSPHERE BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
                  </p>
                </div>

                <div>
                  <h2 className="text-gray-900 dark:text-white text-2xl font-bold mb-4">12. Governing Law</h2>
                  <p>
                    These Terms shall be governed by and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions.
                  </p>
                </div>

                <div>
                  <h2 className="text-gray-900 dark:text-white text-2xl font-bold mb-4">13. Changes to Terms</h2>
                  <p>
                    We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
                  </p>
                </div>

                <div>
                  <h2 className="text-gray-900 dark:text-white text-2xl font-bold mb-4">14. Contact Information</h2>
                  <p>
                    If you have any questions about these Terms of Service, please contact us at:
                  </p>
                  <div className="mt-4 p-4 bg-white dark:bg-[#29382f] rounded-xl border border-gray-200 dark:border-border-dark">
                    <p className="font-medium text-gray-900 dark:text-white mb-2">ClubSphere Legal Team</p>
                    <p>Email: <a href="mailto:legal@clubsphere.com" className="text-primary hover:underline">legal@clubsphere.com</a></p>
                    <p className="mt-2">Address: 123 Community Street, San Francisco, CA 94102, United States</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;


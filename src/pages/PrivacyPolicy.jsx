import { useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const PrivacyPolicy = () => {
  useEffect(() => {
    document.title = 'Privacy Policy - ClubSphere';
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
              Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-600">Policy</span>
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
                  <h2 className="text-gray-900 dark:text-white text-2xl font-bold mb-4">1. Introduction</h2>
                  <p>
                    ClubSphere ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform and services.
                  </p>
                </div>

                <div>
                  <h2 className="text-gray-900 dark:text-white text-2xl font-bold mb-4">2. Information We Collect</h2>
                  <h3 className="text-gray-900 dark:text-white text-xl font-bold mb-3 mt-4">2.1 Personal Information</h3>
                  <p>We may collect personal information that you provide directly to us, including:</p>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                    <li>Name, email address, and phone number</li>
                    <li>Profile information and photos</li>
                    <li>Payment and billing information</li>
                    <li>Club and event participation data</li>
                  </ul>

                  <h3 className="text-gray-900 dark:text-white text-xl font-bold mb-3 mt-4">2.2 Usage Information</h3>
                  <p>We automatically collect information about your use of our services, including:</p>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                    <li>Device information and IP address</li>
                    <li>Browser type and version</li>
                    <li>Pages visited and time spent on pages</li>
                    <li>Search queries and interaction data</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-gray-900 dark:text-white text-2xl font-bold mb-4">3. How We Use Your Information</h2>
                  <p>We use the information we collect to:</p>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                    <li>Provide, maintain, and improve our services</li>
                    <li>Process transactions and send related information</li>
                    <li>Send you technical notices and support messages</li>
                    <li>Respond to your comments and questions</li>
                    <li>Monitor and analyze trends and usage</li>
                    <li>Detect, prevent, and address technical issues</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-gray-900 dark:text-white text-2xl font-bold mb-4">4. Information Sharing and Disclosure</h2>
                  <p>We do not sell your personal information. We may share your information in the following circumstances:</p>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                    <li><strong>With Your Consent:</strong> When you consent to sharing information with other users or third parties</li>
                    <li><strong>Service Providers:</strong> With vendors who perform services on our behalf</li>
                    <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                    <li><strong>Business Transfers:</strong> In connection with any merger or sale of assets</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-gray-900 dark:text-white text-2xl font-bold mb-4">5. Data Security</h2>
                  <p>
                    We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
                  </p>
                </div>

                <div>
                  <h2 className="text-gray-900 dark:text-white text-2xl font-bold mb-4">6. Your Rights and Choices</h2>
                  <p>You have the right to:</p>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                    <li>Access and update your personal information</li>
                    <li>Request deletion of your account and data</li>
                    <li>Opt-out of marketing communications</li>
                    <li>Request a copy of your data</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-gray-900 dark:text-white text-2xl font-bold mb-4">7. Cookies and Tracking Technologies</h2>
                  <p>
                    We use cookies and similar tracking technologies to track activity on our platform and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                  </p>
                </div>

                <div>
                  <h2 className="text-gray-900 dark:text-white text-2xl font-bold mb-4">8. Third-Party Services</h2>
                  <p>
                    Our platform may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies.
                  </p>
                </div>

                <div>
                  <h2 className="text-gray-900 dark:text-white text-2xl font-bold mb-4">9. Children's Privacy</h2>
                  <p>
                    Our services are not intended for individuals under the age of 13. We do not knowingly collect personal information from children under 13.
                  </p>
                </div>

                <div>
                  <h2 className="text-gray-900 dark:text-white text-2xl font-bold mb-4">10. Changes to This Privacy Policy</h2>
                  <p>
                    We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                  </p>
                </div>

                <div>
                  <h2 className="text-gray-900 dark:text-white text-2xl font-bold mb-4">11. Contact Us</h2>
                  <p>
                    If you have any questions about this Privacy Policy, please contact us at:
                  </p>
                  <div className="mt-4 p-4 bg-white dark:bg-[#29382f] rounded-xl border border-gray-200 dark:border-border-dark">
                    <p className="font-medium text-gray-900 dark:text-white mb-2">ClubSphere Privacy Team</p>
                    <p>Email: <a href="mailto:privacy@clubsphere.com" className="text-primary hover:underline">privacy@clubsphere.com</a></p>
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

export default PrivacyPolicy;


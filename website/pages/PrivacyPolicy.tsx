import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function PrivacyPolicy() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600">
            Last updated: October 19, 2025
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
            <p className="text-blue-800 font-medium">
              At TestNotifier, your privacy is our priority. This policy explains how we collect, use, and protect your personal information.
            </p>
          </div>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. Information We Collect
            </h2>
            <div className="space-y-4 text-gray-700">
              <h3 className="text-lg font-medium text-gray-800">1.1 Personal Information</h3>
              <p>We collect personal information that you provide to us, including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Name and email address when you create an account</li>
                <li>Phone number for SMS notifications (optional)</li>
                <li>Payment information processed through Stripe</li>
                <li>Driving test booking reference numbers</li>
                <li>Preferred test centers and dates</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800">1.2 Usage Data</h3>
              <p>We automatically collect information about how you use our service:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Browser type and version</li>
                <li>Device information and operating system</li>
                <li>Pages visited and time spent</li>
                <li>Extension usage statistics</li>
                <li>IP address and location data</li>
              </ul>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. How We Use Your Information
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>We use your information to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide and maintain our test monitoring service</li>
                <li>Send you notifications about available test slots</li>
                <li>Process payments and manage subscriptions</li>
                <li>Improve and optimize our service</li>
                <li>Comply with legal obligations</li>
                <li>Communicate with you about service updates</li>
              </ul>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. Data Storage and Security
            </h2>
            <div className="space-y-4 text-gray-700">
              <h3 className="text-lg font-medium text-gray-800">3.1 Security Measures</h3>
              <p>We implement appropriate technical and organizational measures to protect your data:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>SSL/TLS encryption for data transmission</li>
                <li>Secure server infrastructure with regular backups</li>
                <li>Access controls and authentication systems</li>
                <li>Regular security audits and updates</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800">3.2 Data Retention</h3>
              <p>We retain your personal information for as long as necessary to provide our services, or as required by law:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Account information: Until account deletion</li>
                <li>Payment data: As required by financial regulations</li>
                <li>Usage data: 24 months for analytics purposes</li>
                <li>Communication records: 12 months</li>
              </ul>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Your Rights (GDPR Compliance)
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>Under the General Data Protection Regulation (GDPR), you have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Access:</strong> Request copies of your personal data</li>
                <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
                <li><strong>Erasure:</strong> Request deletion of your personal data</li>
                <li><strong>Restrict processing:</strong> Limit how we use your data</li>
                <li><strong>Data portability:</strong> Transfer your data to another service</li>
                <li><strong>Object:</strong> Object to how we use your data</li>
              </ul>
              <p>To exercise these rights, contact us at hello@testnotifier.co.uk</p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Third-Party Services
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>We use trusted third-party services to operate our business:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Stripe:</strong> Payment processing (subject to Stripe's privacy policy)</li>
                <li><strong>Twilio:</strong> SMS notifications (subject to Twilio's privacy policy)</li>
                <li><strong>Google Analytics:</strong> Website analytics (anonymized data)</li>
                <li><strong>Vercel:</strong> Hosting infrastructure</li>
              </ul>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. Cookies Policy
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>We use cookies and similar technologies to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Maintain your login session</li>
                <li>Remember your preferences</li>
                <li>Analyze website usage</li>
                <li>Improve our service</li>
              </ul>
              <p>You can control cookie settings through your browser preferences.</p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. Changes to This Policy
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>We may update this privacy policy from time to time. We will notify you of any changes by:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Posting the new policy on this page</li>
                <li>Updating the "Last updated" date</li>
                <li>Sending email notifications for significant changes</li>
              </ul>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              8. Contact Us
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>If you have questions about this privacy policy or our data practices, please contact us:</p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p><strong>Email:</strong> hello@testnotifier.co.uk</p>
                <p><strong>Data Protection Officer:</strong> hello@testnotifier.co.uk</p>
                <p><strong>Business Address:</strong> TestNotifier, United Kingdom</p>
              </div>
            </div>
          </section>

          <div className="mt-12 p-6 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              By using TestNotifier, you consent to the collection and use of information as described in this privacy policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
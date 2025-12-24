import { useEffect } from 'react';

export function Privacy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="prose prose-blue max-w-none">
            <p className="text-gray-600 mb-6">
              Last updated: November 2, 2025
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>
            <p className="text-gray-700 mb-4">
              We collect information you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Account information (name, email address)</li>
              <li>Payment information (processed securely by Stripe)</li>
              <li>Driving test details (current booking, preferred dates)</li>
              <li>Test centre preferences</li>
              <li>Notification preferences</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Monitor DVSA test cancellations on your behalf</li>
              <li>Send you notifications about available test slots</li>
              <li>Process payments and manage subscriptions</li>
              <li>Provide customer support</li>
              <li>Improve our service</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Data Security</h2>
            <p className="text-gray-700 mb-6">
              We implement appropriate security measures to protect your personal information. 
              All payment processing is handled by Stripe, and we never store your card details.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Contact Us</h2>
            <p className="text-gray-700">
              If you have any questions about this Privacy Policy, please contact us at:{' '}
              <a href="mailto:hello@testnotifier.co.uk" className="text-blue-600 hover:underline">
                hello@testnotifier.co.uk
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Privacy;


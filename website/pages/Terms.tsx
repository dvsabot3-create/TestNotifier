import { useEffect } from 'react';

export function Terms() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="prose prose-blue max-w-none">
            <p className="text-gray-600 mb-6">
              Last updated: November 2, 2025
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Service Description</h2>
            <p className="text-gray-700 mb-6">
              TestNotifier is a notification service that monitors the DVSA website for driving test cancellations 
              and alerts users when earlier test dates become available.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Subscription Terms</h2>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Subscriptions are billed monthly unless otherwise specified</li>
              <li>You may cancel your subscription at any time from your dashboard</li>
              <li>Refunds are provided according to our refund policy</li>
              <li>One-off purchases are non-refundable after use</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. User Responsibilities</h2>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>You are responsible for maintaining the security of your account</li>
              <li>You must provide accurate information</li>
              <li>You must comply with DVSA terms and conditions</li>
              <li>You must not abuse or attempt to circumvent service limits</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Limitations</h2>
            <p className="text-gray-700 mb-6">
              TestNotifier cannot guarantee test slot availability or booking success. 
              We provide notifications only and are not responsible for DVSA system changes or downtime.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Contact</h2>
            <p className="text-gray-700">
              For questions about these terms, contact:{' '}
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

export default Terms;


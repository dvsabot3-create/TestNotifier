import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function TermsOfService() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-gray-600">
            Last updated: October 19, 2025
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mb-8">
            <p className="text-yellow-800 font-medium">
              By accessing and using TestNotifier, you agree to be bound by these Terms of Service. Please read them carefully before using our service.
            </p>
          </div>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. Acceptance of Terms
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>By accessing and using TestNotifier ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, you may not access the Service.</p>
              <p>These Terms apply to all visitors, users, and others who access or use the Service.</p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. Service Description
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>TestNotifier provides:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Automated monitoring of DVSA driving test cancellation slots</li>
                <li>Email and SMS notifications for available test dates</li>
                <li>Chrome browser extension for enhanced functionality</li>
                <li>Multi-pupil management for driving instructors</li>
              </ul>
              <p>We do not guarantee test slot availability and are not responsible for booking tests on your behalf.</p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. User Obligations
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>As a user of TestNotifier, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate and complete registration information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Use the service only for lawful purposes</li>
                <li>Not attempt to interfere with the service's operation</li>
                <li>Not use automated means to access the service without permission</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Payment Terms
            </h2>
            <div className="space-y-4 text-gray-700">
              <h3 className="text-lg font-medium text-gray-800">4.1 Subscription Plans</h3>
              <p>We offer several subscription plans:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>One-off rebooking service (£30)</li>
                <li>Monthly subscription plans (Starter, Premium, Professional)</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800">4.2 Billing</h3>
              <p>All payments are processed through Stripe. By subscribing, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Pay all fees and charges in accordance with your selected plan</li>
                <li>Keep your payment information current and accurate</li>
                <li>Automatic renewal unless cancelled before the renewal date</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800">4.3 Refund Policy</h3>
              <p>We offer refunds within 14 days of purchase if:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The service has not been used to monitor any tests</li>
                <li>No notifications have been sent</li>
                <li>You contact us within the 14-day period</li>
              </ul>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Service Limitations
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>You acknowledge that:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Test slot availability is not guaranteed</li>
                <li>We do not book tests on your behalf</li>
                <li>DVSA systems may experience downtime or changes</li>
                <li>Notification delivery is dependent on third-party services</li>
                <li>We are not responsible for missed test opportunities</li>
              </ul>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. Intellectual Property
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>All content, features, and functionality of TestNotifier are owned by us and are protected by international copyright, trademark, and other intellectual property laws.</p>
              <p>You may not reproduce, distribute, modify, or create derivative works without our express written permission.</p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. Termination
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Breach of these Terms</li>
                <li>Illegal or unauthorized use of the Service</li>
                <li>Non-payment of fees</li>
                <li>At our discretion for any reason</li>
              </ul>
              <p>Upon termination, your right to use the Service will immediately cease.</p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              8. Limitation of Liability
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>To the maximum extent permitted by law, TestNotifier shall not be liable for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Any indirect, incidental, special, or consequential damages</li>
                <li>Loss of profits, data, or business opportunities</li>
                <li>Service interruptions or downtime</li>
                <li>Missed test opportunities or booking failures</li>
                <li>Damages exceeding the amount paid for our service in the past 12 months</li>
              </ul>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              9. Disclaimer
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>The Service is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.</p>
              <p>We do not guarantee that the Service will be uninterrupted, secure, or error-free.</p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              10. Governing Law
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>These Terms shall be governed by and construed in accordance with the laws of England and Wales, without regard to its conflict of law provisions.</p>
              <p>Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts of England and Wales.</p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              11. Changes to Terms
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>We reserve the right to modify these Terms at any time. We will notify you of any changes by:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Posting the updated Terms on this page</li>
                <li>Updating the "Last updated" date</li>
                <li>Sending email notifications for significant changes</li>
              </ul>
              <p>Your continued use of the Service after changes are posted constitutes acceptance of those changes.</p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              12. Contact Information
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>If you have any questions about these Terms of Service, please contact us:</p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p><strong>Email:</strong> hello@testnotifier.co.uk</p>
                <p><strong>Business Address:</strong> TestNotifier, United Kingdom</p>
              </div>
            </div>
          </section>

          <div className="mt-12 p-6 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              By using TestNotifier, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
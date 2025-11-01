import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function CookiePolicy() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Cookie Policy
          </h1>
          <p className="text-lg text-gray-600">
            Last updated: October 19, 2025
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
            <p className="text-blue-800 font-medium">
              This Cookie Policy explains how TestNotifier uses cookies and similar technologies to recognize you when you visit our website. It explains what these technologies are and why we use them.
            </p>
          </div>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. What Are Cookies?
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners.</p>
              <p>Cookies set by the website owner (TestNotifier) are called "first-party cookies." Cookies set by parties other than the website owner are called "third-party cookies."</p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. Why Do We Use Cookies?
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>We use cookies for several reasons:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>To keep you signed in to your account</li>
                <li>To remember your preferences and settings</li>
                <li>To understand how you use our website</li>
                <li>To monitor and analyze the performance of our service</li>
                <li>To personalize your experience</li>
                <li>To improve our products and services</li>
              </ul>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. Types of Cookies We Use
            </h2>
            <div className="space-y-6 text-gray-700">
              <h3 className="text-lg font-medium text-gray-800">3.1 Essential Cookies</h3>
              <p>These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility.</p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p><strong>Examples:</strong></p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Authentication cookies (keeping you logged in)</li>
                  <li>Session cookies (maintaining your session)</li>
                  <li>Security cookies (preventing fraud)</li>
                </ul>
              </div>

              <h3 className="text-lg font-medium text-gray-800">3.2 Performance Cookies</h3>
              <p>These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.</p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p><strong>Examples:</strong></p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Google Analytics cookies</li>
                  <li>Page load time analytics</li>
                  <li>Error monitoring cookies</li>
                </ul>
              </div>

              <h3 className="text-lg font-medium text-gray-800">3.3 Functional Cookies</h3>
              <p>These cookies enable the website to provide enhanced functionality and personalization.</p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p><strong>Examples:</strong></p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Preference cookies (language, region)</li>
                  <li>Notification preference cookies</li>
                  <li>User interface customization cookies</li>
                </ul>
              </div>

              <h3 className="text-lg font-medium text-gray-800">3.4 Targeting Cookies</h3>
              <p>These cookies may be set through our site by our advertising partners to build a profile of your interests and show you relevant advertisements.</p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p><strong>Note:</strong> We currently do not use targeting cookies for advertising purposes.</p>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Specific Cookies We Use
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cookie Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">auth_token</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Essential</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Keeps you logged in to your account</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">24 hours</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">user_preferences</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Functional</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Stores your notification preferences</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1 year</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">_ga</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Performance</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Google Analytics - distinguishes users</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2 years</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">_gid</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Performance</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Google Analytics - distinguishes users</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">24 hours</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">_session</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Essential</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Maintains your session state</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Session</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Managing Cookies
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>You can control and manage cookies in several ways:</p>
              <h3 className="text-lg font-medium text-gray-800">5.1 Browser Settings</h3>
              <p>Most web browsers allow you to control cookies through their settings preferences. You can:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Reject all cookies</li>
                <li>Accept only first-party cookies</li>
                <li>Delete cookies when you close your browser</li>
                <li>Be notified when a cookie is being set</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800">5.2 Opt-out Links</h3>
              <p>For third-party cookies, you can opt out using these links:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><a href="https://tools.google.com/dlpage/gaoptout" className="text-blue-600 hover:underline">Google Analytics Opt-out</a></li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800">5.3 Impact of Disabling Cookies</h3>
              <p>If you choose to disable cookies, some features of our website may not function properly:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You may not be able to log in to your account</li>
                <li>Your preferences may not be saved</li>
                <li>Some parts of the website may not work correctly</li>
              </ul>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. Third-Party Cookies
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>Some cookies are set by third parties for the following purposes:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Google Analytics:</strong> To analyze website usage and performance</li>
                <li><strong>Stripe:</strong> To process payments securely</li>
                <li><strong>Twilio:</strong> To send SMS notifications (optional)</li>
              </ul>
              <p>These third parties have their own cookie policies which you should review.</p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. Cookie Consent
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>When you first visit our website, we will show you a cookie banner asking for your consent to use non-essential cookies. You can:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Accept all cookies</li>
                <li>Reject non-essential cookies</li>
                <li>Customize your cookie preferences</li>
              </ul>
              <p>You can change your cookie preferences at any time by clicking the "Cookie Settings" link in the footer of our website.</p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              8. Changes to This Policy
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any changes by:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Updating the "Last updated" date at the top of this page</li>
                <li>Posting the new policy on our website</li>
              </ul>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              9. Contact Us
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>If you have any questions about this Cookie Policy, please contact us:</p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p><strong>Email:</strong> hello@testnotifier.co.uk</p>
                <p><strong>Business Address:</strong> TestNotifier, United Kingdom</p>
              </div>
            </div>
          </section>

          <div className="mt-12 p-6 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              This Cookie Policy is part of our Privacy Policy. By continuing to use our website, you consent to the use of cookies as described in this policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
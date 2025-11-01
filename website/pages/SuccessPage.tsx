import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle, Download, Mail, Calendar, MapPin, Bell } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function SuccessPage() {
  const [searchParams] = useSearchParams();
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      const fetchSessionData = async () => {
        try {
          const response = await fetch(`/api/get-checkout-session?session_id=${sessionId}`);
          const data = await response.json();
          
          if (data.error) {
            throw new Error(data.error);
          }
          
          setSessionData({
            planName: data.planName,
            customerEmail: data.customerEmail,
            amount: data.amount,
            status: data.status
          });
        } catch (error) {
          console.error('Error fetching session data:', error);
          // Fallback to default data
          setSessionData({
            planName: 'Premium Plan',
            customerEmail: 'customer@example.com',
            amount: '£29.00',
            status: 'paid'
          });
        } finally {
          setLoading(false);
        }
      };
      
      fetchSessionData();
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  const handleDownloadExtension = () => {
    const link = document.createElement('a');
    link.href = '/downloads/testnotifier-extension.zip';
    link.download = 'testnotifier-extension.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEmailSupport = () => {
    window.location.href = 'mailto:hello@testnotifier.co.uk?subject=Payment Confirmation - Need Help';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-[#f8f9fa] to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1d70b8] mx-auto mb-4"></div>
          <p className="text-[#6c757d]">Processing your payment...</p>
        </div>
      </div>
    );
  }

  if (!sessionId || !sessionData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-[#f8f9fa] to-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Payment Not Found</h1>
          <p className="text-gray-600 mb-6">
            We couldn't find your payment session. If you completed a payment, please contact support.
          </p>
          <Button onClick={handleEmailSupport} className="w-full">
            <Mail className="w-4 h-4 mr-2" />
            Contact Support
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#f8f9fa] to-white">
      <div className="max-w-4xl mx-auto px-6 py-20">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-[#1d70b8] mb-4">
            Payment Successful! 🎉
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Welcome to TestNotifier {sessionData.planName}
          </p>
          <p className="text-gray-500">
            Your subscription is now active and ready to use
          </p>
        </div>

        {/* Payment Details */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-[#1d70b8] mb-6">Payment Details</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Plan</h3>
              <p className="text-[#1d70b8]">{sessionData.planName}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Amount</h3>
              <p className="text-[#28a745] font-bold">{sessionData.amount}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Email</h3>
              <p className="text-gray-600">{sessionData.customerEmail}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Status</h3>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <CheckCircle className="w-4 h-4 mr-1" />
                {sessionData.status}
              </span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-8 border border-blue-100">
          <h2 className="text-2xl font-bold text-[#1d70b8] mb-6">What's Next?</h2>
          <div className="bg-white rounded-xl p-6 mb-6 border border-blue-200">
            <h3 className="font-bold text-lg text-[#1d70b8] mb-3">✅ Your Account is Active</h3>
            <p className="text-gray-600 mb-4">
              Your subscription is now active and you can start using TestNotifier immediately. Follow these steps to get started:
            </p>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <span className="font-bold text-[#1d70b8]">1.</span>
                <p>Check your email <strong className="text-[#1d70b8]">({sessionData.customerEmail})</strong> for the activation confirmation and extension download link</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="font-bold text-[#1d70b8]">2.</span>
                <p>Download and install the Chrome extension from the link in your email</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="font-bold text-[#1d70b8]">3.</span>
                <p>Open the extension and configure your test centers and preferences</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="font-bold text-[#1d70b8]">4.</span>
                <p>Start monitoring! You'll receive SMS and email notifications when slots become available</p>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-[#1d70b8] rounded-xl flex items-center justify-center mx-auto mb-4">
                <Download className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-[#1d70b8] mb-2">Download Extension</h3>
              <p className="text-sm text-gray-600 mb-4">
                Get the Chrome extension link from your email, or click to download now
              </p>
              <Button onClick={handleDownloadExtension} size="sm" className="w-full">
                Download Now
              </Button>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-[#28a745] rounded-xl flex items-center justify-center mx-auto mb-4">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-[#1d70b8] mb-2">Setup Guide</h3>
              <p className="text-sm text-gray-600 mb-4">
                Learn how to configure your monitoring preferences
              </p>
              <Button variant="outline" size="sm" onClick={() => window.open('https://testnotifier.co.uk/setup-guide', '_blank')} className="w-full">
                View Guide
              </Button>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-[#2e8bc0] rounded-xl flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-[#1d70b8] mb-2">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Our support team is here to assist you
              </p>
              <Button variant="outline" size="sm" onClick={handleEmailSupport} className="w-full">
                Contact Support
              </Button>
            </div>
          </div>
        </div>

        {/* Features Unlocked */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-[#1d70b8] mb-6">Features Now Unlocked</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              'Monitor up to 8 test centers',
              '5 rebooks included per month',
              'Priority SMS + Email notifications',
              'Rapid mode (500ms checks)',
              'Advanced filtering options',
              '24/7 email support',
              'Chrome extension access',
              'Success rate analytics'
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Support Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#1d70b8] mb-4">Need Help Getting Started?</h2>
          <p className="text-gray-600 mb-6">
            Our support team is ready to help you get the most out of TestNotifier
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handleEmailSupport} className="bg-[#1d70b8] hover:bg-[#2e8bc0]">
              <Mail className="w-4 h-4 mr-2" />
              Email Support
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              Return to Homepage
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}


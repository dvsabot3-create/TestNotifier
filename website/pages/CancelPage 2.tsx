import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { XCircle, RefreshCw, Mail, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function CancelPage() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const handleRetryPayment = () => {
    window.location.href = '/#pricing';
  };

  const handleEmailSupport = () => {
    window.location.href = 'mailto:hello@testnotifier.co.uk?subject=Payment Issue - Need Help';
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-[#f8f9fa] to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1d70b8] mx-auto mb-4"></div>
          <p className="text-[#6c757d]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#f8f9fa] to-white">
      <div className="max-w-4xl mx-auto px-6 py-20">
        {/* Cancel Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Payment Cancelled
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            No worries - you can try again anytime
          </p>
          <p className="text-gray-500">
            Your payment was cancelled and no charges were made
          </p>
        </div>

        {/* Session Info */}
        {sessionId && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-[#1d70b8] mb-6">Session Details</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">
                <strong>Session ID:</strong> {sessionId}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                <strong>Status:</strong> Cancelled by user
              </p>
            </div>
          </div>
        )}

        {/* Why This Happens */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-8 border border-blue-100">
          <h2 className="text-2xl font-bold text-[#1d70b8] mb-6">Why Did This Happen?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-[#1d70b8] mb-3">Common Reasons:</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Changed your mind about the plan</li>
                <li>• Wanted to compare different options</li>
                <li>• Payment method issues</li>
                <li>• Browser or connection problems</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-[#1d70b8] mb-3">No Problem!</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• No charges were made to your card</li>
                <li>• You can try again anytime</li>
                <li>• All plans are still available</li>
                <li>• Our support team is here to help</li>
              </ul>
            </div>
          </div>
        </div>

        {/* What You Can Do */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-[#1d70b8] mb-6">What Would You Like To Do?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 border border-gray-200 rounded-xl">
              <div className="w-12 h-12 bg-[#1d70b8] rounded-xl flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-[#1d70b8] mb-2">Try Again</h3>
              <p className="text-sm text-gray-600 mb-4">
                Select a plan and complete your payment
              </p>
              <Button onClick={handleRetryPayment} size="sm" className="w-full">
                Choose Plan
              </Button>
            </div>
            
            <div className="text-center p-6 border border-gray-200 rounded-xl">
              <div className="w-12 h-12 bg-[#28a745] rounded-xl flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-[#1d70b8] mb-2">Get Help</h3>
              <p className="text-sm text-gray-600 mb-4">
                Contact our support team for assistance
              </p>
              <Button variant="outline" onClick={handleEmailSupport} size="sm" className="w-full">
                Contact Support
              </Button>
            </div>
            
            <div className="text-center p-6 border border-gray-200 rounded-xl">
              <div className="w-12 h-12 bg-[#2e8bc0] rounded-xl flex items-center justify-center mx-auto mb-4">
                <ArrowLeft className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-[#1d70b8] mb-2">Go Back</h3>
              <p className="text-sm text-gray-600 mb-4">
                Return to our homepage to learn more
              </p>
              <Button variant="outline" onClick={handleGoHome} size="sm" className="w-full">
                Homepage
              </Button>
            </div>
          </div>
        </div>

        {/* Special Offer */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 mb-8 border border-green-100">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#1d70b8] mb-4">
              Still Interested? We're Here to Help! 💚
            </h2>
            <p className="text-gray-600 mb-6">
              If you had any issues with the payment process or want to discuss your options, 
              our team is ready to help you get started with TestNotifier.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={handleRetryPayment} className="bg-[#28a745] hover:bg-[#20c997]">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Payment Again
              </Button>
              <Button variant="outline" onClick={handleEmailSupport}>
                <Mail className="w-4 h-4 mr-2" />
                Get Personal Help
              </Button>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-[#1d70b8] mb-2">Questions?</h3>
          <p className="text-gray-600 mb-4">
            Our support team responds within 2 hours
          </p>
          <Button variant="outline" onClick={handleEmailSupport}>
            <Mail className="w-4 h-4 mr-2" />
            hello@testnotifier.co.uk
          </Button>
        </div>
      </div>
    </div>
  );
}


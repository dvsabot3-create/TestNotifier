import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Clock, Mail, Phone, CheckCircle, Zap, Star } from "lucide-react";

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  planPrice: string;
  planFeatures: string[];
}

export function ComingSoonModal({ isOpen, onClose, planName, planPrice, planFeatures }: ComingSoonModalProps) {

  const getPlanIcon = () => {
    switch (planName.toLowerCase()) {
      case 'one-off rebook':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'starter':
        return <Zap className="w-6 h-6 text-blue-600" />;
      case 'premium':
        return <Star className="w-6 h-6 text-purple-600" />;
      case 'professional':
        return <Star className="w-6 h-6 text-red-600" />;
      default:
        return <CheckCircle className="w-6 h-6 text-blue-600" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
              {getPlanIcon()}
            </div>
          </div>
          <DialogTitle className="text-center text-2xl font-bold">
            {planName} - Payment Processing
          </DialogTitle>
          <DialogDescription className="text-center">
            Our payment system is currently being updated. Contact us directly for immediate access and special pricing!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Plan Preview */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-blue-600">{planPrice}</div>
              <div className="text-sm text-gray-600">per {planPrice.includes('month') ? 'month' : 'one-time'}</div>
            </div>

            <div className="space-y-2">
              {planFeatures.map((feature, index) => (
                <div key={index} className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Direct Contact Options */}
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Get Immediate Access</h3>
              <p className="text-gray-600 mb-6">Contact us directly for instant setup and special pricing</p>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              <a
                href={`mailto:hello@testnotifier.co.uk?subject=${planName} Subscription Request&body=Hi, I'm interested in the ${planName} plan. Please contact me with pricing and setup details.`}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg text-center font-medium transition-all flex items-center justify-center gap-2"
              >
                <Mail className="w-5 h-5" />
                Email Support Now
              </a>
            </div>
            
            <div className="text-center text-sm text-gray-500">
              <p>✅ Response within 2 hours</p>
              <p>✅ Special pricing available</p>
              <p>✅ Instant setup assistance</p>
            </div>
          </div>

          {/* Alternative Contact */}
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">Need immediate access or have questions?</p>
            <div className="flex justify-center space-x-4">
              <a
                href="mailto:hello@testnotifier.co.uk"
                className="flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                <Mail className="w-4 h-4 mr-1" />
                Email Support
              </a>
              <span className="text-gray-400">•</span>
              <a
                href="/contact"
                className="flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                <Phone className="w-4 h-4 mr-1" />
                Contact Us
              </a>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-gray-500" />
                <span>Payment system update: In progress</span>
              </div>
              <span className="text-green-600 font-medium">Special Pricing Available</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            Maybe Later
          </Button>
          <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700">
            Continue Browsing
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Check, X, Star, Sparkles, Shield, Zap, TrendingUp, Crown } from "lucide-react";
import { useState } from "react";
import { AuthModal } from "./auth/AuthModal";
import { SubscriptionModal } from "./subscription/SubscriptionModal";
import { useAuth } from "../src/contexts/AuthContext";

export function PricingSection() {
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('');

  const handlePlanSelect = (planId: string) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    setSelectedPlan(planId);
    setShowSubscriptionModal(true);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    if (selectedPlan) {
      setShowSubscriptionModal(true);
    }
  };

  const plans = [
    {
      id: "oneoff",
      name: "One-Off Rescue",
      subtitle: "Single urgent rebook",
      price: "£30",
      priceSuffix: "one-time",
      icon: Zap,
      iconColor: "#28a745",
      features: [
        { text: "One rebook attempt", included: true },
        { text: "Monitor 1 test center", included: true },
        { text: "Email notification when found", included: true },
        { text: "Valid for 30 days", included: true },
        { text: "No recurring charges", included: true },
        { text: "5 daily notifications max", included: true },
        { text: "SMS notifications", included: false },
        { text: "Auto-rebooking", included: false }
      ],
      cta: "Pay £30 Once",
      highlighted: false,
      color: "#28a745",
      badge: null
    },
    {
      id: "starter",
      name: "Starter",
      subtitle: "For occasional needs",
      price: "£25",
      priceSuffix: "/month",
      icon: TrendingUp,
      iconColor: "#718096",
      features: [
        { text: "Monitor up to 3 test centers", included: true },
        { text: "2 rebook attempts per day", included: true },
        { text: "10 daily notifications max", included: true },
        { text: "SMS + Email notifications", included: true },
        { text: "Chrome extension access", included: true },
        { text: "Email support", included: true },
        { text: "7-day trial (monitoring only)", included: true },
        { text: "Auto-rebooking", included: false },
        { text: "Cancel anytime", included: true }
      ],
      cta: "Subscribe - £25/month",
      highlighted: false,
      color: "#718096",
      badge: null,
      note: "Trial allows monitoring only - rebooks start after first payment"
    },
    {
      id: "premium",
      name: "Premium",
      subtitle: "Best for active learners",
      price: "£45",
      priceSuffix: "/month",
      icon: Sparkles,
      iconColor: "#8b5cf6",
      features: [
        { text: "Monitor up to 5 test centers", included: true },
        { text: "5 rebook attempts per day", included: true },
        { text: "25 daily notifications max", included: true },
        { text: "Priority SMS + Email notifications", included: true },
        { text: "Rapid mode (500ms checks)", included: true },
        { text: "Auto-rebooking enabled", included: true },
        { text: "Advanced filtering", included: true },
        { text: "Analytics dashboard", included: true },
        { text: "24/7 email support", included: true },
        { text: "7-day trial (monitoring only)", included: true }
      ],
      cta: "Subscribe - £45/month",
      highlighted: true,
      color: "#8b5cf6",
      badge: "Most Popular",
      note: "Trial allows monitoring only - rebooks start after first payment"
    },
    {
      id: "professional",
      name: "Professional",
      subtitle: "Ultimate for instructors",
      price: "£80",
      priceSuffix: "/month",
      icon: Crown,
      iconColor: "#1d70b8",
      features: [
        { text: "Up to 20 pupils & 999 test centers", included: true },
        { text: "10 daily booking attempts", included: true },
        { text: "50 daily notifications max", included: true },
        { text: "Multi-pupil dashboard", included: true },
        { text: "Per-pupil custom settings", included: true },
        { text: "SMS + Email + WhatsApp alerts", included: true },
        { text: "Stealth mode (anti-detection)", included: true },
        { text: "Success rate analytics", included: true },
        { text: "Priority phone support", included: true },
        { text: "14-day trial (includes 2 rebooks)", included: true }
      ],
      cta: "Subscribe - £80/month",
      highlighted: false,
      color: "#1d70b8",
      badge: "Ultimate Professional"
    }
  ];

  return (
    <section id="pricing" className="pricing-section py-20 px-4 bg-gradient-to-br from-white via-[#f8f9fa] to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="pricing-badge inline-block bg-green-50 text-[#28a745] px-4 py-2 rounded-full text-sm mb-6">
            Fair, Transparent Pricing
          </div>
          <h2 className="pricing-title text-4xl lg:text-5xl text-[#1d70b8] mb-6">
            Choose Your Plan
          </h2>
          <p className="pricing-description text-xl text-[#6c757d] max-w-3xl mx-auto mb-8">
            Simple pricing for learners and instructors. One-off rescue bookings or comprehensive monitoring for driving schools.
          </p>
          <div className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-800 px-4 py-2 rounded-full text-sm border border-yellow-200">
            <Sparkles className="w-4 h-4" />
            <span>Trials include monitoring only • Rebooks start after first payment</span>
          </div>
        </div>
        
        <div className="grid md:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index}
              className={`pricing-card p-8 relative transform transition-all hover:scale-105 ${
                plan.highlighted 
                  ? 'border-4 shadow-2xl lg:-mt-4 lg:mb-4' 
                  : 'border-2 shadow-lg'
              }`}
              style={{ 
                borderColor: plan.highlighted ? plan.color : '#e9ecef',
                backgroundColor: plan.highlighted ? `${plan.color}05` : 'white'
              }}
            >
              {/* Badge */}
              {plan.badge && (
                <div 
                  className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full text-white text-sm shadow-lg flex items-center gap-2"
                  style={{ backgroundColor: plan.color }}
                >
                  {plan.highlighted && <Star className="w-4 h-4 fill-current" />}
                  {plan.badge}
                </div>
              )}
              
              {/* Header */}
              <div className="text-center mb-8">
                {/* Icon */}
                <div 
                  className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                  style={{ 
                    backgroundColor: `${plan.color}15`,
                    border: `2px solid ${plan.color}30`
                  }}
                >
                  <plan.icon 
                    className="w-8 h-8" 
                    style={{ color: plan.color }}
                    strokeWidth={2.5}
                  />
                </div>
                
                <h3 className="text-2xl font-bold text-[#1d70b8] mb-2">
                  {plan.name}
                </h3>
                <p className="text-sm text-[#6c757d] mb-6">{plan.subtitle}</p>
                <div className="mb-2">
                  <span className="text-5xl font-extrabold" style={{ color: plan.color }}>
                    {plan.price}
                  </span>
                  <span className="text-lg text-[#6c757d] ml-2">{plan.priceSuffix}</span>
                </div>
                {plan.highlighted && (
                  <p className="text-sm text-[#28a745] font-semibold">Best value for active users!</p>
                )}
              </div>
              
              {/* Features */}
              <ul className="space-y-3 mb-8 min-h-[320px]">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    {feature.included ? (
                      <div className="w-5 h-5 rounded-full bg-[#28a745]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-[#28a745]" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <X className="w-3 h-3 text-[#6c757d]" />
                      </div>
                    )}
                    <span className={`text-sm ${feature.included ? "text-[#1d70b8] font-medium" : "text-[#6c757d]"}`}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Note */}
              {plan.note && (
                <div className="mb-4 text-xs text-[#856404] bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                  ⚠️ {plan.note}
                </div>
              )}
              
              {/* CTA Button */}
              <Button
                className={`w-full btn ${plan.highlighted ? 'shadow-lg' : ''}`}
                size="lg"
                style={{
                  backgroundColor: plan.highlighted ? plan.color : 'white',
                  color: plan.highlighted ? 'white' : plan.color,
                  borderWidth: plan.highlighted ? '0' : '2px',
                  borderColor: plan.color
                }}
                onClick={() => handlePlanSelect(plan.name.toLowerCase().replace(/[^a-z]/g, ''))}
              >
                {plan.cta}
              </Button>
              
              {plan.highlighted && (
                <p className="text-xs text-center text-[#6c757d] mt-3">
                  Start 7-day monitoring trial
                </p>
              )}
            </Card>
          ))}
        </div>
        
        {/* Trust Indicators */}
        <div className="text-center mt-12 space-y-3">
          <p className="text-[#6c757d]">
            ✓ Subscription trials for monitoring only • ✓ Cancel anytime • ✓ Secure payment via Stripe
          </p>
          <p className="text-sm text-[#6c757d]">
            Used by over 500 learners • 95% success rate in finding earlier slots
          </p>
        </div>

        {/* Pricing Explanation */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 max-w-5xl mx-auto border border-blue-100">
          <div className="text-center mb-6">
            <h4 className="text-2xl font-bold text-[#1d70b8] mb-4">
              How Our Pricing Works
            </h4>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className="bg-white rounded-xl p-6 border border-blue-200">
              <h5 className="font-bold text-[#1d70b8] mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                One-Off (£30)
              </h5>
              <p className="text-sm text-[#6c757d] mb-3">
                Perfect if you just need one earlier test date. Pay once, get one rebook attempt within 30 days.
              </p>
              <p className="text-xs text-[#856404] bg-yellow-50 p-2 rounded">
                <strong>Best for:</strong> Single urgent rebook needs
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-blue-200">
              <h5 className="font-bold text-[#1d70b8] mb-3 flex items-center gap-2">
                <Star className="w-5 h-5" />
                Subscription Plans
              </h5>
              <p className="text-sm text-[#6c757d] mb-3">
                <strong>Trial = Monitoring Only</strong><br />
                During your free trial, you can see all available slots but can't rebook yet. After first payment, your rebook credits activate.
              </p>
              <p className="text-xs text-[#856404] bg-yellow-50 p-2 rounded">
                <strong>Anti-Abuse:</strong> Prevents trial abuse - you must pay to rebook
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-blue-200">
              <h5 className="font-bold text-[#1d70b8] mb-3">Monthly Quotas</h5>
              <ul className="text-sm text-[#6c757d] space-y-2">
                <li><strong>Starter:</strong> 2 rebook attempts/day</li>
                <li><strong>Premium:</strong> 5 rebook attempts/day</li>
                <li><strong>Professional:</strong> 10 rebook attempts/day</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 border border-blue-200">
              <h5 className="font-bold text-[#1d70b8] mb-3">Which Plan?</h5>
              <ul className="text-sm text-[#6c757d] space-y-2">
                <li><strong>Need 1 rebook?</strong> £30 one-off</li>
                <li><strong>Need 2-3/day?</strong> Starter (£25/month)</li>
                <li><strong>Need 5+/day?</strong> Premium (£45/month)</li>
                <li><strong>Instructor with 5+ pupils?</strong> Professional (£80/month - best value!)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Secure Payment Badge */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 bg-blue-50 text-[#1d70b8] px-6 py-3 rounded-full border border-blue-200">
            <Shield className="w-5 h-5" />
            <span>Secure payment processing powered by Stripe</span>
          </div>
        </div>
      </div>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        source="pricing_section"
        redirectUrl={selectedPlan ? `/subscribe?plan=${selectedPlan}` : undefined}
      />

      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        source="pricing_section"
        currentPlan={selectedPlan}
      />
    </section>
  );
}

import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Check, X, Star, Sparkles, Shield, Zap } from "lucide-react";

export function PricingSection() {
  const plans = [
    {
      name: "One-Off Rebook",
      subtitle: "Single guaranteed rebook",
      price: "£30",
      priceSuffix: "one-time",
      features: [
        { text: "One successful rebook guaranteed", included: true },
        { text: "Monitor 1 test center", included: true },
        { text: "Email notification when found", included: true },
        { text: "Valid for 30 days", included: true },
        { text: "No recurring charges", included: true },
        { text: "SMS notifications", included: false },
        { text: "Multiple rebooks", included: false },
        { text: "Ongoing monitoring", included: false }
      ],
      cta: "Pay £30 Once",
      highlighted: false,
      color: "#28a745",
      badge: null
    },
    {
      name: "Starter",
      subtitle: "For occasional needs",
      price: "£25",
      priceSuffix: "/month",
      features: [
        { text: "Monitor up to 3 test centers", included: true },
        { text: "2 rebooks included per month", included: true },
        { text: "Extra rebooks at £12 each", included: true },
        { text: "SMS + Email notifications", included: true },
        { text: "Chrome extension access", included: true },
        { text: "Email support", included: true },
        { text: "7-day trial (monitoring only)", included: true },
        { text: "Cancel anytime", included: true }
      ],
      cta: "Start Trial",
      highlighted: false,
      color: "#6c757d",
      badge: null,
      note: "Trial allows monitoring only - rebooks start after first payment"
    },
    {
      name: "Premium",
      subtitle: "Best for active learners",
      price: "£45",
      priceSuffix: "/month",
      features: [
        { text: "Monitor up to 5 test centers", included: true },
        { text: "5 rebooks included per month", included: true },
        { text: "Extra rebooks at £8 each", included: true },
        { text: "Priority SMS + Email notifications", included: true },
        { text: "Rapid mode (500ms checks)", included: true },
        { text: "Advanced filtering", included: true },
        { text: "24/7 email support", included: true },
        { text: "7-day trial (monitoring only)", included: true }
      ],
      cta: "Start Trial",
      highlighted: true,
      color: "#1d70b8",
      badge: "Most Popular",
      note: "Trial allows monitoring only - rebooks start after first payment"
    },
    {
      name: "Professional",
      subtitle: "For driving instructors",
      price: "£80",
      priceSuffix: "/month",
      features: [
        { text: "UNLIMITED test centers", included: true },
        { text: "UNLIMITED rebooks (no extra fees!)", included: true },
        { text: "UNLIMITED pupils", included: true },
        { text: "Multi-pupil management", included: true },
        { text: "All notification types", included: true },
        { text: "Advanced analytics dashboard", included: true },
        { text: "Priority phone support", included: true },
        { text: "API access", included: true },
        { text: "14-day trial (includes 2 rebooks)", included: true }
      ],
      cta: "Start Trial",
      highlighted: false,
      color: "#8b5cf6",
      badge: "For Instructors"
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
            Pay per use or subscribe for unlimited. All subscription plans include free trials.
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
              className={`pricing-card opacity-0 p-8 relative transform transition-all hover:scale-105 ${
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
            ✓ Subscription trials for monitoring only • ✓ Cancel anytime • ✓ 30-day money-back guarantee
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
                Perfect if you just need one earlier test date. Pay once, get one guaranteed rebook within 30 days.
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
                <li><strong>Starter:</strong> 2 rebooks/month (extra £12 each)</li>
                <li><strong>Premium:</strong> 5 rebooks/month (extra £8 each)</li>
                <li><strong>Professional:</strong> Unlimited (no extra fees)</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 border border-blue-200">
              <h5 className="font-bold text-[#1d70b8] mb-3">Which Plan?</h5>
              <ul className="text-sm text-[#6c757d] space-y-2">
                <li><strong>Need 1 rebook?</strong> £30 one-off</li>
                <li><strong>Need 2-3/month?</strong> Starter (£25-49)</li>
                <li><strong>Need 5+/month?</strong> Premium (£45-69)</li>
                <li><strong>Instructor (10+ pupils)?</strong> Pro (£80 unlimited)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Money Back Guarantee */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 bg-green-50 text-[#28a745] px-6 py-3 rounded-full border border-green-200">
            <Shield className="w-5 h-5" />
            <span>30-day money-back guarantee on all subscription plans</span>
          </div>
        </div>
      </div>
    </section>
  );
}

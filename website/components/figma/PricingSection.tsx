import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Check, X, Star, Sparkles } from "lucide-react";

export function PricingSection() {
  const plans = [
    {
      name: "Free Plan",
      subtitle: "Perfect for getting started",
      price: "Free",
      priceSuffix: "Forever",
      features: [
        { text: "1 test center monitoring", included: true },
        { text: "Email notifications", included: true },
        { text: "Basic availability alerts", included: true },
        { text: "Chrome extension access", included: true },
        { text: "SMS notifications", included: false },
        { text: "Priority support", included: false },
        { text: "Advanced filtering", included: false },
        { text: "Multiple pupils", included: false }
      ],
      cta: "Start Free",
      highlighted: false,
      color: "#6c757d",
      badge: null
    },
    {
      name: "Pro Plan",
      subtitle: "Best for serious learners",
      price: "£12",
      priceSuffix: "/month",
      features: [
        { text: "Up to 5 test centers", included: true },
        { text: "SMS + Email notifications", included: true },
        { text: "Advanced filtering options", included: true },
        { text: "Priority notifications", included: true },
        { text: "24/7 continuous monitoring", included: true },
        { text: "Email support within 24h", included: true },
        { text: "Cancel anytime", included: true },
        { text: "14-day money-back guarantee", included: true }
      ],
      cta: "Start 14-Day Free Trial",
      highlighted: true,
      color: "#1d70b8",
      badge: "Most Popular"
    },
    {
      name: "Instructor Plan",
      subtitle: "For driving instructors",
      price: "£25",
      priceSuffix: "/month",
      features: [
        { text: "Unlimited test centers", included: true },
        { text: "Multiple pupil management", included: true },
        { text: "Custom notifications per pupil", included: true },
        { text: "Detailed analytics dashboard", included: true },
        { text: "Priority phone support", included: true },
        { text: "API access for integration", included: true },
        { text: "Bulk operations", included: true },
        { text: "White-label options available", included: true }
      ],
      cta: "Start Instructor Trial",
      highlighted: false,
      color: "#28a745",
      badge: "For Professionals"
    }
  ];

  return (
    <section id="pricing" className="pricing-section py-20 px-4 bg-gradient-to-br from-white via-[#f8f9fa] to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="pricing-badge inline-block bg-green-50 text-[#28a745] px-4 py-2 rounded-full text-sm mb-6">
            Simple Pricing
          </div>
          <h2 className="pricing-title text-4xl lg:text-5xl text-[#1d70b8] mb-6">
            Choose Your Plan
          </h2>
          <p className="pricing-description text-xl text-[#6c757d] max-w-3xl mx-auto mb-8">
            Start free, upgrade when you need more features. All plans include our core monitoring technology.
          </p>
          <div className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-800 px-4 py-2 rounded-full text-sm border border-yellow-200">
            <Sparkles className="w-4 h-4" />
            <span>All paid plans include 14-day free trial • No credit card required</span>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
                <h3 className="text-2xl text-[#1d70b8] mb-2">
                  {plan.name}
                </h3>
                <p className="text-sm text-[#6c757d] mb-6">{plan.subtitle}</p>
                <div className="mb-2">
                  <span className="text-5xl" style={{ color: plan.color }}>
                    {plan.price}
                  </span>
                  <span className="text-lg text-[#6c757d] ml-2">{plan.priceSuffix}</span>
                </div>
                {plan.highlighted && (
                  <p className="text-sm text-[#28a745]">Save 8 weeks on average!</p>
                )}
              </div>
              
              {/* Features */}
              <ul className="space-y-4 mb-8 min-h-80">
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
                    <span className={`text-sm ${feature.included ? "text-[#1d70b8]" : "text-[#6c757d]"}`}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
              
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
                  Start your free trial today
                </p>
              )}
            </Card>
          ))}
        </div>
        
        {/* Trust Indicators */}
        <div className="text-center mt-12 space-y-3">
          <p className="text-[#6c757d]">
            ✓ All plans include 14-day free trial • ✓ No credit card required • ✓ Cancel anytime
          </p>
          <p className="text-sm text-[#6c757d]">
            Used by over 500 learners • 95% success rate in finding earlier slots
          </p>
        </div>

        {/* Comparison Note */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8 max-w-4xl mx-auto border border-blue-100">
          <div className="text-center">
            <h4 className="text-2xl text-[#1d70b8] mb-4">
              Not sure which plan is right for you?
            </h4>
            <p className="text-[#6c757d] mb-6">
              Start with the Free plan and upgrade anytime. Most users upgrade to Pro within their first week after seeing the value. Instructors managing multiple pupils benefit most from the Instructor plan.
            </p>
            <Button variant="outline" className="border-[#1d70b8] text-[#1d70b8]">
              Compare Plans in Detail
            </Button>
          </div>
        </div>

        {/* Money Back Guarantee */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 bg-green-50 text-[#28a745] px-6 py-3 rounded-full border border-green-200">
            <Shield className="w-5 h-5" />
            <span>14-day money-back guarantee on all paid plans</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Shield({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

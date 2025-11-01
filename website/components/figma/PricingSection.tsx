import { useState } from 'react';
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Check, X, Star, Sparkles, Shield, Zap, Loader2 } from "lucide-react";
import { loadStripe } from '@stripe/stripe-js';
import { STRIPE_CONFIG } from "../../lib/stripe-config";

export function PricingSection() {
  const [loading, setLoading] = useState<string | null>(null);

  const handlePlanSelect = async (planName: string, priceId: string, planType: string) => {
    setLoading(planName);
    
    try {
      // Create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: priceId,
          planName: planName,
          planType: planType,
        }),
      });

      const { sessionId, error } = await response.json();

      if (error) {
        throw new Error(error);
      }

      // Redirect to Stripe Checkout
      const stripe = await loadStripe(STRIPE_CONFIG.publishableKey);
      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: sessionId,
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('There was an error processing your request. Please try again or contact support.');
    } finally {
      setLoading(null);
    }
  };

  const plans = [
    {
      name: "One-Off Rebook",
      subtitle: "Single guaranteed rebook",
      originalPrice: "£35.21",
      price: "£25",
      discount: "29% OFF",
      savings: "£10.21",
      priceSuffix: "one-time",
      priceId: STRIPE_CONFIG.products.oneOff.priceId,
      planType: "one-time",
      features: [
        { text: "1 daily booking attempt", included: true },
        { text: "Monitor 1 test center", included: true },
        { text: "Email notification when found", included: true },
        { text: "Valid for 30 days", included: true },
        { text: "No recurring charges", included: true },
        { text: "5 daily notifications max", included: true },
        { text: "SMS notifications", included: false },
        { text: "Multiple booking attempts", included: false }
      ],
      cta: "Pay £25 Once",
      highlighted: false,
      color: "#28a745",
      badge: null
    },
    {
      name: "Starter",
      subtitle: "For occasional needs",
      originalPrice: "£28.79",
      price: "£19",
      discount: "34% OFF",
      savings: "£9.79",
      priceSuffix: "/month",
      priceId: STRIPE_CONFIG.products.starter.priceId,
      planType: "subscription",
      features: [
        { text: "Monitor up to 3 test centers", included: true },
        { text: "2 daily booking attempts", included: true },
        { text: "10 daily notifications max", included: true },
        { text: "SMS + Email notifications", included: true },
        { text: "Chrome extension access", included: true },
        { text: "Email support", included: true },
        { text: "3-day preview access", included: true },
        { text: "Cancel anytime", included: true }
      ],
      cta: "Start Now",
      highlighted: false,
      color: "#6c757d",
      badge: null,
      note: "Preview allows monitoring only - full features unlock after payment"
    },
    {
      name: "Premium",
      subtitle: "Best for active learners",
      originalPrice: "£49.15",
      price: "£29",
      discount: "41% OFF",
      savings: "£20.15",
      priceSuffix: "/month",
      priceId: STRIPE_CONFIG.products.premium.priceId,
      planType: "subscription",
      features: [
        { text: "Monitor up to 8 test centers", included: true },
        { text: "5 daily booking attempts", included: true },
        { text: "25 daily notifications max", included: true },
        { text: "Priority SMS + Email notifications", included: true },
        { text: "Rapid mode (500ms checks)", included: true },
        { text: "Advanced filtering", included: true },
        { text: "24/7 email support", included: true },
        { text: "3-day preview access", included: true }
      ],
      cta: "Start Now",
      highlighted: true,
      color: "#1d70b8",
      badge: "Most Popular",
      note: "Preview allows monitoring only - full features unlock after payment"
    },
    {
      name: "Professional",
      subtitle: "For driving schools",
      originalPrice: "£161.82",
      price: "£89",
      discount: "45% OFF",
      savings: "£72.82",
      priceSuffix: "/month",
      priceId: STRIPE_CONFIG.products.professional.priceId,
      planType: "subscription",
      features: [
        { text: "Up to 20 pupils & 999 test centers", included: true },
        { text: "10 daily booking attempts", included: true },
        { text: "50 daily notifications max", included: true },
        { text: "Multi-pupil dashboard", included: true },
        { text: "Per-pupil custom settings", included: true },
        { text: "SMS + Email + WhatsApp alerts", included: true },
        { text: "Success rate analytics", included: true },
        { text: "Priority phone support", included: true },
        { text: "Stealth mode (anti-detection)", included: true },
        { text: "3-day preview access", included: true }
      ],
      cta: "Start Now",
      highlighted: false,
      color: "#8b5cf6",
      badge: "For Instructors",
      note: "Preview allows monitoring only - full features unlock after payment"
    }
  ];

  return (
    <section id="pricing" className="pricing-section py-20 px-4 bg-gradient-to-br from-white via-[#f8f9fa] to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="pricing-badge inline-block bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm mb-6 border border-red-200">
            🔥 Limited-Time Pricing - Up to 45% OFF
          </div>
          <div className="pricing-badge inline-block bg-green-50 text-[#28a745] px-4 py-2 rounded-full text-sm mb-6">
            Fair, Transparent Pricing
          </div>
          <h2 className="pricing-title text-4xl lg:text-5xl text-[#1d70b8] mb-6">
            Choose Your Plan
          </h2>
          <p className="pricing-description text-xl text-[#6c757d] max-w-3xl mx-auto mb-8">
            Simple pricing for learners and instructors. One-off rescue bookings or comprehensive monitoring for driving schools.
          </p>
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-800 px-4 py-2 rounded-full text-sm border border-blue-200">
            <Shield className="w-4 h-4" />
            <span>3-day preview • Full features unlock after payment</span>
          </div>
        </div>
        
        <div className="grid md:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index}
              className={`pricing-card p-8 relative transform transition-all hover:scale-105 flex flex-col ${
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
                  {/* Original Price with Strikethrough (Red) */}
                  <div className="text-lg text-red-500 line-through mb-1 font-medium">
                    {plan.originalPrice}{plan.priceSuffix}
                  </div>
                  
                  {/* Discount Badge */}
                  <div className="inline-flex items-center gap-1 bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-semibold mb-2">
                    <span className="text-red-500">🔥</span>
                    {plan.discount}
                  </div>
                  
                  {/* New Price (Bold) */}
                  <div className="flex items-center gap-2">
                    <span className="text-5xl font-extrabold" style={{ color: plan.color }}>
                      {plan.price}
                    </span>
                    <span className="text-lg text-[#6c757d]">{plan.priceSuffix}</span>
                  </div>
                  <div className="text-xs text-[#6c757d] mt-1">
                    + VAT (20%)
                  </div>
                  
                  {/* Savings */}
                  <div className="text-sm text-[#28a745] font-semibold mt-1">
                    Save {plan.savings}
                  </div>
                </div>
                {plan.highlighted && (
                  <p className="text-sm text-[#28a745] font-semibold">Best value for active users!</p>
                )}
              </div>
              
              {/* Features */}
              <ul className="space-y-3 mb-8 flex-grow">
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

              {/* Bottom section with fixed height */}
              <div className="mt-auto">
                {/* Note */}
                {plan.note && (
                  <div className="mb-4 text-xs text-[#856404] bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                    ⚠️ {plan.note}
                  </div>
                )}
                
                {/* CTA Button */}
                <Button
                  onClick={() => handlePlanSelect(plan.name, plan.priceId, plan.planType)}
                  disabled={loading === plan.name}
                  className={`w-full btn ${plan.highlighted ? 'shadow-lg' : ''}`}
                  size="lg"
                  style={{
                    backgroundColor: plan.highlighted ? plan.color : 'white',
                    color: plan.highlighted ? 'white' : plan.color,
                    borderWidth: plan.highlighted ? '0' : '2px',
                    borderColor: plan.color
                  }}
                >
                  {loading === plan.name ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    plan.cta
                  )}
                </Button>
              
              {plan.highlighted && (
                <p className="text-xs text-center text-[#6c757d] mt-3">
                  Start 7-day monitoring trial
                </p>
              )}
              </div>
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
                    One-Off (£25)
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
                <strong>Preview = Monitoring Only</strong><br />
                During your 3-day preview, you can see all available slots but can't rebook yet. After payment, your rebook credits activate.
              </p>
              <p className="text-xs text-[#856404] bg-yellow-50 p-2 rounded">
                <strong>Anti-Abuse:</strong> Prevents preview abuse - you must pay to rebook
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
                <li><strong>Need 1 rebook?</strong> £25 one-off</li>
                <li><strong>Need 2-3/month?</strong> Starter (£19/month)</li>
                <li><strong>Need 5+/month?</strong> Premium (£29/month)</li>
                <li><strong>Instructor with 5+ pupils?</strong> Pro (£49/month - best value!)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

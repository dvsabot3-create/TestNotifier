import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { HelpCircle, MessageCircle, BookOpen, Settings, CreditCard, Bell, Shield, User } from 'lucide-react';

export function HelpCenter() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const helpCategories = [
    {
      icon: HelpCircle,
      title: "Getting Started",
      description: "Learn how to set up your account and start monitoring tests",
      articles: [
        "How to create an account",
        "Installing the Chrome extension",
        "Setting up your first test monitor",
        "Understanding the dashboard"
      ]
    },
    {
      icon: Bell,
      title: "Notifications",
      description: "Configure email and SMS alerts for test cancellations",
      articles: [
        "Setting up email notifications",
        "Configuring SMS alerts",
        "Managing notification preferences",
        "Troubleshooting notification issues"
      ]
    },
    {
      icon: Settings,
      title: "Account Management",
      description: "Manage your profile, subscription, and settings",
      articles: [
        "Updating your profile",
        "Changing your password",
        "Managing subscription plans",
        "Canceling your account"
      ]
    },
    {
      icon: CreditCard,
      title: "Billing & Payments",
      description: "Information about payments, refunds, and billing",
      articles: [
        "Understanding pricing plans",
        "Updating payment methods",
        "Requesting refunds",
        "Viewing payment history"
      ]
    },
    {
      icon: Shield,
      title: "Privacy & Security",
      description: "Learn how we protect your data and privacy",
      articles: [
        "How we protect your data",
        "GDPR compliance",
        "Data retention policies",
        "Security measures"
      ]
    },
    {
      icon: MessageCircle,
      title: "Troubleshooting",
      description: "Common issues and their solutions",
      articles: [
        "Extension not working",
        "Not receiving notifications",
        "Login problems",
        "Payment issues"
      ]
    }
  ];

  const quickLinks = [
    { title: "Contact Support", href: "/contact", icon: MessageCircle },
    { title: "System Status", href: "/status", icon: Shield },
    { title: "FAQ", href: "#faq", icon: HelpCircle },
    { title: "Privacy Policy", href: "/privacy", icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Help Center
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions and learn how to get the most out of TestNotifier
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {quickLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <a
                key={index}
                href={link.href}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 group"
              >
                <Icon className="w-8 h-8 text-blue-600 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{link.title}</h3>
                <p className="text-sm text-gray-600">Get help with {link.title.toLowerCase()}</p>
              </a>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for help..."
              className="w-full px-4 py-3 pl-12 pr-4 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <HelpCircle className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Help Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {helpCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{category.title}</h3>
                    <p className="text-gray-600">{category.description}</p>
                  </div>
                </div>

                <ul className="space-y-3">
                  {category.articles.map((article, articleIndex) => (
                    <li key={articleIndex}>
                      <a
                        href="#"
                        className="text-blue-600 hover:text-blue-800 flex items-center group"
                      >
                        <BookOpen className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                        {article}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Contact Support Section */}
        <div className="bg-blue-600 rounded-lg p-8 text-center text-white">
          <MessageCircle className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Can't find what you're looking for? Our support team is here to help you with any questions or issues you may have.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
          >
            Contact Support
            <MessageCircle className="w-5 h-5 ml-2" />
          </a>
        </div>

        {/* Popular Articles */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Popular Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "How to get started with TestNotifier",
              "Setting up notifications for multiple tests",
              "Understanding your subscription plan",
              "Troubleshooting Chrome extension issues",
              "Managing notification preferences",
              "What to do when you get a test cancellation alert"
            ].map((title, index) => (
              <a
                key={index}
                href="#"
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 group"
              >
                <BookOpen className="w-6 h-6 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-600">Learn more →</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, Send, User, MessageSquare } from 'lucide-react';

export function ContactSupport() {
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'normal'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '', priority: 'normal' });
      } else {
        // Handle validation errors
        if (result.errors) {
          const errorMessages = result.errors.map((error: any) => error.message).join('\n');
          alert(`Please fix the following errors:\n${errorMessages}`);
        } else {
          alert(result.message || 'Failed to send message. Please try again.');
        }
      }
    } catch (error) {
      console.error('Contact form submission error:', error);
      alert('Failed to send message. Please try again later or contact us directly at hello@testnotifier.co.uk');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Get help via email",
      details: "hello@testnotifier.co.uk",
      action: "Send Email",
      available: "24/7"
    },
    {
      icon: Clock,
      title: "Business Hours",
      description: "When we're available",
      details: "Mon-Fri: 9:00 AM - 5:00 PM GMT",
      action: "Schedule Call",
      available: "Weekdays"
    },
    {
      icon: MapPin,
      title: "Location",
      description: "Based in the UK",
      details: "United Kingdom",
      action: "View Map",
      available: "Remote Support"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Contact Support
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're here to help! Get in touch with our support team for any questions or issues.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {contactMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <div key={index} className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{method.title}</h3>
                <p className="text-gray-600 mb-4">{method.description}</p>
                <p className="text-lg font-medium text-gray-900 mb-2">{method.details}</p>
                <p className="text-sm text-green-600 mb-6">✓ Available {method.available}</p>
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  {method.action}
                </button>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Send us a Message
            </h2>

            {submitSuccess ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-green-900 mb-2">Message Sent Successfully!</h3>
                <p className="text-green-700">
                  Thank you for contacting us. We'll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a topic</option>
                    <option value="account">Account Issues</option>
                    <option value="billing">Billing & Payments</option>
                    <option value="technical">Technical Support</option>
                    <option value="extension">Chrome Extension</option>
                    <option value="notifications">Notifications</option>
                    <option value="general">General Inquiry</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                    Priority Level
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Low - General Question</option>
                    <option value="normal">Normal - Need Help</option>
                    <option value="high">High - Urgent Issue</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Please describe your issue or question in detail..."
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* FAQ Section */}
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              {[
                {
                  question: "How quickly do you respond to support requests?",
                  answer: "We aim to respond to all support requests within 24 hours during business days. Urgent issues are typically addressed within 2-4 hours."
                },
                {
                  question: "What information should I include in my support request?",
                  answer: "Please include your account email, a detailed description of the issue, any error messages you've received, and steps to reproduce the problem if applicable."
                },
                {
                  question: "Do you offer phone support?",
                  answer: "Currently, we primarily offer email and chat support. Phone support is available for Professional plan customers for urgent technical issues."
                },
                {
                  question: "Can I get help with setting up the Chrome extension?",
                  answer: "Absolutely! We provide detailed setup guides and can walk you through the installation process step by step if needed."
                }
              ].map((faq, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
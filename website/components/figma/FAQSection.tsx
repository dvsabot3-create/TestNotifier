import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { HelpCircle, Mail } from "lucide-react";
import { Button } from "./ui/button";

export function FAQSection() {
  const faqs = [
    {
      question: "Is TestNotifier legal?",
      answer: "Yes, TestNotifier is fully compliant with DVSA terms of service. We only monitor publicly available information and send notifications. We do not access any private data or circumvent any security measures. We respect all DVSA rate limits and guidelines."
    },
    {
      question: "Does it book automatically?",
      answer: "No, TestNotifier only sends notifications. You remain in full control of all booking decisions and must manually complete any bookings through the official DVSA website. We believe you should always be in control. This is a key compliance requirement and ensures we follow DVSA terms of service."
    },
    {
      question: "How fast are the notifications?",
      answer: "Most users receive notifications within 30 seconds of a slot becoming available. Our system monitors continuously and sends alerts immediately when changes are detected. You can choose to receive notifications via email, SMS, or push notification for maximum speed."
    },
    {
      question: "What if I don't find anything?",
      answer: "Our 95% success rate means most users find earlier slots within 2-4 weeks. Cancellations happen regularly as people reschedule or cancel their tests. The key is being notified the moment they become available. If you're not finding slots, we can help you optimize your search criteria."
    },
    {
      question: "Is my data safe?",
      answer: "Absolutely. We use industry-standard encryption and never store your DVSA login credentials. We only store your notification preferences and contact information. All data is handled in compliance with GDPR regulations. We will never sell or share your data with third parties."
    },
    {
      question: "Which test centers can I monitor?",
      answer: "You can monitor any DVSA test center in England, Scotland, and Wales. Our One-Off plan allows 1 center, Starter plan allows up to 3 centers, Premium plan allows up to 5 centers, and Professional plan allows up to 999 centers. You can change which centers you're monitoring at any time."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes! You can cancel your subscription at any time with no questions asked. There are no long-term contracts or cancellation fees. Your subscription will remain active until the end of your billing period, and you won't be charged again."
    },
    {
      question: "Do you offer refunds?",
      answer: "We offer a 14-day money-back guarantee on all paid plans. Refunds are provided for legitimate service issues or if the service doesn't work as described. Contact our support team at hello@testnotifier.co.uk with your specific concerns. We review refund requests fairly and aim to resolve issues promptly. Service must be used in accordance with our terms of service."
    },
    {
      question: "How do I install the extension?",
      answer: "Simply click the 'Install Extension' button, which will take you to the Chrome Web Store. Click 'Add to Chrome' and the extension will be installed. Then follow the quick setup wizard to configure your preferences. The whole process takes less than 5 minutes."
    },
    {
      question: "What's the difference between email and SMS notifications?",
      answer: "Email notifications are included in all plans and are typically delivered within 30-60 seconds. SMS notifications (available in Pro and Instructor plans) are usually even faster and ensure you see the alert immediately even if you're not at your computer. Many users enable both for maximum coverage."
    },
    {
      question: "What are the daily limits for each plan?",
      answer: "All our subscription plans have daily usage limits to ensure fair service for all users: One-Off (£30): 1 rebook attempt, 5 notifications max per day. Starter (£25/month): 2 rebook attempts, 10 notifications max per day. Premium (£45/month): 5 rebook attempts, 25 notifications max per day. Professional (£80/month): 10 rebook attempts, 50 notifications max per day. These limits reset at midnight UTC each day."
    },
    {
      question: "How many pupils can I manage on the Professional plan?",
      answer: "The Professional plan supports up to 20 pupils and monitoring of up to 999 test centers. Each pupil can have individual settings and preferences. This is designed for driving instructors managing multiple students. If you need more than 20 pupils, please contact us about enterprise solutions."
    },
    {
      question: "What's the difference between rebook attempts and notifications?",
      answer: "Rebook attempts are when our system tries to find and alert you about earlier test slots. Notifications are the alerts we send you (email, SMS, WhatsApp) when we find slots. For example, on the Premium plan, you get 5 rebook attempts per day (system searches) and up to 25 notifications per day (alerts sent to you)."
    },
    {
      question: "Why do you have daily limits instead of monthly?",
      answer: "We use daily limits to ensure consistent service quality and prevent abuse. Daily limits provide more predictable usage patterns and help us maintain our 95% success rate. All limits reset at midnight UTC, giving you a fresh quota each day. This approach has proven more reliable than monthly quotas for our monitoring system."
    },
    {
      question: "What happens if I exceed my daily limits?",
      answer: "When you reach your daily limit, monitoring pauses until the next day. You'll receive a notification when you're approaching your limit. Notifications stop being sent once the limit is reached, but the extension continues basic monitoring. Limits reset at midnight UTC. You can upgrade your plan anytime for higher limits."
    },
    {
      question: "Are there any hidden fees or charges?",
      answer: "No hidden fees! Our pricing is completely transparent. The prices shown include VAT where applicable. The only additional costs are: Extra rebook attempts beyond your daily limit (not available on One-Off plan), SMS notifications (carrier charges may apply internationally), and WhatsApp notifications (Professional plan only). We never charge for setup, cancellation, or support."
    },
    {
      question: "Why is the extension Chrome-only?",
      answer: "TestNotifier is built specifically for Chrome due to technical requirements: Our stealth technology requires Chrome's Manifest V3 API, the DVSA website optimization works best with Chrome's rendering engine, and our monitoring algorithms are tuned for Chrome's performance characteristics. We're evaluating Firefox and Safari support for future releases, but Chrome provides the most reliable experience currently."
    },
    {
      question: "What browser extensions conflict with TestNotifier?",
      answer: "Several types of extensions can interfere with TestNotifier: Ad blockers (uBlock Origin, AdBlock Plus) may block our monitoring scripts, Privacy extensions (Privacy Badger, Ghostery) can prevent data collection, Popup blockers may stop notifications, Script blockers (NoScript) can disable functionality, and VPN extensions might cause connection issues. We recommend temporarily disabling these during setup and adding dvsa.gov.uk to their whitelist."
    },
    {
      question: "How does the 3-day preview work?",
      answer: "Our 3-day preview allows you to test monitoring features before payment. During preview: You can see available test slots in real-time, set up monitoring preferences and test centers, receive email notifications when slots are found, but you cannot book or rebook tests. After payment, full functionality unlocks immediately. This prevents abuse while letting you verify our service works for your needs."
    }
  ];

  return (
    <section id="faq" className="faq-section py-20 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block bg-purple-50 text-purple-600 px-4 py-2 rounded-full text-sm mb-6">
            Got Questions?
          </div>
          <h2 className="text-4xl lg:text-5xl text-[#1d70b8] mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-[#6c757d]">
            Everything you need to know about TestNotifier
          </p>
        </div>
        
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-gradient-to-br from-[#f8f9fa] to-white rounded-xl px-6 border-2 border-transparent hover:border-[#1d70b8]/20 transition-all shadow-sm hover:shadow-md"
            >
              <AccordionTrigger className="text-left text-lg text-[#1d70b8] hover:no-underline py-6 hover:text-[#2e8bc0] transition-colors">
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 flex-shrink-0 mt-1 text-[#2e8bc0]" />
                  <span>{faq.question}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-[#6c757d] leading-relaxed pb-6 pl-8">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        
        {/* Contact Support Box */}
        <div className="mt-16 bg-gradient-to-r from-[#1d70b8]/5 via-[#2e8bc0]/5 to-[#1d70b8]/5 rounded-2xl p-10 text-center border-2 border-[#1d70b8]/10">
          <div className="w-16 h-16 bg-gradient-to-br from-[#1d70b8] to-[#2e8bc0] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl text-[#1d70b8] mb-3">
            Still have questions?
          </h3>
          <p className="text-[#6c757d] mb-6 max-w-2xl mx-auto">
            Our support team is here to help you get the most out of TestNotifier. We typically respond within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-[#1d70b8] hover:bg-[#2e8bc0] text-white"
            >
              <Mail className="w-5 h-5 mr-2" />
              Contact Support
            </Button>
            <Button 
              size="lg"
              variant="outline" 
              className="border-[#1d70b8] text-[#1d70b8] hover:bg-[#1d70b8]/5"
            >
              View Documentation
            </Button>
          </div>
          <p className="text-sm text-[#6c757d] mt-6">
            Email: <a href="mailto:hello@testnotifier.co.uk" className="text-[#1d70b8] hover:underline">hello@testnotifier.co.uk</a>
          </p>
        </div>
      </div>
    </section>
  );
}

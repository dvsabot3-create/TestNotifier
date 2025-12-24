import { Bell, Twitter, Facebook, Linkedin, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  const footerLinks = {
    product: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Chrome Extension", href: "/install" }
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" }
    ],
    support: [
      { label: "Help Center", href: "/help" },
      { label: "FAQ", href: "#faq" },
      { label: "Contact Support", href: "/contact" },
      { label: "System Status", href: "/status" }
    ]
  };

  const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter", color: "#1DA1F2" },
    { icon: Facebook, href: "#", label: "Facebook", color: "#4267B2" },
    { icon: Linkedin, href: "#", label: "LinkedIn", color: "#0077b5" },
    { icon: Mail, href: "mailto:hello@testnotifier.co.uk", label: "Email", color: "#EA4335" }
  ];

  return (
    <footer className="bg-gradient-to-br from-[#1d70b8] to-[#0f4c81] text-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Top Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12 pb-12 border-b border-white/10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <Bell className="w-7 h-7 text-[#1d70b8]" />
              </div>
              <div>
                <div className="text-2xl">TestNotifier</div>
                <div className="text-sm text-white/70">.co.uk</div>
              </div>
            </div>
            <p className="text-white/80 mb-6 leading-relaxed">
              Never miss an earlier driving test date again. Intelligent monitoring and instant notifications for UK learners.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-white/80">
                <Mail className="w-4 h-4" />
                <a href="mailto:hello@testnotifier.co.uk" className="hover:text-white transition-colors">
                  hello@testnotifier.co.uk
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/80">
                <Phone className="w-4 h-4" />
                <span>Support: Mon-Fri 9am-5pm GMT</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/80">
                <MapPin className="w-4 h-4" />
                <span>United Kingdom</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all hover:scale-110"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
          
          {/* Product Links */}
          <div>
            <h3 className="text-lg mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-white/80 hover:text-white transition-colors text-sm">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Legal Links */}
          <div>
            <h3 className="text-lg mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-white/80 hover:text-white transition-colors text-sm">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Support Links */}
          <div>
            <h3 className="text-lg mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-white/80 hover:text-white transition-colors text-sm">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/60">
          <p>
            © 2025 TestNotifier.co.uk. All rights reserved.
          </p>
          <p className="text-center">
            Not affiliated with DVSA. Independent service provider.
          </p>
          <p>
            Made with ❤️ in the UK
          </p>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 pt-8 border-t border-white/10 text-center">
          <p className="text-xs text-white/50 max-w-4xl mx-auto leading-relaxed">
            TestNotifier is an independent service and is not affiliated with, endorsed by, or connected to the Driver and Vehicle Standards Agency (DVSA). 
            All trademarks and service marks are the property of their respective owners. TestNotifier only monitors publicly available information 
            and does not guarantee test slot availability. Users remain responsible for all booking decisions and must comply with DVSA terms of service.
          </p>
        </div>
      </div>
    </footer>
  );
}

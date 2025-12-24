import { Chrome, Settings, Bell, Calendar, Download, Sliders, Smartphone, CheckCircle2 } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      icon: Chrome,
      title: "Install Extension",
      description: "Add TestNotifier to Chrome in one click. Takes less than 30 seconds.",
      details: [
        "Available on Chrome Web Store",
        "No account required to start",
        "Works on any computer"
      ],
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      number: "02",
      icon: Settings,
      title: "Configure Preferences",
      description: "Add pupils (or just yourself), set test centres, preferred dates, and notification preferences.",
      details: [
        "Manage multiple pupils (instructors)",
        "Select up to 10+ test centres",
        "Choose date ranges & times"
      ],
      gradient: "from-purple-500 to-pink-500"
    },
    {
      number: "03",
      icon: Bell,
      title: "Receive Alerts",
      description: "Get instant notifications when matching slots become available.",
      details: [
        "Alerts within 30 seconds",
        "SMS, email, or push",
        "24/7 monitoring"
      ],
      gradient: "from-green-500 to-emerald-500"
    },
    {
      number: "04",
      icon: Calendar,
      title: "Book Your Test",
      description: "Click the notification to view details and book on the DVSA website.",
      details: [
        "You stay in control",
        "Manual booking only",
        "DVSA compliant"
      ],
      gradient: "from-orange-500 to-red-500"
    }
  ];

  return (
    <section id="how-it-works" className="how-it-works relative py-20 px-6 bg-white overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-blue-50/50 via-transparent to-transparent"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="how-badge inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 text-blue-700 text-sm mb-6">
            <CheckCircle2 className="w-4 h-4" />
            <span>Simple 4-Step Process</span>
          </div>
          <h2 className="how-title text-5xl lg:text-6xl text-gray-900 mb-6 tracking-tight">
            From Setup to Success
            <span className="block text-[#1d70b8] how-subtitle">In Under 5 Minutes</span>
          </h2>
          <p className="how-description text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Getting started is incredibly simple. No technical knowledge required.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-32 left-0 right-0 h-1">
            <div className="relative h-full max-w-5xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 via-green-500 to-orange-500 rounded-full opacity-20"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 via-green-500 to-orange-500 rounded-full blur-sm"></div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((step, index) => (
              <div key={index} className="step-item relative">
                <div className="relative group">
                  {/* Card */}
                  <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 hover:border-transparent hover:shadow-2xl transition-all">
                    {/* Gradient border on hover */}
                    <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-100 transition-opacity p-[2px]`}>
                      <div className="w-full h-full bg-white rounded-3xl"></div>
                    </div>

                    <div className="relative z-10">
                      {/* Icon Container */}
                      <div className="relative mb-6">
                        <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity`}></div>
                        <div className={`relative w-20 h-20 bg-gradient-to-br ${step.gradient} rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                          <step.icon className="w-10 h-10 text-white" />
                        </div>
                        
                        {/* Step Number Badge */}
                        <div className={`absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br ${step.gradient} rounded-full flex items-center justify-center text-white shadow-lg`}>
                          <span className="text-sm">{step.number}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <h3 className="text-2xl text-gray-900 mb-3 group-hover:text-[#1d70b8] transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {step.description}
                      </p>

                      {/* Details */}
                      <ul className="space-y-2">
                        {step.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="flex items-center gap-2 text-sm text-gray-500">
                            <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${step.gradient}`}></div>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Info */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Download,
              title: 'One-Click Install',
              description: 'Direct from Chrome Web Store'
            },
            {
              icon: Sliders,
              title: 'Easy Configuration',
              description: 'Intuitive setup wizard'
            },
            {
              icon: Smartphone,
              title: 'Multi-Device',
              description: 'Access from anywhere'
            }
          ].map((feature, index) => (
            <div key={index} className="text-center p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200">
              <div className="w-14 h-14 bg-gradient-to-br from-[#1d70b8] to-[#2e8bc0] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-lg text-gray-900 mb-2">{feature.title}</h4>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Time Indicator */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#1d70b8] to-[#2e8bc0] text-white rounded-full px-8 py-4 shadow-xl">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center">
              <span className="text-2xl">⏱️</span>
            </div>
            <div className="text-left">
              <div className="text-sm opacity-90">Total setup time</div>
              <div className="text-2xl">Under 5 minutes</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

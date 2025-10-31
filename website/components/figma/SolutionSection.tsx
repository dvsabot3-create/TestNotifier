import { Clock, Bell, MapPin, Settings, Rocket, Shield, Check, Zap } from "lucide-react";

export function SolutionSection() {
  const features = [
    {
      icon: Clock,
      title: "24/7 Smart Monitoring",
      description: "Our system continuously checks DVSA availability across all test centers, every minute of every day.",
      benefits: ["Never miss a slot", "Always online", "No manual work"],
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Bell,
      title: "Instant Notifications",
      description: "Get alerted within 30 seconds when slots appear. Via SMS, email, or push notification - your choice.",
      benefits: ["30-second alerts", "Multi-channel", "Customizable"],
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: MapPin,
      title: "Multiple Test Centers",
      description: "Monitor up to 5 centers simultaneously and maximize your chances of finding an earlier date.",
      benefits: ["5+ locations", "Flexible search", "Higher success rate"],
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Settings,
      title: "Smart Filtering",
      description: "Set your preferred dates, times, and specific centers. Only get notified for slots that work for you.",
      benefits: ["Custom criteria", "Time preferences", "Date ranges"],
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: Rocket,
      title: "5-Minute Setup",
      description: "Install the Chrome extension, set your preferences, and you're done. It's that simple.",
      benefits: ["Quick install", "Easy config", "Instant activation"],
      gradient: "from-indigo-500 to-blue-500"
    },
    {
      icon: Shield,
      title: "DVSA Compliant",
      description: "Fully compliant with all DVSA guidelines. We never access your credentials or automate bookings.",
      benefits: ["100% legal", "No credentials", "You control bookings"],
      gradient: "from-teal-500 to-green-500"
    }
  ];

  return (
    <section id="features" className="features-section relative py-20 px-6 bg-gradient-to-b from-white via-blue-50/30 to-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-[#1d70b8]/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-[#2e8bc0]/10 to-transparent rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="solution-badge inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2 text-green-700 text-sm mb-6">
            <Zap className="w-4 h-4" />
            <span>The Solution</span>
          </div>
          <h2 className="solution-title text-5xl lg:text-6xl text-gray-900 mb-6 tracking-tight">
            Intelligent Automation
            <span className="block text-[#1d70b8] solution-subtitle">That Works While You Don't</span>
          </h2>
          <p className="solution-description text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Stop wasting time with manual checks. TestNotifier monitors test availability 24/7 and notifies you instantly when slots appear.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="feature-card group relative bg-white rounded-3xl p-8 border border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-500"
            >
              {/* Hover Gradient Border */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity p-[2px]`}>
                <div className="w-full h-full bg-white rounded-3xl"></div>
              </div>

              <div className="relative z-10">
                {/* Icon */}
                <div className="mb-6">
                  <div className="relative inline-block">
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity`}></div>
                    <div className={`relative w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl text-gray-900 mb-3 group-hover:text-[#1d70b8] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>

                {/* Benefits List */}
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-center gap-2 text-sm text-gray-500">
                      <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${feature.gradient}`}></div>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Results Section */}
        <div className="relative">
          <div className="bg-gradient-to-br from-[#1d70b8] via-[#2e8bc0] to-[#1d70b8] rounded-3xl p-12 lg:p-16 overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <div className="text-center mb-12">
                <h3 className="text-4xl lg:text-5xl text-white mb-4">
                  Real Results from Real Users
                </h3>
                <p className="text-xl text-white/80 max-w-2xl mx-auto">
                  TestNotifier has helped over 500 learners save an average of 8 weeks waiting time
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: Clock,
                    value: '8 weeks',
                    label: 'Average time saved',
                    description: 'Get your license sooner'
                  },
                  {
                    icon: Zap,
                    value: '< 30 sec',
                    label: 'Notification speed',
                    description: 'Lightning-fast alerts'
                  },
                  {
                    icon: Check,
                    value: '95%',
                    label: 'Success rate',
                    description: 'Find earlier slots'
                  }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30">
                      <stat.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-5xl text-white mb-2">{stat.value}</div>
                    <div className="text-lg text-white/90 mb-1">{stat.label}</div>
                    <div className="text-sm text-white/60">{stat.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

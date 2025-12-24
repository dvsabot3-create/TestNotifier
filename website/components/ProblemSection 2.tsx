import { Clock, RefreshCw, AlertCircle, Frown } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function ProblemSection() {
  const problems = [
    {
      icon: RefreshCw,
      stat: "20+",
      label: "Daily checks",
      title: "Endless Manual Checking",
      description: "Refreshing the DVSA website every few hours, hoping to catch a cancellation before someone else does."
    },
    {
      icon: Clock,
      stat: "< 60s",
      label: "Slot lifespan",
      title: "Lightning-Fast Disappearance",
      description: "Cancellations vanish in under a minute. By the time you check, it's already gone."
    },
    {
      icon: AlertCircle,
      stat: "24/7",
      label: "Monitoring needed",
      title: "Always-On Vigilance Required",
      description: "Can't be glued to your screen all day and night. Life gets in the way of manual checking."
    },
    {
      icon: Frown,
      stat: "3-6mo",
      label: "Average wait",
      title: "Months of Waiting",
      description: "Long wait times delay your license, cost more in lessons, and put your life on hold."
    }
  ];

  return (
    <section className="problem-section relative py-20 px-6 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(29,112,184,0.05),transparent_50%)]"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="problem-badge inline-flex items-center gap-2 bg-red-50 border border-red-100 rounded-full px-4 py-2 text-red-600 text-sm mb-6">
            <AlertCircle className="w-4 h-4" />
            <span>The Problem</span>
          </div>
          <h2 className="problem-title text-5xl lg:text-6xl text-gray-900 mb-6 tracking-tight">
            The Frustration of
            <span className="block text-[#1d70b8] problem-subtitle">Manual Test Checking</span>
          </h2>
          <p className="problem-description text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Thousands of learners waste hours every day manually checking for cancellations. It's exhausting, ineffective, and completely unnecessary.
          </p>
        </div>

        {/* Problems Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-20">
          {problems.map((problem, index) => (
            <div 
              key={index}
              className="problem-card group relative bg-white rounded-3xl p-8 border border-gray-200 hover:border-[#1d70b8]/30 hover:shadow-2xl transition-all duration-500"
            >
              {/* Gradient Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex items-start gap-6">
                {/* Icon & Stat */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                    <div className="relative w-16 h-16 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl flex items-center justify-center border border-red-100 group-hover:scale-110 transition-transform">
                      <problem.icon className="w-8 h-8 text-red-600" />
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <div className="text-2xl text-red-600">{problem.stat}</div>
                    <div className="text-xs text-gray-500">{problem.label}</div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 pt-2">
                  <h3 className="text-2xl text-gray-900 mb-3 group-hover:text-[#1d70b8] transition-colors">
                    {problem.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {problem.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Story Section */}
        <div className="relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl overflow-hidden">
            {/* Image Side */}
            <div className="relative h-[500px] lg:h-auto">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1755541516450-644adb257ad0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b3Jrc3BhY2UlMjBkZXNrfGVufDF8fHx8MTc2MDU2MDYxMXww&ixlib=rb-4.1.0&q=80&w=1200"
                alt="Frustrated person checking computer late at night"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/50 to-transparent"></div>
              
              {/* Floating Time Indicator */}
              <div className="absolute top-8 right-8 bg-red-500 text-white px-6 py-3 rounded-2xl shadow-2xl animate-pulse">
                <div className="text-3xl">3:47 AM</div>
                <div className="text-sm text-red-100">Still checking...</div>
              </div>
            </div>

            {/* Content Side */}
            <div className="p-12 lg:pr-16">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-4 py-2 text-white/90 text-sm mb-6">
                <Clock className="w-4 h-4" />
                <span>Real learner experience</span>
              </div>
              
              <h3 className="text-4xl text-white mb-6 leading-tight">
                "I was losing sleep, missing work, and going crazy"
              </h3>
              
              <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                Sarah from Manchester checked the DVSA website 20+ times a day for three months straight. She set alarms for 3 AM to catch early morning cancellations.
              </p>
              
              <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                The constant checking affected her work, sleep, and mental health. She missed several slots by seconds because she couldn't be online 24/7.
              </p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#1d70b8] to-[#2e8bc0] rounded-full flex items-center justify-center text-white text-xl">
                  S
                </div>
                <div>
                  <div className="text-white">Sarah M.</div>
                  <div className="text-gray-400 text-sm">Manchester • Now uses TestNotifier</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="grid grid-cols-3 gap-6 mt-12">
            {[
              { value: '73%', label: 'of learners check multiple times daily' },
              { value: '89%', label: 'miss slots due to manual checking' },
              { value: '4.2hrs', label: 'wasted per week on average' }
            ].map((stat, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-2xl border border-gray-200">
                <div className="text-4xl text-[#1d70b8] mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

import { PlayCircle, Zap, Bell, MousePointerClick, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";

export function DemoSection() {
  return (
    <section className="demo-section relative py-20 px-6 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(46,139,192,0.08),transparent_50%)]"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="demo-badge inline-flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-full px-4 py-2 text-purple-700 text-sm mb-6">
            <PlayCircle className="w-4 h-4" />
            <span>See It In Action</span>
          </div>
          <h2 className="demo-title text-5xl lg:text-6xl text-gray-900 mb-6 tracking-tight">
            From Alert to Booking
            <span className="block text-[#1d70b8] demo-subtitle">In Under 30 Seconds</span>
          </h2>
          <p className="demo-description text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Watch how TestNotifier detects available slots and sends you instant notifications
          </p>
        </div>

        {/* Video Section */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="relative group cursor-pointer">
            {/* Video Container */}
            <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl overflow-hidden border-4 border-white shadow-2xl">
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#1d70b8]/40 via-[#2e8bc0]/30 to-transparent"></div>
              
              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-white rounded-full blur-2xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-2xl">
                    <PlayCircle className="w-12 h-12 text-[#1d70b8] ml-1" />
                  </div>
                </div>
              </div>

              {/* Time Indicator */}
              <div className="absolute top-8 left-8 bg-black/50 backdrop-blur-xl border border-white/20 rounded-full px-6 py-3 text-white">
                <div className="text-sm opacity-80">Duration</div>
                <div className="text-2xl">2:15</div>
              </div>

              {/* Bottom Info Bar */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white text-2xl mb-2">TestNotifier Demo</div>
                    <div className="text-white/70">See the extension in action</div>
                  </div>
                  <Button 
                    size="lg"
                    className="bg-white text-[#1d70b8] hover:bg-white/90"
                  >
                    <PlayCircle className="w-5 h-5 mr-2" />
                    Watch Now
                  </Button>
                </div>
              </div>
            </div>

            {/* Decorative glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-[#1d70b8]/20 via-[#2e8bc0]/20 to-[#1d70b8]/20 rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
          </div>
        </div>

        {/* Process Steps */}
        <div className="grid md:grid-cols-4 gap-6">
          {[
            {
              icon: Zap,
              step: '01',
              title: 'Slot Detected',
              description: 'Extension detects availability',
              color: 'from-yellow-500 to-orange-500'
            },
            {
              icon: Bell,
              step: '02',
              title: 'Instant Alert',
              description: 'Notification sent immediately',
              color: 'from-green-500 to-emerald-500'
            },
            {
              icon: MousePointerClick,
              step: '03',
              title: 'One Click',
              description: 'View slot details instantly',
              color: 'from-blue-500 to-cyan-500'
            },
            {
              icon: CheckCircle,
              step: '04',
              title: 'You Book',
              description: 'Complete booking manually',
              color: 'from-purple-500 to-pink-500'
            }
          ].map((step, index) => (
            <div key={index} className="relative group">
              <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-transparent hover:shadow-xl transition-all">
                {/* Gradient border on hover */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-100 transition-opacity p-[2px]`}>
                  <div className="w-full h-full bg-white rounded-2xl"></div>
                </div>

                <div className="relative z-10">
                  {/* Step number */}
                  <div className="text-5xl font-light text-gray-200 mb-4">{step.step}</div>
                  
                  {/* Icon */}
                  <div className={`w-12 h-12 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center mb-4`}>
                    <step.icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Content */}
                  <h4 className="text-xl text-gray-900 mb-2">{step.title}</h4>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              </div>

              {/* Connector line */}
              {index < 3 && (
                <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-gray-300 to-transparent"></div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-br from-[#1d70b8]/5 via-[#2e8bc0]/5 to-[#1d70b8]/5 rounded-3xl p-12 border border-[#1d70b8]/20 text-center">
          <h3 className="text-3xl text-gray-900 mb-4">
            Ready to Experience TestNotifier?
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Install the Chrome extension for free and start monitoring test availability today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-[#1d70b8] to-[#2e8bc0] hover:shadow-xl text-lg px-8"
            >
              <PlayCircle className="w-5 h-5 mr-2" />
              Watch Full Tutorial
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-[#1d70b8] text-[#1d70b8] hover:bg-[#1d70b8]/5 text-lg px-8"
            >
              Install Extension Free
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

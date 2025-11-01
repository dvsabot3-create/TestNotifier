import { TrendingUp, Target, Users, Award } from "lucide-react";

export function BridgeSection() {
  return (
    <section className="bridge-section relative py-16 px-6 bg-gradient-to-b from-white to-blue-50/30 overflow-hidden">
      {/* Decorative gradient blobs */}
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-[#28a745]/10 to-transparent rounded-full blur-3xl -translate-y-1/2"></div>
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-gradient-to-bl from-[#1d70b8]/10 to-transparent rounded-full blur-3xl -translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Main Message */}
        <div className="text-center mb-12">
          <h2 className="bridge-title text-4xl lg:text-5xl text-gray-900 mb-6 leading-tight">
            There's a <span className="text-[#1d70b8]">Better Way</span> to Find Test Slots
          </h2>
          <p className="bridge-description text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Stop the endless checking. Let technology do the heavy lifting while you focus on what matters - preparing for your test.
          </p>
        </div>

        {/* Value Props Grid */}
        <div className="grid md:grid-cols-4 gap-6">
          {[
            {
              icon: TrendingUp,
              title: "Proven Results",
              description: "500+ learners already secured earlier slots",
              stat: "500+"
            },
            {
              icon: Target,
              title: "Laser Focused",
              description: "Only built for UK driving test monitoring",
              stat: "100%"
            },
            {
              icon: Users,
              title: "User Friendly",
              description: "5-minute setup, no technical skills required",
              stat: "5min"
            },
            {
              icon: Award,
              title: "Fully Legal",
              description: "Complies with all DVSA guidelines",
              stat: "✓"
            }
          ].map((item, index) => (
            <div 
              key={index}
              className="bridge-card group relative bg-white rounded-2xl p-6 border border-gray-200 hover:border-[#1d70b8]/30 hover:shadow-xl transition-all duration-300 text-center"
            >
              {/* Top gradient bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1d70b8] via-[#28a745] to-[#1d70b8] rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div className="relative">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#1d70b8]/10 to-[#2e8bc0]/10 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                  <item.icon className="w-8 h-8 text-[#1d70b8]" />
                </div>

                {/* Stat */}
                <div className="text-3xl text-[#1d70b8] mb-2">{item.stat}</div>

                {/* Title */}
                <h4 className="text-lg text-gray-900 mb-2">{item.title}</h4>

                {/* Description */}
                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Transition Arrow */}
        <div className="mt-12 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-0.5 h-12 bg-gradient-to-b from-transparent via-[#1d70b8] to-transparent"></div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1d70b8] to-[#28a745] flex items-center justify-center animate-bounce">
              <TrendingUp className="w-4 h-4 text-white rotate-90" />
            </div>
            <div className="w-0.5 h-12 bg-gradient-to-b from-[#1d70b8] to-transparent"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

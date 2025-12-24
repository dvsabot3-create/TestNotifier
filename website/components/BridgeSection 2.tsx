import { TrendingUp, Target, Users, Award } from 'lucide-react';

export function BridgeSection() {
  const bridgeCards = [
    {
      icon: TrendingUp,
      stat: "500+",
      title: "Proven Results",
      description: "500+ learners already secured earlier slots"
    },
    {
      icon: Target,
      stat: "100%",
      title: "Laser Focused",
      description: "Only built for UK driving test monitoring"
    },
    {
      icon: Users,
      stat: "5min",
      title: "User Friendly",
      description: "5-minute setup, no technical skills required"
    },
    {
      icon: Award,
      stat: "✓",
      title: "Fully Legal",
      description: "Complies with all DVSA guidelines"
    }
  ];

  return (
    <section className="bridge-section py-20 lg:py-32 bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="bridge-title text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            There's a Better Way to Find Test Slots
          </h2>
          <p className="bridge-description text-xl text-gray-600 max-w-3xl mx-auto">
            Stop the endless checking. Let technology do the heavy lifting while you focus on what matters - preparing for your test.
          </p>
        </div>

        {/* Value Proposition Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {bridgeCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <div key={index} className="bridge-card group">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20 hover:border-blue-200 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  {/* Stat */}
                  <div className="text-3xl font-bold text-blue-600 mb-3">
                    {card.stat}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {card.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
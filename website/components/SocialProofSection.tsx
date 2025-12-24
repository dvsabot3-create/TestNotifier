import { Star, Users, Bell, TrendingUp, Award, Quote } from "lucide-react";

export function SocialProofSection() {
  const testimonials = [
    {
      name: "Sarah M.",
      role: "Learner Driver",
      location: "Manchester",
      quote: "Got my test 3 months earlier thanks to TestNotifier! The notification came through at 2 AM and I managed to book it first thing in the morning. Absolutely life-changing.",
      rating: 5,
      avatar: "S",
      color: "#1d70b8"
    },
    {
      name: "Mike K.",
      role: "Learner Driver",
      location: "London",
      quote: "Finally, I can sleep without worrying about missing slots. The instant notifications are a game-changer. Worth every penny and more!",
      rating: 5,
      avatar: "M",
      color: "#28a745"
    },
    {
      name: "Lisa T.",
      role: "Driving Instructor",
      location: "Birmingham",
      quote: "This paid for itself in the first week. I can now help all my pupils find earlier test dates without spending hours checking manually. Essential tool for instructors!",
      rating: 5,
      avatar: "L",
      color: "#2e8bc0"
    }
  ];

  const stats = [
    {
      icon: Users,
      value: "500+",
      label: "Active Users",
      color: "#1d70b8",
      description: "Learners & instructors"
    },
    {
      icon: Bell,
      value: "10,000+",
      label: "Notifications Sent",
      color: "#28a745",
      description: "Helping learners daily"
    },
    {
      icon: TrendingUp,
      value: "95%",
      label: "Success Rate",
      color: "#ffc107",
      description: "Find earlier slots"
    },
    {
      icon: Award,
      value: "4.8/5",
      label: "Average Rating",
      color: "#2e8bc0",
      description: "From happy users"
    }
  ];

  return (
    <section className="social-proof-section py-20 px-4 bg-gradient-to-br from-[#f8f9fa] via-white to-[#f8f9fa]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block bg-yellow-50 text-yellow-600 px-4 py-2 rounded-full text-sm mb-6">
            Loved by Learners & Instructors
          </div>
          <h2 className="text-4xl lg:text-5xl text-[#1d70b8] mb-6">
            Trusted Across the UK
          </h2>
          <p className="text-xl text-[#6c757d] max-w-3xl mx-auto">
            Join hundreds of learners and driving instructors who've found earlier test dates with TestNotifier
          </p>
        </div>
        
        {/* Stats Grid */}
        <div className="stats-section grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="stat-item text-center group"
            >
              <div 
                className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transform group-hover:scale-110 transition-transform"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <stat.icon className="w-10 h-10" style={{ color: stat.color }} />
              </div>
              <div 
                className="counter text-5xl mb-2"
                style={{ color: stat.color }}
                data-target={stat.value}
              >
                {stat.value}
              </div>
              <p className="text-lg text-[#1d70b8] mb-1">{stat.label}</p>
              <p className="text-sm text-[#6c757d]">{stat.description}</p>
            </div>
          ))}
        </div>
        
        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="testimonial-card group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border border-gray-100 relative"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="w-12 h-12 text-[#1d70b8]" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#ffc107] text-[#ffc107]" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-[#1d70b8] mb-6 italic leading-relaxed relative z-10">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl"
                  style={{ backgroundColor: testimonial.color }}
                >
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="text-[#1d70b8]">{testimonial.name}</p>
                  <p className="text-sm text-[#6c757d]">{testimonial.role}</p>
                  <p className="text-xs text-[#6c757d]">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="bg-gradient-to-r from-[#1d70b8]/5 to-[#28a745]/5 rounded-2xl p-12 text-center">
          <h3 className="text-2xl text-[#1d70b8] mb-8">
            Trusted & Verified
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-12">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#28a745] rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <p className="text-lg text-[#1d70b8]">Chrome Web Store</p>
                <p className="text-sm text-[#6c757d]">Verified Extension</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#1d70b8] rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-white fill-current" />
              </div>
              <div className="text-left">
                <p className="text-lg text-[#1d70b8]">4.8/5 Rating</p>
                <p className="text-sm text-[#6c757d]">From 200+ reviews</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#28a745] rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <p className="text-lg text-[#1d70b8]">500+ Users</p>
                <p className="text-sm text-[#6c757d]">Active community</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

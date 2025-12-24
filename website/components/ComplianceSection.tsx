import { Shield, CheckCircle, Lock, FileText, AlertCircle, BarChart } from "lucide-react";

export function ComplianceSection() {
  const complianceFeatures = [
    {
      icon: Shield,
      text: "Respects DVSA rate limits",
      description: "We never overwhelm their servers"
    },
    {
      icon: CheckCircle,
      text: "No automated booking",
      description: "You maintain full control"
    },
    {
      icon: FileText,
      text: "Follows DVSA guidelines",
      description: "100% terms compliant"
    },
    {
      icon: Lock,
      text: "GDPR compliant",
      description: "Your data is protected"
    },
    {
      icon: AlertCircle,
      text: "Transparent operation",
      description: "No hidden functionality"
    },
    {
      icon: BarChart,
      text: "Regular audits",
      description: "Continuous compliance checks"
    }
  ];

  return (
    <section className="compliance-section py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block bg-green-50 text-[#28a745] px-4 py-2 rounded-full text-sm mb-6">
            Trust & Compliance
          </div>
          <h2 className="text-4xl lg:text-5xl text-[#1d70b8] mb-6">
            Fully Compliant & Transparent
          </h2>
          <p className="text-xl text-[#6c757d] max-w-3xl mx-auto">
            We take compliance seriously to protect both you and the integrity of the DVSA system
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
          {complianceFeatures.map((feature, index) => (
            <div 
              key={index}
              className="compliance-item group bg-gradient-to-br from-[#f8f9fa] to-white rounded-2xl p-6 hover:shadow-xl transition-all border border-gray-100 hover:border-[#28a745]/20"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#28a745]/10 to-[#28a745]/5 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-[#28a745]" />
                </div>
                <div>
                  <p className="text-[#1d70b8] mb-1">
                    {feature.text}
                  </p>
                  <p className="text-sm text-[#6c757d]">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-[#1d70b8]/5 via-[#28a745]/5 to-[#1d70b8]/5 rounded-3xl p-12 border-2 border-[#28a745]/20">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-[#28a745] to-[#1d70b8] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl text-[#1d70b8] mb-4">
                Your Trust is Our Priority
              </h3>
              <p className="text-[#6c757d] text-lg max-w-3xl mx-auto mb-8 leading-relaxed">
                TestNotifier operates within all legal and ethical boundaries. We monitor publicly available information and never access or store your DVSA credentials. All notifications are sent to help you make informed decisions, while you retain complete control over all booking actions.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 text-center shadow-md">
                <div className="text-3xl mb-3">🔒</div>
                <h4 className="text-lg text-[#1d70b8] mb-2">Secure</h4>
                <p className="text-sm text-[#6c757d]">No credential storage</p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center shadow-md">
                <div className="text-3xl mb-3">✓</div>
                <h4 className="text-lg text-[#1d70b8] mb-2">Compliant</h4>
                <p className="text-sm text-[#6c757d]">DVSA & GDPR approved</p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center shadow-md">
                <div className="text-3xl mb-3">🛡️</div>
                <h4 className="text-lg text-[#1d70b8] mb-2">Transparent</h4>
                <p className="text-sm text-[#6c757d]">Open about all operations</p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-[#6c757d]">
                Questions about compliance? <a href="#" className="text-[#1d70b8] hover:underline">Read our compliance documentation</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

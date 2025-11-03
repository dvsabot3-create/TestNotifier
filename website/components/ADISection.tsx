import { Award, CheckCircle2 } from "lucide-react";

export function ADISection() {
  return (
    <section className="py-12 px-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-y border-blue-100">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-blue-200">
          <div className="flex items-start gap-6">
            {/* Icon */}
            <div className="hidden md:flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex-shrink-0">
              <Award className="w-8 h-8 text-white" />
            </div>
            
            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-2xl font-bold text-gray-900">
                  Approved Driving Instructors (ADIs)
                </h3>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                  DVSA Compliant
                </span>
              </div>
              
              <p className="text-gray-700 mb-4 text-base leading-relaxed">
                Our ADI Professional tier is specifically designed for driving instructors managing multiple pupils. 
                Fully compliant with new DVSA regulations (April 2025) for instructor bookings.
              </p>
              
              <div className="grid md:grid-cols-4 gap-4">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm text-gray-900">Multi-Pupil Dashboard</p>
                    <p className="text-xs text-gray-600">Manage up to 20 pupils</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm text-gray-900">Per-Pupil Settings</p>
                    <p className="text-xs text-gray-600">Individual preferences</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm text-gray-900">WhatsApp Alerts</p>
                    <p className="text-xs text-gray-600">Instant notifications</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm text-gray-900">Priority Support</p>
                    <p className="text-xs text-gray-600">Phone + email</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  <strong>New DVSA Rules (April 2025):</strong> Only ADIs can book tests for students they teach. 
                  Our system ensures full compliance with automated pupil verification and proper workflow documentation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


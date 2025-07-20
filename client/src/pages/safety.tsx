import React from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Shield, 
  CheckCircle, 
  UserCheck, 
  FileText, 
  Lock, 
  Award,
  AlertTriangle,
  Phone,
  Clock,
  Star
} from "lucide-react";

export default function Safety() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[hsl(207,90%,54%)] to-[hsl(259,78%,60%)] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <Shield className="w-16 h-16 text-blue-100 mr-4" />
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
                Safety & Trust
              </h1>
            </div>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Your safety and trust are our highest priorities. Learn about our comprehensive safety measures, 
              provider verification process, and commitment to delivering secure healthcare in your home.
            </p>
          </div>
        </div>
      </section>

      {/* Safety Promise */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Our Safety Promise</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We maintain the highest safety standards to ensure you receive secure, professional healthcare at home.
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-3xl p-12 text-center">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">100% Verified Healthcare Professionals</h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Every healthcare provider on our platform undergoes rigorous verification including license verification, 
              background checks, insurance validation, and professional reference checks before serving any patients.
            </p>
          </div>
        </div>
      </section>

      {/* Provider Verification Process */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Provider Verification Process</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive 7-step verification ensures only qualified, trustworthy professionals join our platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Professional Licensing</h3>
              <p className="text-gray-600 text-center">
                Verification of all professional licenses and certifications with respective regulatory bodies 
                in Alberta and Canada.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Background Screening</h3>
              <p className="text-gray-600 text-center">
                Comprehensive background checks including criminal record searches and vulnerable sector screening 
                where applicable.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Insurance Validation</h3>
              <p className="text-gray-600 text-center">
                Verification of professional liability insurance and ongoing coverage monitoring 
                to protect both patients and providers.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Reference Verification</h3>
              <p className="text-gray-600 text-center">
                Professional references checked from previous employers, colleagues, and educational institutions 
                to validate experience and character.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Skills Assessment</h3>
              <p className="text-gray-600 text-center">
                Practical skills evaluation and ongoing competency assessments to ensure providers 
                maintain the highest standards of care.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Ongoing Monitoring</h3>
              <p className="text-gray-600 text-center">
                Continuous monitoring of provider performance, patient feedback, and license renewals 
                to maintain platform quality.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Safety Measures */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Safety Measures During Care</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Multiple layers of protection ensure your safety during every home visit.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-8 hover:shadow-xl transition-all duration-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Before Your Appointment</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-gray-600">Provider identity verification through photo ID and platform credentials</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-gray-600">GPS tracking confirms provider's location and arrival time</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-gray-600">Pre-visit safety screening and health assessment protocols</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-gray-600">Emergency contact information collected and verified</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-all duration-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">During Your Care</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-gray-600">Real-time session monitoring and check-in protocols</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-gray-600">24/7 emergency support hotline available during all appointments</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-gray-600">Standardized safety protocols and infection control measures</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-gray-600">Comprehensive documentation of all care provided</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Data Security */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Lock className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Data Security & Privacy</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your personal health information is protected with enterprise-grade security measures.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">PIPEDA Compliant</h3>
              <p className="text-gray-600">
                Full compliance with Canada's Personal Information Protection and Electronic Documents Act.
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Encrypted Storage</h3>
              <p className="text-gray-600">
                All data encrypted at rest and in transit using industry-standard AES-256 encryption.
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Access Controls</h3>
              <p className="text-gray-600">
                Strict access controls ensure only authorized healthcare providers can view your information.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Rapid Response Protocols */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <AlertTriangle className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Rapid Response Protocols</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Clear procedures in place for any situations requiring rapid assistance during home visits.
            </p>
          </div>
          
          <div className="bg-white rounded-3xl p-8 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center mb-4">
                  <Phone className="w-6 h-6 text-blue-500 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">24/7 Support Line</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Direct access to rapid support during all appointments with immediate response protocols.
                </p>
                <Badge className="bg-blue-100 text-blue-800">Call: 1-844-MEDLINK</Badge>
              </div>
              
              <div>
                <div className="flex items-center mb-4">
                  <Clock className="w-6 h-6 text-purple-500 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">Rapid Response</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Medical assistance contacted within minutes if any situation requires rapid response during care.
                </p>
                <Badge className="bg-purple-100 text-purple-800">Response Time: &lt; 5 minutes</Badge>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-sm text-amber-800 font-medium">
                <strong>Important:</strong> For life-threatening situations, always call 911 first. 
                Our support line is for rapid assistance during scheduled appointments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-[hsl(207,90%,54%)] to-[hsl(259,78%,60%)] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Questions About Our Safety Measures?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            We're transparent about our safety protocols. Contact us for more details about how we keep you safe.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/support">
              <Button size="lg" className="bg-white text-[hsl(207,90%,54%)] hover:bg-gray-100 font-semibold px-8 py-3 rounded-xl">
                Contact Support
              </Button>
            </Link>
            <Link href="/providers">
              <Button size="lg" className="border border-white bg-transparent text-white hover:bg-white hover:text-[hsl(207,90%,54%)] font-semibold px-8 py-3 rounded-xl transition-all duration-300">
                Find Providers
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
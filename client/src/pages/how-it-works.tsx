import React from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Search, 
  Calendar, 
  UserCheck, 
  MapPin, 
  CreditCard, 
  Star,
  Shield,
  Clock,
  Phone,
  CheckCircle,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from "lucide-react";
import { MedlinkLogo } from "@/components/MedlinkLogo";

const steps = [
  {
    step: 1,
    title: "Browse & Search",
    description: "Find the perfect healthcare provider for your needs using our advanced search and filtering system.",
    icon: Search,
    details: [
      "Browse by specialty and service type",
      "Filter by location, availability, and price",
      "Read provider profiles and reviews",
      "Compare qualifications and experience"
    ]
  },
  {
    step: 2,
    title: "Book Your Appointment",
    description: "Schedule your appointment at a time that works for you with our easy booking system.",
    icon: Calendar,
    details: [
      "View real-time availability",
      "Select convenient time slots",
      "Provide basic health information",
      "Specify any special requirements"
    ]
  },
  {
    step: 3,
    title: "Provider Confirmation",
    description: "Your chosen healthcare provider reviews and confirms your appointment details.",
    icon: UserCheck,
    details: [
      "Provider reviews your booking request",
      "Confirmation sent within 2-4 hours",
      "Direct communication with provider",
      "Pre-appointment health questionnaire"
    ]
  },
  {
    step: 4,
    title: "Service Delivery",
    description: "Your healthcare provider arrives at your location and delivers professional care.",
    icon: MapPin,
    details: [
      "Provider arrives at scheduled time",
      "Professional, personalized care",
      "All necessary equipment provided",
      "Detailed service documentation"
    ]
  },
  {
    step: 5,
    title: "Payment & Review",
    description: "Complete secure payment and share your experience to help others.",
    icon: CreditCard,
    details: [
      "Secure payment processing",
      "Transparent pricing with no hidden fees",
      "Digital receipts and invoices",
      "Rate and review your experience"
    ]
  }
];

const benefits = [
  {
    title: "Convenience",
    description: "No travel time, no waiting rooms, no parking hassles. Healthcare comes to you.",
    icon: Clock
  },
  {
    title: "Quality Care",
    description: "All providers are licensed, verified, and continuously monitored for quality.",
    icon: Shield
  },
  {
    title: "Personalized Service",
    description: "One-on-one attention in the comfort and privacy of your own home.",
    icon: Star
  },
  {
    title: "24/7 Support",
    description: "Our customer support team is available around the clock to assist you.",
    icon: Phone
  }
];

const faqs = [
  {
    question: "How do I know the providers are qualified?",
    answer: "All providers go through a rigorous verification process including license validation, background checks, and ongoing quality monitoring. We only work with certified, experienced healthcare professionals."
  },
  {
    question: "What areas do you serve?",
    answer: "We currently serve the greater Calgary area including all quadrants (NE, NW, SE, SW) and surrounding communities. Coverage areas vary by provider and service type."
  },
  {
    question: "How much do services cost?",
    answer: "Pricing varies by service type and provider. You'll see transparent pricing before booking, with no hidden fees. Most services range from $60-150 per visit, with rapid services having priority pricing."
  },
  {
    question: "What if I need to cancel or reschedule?",
    answer: "You can cancel or reschedule up to 4 hours before your appointment through your dashboard or by contacting the provider directly. Cancellations within 4 hours may incur a fee."
  },
  {
    question: "Is this covered by Alberta Health?",
    answer: "Some services may be covered by Alberta Health or private insurance. We provide detailed receipts that you can submit to your insurance provider for potential reimbursement."
  },
  {
    question: "What if I need rapid care?",
    answer: "For life-threatening situations, always call 911. Our rapid services are for ASAP, non-life-threatening situations that require prompt professional attention."
  }
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[hsl(207,90%,54%)] to-[hsl(259,78%,60%)] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-4 tracking-tight">
              How MedLink Works
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Getting professional healthcare at home has never been easier. 
              Follow these simple steps to connect with verified healthcare providers in Calgary.
            </p>
            <Link href="/providers">
              <Button size="lg" className="bg-white text-[hsl(207,90%,54%)] hover:bg-gray-100 font-semibold px-8 py-3 rounded-xl">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              Simple 5-Step Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From booking to care delivery, we've made the entire process seamless and transparent.
            </p>
          </div>

          <div className="space-y-8">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              const isEven = index % 2 === 0;
              
              return (
                <div key={step.step} className={`flex flex-col lg:flex-row items-center gap-8 ${!isEven ? 'lg:flex-row-reverse' : ''}`}>
                  <div className="flex-1">
                    <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                      <CardHeader>
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-[hsl(207,90%,54%)] to-[hsl(259,78%,60%)] rounded-xl flex items-center justify-center">
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                          <div className="w-8 h-8 bg-[hsl(207,90%,54%)] rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">{step.step}</span>
                          </div>
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-900">
                          {step.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                          {step.description}
                        </p>
                        <ul className="space-y-3">
                          {step.details.map((detail, detailIndex) => (
                            <li key={detailIndex} className="flex items-center text-gray-700">
                              <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="flex-1 flex justify-center">
                    <div className="w-64 h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
                      <IconComponent className="h-24 w-24 text-[hsl(207,90%,54%)]" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              Why Choose MedLink?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of healthcare with our innovative home-care platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-[hsl(207,90%,54%)] to-[hsl(259,78%,60%)] rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get answers to common questions about our services and platform.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-[hsl(207,90%,54%)] to-[hsl(259,78%,60%)] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 tracking-tight">
            Ready to Experience Healthcare at Home?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of Calgarians who have discovered the convenience of professional home healthcare.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/providers">
              <Button size="lg" className="bg-white text-[hsl(207,90%,54%)] hover:bg-gray-100 font-semibold px-8 py-3 rounded-xl">
                Browse Providers
              </Button>
            </Link>
            <Link href="/apply">
              <Button size="lg" className="border border-white bg-transparent text-white hover:bg-white hover:text-[hsl(207,90%,54%)] font-semibold px-8 py-3 rounded-xl transition-all duration-300">
                Become a Provider
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-6">
                <MedlinkLogo size="md" />
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Professional in-home healthcare services across Calgary. Licensed providers, secure booking, and trusted care at your doorstep.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-300">
                  <span className="text-sm font-medium">Phone:</span>
                  <span className="ml-2 text-sm">1-844-MEDLINK</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <span className="text-sm font-medium">Service Area:</span>
                  <span className="ml-2 text-sm">Calgary, Alberta</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <span className="text-sm font-medium">Hours:</span>
                  <span className="ml-2 text-sm">7 AM - 11 PM Daily</span>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <Facebook className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Twitter className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Instagram className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Linkedin className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>
            
            {/* Patient Resources */}
            <div>
              <h3 className="text-lg font-semibold mb-6">For Patients</h3>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/providers" className="hover:text-white transition-colors" onClick={() => setTimeout(() => window.scrollTo(0, 0), 100)}>Find Providers</Link></li>
                <li><Link href="/rapid-services" className="hover:text-white transition-colors" onClick={() => setTimeout(() => window.scrollTo(0, 0), 100)}>Rapid Services</Link></li>
                <li><Link href="/services" className="hover:text-white transition-colors" onClick={() => setTimeout(() => window.scrollTo(0, 0), 100)}>All Services</Link></li>
                <li><Link href="/how-it-works" className="hover:text-white transition-colors" onClick={() => setTimeout(() => window.scrollTo(0, 0), 100)}>How It Works</Link></li>
                <li><Link href="/support" className="hover:text-white transition-colors" onClick={() => setTimeout(() => window.scrollTo(0, 0), 100)}>Insurance Coverage</Link></li>
              </ul>
            </div>
            
            {/* Provider Resources */}
            <div>
              <h3 className="text-lg font-semibold mb-6">For Providers</h3>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/apply" className="hover:text-white transition-colors" onClick={() => setTimeout(() => window.scrollTo(0, 0), 100)}>Join MedLink</Link></li>
                <li><Link href="/dashboard/provider" className="hover:text-white transition-colors" onClick={() => setTimeout(() => window.scrollTo(0, 0), 100)}>Provider Portal</Link></li>
                <li><Link href="/safety" className="hover:text-white transition-colors" onClick={() => setTimeout(() => window.scrollTo(0, 0), 100)}>Verification Process</Link></li>
                <li><Link href="/support" className="hover:text-white transition-colors" onClick={() => setTimeout(() => window.scrollTo(0, 0), 100)}>Provider Support</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors" onClick={() => setTimeout(() => window.scrollTo(0, 0), 100)}>Professional Resources</Link></li>
              </ul>
            </div>
            
            {/* Company */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Company</h3>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors" onClick={() => setTimeout(() => window.scrollTo(0, 0), 100)}>About MedLink</Link></li>
                <li><Link href="/safety" className="hover:text-white transition-colors" onClick={() => setTimeout(() => window.scrollTo(0, 0), 100)}>Safety & Trust</Link></li>
                <li><Link href="/support" className="hover:text-white transition-colors" onClick={() => setTimeout(() => window.scrollTo(0, 0), 100)}>Support Center</Link></li>
                <li><a href="mailto:hello@medlink.ca" className="hover:text-white transition-colors">hello@medlink.ca</a></li>
                <li><a href="tel:1-844-633-5465" className="hover:text-white transition-colors">1-844-MEDLINK</a></li>
              </ul>
            </div>
          </div>
          
          {/* Important Notice */}
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="bg-red-900/30 border border-red-800 rounded-xl p-4 mb-8">
              <p className="text-red-200 text-sm font-medium text-center">
                <strong>Important:</strong> For life-threatening emergencies, always call 911 first. 
                MedLink provides non-emergency healthcare services only.
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm">
                © 2024 MedLink House Calls Inc. All rights reserved.
              </div>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">PIPEDA Compliance</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
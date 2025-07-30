import React from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Zap, 
  Clock, 
  Stethoscope, 
  Syringe, 
  Brain, 
  Activity,
  Timer,
  Phone,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Heart,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from "lucide-react";
import { MedlinkLogo } from "@/components/MedlinkLogo";

const rapidServices = [
  {
    title: "Rapid Nursing Care",
    description: "ASAP nursing care for non-life-threatening medical situations requiring immediate professional attention.",
    icon: Stethoscope,
    features: [
      "Wound assessment and rapid care",
      "Vital signs monitoring and evaluation", 
      "Medication administration and guidance",
      "Health crisis management",
      "Pain assessment and management",
      "Rapid health education"
    ],
    pricing: "Contact provider for quote",
    responseTime: "Within 2-4 hours",
    availability: "24/7"
  },
  {
    title: "Rapid Lab Services",
    description: "ASAP blood work and diagnostic testing with expedited processing and same-day results.",
    icon: Syringe,
    features: [
      "Rapid blood draws",
      "Priority diagnostic testing",
      "Expedited sample processing",
      "Same-day results delivery",
      "Critical value alerts",
      "Coordination with healthcare providers"
    ],
    pricing: "Contact provider for quote",
    responseTime: "Within 1-3 hours",
    availability: "24/7"
  },
  {
    title: "Rapid Mental Health Support",
    description: "Crisis intervention and ASAP mental health support for immediate psychological needs.",
    icon: Brain,
    features: [
      "Crisis intervention counseling",
      "Rapid mental health assessment",
      "Safety planning and support",
      "Immediate coping strategies",
      "Resource coordination",
      "Follow-up care planning"
    ],
    pricing: "Contact provider for quote",
    responseTime: "Within 2-6 hours",
    availability: "24/7"
  },
  {
    title: "Rapid Physiotherapy",
    description: "ASAP mobility and pain management for acute injuries and movement situations.",
    icon: Activity,
    features: [
      "Acute injury assessment",
      "Rapid pain management",
      "Mobility restoration techniques",
      "Immediate exercise therapy",
      "Safety evaluation",
      "Equipment assessment"
    ],
    pricing: "Contact provider for quote",
    responseTime: "Within 3-6 hours",
    availability: "Daily 7AM-11PM"
  }
];

const pricingFactors = [
  {
    factor: "Priority Scheduling",
    description: "Jump ahead of regular bookings for ASAP care",
    icon: Timer
  },
  {
    factor: "24/7 Availability",
    description: "Access to providers during evenings, nights, and weekends",
    icon: Clock
  },
  {
    factor: "Rapid Response",
    description: "Faster arrival times and immediate care delivery",
    icon: Zap
  },
  {
    factor: "Enhanced Support",
    description: "Direct provider communication and follow-up coordination",
    icon: Phone
  }
];

const safetyGuidelines = [
  {
    title: "When to Use Rapid Services",
    items: [
      "ASAP health concerns that can't wait for regular appointments",
      "Non-life-threatening situations requiring prompt attention",
      "Acute pain or discomfort needing immediate assessment",
      "Medication issues requiring rapid professional guidance",
      "Health crises during evenings, nights, or weekends"
    ]
  },
  {
    title: "When to Call 911",
    items: [
      "Chest pain or difficulty breathing",
      "Severe injuries or trauma",
      "Loss of consciousness or confusion",
      "Signs of stroke or heart attack",
      "Any life-threatening situation"
    ]
  }
];

export default function RapidServices() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navigation />
      
      {/* Apple-style Hero Section */}
      <section className="relative min-h-[90vh] bg-gradient-to-b from-gray-50 via-white to-purple-50 overflow-hidden flex items-center">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-20 w-36 h-36 bg-purple-200 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-pulse"></div>
          <div className="absolute bottom-1/3 right-20 w-40 h-40 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-indigo-200 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-black mb-8 leading-[0.85] text-gray-900 text-balance">
            Rapid
            <span className="block text-transparent bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text">
              care services
            </span>
          </h1>
          
          <div className="max-w-4xl mx-auto mb-16">
            <p className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-600 leading-relaxed mb-8">
              When you need ASAP healthcare that can't wait, our rapid services provide priority response.
            </p>
            <p className="text-xl sm:text-2xl font-light text-gray-500">
              Immediate scheduling and professional care.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <Link href="/providers?rapid=true">
              <Button size="lg" className="bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,44%)] text-white text-xl px-12 py-6 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                Request Rapid Care
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button size="lg" variant="outline" className="border-2 border-gray-300 hover:border-gray-400 text-gray-800 text-xl px-12 py-6 rounded-full font-semibold bg-white/80 backdrop-blur-sm transition-all duration-300">
                How it works
              </Button>
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="mt-20">
            <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center mx-auto">
              <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-bounce"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-8 bg-amber-50 border-t border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-amber-600 mr-4" />
            <div className="text-center">
              <p className="text-lg font-semibold text-amber-800">
                Rapid services are for ASAP, non-life-threatening situations only.
              </p>
              <p className="text-amber-700">
                For life-threatening situations, always call 911 first.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Rapid Services */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              Available Rapid Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional healthcare delivered to your home with priority scheduling and rapid response times.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {rapidServices.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card key={index} className="p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-l-4 border-blue-500">
                  <div className="flex items-start mb-6">
                    <div className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center mr-6 flex-shrink-0">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{service.title}</h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">{service.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <DollarSign className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                          <p className="text-sm font-semibold text-blue-800">{service.pricing}</p>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <Clock className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                          <p className="text-sm font-semibold text-purple-800">{service.responseTime}</p>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-600 mx-auto mb-1" />
                          <p className="text-sm font-semibold text-green-800">{service.availability}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">What's included:</h4>
                    <ul className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-blue-500 mt-1 mr-3 flex-shrink-0" />
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <Link href="/providers?rapid=true">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl">
                        Book {service.title}
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How to Get Your Quote */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              How to Get Your Personalized Quote
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every healthcare need is unique. Contact providers directly for personalized quotes based on your specific requirements.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingFactors.map((factor, index) => {
              const IconComponent = factor.icon;
              return (
                <Card key={index} className="text-center p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{factor.factor}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{factor.description}</p>
                </Card>
              );
            })}
          </div>
          
          <div className="mt-12 text-center">
            <Card className="p-8 max-w-3xl mx-auto bg-white border-l-4 border-blue-500">
              <Phone className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Virtual Consultation First</h3>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Start with a virtual consultation to discuss your needs and receive a personalized quote. 
                Providers will assess your situation and provide transparent pricing based on your specific care requirements.
              </p>
              <Badge className="bg-blue-100 text-blue-800 px-4 py-2">
                Insurance receipts provided for all services
              </Badge>
            </Card>
          </div>
        </div>
      </section>

      {/* Safety Guidelines */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              Important Safety Guidelines
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Understanding when to use our rapid services vs. calling 911 can save precious time in critical situations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {safetyGuidelines.map((guideline, index) => (
              <Card key={index} className="p-8 hover:shadow-xl transition-all duration-300">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  {index === 0 ? (
                    <Zap className="w-6 h-6 text-blue-500 mr-3" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-amber-500 mr-3" />
                  )}
                  {guideline.title}
                </h3>
                <ul className="space-y-3">
                  {guideline.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-1 mr-3 flex-shrink-0" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 tracking-tight">Need Urgent Healthcare?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Don't wait when you need care. Our rapid services are available 24/7 with priority scheduling.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/providers">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-3 rounded-xl">
                Book Rapid Service
              </Button>
            </Link>
            <Link href="/services">
              <Button size="lg" variant="outline" className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-3 rounded-xl transition-all duration-300 shadow-md">
                View All Services
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
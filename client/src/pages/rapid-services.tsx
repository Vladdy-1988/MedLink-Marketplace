import React from "react";
import Navigation from "@/components/Navigation";
import { MarketplacePageHero } from "@/components/MarketplacePageHero";
import { Card } from "@/components/ui/card";
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
  DollarSign
} from "lucide-react";
import Footer from "@/components/Footer";
import { rapidServiceDetails } from "@/lib/rapidServicesCatalog";

const rapidServiceIconMap = {
  Stethoscope,
  Syringe,
  Brain,
  Activity,
};

const pricingFactors = [
  {
    factor: "Priority Scheduling",
    description: "Jump ahead of regular bookings for ASAP care",
    icon: Timer
  },
  {
    factor: "Extended Hours",
    description: "Access to providers during evenings and weekends (7AM-11PM daily)",
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
      
      <MarketplacePageHero
        eyebrow="Priority non-emergency care"
        title="Rapid care"
        accent="at home."
        description="For ASAP health concerns that cannot wait for a routine appointment, rapid services help you find non-emergency care with priority scheduling."
        supportingText="Chest pain, breathing trouble, stroke symptoms, severe injuries, or life-threatening symptoms still require 911."
        primaryCta={{ href: "/providers?rapid=true", label: "Request Rapid Care" }}
        secondaryCta={{ href: "/how-it-works", label: "How it works" }}
      />

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
            {rapidServiceDetails.map((service, index) => {
              const IconComponent = rapidServiceIconMap[service.icon];
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
            Don't wait when you need care. Our rapid services are available daily 7AM-11PM with priority scheduling.
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

      <Footer />
    </div>
  );
}

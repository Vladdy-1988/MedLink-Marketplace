import React from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { serviceCategories } from "@/lib/mockData";
import { 
  Stethoscope, UserCheck, Activity, Home, Heart, TestTube, Brain, Syringe, 
  Smile, Ear, Eye, Footprints, MessageCircle, Apple, Pill, Droplets,
  Zap, Clock, CheckCircle
} from "lucide-react";

// Icon mapping for service types
const iconMap = {
  'Stethoscope': Stethoscope,
  'UserCheck': UserCheck,
  'Activity': Activity,
  'Home': Home,
  'Heart': Heart,
  'TestTube': TestTube,
  'Brain': Brain,
  'Syringe': Syringe,
  'Smile': Smile,
  'Ear': Ear,
  'Eye': Eye,
  'Footprints': Footprints,
  'MessageCircle': MessageCircle,
  'Apple': Apple,
  'Pill': Pill,
  'Droplets': Droplets
};

// Organize services by categories
const organizedServices = {
  'Essential Care': serviceCategories.filter(s => ['General Practice', 'Nursing Services', 'Mobile Lab Tests', 'Vaccinations'].includes(s.name)),
  'Therapy Services': serviceCategories.filter(s => ['Physical Therapy', 'Occupational Therapy', 'Mental Health', 'Speech Therapy'].includes(s.name)),
  'Specialized Care': serviceCategories.filter(s => ['Dental Care', 'Vision Care', 'Hearing Services', 'Podiatry'].includes(s.name)),
  'Advanced Services': serviceCategories.filter(s => ['Palliative Care', 'IV Therapy', 'Nutrition', 'Pharmacy'].includes(s.name))
};

const rapidServices = [
  {
    title: "Rapid Nursing Care",
    description: "ASAP nursing care for non-life-threatening medical situations",
    pricing: "Starting at $150/visit",
    features: ["24/7 availability", "Priority response", "Rapid assessment", "Care coordination"]
  },
  {
    title: "Rapid Lab Services",
    description: "ASAP blood work and diagnostic testing with expedited results",
    pricing: "Starting at $120/test",
    features: ["Same-day results", "Priority scheduling", "Rapid sample collection", "Expedited processing"]
  },
  {
    title: "Rapid Mental Health Support",
    description: "ASAP mental health support and priority counseling",
    pricing: "Starting at $180/session",
    features: ["Priority scheduling", "Same-day appointments", "Rapid assessment", "Support coordination"]
  }
];

export default function Services() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[hsl(207,90%,54%)] to-[hsl(259,78%,60%)] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-4 tracking-tight">
              Our Healthcare Services
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Professional, convenient, and personalized healthcare services delivered to your home in Calgary. 
              Experience quality care without the hassle of travel.
            </p>
            <Link href="/providers">
              <Button size="lg" className="bg-white text-[hsl(207,90%,54%)] hover:bg-gray-100 font-semibold px-8 py-3 rounded-xl">
                Book a Service
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* All Services by Category */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              Complete Healthcare Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From routine care to specialized treatments, our certified healthcare professionals 
              bring quality medical services directly to your doorstep.
            </p>
          </div>

          {Object.entries(organizedServices).map(([categoryName, services], categoryIndex) => (
            <div key={categoryName} className="mb-16">
              <div className="flex items-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mr-4">{categoryName}</h3>
                <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
                <Badge variant="outline" className="ml-4 text-sm">
                  {services.length} Services
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {services.map((service) => {
                  const IconComponent = iconMap[service.icon as keyof typeof iconMap];
                  return (
                    <Card key={service.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-1">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-[hsl(207,90%,54%)] to-[hsl(259,78%,60%)] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            {IconComponent && <IconComponent className="h-6 w-6 text-white" />}
                          </div>
                        </div>
                        <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-[hsl(207,90%,54%)] transition-colors">
                          {service.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-gray-600 leading-relaxed text-sm">
                          {service.description}
                        </p>
                        
                        <div className="space-y-2">
                          <div className="text-lg font-semibold text-[hsl(207,90%,54%)]">
                            {service.price}
                          </div>
                          {service.insurance && (
                            <div className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              {service.insurance}
                            </div>
                          )}
                        </div>

                        <Link href="/providers">
                          <Button className="w-full bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,44%)] font-semibold rounded-lg">
                            Book Now
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Rapid Services */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Zap className="h-8 w-8 text-blue-600 mr-3" />
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
                Rapid Care Services
              </h2>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              When you need ASAP care, our rapid services provide fast response 
              with priority scheduling and immediate attention.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {rapidServices.map((service, index) => (
              <Card key={index} className="border-2 border-blue-200 hover:border-blue-300 transition-all duration-300 shadow-lg hover:shadow-xl">
                <CardHeader>
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                      <Zap className="h-5 w-5 text-white" />
                    </div>
                    <Badge className="bg-blue-600 text-white font-medium">
                      RAPID
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                  
                  <div className="text-lg font-semibold text-blue-600">
                    {service.pricing}
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 text-sm">Rapid service features:</h4>
                    <ul className="space-y-1">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="text-sm text-gray-600 flex items-center">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link href="/providers">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 font-semibold rounded-lg">
                      Request Rapid Care
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 max-w-2xl mx-auto">
              <p className="text-sm text-amber-800 font-medium">
                <strong>Important:</strong> Rapid services are for ASAP, non-life-threatening situations only. 
                For life-threatening situations, please call 911 immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-[hsl(207,90%,54%)] to-[hsl(259,78%,60%)] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 tracking-tight">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Book your appointment today and experience the convenience of professional healthcare at home.
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
    </div>
  );
}
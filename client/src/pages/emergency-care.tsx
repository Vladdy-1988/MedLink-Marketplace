import React from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  Zap, 
  Clock, 
  Phone, 
  AlertTriangle,
  Shield,
  Stethoscope,
  Activity,
  Brain,
  Syringe,
  CheckCircle,
  Timer,
  DollarSign
} from "lucide-react";

const emergencyServices = [
  {
    title: "Emergency Nursing Care",
    description: "Urgent nursing care for non-life-threatening medical situations requiring immediate professional attention.",
    icon: Stethoscope,
    features: [
      "Wound assessment and emergency care",
      "Vital signs monitoring and evaluation", 
      "Medication administration and guidance",
      "Health crisis management",
      "Pain assessment and management",
      "Emergency health education"
    ],
    pricing: "Starting at $150/visit",
    responseTime: "Within 2-4 hours",
    availability: "24/7"
  },
  {
    title: "Emergency Lab Services",
    description: "Urgent blood work and diagnostic testing with expedited processing and same-day results.",
    icon: Syringe,
    features: [
      "Emergency blood draws",
      "Urgent diagnostic testing",
      "Priority sample processing",
      "Same-day results delivery",
      "Critical value alerts",
      "Coordination with healthcare providers"
    ],
    pricing: "Starting at $120/test",
    responseTime: "Within 1-3 hours",
    availability: "24/7"
  },
  {
    title: "Emergency Mental Health Support",
    description: "Crisis intervention and urgent mental health support for immediate psychological needs.",
    icon: Brain,
    features: [
      "Crisis intervention counseling",
      "Emergency mental health assessment",
      "Safety planning and support",
      "Immediate coping strategies",
      "Resource coordination",
      "Follow-up care planning"
    ],
    pricing: "Starting at $180/session",
    responseTime: "Within 2-6 hours",
    availability: "24/7"
  },
  {
    title: "Emergency Physiotherapy",
    description: "Urgent mobility and pain management for acute injuries and movement emergencies.",
    icon: Activity,
    features: [
      "Acute injury assessment",
      "Emergency pain management",
      "Mobility restoration techniques",
      "Immediate exercise therapy",
      "Safety evaluation",
      "Equipment assessment"
    ],
    pricing: "Starting at $140/session",
    responseTime: "Within 3-6 hours",
    availability: "Daily 7AM-11PM"
  }
];

const pricingFactors = [
  {
    factor: "Priority Scheduling",
    description: "Jump ahead of regular bookings for urgent care",
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
    title: "When to Use Emergency Services",
    items: [
      "Urgent health concerns that can't wait for regular appointments",
      "Non-life-threatening injuries requiring immediate care",
      "Sudden onset symptoms needing professional evaluation",
      "Mental health crises requiring immediate support",
      "Acute pain or discomfort needing urgent attention"
    ]
  },
  {
    title: "When to Call 911 Instead",
    items: [
      "Chest pain or difficulty breathing",
      "Severe bleeding or trauma",
      "Loss of consciousness or severe confusion",
      "Suspected stroke or heart attack",
      "Any life-threatening emergency"
    ]
  }
];

export default function EmergencyCare() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <Zap className="h-12 w-12 mr-4" />
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
                Emergency Care
              </h1>
            </div>
            <p className="text-xl text-red-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              When you need urgent healthcare that can't wait, our emergency services provide 
              rapid response with priority scheduling and immediate professional care.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/providers">
                <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100 font-semibold px-8 py-3 rounded-xl">
                  Request Emergency Care
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-600 font-semibold px-8 py-3 rounded-xl">
                <Phone className="h-5 w-5 mr-2" />
                Emergency Hotline
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Alert */}
      <section className="py-8 bg-yellow-50 border-b border-yellow-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-yellow-600 mr-4" />
            <div className="text-center">
              <p className="text-lg font-semibold text-yellow-800">
                Emergency services are for urgent, non-life-threatening situations only.
              </p>
              <p className="text-yellow-700">
                For life-threatening emergencies, always call <strong>911</strong> immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Services */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              Emergency Healthcare Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional emergency care delivered to your location with priority scheduling and rapid response times.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {emergencyServices.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card key={index} className="border-2 border-red-200 hover:border-red-300 transition-all duration-300 shadow-lg hover:shadow-xl">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center mr-4">
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <Badge className="bg-red-600 text-white font-medium">
                          EMERGENCY
                        </Badge>
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-gray-600 leading-relaxed">
                      {service.description}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <DollarSign className="h-5 w-5 text-red-600 mx-auto mb-1" />
                        <div className="font-semibold text-red-700">{service.pricing}</div>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <Timer className="h-5 w-5 text-red-600 mx-auto mb-1" />
                        <div className="font-semibold text-red-700">{service.responseTime}</div>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <Clock className="h-5 w-5 text-red-600 mx-auto mb-1" />
                        <div className="font-semibold text-red-700">{service.availability}</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900 text-sm">Emergency features:</h4>
                      <ul className="space-y-1">
                        {service.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="text-sm text-gray-600 flex items-center">
                            <CheckCircle className="w-4 h-4 text-red-600 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Link href="/providers">
                      <Button className="w-full bg-red-600 hover:bg-red-700 font-semibold rounded-lg">
                        Request Emergency {service.title.split(' ')[1]}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Information */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              Emergency Care Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Emergency services include premium pricing due to priority scheduling, 
              24/7 availability, and rapid response times.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pricingFactors.map((factor, index) => {
              const IconComponent = factor.icon;
              return (
                <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {factor.factor}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {factor.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Emergency Service Premium
                </h3>
                <p className="text-gray-700 mb-4">
                  Emergency services are priced at a 50-100% premium over regular services due to:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-red-600 mr-2" />
                    Priority provider allocation
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-red-600 mr-2" />
                    24/7 availability guarantee
                  </div>
                  <div className="flex items-center">
                    <Zap className="h-4 w-4 text-red-600 mr-2" />
                    Rapid response commitment
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-red-600 mr-2" />
                    Enhanced support and follow-up
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Safety Guidelines */}
      <section className="py-16 bg-gradient-to-r from-gray-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              Safety Guidelines
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Understanding when to use emergency services versus calling 911 is crucial for your safety.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {safetyGuidelines.map((guideline, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className={`text-xl font-bold ${index === 0 ? 'text-green-700' : 'text-red-700'}`}>
                    {guideline.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {guideline.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <div className={`w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 ${index === 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 tracking-tight">
            Need Emergency Care Now?
          </h2>
          <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
            Don't wait when you need urgent healthcare. Our emergency services are ready to respond quickly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/providers">
              <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100 font-semibold px-8 py-3 rounded-xl">
                <Zap className="h-5 w-5 mr-2" />
                Request Emergency Care
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-600 font-semibold px-8 py-3 rounded-xl">
              <Phone className="h-5 w-5 mr-2" />
              Call Emergency Line
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
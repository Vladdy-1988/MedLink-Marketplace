import React, { useState } from "react";
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
  Linkedin,
  ChevronDown,
  ChevronUp,
  Heart,
  Stethoscope,
  Home,
  Plus,
  Minus,
  Activity,
  Users,
  FileText,
  Sparkles,
  ArrowRight,
  Info
} from "lucide-react";
import { MedlinkLogo } from "@/components/MedlinkLogo";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Service pricing data
const servicePricing = {
  "General Practice": { base: 80, insurance: "Alberta Health Services" },
  "Nursing Care": { base: 90, insurance: "Extended Health Plans" },
  "Physical Therapy": { base: 120, insurance: "Extended Health Plans" },
  "Mental Health": { base: 150, insurance: "Extended Health Plans" },
  "Lab Tests": { base: 60, insurance: "Alberta Health Services" },
  "Vaccinations": { base: 40, insurance: "Alberta Health Services" },
  "Dental Care": { base: 200, insurance: "Specialty Plans" },
  "Specialized Care": { base: 180, insurance: "Varies by Plan" }
};

const memberTestimonials = [
  {
    name: "Sarah Chen",
    avatar: "SC",
    visits: "15+ visits on MedLink",
    quote: "Having healthcare come to me has been life-changing. I can manage my chronic condition without the stress of travel and waiting rooms.",
    tip: "Book recurring appointments with the same provider for continuity of care"
  },
  {
    name: "Robert Martinez", 
    avatar: "RM",
    visits: "8+ visits on MedLink",
    quote: "As a busy parent, MedLink saves me hours every week. My kids get quality care at home while I can continue working.",
    tip: "Schedule family appointments back-to-back for efficiency"
  },
  {
    name: "Emily Thompson",
    avatar: "ET", 
    visits: "20+ visits on MedLink",
    quote: "The convenience is unmatched. I've had everything from physio to mental health support, all in my living room.",
    tip: "Use the rapid service option when you need same-day care"
  }
];

const providerImages = [
  { alt: "Doctor consultation", bg: "from-blue-100 to-blue-200" },
  { alt: "Physical therapy session", bg: "from-purple-100 to-purple-200" },
  { alt: "Mental health counseling", bg: "from-green-100 to-green-200" },
  { alt: "Home nursing care", bg: "from-pink-100 to-pink-200" },
  { alt: "Lab test collection", bg: "from-yellow-100 to-yellow-200" },
  { alt: "Vaccination service", bg: "from-indigo-100 to-indigo-200" },
  { alt: "Dental care", bg: "from-red-100 to-red-200" },
  { alt: "Specialized care", bg: "from-teal-100 to-teal-200" }
];

export default function HowItWorks() {

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Apple-style Hero Section */}
      <section className="relative min-h-[90vh] bg-gradient-to-b from-blue-50 via-white to-purple-50 overflow-hidden flex items-center">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 right-20 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-pulse"></div>
          <div className="absolute bottom-1/3 left-20 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-pulse delay-500"></div>
          <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-green-200 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-black mb-8 leading-[0.85] text-gray-900 text-balance">
            How it
            <span className="block text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
              works
            </span>
          </h1>
          
          <div className="max-w-4xl mx-auto mb-16">
            <p className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-600 leading-relaxed mb-8">
              Getting professional healthcare at home is simple, safe, and convenient.
            </p>
            <p className="text-xl sm:text-2xl font-light text-gray-500">
              Here's everything you need to know about our process.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <Link href="/providers">
              <Button size="lg" className="bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,44%)] text-white text-xl px-12 py-6 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                Find Providers
              </Button>
            </Link>
            <Link href="/services">
              <Button size="lg" variant="outline" className="border-2 border-gray-300 hover:border-gray-400 text-gray-800 text-xl px-12 py-6 rounded-full font-semibold bg-white/80 backdrop-blur-sm transition-all duration-300">
                Browse Services
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

      {/* How Healthcare Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">How healthcare works</h2>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
              MedLink is a community of patients connecting with verified providers.
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl font-bold">Everyone is vetted</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  All healthcare providers must pass rigorous verification including license validation, background checks, and ongoing quality monitoring before joining our platform.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Star className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-xl font-bold">Quality guaranteed</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Unlike traditional clinics, every provider maintains high ratings through continuous patient feedback. We ensure consistent quality care in the comfort of your home.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Link href="/providers">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                Browse Providers
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How Booking Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">How booking works</h2>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
              Book appointments. Receive care. Stay healthy.
            </h3>
          </div>

          <div className="space-y-12">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                  <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl mb-6 flex items-center justify-center">
                    <Search className="h-16 w-16 text-blue-600" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-4">Browse available providers</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Search from a selection of 100+ verified healthcare providers in Calgary. Filter by specialty, location, and availability.
                  </p>
                </div>
              </div>
              <div className="flex-1">
                <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                  <div className="w-full h-48 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl mb-6 flex items-center justify-center">
                    <Calendar className="h-16 w-16 text-green-600" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-4">Schedule your appointment</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Book your preferred time slot and receive instant confirmation. We handle all the coordination while you relax.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 & 4 */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                  <div className="w-full h-48 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl mb-6 flex items-center justify-center">
                    <Home className="h-16 w-16 text-purple-600" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-4">Receive care at home</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Your provider visits your home with all necessary equipment for professional healthcare services. Enjoy quality care in the comfort of your own space.
                  </p>
                  <div className="mt-4 text-sm text-gray-500">
                    Professional care delivered safely to your doorstep
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                  <div className="w-full h-48 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl mb-6 flex items-center justify-center">
                    <Star className="h-16 w-16 text-orange-600" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-4">Rate & review experience</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Share your experience to help other patients and maintain our quality standards. Your feedback helps us continuously improve our services.
                  </p>
                  <div className="mt-4 text-sm text-gray-500">
                    Help build trust in our healthcare community
                  </div>
                </div>
              </div>
            </div>

            {/* Member Tip */}
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-blue-600 text-white">{memberTestimonials[0].avatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-semibold text-gray-900">Member Pro Tip: Book Early</span>
                  </div>
                  <p className="text-gray-700 italic">"{memberTestimonials[0].tip}"</p>
                  <p className="text-sm text-gray-500 mt-1">- {memberTestimonials[0].name}, {memberTestimonials[0].visits}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* FAQs Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
              Frequently asked questions
            </h2>
          </div>

          <div className="space-y-6">
            {/* Booking FAQs */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Booking FAQs</h3>
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="same-day" className="bg-white rounded-lg border-0 shadow-sm px-6">
                  <AccordionTrigger className="hover:no-underline text-left">
                    Can I book same-day appointments?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    Yes! We offer rapid services for ASAP healthcare needs. These appointments have priority scheduling and are typically available within 2-4 hours, subject to provider availability.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="specialist" className="bg-white rounded-lg border-0 shadow-sm px-6">
                  <AccordionTrigger className="hover:no-underline text-left">
                    What if I need to see a specialist?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    MedLink connects you with various specialists including physiotherapists, mental health counselors, dietitians, and more. Some specialists may require a referral from your family doctor.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="prescriptions" className="bg-white rounded-lg border-0 shadow-sm px-6">
                  <AccordionTrigger className="hover:no-underline text-left">
                    Are prescriptions available through MedLink?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    Yes, our licensed physicians can prescribe medications when medically appropriate. Prescriptions can be sent directly to your preferred pharmacy for pickup or delivery.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Provider FAQs */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Provider FAQs</h3>
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="safety" className="bg-white rounded-lg border-0 shadow-sm px-6">
                  <AccordionTrigger className="hover:no-underline text-left">
                    How do providers ensure safety and hygiene?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    All providers follow strict health and safety protocols including PPE usage, sanitization of equipment between visits, and adherence to Alberta Health guidelines. Providers are fully vaccinated and undergo regular health screenings.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="equipment" className="bg-white rounded-lg border-0 shadow-sm px-6">
                  <AccordionTrigger className="hover:no-underline text-left">
                    What equipment do providers bring?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    Providers come fully equipped with all necessary medical supplies, diagnostic tools, and safety equipment. You don't need to prepare anything special for their visit.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="family" className="bg-white rounded-lg border-0 shadow-sm px-6">
                  <AccordionTrigger className="hover:no-underline text-left">
                    Can family members be present during appointments?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    Absolutely! Family members are welcome to be present during appointments. For minors, a parent or guardian must be present. This can be especially helpful for elderly patients or those needing support.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Pricing FAQs */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Pricing FAQs</h3>
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="membership" className="bg-white rounded-lg border-0 shadow-sm px-6">
                  <AccordionTrigger className="hover:no-underline text-left">
                    Is there a membership fee?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    No, there's no membership fee with MedLink. You only pay for the services you use. Our transparent pricing means you know exactly what you'll pay before booking.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="coverage" className="bg-white rounded-lg border-0 shadow-sm px-6">
                  <AccordionTrigger className="hover:no-underline text-left">
                    What does the platform fee cover?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    The platform fee covers provider verification, appointment coordination, quality assurance, customer support, and technology infrastructure that makes home healthcare possible and safe.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/providers">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                Start Your Healthcare Journey
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
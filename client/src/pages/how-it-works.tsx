import React from "react";
import Navigation from "@/components/Navigation";
import { MarketplacePageHero } from "@/components/MarketplacePageHero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Search, 
  Calendar, 
  Star,
  Shield,
  Home,
  ArrowRight
} from "lucide-react";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Service pricing data
const servicePricing = {
  "General Practice": { base: 80, insurance: "Alberta Health Services" },
  "Nursing Care": { base: 90, insurance: "Extended Health Plans" },
  "Physiotherapy": { base: 120, insurance: "Extended Health Plans" },
  "Mental Health": { base: 150, insurance: "Extended Health Plans" },
  "Lab Tests": { base: 60, insurance: "Alberta Health Services" },
  "Vaccinations": { base: 40, insurance: "Alberta Health Services" },
  "Dental Care": { base: 200, insurance: "Specialty Plans" },
  "Specialized Care": { base: 180, insurance: "Varies by Plan" }
};

export default function HowItWorks() {

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <MarketplacePageHero
        eyebrow="Simple care flow"
        title="How MedLink"
        accent="works."
        description="Find the right provider, compare your options, book securely, and receive professional healthcare at home."
        supportingText="The experience is built to feel calm and predictable, with clear steps from discovery to follow-up."
        primaryCta={{ href: "/providers", label: "Find Providers" }}
        secondaryCta={{ href: "/services", label: "Browse Services" }}
      />

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
                    Search verified healthcare providers in Calgary. Filter by specialty, location, and availability.
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

            {/* Booking Tip */}
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                  <Calendar className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-semibold text-gray-900">Booking Tip: Plan Ahead</span>
                  </div>
                  <p className="text-gray-700">
                    Book recurring appointments with the same provider when continuity of care matters.
                  </p>
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

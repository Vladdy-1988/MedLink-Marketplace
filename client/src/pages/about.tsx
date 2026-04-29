import React from "react";
import Navigation from "@/components/Navigation";
import { MarketplacePageHero } from "@/components/MarketplacePageHero";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Heart, 
  Shield, 
  Users, 
  CheckCircle
} from "lucide-react";
import Footer from "@/components/Footer";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <MarketplacePageHero
        eyebrow="Built in Calgary"
        title="Care at home,"
        accent="designed with heart."
        description="MedLink House Calls was founded by Calgary professionals who believe high-quality healthcare should come to patients with more clarity, dignity, and ease."
        supportingText="The marketplace brings provider quality, healthcare operations, and thoughtful digital experience together for modern house calls."
        primaryCta={{ href: "/providers", label: "Book Your Visit" }}
        secondaryCta={{ href: "/apply", label: "Join as Provider" }}
      />

      {/* Co-Founders Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">Our Co-Founders</h2>
          
          <div className="grid md:grid-cols-2 gap-16">
            {/* Vlad */}
            <div className="text-center">
              <div className="relative mb-8">
                <div className="w-64 h-64 mx-auto bg-gradient-to-br from-blue-100 to-teal-100 rounded-2xl flex items-center justify-center shadow-lg">
                  <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-4xl font-bold text-white">VD</span>
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Vlad Dumbrava</h3>
              <p className="text-lg text-blue-600 font-semibold mb-6">Co-Founder & COO</p>
              <p className="text-gray-600 text-left leading-relaxed">
                With over a decade owning and operating denture clinics across Alberta, Vlad knows first-hand how life-changing in-home care can be for patients with mobility or chronic-health challenges. He oversees provider recruitment, compliance, and quality assurance, ensuring every professional on MedLink is fully licensed, background-checked, and committed to compassionate, patient-centric service.
              </p>
            </div>

            {/* Paula Martinez */}
            <div className="text-center">
              <div className="relative mb-8">
                <div className="w-64 h-64 mx-auto bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center shadow-lg">
                  <div className="w-32 h-32 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-4xl font-bold text-white">PM</span>
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Paula Martínez</h3>
              <p className="text-lg text-blue-600 font-semibold mb-6">Co-Founder & CEO</p>
              <p className="text-gray-600 text-left leading-relaxed">
                A digital-media strategist with 7+ years leading award-winning campaigns for lifestyle and wellness brands, Paula has spent her career making complex services simple and accessible online. She guides MedLink's product vision, patient experience, and growth strategy—translating her passion for community, technology, and inclusive care into a platform that puts people first.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="grid md:grid-cols-3 gap-12 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Patients</h3>
              <p className="text-gray-600">Trusted, vetted professionals who deliver medical, dental, therapy, and wellness services right to their doorstep.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Providers</h3>
              <p className="text-gray-600">Trusted distribution that delivers high-quality customers and comprehensive support infrastructure.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Healthcare</h3>
              <p className="text-gray-600">Better experience, better outcomes, better access to quality care in the comfort of home.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">Our Mission</h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              To make healthcare as effortless as ordering your favourite meal—connecting Calgarians to trusted, vetted professionals who deliver medical, dental, therapy, and wellness services right to their doorstep.
            </p>
          </div>
        </div>
      </section>

      {/* Our Promise */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">Our Promise</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Trust</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Every provider is thoroughly screened, licensed, and insured.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Transparency</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Clear pricing, real-time scheduling, and honest reviews—no surprises.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Heart className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Comfort</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Receive quality care at home, on your terms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Closing Statement */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Digital Innovation Meets Clinical Excellence
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed mb-12">
            Together, Paula and Vlad combine digital innovation with clinical excellence to re-imagine house calls for today's world—starting in Calgary, and soon expanding across Canada.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/providers">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                Book Your Visit
              </Button>
            </Link>
            <Link href="/apply">
              <Button size="lg" variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-12 py-4 text-lg font-semibold rounded-full transition-all duration-300">
                Join as Provider
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

import React from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Heart, 
  Shield, 
  Users, 
  CheckCircle,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Play
} from "lucide-react";
import { MedlinkLogo } from "@/components/MedlinkLogo";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section - Fora inspired */}
      <section className="relative py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              The Modern Healthcare Experience
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 mb-12 leading-relaxed">
              MedLink House Calls was founded by two Calgary professionals who share one belief: high-quality healthcare should come to you—comfortably, safely, and on your schedule.
            </p>
            
            {/* Video placeholder with play button */}
            <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-16 mb-16 shadow-lg">
              <div className="flex items-center justify-center">
                <button className="bg-blue-600 hover:bg-blue-700 rounded-full p-6 shadow-xl transition-all duration-300 hover:scale-105">
                  <Play className="h-8 w-8 text-white ml-1" fill="currentColor" />
                </button>
              </div>
              <p className="text-gray-600 mt-6 text-lg">Meet Our Founders</p>
            </div>
          </div>
        </div>
      </section>

      {/* Co-Founders Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">Our Co-Founders</h2>
          
          <div className="grid md:grid-cols-2 gap-16">
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
              <p className="text-gray-600 text-left leading-relaxed mb-6">
                A digital-media strategist with 7+ years leading award-winning campaigns for lifestyle and wellness brands, Paula has spent her career making complex services simple and accessible online. She guides MedLink's product vision, patient experience, and growth strategy—translating her passion for community, technology, and inclusive care into a platform that puts people first.
              </p>
              <div className="text-left">
                <p className="font-semibold text-gray-900 mb-2">Expertise:</p>
                <ul className="text-gray-600 space-y-1">
                  <li>• Digital marketing & SEO</li>
                  <li>• Product & brand strategy</li>
                  <li>• Data-driven user experience</li>
                </ul>
              </div>
            </div>

            {/* Vlad */}
            <div className="text-center">
              <div className="relative mb-8">
                <div className="w-64 h-64 mx-auto bg-gradient-to-br from-blue-100 to-teal-100 rounded-2xl flex items-center justify-center shadow-lg">
                  <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-4xl font-bold text-white">VD</span>
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Vlad — DD, Denturist</h3>
              <p className="text-lg text-blue-600 font-semibold mb-6">Co-Founder & Chief Clinical Partnerships Officer</p>
              <p className="text-gray-600 text-left leading-relaxed mb-6">
                With over a decade owning and operating denture clinics across Alberta, Vlad knows first-hand how life-changing in-home care can be for patients with mobility or chronic-health challenges. He oversees provider recruitment, compliance, and quality assurance, ensuring every professional on MedLink is fully licensed, background-checked, and committed to compassionate, patient-centric service.
              </p>
              <div className="text-left">
                <p className="font-semibold text-gray-900 mb-2">Expertise:</p>
                <ul className="text-gray-600 space-y-1">
                  <li>• Clinical operations & patient care</li>
                  <li>• Provider vetting & standards</li>
                  <li>• Mobile dental and allied-health logistics</li>
                </ul>
              </div>
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
            <Link href="/provider-registration">
              <Button size="lg" variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-12 py-4 text-lg font-semibold rounded-full transition-all duration-300">
                Join as Provider
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
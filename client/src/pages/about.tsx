import React from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Heart, 
  Shield, 
  Users, 
  Award, 
  Clock, 
  MapPin,
  CheckCircle,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from "lucide-react";
import { MedlinkLogo } from "@/components/MedlinkLogo";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navigation />
      
      {/* Apple-style Hero Section */}
      <section className="relative min-h-[90vh] bg-gradient-to-b from-gray-50 via-white to-green-50 overflow-hidden flex items-center">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 right-20 w-40 h-40 bg-green-200 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-pulse"></div>
          <div className="absolute bottom-1/3 left-20 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-pulse delay-500"></div>
          <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-purple-200 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-black mb-8 leading-[0.85] text-gray-900 text-balance">
            Reimagining
            <span className="block text-transparent bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text">
              healthcare
            </span>
          </h1>
          
          <div className="max-w-4xl mx-auto mb-16">
            <p className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-600 leading-relaxed mb-8">
              We're revolutionizing healthcare delivery in Calgary by bringing professional medical services directly to your home.
            </p>
            <p className="text-xl sm:text-2xl font-light text-gray-500">
              Convenient, personal, and stress-free healthcare.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <Link href="/providers">
              <Button size="lg" className="bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,44%)] text-white text-xl px-12 py-6 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                Meet Our Providers
              </Button>
            </Link>
            <Link href="/safety">
              <Button size="lg" variant="outline" className="border-2 border-gray-300 hover:border-gray-400 text-gray-800 text-xl px-12 py-6 rounded-full font-semibold bg-white/80 backdrop-blur-sm transition-all duration-300">
                Safety & Trust
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

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="p-8 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed">
                To make quality healthcare accessible to everyone in Calgary by eliminating barriers like transportation, 
                mobility issues, and busy schedules. We believe healthcare should come to you, not the other way around.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mr-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Our Vision</h2>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed">
                To become Canada's leading home healthcare platform, setting the gold standard for convenience, 
                safety, and quality in at-home medical services while supporting healthcare professionals with modern tools and opportunities.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Our Story</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Born from a simple idea: healthcare should be accessible, convenient, and patient-centered.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="p-8 shadow-lg">
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                MedLink House Calls was founded in Calgary with a clear vision: to bridge the gap between patients who need care 
                and healthcare providers who want to make a meaningful difference. We recognized that many people struggle to access 
                healthcare due to mobility challenges, transportation barriers, busy schedules, or simply the stress of clinical environments.
              </p>
              
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Our platform connects certified healthcare professionals with patients in their homes, creating a win-win situation. 
                Patients receive personalized, convenient care in their comfort zone, while providers can focus on what they do best - 
                healing and caring - without the overhead of traditional clinical settings.
              </p>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                Today, we're proud to serve the Calgary community with a comprehensive range of healthcare services, 
                from routine nursing care to specialized therapies, all delivered with the highest standards of safety and professionalism.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Why Choose MedLink?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're more than a healthcare platform - we're your partners in wellness.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Certified Professionals</h3>
              <p className="text-gray-600 text-center">
                All our healthcare providers are fully licensed, insured, and background-checked professionals 
                committed to delivering exceptional care.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Flexible Scheduling</h3>
              <p className="text-gray-600 text-center">
                Book appointments that fit your schedule, including evenings and weekends. 
                Healthcare on your terms, when you need it most.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Calgary-Focused</h3>
              <p className="text-gray-600 text-center">
                We know Calgary. Our local expertise means we understand Alberta's healthcare system 
                and what our community needs.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Insurance Compatible</h3>
              <p className="text-gray-600 text-center">
                Many of our services are covered by Alberta Health Services and private insurance plans. 
                We help with documentation and billing.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Personalized Care</h3>
              <p className="text-gray-600 text-center">
                One-on-one attention in the comfort of your home. Build lasting relationships 
                with healthcare providers who truly know you.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Community Impact</h3>
              <p className="text-gray-600 text-center">
                Supporting local healthcare professionals while improving access to care 
                for Calgary families, seniors, and individuals with mobility challenges.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-[hsl(207,90%,54%)] to-[hsl(259,78%,60%)] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ready to Experience Better Healthcare?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of Calgary residents who have discovered the convenience and quality of home healthcare.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/providers">
              <Button size="lg" className="bg-white text-[hsl(207,90%,54%)] hover:bg-gray-100 font-semibold px-8 py-3 rounded-xl">
                Find Providers
              </Button>
            </Link>
            <Link href="/services">
              <Button size="lg" className="border border-white bg-transparent text-white hover:bg-white hover:text-[hsl(207,90%,54%)] font-semibold px-8 py-3 rounded-xl transition-all duration-300">
                Browse Services
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
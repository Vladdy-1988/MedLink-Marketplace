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
  CheckCircle
} from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[hsl(207,90%,54%)] to-[hsl(259,78%,60%)] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-4 tracking-tight">
              About MedLink House Calls
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              We're revolutionizing healthcare delivery in Calgary by bringing professional medical services directly to your home. 
              Experience healthcare the way it should be - convenient, personal, and stress-free.
            </p>
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
    </div>
  );
}
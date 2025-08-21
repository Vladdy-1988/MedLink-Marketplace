import Navigation from "@/components/Navigation";
import ServiceCategories from "@/components/ServiceCategories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Search, Activity, Heart, Shield, Clock, Star, Users, CheckCircle, ArrowRight, Phone, MessageCircle, Calendar } from "lucide-react";
import { UserCheck, DollarSign } from "lucide-react";
import { MedlinkLogo } from "@/components/MedlinkLogo";
import Footer from "@/components/Footer";
import heroImage from "@assets/pexels-matthiaszomer-339620_1755038074358.jpg";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section - Redesigned with modern approach */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-emerald-50">
        {/* Background with glassmorphism */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-emerald-600/10" />
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-400/20 rounded-full filter blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-emerald-400/20 rounded-full filter blur-3xl animate-pulse delay-1000" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            {/* Badge */}
            <Badge variant="outline" className="bg-white/80 backdrop-blur-sm border-blue-200 text-blue-800 px-6 py-2 text-sm font-medium">
              🏥 Calgary's #1 Home Healthcare Platform
            </Badge>

            {/* Main Headline */}
            <div className="space-y-6">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 leading-tight">
                Healthcare that
                <span className="block bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  comes to you
                </span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Connect with licensed healthcare providers in Calgary for professional, 
                convenient in-home medical services. Safe, trusted, and personalized care.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto py-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-600">Verified Providers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">15k+</div>
                <div className="text-sm text-gray-600">Patients Served</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">4.9★</div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/providers">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  Find Your Provider
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button size="lg" variant="outline" className="border-2 border-gray-300 hover:border-gray-400 px-8 py-4 rounded-2xl text-lg font-semibold bg-white/80 backdrop-blur-sm transition-all duration-300 hover:bg-white">
                  How It Works
                </Button>
              </Link>
            </div>
          </div>

          {/* Search Card */}
          <div className="mt-16 max-w-4xl mx-auto">
            <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-2xl rounded-3xl">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-1">
                    <Label className="text-sm font-semibold text-gray-700 mb-2 block">Service Type</Label>
                    <Select>
                      <SelectTrigger className="h-12 rounded-xl border-gray-200 bg-gray-50">
                        <SelectValue placeholder="All Services" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Services</SelectItem>
                        <SelectItem value="general-practice">General Practice</SelectItem>
                        <SelectItem value="nursing">Nursing</SelectItem>
                        <SelectItem value="physical-therapy">Physical Therapy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="md:col-span-1">
                    <Label className="text-sm font-semibold text-gray-700 mb-2 block">Location</Label>
                    <Input 
                      placeholder="Calgary, AB" 
                      className="h-12 rounded-xl border-gray-200 bg-gray-50"
                    />
                  </div>
                  
                  <div className="md:col-span-1">
                    <Label className="text-sm font-semibold text-gray-700 mb-2 block">When</Label>
                    <Input 
                      type="date" 
                      min={new Date().toISOString().split('T')[0]}
                      className="h-12 rounded-xl border-gray-200 bg-gray-50"
                    />
                  </div>
                  
                  <div className="md:col-span-1 flex items-end">
                    <Link href="/providers" className="w-full">
                      <Button className="w-full h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl font-semibold shadow-lg transition-all duration-300">
                        <Search className="mr-2 h-4 w-4" />
                        Search
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose MedLink?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience healthcare the way it should be - convenient, professional, and tailored to your needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white rounded-2xl">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Verified Professionals</h3>
                <p className="text-gray-600 leading-relaxed">
                  All our healthcare providers are licensed, insured, and thoroughly vetted for your safety and peace of mind.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white rounded-2xl">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Convenient Scheduling</h3>
                <p className="text-gray-600 leading-relaxed">
                  Book appointments that fit your schedule, including evenings and weekends, all from the comfort of your home.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white rounded-2xl">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Personalized Care</h3>
                <p className="text-gray-600 leading-relaxed">
                  Receive one-on-one attention with personalized treatment plans tailored to your unique health needs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <ServiceCategories />

      {/* How It Works - Simplified */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple. Secure. Effective.</h2>
            <p className="text-xl text-gray-600">Get the care you need in three easy steps</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                number: "01", 
                title: "Choose Your Provider", 
                description: "Browse verified healthcare professionals by specialty, location, and availability.",
                icon: Search
              },
              { 
                number: "02", 
                title: "Book Your Visit", 
                description: "Select a convenient time and book your in-home appointment securely online.",
                icon: Calendar
              },
              { 
                number: "03", 
                title: "Receive Care", 
                description: "Your provider arrives with all necessary equipment for professional healthcare at home.",
                icon: Heart
              }
            ].map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <step.icon className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {step.number}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Insurance Coverage */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Insurance Coverage</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Many services are covered by Alberta Health Services and private insurance plans
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg bg-white rounded-2xl">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Activity className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Alberta Health Services</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    General Practice visits
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Home nursing care
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Laboratory tests
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Vaccinations
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg bg-white rounded-2xl">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Extended Health Plans</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Physical therapy
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Mental health counseling
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Dietitian consultations
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Speech therapy
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg bg-white rounded-2xl">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <UserCheck className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Specialty Coverage</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Dental care services
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Podiatry care
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Medical equipment
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Prescriptions
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Experience Better Healthcare?</h2>
          <p className="text-xl text-blue-100 mb-10 leading-relaxed">
            Join thousands of Calgarians who trust MedLink for their healthcare needs. 
            Professional, convenient, and personalized care is just a click away.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/providers">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                Find Providers Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/apply">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300">
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
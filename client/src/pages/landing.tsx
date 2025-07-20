import Navigation from "@/components/Navigation";
import ServiceCategories from "@/components/ServiceCategories";
import ProviderCard from "@/components/ProviderCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "wouter";
import { featuredProviders } from "@/lib/mockData";
import { Search, Activity, Heart, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { UserCheck, DollarSign } from "lucide-react";
import { MedlinkLogo } from "@/components/MedlinkLogo";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[hsl(207,90%,54%)] to-[hsl(259,78%,60%)] text-white">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-display text-5xl lg:text-7xl font-black mb-6 leading-[0.9] text-balance">
              Quality Healthcare
              <span className="block">Delivered to Your Door</span>
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto font-medium text-balance leading-relaxed">
              Connect with licensed healthcare providers in Calgary for professional in-home medical services through MedLink. Safe, convenient, and trusted.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Label className="block text-sm font-medium text-gray-700 mb-2">Service Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All Services" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Services</SelectItem>
                      <SelectItem value="nursing">Nursing Care</SelectItem>
                      <SelectItem value="physio">Physiotherapy</SelectItem>
                      <SelectItem value="dental">Dental Hygiene</SelectItem>
                      <SelectItem value="lab">Lab Services</SelectItem>
                      <SelectItem value="alternative">Alternative Therapy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="relative">
                  <Label className="block text-sm font-medium text-gray-700 mb-2">Date</Label>
                  <Input type="date" min={new Date().toISOString().split('T')[0]} />
                </div>
                <div className="relative">
                  <Label className="block text-sm font-medium text-gray-700 mb-2">Location</Label>
                  <Input type="text" placeholder="Calgary, AB" />
                </div>
              </div>
              <Link href="/providers">
                <Button className="w-full mt-6 bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,44%)] py-4 text-lg">
                  <Search className="mr-2 h-5 w-5" />
                  Find Healthcare Providers
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <ServiceCategories />

      {/* Featured Providers */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Top-Rated Healthcare Providers</h2>
              <p className="text-xl text-gray-600">Trusted professionals serving the Calgary community</p>
            </div>
            <Link href="/providers">
              <Button className="hidden md:block bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,44%)]">
                View All Providers
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {featuredProviders.slice(0, 8).map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
          
          <div className="text-center mt-8 md:hidden">
            <Link href="/providers">
              <Button className="bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,44%)]">
                View All Providers
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Insurance Coverage Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Insurance Coverage</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Many of our healthcare services are covered by Alberta Health Services and private insurance plans
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Activity className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Alberta Health Services</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• General Practice visits</li>
                <li>• Home nursing care</li>
                <li>• Palliative care services</li>
                <li>• Laboratory tests with requisition</li>
                <li>• Vaccinations & immunizations</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Extended Health Plans</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Physical & occupational therapy</li>
                <li>• Mental health counseling</li>
                <li>• Dietitian consultations</li>
                <li>• Speech therapy</li>
                <li>• Vision & hearing assessments</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <UserCheck className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Specialty Plans</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Dental care services</li>
                <li>• Podiatry for diabetics</li>
                <li>• Pharmacy consultations</li>
                <li>• Medical equipment coverage</li>
                <li>• Prescription medications</li>
              </ul>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <div className="bg-white rounded-2xl p-6 max-w-4xl mx-auto shadow-lg">
              <p className="text-gray-700 text-lg mb-4">
                <strong>Need help with insurance claims?</strong> Our providers can assist with documentation and billing to help maximize your coverage.
              </p>
              <p className="text-sm text-gray-500">
                Coverage varies by plan. Contact your insurance provider or our support team to verify your specific benefits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">How MedLink Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Simple, secure, and convenient healthcare at your doorstep</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: 1, title: "Search & Browse", description: "Find qualified healthcare providers by service type, location, and availability in Calgary.", color: "bg-[hsl(207,90%,54%)]" },
              { number: 2, title: "Book Appointment", description: "Choose your preferred provider, select a convenient time, and securely book your appointment online.", color: "bg-[hsl(159,100%,34%)]" },
              { number: 3, title: "Receive Care", description: "Your provider visits your home with all necessary equipment for professional healthcare services.", color: "bg-[hsl(259,78%,60%)]" },
              { number: 4, title: "Rate & Review", description: "Share your experience to help other patients and maintain our quality standards.", color: "bg-orange-500" }
            ].map((step) => (
              <div key={step.number} className="text-center group">
                <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <span className="text-2xl font-bold text-white">{step.number}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Become a Provider */}
      <section className="py-16 bg-gradient-to-r from-[hsl(207,90%,54%)] to-[hsl(259,78%,60%)] text-white" id="become-provider">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Join Our Network of Healthcare Providers</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Expand your practice by offering convenient in-home services to patients across Calgary. Join hundreds of verified healthcare professionals already using MedLink.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserCheck className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Flexible Schedule</h3>
                <p className="text-blue-100">Set your own hours and availability</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Competitive Rates</h3>
                <p className="text-blue-100">Earn premium rates for home visits</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Growing Demand</h3>
                <p className="text-blue-100">Connect with patients seeking home care</p>
              </div>
            </div>
            <Link href="/apply">
              <Button size="lg" className="bg-white text-[hsl(207,90%,54%)] hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                Apply to Become a Provider
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-6">
                <MedlinkLogo size="md" />
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Connecting patients with qualified healthcare providers for professional in-home medical services across Calgary. Safe, convenient, and trusted healthcare at your doorstep.
              </p>
              <div className="flex space-x-4">
                <Facebook className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Twitter className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Instagram className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Linkedin className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6">Services</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Nursing Care</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Physiotherapy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Dental Services</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Lab Services</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Alternative Therapy</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6">Company</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li>
                  <button 
                    onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                    className="hover:text-white transition-colors"
                  >
                    How It Works
                  </button>
                </li>
                <li><a href="#" className="hover:text-white transition-colors">Safety & Trust</a></li>
                <li>
                  <button 
                    onClick={() => document.getElementById('become-provider')?.scrollIntoView({ behavior: 'smooth' })}
                    className="hover:text-white transition-colors"
                  >
                    Become a Provider
                  </button>
                </li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © 2024 Medlink. All rights reserved.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">PIPEDA Compliance</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

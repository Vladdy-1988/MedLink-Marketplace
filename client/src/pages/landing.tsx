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
import Footer from "@/components/Footer";
import heroImage from "@assets/pexels-matthiaszomer-339620_1755038074358.jpg";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section - Redesigned */}
      <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-40 right-20 w-96 h-96 bg-green-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        {/* Modern grid pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 min-h-screen flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              
              {/* Left Column - Content */}
              <div className="text-left space-y-8">
                {/* Trust badges */}
                <div className="flex items-center space-x-4 text-blue-200/80">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Licensed Providers</span>
                  </div>
                  <div className="w-1 h-4 bg-blue-200/40"></div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-300"></div>
                    <span className="text-sm font-medium">Insured Services</span>
                  </div>
                  <div className="w-1 h-4 bg-blue-200/40"></div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-700"></div>
                    <span className="text-sm font-medium">Same-Day Available</span>
                  </div>
                </div>

                {/* Main headline */}
                <div className="space-y-6">
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[0.9] tracking-tight">
                    Healthcare
                    <span className="block text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text">
                      that comes
                    </span>
                    <span className="block text-white">
                      to you
                    </span>
                  </h1>
                  
                  <p className="text-xl sm:text-2xl text-blue-100/90 leading-relaxed max-w-2xl">
                    Skip the waiting rooms. Connect with Calgary's top healthcare professionals who bring quality medical care directly to your home.
                  </p>
                </div>

                {/* Key benefits */}
                <div className="grid grid-cols-3 gap-6 py-8">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Activity className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-lg font-semibold text-white mb-1">200+</div>
                    <div className="text-sm text-blue-200">Providers</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Heart className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-lg font-semibold text-white mb-1">24/7</div>
                    <div className="text-sm text-blue-200">Support</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <UserCheck className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-lg font-semibold text-white mb-1">98%</div>
                    <div className="text-sm text-blue-200">Satisfaction</div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/providers">
                    <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg px-8 py-6 rounded-2xl font-semibold shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 transform hover:scale-105">
                      <Search className="mr-2 h-5 w-5" />
                      Find Your Provider
                    </Button>
                  </Link>
                  <Link href="/how-it-works">
                    <Button size="lg" variant="outline" className="border-2 border-white/20 hover:border-white/40 text-white hover:text-blue-100 text-lg px-8 py-6 rounded-2xl font-semibold bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all duration-500">
                      How It Works
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right Column - Interactive Search Card */}
              <div className="lg:pl-8">
                <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 p-8 shadow-2xl">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">Book Your Care</h2>
                    <p className="text-blue-100/80">Choose your service and get matched instantly</p>
                  </div>

                  <div className="space-y-6">
                    {/* Service selection */}
                    <div className="space-y-3">
                      <Label className="text-white font-medium">What do you need?</Label>
                      <Select>
                        <SelectTrigger className="h-14 text-lg rounded-2xl border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder:text-white/60">
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general-practice">🩺 General Practice</SelectItem>
                          <SelectItem value="nursing">👩‍⚕️ Nursing Care</SelectItem>
                          <SelectItem value="physical-therapy">🤸‍♀️ Physical Therapy</SelectItem>
                          <SelectItem value="mental-health">🧠 Mental Health</SelectItem>
                          <SelectItem value="lab-tests">🧪 Lab Tests</SelectItem>
                          <SelectItem value="vaccinations">💉 Vaccinations</SelectItem>
                          <SelectItem value="dental-care">🦷 Dental Care</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Urgency selector */}
                    <div className="space-y-3">
                      <Label className="text-white font-medium">When do you need care?</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" className="h-12 border-white/20 bg-white/10 hover:bg-white/20 text-white rounded-2xl backdrop-blur-sm transition-all">
                          🚨 ASAP
                        </Button>
                        <Button variant="outline" className="h-12 border-white/20 bg-white/10 hover:bg-white/20 text-white rounded-2xl backdrop-blur-sm transition-all">
                          📅 Schedule
                        </Button>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-3">
                      <Label className="text-white font-medium">Your location</Label>
                      <Input 
                        type="text" 
                        placeholder="Enter your address in Calgary" 
                        className="h-14 text-lg rounded-2xl border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder:text-white/60"
                      />
                    </div>

                    {/* Search button */}
                    <Link href="/providers">
                      <Button className="w-full h-14 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white text-lg font-semibold rounded-2xl shadow-lg hover:shadow-green-500/25 transition-all duration-500 transform hover:scale-[1.02]">
                        <Search className="mr-2 h-5 w-5" />
                        Find Available Providers
                      </Button>
                    </Link>

                    {/* Quick stats */}
                    <div className="pt-6 border-t border-white/10">
                      <div className="text-center text-white/80 text-sm">
                        <span className="font-semibold text-green-400">47 providers</span> available today in your area
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modern scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="flex flex-col items-center space-y-2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
            </div>
            <span className="text-xs text-white/60 font-medium">Scroll to explore</span>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <ServiceCategories />



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

      <Footer />
    </div>
  );
}

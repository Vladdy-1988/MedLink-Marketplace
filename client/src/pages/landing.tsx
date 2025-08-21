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
// Removed heroImage import - now using pure CSS gradient background

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Modern Gradient Background */}
        <div className="absolute inset-0 z-0">
          {/* Base gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900" />
          
          {/* Animated gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/30 via-transparent to-green-600/20" />
          <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-blue-500/10 to-teal-600/30" />
          
          {/* Geometric shapes */}
          <div className="absolute top-10 right-10 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-tr from-emerald-500/15 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-green-400/10 rounded-full blur-3xl"></div>
          
          {/* Medical cross pattern overlay */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-1/4 left-1/4 w-1 h-20 bg-white transform rotate-45"></div>
            <div className="absolute top-1/4 left-1/4 w-20 h-1 bg-white transform rotate-45"></div>
            <div className="absolute top-3/4 right-1/4 w-1 h-16 bg-white transform -rotate-45"></div>
            <div className="absolute top-3/4 right-1/4 w-16 h-1 bg-white transform -rotate-45"></div>
          </div>
          
          {/* Subtle texture overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex items-center min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
            <div className="text-center">
              {/* Modern Healthcare Hero */}
              <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-black mb-8 leading-[0.85] text-white text-balance">
                Premium Healthcare
                <span className="block text-emerald-300">
                  at Your Doorstep
                </span>
              </h1>
              
              {/* Updated Subtitle */}
              <div className="max-w-4xl mx-auto mb-16">
                <p className="text-2xl sm:text-3xl lg:text-4xl font-light text-white leading-relaxed mb-8">
                  Experience premium in-home medical services with Calgary's most trusted healthcare professionals.
                </p>
                <p className="text-xl sm:text-2xl font-light text-white">
                  Safe. Convenient. Trusted.
                </p>
              </div>
              
              {/* Apple-style CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
                <Link href="/providers">
                  <Button size="lg" className="bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,44%)] text-white text-xl px-12 py-6 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                    Find Providers
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button size="lg" variant="outline" className="border-2 border-gray-300 hover:border-gray-400 text-gray-800 text-xl px-12 py-6 rounded-full font-semibold bg-white/80 backdrop-blur-sm transition-all duration-300">
                    Learn how it works
                  </Button>
                </Link>
              </div>

              {/* Clean search interface */}
              <div className="max-w-5xl mx-auto">
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-200/50">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label className="text-lg font-semibold text-gray-800">Service Type</Label>
                      <Select>
                        <SelectTrigger className="h-14 text-lg rounded-xl border-gray-200">
                          <SelectValue placeholder="All Services" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Services</SelectItem>
                          <SelectItem value="general-practice">General Practice</SelectItem>
                          <SelectItem value="nursing">Nursing Services</SelectItem>
                          <SelectItem value="physical-therapy">Physical Therapy</SelectItem>
                          <SelectItem value="occupational-therapy">Occupational Therapy</SelectItem>
                          <SelectItem value="palliative-care">Palliative Care</SelectItem>
                          <SelectItem value="lab-tests">Mobile Lab Tests</SelectItem>
                          <SelectItem value="mental-health">Mental Health</SelectItem>
                          <SelectItem value="vaccinations">Vaccinations</SelectItem>
                          <SelectItem value="dental-care">Dental Care</SelectItem>
                          <SelectItem value="hearing-services">Hearing Services</SelectItem>
                          <SelectItem value="vision-care">Vision Care</SelectItem>
                          <SelectItem value="podiatry">Podiatry</SelectItem>
                          <SelectItem value="speech-therapy">Speech Therapy</SelectItem>
                          <SelectItem value="nutrition">Nutrition</SelectItem>
                          <SelectItem value="pharmacy">Pharmacy</SelectItem>
                          <SelectItem value="iv-therapy">IV Therapy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-lg font-semibold text-gray-800">Date</Label>
                      <Input 
                        type="date" 
                        min={new Date().toISOString().split('T')[0]} 
                        className="h-14 text-lg rounded-xl border-gray-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-lg font-semibold text-gray-800">Location</Label>
                      <Input 
                        type="text" 
                        placeholder="Calgary, AB" 
                        className="h-14 text-lg rounded-xl border-gray-200"
                      />
                    </div>
                  </div>
                  <Link href="/providers">
                    <Button className="w-full mt-8 bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,44%)] text-xl py-6 rounded-xl font-semibold shadow-lg transition-all duration-300">
                      <Search className="mr-3 h-6 w-6" />
                      Find Healthcare Providers
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subtle scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-bounce"></div>
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

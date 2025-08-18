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
import { HeroSection } from "@/components/HeroSection";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <HeroSection 
        title="Healthcare<br/><span class='block text-white'>at your door</span>"
        subtitle="Connect with licensed healthcare providers in Calgary for professional in-home medical services."
        accentText="Safe. Convenient. Trusted."
        showSearchButton={false}
        isSignedIn={false}
      />

      {/* Search Section */}
      <section className="py-16 bg-gray-50 -mt-32 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <UserCheck className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Private Insurance</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Physical therapy sessions</li>
                <li>• Mental health counseling</li>
                <li>• Occupational therapy</li>
                <li>• Speech therapy services</li>
                <li>• Specialized nursing care</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Direct Pay Options</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Flexible payment plans</li>
                <li>• Transparent pricing</li>
                <li>• No hidden fees</li>
                <li>• Same-day availability</li>
                <li>• Premium comfort services</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">What Our Patients Say</h2>
            <p className="text-xl text-gray-600">Hear from Calgarians who trust MedLink for their healthcare needs</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Heart key={i} className="h-5 w-5 text-red-500 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "Dr. Sarah provided excellent care for my elderly mother. Professional, compassionate, and made the whole experience stress-free."
              </p>
              <div className="font-semibold text-gray-900">Margaret T.</div>
              <div className="text-gray-500 text-sm">Calgary, AB</div>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Heart key={i} className="h-5 w-5 text-red-500 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "Amazing service! The physical therapist helped me recover from my injury without having to leave my home. Highly recommend!"
              </p>
              <div className="font-semibold text-gray-900">David L.</div>
              <div className="text-gray-500 text-sm">Calgary, AB</div>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Heart key={i} className="h-5 w-5 text-red-500 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "Perfect for busy parents! The nurse came to our home for my daughter's vaccinations. Convenient and professional."
              </p>
              <div className="font-semibold text-gray-900">Jennifer K.</div>
              <div className="text-gray-500 text-sm">Calgary, AB</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold">MedLink</span>
              </div>
              <p className="text-gray-300 mb-4">
                Connecting Calgarians with trusted healthcare professionals for safe, convenient in-home medical services.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="h-6 w-6" />
                </a>
              </div>
            </div>
            
            <div className="col-span-1">
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
                <li><Link href="/apply" className="hover:text-white transition-colors">Become a Provider</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/support" className="hover:text-white transition-colors">Support Center</Link></li>
              </ul>
            </div>
            
            <div className="col-span-1">
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">HIPAA Compliance</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Insurance Coverage</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Accessibility</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm mb-4 md:mb-0">
                © 2025 MedLink House Calls. All rights reserved. Licensed healthcare professionals serving Calgary, Alberta.
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span>🍁 Proudly Canadian</span>
                <span>•</span>
                <span>Licensed & Insured</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
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
      
      {/* Hero Section - Apple Healthcare Style */}
      <section className="relative min-h-screen bg-white overflow-hidden">
        {/* High-quality healthcare imagery */}
        <div className="absolute inset-0 z-0">
          {/* Main healthcare image */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-white"></div>
          
          {/* Subtle geometric elements for visual interest */}
          <div className="absolute top-1/4 right-20 w-96 h-96 bg-blue-50 rounded-full mix-blend-multiply opacity-30"></div>
          <div className="absolute bottom-1/4 left-20 w-80 h-80 bg-green-50 rounded-full mix-blend-multiply opacity-30"></div>
        </div>

        {/* Content - Apple's minimal approach */}
        <div className="relative z-10 flex items-center min-h-screen">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              {/* Apple-style separated headline */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold mb-16 leading-[1.05] text-black tracking-tight">
                Make care
                <br />
                <span className="font-light">connected.</span>
                <br />
                <span className="font-light">personalized.</span>
                <br />
                <span className="font-light">human.</span>
              </h1>
              
              {/* Apple-style clean description */}
              <div className="max-w-4xl mx-auto mb-16">
                <p className="text-2xl sm:text-3xl text-gray-600 font-light leading-relaxed">
                  MedLink helps healthcare providers deliver more efficient care, connect with patients at home, and create personalized health experiences that are ultimately more human.
                </p>
              </div>
              
              {/* Clean, minimal CTA */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
                <Link href="/providers">
                  <Button size="lg" className="bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,44%)] text-white text-lg px-10 py-4 rounded-xl font-medium transition-all duration-200">
                    Find Providers
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button size="lg" variant="outline" className="border-2 border-gray-300 hover:border-gray-400 text-gray-800 text-lg px-10 py-4 rounded-xl font-medium transition-all duration-200">
                    Learn more
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three Pillars Section - Apple Style */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Connected Care */}
            <div className="text-center lg:text-left">
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-8 mx-auto lg:mx-0">
                <Activity className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-black mb-6 leading-tight">
                Connected Care
              </h2>
              <p className="text-xl text-gray-600 font-light leading-relaxed mb-8">
                Seamlessly connect patients with healthcare providers through our platform, enabling real-time communication and coordinated care delivery right at home.
              </p>
              <Link href="/providers">
                <Button variant="ghost" className="text-[hsl(207,90%,54%)] hover:text-[hsl(207,90%,44%)] font-medium text-lg p-0">
                  Explore providers →
                </Button>
              </Link>
            </div>

            {/* Personalized Service */}
            <div className="text-center lg:text-left">
              <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mb-8 mx-auto lg:mx-0">
                <UserCheck className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-black mb-6 leading-tight">
                Personalized Service
              </h2>
              <p className="text-xl text-gray-600 font-light leading-relaxed mb-8">
                Every care experience is tailored to individual needs, with providers who understand your health history and preferences for truly personalized healthcare.
              </p>
              <Link href="/services">
                <Button variant="ghost" className="text-[hsl(207,90%,54%)] hover:text-[hsl(207,90%,44%)] font-medium text-lg p-0">
                  View services →
                </Button>
              </Link>
            </div>

            {/* Human Touch */}
            <div className="text-center lg:text-left">
              <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mb-8 mx-auto lg:mx-0">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-black mb-6 leading-tight">
                Human Touch
              </h2>
              <p className="text-xl text-gray-600 font-light leading-relaxed mb-8">
                Technology enhances the human connection in healthcare. Our platform brings back the personal, compassionate care that makes all the difference.
              </p>
              <Link href="/about">
                <Button variant="ghost" className="text-[hsl(207,90%,54%)] hover:text-[hsl(207,90%,44%)] font-medium text-lg p-0">
                  Our story →
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

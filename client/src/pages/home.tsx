import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import ServiceCategories from "@/components/ServiceCategories";
import ProviderCard from "@/components/ProviderCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Activity, Heart, Calendar, MessageCircle, UserCheck, DollarSign } from "lucide-react";
import { MedlinkLogo } from "@/components/MedlinkLogo";
import Footer from "@/components/Footer";
import heroImage from "@assets/pexels-rdne-6149191_1753139300341.jpg";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function Home() {
  const { user } = useAuth();
  
  // Fetch real providers from API instead of using mock data
  const { data: providers = [], isLoading: providersLoading } = useQuery({
    queryKey: ["/api/providers"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/providers");
      return response.json();
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 overflow-hidden">
        {/* Background Image - Healthcare Professional */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage}
            alt="Healthcare professional providing medical examination and patient care"
            className="w-full h-full object-cover object-center"
          />
          {/* Medical-themed gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/85 via-blue-800/70 to-green-900/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 via-transparent to-green-800/40" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex items-center min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
            <div className="text-center">
              {/* Apple-style large headline - Personalized for logged-in users */}
              <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-black mb-8 leading-[0.85] text-white text-balance">
                Welcome back,
                <span className="block text-white">
                  {user?.firstName || "Patient"}
                </span>
              </h1>
              
              {/* Apple-style subtitle */}
              <div className="max-w-4xl mx-auto mb-16">
                <p className="text-2xl sm:text-3xl lg:text-4xl font-light text-white leading-relaxed mb-8">
                  Your trusted healthcare providers are ready to deliver professional in-home medical services.
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
                <Link href="/dashboard/patient">
                  <Button size="lg" variant="outline" className="border-2 border-gray-300 hover:border-gray-400 text-gray-800 text-xl px-12 py-6 rounded-full font-semibold bg-white/80 backdrop-blur-sm transition-all duration-300">
                    My Dashboard
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

      {/* Quick Stats */}
      {user?.userType === 'patient' && (
        <section className="py-8 -mt-8 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-[hsl(207,90%,54%)]" />
                    </div>
                    <div className="ml-4">
                      <div className="text-2xl font-bold text-gray-900">3</div>
                      <div className="text-sm text-gray-600">Upcoming</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <UserCheck className="h-6 w-6 text-[hsl(159,100%,34%)]" />
                    </div>
                    <div className="ml-4">
                      <div className="text-2xl font-bold text-gray-900">12</div>
                      <div className="text-sm text-gray-600">Completed</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <MessageCircle className="h-6 w-6 text-[hsl(259,78%,60%)]" />
                    </div>
                    <div className="ml-4">
                      <div className="text-2xl font-bold text-gray-900">5</div>
                      <div className="text-sm text-gray-600">Messages</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-orange-500" />
                    </div>
                    <div className="ml-4">
                      <div className="text-2xl font-bold text-gray-900">$1,250</div>
                      <div className="text-sm text-gray-600">Total Spent</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Quick Actions */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/providers">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-[hsl(207,90%,54%)]" />
                    Book Appointment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Find and book with verified healthcare providers</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/dashboard/patient">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageCircle className="h-5 w-5 mr-2 text-[hsl(159,100%,34%)]" />
                    My Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">View appointments, messages, and booking history</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/rapid-services">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <UserCheck className="h-5 w-5 mr-2 text-[hsl(259,78%,60%)]" />
                    Rapid Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Access rapid healthcare services with priority scheduling</p>
                </CardContent>
              </Card>
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
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Recommended for You</h2>
              <p className="text-xl text-gray-600">Based on your location and preferences</p>
            </div>
            <Link href="/providers">
              <Button className="hidden md:block bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,44%)]">
                View All Providers
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {providersLoading ? (
              // Show loading skeleton
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-white rounded-3xl p-6 shadow-lg animate-pulse">
                  <div className="h-56 bg-gray-200 rounded-t-3xl mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))
            ) : (
              providers.slice(0, 8).map((provider: any) => (
                <ProviderCard key={provider.id} provider={{
                  id: provider.id,
                  userId: provider.userId,
                  name: `${provider.firstName} ${provider.lastName}`,
                  specialty: provider.specialization,
                  experience: `${provider.yearsExperience} years exp.`,
                  rating: parseFloat(provider.rating) || 4.5,
                  reviewCount: provider.reviewCount || 0,
                  location: "Calgary, AB",
                  price: "Message Provider",
                  description: provider.bio || "Experienced healthcare provider offering quality in-home services.",
                  image: provider.profileImageUrl || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
                  verified: provider.isVerified || false,
                  tags: [provider.specialization],
                  rapidService: false
                }} />
              ))
            )}
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

      <Footer />
    </div>
  );
}

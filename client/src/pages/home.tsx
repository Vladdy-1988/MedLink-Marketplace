import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "wouter";
import Navigation from "@/components/Navigation";
import ServiceCategories from "@/components/ServiceCategories";
import ProviderCard from "@/components/ProviderCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Activity, Heart, Calendar, MessageCircle, UserCheck, DollarSign, CheckCircle, Sparkles } from "lucide-react";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    document.title = "Home — MedLink Marketplace";
  }, []);

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      if (user.userType === "provider") {
        setLocation("/dashboard/provider");
      } else if (user.userType === "admin") {
        setLocation("/dashboard/admin");
      }
      // patients stay on home page — it's their browse/discovery experience
    }
  }, [isLoading, isAuthenticated, user, setLocation]);
  
  // Fetch real providers from API instead of using mock data
  const { data: providers = [], isLoading: providersLoading } = useQuery({
    queryKey: ["/api/providers"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/providers");
      return response.json();
    },
  });

  return (
    <div className="min-h-screen bg-[#f7fbff]">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_14%,rgba(20,184,166,0.16),transparent_32%),radial-gradient(circle_at_88%_18%,rgba(96,165,250,0.22),transparent_34%),linear-gradient(180deg,#ffffff_0%,#f4faff_100%)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-white/75 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-teal-700 shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4" />
              House-call service marketplace
            </div>
            <h1 className="max-w-3xl text-5xl font-black leading-[0.95] tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
              Healthcare services
              <span className="block bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent">
                brought home.
              </span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600">
              Browse Calgary in-home care across nursing, mobile lab work, therapy, dental care, mental health, and wellness. Compare verified providers and book secure house-call visits from one place.
            </p>

            <div className="mt-7 grid gap-3 text-sm font-semibold text-slate-600 sm:grid-cols-3">
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-teal-500" />
                Safe
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-teal-500" />
                Convenient
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-teal-500" />
                Trusted
              </span>
            </div>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link href="/providers">
                <Button size="lg" className="rounded-full bg-teal-500 px-8 text-white shadow-[0_14px_32px_rgba(20,184,166,0.28)] hover:bg-teal-600">
                  Book a Service
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button size="lg" variant="outline" className="rounded-full border-sky-100 bg-white/80 px-8 text-slate-800 shadow-sm backdrop-blur hover:bg-white">
                  How it works
                </Button>
              </Link>
            </div>

            <div className="mt-10 max-w-4xl rounded-[1.75rem] border border-white/80 bg-white/90 p-5 shadow-[0_24px_70px_rgba(15,76,117,0.12)] backdrop-blur-xl sm:p-6">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-800">Service Type</Label>
                  <Select>
                    <SelectTrigger className="h-14 rounded-2xl border-sky-100 bg-white text-base">
                      <SelectValue placeholder="All Services" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Services</SelectItem>
                      <SelectItem value="general-practice">General Practice</SelectItem>
                      <SelectItem value="nursing">Nursing Services</SelectItem>
                      <SelectItem value="physiotherapy">Physiotherapy</SelectItem>
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
                  <Label className="text-sm font-bold text-slate-800">Date</Label>
                  <Input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    className="h-14 rounded-2xl border-sky-100 bg-white text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-800">Location</Label>
                  <Input
                    type="text"
                    placeholder="Calgary, AB"
                    className="h-14 rounded-2xl border-sky-100 bg-white text-base"
                  />
                </div>
              </div>
              <Link href="/providers">
                <Button className="mt-6 w-full rounded-2xl bg-blue-600 py-6 text-lg font-semibold shadow-lg shadow-blue-600/20 transition-all duration-300 hover:bg-blue-700">
                  <Search className="mr-3 h-5 w-5" />
                  Find Healthcare Providers
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative min-h-[360px] overflow-hidden rounded-[1.5rem] border border-white/90 bg-white shadow-[0_24px_70px_rgba(15,76,117,0.14)] sm:min-h-[460px]">
            <img
              src="/assets/medlink-housecall-care.png"
              alt="A clinician providing in-home healthcare to a patient"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-white/5 to-transparent" />
            <div className="absolute left-5 top-5 rounded-2xl border border-white/80 bg-white/90 p-4 shadow-[0_16px_42px_rgba(15,76,117,0.14)] backdrop-blur">
              <div className="grid grid-cols-3 gap-3 text-center">
                {["Verified", "Booked", "At home"].map((label) => (
                  <div key={label}>
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <div className="mt-2 text-sm font-black text-slate-700">{label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute bottom-5 left-5 rounded-2xl border border-white/80 bg-white/90 px-4 py-3 text-base font-bold text-blue-900 shadow-[0_16px_42px_rgba(15,76,117,0.14)] backdrop-blur sm:left-auto sm:right-5">
              House-call ready
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      {/* UI-only role check for display personalization. Server/API enforce real authorization. */}
      {user?.userType === 'patient' && (
        <section className="relative z-10 -mt-6 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="border-0 bg-white/90 shadow-[0_18px_45px_rgba(15,76,117,0.08)] backdrop-blur">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-2xl font-bold text-gray-900">3</div>
                      <div className="text-sm text-gray-600">Upcoming</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 bg-white/90 shadow-[0_18px_45px_rgba(15,76,117,0.08)] backdrop-blur">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center">
                      <UserCheck className="h-6 w-6 text-teal-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-2xl font-bold text-gray-900">12</div>
                      <div className="text-sm text-gray-600">Completed</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 bg-white/90 shadow-[0_18px_45px_rgba(15,76,117,0.08)] backdrop-blur">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center">
                      <MessageCircle className="h-6 w-6 text-sky-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-2xl font-bold text-gray-900">5</div>
                      <div className="text-sm text-gray-600">Messages</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 bg-white/90 shadow-[0_18px_45px_rgba(15,76,117,0.08)] backdrop-blur">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-amber-500" />
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
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/providers">
              <Card className="cursor-pointer rounded-3xl border-0 bg-white/90 shadow-[0_18px_45px_rgba(15,76,117,0.08)] transition-all hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,76,117,0.12)]">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                    Book Appointment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Find and book with verified healthcare providers</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/dashboard/patient">
              <Card className="cursor-pointer rounded-3xl border-0 bg-white/90 shadow-[0_18px_45px_rgba(15,76,117,0.08)] transition-all hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,76,117,0.12)]">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageCircle className="h-5 w-5 mr-2 text-teal-600" />
                    My Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">View appointments, messages, and booking history</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/rapid-services">
              <Card className="cursor-pointer rounded-3xl border-0 bg-white/90 shadow-[0_18px_45px_rgba(15,76,117,0.08)] transition-all hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,76,117,0.12)]">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <UserCheck className="h-5 w-5 mr-2 text-sky-600" />
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
      <section className="py-16 bg-[#f7fbff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Recommended for You</h2>
              <p className="text-xl text-gray-600">Based on your location and preferences</p>
            </div>
            <Link href="/providers">
              <Button className="hidden rounded-full bg-teal-500 px-6 text-white hover:bg-teal-600 md:block">
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
              <Button className="rounded-full bg-teal-500 px-6 text-white hover:bg-teal-600">
                View All Providers
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Insurance Coverage Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Insurance Coverage</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Many of our healthcare services are covered by Alberta Health Services and private insurance plans
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-[1.75rem] border border-sky-100 bg-white p-8 shadow-[0_18px_45px_rgba(15,76,117,0.08)] transition-shadow hover:shadow-[0_24px_60px_rgba(15,76,117,0.12)]">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
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
            
            <div className="rounded-[1.75rem] border border-teal-100 bg-white p-8 shadow-[0_18px_45px_rgba(15,76,117,0.08)] transition-shadow hover:shadow-[0_24px_60px_rgba(15,76,117,0.12)]">
              <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
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
            
            <div className="rounded-[1.75rem] border border-blue-100 bg-white p-8 shadow-[0_18px_45px_rgba(15,76,117,0.08)] transition-shadow hover:shadow-[0_24px_60px_rgba(15,76,117,0.12)]">
              <div className="w-16 h-16 bg-sky-500 rounded-full flex items-center justify-center mx-auto mb-6">
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



      <Footer />
    </div>
  );
}

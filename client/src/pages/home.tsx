import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import ServiceCategories from "@/components/ServiceCategories";
import ProviderCard from "@/components/ProviderCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { featuredProviders } from "@/lib/mockData";
import { Calendar, MessageCircle, UserCheck, DollarSign } from "lucide-react";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Welcome Section */}
      <section className="bg-gradient-to-r from-[hsl(207,90%,54%)] to-[hsl(259,78%,60%)] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl lg:text-5xl font-bold mb-4">
              Welcome back, {user?.firstName || "Patient"}!
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Ready to book your next healthcare appointment through MedLink?
            </p>
            <Link href="/providers">
              <Button size="lg" className="bg-white text-[hsl(207,90%,54%)] hover:bg-gray-100">
                Find Healthcare Providers
              </Button>
            </Link>
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
                  <p className="text-gray-600">Access urgent healthcare services with priority scheduling</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <ServiceCategories />

      {/* Featured Providers */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Recommended for You</h2>
              <p className="text-xl text-gray-600">Based on your location and preferences</p>
            </div>
            <Link href="/providers">
              <Button className="bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,44%)]">
                View All Providers
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProviders.slice(0, 3).map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

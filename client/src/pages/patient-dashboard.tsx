import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Link } from "wouter";
import {
  Calendar,
  MessageCircle,
  UserCheck,
  DollarSign,
  Clock,
  MapPin,
  Star,
  Settings,
  CreditCard,
  Users,
  Facebook,
  Twitter,
  Linkedin
} from "lucide-react";
import { MedlinkLogo } from "@/components/MedlinkLogo";
import Footer from "@/components/Footer";
import { MyProviders } from "@/components/dashboard/MyProviders";
import { Billing } from "@/components/dashboard/Billing";
import { EnhancedMessages } from "@/components/dashboard/EnhancedMessages";
import { EnhancedSettings } from "@/components/dashboard/EnhancedSettings";

export default function PatientDashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'appointments' | 'providers' | 'messages' | 'billing' | 'settings'>('appointments');

  // Redirect away if not authenticated or if the wrong role lands here.
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || (user && user.userType !== 'patient'))) {
      if (!isAuthenticated) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
      }

      window.location.href = user?.userType === 'provider'
        ? '/dashboard/provider'
        : user?.userType === 'admin'
        ? '/dashboard/admin'
        : '/api/login';
      return;
    }
  }, [isAuthenticated, authLoading, user, toast]);

  const { data: bookings, isLoading: bookingsLoading, error: bookingsError } = useQuery({
    queryKey: ["/api/bookings/patient", user?.id],
    enabled: !!user?.id && isAuthenticated && user?.userType === 'patient',
  });

  // Handle booking errors
  useEffect(() => {
    if (bookingsError && isUnauthorizedError(bookingsError as Error)) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [bookingsError, toast]);

  const { data: conversations, isLoading: conversationsLoading, error: conversationsError } = useQuery({
    queryKey: ["/api/conversations", user?.id],
    enabled: !!user?.id && isAuthenticated && user?.userType === 'patient',
  });

  // Handle conversation errors
  useEffect(() => {
    if (conversationsError && isUnauthorizedError(conversationsError as Error)) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [conversationsError, toast]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-8 w-64 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <Skeleton className="h-96 w-full" />
            </div>
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user || user.userType !== 'patient') {
    return null;
  }

  const getBookingStatusBadgeClass = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusBadgeClass = (paymentStatus: string) => {
    switch (paymentStatus) {
      case "paid":
        return "bg-emerald-100 text-emerald-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const upcomingBookings = (bookings as any[])?.filter((booking: any) =>
    booking.status !== 'cancelled' &&
    booking.status !== 'completed' &&
    new Date(booking.scheduledDate) > new Date()
  ) || [];
  
  const completedBookings = (bookings as any[])?.filter((booking: any) => 
    booking.status === 'completed'
  ) || [];

  const totalProviders = new Set((bookings as any[])?.map((booking: any) => booking.providerId) || []).size;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.firstName || "Patient"}!
          </h1>
          <p className="text-gray-600">Manage your appointments and healthcare providers</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <nav className="space-y-2">
                  <div 
                    className={`flex items-center px-4 py-3 rounded-lg cursor-pointer transition-colors ${
                      activeTab === 'appointments' 
                        ? 'text-[hsl(207,90%,54%)] bg-blue-50' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveTab('appointments')}
                    data-testid="appointments-tab"
                  >
                    <Calendar className="h-5 w-5 mr-3" />
                    My Appointments
                  </div>
                  <div 
                    className={`flex items-center px-4 py-3 rounded-lg cursor-pointer transition-colors ${
                      activeTab === 'providers' 
                        ? 'text-[hsl(207,90%,54%)] bg-blue-50' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveTab('providers')}
                    data-testid="providers-tab"
                  >
                    <Users className="h-5 w-5 mr-3" />
                    My Providers
                  </div>
                  <div 
                    className={`flex items-center px-4 py-3 rounded-lg cursor-pointer transition-colors ${
                      activeTab === 'messages' 
                        ? 'text-[hsl(207,90%,54%)] bg-blue-50' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveTab('messages')}
                    data-testid="messages-tab"
                  >
                    <MessageCircle className="h-5 w-5 mr-3" />
                    Messages
                  </div>
                  <div 
                    className={`flex items-center px-4 py-3 rounded-lg cursor-pointer transition-colors ${
                      activeTab === 'billing' 
                        ? 'text-[hsl(207,90%,54%)] bg-blue-50' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveTab('billing')}
                    data-testid="billing-tab"
                  >
                    <CreditCard className="h-5 w-5 mr-3" />
                    Billing
                  </div>
                  <div 
                    className={`flex items-center px-4 py-3 rounded-lg cursor-pointer transition-colors ${
                      activeTab === 'settings' 
                        ? 'text-[hsl(207,90%,54%)] bg-blue-50' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveTab('settings')}
                    data-testid="settings-tab"
                  >
                    <Settings className="h-5 w-5 mr-3" />
                    Settings
                  </div>
                </nav>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'appointments' && (
              <>
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-[hsl(207,90%,54%)]" />
                        </div>
                        <div className="ml-4">
                          <div className="text-2xl font-bold text-gray-900">
                            {bookingsLoading ? <Skeleton className="h-6 w-8" /> : upcomingBookings.length}
                          </div>
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
                          <div className="text-2xl font-bold text-gray-900">
                            {bookingsLoading ? <Skeleton className="h-6 w-8" /> : completedBookings.length}
                          </div>
                          <div className="text-sm text-gray-600">Completed</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Users className="h-6 w-6 text-[hsl(259,78%,60%)]" />
                        </div>
                        <div className="ml-4">
                          <div className="text-2xl font-bold text-gray-900">
                            {bookingsLoading ? <Skeleton className="h-6 w-8" /> : totalProviders}
                          </div>
                          <div className="text-sm text-gray-600">Providers Used</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Upcoming Appointments */}
                <Card className="mb-8">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Upcoming Appointments</CardTitle>
                      <Link href="/providers">
                        <Button className="bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,44%)]">
                          Book New
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {bookingsLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-start space-x-4 p-4">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="flex-1 space-y-2">
                              <Skeleton className="h-4 w-32" />
                              <Skeleton className="h-3 w-48" />
                              <Skeleton className="h-3 w-24" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : upcomingBookings.length === 0 ? (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">No upcoming appointments</p>
                        <Link href="/providers">
                          <Button className="bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,44%)]">
                            Book Your First Appointment
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-200">
                        {upcomingBookings.map((booking: any) => (
                          <div key={booking.id} className="p-6 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start">
                                <div className="w-12 h-12 bg-[hsl(207,90%,54%)] rounded-full flex items-center justify-center text-white font-semibold">
                                  {booking.provider?.name?.charAt(0) || 'P'}
                                </div>
                                <div className="ml-4">
                                  <h3 className="font-semibold text-gray-900">
                                    {booking.provider?.name || 'Healthcare Provider'}
                                  </h3>
                                  <p className="text-gray-600">{booking.service?.name || 'Healthcare Service'}</p>
                                  <div className="flex items-center mt-2 text-sm text-gray-500">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    {new Date(booking.scheduledDate).toLocaleDateString()} at {new Date(booking.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </div>
                                  <div className="flex items-center mt-1 text-sm text-gray-500">
                                    <MapPin className="h-4 w-4 mr-2" />
                                    {booking.patientAddress}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge
                                  variant="secondary"
                                  className={getBookingStatusBadgeClass(booking.status)}
                                >
                                  {booking.status}
                                </Badge>
                                <Badge
                                  variant="secondary"
                                  className={getPaymentStatusBadgeClass(booking.paymentStatus)}
                                >
                                  {booking.paymentStatus || "unpaid"}
                                </Badge>
                                <Button size="sm" variant="ghost">
                                  <MessageCircle className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Recent Messages */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Messages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {conversationsLoading ? (
                      <div className="space-y-4">
                        {[1, 2].map((i) => (
                          <div key={i} className="flex items-start space-x-4 p-4">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="flex-1 space-y-2">
                              <div className="flex justify-between">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-3 w-16" />
                              </div>
                              <Skeleton className="h-3 w-full" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (conversations as any[])?.length === 0 ? (
                      <div className="text-center py-8">
                        <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No messages yet</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-200">
                    {(conversations as any[])?.slice(0, 3).map((conversation: any, index: number) => (
                      <div key={index} className="p-6 hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className="flex items-start">
                          <div className="w-10 h-10 bg-[hsl(207,90%,54%)] rounded-full flex items-center justify-center text-white font-semibold">
                            P
                          </div>
                          <div className="ml-4 flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-gray-900">Healthcare Provider</h4>
                              <span className="text-sm text-gray-500">
                                {conversation.lastMessageTime ? new Date(conversation.lastMessageTime).toLocaleDateString() : 'Recently'}
                              </span>
                            </div>
                            <p className="text-gray-600 mt-1">
                              {conversation.lastMessage || 'Start a conversation with your provider'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
              </>
            )}

            {activeTab === 'providers' && <MyProviders />}
            {activeTab === 'messages' && <EnhancedMessages />}
            {activeTab === 'billing' && <Billing />}
            {activeTab === 'settings' && <EnhancedSettings />}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

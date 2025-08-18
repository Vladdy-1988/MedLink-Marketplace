import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import {
  Calendar,
  MessageCircle,
  DollarSign,
  Star,
  Settings,
  Users,
  TrendingUp,
  Clock,
  MapPin,
  BarChart3
} from "lucide-react";

export default function ProviderDashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  // Redirect to home if not authenticated or not a provider
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.userType !== 'provider')) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, authLoading, user, toast]);

  const { data: provider, isLoading: providerLoading, error: providerError } = useQuery({
    queryKey: ["/api/providers/user", user?.id],
    enabled: !!user?.id && user?.userType === 'provider' && isAuthenticated,
  });

  // Handle provider errors
  useEffect(() => {
    if (providerError && isUnauthorizedError(providerError as Error)) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [providerError, toast]);

  const { data: bookings, isLoading: bookingsLoading, error: bookingsError } = useQuery({
    queryKey: ["/api/bookings/provider", (provider as any)?.id],
    enabled: !!(provider as any)?.id && isAuthenticated,
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

  if (authLoading || providerLoading) {
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Skeleton className="h-24 w-full" />
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

  if (!isAuthenticated || user?.userType !== 'provider' || !provider) {
    return null;
  }

  const thisWeekBookings = (bookings as any[])?.filter((booking: any) => {
    const bookingDate = new Date(booking.scheduledDate);
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    const weekEnd = new Date(now.setDate(now.getDate() - now.getDay() + 6));
    return bookingDate >= weekStart && bookingDate <= weekEnd;
  }) || [];

  const completedBookings = (bookings as any[])?.filter((booking: any) => 
    booking.status === 'completed'
  ) || [];

  const totalPatients = new Set((bookings as any[])?.map((booking: any) => booking.patientId) || []).size;
  
  const thisMonthEarnings = completedBookings
    .filter((booking: any) => {
      const bookingDate = new Date(booking.scheduledDate);
      const now = new Date();
      return bookingDate.getMonth() === now.getMonth() && bookingDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum: number, booking: any) => sum + parseFloat(booking.totalAmount || 0), 0);

  const todayBookings = (bookings as any[])?.filter((booking: any) => {
    const bookingDate = new Date(booking.scheduledDate);
    const today = new Date();
    return bookingDate.toDateString() === today.toDateString();
  }) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Provider Dashboard</h1>
          <p className="text-gray-600">Manage your practice and patient appointments</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <nav className="space-y-2">
                  <div className="flex items-center px-4 py-3 text-[hsl(207,90%,54%)] bg-blue-50 rounded-lg">
                    <BarChart3 className="h-5 w-5 mr-3" />
                    Overview
                  </div>
                  <div className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <Calendar className="h-5 w-5 mr-3" />
                    Appointments
                  </div>
                  <div className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <Users className="h-5 w-5 mr-3" />
                    Profile
                  </div>
                  <div className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <DollarSign className="h-5 w-5 mr-3" />
                    Earnings
                  </div>
                  <div className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <MessageCircle className="h-5 w-5 mr-3" />
                    Messages
                  </div>
                  <div className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <Settings className="h-5 w-5 mr-3" />
                    Settings
                  </div>
                </nav>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Provider Status */}
            {!(provider as any)?.isApproved && (
              <Card className="mb-8 border-orange-200 bg-orange-50">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Clock className="h-6 w-6 text-orange-600 mr-3" />
                    <div>
                      <h3 className="font-semibold text-orange-900">Application Under Review</h3>
                      <p className="text-orange-700 text-sm">
                        Your provider application is being reviewed. You'll be notified once approved.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-[hsl(207,90%,54%)]" />
                    </div>
                    <div className="ml-4">
                      <div className="text-2xl font-bold text-gray-900">
                        {bookingsLoading ? <Skeleton className="h-6 w-8" /> : thisWeekBookings.length}
                      </div>
                      <div className="text-sm text-gray-600">This Week</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Users className="h-6 w-6 text-[hsl(159,100%,34%)]" />
                    </div>
                    <div className="ml-4">
                      <div className="text-2xl font-bold text-gray-900">
                        {bookingsLoading ? <Skeleton className="h-6 w-8" /> : totalPatients}
                      </div>
                      <div className="text-sm text-gray-600">Total Patients</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Star className="h-6 w-6 text-yellow-500" />
                    </div>
                    <div className="ml-4">
                      <div className="text-2xl font-bold text-gray-900">
                        {(provider as any)?.rating || '0.0'}
                      </div>
                      <div className="text-sm text-gray-600">Rating</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-[hsl(259,78%,60%)]" />
                    </div>
                    <div className="ml-4">
                      <div className="text-2xl font-bold text-gray-900">
                        {bookingsLoading ? <Skeleton className="h-6 w-12" /> : `$${thisMonthEarnings.toFixed(0)}`}
                      </div>
                      <div className="text-sm text-gray-600">This Month</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Today's Schedule */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                {bookingsLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="flex items-center justify-between p-4">
                        <div className="flex items-center">
                          <Skeleton className="w-4 h-4 rounded-full mr-4" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-48" />
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : todayBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No appointments scheduled for today</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {todayBookings.map((booking: any) => (
                      <div key={booking.id} className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-4 h-4 bg-[hsl(207,90%,54%)] rounded-full mr-4"></div>
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {booking.patient?.firstName} {booking.patient?.lastName}
                              </h3>
                              <p className="text-gray-600">
                                {booking.service?.name} • {booking.patientAddress}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-gray-900">
                              {new Date(booking.scheduledDate).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })} - {new Date(new Date(booking.scheduledDate).getTime() + booking.duration * 60000).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </div>
                            <div className="text-sm text-gray-500">
                              {Math.floor((new Date(booking.scheduledDate).getTime() - new Date().getTime()) / (1000 * 60 * 60))} hours
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Earnings Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-600">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4" />
                    <p>Earnings Chart Component</p>
                    <p className="text-sm mt-2">Total this month: ${thisMonthEarnings.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
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
  BarChart3,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from "lucide-react";

export default function ProviderDashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Redirect to home if not authenticated or not a provider
  useEffect(() => {
    // UI-only role check for dashboard routing. Server/API enforce real authorization.
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
    // UI-only role check for query gating. Server/API enforce real authorization.
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

  const providerId = (provider as any)?.id;

  const { data: services } = useQuery<any[]>({
    queryKey: ["/api/providers", providerId, "services"],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/providers/${providerId}/services`);
      return res.json();
    },
    enabled: !!providerId,
  });

  const { data: availability } = useQuery<any[]>({
    queryKey: ["/api/providers", providerId, "availability"],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/providers/${providerId}/availability`);
      return res.json();
    },
    enabled: !!providerId,
  });

  const needsService = (provider as any)?.isApproved && Array.isArray(services) && services.length === 0;
  const needsAvailability = (provider as any)?.isApproved && Array.isArray(availability) && availability.length === 0;
  const showOnboarding = needsService || needsAvailability;

  // Service form state
  const [serviceOpen, setServiceOpen] = useState(false);
  const [serviceName, setServiceName] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [serviceDuration, setServiceDuration] = useState("60");
  const [serviceCategory, setServiceCategory] = useState("general");

  // Availability form state
  const [availOpen, setAvailOpen] = useState(false);
  const [availDay, setAvailDay] = useState("1");
  const [availStart, setAvailStart] = useState("09:00");
  const [availEnd, setAvailEnd] = useState("17:00");

  const addServiceMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/services", {
        providerId,
        name: serviceName,
        price: servicePrice,
        duration: Number(serviceDuration),
        category: serviceCategory,
      });
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Service added", description: `"${serviceName}" is now listed on your profile.` });
      setServiceOpen(false);
      setServiceName(""); setServicePrice(""); setServiceDuration("60"); setServiceCategory("general");
      queryClient.invalidateQueries({ queryKey: ["/api/providers", providerId, "services"] });
    },
    onError: () => toast({ title: "Failed to add service", variant: "destructive" }),
  });

  const addAvailabilityMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/providers/${providerId}/availability`, {
        dayOfWeek: Number(availDay),
        startTime: availStart,
        endTime: availEnd,
        isAvailable: true,
      });
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Availability set", description: "Patients can now see your open slots." });
      setAvailOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/providers", providerId, "availability"] });
    },
    onError: () => toast({ title: "Failed to set availability", variant: "destructive" }),
  });

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

  // UI-only role check for rendering. Server/API enforce real authorization.
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

  const upcomingBookings = (bookings as any[])?.filter((booking: any) =>
    booking.status !== 'cancelled' &&
    new Date(booking.scheduledDate) >= new Date()
  ) || [];

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

            {/* Setup Onboarding Banner */}
            {showOnboarding && (
              <Card className="mb-8 border-blue-200 bg-blue-50">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <AlertCircle className="h-5 w-5 text-blue-600 mr-2 shrink-0" />
                    <h3 className="font-semibold text-blue-900">Complete your setup to accept bookings</h3>
                  </div>
                  <div className="space-y-4">
                    {/* Step 1: Add a service */}
                    <div className={`rounded-lg border p-4 bg-white ${!needsService ? "opacity-60" : ""}`}>
                      <button
                        className="flex items-center justify-between w-full text-left"
                        onClick={() => needsService && setServiceOpen((v) => !v)}
                        disabled={!needsService}
                      >
                        <div className="flex items-center gap-2">
                          {needsService
                            ? <div className="w-6 h-6 rounded-full border-2 border-blue-500 flex items-center justify-center text-xs font-bold text-blue-600">1</div>
                            : <CheckCircle2 className="w-6 h-6 text-green-500" />}
                          <span className="font-medium text-gray-900">Add your first service</span>
                          {!needsService && <Badge className="bg-green-100 text-green-800 text-xs ml-2">Done</Badge>}
                        </div>
                        {needsService && (serviceOpen ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />)}
                      </button>
                      {needsService && serviceOpen && (
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs text-gray-600 mb-1 block">Service Name</Label>
                            <Input placeholder="e.g. Home Consultation" value={serviceName} onChange={(e) => setServiceName(e.target.value)} />
                          </div>
                          <div>
                            <Label className="text-xs text-gray-600 mb-1 block">Price (CAD)</Label>
                            <Input type="number" placeholder="120" value={servicePrice} onChange={(e) => setServicePrice(e.target.value)} />
                          </div>
                          <div>
                            <Label className="text-xs text-gray-600 mb-1 block">Duration (minutes)</Label>
                            <Input type="number" placeholder="60" value={serviceDuration} onChange={(e) => setServiceDuration(e.target.value)} />
                          </div>
                          <div>
                            <Label className="text-xs text-gray-600 mb-1 block">Category</Label>
                            <select
                              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                              value={serviceCategory}
                              onChange={(e) => setServiceCategory(e.target.value)}
                            >
                              <option value="general">General</option>
                              <option value="preventive">Preventive</option>
                              <option value="rapid">Rapid / Urgent</option>
                              <option value="management">Chronic Management</option>
                              <option value="specialist">Specialist</option>
                            </select>
                          </div>
                          <div className="md:col-span-2 flex justify-end">
                            <Button
                              size="sm"
                              onClick={() => addServiceMutation.mutate()}
                              disabled={!serviceName || !servicePrice || addServiceMutation.isPending}
                              className="bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,44%)]"
                            >
                              {addServiceMutation.isPending ? "Saving..." : "Add Service"}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Step 2: Set availability */}
                    <div className={`rounded-lg border p-4 bg-white ${!needsAvailability ? "opacity-60" : ""}`}>
                      <button
                        className="flex items-center justify-between w-full text-left"
                        onClick={() => needsAvailability && setAvailOpen((v) => !v)}
                        disabled={!needsAvailability}
                      >
                        <div className="flex items-center gap-2">
                          {needsAvailability
                            ? <div className="w-6 h-6 rounded-full border-2 border-blue-500 flex items-center justify-center text-xs font-bold text-blue-600">2</div>
                            : <CheckCircle2 className="w-6 h-6 text-green-500" />}
                          <span className="font-medium text-gray-900">Set your availability</span>
                          {!needsAvailability && <Badge className="bg-green-100 text-green-800 text-xs ml-2">Done</Badge>}
                        </div>
                        {needsAvailability && (availOpen ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />)}
                      </button>
                      {needsAvailability && availOpen && (
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <Label className="text-xs text-gray-600 mb-1 block">Day of Week</Label>
                            <select
                              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                              value={availDay}
                              onChange={(e) => setAvailDay(e.target.value)}
                            >
                              <option value="0">Sunday</option>
                              <option value="1">Monday</option>
                              <option value="2">Tuesday</option>
                              <option value="3">Wednesday</option>
                              <option value="4">Thursday</option>
                              <option value="5">Friday</option>
                              <option value="6">Saturday</option>
                            </select>
                          </div>
                          <div>
                            <Label className="text-xs text-gray-600 mb-1 block">Start Time</Label>
                            <Input type="time" value={availStart} onChange={(e) => setAvailStart(e.target.value)} />
                          </div>
                          <div>
                            <Label className="text-xs text-gray-600 mb-1 block">End Time</Label>
                            <Input type="time" value={availEnd} onChange={(e) => setAvailEnd(e.target.value)} />
                          </div>
                          <div className="md:col-span-3 flex justify-end">
                            <Button
                              size="sm"
                              onClick={() => addAvailabilityMutation.mutate()}
                              disabled={addAvailabilityMutation.isPending}
                              className="bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,44%)]"
                            >
                              {addAvailabilityMutation.isPending ? "Saving..." : "Save Availability"}
                            </Button>
                          </div>
                        </div>
                      )}
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
            
            {/* Upcoming Appointments */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
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
                ) : upcomingBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No upcoming appointments scheduled</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {upcomingBookings.slice(0, 5).map((booking: any) => (
                      <div key={booking.id} className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-4 h-4 bg-[hsl(207,90%,54%)] rounded-full mr-4"></div>
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {booking.patient?.firstName && booking.patient?.lastName
                                  ? `${booking.patient.firstName} ${booking.patient.lastName}`
                                  : "Patient appointment"}
                              </h3>
                              <p className="text-gray-600">
                                {booking.service?.name || "Healthcare Service"} • {booking.patientAddress}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-gray-900">
                              {new Date(booking.scheduledDate).toLocaleDateString()} at{" "}
                              {new Date(booking.scheduledDate).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                            <div className="mt-2 flex justify-end gap-2">
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

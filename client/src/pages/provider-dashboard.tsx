import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import { serviceCategories } from "@/lib/serviceCatalog";
import { ProviderCalendar } from "@/components/calendar/ProviderCalendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import {
  AlertCircle,
  BarChart3,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  DollarSign,
  ExternalLink,
  FileText,
  MapPin,
  MessageCircle,
  Settings,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";

type DashboardTab =
  | "overview"
  | "appointments"
  | "profile"
  | "earnings"
  | "messages"
  | "settings";

const dashboardTabs: Array<{
  id: DashboardTab;
  label: string;
  icon: typeof BarChart3;
}> = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "appointments", label: "Appointments", icon: Calendar },
  { id: "profile", label: "Profile", icon: Users },
  { id: "earnings", label: "Earnings", icon: DollarSign },
  { id: "messages", label: "Messages", icon: MessageCircle },
  { id: "settings", label: "Settings", icon: Settings },
];

const CALGARY_AREAS = [
  "Calgary NW",
  "Calgary NE",
  "Calgary SW",
  "Calgary SE",
  "Calgary Downtown",
  "Cochrane",
  "Airdrie",
  "Okotoks",
];

const INSURANCE_OPTIONS = [
  "Alberta Blue Cross",
  "Sun Life",
  "Manulife",
  "Great-West Life",
  "Canada Life",
  "Desjardins",
  "Industrial Alliance",
  "Green Shield",
  "Chambers of Commerce",
  "No insurance (self-pay only)",
];

function formatDay(dayOfWeek: number) {
  return [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ][dayOfWeek] ?? "Unknown";
}

export default function ProviderDashboard() {
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");

  const [serviceOpen, setServiceOpen] = useState(false);
  const [serviceName, setServiceName] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [serviceDuration, setServiceDuration] = useState("60");
  const [serviceCategory, setServiceCategory] = useState("general");

  const [availOpen, setAvailOpen] = useState(false);
  const [availDay, setAvailDay] = useState("1");

  useEffect(() => {
    document.title = "Provider Dashboard — MedLink Marketplace";
  }, []);
  const [availStart, setAvailStart] = useState("09:00");
  const [availEnd, setAvailEnd] = useState("17:00");

  const wrongRole =
    !authLoading &&
    isAuthenticated &&
    user?.userType !== "provider";

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [authLoading, isAuthenticated, toast]);

  useEffect(() => {
    if (!wrongRole || !user) {
      return;
    }

    const redirectTarget =
      user.userType === "patient"
        ? "/dashboard/patient"
        : user.userType === "admin"
          ? "/dashboard/admin"
          : "/";

    const timeout = setTimeout(() => {
      window.location.href = redirectTarget;
    }, 2000);

    return () => clearTimeout(timeout);
  }, [wrongRole, user]);

  const {
    data: provider,
    isLoading: providerLoading,
    error: providerError,
  } = useQuery({
    queryKey: ["/api/providers/me"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/providers/me");
      return res.json();
    },
    enabled: !!isAuthenticated && user?.userType === "provider",
  });

  const providerId = (provider as any)?.id;
  const [profileForm, setProfileForm] = useState({
    specialization: (provider as any)?.specialization || "",
    bio: (provider as any)?.bio || "",
    basePricing: (provider as any)?.basePricing || "",
    serviceAreas: ((provider as any)?.serviceAreas as string[]) || [],
    insuranceAccepted: ((provider as any)?.insuranceAccepted as string[]) || [],
    yearsExperience: (provider as any)?.yearsExperience || 0,
  });

  const {
    data: bookings = [],
    isLoading: bookingsLoading,
    error: bookingsError,
  } = useQuery<any[]>({
    queryKey: ["/api/bookings/provider", providerId],
    enabled: !!providerId && isAuthenticated,
  });

  const { data: services = [] } = useQuery<any[]>({
    queryKey: ["/api/providers", providerId, "services"],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/providers/${providerId}/services`);
      return res.json();
    },
    enabled: !!providerId,
  });

  const { data: availability = [] } = useQuery<any[]>({
    queryKey: ["/api/providers", providerId, "availability"],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/providers/${providerId}/availability`);
      return res.json();
    },
    enabled: !!providerId,
  });

  const { data: conversations = [] } = useQuery<any[]>({
    queryKey: ["/api/conversations", user?.id],
    enabled: !!user?.id && isAuthenticated,
  });

  const { data: connectStatus } = useQuery<{
    connected: boolean;
    chargesEnabled: boolean;
  }>({
    queryKey: ["/api/connect/status"],
    queryFn: () => apiRequest("GET", "/api/connect/status").then((r) => r.json()),
    enabled: !!provider,
  });

  const { data: earningsData } = useQuery<{
    totalEarned: number;
    pendingTransfers: number;
    bookings: any[];
  }>({
    queryKey: ["/api/providers/earnings"],
    queryFn: () =>
      apiRequest("GET", "/api/providers/earnings").then((r) => r.json()),
    enabled: !!provider,
  });

  useEffect(() => {
    if (provider) {
      setProfileForm({
        specialization: (provider as any).specialization || "",
        bio: (provider as any).bio || "",
        basePricing: (provider as any).basePricing || "",
        serviceAreas: ((provider as any).serviceAreas as string[]) || [],
        insuranceAccepted: ((provider as any).insuranceAccepted as string[]) || [],
        yearsExperience: (provider as any).yearsExperience || 0,
      });
    }
  }, [provider]);

  useEffect(() => {
    if (
      providerError &&
      isUnauthorizedError(providerError as Error)
    ) {
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

  useEffect(() => {
    if (
      bookingsError &&
      isUnauthorizedError(bookingsError as Error)
    ) {
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
      toast({
        title: "Service added",
        description: `"${serviceName}" is now listed on your profile.`,
      });
      setServiceOpen(false);
      setServiceName("");
      setServicePrice("");
      setServiceDuration("60");
      setServiceCategory("general");
      queryClient.invalidateQueries({
        queryKey: ["/api/providers", providerId, "services"],
      });
    },
    onError: () => {
      toast({
        title: "Failed to add service",
        variant: "destructive",
      });
    },
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
      toast({
        title: "Availability set",
        description: "Patients can now see your open slots.",
      });
      setAvailOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["/api/providers", providerId, "availability"],
      });
    },
    onError: () => {
      toast({
        title: "Failed to set availability",
        variant: "destructive",
      });
    },
  });

  const saveProfileMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("PATCH", `/api/providers/${provider?.id}`, profileForm);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/providers/me"] });
      toast({ title: "Profile saved", description: "Your profile has been updated." });
    },
    onError: () => {
      toast({ title: "Save failed", description: "Please try again.", variant: "destructive" });
    },
  });

  const handleConnectOnboard = async () => {
    try {
      const res = await apiRequest("POST", "/api/connect/onboard");
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch (err) {
      toast({
        title: "Error",
        description: "Could not start Stripe onboarding.",
        variant: "destructive",
      });
    }
  };

  if (authLoading || providerLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Skeleton className="mb-8 h-8 w-64" />
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            <Skeleton className="h-96 w-full" />
            <div className="space-y-6 lg:col-span-3">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-24 w-full" />
                ))}
              </div>
              <Skeleton className="h-72 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (wrongRole && user) {
    const destinationLabel =
      user.userType === "patient"
        ? "patient dashboard"
        : user.userType === "admin"
          ? "admin dashboard"
          : "home page";

    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="mx-auto flex max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
          <Card className="w-full border-amber-200 bg-amber-50">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <AlertCircle className="mt-1 h-6 w-6 text-amber-600" />
                <div>
                  <h1 className="text-2xl font-bold text-amber-950">
                    Access Denied
                  </h1>
                  <p className="mt-2 text-amber-800">
                    This area is restricted to providers. You are signed in, but
                    you do not have provider access.
                  </p>
                  <p className="mt-3 text-sm text-amber-700">
                    Redirecting you to the {destinationLabel}.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !provider) {
    return null;
  }

  const today = new Date();
  const todayKey = today.toDateString();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const bookingsList = bookings as any[];
  const todayBookings = bookingsList.filter(
    (booking) =>
      new Date(booking.scheduledDate).toDateString() === todayKey,
  );
  const thisWeekBookings = bookingsList.filter((booking) => {
    const bookingDate = new Date(booking.scheduledDate);
    return bookingDate >= startOfWeek && bookingDate <= endOfWeek;
  });
  const upcomingBookings = bookingsList
    .filter(
      (booking) =>
        booking.status !== "cancelled" &&
        new Date(booking.scheduledDate) >= new Date(),
    )
    .sort(
      (a, b) =>
        new Date(a.scheduledDate).getTime() -
        new Date(b.scheduledDate).getTime(),
    );
  const completedBookings = bookingsList.filter(
    (booking) => booking.status === "completed",
  );
  const totalPatients = new Set(
    bookingsList.map((booking) => booking.patientId).filter(Boolean),
  ).size;
  const thisMonthEarnings = completedBookings
    .filter((booking) => {
      const bookingDate = new Date(booking.scheduledDate);
      return (
        bookingDate.getMonth() === today.getMonth() &&
        bookingDate.getFullYear() === today.getFullYear()
      );
    })
    .reduce(
      (sum, booking) => sum + parseFloat(String(booking.totalAmount || 0)),
      0,
    );
  const allTimeEarnings = completedBookings.reduce(
    (sum, booking) => sum + parseFloat(String(booking.totalAmount || 0)),
    0,
  );
  const averageBookingValue =
    completedBookings.length > 0
      ? allTimeEarnings / completedBookings.length
      : 0;
  const needsService =
    (provider as any)?.isApproved &&
    Array.isArray(services) &&
    services.length === 0;
  const needsAvailability =
    (provider as any)?.isApproved &&
    Array.isArray(availability) &&
    availability.length === 0;
  const showOnboarding = needsService || needsAvailability;
  const providerLocation =
    Array.isArray((provider as any)?.serviceAreas) &&
    (provider as any).serviceAreas.length > 0
      ? (provider as any).serviceAreas.join(" • ")
      : "Calgary, AB";

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

  const renderSetupBanner = () => {
    if (!showOnboarding) {
      return null;
    }

    return (
      <Card className="mb-8 border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center">
            <AlertCircle className="mr-2 h-5 w-5 shrink-0 text-blue-600" />
            <h3 className="font-semibold text-blue-900">
              Complete your setup to accept bookings
            </h3>
          </div>
          <div className="space-y-4">
            <div
              className={`rounded-lg border bg-white p-4 ${
                !needsService ? "opacity-60" : ""
              }`}
            >
              <button
                type="button"
                className="flex w-full items-center justify-between text-left"
                onClick={() => needsService && setServiceOpen((value) => !value)}
                disabled={!needsService}
              >
                <div className="flex items-center gap-2">
                  {needsService ? (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-blue-500 text-xs font-bold text-blue-600">
                      1
                    </div>
                  ) : (
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  )}
                  <span className="font-medium text-gray-900">
                    Add your first service
                  </span>
                  {!needsService && (
                    <Badge className="ml-2 bg-green-100 text-green-800 text-xs">
                      Done
                    </Badge>
                  )}
                </div>
                {needsService &&
                  (serviceOpen ? (
                    <ChevronUp className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  ))}
              </button>
              {needsService && serviceOpen && (
                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div>
                    <Label className="mb-1 block text-xs text-gray-600">
                      Service Name
                    </Label>
                    <Input
                      placeholder="e.g. Home Consultation"
                      value={serviceName}
                      onChange={(event) => setServiceName(event.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="mb-1 block text-xs text-gray-600">
                      Price (CAD)
                    </Label>
                    <Input
                      type="number"
                      placeholder="120"
                      value={servicePrice}
                      onChange={(event) => setServicePrice(event.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="mb-1 block text-xs text-gray-600">
                      Duration (minutes)
                    </Label>
                    <Input
                      type="number"
                      placeholder="60"
                      value={serviceDuration}
                      onChange={(event) => setServiceDuration(event.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="mb-1 block text-xs text-gray-600">
                      Category
                    </Label>
                    <select
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                      value={serviceCategory}
                      onChange={(event) => setServiceCategory(event.target.value)}
                    >
                      <option value="general">General</option>
                      <option value="preventive">Preventive</option>
                      <option value="rapid">Rapid / Urgent</option>
                      <option value="management">Chronic Management</option>
                      <option value="specialist">Specialist</option>
                    </select>
                  </div>
                  <div className="flex justify-end md:col-span-2">
                    <Button
                      size="sm"
                      onClick={() => addServiceMutation.mutate()}
                      disabled={
                        !serviceName ||
                        !servicePrice ||
                        addServiceMutation.isPending
                      }
                      className="bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,44%)]"
                    >
                      {addServiceMutation.isPending ? "Saving..." : "Add Service"}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div
              className={`rounded-lg border bg-white p-4 ${
                !needsAvailability ? "opacity-60" : ""
              }`}
            >
              <button
                type="button"
                className="flex w-full items-center justify-between text-left"
                onClick={() =>
                  needsAvailability && setAvailOpen((value) => !value)
                }
                disabled={!needsAvailability}
              >
                <div className="flex items-center gap-2">
                  {needsAvailability ? (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-blue-500 text-xs font-bold text-blue-600">
                      2
                    </div>
                  ) : (
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  )}
                  <span className="font-medium text-gray-900">
                    Set your availability
                  </span>
                  {!needsAvailability && (
                    <Badge className="ml-2 bg-green-100 text-green-800 text-xs">
                      Done
                    </Badge>
                  )}
                </div>
                {needsAvailability &&
                  (availOpen ? (
                    <ChevronUp className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  ))}
              </button>
              {needsAvailability && availOpen && (
                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                  <div>
                    <Label className="mb-1 block text-xs text-gray-600">
                      Day of Week
                    </Label>
                    <select
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                      value={availDay}
                      onChange={(event) => setAvailDay(event.target.value)}
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
                    <Label className="mb-1 block text-xs text-gray-600">
                      Start Time
                    </Label>
                    <Input
                      type="time"
                      value={availStart}
                      onChange={(event) => setAvailStart(event.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="mb-1 block text-xs text-gray-600">
                      End Time
                    </Label>
                    <Input
                      type="time"
                      value={availEnd}
                      onChange={(event) => setAvailEnd(event.target.value)}
                    />
                  </div>
                  <div className="flex justify-end md:col-span-3">
                    <Button
                      size="sm"
                      onClick={() => addAvailabilityMutation.mutate()}
                      disabled={addAvailabilityMutation.isPending}
                      className="bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,44%)]"
                    >
                      {addAvailabilityMutation.isPending
                        ? "Saving..."
                        : "Save Availability"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderOverview = () => (
    <>
      {!(provider as any)?.isApproved && (
        <Card className="mb-8 border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="mr-3 h-6 w-6 text-orange-600" />
              <div>
                <h3 className="font-semibold text-orange-900">
                  Application Under Review
                </h3>
                <p className="text-sm text-orange-700">
                  Your provider application is being reviewed. You&apos;ll be
                  notified once approved.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {renderSetupBanner()}

      {provider && !connectStatus?.chargesEnabled && (
        <Card className="mb-6 border-orange-200 bg-orange-50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-orange-600 shrink-0" />
                <div>
                  <p className="font-semibold text-orange-900">Connect Your Payout Account</p>
                  <p className="text-sm text-orange-700">Set up Stripe to receive 80% of each booking.</p>
                </div>
              </div>
              <Button size="sm" onClick={handleConnectOnboard}>Connect Account</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <Calendar className="h-6 w-6 text-[hsl(207,90%,54%)]" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {bookingsLoading ? (
                    <Skeleton className="h-6 w-8" />
                  ) : (
                    thisWeekBookings.length
                  )}
                </div>
                <div className="text-sm text-gray-600">This Week</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <Users className="h-6 w-6 text-[hsl(159,100%,34%)]" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {bookingsLoading ? (
                    <Skeleton className="h-6 w-8" />
                  ) : (
                    totalPatients
                  )}
                </div>
                <div className="text-sm text-gray-600">Total Patients</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100">
                <Star className="h-6 w-6 text-yellow-500" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {(provider as any)?.rating || "0.0"}
                </div>
                <div className="text-sm text-gray-600">Rating</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <DollarSign className="h-6 w-6 text-[hsl(259,78%,60%)]" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {bookingsLoading ? (
                    <Skeleton className="h-6 w-12" />
                  ) : (
                    `$${thisMonthEarnings.toFixed(0)}`
                  )}
                </div>
                <div className="text-sm text-gray-600">This Month</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {bookingsLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between p-4">
                  <div className="flex items-center">
                    <Skeleton className="mr-4 h-4 w-4 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                  <div className="space-y-1 text-right">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : upcomingBookings.length === 0 ? (
            <div className="py-8 text-center">
              <Calendar className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <p className="text-gray-600">No upcoming appointments scheduled</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {upcomingBookings.slice(0, 5).map((booking) => (
                <div key={booking.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="mr-4 h-4 w-4 rounded-full bg-[hsl(207,90%,54%)]" />
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {booking.patient?.firstName && booking.patient?.lastName
                            ? `${booking.patient.firstName} ${booking.patient.lastName}`
                            : "Patient appointment"}
                        </h3>
                        <p className="text-gray-600">
                          {booking.service?.name || "Healthcare Service"} •{" "}
                          {booking.patientAddress}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">
                        {new Date(booking.scheduledDate).toLocaleDateString()} at{" "}
                        {new Date(booking.scheduledDate).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
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
                          className={getPaymentStatusBadgeClass(
                            booking.paymentStatus,
                          )}
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

      <Card>
        <CardHeader>
          <CardTitle>Monthly Earnings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-center justify-center rounded-lg bg-gray-50">
            <div className="text-center text-gray-600">
              <TrendingUp className="mx-auto mb-4 h-12 w-12" />
              <p>Earnings trend</p>
              <p className="mt-2 text-sm">
                Total this month: ${thisMonthEarnings.toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );

  const renderAppointments = () => {
    return (
      <ProviderCalendar
        providerId={providerId}
        bookings={bookings}
      />
    );
  };

  const renderProfile = () => (
    <div className="space-y-8">
      {renderSetupBanner()}

      <Card>
        <CardHeader>
          <CardTitle>Profile Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {(provider as any)?.isVerified && (
              <Badge className="bg-green-100 text-green-800">Verified</Badge>
            )}
            {(provider as any)?.isApproved ? (
              <Badge className="bg-blue-100 text-blue-800">Approved</Badge>
            ) : (
              <Badge className="bg-orange-100 text-orange-800">Pending Approval</Badge>
            )}
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Specialization</Label>
              <Select
                value={profileForm.specialization}
                onValueChange={(value) =>
                  setProfileForm((prev) => ({ ...prev, specialization: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your discipline" />
                </SelectTrigger>
                <SelectContent>
                  {serviceCategories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.label}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Base pricing (CAD)</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={profileForm.basePricing}
                onChange={(event) =>
                  setProfileForm((prev) => ({
                    ...prev,
                    basePricing: event.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Years of experience</Label>
              <Input
                type="number"
                min="0"
                max="50"
                value={profileForm.yearsExperience}
                onChange={(event) =>
                  setProfileForm((prev) => ({
                    ...prev,
                    yearsExperience: Number(event.target.value || 0),
                  }))
                }
              />
            </div>
            <div>
              <div className="text-sm text-gray-500">Public Rating</div>
              <div className="mt-1 font-semibold text-gray-900">
                {(provider as any)?.rating || "0.0"} / 5
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Bio</Label>
            <Textarea
              value={profileForm.bio}
              maxLength={500}
              className="min-h-[140px]"
              onChange={(event) =>
                setProfileForm((prev) => ({
                  ...prev,
                  bio: event.target.value,
                }))
              }
            />
            <p className="text-right text-xs text-gray-500">
              {profileForm.bio.length}/500
            </p>
          </div>
          <div className="space-y-3">
            <Label>Service areas</Label>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {CALGARY_AREAS.map((area) => (
                <label key={area} className="flex items-center gap-2 rounded-lg border p-3">
                  <Checkbox
                    checked={profileForm.serviceAreas.includes(area)}
                    onCheckedChange={(checked) =>
                      setProfileForm((prev) => ({
                        ...prev,
                        serviceAreas: checked
                          ? [...prev.serviceAreas, area]
                          : prev.serviceAreas.filter((item) => item !== area),
                      }))
                    }
                  />
                  <span className="text-sm text-gray-700">{area}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <Label>Insurance accepted</Label>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {INSURANCE_OPTIONS.map((option) => (
                <label key={option} className="flex items-center gap-2 rounded-lg border p-3">
                  <Checkbox
                    checked={profileForm.insuranceAccepted.includes(option)}
                    onCheckedChange={(checked) =>
                      setProfileForm((prev) => ({
                        ...prev,
                        insuranceAccepted: checked
                          ? [...prev.insuranceAccepted, option]
                          : prev.insuranceAccepted.filter((item) => item !== option),
                      }))
                    }
                  />
                  <span className="text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href={`/provider/${providerId}`}>
              <Button variant="outline">
                View Public Profile
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/provider-documents">
              <Button variant="outline">
                Manage Documents
                <FileText className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={() => saveProfileMutation.mutate()}
              disabled={saveProfileMutation.isPending}
              className="bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,44%)]"
            >
              {saveProfileMutation.isPending ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Services</CardTitle>
        </CardHeader>
        <CardContent>
          {services.length === 0 ? (
            <div className="py-4 text-gray-600">
              No services added yet.
            </div>
          ) : (
            <div className="space-y-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="flex flex-col gap-3 rounded-lg border p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {service.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {service.description || "No description provided."}
                    </p>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    ${service.price} • {service.duration} minutes
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Availability</CardTitle>
        </CardHeader>
        <CardContent>
          {availability.length === 0 ? (
            <div className="py-4 text-gray-600">
              No availability has been configured yet.
            </div>
          ) : (
            <div className="space-y-3">
              {availability.map((slot) => (
                <div
                  key={slot.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="font-medium text-gray-900">
                    {formatDay(slot.dayOfWeek)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {slot.startTime} to {slot.endTime}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderEarnings = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-600">Total Earned</div>
            <div className="mt-2 text-3xl font-bold text-gray-900">
              ${earningsData?.totalEarned.toFixed(2) ?? "0.00"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-600">Pending</div>
            <div className="mt-2 text-3xl font-bold text-gray-900">
              ${earningsData?.pendingTransfers.toFixed(2) ?? "0.00"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-600">Completed Bookings</div>
            <div className="mt-2 text-3xl font-bold text-gray-900">
              {completedBookings.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-600">Average Booking</div>
            <div className="mt-2 text-3xl font-bold text-gray-900">
              ${averageBookingValue.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Earnings Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {(earningsData?.bookings ?? []).length === 0 ? (
            <div className="py-8 text-center text-gray-600">
              No completed bookings yet.
            </div>
          ) : (
            <div className="space-y-4">
              {(earningsData?.bookings ?? []).slice(0, 8).map((booking) => (
                  <div
                    key={booking.id}
                    className="flex flex-col gap-3 rounded-lg border p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Booking #{booking.id}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(booking.date).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      ${parseFloat(String(booking.providerPayout || 0)).toFixed(2)}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderMessages = () => (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Recent Conversations</CardTitle>
          <Link href="/messages">
            <Button variant="outline">
              Open Inbox
              <MessageCircle className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {conversations.length === 0 ? (
            <div className="py-8 text-center">
              <MessageCircle className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <p className="text-gray-600">No conversations yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {conversations.slice(0, 8).map((conversation) => (
                <div
                  key={conversation.partnerId}
                  className="flex flex-col gap-3 rounded-lg border p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">
                        {conversation.partnerName}
                      </h3>
                      {conversation.unreadCount > 0 && (
                        <Badge className="bg-blue-100 text-blue-800">
                          {conversation.unreadCount} unread
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      {conversation.lastMessage}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(conversation.lastMessageTime).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Link href={`/provider/${providerId}`}>
            <Button variant="outline" className="w-full justify-between">
              Public profile
              <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/provider-documents">
            <Button variant="outline" className="w-full justify-between">
              Provider documents
              <FileText className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/messages">
            <Button variant="outline" className="w-full justify-between">
              Message center
              <MessageCircle className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            variant="outline"
            className="w-full justify-between"
            onClick={logout}
          >
            Sign out
            <Settings className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Provider Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="font-medium text-gray-900">Approval</div>
            <Badge
              className={
                (provider as any)?.isApproved
                  ? "bg-green-100 text-green-800"
                  : "bg-orange-100 text-orange-800"
              }
            >
              {(provider as any)?.isApproved ? "Approved" : "Pending"}
            </Badge>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="font-medium text-gray-900">Verification</div>
            <Badge
              className={
                (provider as any)?.isVerified
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }
            >
              {(provider as any)?.isVerified ? "Verified" : "Not verified"}
            </Badge>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex items-center text-gray-900">
              <MapPin className="mr-2 h-4 w-4 text-gray-500" />
              Service area
            </div>
            <div className="text-sm text-gray-600">{providerLocation}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case "appointments":
        return renderAppointments();
      case "profile":
        return renderProfile();
      case "earnings":
        return renderEarnings();
      case "messages":
        return renderMessages();
      case "settings":
        return renderSettings();
      case "overview":
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Provider Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your practice and patient appointments
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <nav className="space-y-2" aria-label="Provider dashboard sections">
                  {dashboardTabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex w-full items-center rounded-lg px-4 py-3 text-left transition-colors ${
                          isActive
                            ? "bg-blue-50 text-[hsl(207,90%,54%)]"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <Icon className="mr-3 h-5 w-5" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">{renderActiveTab()}</div>
        </div>
      </div>
    </div>
  );
}

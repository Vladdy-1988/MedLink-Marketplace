import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Star, 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign,
  Activity,
  UserCheck,
  MessageCircle,
  BarChart3,
  Eye,
  Ban
} from "lucide-react";
// Charts will be implemented later - using simple data display for now
import Navigation from "@/components/Navigation";

const ADMIN_PORTAL_TABS = ["dashboard", "providers", "bookings", "feedback"] as const;

function getInitialAdminPortalTab() {
  if (typeof window === "undefined") return "dashboard";
  const requestedTab = new URLSearchParams(window.location.search).get("tab");
  return requestedTab && ADMIN_PORTAL_TABS.includes(requestedTab as any)
    ? requestedTab
    : "dashboard";
}

// Stats Overview Component
function StatsOverview({ stats }: { stats: any }) {
  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
            <p className="text-xs text-muted-foreground">
              {stats.dailyBookings} today, {stats.weeklyBookings} this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Providers</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeProviders}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingProviders} pending approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue?.toFixed(2) || '0.00'}</div>
            <p className="text-xs text-muted-foreground">
              From completed bookings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgRating?.toFixed(1) || '0.0'}</div>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3 w-3 ${
                    star <= (stats.avgRating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistics Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.bookingsOverTime?.slice(-7).map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{item.date}</span>
                  <Badge variant="outline">{item.count} bookings</Badge>
                </div>
              )) || []}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bookings by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.bookingsByStatus?.map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="capitalize font-medium">{item.status}</span>
                  <Badge 
                    variant={item.status === 'completed' ? 'default' : item.status === 'pending' ? 'outline' : 'secondary'}
                    className={item.status === 'completed' ? 'bg-green-600' : ''}
                  >
                    {item.count} bookings
                  </Badge>
                </div>
              )) || []}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Rated Services */}
      <Card>
        <CardHeader>
          <CardTitle>Top Rated Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.topRatedServices.map((service: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{service.serviceName}</p>
                  <p className="text-sm text-muted-foreground">{service.category}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-medium">{Number(service.avgRating).toFixed(1)}</span>
                    <span className="text-sm text-muted-foreground">({service.reviewCount})</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Provider Management Component
function ProviderManagement() {
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState("all");
  
  const { data: providers, isLoading } = useQuery({
    queryKey: ['/api/admin/providers'],
    queryFn: () => apiRequest('GET', '/api/admin/providers').then(res => res.json())
  });

  const updateProviderMutation = useMutation({
    mutationFn: ({ id, isApproved, isVerified }: { id: number, isApproved: boolean, isVerified?: boolean }) =>
      apiRequest('PUT', `/api/admin/providers/${id}/status`, { isApproved, isVerified }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/providers'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      toast({ title: "Provider status updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update provider status", variant: "destructive" });
    }
  });

  const filteredProviders = providers?.filter((provider: any) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "approved") return provider.isApproved;
    if (statusFilter === "pending") return !provider.isApproved;
    return true;
  }) || [];

  const getStatusBadge = (provider: any) => {
    if (!provider.isApproved) {
      return <Badge variant="outline" className="text-yellow-600">Pending</Badge>;
    }
    if (provider.isVerified) {
      return <Badge variant="default" className="bg-green-600">Verified</Badge>;
    }
    return <Badge variant="secondary">Approved</Badge>;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Provider Management</h2>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Providers</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Provider</TableHead>
                <TableHead>Specialization</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>License</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProviders.map((provider: any) => (
                <TableRow key={provider.id} data-testid={`provider-row-${provider.id}`}>
                  <TableCell>
                    <div>
                      <div className="font-medium" data-testid={`provider-name-${provider.id}`}>
                        {provider.firstName} {provider.lastName}
                      </div>
                      <div className="text-sm text-muted-foreground">{provider.email}</div>
                    </div>
                  </TableCell>
                  <TableCell data-testid={`provider-specialization-${provider.id}`}>
                    {provider.specialization}
                  </TableCell>
                  <TableCell data-testid={`provider-experience-${provider.id}`}>
                    {provider.yearsExperience} years
                  </TableCell>
                  <TableCell data-testid={`provider-license-${provider.id}`}>
                    {provider.licenseNumber}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span>{Number(provider.rating).toFixed(1)}</span>
                      <span className="text-sm text-muted-foreground">({provider.reviewCount})</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(provider)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {!provider.isApproved && (
                        <Button
                          size="sm"
                          onClick={() => updateProviderMutation.mutate({ id: provider.id, isApproved: true })}
                          disabled={updateProviderMutation.isPending}
                          data-testid={`approve-provider-${provider.id}`}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      )}
                      {provider.isApproved && !provider.isVerified && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateProviderMutation.mutate({ id: provider.id, isApproved: true, isVerified: true })}
                          disabled={updateProviderMutation.isPending}
                          data-testid={`verify-provider-${provider.id}`}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Verify
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        data-testid={`view-provider-${provider.id}`}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      {provider.isApproved && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateProviderMutation.mutate({ id: provider.id, isApproved: false })}
                          disabled={updateProviderMutation.isPending}
                          data-testid={`suspend-provider-${provider.id}`}
                        >
                          <Ban className="h-4 w-4 mr-1" />
                          Suspend
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// Booking Management Component
function BookingManagement() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['/api/admin/bookings'],
    queryFn: () => apiRequest('GET', '/api/admin/bookings').then(res => res.json())
  });

  const filteredBookings = bookings?.filter((booking: any) => {
    if (statusFilter !== "all" && booking.status !== statusFilter) return false;
    if (dateFilter && !booking.scheduledDate.startsWith(dateFilter)) return false;
    return true;
  }) || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge variant="default" className="bg-green-600">Confirmed</Badge>;
      case "completed":
        return <Badge variant="default" className="bg-blue-600">Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      case "pending":
      default:
        return <Badge variant="outline" className="text-yellow-600">Pending</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Booking Management</h2>
        <div className="flex gap-4">
          <Input
            type="date"
            placeholder="Filter by date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-40"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Bookings</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking: any) => (
                <TableRow key={booking.id} data-testid={`booking-row-${booking.id}`}>
                  <TableCell>
                    <div>
                      <div className="font-medium" data-testid={`patient-name-${booking.id}`}>
                        {booking.patientName}
                      </div>
                      <div className="text-sm text-muted-foreground">{booking.patientEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell data-testid={`provider-name-${booking.id}`}>
                    {booking.providerName}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{booking.serviceName}</div>
                      <div className="text-sm text-muted-foreground">{booking.serviceCategory}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {new Date(booking.scheduledDate).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(booking.scheduledDate).toLocaleTimeString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell data-testid={`booking-amount-${booking.id}`}>
                    ${Number(booking.totalAmount).toFixed(2)}
                  </TableCell>
                  <TableCell>{getStatusBadge(booking.status)}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={booking.paymentStatus === 'paid' ? 'default' : 'outline'}
                      className={booking.paymentStatus === 'paid' ? 'bg-green-600' : ''}
                    >
                      {booking.paymentStatus || 'pending'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// Patient Feedback Component
function PatientFeedback() {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ['/api/admin/reviews'],
    queryFn: () => apiRequest('GET', '/api/admin/reviews').then(res => res.json())
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Patient Feedback</h2>

      <div className="grid gap-4">
        {reviews?.map((review: any) => (
          <Card key={review.id} data-testid={`review-${review.id}`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="font-medium">{review.patientName}</div>
                    <div className="text-sm text-muted-foreground">→</div>
                    <div className="text-sm text-muted-foreground">{review.providerName}</div>
                  </div>
                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm font-medium">{review.rating}/5</span>
                  </div>
                  {review.comment && (
                    <p className="text-gray-700 mb-3" data-testid={`review-comment-${review.id}`}>
                      "{review.comment}"
                    </p>
                  )}
                  <div className="text-sm text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString()} • Booking #{review.bookingId}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" data-testid={`flag-review-${review.id}`}>
                    Flag
                  </Button>
                  <Button size="sm" variant="outline" data-testid={`reply-review-${review.id}`}>
                    Reply
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )) || []}
      </div>
    </div>
  );
}

export default function AdminPortal() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(getInitialAdminPortalTab);

  // UI-only role check for rendering. Server/API enforce real authorization.
  if (!user || user.userType !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-32">
          <Card>
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
              <p className="text-gray-600 mb-6">
                You need administrator privileges to access this page.
              </p>
              <Link href="/">
                <Button>Return to Home</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const { data: stats } = useQuery({
    queryKey: ['/api/admin/stats'],
    queryFn: () => apiRequest('GET', '/api/admin/stats').then(res => res.json())
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">MedLink Admin Portal</h1>
          <p className="text-gray-600">Manage your healthcare marketplace platform</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="flex h-auto w-full flex-nowrap justify-start gap-2 overflow-x-auto rounded-2xl bg-white p-2 shadow-sm">
            <TabsTrigger value="dashboard" data-testid="tab-dashboard" className="h-10 shrink-0 rounded-xl px-3">
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="providers" data-testid="tab-providers" className="h-10 shrink-0 rounded-xl px-3">
              <Users className="h-4 w-4 mr-2" />
              Providers
            </TabsTrigger>
            <TabsTrigger value="bookings" data-testid="tab-bookings" className="h-10 shrink-0 rounded-xl px-3">
              <Calendar className="h-4 w-4 mr-2" />
              Bookings
            </TabsTrigger>
            <TabsTrigger value="feedback" data-testid="tab-feedback" className="h-10 shrink-0 rounded-xl px-3">
              <MessageCircle className="h-4 w-4 mr-2" />
              Feedback
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <StatsOverview stats={stats} />
          </TabsContent>

          <TabsContent value="providers">
            <ProviderManagement />
          </TabsContent>

          <TabsContent value="bookings">
            <BookingManagement />
          </TabsContent>

          <TabsContent value="feedback">
            <PatientFeedback />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { Calendar, User, UserCheck } from "lucide-react";
import { useLocation } from "wouter";
import Navigation from "@/components/Navigation";

interface Booking {
  id: number;
  patientName: string | null;
  patientEmail: string | null;
  providerName: string | null;
  serviceName: string | null;
  serviceCategory: string | null;
  scheduledDate: string;
  duration: number;
  status: string;
  totalAmount: string;
  paymentStatus: string;
  patientAddress: string;
  createdAt: string;
}

interface User {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  userType: string;
}

interface Provider {
  id: number;
  userId: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  specialization: string;
  licenseNumber: string;
  yearsExperience: number;
  rating: string;
  reviewCount: number;
  isVerified: boolean;
  isApproved: boolean;
}

export default function AdminData() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user?.userType !== "admin") {
      setLocation("/");
    }
  }, [authLoading, setLocation, user]);

  const fetchRawData = async () => {
    try {
      setLoading(true);

      const [bookingsResponse, usersResponse, providersResponse] =
        await Promise.all([
          apiRequest("GET", "/api/admin/bookings"),
          apiRequest("GET", "/api/admin/users"),
          apiRequest("GET", "/api/admin/providers"),
        ]);

      const [bookingsData, usersData, providersData] = await Promise.all([
        bookingsResponse.json(),
        usersResponse.json(),
        providersResponse.json(),
      ]);

      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      setUsers(Array.isArray(usersData) ? usersData : []);
      setProviders(Array.isArray(providersData) ? providersData : []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setBookings([]);
      setUsers([]);
      setProviders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user?.userType === "admin") {
      void fetchRawData();
    }
  }, [authLoading, user]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading admin data...</p>
        </div>
      </div>
    );
  }

  if (user?.userType !== "admin") {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading admin data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">MedLink Admin Data View</h1>
          <p className="text-gray-600">View current bookings, users, and providers in the system</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{bookings.length}</p>
                  <p className="text-gray-600">Total Bookings</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <User className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{users.length}</p>
                  <p className="text-gray-600">Total Users</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <UserCheck className="h-8 w-8 text-orange-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{providers.length}</p>
                  <p className="text-gray-600">Providers</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bookings Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Current Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <p className="text-gray-500">No bookings found</p>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">
                          Booking #{booking.id} - {booking.serviceName}
                        </h3>
                        <p className="text-gray-600">
                          Patient: {booking.patientName || "Unknown patient"}
                        </p>
                        <p className="text-gray-600">
                          Provider: {booking.providerName || "Unknown provider"}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                          {booking.status}
                        </Badge>
                        <p className="text-lg font-bold text-green-600">${booking.totalAmount}</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>📅 {formatDate(booking.scheduledDate)}</p>
                      <p>📍 {booking.patientAddress}</p>
                      <p>💳 Payment: {booking.paymentStatus}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Users & Providers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {users.map((user) => (
                  <div key={user.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold">{user.firstName} {user.lastName}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    {/* UI-only role check for badge display. Server/API enforce real authorization. */}
                    <Badge variant={user.userType === 'provider' ? 'default' : 'secondary'}>
                      {user.userType}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Provider Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {providers.map((provider) => (
                  <div key={provider.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">{provider.specialization}</p>
                        <p className="text-sm text-gray-600">License: {provider.licenseNumber}</p>
                        <p className="text-sm text-gray-600">{provider.yearsExperience} years experience</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">⭐ {provider.rating}</p>
                        <div className="flex gap-1 mt-1">
                          <Badge variant={provider.isVerified ? 'default' : 'secondary'}>
                            {provider.isVerified ? 'Verified' : 'Unverified'}
                          </Badge>
                          <Badge variant={provider.isApproved ? 'default' : 'destructive'}>
                            {provider.isApproved ? 'Approved' : 'Pending'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Button onClick={() => void fetchRawData()} className="mr-4">
            Refresh Data
          </Button>
          <p className="text-sm text-gray-500 mt-2">
            Data shown reflects the current admin API responses.
          </p>
        </div>
      </div>
    </div>
  );
}

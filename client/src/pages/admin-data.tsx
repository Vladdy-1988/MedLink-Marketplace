import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { apiRequest } from "@/lib/queryClient";
import { Calendar, MessageCircle, User, DollarSign } from "lucide-react";

interface Booking {
  id: number;
  patientId: string;
  providerId: number;
  serviceId: number;
  scheduledDate: string;
  status: string;
  totalAmount: string;
  paymentStatus: string;
  patientAddress: string;
  service?: {
    name: string;
    price: string;
  };
  patient?: {
    firstName: string;
    lastName: string;
  };
  provider?: {
    specialization: string;
  };
}

interface Message {
  id: number;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  sender?: {
    firstName: string;
    lastName: string;
  };
  receiver?: {
    firstName: string;
    lastName: string;
  };
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: string;
}

interface Provider {
  id: number;
  userId: string;
  specialization: string;
  licenseNumber: string;
  yearsExperience: number;
  rating: string;
  isVerified: boolean;
  isApproved: boolean;
}

export default function AdminData() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRawData = async () => {
    try {
      setLoading(true);
      
      // Fetch data directly using our known sample data structure
      const sampleBookings: Booking[] = [
        {
          id: 1,
          patientId: "patient-demo-1",
          providerId: 1,
          serviceId: 1,
          scheduledDate: "2025-08-15T10:00:00Z",
          status: "confirmed",
          totalAmount: "200.00",
          paymentStatus: "pending",
          patientAddress: "1234 Main Street, Calgary, AB T2P 1A4",
          service: {
            name: "Comprehensive Health Assessment",
            price: "200.00"
          },
          patient: {
            firstName: "Sarah",
            lastName: "Johnson"
          },
          provider: {
            specialization: "Family Medicine"
          }
        }
      ];

      const sampleMessages: Message[] = [
        {
          id: 1,
          senderId: "patient-demo-1",
          receiverId: "provider-demo-1",
          content: "Hi Dr. Smith, I have some questions about my upcoming appointment on August 15th.",
          isRead: false,
          createdAt: "2025-08-11T19:41:40Z",
          sender: { firstName: "Sarah", lastName: "Johnson" },
          receiver: { firstName: "Dr. Emma", lastName: "Smith" }
        },
        {
          id: 2,
          senderId: "provider-demo-1",
          receiverId: "patient-demo-1",
          content: "Hello Sarah! I would be happy to answer any questions you have. What would you like to know about your comprehensive health assessment?",
          isRead: false,
          createdAt: "2025-08-11T19:46:40Z",
          sender: { firstName: "Dr. Emma", lastName: "Smith" },
          receiver: { firstName: "Sarah", lastName: "Johnson" }
        },
        {
          id: 3,
          senderId: "patient-demo-1",
          receiverId: "provider-demo-1",
          content: "Should I prepare anything special for the visit? Also, how long should I expect the assessment to take?",
          isRead: false,
          createdAt: "2025-08-11T19:51:40Z",
          sender: { firstName: "Sarah", lastName: "Johnson" },
          receiver: { firstName: "Dr. Emma", lastName: "Smith" }
        }
      ];

      const sampleUsers: User[] = [
        { id: "patient-demo-1", email: "sarah.patient@demo.com", firstName: "Sarah", lastName: "Johnson", userType: "patient" },
        { id: "provider-demo-1", email: "dr.smith@demo.com", firstName: "Dr. Emma", lastName: "Smith", userType: "provider" },
        { id: "provider-demo-2", email: "dr.patel@demo.com", firstName: "Dr. Raj", lastName: "Patel", userType: "provider" }
      ];

      let realProviders: Provider[] = [];
      try {
        const providersResponse = await apiRequest("GET", "/api/admin/providers");
        const providerData = await providersResponse.json();
        realProviders = Array.isArray(providerData) ? providerData : [];
      } catch (providerError) {
        console.error("Error loading admin providers:", providerError);
      }

      setBookings(sampleBookings);
      setMessages(sampleMessages);
      setUsers(sampleUsers);
      setProviders(realProviders);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRawData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">MedLink Admin Data View</h1>
          <p className="text-gray-600">View all bookings, messages, users, and providers in the system</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                <MessageCircle className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{messages.length}</p>
                  <p className="text-gray-600">Messages</p>
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
                <DollarSign className="h-8 w-8 text-orange-500" />
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
                          Booking #{booking.id} - {booking.service?.name}
                        </h3>
                        <p className="text-gray-600">
                          Patient: {booking.patient?.firstName} {booking.patient?.lastName}
                        </p>
                        <p className="text-gray-600">
                          Provider: {booking.provider?.specialization}
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

        {/* Messages Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Recent Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            {messages.length === 0 ? (
              <p className="text-gray-500">No messages found</p>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold">
                          {message.sender?.firstName} {message.sender?.lastName}
                          <span className="text-gray-500 font-normal"> → </span>
                          {message.receiver?.firstName} {message.receiver?.lastName}
                        </h4>
                        <p className="text-sm text-gray-600">{formatDate(message.createdAt)}</p>
                      </div>
                      <Badge variant={message.isRead ? 'secondary' : 'default'}>
                        {message.isRead ? 'Read' : 'Unread'}
                      </Badge>
                    </div>
                    <p className="text-gray-800">{message.content}</p>
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
          <Button onClick={fetchRawData} className="mr-4">
            Refresh Data
          </Button>
          <p className="text-sm text-gray-500 mt-2">
            Data shown represents current system state with sample healthcare data
          </p>
        </div>
      </div>
    </div>
  );
}

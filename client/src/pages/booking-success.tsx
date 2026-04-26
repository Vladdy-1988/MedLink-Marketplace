import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, User } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { Booking, Provider, Service } from "@shared/schema";

export default function BookingSuccess() {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [provider, setProvider] = useState<
    (Provider & { firstName?: string | null; lastName?: string | null }) | null
  >(null);
  const [service, setService] = useState<Service | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [, setLocation] = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const bookingId = urlParams.get('bookingId');
    
    if (!bookingId) {
      setLocation('/');
      return;
    }

    // Fetch booking details
    const fetchBookingDetails = async () => {
      try {
        const bookingResponse = await apiRequest("GET", `/api/bookings/${bookingId}`);
        const bookingData = await bookingResponse.json();
        setBooking(bookingData);

        // Fetch related data
        const [providerResponse, serviceResponse] = await Promise.all([
          apiRequest("GET", `/api/providers/${bookingData.providerId}`),
          apiRequest("GET", `/api/services/${bookingData.serviceId}`)
        ]);

        const providerData = await providerResponse.json();
        const serviceData = await serviceResponse.json();
        
        setProvider(providerData);
        setService(serviceData);
      } catch (error) {
        console.error("Error fetching booking details:", error);
        setErrorMessage(
          "We could not load your booking details. Please check your dashboard or contact support.",
        );
      }
    };

    fetchBookingDetails();
  }, [setLocation]);

  if (errorMessage) {
    return (
      <div className="h-screen flex items-center justify-center px-4">
        <Card className="max-w-md text-center">
          <CardHeader>
            <CardTitle>Booking Details Unavailable</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">{errorMessage}</p>
            <Button asChild>
              <Link href="/dashboard/patient">Go to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!booking || !provider || !service) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading"/>
      </div>
    );
  }

  const scheduledDate = new Date(booking.scheduledDate);
  const providerName =
    `${provider.firstName || ""} ${provider.lastName || ""}`.trim() ||
    provider.specialization ||
    "Your provider";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your healthcare appointment has been successfully booked and paid.
          </p>
        </div>

        {/* Booking Details Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Appointment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Service
                </label>
                <p className="font-semibold" data-testid="text-service-name">
                  {service.name}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Provider
                </label>
                <p className="font-semibold" data-testid="text-provider-name">
                  {providerName}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Date & Time
                </label>
                <p className="font-semibold" data-testid="text-appointment-datetime">
                  {scheduledDate.toLocaleDateString('en-CA', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                  <br />
                  {scheduledDate.toLocaleTimeString('en-CA', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Booking ID
                </label>
                <p className="font-semibold text-blue-600 dark:text-blue-400" data-testid="text-booking-id">
                  #{booking.id}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Paid
              </label>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400" data-testid="text-total-amount">
                ${booking.totalAmount} CAD
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">1</span>
                </div>
                <div>
                  <p className="font-medium">Confirmation Email Sent</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Check your email for detailed appointment information and preparation instructions.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">2</span>
                </div>
                <div>
                  <p className="font-medium">Provider Contact</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your healthcare provider will contact you within 24 hours to confirm details and answer any questions.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">3</span>
                </div>
                <div>
                  <p className="font-medium">Appointment Day</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your provider will arrive at your specified location at the scheduled time.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild className="flex-1" data-testid="button-view-bookings">
            <Link href="/dashboard/patient">
              <Calendar className="w-4 h-4 mr-2" />
              View My Bookings
            </Link>
          </Button>
          
          <Button variant="outline" asChild className="flex-1" data-testid="button-book-another">
            <Link href="/providers">
              <User className="w-4 h-4 mr-2" />
              Book Another Service
            </Link>
          </Button>
        </div>

        {/* Support Information */}
        <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            Need help? Contact us at{" "}
            <a href="mailto:support@mymedlink.ca" className="text-blue-600 dark:text-blue-400 hover:underline">
              support@mymedlink.ca
            </a>
            {" "}or call our support line.
          </p>
        </div>
      </div>
    </div>
  );
}

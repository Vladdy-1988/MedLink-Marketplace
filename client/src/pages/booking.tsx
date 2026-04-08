import { useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import BookingSteps from "@/components/BookingSteps";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export default function Booking() {
  const [, params] = useRoute("/booking/:providerId/:serviceId");
  const providerId = params?.providerId ? parseInt(params.providerId, 10) : 0;
  const initialServiceId = params?.serviceId ? parseInt(params.serviceId, 10) : undefined;

  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  useEffect(() => {
    document.title = "Book Appointment — MedLink Marketplace";
  }, []);

  const { data: provider, isLoading: providerLoading } = useQuery({
    queryKey: ["/api/providers", providerId],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/providers/${providerId}`);
      return response.json();
    },
    enabled: providerId > 0,
  });

  const { data: servicesData = [], isLoading: servicesLoading } = useQuery({
    queryKey: ["/api/providers", providerId, "services"],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/providers/${providerId}/services`);
      return response.json();
    },
    enabled: providerId > 0,
  });

  const services = (servicesData as any[]).map((service) => ({
    ...service,
    price: Number(service.price),
    duration: Number(service.duration),
  }));

  const createBookingMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      const selectedService = services.find((service) => service.id === bookingData.serviceId);
      if (!selectedService) {
        throw new Error("Selected service is not available");
      }

      const response = await apiRequest("POST", "/api/bookings", {
        providerId,
        serviceId: bookingData.serviceId,
        scheduledDate: new Date(`${bookingData.date} ${bookingData.time}`).toISOString(),
        duration: selectedService.duration || 60,
        patientAddress: bookingData.address,
        patientNotes: bookingData.notes,
        totalAmount: selectedService.price || 0,
        status: "pending",
        paymentStatus: "pending",
      });
      return response.json();
    },
    onSuccess: (booking: any) => {
      const amount = Number(booking?.totalAmount || 0);
      toast({
        title: "Booking Confirmed!",
        description: "Your appointment has been created. Complete payment to finalize it.",
      });
      setLocation(`/checkout?bookingId=${booking.id}&amount=${amount}`);
    },
    onError: () => {
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleBookingComplete = (bookingData: any) => {
    createBookingMutation.mutate(bookingData);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Please Sign In</h1>
          <p className="text-gray-600 mb-8">You need to be signed in to book an appointment.</p>
          <button
            onClick={() => window.location.href = "/api/login"}
            className="bg-[hsl(207,90%,54%)] text-white px-6 py-3 rounded-lg hover:bg-[hsl(207,90%,44%)] transition-colors"
          >
            Sign In to Continue
          </button>
        </div>
      </div>
    );
  }

  if (providerLoading || servicesLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-[560px] w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Provider Not Found</h1>
          <p className="text-gray-600 mb-8">This provider is unavailable or no longer active.</p>
        </div>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">No Services Available</h1>
          <p className="text-gray-600 mb-8">This provider has not published services yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Appointment</h1>
          <p className="text-gray-600">
            with {provider.firstName} {provider.lastName} • {provider.specialization}
          </p>
        </div>
      </div>

      <BookingSteps
        providerId={providerId}
        services={services}
        initialServiceId={initialServiceId}
        onComplete={handleBookingComplete}
      />
    </div>
  );
}

import { useRoute } from "wouter";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import BookingSteps from "@/components/BookingSteps";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { featuredProviders } from "@/lib/mockData";

export default function Booking() {
  const [, params] = useRoute("/booking/:providerId/:serviceId");
  const providerId = params?.providerId ? parseInt(params.providerId) : 1;
  const serviceId = params?.serviceId ? parseInt(params.serviceId) : 1;
  
  const { user } = useAuth();
  const { toast } = useToast();
  
  const provider = featuredProviders.find(p => p.id === providerId) || featuredProviders[0];
  
  // Mock services for the provider
  const services = [
    {
      id: 1,
      name: "Wound Care",
      description: "Professional wound assessment and dressing changes",
      price: 85,
      duration: 60
    },
    {
      id: 2,
      name: "Medication Management", 
      description: "Medication reviews and administration support",
      price: 75,
      duration: 45
    }
  ];

  const createBookingMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      const response = await apiRequest("POST", "/api/bookings", {
        providerId,
        serviceId: bookingData.serviceId,
        scheduledDate: new Date(`${bookingData.date} ${bookingData.time}`).toISOString(),
        duration: services.find(s => s.id === bookingData.serviceId)?.duration || 60,
        patientAddress: bookingData.address,
        patientNotes: bookingData.notes,
        totalAmount: services.find(s => s.id === bookingData.serviceId)?.price || 85,
        status: "pending",
        paymentStatus: "pending"
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Booking Confirmed!",
        description: "Your appointment has been successfully booked. You will receive a confirmation email shortly.",
      });
      // Redirect to patient dashboard
      window.location.href = "/dashboard/patient";
    },
    onError: (error) => {
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleBookingComplete = (bookingData: any) => {
    // In a real app, this would integrate with Stripe for payment
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Appointment</h1>
          <p className="text-gray-600">with {provider.name} • {provider.specialty}</p>
        </div>
      </div>

      <BookingSteps
        providerId={providerId}
        services={services}
        onComplete={handleBookingComplete}
      />
    </div>
  );
}

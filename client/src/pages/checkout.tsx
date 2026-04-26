import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const stripePromise = stripePublicKey ? loadStripe(stripePublicKey) : null;

interface CheckoutFormProps {
  bookingId: number;
  amount: number;
}

const CheckoutForm = ({ bookingId, amount }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/booking-success`,
      },
      redirect: 'if_required',
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Update booking payment status
      try {
        await apiRequest("POST", "/api/payment/confirm", {
          paymentIntentId: paymentIntent.id,
          bookingId,
        });
        
        toast({
          title: "Payment Successful",
          description: "Your booking has been confirmed and paid!",
        });
        
        setLocation(`/booking-success?bookingId=${bookingId}`);
      } catch (error) {
        toast({
          title: "Payment Processed",
          description: "Payment successful, but there was an issue updating your booking. Please contact support.",
          variant: "destructive",
        });
      }
      setIsProcessing(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Complete Your Payment</CardTitle>
        <CardDescription>
          Secure payment for your healthcare appointment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm font-medium">Amount to pay:</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              ${amount.toFixed(2)} CAD
            </p>
          </div>
          
          <PaymentElement />
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={!stripe || !elements || isProcessing}
            data-testid="button-submit-payment"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Pay $${amount.toFixed(2)} CAD`
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [bookingData, setBookingData] = useState<any>(null);
  const [setupError, setSetupError] = useState("");
  const [, setLocation] = useLocation();
  
  // Get booking data from URL params or state
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const bookingId = urlParams.get('bookingId');
    
    if (!bookingId) {
      setLocation('/');
      return;
    }

    if (!stripePublicKey) {
      setSetupError("Payments are not configured yet. Please contact support.");
      return;
    }

    // Create PaymentIntent as soon as the page loads
    apiRequest("POST", "/api/create-payment-intent", { 
      bookingId: parseInt(bookingId)
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.clientSecret || typeof data.amount !== "number") {
          throw new Error("Payment setup response was incomplete");
        }
        setBookingData({
          bookingId: parseInt(bookingId),
          amount: data.amount,
        });
        setClientSecret(data.clientSecret);
      })
      .catch((error) => {
        console.error("Error creating payment intent:", error);
        setSetupError("We could not start payment for this booking. Please try again or contact support.");
      });
  }, [setLocation]);

  if (setupError) {
    return (
      <div className="h-screen flex items-center justify-center px-4">
        <Card className="max-w-md text-center">
          <CardHeader>
            <CardTitle>Payment Setup Unavailable</CardTitle>
            <CardDescription>{setupError}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setLocation("/dashboard/patient")}>
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!clientSecret || !bookingData) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" aria-label="Loading"/>
          <p>Setting up secure payment...</p>
        </div>
      </div>
    );
  }

  // Make SURE to wrap the form in <Elements> which provides the stripe context.
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Secure Payment
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Complete your healthcare appointment booking
          </p>
        </div>
        
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm 
            bookingId={bookingData.bookingId} 
            amount={bookingData.amount} 
          />
        </Elements>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface BookingData {
  serviceId?: number;
  date?: string;
  time?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
}

interface BookingStepsProps {
  providerId: number;
  services: any[];
  onComplete: (bookingData: BookingData) => void;
}

export default function BookingSteps({ providerId, services, onComplete }: BookingStepsProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({});

  const steps = [
    { number: 1, title: "Service Selection" },
    { number: 2, title: "Date & Time" },
    { number: 3, title: "Contact Info" },
    { number: 4, title: "Confirmation" }
  ];

  const progress = (currentStep / steps.length) * 100;

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleServiceSelect = (serviceId: string) => {
    setBookingData({ ...bookingData, serviceId: Number(serviceId) });
  };

  const handleInputChange = (field: string, value: string) => {
    setBookingData({ ...bookingData, [field]: value });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Your Service</h2>
            <RadioGroup onValueChange={handleServiceSelect} value={bookingData.serviceId?.toString()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service) => (
                  <Label
                    key={service.id}
                    htmlFor={`service-${service.id}`}
                    className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-[hsl(207,90%,54%)] transition-colors"
                  >
                    <div className="flex items-start">
                      <RadioGroupItem value={service.id.toString()} id={`service-${service.id}`} className="mt-1" />
                      <div className="ml-4">
                        <h3 className="font-semibold text-gray-900 mb-1">{service.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                        <div className="text-lg font-bold text-[hsl(207,90%,54%)]">${service.price}/visit</div>
                      </div>
                    </div>
                  </Label>
                ))}
              </div>
            </RadioGroup>
            <div>
              <Label htmlFor="notes" className="text-sm font-medium text-gray-700 mb-2">
                Additional Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                rows={3}
                placeholder="Any specific requirements or medical conditions we should know about..."
                value={bookingData.notes || ""}
                onChange={(e) => handleInputChange("notes", e.target.value)}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Date & Time</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <Label htmlFor="date" className="text-lg font-semibold text-gray-900 mb-4">Select Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={bookingData.date || ""}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <Label className="text-lg font-semibold text-gray-900 mb-4">Available Times</Label>
                <div className="grid grid-cols-2 gap-3">
                  {["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"].map((time) => (
                    <Button
                      key={time}
                      variant={bookingData.time === time ? "default" : "outline"}
                      onClick={() => handleInputChange("time", time)}
                      className="text-center"
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={bookingData.firstName || ""}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={bookingData.lastName || ""}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={bookingData.phone || ""}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={bookingData.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="address">Service Address</Label>
              <Input
                id="address"
                placeholder="123 Main Street, Calgary, AB"
                value={bookingData.address || ""}
                onChange={(e) => handleInputChange("address", e.target.value)}
              />
            </div>
          </div>
        );

      case 4:
        const selectedService = services.find(s => s.id === bookingData.serviceId);
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment & Confirmation</h2>
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service:</span>
                  <span className="font-medium">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date & Time:</span>
                  <span className="font-medium">{bookingData.date} at {bookingData.time}</span>
                </div>
                <div className="flex justify-between border-t pt-2 mt-2">
                  <span className="font-semibold text-gray-900">Total:</span>
                  <span className="font-semibold text-gray-900">${selectedService?.price}.00</span>
                </div>
              </CardContent>
            </Card>
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <p className="text-center text-gray-600">Stripe Payment Component</p>
              <p className="text-center text-sm text-gray-500 mt-2">Secure payment processing</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-900">
            Step {currentStep} of {steps.length}
          </span>
          <span className="text-sm text-gray-600">
            {steps[currentStep - 1]?.title}
          </span>
        </div>
        <Progress value={progress} className="w-full" />
      </div>

      <Card>
        <CardContent className="p-8">
          {renderStep()}

          <div className="flex justify-between mt-8">
            <Button
              onClick={prevStep}
              disabled={currentStep === 1}
              variant="outline"
            >
              Back
            </Button>
            {currentStep === steps.length ? (
              <Button
                onClick={() => onComplete(bookingData)}
                className="bg-[hsl(159,100%,34%)] hover:bg-[hsl(159,100%,24%)]"
              >
                Confirm Booking
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                disabled={
                  (currentStep === 1 && !bookingData.serviceId) ||
                  (currentStep === 2 && (!bookingData.date || !bookingData.time)) ||
                  (currentStep === 3 && (!bookingData.firstName || !bookingData.lastName || !bookingData.address))
                }
                className="bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,44%)]"
              >
                Continue
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

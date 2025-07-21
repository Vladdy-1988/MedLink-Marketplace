import React, { useState, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertProviderSchema } from "@shared/schema";
import { z } from "zod";
import { UserCheck, FileText, MapPin, Star, Clock, CheckCircle } from "lucide-react";

const providerFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  specialization: z.string().min(1, "Please select a specialization"),
  licenseNumber: z.string().min(1, "License number is required"),
  yearsExperience: z.number().min(0, "Years of experience must be 0 or more").max(50, "Years of experience must be less than 50"),
  bio: z.string().optional(),
  serviceAreas: z.string().min(1, "Service area is required"),
  availability: z.string().optional(),
});

type ProviderFormData = z.infer<typeof providerFormSchema>;

export default function ProviderRegistration() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ProviderFormData>({
    resolver: zodResolver(providerFormSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: "",
      specialization: "",
      licenseNumber: "",
      yearsExperience: 0,
      bio: "",

      serviceAreas: "Calgary, AB",
      availability: ""
    },
  });

  const createProviderMutation = useMutation({
    mutationFn: async (data: ProviderFormData) => {
      const { firstName, lastName, email, phone, ...formData } = data;
      
      // Transform data to match backend schema
      const providerData = {
        ...formData,
        serviceAreas: [formData.serviceAreas], // Convert to array
        availability: formData.availability || null,
        bio: formData.bio || null,
      };
      
      return await apiRequest("/api/providers", "POST", providerData);
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted!",
        description: "Your provider application has been submitted successfully. We'll review it and get back to you within 3-5 business days.",
      });
      setIsSubmitted(true);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Application Failed",
        description: error.message || "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to apply as a healthcare provider.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isLoading, isAuthenticated, toast]);

  // Return early if not authenticated or still loading
  if (!isLoading && !isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="text-center">
            <CardContent className="p-12">
              <CheckCircle className="h-16 w-16 text-[hsl(159,100%,34%)] mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted!</h1>
              <p className="text-xl text-gray-600 mb-8">
                Thank you for applying to join our network of healthcare providers. We'll review your application and get back to you within 3-5 business days.
              </p>
              <div className="space-y-4 text-left bg-gray-50 p-6 rounded-lg mb-8">
                <h3 className="font-semibold text-gray-900">What happens next?</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-[hsl(207,90%,54%)] rounded-full mr-3"></div>
                    <span className="text-gray-700">Our team will verify your credentials and license</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-[hsl(207,90%,54%)] rounded-full mr-3"></div>
                    <span className="text-gray-700">Background check and reference verification</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-[hsl(207,90%,54%)] rounded-full mr-3"></div>
                    <span className="text-gray-700">You'll receive an email with the decision</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-[hsl(207,90%,54%)] rounded-full mr-3"></div>
                    <span className="text-gray-700">If approved, access to provider dashboard and profile setup</span>
                  </div>
                </div>
              </div>
              <Button onClick={() => setLocation("/")} className="bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,44%)]">
                Return to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Apply to Become a Healthcare Provider
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join our network of verified healthcare professionals and expand your practice with in-home services.
          </p>
        </div>

        {/* Steps Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="text-center">
            <div className="w-12 h-12 bg-[hsl(207,90%,54%)] rounded-full flex items-center justify-center mx-auto mb-3">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">Application</h3>
            <p className="text-sm text-gray-600">Complete the form</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-3">
              <UserCheck className="h-6 w-6 text-gray-600" />
            </div>
            <h3 className="font-semibold text-gray-600">Verification</h3>
            <p className="text-sm text-gray-600">Credential review</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-3">
              <Star className="h-6 w-6 text-gray-600" />
            </div>
            <h3 className="font-semibold text-gray-600">Approval</h3>
            <p className="text-sm text-gray-600">Admin decision</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="h-6 w-6 text-gray-600" />
            </div>
            <h3 className="font-semibold text-gray-600">Welcome</h3>
            <p className="text-sm text-gray-600">Start practicing</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Provider Application Form</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => createProviderMutation.mutate(data))} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="(403) 555-0123" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Professional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Professional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="specialization"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Specialization</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your specialization" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="nursing">Registered Nurse</SelectItem>
                              <SelectItem value="physiotherapy">Physiotherapist</SelectItem>
                              <SelectItem value="dental">Dental Hygienist</SelectItem>
                              <SelectItem value="lab-tech">Lab Technician</SelectItem>
                              <SelectItem value="massage">Massage Therapist</SelectItem>
                              <SelectItem value="nutrition">Nutritionist</SelectItem>
                              <SelectItem value="mental-health">Mental Health Counselor</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="licenseNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>License Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Your professional license number" {...field} />
                          </FormControl>
                          <FormDescription>
                            Your professional license number (e.g., CRNA, CPSO, etc.)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="yearsExperience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Years of Experience</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            max="50" 
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Service Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Service Details</h3>
                  <FormField
                    control={form.control}
                    name="serviceAreas"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Area</FormLabel>
                        <FormControl>
                          <Input placeholder="Calgary, AB" {...field} />
                        </FormControl>
                        <FormDescription>
                          The geographic area you're willing to provide services in
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Professional Bio</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us about your background, experience, and approach to patient care..."
                            className="min-h-[120px]"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormDescription>
                          This will be displayed on your provider profile (minimum 50 characters)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="availability"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>General Availability</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="e.g., Monday-Friday 9AM-5PM, Weekend availability upon request..."
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormDescription>
                          Describe your general availability for home visits
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-6">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setLocation("/")}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createProviderMutation.isPending}
                    className="bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,44%)]"
                  >
                    {createProviderMutation.isPending ? "Submitting..." : "Submit Application"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
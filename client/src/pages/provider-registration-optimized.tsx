import React, { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Navigation from "@/components/Navigation";
import { providerSpecializations } from "@/lib/serviceCatalog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { z } from "zod";
import { UserCheck, FileText, Star, CheckCircle, Shield, AlertCircle } from "lucide-react";

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

// Optimized form schema with proper types
const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  specialization: z.string().min(1, "Please select a specialization"),
  licenseNumber: z.string().min(1, "License number is required"),
  yearsExperience: z.coerce.number().min(0).max(50),
  basePricing: z.coerce.number().nonnegative("Must be 0 or more").optional(),
  bio: z
    .string()
    .min(50, "Bio must be at least 50 characters")
    .max(500, "Bio must be 500 characters or fewer"),
  serviceAreas: z.array(z.string()).min(1, "Select at least one service area"),
  insuranceAccepted: z.array(z.string()).min(1, "Select at least one insurance option"),
  availability: z.string().min(1, "Availability is required"),
});

type FormData = z.infer<typeof formSchema>;

const ProviderRegistrationOptimized = React.memo(() => {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [consentHipaa, setConsentHipaa] = useState(false);
  const [consentBaa, setConsentBaa] = useState(false);
  const [consentTerms, setConsentTerms] = useState(false);

  useEffect(() => {
    document.title = "Apply as a Provider — MedLink Marketplace";
  }, []);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: "",
      specialization: "",
      licenseNumber: "",
      yearsExperience: 0,
      basePricing: 0,
      bio: "",
      serviceAreas: [],
      insuranceAccepted: [],
      availability: "",
    },
  });

  const grantConsentMutation = useMutation({
    mutationFn: async (consentType: string) =>
      apiRequest("POST", "/api/user/consent", { consentType, version: "1.0", isGranted: true }),
  });

  // Memoized mutation
  const createProviderMutation = useMutation({
    mutationFn: useCallback(async (data: FormData) => {
      const { firstName, lastName, email, phone, ...formData } = data;
      
      const providerData = {
        ...formData,
        serviceAreas: formData.serviceAreas,
        basePricing: formData.basePricing || null,
        insuranceAccepted: formData.insuranceAccepted,
        availability: formData.availability || null,
        bio: formData.bio || null,
      };
      
      const response = await apiRequest("POST", "/api/providers", providerData);
      return await response.json();
    }, []),
    onSuccess: useCallback(() => {
      setSubmissionError(null);
      toast({
        title: "Application Submitted!",
        description: "Your provider application has been submitted successfully.",
      });
      setIsSubmitted(true);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    }, [toast, queryClient]),
    onError: useCallback((error: Error) => {
      const message =
        error.message.replace(/^\d+:\s*/, "") ||
        "Failed to submit application. Please try again.";
      setSubmissionError(message);
      toast({
        title: "Application Failed",
        description: message,
        variant: "destructive",
      });
    }, [toast]),
  });

  // Handle authentication redirect
  useEffect(() => {
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

  // Memoized form submit handler
  const onSubmit = useCallback(async (data: FormData) => {
    setSubmissionError(null);
    if (!consentHipaa || !consentBaa || !consentTerms) {
      toast({
        title: "Consent Required",
        description: "You must accept all agreements before submitting your application.",
        variant: "destructive",
      });
      return;
    }
    // Record consents before submitting provider application
    await Promise.all([
      grantConsentMutation.mutateAsync("hipaa_npp"),
      grantConsentMutation.mutateAsync("baa"),
      grantConsentMutation.mutateAsync("terms"),
    ]).catch(() => {
      // non-fatal — proceed with provider creation
    });
    createProviderMutation.mutate(data);
  }, [consentHipaa, consentBaa, consentTerms, createProviderMutation, grantConsentMutation, toast]);

  // Early returns for performance
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
          {[
            { icon: FileText, title: "Application", desc: "Complete the form" },
            { icon: UserCheck, title: "Verification", desc: "Credential review" },
            { icon: Star, title: "Approval", desc: "Admin decision" },
            { icon: CheckCircle, title: "Welcome", desc: "Start practicing" }
          ].map((step, index) => (
            <div key={step.title} className="text-center">
              <div className={`w-12 h-12 ${index === 0 ? 'bg-[hsl(207,90%,54%)]' : 'bg-gray-300'} rounded-full flex items-center justify-center mx-auto mb-3`}>
                <step.icon className={`h-6 w-6 ${index === 0 ? 'text-white' : 'text-gray-600'}`} />
              </div>
              <h3 className={`font-semibold ${index === 0 ? 'text-gray-900' : 'text-gray-600'}`}>{step.title}</h3>
              <p className="text-sm text-gray-600">{step.desc}</p>
            </div>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Provider Application Form</CardTitle>
          </CardHeader>
          <CardContent>
            {submissionError && (
              <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <p className="font-semibold">Application could not be submitted</p>
                  <p>{submissionError}</p>
                </div>
              </div>
            )}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4 border-b border-gray-200 pb-6">
                  <h3 className="border-b border-gray-200 pb-2 text-lg font-semibold text-gray-900">
                    About You
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input {...field} required aria-required="true" />
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
                            <Input {...field} required aria-required="true" />
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
                            <Input type="email" {...field} required aria-required="true" />
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
                            <Input
                              type="tel"
                              placeholder="(403) 555-0123"
                              {...field}
                              required
                              aria-required="true"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-4 border-b border-gray-200 pb-6">
                  <h3 className="border-b border-gray-200 pb-2 text-lg font-semibold text-gray-900">
                    Your Practice
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="specialization"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discipline / Specialization *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your discipline" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {providerSpecializations.map((spec) => (
                                <SelectItem key={spec} value={spec}>
                                  {spec}
                                </SelectItem>
                              ))}
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
                            <Input
                              placeholder="Your professional license number"
                              {...field}
                              required
                              aria-required="true"
                            />
                          </FormControl>
                          <FormDescription>
                            Your professional license number (e.g., CRNA, CPSO, etc.)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                              required
                              aria-required="true"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="basePricing"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Base Pricing (CAD)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" step="0.01" placeholder="e.g. 120" {...field} />
                          </FormControl>
                          <p className="text-xs text-gray-500">Your starting rate per visit in CAD</p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="serviceAreas"
                    render={() => (
                      <FormItem>
                        <FormLabel>
                          Service Areas *{" "}
                          <span className="text-sm text-gray-500 font-normal">
                            (select all that apply)
                          </span>
                        </FormLabel>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {CALGARY_AREAS.map((area) => (
                            <FormField
                              key={area}
                              control={form.control}
                              name="serviceAreas"
                              render={({ field }) => (
                                <FormItem className="flex items-center space-x-2">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(area)}
                                      onCheckedChange={(checked) => {
                                        const current = field.value || [];
                                        field.onChange(
                                          checked
                                            ? [...current, area]
                                            : current.filter((v: string) => v !== area),
                                        );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">{area}</FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
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
                            maxLength={500}
                            {...field}
                            required
                            aria-required="true"
                          />
                        </FormControl>
                        <p className="text-xs text-gray-500 text-right">{(form.watch("bio") || "").length}/500</p>
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
                              required
                              aria-required="true"
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

                <div className="space-y-4 pt-2">
                  <h3 className="border-b border-gray-200 pb-2 text-lg font-semibold text-gray-900">
                    Insurance & Consent
                  </h3>
                  <FormField
                    control={form.control}
                    name="insuranceAccepted"
                    render={() => (
                      <FormItem>
                        <FormLabel>Insurance Accepted *</FormLabel>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                          {INSURANCE_OPTIONS.map((option) => (
                            <FormField
                              key={option}
                              control={form.control}
                              name="insuranceAccepted"
                              render={({ field }) => (
                                <FormItem className="flex items-center space-x-2">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(option)}
                                      onCheckedChange={(checked) => {
                                        const current = field.value || [];
                                        field.onChange(
                                          checked
                                            ? [...current, option]
                                            : current.filter((v: string) => v !== option),
                                        );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">{option}</FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Legal Agreements</h3>
                  </div>

                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-gray-700 space-y-2">
                    <p className="font-semibold text-blue-800">HIPAA Business Associate Agreement (BAA)</p>
                    <p>
                      As a healthcare provider on MedLink, you will access Protected Health
                      Information (PHI) belonging to patients. Under HIPAA and the Alberta Health
                      Information Act, you agree to: safeguard all PHI, use it only to provide
                      care, report any breaches within 72 hours, and comply with all applicable
                      privacy laws.
                    </p>
                    <p className="text-xs text-gray-500">
                      This constitutes a legally binding Business Associate Agreement between you
                      and MedLink House Calls Inc.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-start gap-3 rounded-lg border p-3 hover:bg-gray-50 transition-colors cursor-pointer">
                      <Checkbox
                        checked={consentHipaa}
                        onCheckedChange={(v) => setConsentHipaa(Boolean(v))}
                        className="mt-0.5"
                        aria-required="true"
                      />
                      <div>
                        <p className="font-medium text-sm">I acknowledge the Notice of Privacy Practices</p>
                        <p className="text-xs text-gray-500">
                          I understand how patient health information is collected, used, and protected.
                        </p>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 rounded-lg border p-3 hover:bg-gray-50 transition-colors cursor-pointer">
                      <Checkbox
                        checked={consentBaa}
                        onCheckedChange={(v) => setConsentBaa(Boolean(v))}
                        className="mt-0.5"
                        aria-required="true"
                      />
                      <div>
                        <p className="font-medium text-sm">I accept the Business Associate Agreement (BAA)</p>
                        <p className="text-xs text-gray-500">
                          I agree to safeguard patient PHI and comply with HIPAA and HIA obligations.
                        </p>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 rounded-lg border p-3 hover:bg-gray-50 transition-colors cursor-pointer">
                      <Checkbox
                        checked={consentTerms}
                        onCheckedChange={(v) => setConsentTerms(Boolean(v))}
                        className="mt-0.5"
                        aria-required="true"
                      />
                      <div>
                        <p className="font-medium text-sm">I accept the Provider Terms of Service</p>
                        <p className="text-xs text-gray-500">
                          I agree to MedLink's terms governing the provider relationship and conduct.
                        </p>
                      </div>
                    </label>
                  </div>

                  {(!consentHipaa || !consentBaa || !consentTerms) && (
                    <div
                      id="provider-consent-requirements"
                      className="flex items-start gap-2 text-xs text-gray-500 bg-amber-50 border border-amber-100 rounded p-2"
                    >
                      <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span>All three agreements must be accepted before you can submit your application.</span>
                    </div>
                  )}
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
                    disabled={createProviderMutation.isPending || !consentHipaa || !consentBaa || !consentTerms}
                    aria-disabled={createProviderMutation.isPending || !consentHipaa || !consentBaa || !consentTerms}
                    aria-describedby="provider-consent-requirements"
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
});

ProviderRegistrationOptimized.displayName = "ProviderRegistrationOptimized";

export default ProviderRegistrationOptimized;

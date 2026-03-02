import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Shield,
  User,
  Heart,
  Phone,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
} from "lucide-react";

// ─── Schemas ─────────────────────────────────────────────────────────────────

const consentSchema = z.object({
  hipaa: z.boolean().refine((v) => v === true, {
    message: "You must acknowledge the Notice of Privacy Practices to continue.",
  }),
  terms: z.boolean().refine((v) => v === true, {
    message: "You must accept the Terms of Service to continue.",
  }),
  privacy: z.boolean().refine((v) => v === true, {
    message: "You must accept the Privacy Policy to continue.",
  }),
});

const profileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  phoneNumber: z.string().min(10, "Enter a valid phone number").optional().or(z.literal("")),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
});

const healthSchema = z.object({
  allergies: z.string().optional(),
  medications: z.string().optional(),
  chronicConditions: z.string().optional(),
  bloodType: z.string().optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
});

const emergencySchema = z.object({
  name: z.string().optional(),
  relationship: z.string().optional(),
  phoneNumber: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
});

type ConsentData = z.infer<typeof consentSchema>;
type ProfileData = z.infer<typeof profileSchema>;
type HealthData = z.infer<typeof healthSchema>;
type EmergencyData = z.infer<typeof emergencySchema>;

// ─── Step metadata ────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, title: "Privacy & Consent", icon: Shield, description: "Required disclosures" },
  { id: 2, title: "Your Profile", icon: User, description: "Basic information" },
  { id: 3, title: "Health Information", icon: Heart, description: "Optional but helpful" },
  { id: 4, title: "Emergency Contact", icon: Phone, description: "Recommended" },
  { id: 5, title: "All Done!", icon: CheckCircle, description: "" },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

interface OnboardingWizardProps {
  userName?: string;
}

export function OnboardingWizard({ userName }: OnboardingWizardProps) {
  const [step, setStep] = useState(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Forms for each step
  const consentForm = useForm<ConsentData>({
    resolver: zodResolver(consentSchema),
    defaultValues: { hipaa: false, terms: false, privacy: false },
  });

  const profileForm = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { firstName: "", lastName: "", phoneNumber: "", dateOfBirth: "", gender: "" },
  });

  const healthForm = useForm<HealthData>({
    resolver: zodResolver(healthSchema),
    defaultValues: {},
  });

  const emergencyForm = useForm<EmergencyData>({
    resolver: zodResolver(emergencySchema),
    defaultValues: {},
  });

  // ── Mutations ────────────────────────────────────────────────────────────────

  const grantConsent = useMutation({
    mutationFn: async (consentType: string) =>
      apiRequest("POST", "/api/user/consent", { consentType, version: "1.0", isGranted: true }),
  });

  const updateProfile = useMutation({
    mutationFn: async (data: ProfileData) =>
      apiRequest("PATCH", "/api/user/profile", {
        ...data,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString() : undefined,
      }),
  });

  const createHealthProfile = useMutation({
    mutationFn: async (data: HealthData) =>
      apiRequest("POST", "/api/user/health-profile", data),
  });

  const createEmergencyContact = useMutation({
    mutationFn: async (data: EmergencyData) =>
      apiRequest("POST", "/api/user/emergency-contacts", {
        ...data,
        isPrimary: true,
      }),
  });

  const completeOnboarding = useMutation({
    mutationFn: async () => apiRequest("POST", "/api/user/onboarding/complete", {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
  });

  // ── Step handlers ─────────────────────────────────────────────────────────────

  const handleConsentNext = consentForm.handleSubmit(async () => {
    try {
      await Promise.all([
        grantConsent.mutateAsync("hipaa_npp"),
        grantConsent.mutateAsync("terms"),
        grantConsent.mutateAsync("privacy"),
      ]);
      setStep(2);
    } catch {
      toast({ title: "Error", description: "Failed to record consent. Please try again.", variant: "destructive" });
    }
  });

  const handleProfileNext = profileForm.handleSubmit(async (data) => {
    try {
      await updateProfile.mutateAsync(data);
      setStep(3);
    } catch {
      toast({ title: "Error", description: "Failed to save profile. Please try again.", variant: "destructive" });
    }
  });

  const handleHealthNext = async (skip = false) => {
    if (!skip) {
      const valid = await healthForm.trigger();
      if (valid) {
        const data = healthForm.getValues();
        const hasData = Object.values(data).some((v) => v && String(v).trim().length > 0);
        if (hasData) {
          try {
            await createHealthProfile.mutateAsync(data);
          } catch {
            // non-fatal, continue
          }
        }
      }
    }
    setStep(4);
  };

  const handleEmergencyNext = async (skip = false) => {
    if (!skip) {
      const valid = await emergencyForm.trigger();
      if (valid) {
        const data = emergencyForm.getValues();
        if (data.name && data.phoneNumber && data.relationship) {
          try {
            await createEmergencyContact.mutateAsync(data);
          } catch {
            // non-fatal, continue
          }
        }
      }
    }
    setStep(5);
  };

  const handleFinish = async () => {
    try {
      await completeOnboarding.mutateAsync();
    } catch {
      toast({ title: "Error", description: "Failed to complete setup. Please refresh.", variant: "destructive" });
    }
  };

  // ── Progress ──────────────────────────────────────────────────────────────────

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <Dialog open modal>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        // Prevent closing by clicking outside or pressing Escape on step 1
        onPointerDownOutside={(e) => step === 1 && e.preventDefault()}
        onEscapeKeyDown={(e) => step === 1 && e.preventDefault()}
      >
        {/* Header */}
        <DialogHeader className="pb-2">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              {(() => {
                const Icon = STEPS[step - 1].icon;
                return <Icon className="w-4 h-4 text-blue-600" />;
              })()}
            </div>
            <Badge variant="outline" className="text-xs text-blue-600 border-blue-200">
              Step {step} of {STEPS.length}
            </Badge>
          </div>
          <DialogTitle className="text-xl font-semibold">
            {step === 1 && `Welcome to MedLink${userName ? `, ${userName}` : ""}!`}
            {step > 1 && STEPS[step - 1].title}
          </DialogTitle>
          {STEPS[step - 1].description && (
            <DialogDescription>{STEPS[step - 1].description}</DialogDescription>
          )}
        </DialogHeader>

        {/* Progress bar */}
        <Progress value={progress} className="h-1.5 mb-4" />

        {/* ── Step 1: Consent ── */}
        {step === 1 && (
          <Form {...consentForm}>
            <form onSubmit={handleConsentNext} className="space-y-5">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-gray-700 space-y-2">
                <p className="font-semibold text-blue-800">Notice of Privacy Practices (HIPAA / HIA)</p>
                <p>
                  MedLink House Calls is committed to protecting your health information. We collect
                  and use your personal health information (PHI) to: provide healthcare services,
                  coordinate care between providers, process payments, and comply with legal
                  obligations.
                </p>
                <p>
                  Your information is stored securely. You have the right to access, amend, and
                  request restrictions on your PHI. We will not sell your data. We share your
                  information only with providers involved in your care and as required by law.
                </p>
                <p className="text-xs text-gray-500">
                  This notice is provided in compliance with the Alberta Health Information Act (HIA),
                  PIPEDA, and HIPAA (where applicable). For the full notice, see our Privacy Policy.
                </p>
              </div>

              <div className="space-y-3">
                <FormField
                  control={consentForm.control}
                  name="hipaa"
                  render={({ field }) => (
                    <FormItem className="flex items-start gap-3 rounded-lg border p-3 hover:bg-gray-50 transition-colors">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="mt-0.5"
                        />
                      </FormControl>
                      <div className="space-y-0.5">
                        <FormLabel className="font-medium cursor-pointer">
                          I acknowledge the Notice of Privacy Practices
                        </FormLabel>
                        <p className="text-xs text-gray-500">
                          I have read and understand how MedLink collects and uses my health information.
                        </p>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={consentForm.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem className="flex items-start gap-3 rounded-lg border p-3 hover:bg-gray-50 transition-colors">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="mt-0.5"
                        />
                      </FormControl>
                      <div className="space-y-0.5">
                        <FormLabel className="font-medium cursor-pointer">
                          I accept the Terms of Service
                        </FormLabel>
                        <p className="text-xs text-gray-500">
                          I agree to MedLink's Terms of Service governing use of the platform.
                        </p>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={consentForm.control}
                  name="privacy"
                  render={({ field }) => (
                    <FormItem className="flex items-start gap-3 rounded-lg border p-3 hover:bg-gray-50 transition-colors">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="mt-0.5"
                        />
                      </FormControl>
                      <div className="space-y-0.5">
                        <FormLabel className="font-medium cursor-pointer">
                          I accept the Privacy Policy
                        </FormLabel>
                        <p className="text-xs text-gray-500">
                          I consent to data collection and use as described in the Privacy Policy.
                        </p>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-start gap-2 text-xs text-gray-500 bg-amber-50 border border-amber-100 rounded p-2">
                <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                <span>
                  Consent is required to use MedLink. Your acceptance is recorded with a timestamp
                  and IP address for compliance purposes.
                </span>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={grantConsent.isPending}
              >
                {grantConsent.isPending ? "Saving…" : "Accept & Continue"}
                <ChevronRight className="ml-1 w-4 h-4" />
              </Button>
            </form>
          </Form>
        )}

        {/* ── Step 2: Basic Profile ── */}
        {step === 2 && (
          <Form {...profileForm}>
            <form onSubmit={handleProfileNext} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={profileForm.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Jane" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Smith" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={profileForm.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (403) 555-0100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={profileForm.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Female" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                  <ChevronLeft className="mr-1 w-4 h-4" /> Back
                </Button>
                <Button type="submit" className="flex-1" disabled={updateProfile.isPending}>
                  {updateProfile.isPending ? "Saving…" : "Continue"}
                  <ChevronRight className="ml-1 w-4 h-4" />
                </Button>
              </div>
            </form>
          </Form>
        )}

        {/* ── Step 3: Health Information ── */}
        {step === 3 && (
          <Form {...healthForm}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleHealthNext(false);
              }}
              className="space-y-4"
            >
              <p className="text-sm text-gray-500">
                This information helps providers deliver better care. You can update it anytime from
                your profile settings.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={healthForm.control}
                  name="bloodType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blood Type</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. A+" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={healthForm.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 5'7&quot;" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={healthForm.control}
                name="allergies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Known Allergies</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g. Penicillin, peanuts, latex…"
                        rows={2}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={healthForm.control}
                name="medications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Medications</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="List any medications you currently take…"
                        rows={2}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={healthForm.control}
                name="chronicConditions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chronic Conditions</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g. Diabetes (Type 2), hypertension…"
                        rows={2}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1">
                  <ChevronLeft className="mr-1 w-4 h-4" /> Back
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => handleHealthNext(true)}
                  className="flex-1 text-gray-500"
                >
                  Skip for now
                </Button>
                <Button type="submit" className="flex-1" disabled={createHealthProfile.isPending}>
                  {createHealthProfile.isPending ? "Saving…" : "Continue"}
                  <ChevronRight className="ml-1 w-4 h-4" />
                </Button>
              </div>
            </form>
          </Form>
        )}

        {/* ── Step 4: Emergency Contact ── */}
        {step === 4 && (
          <Form {...emergencyForm}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEmergencyNext(false);
              }}
              className="space-y-4"
            >
              <p className="text-sm text-gray-500">
                Your emergency contact will only be used in urgent medical situations.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={emergencyForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. John Smith" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={emergencyForm.control}
                  name="relationship"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Spouse, Parent" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={emergencyForm.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (403) 555-0199" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={emergencyForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (optional)</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setStep(3)} className="flex-1">
                  <ChevronLeft className="mr-1 w-4 h-4" /> Back
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => handleEmergencyNext(true)}
                  className="flex-1 text-gray-500"
                >
                  Skip for now
                </Button>
                <Button type="submit" className="flex-1" disabled={createEmergencyContact.isPending}>
                  {createEmergencyContact.isPending ? "Saving…" : "Continue"}
                  <ChevronRight className="ml-1 w-4 h-4" />
                </Button>
              </div>
            </form>
          </Form>
        )}

        {/* ── Step 5: Done ── */}
        {step === 5 && (
          <div className="text-center space-y-5 py-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">You're all set!</h3>
              <p className="text-sm text-gray-500 mt-1">
                Your profile is ready. You can update your health information, insurance details,
                and more anytime from your dashboard settings.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center text-xs text-gray-500">
              <div className="rounded-lg bg-blue-50 p-3">
                <Shield className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                <span>Privacy consent recorded</span>
              </div>
              <div className="rounded-lg bg-green-50 p-3">
                <Heart className="w-5 h-5 text-green-500 mx-auto mb-1" />
                <span>Health profile started</span>
              </div>
              <div className="rounded-lg bg-purple-50 p-3">
                <Phone className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                <span>Emergency contact saved</span>
              </div>
            </div>

            <Button
              className="w-full"
              onClick={handleFinish}
              disabled={completeOnboarding.isPending}
            >
              {completeOnboarding.isPending ? "Finishing setup…" : "Go to My Dashboard"}
              <ChevronRight className="ml-1 w-4 h-4" />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

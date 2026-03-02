import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest, apiRequestJson } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const healthProfileSchema = z.object({
  height: z.string().optional(),
  weight: z.string().optional(),
  bloodType: z.string().optional(),
  allergies: z.string().optional(),
  medications: z.string().optional(),
  chronicConditions: z.string().optional(),
  medicalHistory: z.string().optional(),
  surgicalHistory: z.string().optional(),
  familyHistory: z.string().optional(),
  emergencyMedicalInfo: z.string().optional(),
});

type HealthProfileFormData = z.infer<typeof healthProfileSchema>;

interface HealthProfile extends HealthProfileFormData {
  id: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export function HealthProfileManagement() {
  const [hasInitialized, setHasInitialized] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<HealthProfileFormData>({
    resolver: zodResolver(healthProfileSchema),
    defaultValues: {
      height: "",
      weight: "",
      bloodType: "",
      allergies: "",
      medications: "",
      chronicConditions: "",
      medicalHistory: "",
      surgicalHistory: "",
      familyHistory: "",
      emergencyMedicalInfo: "",
    },
  });

  const { data: healthProfile, isLoading } = useQuery<HealthProfile | null>({
    queryKey: ["/api/user/health-profile"],
    queryFn: () => apiRequestJson<HealthProfile | null>("GET", "/api/user/health-profile"),
  });

  useEffect(() => {
    if (!hasInitialized && healthProfile) {
      form.reset({
        height: healthProfile.height || "",
        weight: healthProfile.weight || "",
        bloodType: healthProfile.bloodType || "",
        allergies: healthProfile.allergies || "",
        medications: healthProfile.medications || "",
        chronicConditions: healthProfile.chronicConditions || "",
        medicalHistory: healthProfile.medicalHistory || "",
        surgicalHistory: healthProfile.surgicalHistory || "",
        familyHistory: healthProfile.familyHistory || "",
        emergencyMedicalInfo: healthProfile.emergencyMedicalInfo || "",
      });
      setHasInitialized(true);
    }
  }, [hasInitialized, healthProfile, form]);

  const saveProfileMutation = useMutation({
    mutationFn: (data: HealthProfileFormData) => {
      const payload = {
        height: data.height || null,
        weight: data.weight || null,
        bloodType: data.bloodType || null,
        allergies: data.allergies || null,
        medications: data.medications || null,
        chronicConditions: data.chronicConditions || null,
        medicalHistory: data.medicalHistory || null,
        surgicalHistory: data.surgicalHistory || null,
        familyHistory: data.familyHistory || null,
        emergencyMedicalInfo: data.emergencyMedicalInfo || null,
      };

      if (healthProfile?.id) {
        return apiRequest("PUT", `/api/user/health-profile/${healthProfile.id}`, payload);
      }
      return apiRequest("POST", "/api/user/health-profile", payload);
    },
    onSuccess: () => {
      toast({
        title: "Health Profile Saved",
        description: "Your health profile has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/health-profile"] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Save",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: HealthProfileFormData) => {
    saveProfileMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-2xl rounded-3xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-green-50 to-green-25 p-8">
        <CardTitle className="text-2xl font-bold flex items-center gap-3">
          <Heart className="h-6 w-6" />
          Health Profile
        </CardTitle>
        <CardDescription className="text-base mt-2">
          Keep core medical information up to date so providers can deliver safer care
        </CardDescription>
      </CardHeader>

      <CardContent className="p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="5'10 or 178 cm" data-testid="input-height" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="150 lbs or 68 kg" data-testid="input-weight" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bloodType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blood Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-blood-type">
                          <SelectValue placeholder="Select blood type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="allergies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allergies (comma separated)</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Penicillin, peanuts" data-testid="textarea-allergies" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="medications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Medications (comma separated)</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Medication name and dosage" data-testid="textarea-medications" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="chronicConditions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chronic Conditions</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Diabetes, hypertension" data-testid="textarea-chronic-conditions" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="medicalHistory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medical History</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Major diagnoses and treatment history" data-testid="textarea-medical-history" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="surgicalHistory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Surgical History</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Past surgeries and dates" data-testid="textarea-surgical-history" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="familyHistory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Family History</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Relevant hereditary health conditions" data-testid="textarea-family-history" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="emergencyMedicalInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Emergency Medical Information</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Critical info for emergency situations" data-testid="textarea-emergency-medical-info" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={saveProfileMutation.isPending} data-testid="button-save-health-profile">
                {saveProfileMutation.isPending && (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                )}
                Save Health Profile
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

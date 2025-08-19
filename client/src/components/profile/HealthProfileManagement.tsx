import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Heart, Plus, Edit, Trash2, AlertTriangle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const healthProfileSchema = z.object({
  height: z.string().optional(),
  weight: z.string().optional(),
  bloodType: z.string().optional(),
  allergies: z.array(z.string()).default([]),
  medications: z.array(z.string()).default([]),
  medicalConditions: z.array(z.string()).default([]),
  emergencyMedicalInfo: z.string().optional(),
  dietaryRestrictions: z.array(z.string()).default([]),
  exerciseLevel: z.string().optional(),
  smokingStatus: z.string().optional(),
  alcoholConsumption: z.string().optional(),
});

type HealthProfileFormData = z.infer<typeof healthProfileSchema>;

interface HealthProfile extends HealthProfileFormData {
  id: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export function HealthProfileManagement() {
  const [allergiesInput, setAllergiesInput] = useState("");
  const [medicationsInput, setMedicationsInput] = useState("");
  const [conditionsInput, setConditionsInput] = useState("");
  const [dietaryInput, setDietaryInput] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<HealthProfileFormData>({
    resolver: zodResolver(healthProfileSchema),
    defaultValues: {
      height: "",
      weight: "",
      bloodType: "",
      allergies: [],
      medications: [],
      medicalConditions: [],
      emergencyMedicalInfo: "",
      dietaryRestrictions: [],
      exerciseLevel: "",
      smokingStatus: "",
      alcoholConsumption: "",
    },
  });

  // Fetch health profile
  const { data: healthProfile, isLoading } = useQuery({
    queryKey: ['/api/user/health-profile'],
    queryFn: () => apiRequest('GET', '/api/user/health-profile'),
  });

  // Create or update health profile mutation
  const saveProfileMutation = useMutation({
    mutationFn: (data: HealthProfileFormData) => {
      if (healthProfile) {
        return apiRequest('PUT', `/api/user/health-profile/${healthProfile.id}`, data);
      } else {
        return apiRequest('POST', '/api/user/health-profile', data);
      }
    },
    onSuccess: () => {
      toast({
        title: "Health Profile Saved",
        description: "Your health profile has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/user/health-profile'] });
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

  const addToArray = (field: keyof HealthProfileFormData, value: string, setter: (value: string) => void) => {
    if (value.trim()) {
      const currentValues = form.getValues(field) as string[];
      form.setValue(field, [...currentValues, value.trim()] as any);
      setter("");
    }
  };

  const removeFromArray = (field: keyof HealthProfileFormData, index: number) => {
    const currentValues = form.getValues(field) as string[];
    form.setValue(field, currentValues.filter((_, i) => i !== index) as any);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // Initialize form with existing data
  if (healthProfile && !form.formState.isDirty) {
    form.reset({
      height: healthProfile.height || "",
      weight: healthProfile.weight || "",
      bloodType: healthProfile.bloodType || "",
      allergies: healthProfile.allergies || [],
      medications: healthProfile.medications || [],
      medicalConditions: healthProfile.medicalConditions || [],
      emergencyMedicalInfo: healthProfile.emergencyMedicalInfo || "",
      dietaryRestrictions: healthProfile.dietaryRestrictions || [],
      exerciseLevel: healthProfile.exerciseLevel || "",
      smokingStatus: healthProfile.smokingStatus || "",
      alcoholConsumption: healthProfile.alcoholConsumption || "",
    });
  }

  return (
    <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-2xl rounded-3xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-green-50 to-green-25 p-8">
        <CardTitle className="text-2xl font-bold flex items-center gap-3">
          <Heart className="h-6 w-6" />
          Health Profile
        </CardTitle>
        <CardDescription className="text-base mt-2">
          Manage your health information to help providers deliver better care
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Health Metrics */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Basic Health Metrics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="5'10&quot; or 178 cm"
                          data-testid="input-height"
                        />
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
                        <Input 
                          {...field} 
                          placeholder="150 lbs or 68 kg"
                          data-testid="input-weight"
                        />
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
            </div>

            {/* Allergies */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Allergies
              </h3>
              <div className="flex gap-2">
                <Input
                  value={allergiesInput}
                  onChange={(e) => setAllergiesInput(e.target.value)}
                  placeholder="Add an allergy"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addToArray('allergies', allergiesInput, setAllergiesInput);
                    }
                  }}
                  data-testid="input-add-allergy"
                />
                <Button
                  type="button"
                  onClick={() => addToArray('allergies', allergiesInput, setAllergiesInput)}
                  data-testid="button-add-allergy"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.watch('allergies').map((allergy, index) => (
                  <Badge 
                    key={index} 
                    variant="destructive" 
                    className="cursor-pointer"
                    onClick={() => removeFromArray('allergies', index)}
                    data-testid={`allergy-${index}`}
                  >
                    {allergy} ×
                  </Badge>
                ))}
              </div>
            </div>

            {/* Medications */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Current Medications
              </h3>
              <div className="flex gap-2">
                <Input
                  value={medicationsInput}
                  onChange={(e) => setMedicationsInput(e.target.value)}
                  placeholder="Add a medication"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addToArray('medications', medicationsInput, setMedicationsInput);
                    }
                  }}
                  data-testid="input-add-medication"
                />
                <Button
                  type="button"
                  onClick={() => addToArray('medications', medicationsInput, setMedicationsInput)}
                  data-testid="button-add-medication"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.watch('medications').map((medication, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => removeFromArray('medications', index)}
                    data-testid={`medication-${index}`}
                  >
                    {medication} ×
                  </Badge>
                ))}
              </div>
            </div>

            {/* Medical Conditions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                Medical Conditions
              </h3>
              <div className="flex gap-2">
                <Input
                  value={conditionsInput}
                  onChange={(e) => setConditionsInput(e.target.value)}
                  placeholder="Add a medical condition"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addToArray('medicalConditions', conditionsInput, setConditionsInput);
                    }
                  }}
                  data-testid="input-add-condition"
                />
                <Button
                  type="button"
                  onClick={() => addToArray('medicalConditions', conditionsInput, setConditionsInput)}
                  data-testid="button-add-condition"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.watch('medicalConditions').map((condition, index) => (
                  <Badge 
                    key={index} 
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => removeFromArray('medicalConditions', index)}
                    data-testid={`condition-${index}`}
                  >
                    {condition} ×
                  </Badge>
                ))}
              </div>
            </div>

            {/* Lifestyle Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Lifestyle Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="exerciseLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exercise Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-exercise">
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="sedentary">Sedentary</SelectItem>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="very-active">Very Active</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="smokingStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Smoking Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-smoking">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="never">Never</SelectItem>
                          <SelectItem value="former">Former</SelectItem>
                          <SelectItem value="current">Current</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="alcoholConsumption"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alcohol Consumption</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-alcohol">
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="never">Never</SelectItem>
                          <SelectItem value="rarely">Rarely</SelectItem>
                          <SelectItem value="occasionally">Occasionally</SelectItem>
                          <SelectItem value="regularly">Regularly</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Dietary Restrictions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                Dietary Restrictions
              </h3>
              <div className="flex gap-2">
                <Input
                  value={dietaryInput}
                  onChange={(e) => setDietaryInput(e.target.value)}
                  placeholder="Add a dietary restriction"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addToArray('dietaryRestrictions', dietaryInput, setDietaryInput);
                    }
                  }}
                  data-testid="input-add-dietary"
                />
                <Button
                  type="button"
                  onClick={() => addToArray('dietaryRestrictions', dietaryInput, setDietaryInput)}
                  data-testid="button-add-dietary"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.watch('dietaryRestrictions').map((restriction, index) => (
                  <Badge 
                    key={index} 
                    variant="outline"
                    className="cursor-pointer border-orange-300 text-orange-700"
                    onClick={() => removeFromArray('dietaryRestrictions', index)}
                    data-testid={`dietary-${index}`}
                  >
                    {restriction} ×
                  </Badge>
                ))}
              </div>
            </div>

            {/* Emergency Medical Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Emergency Medical Information
              </h3>
              <FormField
                control={form.control}
                name="emergencyMedicalInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Critical Information for Emergency Responders</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Include any critical medical information that emergency responders should know immediately..."
                        className="min-h-24 resize-none"
                        data-testid="textarea-emergency-info"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end pt-6">
              <Button 
                type="submit" 
                disabled={saveProfileMutation.isPending}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                data-testid="button-save-health-profile"
              >
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
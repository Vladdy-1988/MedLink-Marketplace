import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AddressManagement } from "./AddressManagement";
import { EmergencyContactManagement } from "./EmergencyContactManagement";
import { HealthProfileManagement } from "./HealthProfileManagement";
import { FamilyMemberManagement } from "./FamilyMemberManagement";
import { InsuranceManagement } from "./InsuranceManagement";
import { PaymentMethodManagement } from "./PaymentMethodManagement";
import { 
  User, 
  MapPin, 
  Phone, 
  Heart, 
  Users, 
  Shield, 
  CreditCard,
  Settings,
  Save
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const profileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  bio: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

/**
 * Comprehensive user profile management interface with Apple-inspired design
 * Provides tabbed interface for managing all aspects of user profile
 */
export function UserProfileTabs() {
  const [activeTab, setActiveTab] = useState("profile");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user profile data
  const { data: user, isLoading } = useQuery({
    queryKey: ['/api/auth/user'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/auth/user');
      return response.json();
    },
  });

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      bio: "",
    },
  });

  // Update user profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const response = await apiRequest('PUT', '/api/auth/user', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Initialize form with user data when available
  if (user && !form.formState.isDirty) {
    form.reset({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phone: user.phone || "",
      dateOfBirth: user.dateOfBirth || "",
      bio: user.bio || "",
    });
  }

  const onSubmit = (data: ProfileFormData) => {
    updateProfileMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Profile Management
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Manage your personal information, addresses, emergency contacts, and more in one comprehensive dashboard.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7 h-auto p-1 bg-background/60 backdrop-blur-sm border rounded-2xl">
          <TabsTrigger 
            value="profile" 
            className="flex flex-col items-center gap-2 p-4 data-[state=active]:bg-white data-[state=active]:shadow-lg rounded-xl transition-all duration-200"
            data-testid="tab-profile"
          >
            <User className="h-5 w-5" />
            <span className="text-sm font-medium">Profile</span>
          </TabsTrigger>
          <TabsTrigger 
            value="addresses" 
            className="flex flex-col items-center gap-2 p-4 data-[state=active]:bg-white data-[state=active]:shadow-lg rounded-xl transition-all duration-200"
            data-testid="tab-addresses"
          >
            <MapPin className="h-5 w-5" />
            <span className="text-sm font-medium">Addresses</span>
          </TabsTrigger>
          <TabsTrigger 
            value="emergency" 
            className="flex flex-col items-center gap-2 p-4 data-[state=active]:bg-white data-[state=active]:shadow-lg rounded-xl transition-all duration-200"
            data-testid="tab-emergency"
          >
            <Phone className="h-5 w-5" />
            <span className="text-sm font-medium">Emergency</span>
          </TabsTrigger>
          <TabsTrigger 
            value="health" 
            className="flex flex-col items-center gap-2 p-4 data-[state=active]:bg-white data-[state=active]:shadow-lg rounded-xl transition-all duration-200"
            data-testid="tab-health"
          >
            <Heart className="h-5 w-5" />
            <span className="text-sm font-medium">Health</span>
          </TabsTrigger>
          <TabsTrigger 
            value="family" 
            className="flex flex-col items-center gap-2 p-4 data-[state=active]:bg-white data-[state=active]:shadow-lg rounded-xl transition-all duration-200"
            data-testid="tab-family"
          >
            <Users className="h-5 w-5" />
            <span className="text-sm font-medium">Family</span>
          </TabsTrigger>
          <TabsTrigger 
            value="insurance" 
            className="flex flex-col items-center gap-2 p-4 data-[state=active]:bg-white data-[state=active]:shadow-lg rounded-xl transition-all duration-200"
            data-testid="tab-insurance"
          >
            <Shield className="h-5 w-5" />
            <span className="text-sm font-medium">Insurance</span>
          </TabsTrigger>
          <TabsTrigger 
            value="payment" 
            className="flex flex-col items-center gap-2 p-4 data-[state=active]:bg-white data-[state=active]:shadow-lg rounded-xl transition-all duration-200"
            data-testid="tab-payment"
          >
            <CreditCard className="h-5 w-5" />
            <span className="text-sm font-medium">Payment</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-8">
          <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 p-8">
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <Settings className="h-6 w-6" />
                Personal Information
              </CardTitle>
              <CardDescription className="text-base">
                Update your basic profile information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold">First Name</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              className="h-12 rounded-xl border-2 border-muted focus:border-primary transition-colors"
                              data-testid="input-first-name"
                            />
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
                          <FormLabel className="text-sm font-semibold">Last Name</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              className="h-12 rounded-xl border-2 border-muted focus:border-primary transition-colors"
                              data-testid="input-last-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">Email Address</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="email"
                            className="h-12 rounded-xl border-2 border-muted focus:border-primary transition-colors"
                            data-testid="input-email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold">Phone Number</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="tel"
                              placeholder="+1 (555) 123-4567"
                              className="h-12 rounded-xl border-2 border-muted focus:border-primary transition-colors"
                              data-testid="input-phone"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold">Date of Birth</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="date"
                              className="h-12 rounded-xl border-2 border-muted focus:border-primary transition-colors"
                              data-testid="input-date-birth"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">Bio</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Tell us a bit about yourself..."
                            className="min-h-24 rounded-xl border-2 border-muted focus:border-primary transition-colors resize-none"
                            data-testid="textarea-bio"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end pt-4">
                    <Button 
                      type="submit" 
                      disabled={updateProfileMutation.isPending}
                      className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-200 shadow-lg hover:shadow-xl"
                      data-testid="button-save-profile"
                    >
                      {updateProfileMutation.isPending ? (
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Save Changes
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="addresses">
          <AddressManagement />
        </TabsContent>

        <TabsContent value="emergency">
          <EmergencyContactManagement />
        </TabsContent>

        <TabsContent value="health">
          <HealthProfileManagement />
        </TabsContent>

        <TabsContent value="family">
          <FamilyMemberManagement />
        </TabsContent>

        <TabsContent value="insurance">
          <InsuranceManagement />
        </TabsContent>

        <TabsContent value="payment">
          <PaymentMethodManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
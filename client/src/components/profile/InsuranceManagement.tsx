import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Shield, Plus, Edit, Trash2, CheckCircle, AlertCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const insuranceSchema = z.object({
  providerName: z.string().min(1, "Provider name is required"),
  policyNumber: z.string().min(1, "Policy number is required"),
  groupNumber: z.string().optional(),
  subscriberName: z.string().min(1, "Subscriber name is required"),
  relationship: z.string().min(1, "Relationship is required"),
  effectiveDate: z.string().min(1, "Effective date is required"),
  expirationDate: z.string().optional(),
  copay: z.string().optional(),
  deductible: z.string().optional(),
  isPrimary: z.boolean().default(true),
  notes: z.string().optional(),
});

type InsuranceFormData = z.infer<typeof insuranceSchema>;

interface Insurance extends InsuranceFormData {
  id: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export function InsuranceManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInsurance, setEditingInsurance] = useState<Insurance | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsuranceFormData>({
    resolver: zodResolver(insuranceSchema),
    defaultValues: {
      providerName: "",
      policyNumber: "",
      groupNumber: "",
      subscriberName: "",
      relationship: "self",
      effectiveDate: "",
      expirationDate: "",
      copay: "",
      deductible: "",
      isPrimary: true,
      notes: "",
    },
  });

  // Fetch insurance information
  const { data: insuranceList = [], isLoading } = useQuery({
    queryKey: ['/api/user/insurance'],
    queryFn: () => apiRequest('GET', '/api/user/insurance'),
  });

  // Create insurance mutation
  const createInsuranceMutation = useMutation({
    mutationFn: (data: InsuranceFormData) => apiRequest('POST', '/api/user/insurance', data),
    onSuccess: () => {
      toast({
        title: "Insurance Added",
        description: "Your insurance information has been successfully added.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/user/insurance'] });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Add Insurance",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update insurance mutation
  const updateInsuranceMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsuranceFormData> }) =>
      apiRequest('PUT', `/api/user/insurance/${id}`, data),
    onSuccess: () => {
      toast({
        title: "Insurance Updated",
        description: "Your insurance information has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/user/insurance'] });
      setIsDialogOpen(false);
      setEditingInsurance(null);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Update Insurance",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete insurance mutation
  const deleteInsuranceMutation = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/user/insurance/${id}`),
    onSuccess: () => {
      toast({
        title: "Insurance Deleted",
        description: "Your insurance information has been successfully deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/user/insurance'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Delete Insurance",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsuranceFormData) => {
    if (editingInsurance) {
      updateInsuranceMutation.mutate({ id: editingInsurance.id, data });
    } else {
      createInsuranceMutation.mutate(data);
    }
  };

  const handleEdit = (insurance: Insurance) => {
    setEditingInsurance(insurance);
    form.reset({
      providerName: insurance.providerName,
      policyNumber: insurance.policyNumber,
      groupNumber: insurance.groupNumber || "",
      subscriberName: insurance.subscriberName,
      relationship: insurance.relationship,
      effectiveDate: insurance.effectiveDate,
      expirationDate: insurance.expirationDate || "",
      copay: insurance.copay || "",
      deductible: insurance.deductible || "",
      isPrimary: insurance.isPrimary,
      notes: insurance.notes || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this insurance information?")) {
      deleteInsuranceMutation.mutate(id);
    }
  };

  const isExpired = (expirationDate: string) => {
    if (!expirationDate) return false;
    return new Date(expirationDate) < new Date();
  };

  const isExpiringSoon = (expirationDate: string) => {
    if (!expirationDate) return false;
    const expDate = new Date(expirationDate);
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
    return expDate >= today && expDate <= thirtyDaysFromNow;
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
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-emerald-25 p-8">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
              <Shield className="h-6 w-6" />
              Insurance Information
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Manage your health insurance policies and coverage details
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                onClick={() => {
                  setEditingInsurance(null);
                  form.reset();
                }}
                data-testid="button-add-insurance"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Insurance
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingInsurance ? "Edit Insurance Information" : "Add Insurance Information"}
                </DialogTitle>
                <DialogDescription>
                  {editingInsurance 
                    ? "Update your insurance policy information below"
                    : "Add your health insurance policy details"
                  }
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="providerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Insurance Provider</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="Blue Cross Blue Shield"
                              data-testid="input-provider-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="policyNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Policy Number</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="ABC123456789"
                              data-testid="input-policy-number"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="groupNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Group Number (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="GRP001"
                              data-testid="input-group-number"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="subscriberName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subscriber Name</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="John Doe"
                              data-testid="input-subscriber-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="relationship"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Relationship to Subscriber</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-relationship">
                              <SelectValue placeholder="Select relationship" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="self">Self</SelectItem>
                            <SelectItem value="spouse">Spouse</SelectItem>
                            <SelectItem value="child">Child</SelectItem>
                            <SelectItem value="dependent">Dependent</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="effectiveDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Effective Date</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="date"
                              data-testid="input-effective-date"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="expirationDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expiration Date (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="date"
                              data-testid="input-expiration-date"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="copay"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Copay (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="$25"
                              data-testid="input-copay"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="deductible"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Deductible (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="$500"
                              data-testid="input-deductible"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Additional information about coverage..."
                            data-testid="input-insurance-notes"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isPrimary"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Primary Insurance</FormLabel>
                          <div className="text-sm text-muted-foreground">
                            This is your primary insurance policy
                          </div>
                        </div>
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="form-checkbox h-4 w-4 text-primary"
                            data-testid="checkbox-primary-insurance"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-3 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                      data-testid="button-cancel-insurance"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createInsuranceMutation.isPending || updateInsuranceMutation.isPending}
                      data-testid="button-save-insurance"
                    >
                      {(createInsuranceMutation.isPending || updateInsuranceMutation.isPending) && (
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                      )}
                      {editingInsurance ? "Update" : "Add"} Insurance
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent className="p-8">
        {insuranceList.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Insurance Information</h3>
            <p className="text-muted-foreground mb-6">
              Add your health insurance information to streamline billing and coverage verification
            </p>
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="px-6 py-3 rounded-xl"
              data-testid="button-add-first-insurance"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Insurance
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {insuranceList.map((insurance: Insurance) => (
              <div 
                key={insurance.id} 
                className="relative group p-6 rounded-2xl border-2 border-muted hover:border-primary/30 transition-all duration-200 bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-sm"
                data-testid={`insurance-card-${insurance.id}`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-600">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{insurance.providerName}</h3>
                      <div className="flex gap-1">
                        {insurance.isPrimary && (
                          <Badge variant="default" className="text-xs">
                            Primary
                          </Badge>
                        )}
                        {insurance.expirationDate && isExpired(insurance.expirationDate) && (
                          <Badge variant="destructive" className="text-xs flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Expired
                          </Badge>
                        )}
                        {insurance.expirationDate && isExpiringSoon(insurance.expirationDate) && !isExpired(insurance.expirationDate) && (
                          <Badge variant="outline" className="text-xs text-yellow-700 border-yellow-300">
                            Expiring Soon
                          </Badge>
                        )}
                        {insurance.expirationDate && !isExpired(insurance.expirationDate) && !isExpiringSoon(insurance.expirationDate) && (
                          <Badge variant="outline" className="text-xs text-green-700 border-green-300 flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Active
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Policy:</span> {insurance.policyNumber}
                      </p>
                      {insurance.groupNumber && (
                        <p>
                          <span className="font-medium">Group:</span> {insurance.groupNumber}
                        </p>
                      )}
                      <p>
                        <span className="font-medium">Subscriber:</span> {insurance.subscriberName}
                      </p>
                      <p className="capitalize">
                        <span className="font-medium">Relationship:</span> {insurance.relationship}
                      </p>
                      <p>
                        <span className="font-medium">Effective:</span> {new Date(insurance.effectiveDate).toLocaleDateString()}
                      </p>
                      {insurance.expirationDate && (
                        <p>
                          <span className="font-medium">Expires:</span> {new Date(insurance.expirationDate).toLocaleDateString()}
                        </p>
                      )}
                      {(insurance.copay || insurance.deductible) && (
                        <div className="flex gap-4">
                          {insurance.copay && (
                            <p>
                              <span className="font-medium">Copay:</span> {insurance.copay}
                            </p>
                          )}
                          {insurance.deductible && (
                            <p>
                              <span className="font-medium">Deductible:</span> {insurance.deductible}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    {insurance.notes && (
                      <p className="text-xs text-muted-foreground mt-3 italic">
                        {insurance.notes}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-muted/30">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(insurance)}
                    className="flex-1"
                    data-testid={`button-edit-insurance-${insurance.id}`}
                  >
                    <Edit className="h-3 w-3 mr-2" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(insurance.id)}
                    disabled={deleteInsuranceMutation.isPending}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    data-testid={`button-delete-insurance-${insurance.id}`}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
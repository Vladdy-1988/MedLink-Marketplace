import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Shield, Plus, Edit, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest, apiRequestJson } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const insuranceSchema = z.object({
  provider: z.string().min(1, "Provider is required"),
  policyNumber: z.string().min(1, "Policy number is required"),
  memberNumber: z.string().optional(),
});

type InsuranceFormData = z.infer<typeof insuranceSchema>;

interface Insurance {
  id: number;
  userId: string;
  provider: string;
  policyNumber: string;
  groupNumber?: string | null;
  memberNumber?: string | null;
  planType?: string | null;
  effectiveDate?: string | null;
  expiryDate?: string | null;
  copayAmount?: string | null;
  deductibleAmount?: string | null;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

export function InsuranceManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInsurance, setEditingInsurance] = useState<Insurance | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsuranceFormData>({
    resolver: zodResolver(insuranceSchema),
    defaultValues: {
      provider: "",
      policyNumber: "",
      memberNumber: "",
    },
  });

  const { data: insuranceList = [], isLoading } = useQuery<Insurance[]>({
    queryKey: ["/api/user/insurance"],
    queryFn: () => apiRequestJson<Insurance[]>("GET", "/api/user/insurance"),
  });

  const createInsuranceMutation = useMutation({
    mutationFn: (data: InsuranceFormData) =>
      apiRequest("POST", "/api/user/insurance", {
        ...data,
        memberNumber: data.memberNumber || null,
        groupNumber: null,
        isPrimary: true,
      }),
    onSuccess: () => {
      toast({
        title: "Insurance Added",
        description: "Your insurance information has been successfully added.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/insurance"] });
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

  const updateInsuranceMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsuranceFormData> }) =>
      apiRequest("PUT", `/api/user/insurance/${id}`, {
        ...data,
        memberNumber: data.memberNumber === "" ? null : data.memberNumber,
        groupNumber: null,
        isPrimary: true,
      }),
    onSuccess: () => {
      toast({
        title: "Insurance Updated",
        description: "Your insurance information has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/insurance"] });
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

  const deleteInsuranceMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/user/insurance/${id}`),
    onSuccess: () => {
      toast({
        title: "Insurance Deleted",
        description: "Your insurance information has been successfully deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/insurance"] });
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
      provider: insurance.provider,
      policyNumber: insurance.policyNumber,
      memberNumber: insurance.memberNumber || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this insurance information?")) {
      deleteInsuranceMutation.mutate(id);
    }
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
              Manage your insurance policies and coverage details
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
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingInsurance ? "Edit Insurance Information" : "Add Insurance Information"}</DialogTitle>
                <DialogDescription>
                  {editingInsurance ? "Update the basic details we need for billing support." : "Add only the basic details most patients have available."}
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="provider"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Insurance Provider</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Blue Cross" data-testid="input-provider" />
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
                          <Input {...field} placeholder="ABC123456789" data-testid="input-policy-number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="memberNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Member ID (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="MEM001" data-testid="input-member-number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} data-testid="button-cancel-insurance">
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
            <p className="text-muted-foreground mb-6">Add insurance information to streamline billing and verification</p>
            <Button onClick={() => setIsDialogOpen(true)} className="px-6 py-3 rounded-xl" data-testid="button-add-first-insurance">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Insurance
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {insuranceList.map((insurance) => (
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
                      <h3 className="font-semibold text-lg">{insurance.provider}</h3>
                      <div className="flex gap-1">
                        {insurance.isPrimary && (
                          <Badge variant="default" className="text-xs">Primary</Badge>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Policy:</span> {insurance.policyNumber}</p>
                      {insurance.memberNumber && <p><span className="font-medium">Member ID:</span> {insurance.memberNumber}</p>}
                    </div>
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

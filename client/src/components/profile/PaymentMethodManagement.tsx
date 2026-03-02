import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Plus, Edit, Trash2, Star, Calendar } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest, apiRequestJson } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const paymentMethodSchema = z.object({
  type: z.enum(["card", "bank_account"]),
  brand: z.string().min(1, "Brand is required"),
  last4: z.string().regex(/^\d{4}$/, "Last 4 digits are required"),
  expiryMonth: z.string().optional(),
  expiryYear: z.string().optional(),
  isDefault: z.boolean().default(false),
});

type PaymentMethodFormData = z.infer<typeof paymentMethodSchema>;

interface PaymentMethod {
  id: number;
  userId: string;
  stripePaymentMethodId: string;
  type: string;
  last4: string | null;
  brand: string | null;
  expiryMonth: number | null;
  expiryYear: number | null;
  isDefault: boolean;
  billingAddressId: number | null;
  createdAt: string;
  updatedAt: string;
}

export function PaymentMethodManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<PaymentMethodFormData>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: "card",
      brand: "",
      last4: "",
      expiryMonth: "",
      expiryYear: "",
      isDefault: false,
    },
  });

  const { data: paymentMethods = [], isLoading } = useQuery<PaymentMethod[]>({
    queryKey: ["/api/user/payment-methods"],
    queryFn: () => apiRequestJson<PaymentMethod[]>("GET", "/api/user/payment-methods"),
  });

  const createMethodMutation = useMutation({
    mutationFn: (data: PaymentMethodFormData) =>
      apiRequest("POST", "/api/user/payment-methods", {
        stripePaymentMethodId: `manual_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        type: data.type,
        brand: data.brand,
        last4: data.last4,
        expiryMonth: data.expiryMonth ? Number(data.expiryMonth) : null,
        expiryYear: data.expiryYear ? Number(data.expiryYear) : null,
        isDefault: data.isDefault,
        billingAddressId: null,
      }),
    onSuccess: () => {
      toast({
        title: "Payment Method Added",
        description: "Your payment method has been successfully added.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/payment-methods"] });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Add Payment Method",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateMethodMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<PaymentMethodFormData> }) =>
      apiRequest("PUT", `/api/user/payment-methods/${id}`, {
        ...data,
        expiryMonth: data.expiryMonth === undefined ? undefined : (data.expiryMonth ? Number(data.expiryMonth) : null),
        expiryYear: data.expiryYear === undefined ? undefined : (data.expiryYear ? Number(data.expiryYear) : null),
      }),
    onSuccess: () => {
      toast({
        title: "Payment Method Updated",
        description: "Your payment method has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/payment-methods"] });
      setIsDialogOpen(false);
      setEditingMethod(null);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Update Payment Method",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteMethodMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/user/payment-methods/${id}`),
    onSuccess: () => {
      toast({
        title: "Payment Method Deleted",
        description: "Your payment method has been successfully deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/payment-methods"] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Delete Payment Method",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const setDefaultMutation = useMutation({
    mutationFn: (id: number) => apiRequest("PUT", `/api/user/payment-methods/${id}/default`),
    onSuccess: () => {
      toast({
        title: "Default Payment Method Updated",
        description: "Your default payment method has been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/payment-methods"] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Update Default",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PaymentMethodFormData) => {
    if (editingMethod) {
      updateMethodMutation.mutate({ id: editingMethod.id, data });
    } else {
      createMethodMutation.mutate(data);
    }
  };

  const handleEdit = (method: PaymentMethod) => {
    setEditingMethod(method);
    form.reset({
      type: (method.type as "card" | "bank_account") ?? "card",
      brand: method.brand || "",
      last4: method.last4 || "",
      expiryMonth: method.expiryMonth ? String(method.expiryMonth).padStart(2, "0") : "",
      expiryYear: method.expiryYear ? String(method.expiryYear) : "",
      isDefault: method.isDefault,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this payment method?")) {
      deleteMethodMutation.mutate(id);
    }
  };

  const formatCardNumber = (last4: string | null) => {
    return `**** **** **** ${last4 || "0000"}`;
  };

  const isExpiring = (month: number | null, year: number | null) => {
    if (!month || !year) return false;
    const expiry = new Date(year, month - 1);
    const now = new Date();
    const threeMonthsFromNow = new Date(now.getFullYear(), now.getMonth() + 3, 1);
    return expiry <= threeMonthsFromNow;
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
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-25 p-8">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
              <CreditCard className="h-6 w-6" />
              Payment Methods
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Manage saved payment methods for charges and payouts
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                onClick={() => {
                  setEditingMethod(null);
                  form.reset();
                }}
                data-testid="button-add-payment"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Payment Method
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingMethod ? "Edit Payment Method" : "Add Payment Method"}</DialogTitle>
                <DialogDescription>
                  {editingMethod ? "Update payment method information" : "Add a payment method to your account"}
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Method Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-payment-type">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="card">Card</SelectItem>
                              <SelectItem value="bank_account">Bank Account</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="brand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Brand</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Visa, Mastercard, RBC" data-testid="input-brand" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="last4"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last 4 Digits</FormLabel>
                          <FormControl>
                            <Input {...field} maxLength={4} placeholder="1234" data-testid="input-last4" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="expiryMonth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expiry Month</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-expiry-month">
                                <SelectValue placeholder="Month" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Array.from({ length: 12 }, (_, i) => (
                                <SelectItem key={i + 1} value={(i + 1).toString().padStart(2, "0")}>
                                  {(i + 1).toString().padStart(2, "0")}
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
                      name="expiryYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expiry Year</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-expiry-year">
                                <SelectValue placeholder="Year" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Array.from({ length: 12 }, (_, i) => {
                                const year = new Date().getFullYear() + i;
                                return (
                                  <SelectItem key={year} value={year.toString()}>
                                    {year}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="isDefault"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Set as Default</FormLabel>
                          <div className="text-sm text-muted-foreground">Use this as your default payment method</div>
                        </div>
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="form-checkbox h-4 w-4 text-primary"
                            data-testid="checkbox-default-payment"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} data-testid="button-cancel-payment">
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={createMethodMutation.isPending || updateMethodMutation.isPending}
                      data-testid="button-save-payment"
                    >
                      {(createMethodMutation.isPending || updateMethodMutation.isPending) && (
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                      )}
                      {editingMethod ? "Update" : "Add"} Payment Method
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="p-8">
        {paymentMethods.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Payment Methods</h3>
            <p className="text-muted-foreground mb-6">Add a payment method for booking payments</p>
            <Button onClick={() => setIsDialogOpen(true)} className="px-6 py-3 rounded-xl" data-testid="button-add-first-payment">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Payment Method
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="relative group p-6 rounded-2xl border-2 border-muted hover:border-primary/30 transition-all duration-200 bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-sm"
                data-testid={`payment-card-${method.id}`}
              >
                {method.isDefault && (
                  <Badge className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-yellow-300 text-yellow-900">
                    <Star className="h-3 w-3 mr-1" />
                    Default
                  </Badge>
                )}

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-50 text-indigo-600">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg capitalize">{method.brand || method.type}</h3>
                      {isExpiring(method.expiryMonth, method.expiryYear) && (
                        <Badge variant="outline" className="text-xs text-orange-700 border-orange-300 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Expiring Soon
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="font-mono text-lg tracking-wider">{formatCardNumber(method.last4)}</p>
                      <p><span className="font-medium">Type:</span> {method.type}</p>
                      {method.expiryMonth && method.expiryYear && (
                        <p>
                          <span className="font-medium">Expires:</span> {String(method.expiryMonth).padStart(2, "0")}/{method.expiryYear}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-muted/30">
                  {!method.isDefault && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setDefaultMutation.mutate(method.id)}
                      disabled={setDefaultMutation.isPending}
                      className="flex-1"
                      data-testid={`button-set-default-${method.id}`}
                    >
                      <Star className="h-3 w-3 mr-2" />
                      Set Default
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(method)}
                    className="flex-1"
                    data-testid={`button-edit-payment-${method.id}`}
                  >
                    <Edit className="h-3 w-3 mr-2" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(method.id)}
                    disabled={deleteMethodMutation.isPending}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    data-testid={`button-delete-payment-${method.id}`}
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

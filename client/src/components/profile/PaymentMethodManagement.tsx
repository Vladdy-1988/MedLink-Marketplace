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
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const paymentMethodSchema = z.object({
  type: z.enum(['credit', 'debit', 'bank']),
  cardNumber: z.string().min(1, "Card number is required"),
  expiryMonth: z.string().min(1, "Expiry month is required"),
  expiryYear: z.string().min(1, "Expiry year is required"),
  holderName: z.string().min(1, "Cardholder name is required"),
  billingAddress: z.string().min(1, "Billing address is required"),
  isDefault: z.boolean().default(false),
  nickname: z.string().optional(),
});

type PaymentMethodFormData = z.infer<typeof paymentMethodSchema>;

interface PaymentMethod extends PaymentMethodFormData {
  id: number;
  userId: string;
  maskedCardNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

export function PaymentMethodManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<PaymentMethodFormData>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: 'credit',
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      holderName: "",
      billingAddress: "",
      isDefault: false,
      nickname: "",
    },
  });

  // Fetch payment methods
  const { data: paymentMethods = [], isLoading } = useQuery({
    queryKey: ['/api/user/payment-methods'],
    queryFn: () => apiRequest('GET', '/api/user/payment-methods'),
  });

  // Create payment method mutation
  const createMethodMutation = useMutation({
    mutationFn: (data: PaymentMethodFormData) => apiRequest('POST', '/api/user/payment-methods', data),
    onSuccess: () => {
      toast({
        title: "Payment Method Added",
        description: "Your payment method has been successfully added.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/user/payment-methods'] });
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

  // Update payment method mutation
  const updateMethodMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<PaymentMethodFormData> }) =>
      apiRequest('PUT', `/api/user/payment-methods/${id}`, data),
    onSuccess: () => {
      toast({
        title: "Payment Method Updated",
        description: "Your payment method has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/user/payment-methods'] });
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

  // Delete payment method mutation
  const deleteMethodMutation = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/user/payment-methods/${id}`),
    onSuccess: () => {
      toast({
        title: "Payment Method Deleted",
        description: "Your payment method has been successfully deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/user/payment-methods'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Delete Payment Method",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  // Set default payment method mutation
  const setDefaultMutation = useMutation({
    mutationFn: (id: number) => apiRequest('PUT', `/api/user/payment-methods/${id}/default`),
    onSuccess: () => {
      toast({
        title: "Default Payment Method Updated",
        description: "Your default payment method has been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/user/payment-methods'] });
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
      type: method.type,
      cardNumber: "", // Don't populate card number for security
      expiryMonth: method.expiryMonth,
      expiryYear: method.expiryYear,
      holderName: method.holderName,
      billingAddress: method.billingAddress,
      isDefault: method.isDefault,
      nickname: method.nickname || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this payment method?")) {
      deleteMethodMutation.mutate(id);
    }
  };

  const getCardIcon = (type: string) => {
    return <CreditCard className="h-5 w-5" />;
  };

  const formatCardNumber = (number: string) => {
    return `**** **** **** ${number.slice(-4)}`;
  };

  const isExpiring = (month: string, year: string) => {
    const expiry = new Date(parseInt(year), parseInt(month) - 1);
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
              Manage your payment methods for healthcare services
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
                <DialogTitle>
                  {editingMethod ? "Edit Payment Method" : "Add Payment Method"}
                </DialogTitle>
                <DialogDescription>
                  {editingMethod 
                    ? "Update your payment method information below"
                    : "Add a new payment method for healthcare services"
                  }
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
                          <FormLabel>Payment Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-payment-type">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="credit">Credit Card</SelectItem>
                              <SelectItem value="debit">Debit Card</SelectItem>
                              <SelectItem value="bank">Bank Account</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="nickname"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nickname (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="Personal Card, Business Card..."
                              data-testid="input-nickname"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="cardNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {editingMethod ? "New Card Number (leave empty to keep current)" : "Card Number"}
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder={editingMethod ? "Leave empty to keep current card" : "1234 5678 9012 3456"}
                            data-testid="input-card-number"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="holderName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cardholder Name</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="John Doe"
                            data-testid="input-holder-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
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
                                <SelectItem key={i + 1} value={(i + 1).toString().padStart(2, '0')}>
                                  {(i + 1).toString().padStart(2, '0')}
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
                              {Array.from({ length: 10 }, (_, i) => {
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
                    name="billingAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Billing Address</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="123 Main Street, Calgary, AB T2P 1J9"
                            data-testid="input-billing-address"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isDefault"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Set as Default</FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Use this payment method as your default for charges
                          </div>
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
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                      data-testid="button-cancel-payment"
                    >
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
            <p className="text-muted-foreground mb-6">
              Add a payment method to enable seamless payments for healthcare services
            </p>
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="px-6 py-3 rounded-xl"
              data-testid="button-add-first-payment"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Payment Method
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paymentMethods.map((method: PaymentMethod) => (
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
                    {getCardIcon(method.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg capitalize">
                        {method.nickname || `${method.type} Card`}
                      </h3>
                      {isExpiring(method.expiryMonth, method.expiryYear) && (
                        <Badge variant="outline" className="text-xs text-orange-700 border-orange-300 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Expiring Soon
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="font-mono text-lg tracking-wider">
                        {formatCardNumber(method.maskedCardNumber)}
                      </p>
                      <p>
                        <span className="font-medium">Holder:</span> {method.holderName}
                      </p>
                      <p>
                        <span className="font-medium">Expires:</span> {method.expiryMonth}/{method.expiryYear}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {method.billingAddress}
                      </p>
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
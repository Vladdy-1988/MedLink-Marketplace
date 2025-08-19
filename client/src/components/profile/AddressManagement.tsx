import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MapPin, Plus, Edit, Trash2, Home, Building, Star } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const addressSchema = z.object({
  type: z.enum(['home', 'work', 'other']),
  streetAddress: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  province: z.string().min(1, "Province is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().default("Canada"),
  isDefault: z.boolean().default(false),
  label: z.string().optional(),
});

type AddressFormData = z.infer<typeof addressSchema>;

interface Address extends AddressFormData {
  id: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export function AddressManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      type: 'home',
      streetAddress: "",
      city: "",
      province: "Alberta",
      postalCode: "",
      country: "Canada",
      isDefault: false,
      label: "",
    },
  });

  // Fetch addresses
  const { data: addresses = [], isLoading } = useQuery({
    queryKey: ['/api/user/addresses'],
    queryFn: () => apiRequest('GET', '/api/user/addresses'),
  });

  // Create address mutation
  const createAddressMutation = useMutation({
    mutationFn: (data: AddressFormData) => apiRequest('POST', '/api/user/addresses', data),
    onSuccess: () => {
      toast({
        title: "Address Added",
        description: "Your address has been successfully added.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/user/addresses'] });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Add Address",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update address mutation
  const updateAddressMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<AddressFormData> }) =>
      apiRequest('PUT', `/api/user/addresses/${id}`, data),
    onSuccess: () => {
      toast({
        title: "Address Updated",
        description: "Your address has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/user/addresses'] });
      setIsDialogOpen(false);
      setEditingAddress(null);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Update Address",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete address mutation
  const deleteAddressMutation = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/user/addresses/${id}`),
    onSuccess: () => {
      toast({
        title: "Address Deleted",
        description: "Your address has been successfully deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/user/addresses'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Delete Address",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  // Set default address mutation
  const setDefaultMutation = useMutation({
    mutationFn: (id: number) => apiRequest('PUT', `/api/user/addresses/${id}/default`),
    onSuccess: () => {
      toast({
        title: "Default Address Updated",
        description: "Your default address has been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/user/addresses'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Update Default",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: AddressFormData) => {
    if (editingAddress) {
      updateAddressMutation.mutate({ id: editingAddress.id, data });
    } else {
      createAddressMutation.mutate(data);
    }
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    form.reset({
      type: address.type,
      streetAddress: address.streetAddress,
      city: address.city,
      province: address.province,
      postalCode: address.postalCode,
      country: address.country,
      isDefault: address.isDefault,
      label: address.label || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this address?")) {
      deleteAddressMutation.mutate(id);
    }
  };

  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'home': return <Home className="h-5 w-5" />;
      case 'work': return <Building className="h-5 w-5" />;
      default: return <MapPin className="h-5 w-5" />;
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
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-25 p-8">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
              <MapPin className="h-6 w-6" />
              Address Management
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Manage your home, work, and other addresses for healthcare services
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                onClick={() => {
                  setEditingAddress(null);
                  form.reset();
                }}
                data-testid="button-add-address"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Address
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingAddress ? "Edit Address" : "Add New Address"}
                </DialogTitle>
                <DialogDescription>
                  {editingAddress 
                    ? "Update your address information below"
                    : "Add a new address for healthcare service delivery"
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
                          <FormLabel>Address Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-address-type">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="home">Home</SelectItem>
                              <SelectItem value="work">Work</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="label"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Label (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="e.g., Summer Home, Office"
                              data-testid="input-address-label"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="streetAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="123 Main Street, Apt 4B"
                            data-testid="input-street-address"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="Calgary"
                              data-testid="input-city"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="province"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Province</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-province">
                                <SelectValue placeholder="Select province" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Alberta">Alberta</SelectItem>
                              <SelectItem value="British Columbia">British Columbia</SelectItem>
                              <SelectItem value="Manitoba">Manitoba</SelectItem>
                              <SelectItem value="New Brunswick">New Brunswick</SelectItem>
                              <SelectItem value="Newfoundland and Labrador">Newfoundland and Labrador</SelectItem>
                              <SelectItem value="Northwest Territories">Northwest Territories</SelectItem>
                              <SelectItem value="Nova Scotia">Nova Scotia</SelectItem>
                              <SelectItem value="Nunavut">Nunavut</SelectItem>
                              <SelectItem value="Ontario">Ontario</SelectItem>
                              <SelectItem value="Prince Edward Island">Prince Edward Island</SelectItem>
                              <SelectItem value="Quebec">Quebec</SelectItem>
                              <SelectItem value="Saskatchewan">Saskatchewan</SelectItem>
                              <SelectItem value="Yukon">Yukon</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal Code</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="T2P 1J9"
                              data-testid="input-postal-code"
                            />
                          </FormControl>
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
                          <FormLabel className="text-base">
                            Set as Default Address
                          </FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Use this address as your primary delivery location
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="switch-default-address"
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
                      data-testid="button-cancel-address"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createAddressMutation.isPending || updateAddressMutation.isPending}
                      data-testid="button-save-address"
                    >
                      {(createAddressMutation.isPending || updateAddressMutation.isPending) && (
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                      )}
                      {editingAddress ? "Update" : "Add"} Address
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent className="p-8">
        {addresses.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Addresses Added</h3>
            <p className="text-muted-foreground mb-6">
              Add your first address to enable healthcare service delivery
            </p>
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="px-6 py-3 rounded-xl"
              data-testid="button-add-first-address"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Address
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((address: Address) => (
              <div 
                key={address.id} 
                className="relative group p-6 rounded-2xl border-2 border-muted hover:border-primary/30 transition-all duration-200 bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-sm"
                data-testid={`address-card-${address.id}`}
              >
                {address.isDefault && (
                  <Badge className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-yellow-300 text-yellow-900">
                    <Star className="h-3 w-3 mr-1" />
                    Default
                  </Badge>
                )}
                
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600">
                    {getAddressIcon(address.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg capitalize">
                        {address.label || address.type}
                      </h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {address.streetAddress}<br />
                      {address.city}, {address.province}<br />
                      {address.postalCode}, {address.country}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-muted/30">
                  {!address.isDefault && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setDefaultMutation.mutate(address.id)}
                      disabled={setDefaultMutation.isPending}
                      className="flex-1"
                      data-testid={`button-set-default-${address.id}`}
                    >
                      <Star className="h-3 w-3 mr-2" />
                      Set Default
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(address)}
                    className="flex-1"
                    data-testid={`button-edit-address-${address.id}`}
                  >
                    <Edit className="h-3 w-3 mr-2" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(address.id)}
                    disabled={deleteAddressMutation.isPending}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    data-testid={`button-delete-address-${address.id}`}
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
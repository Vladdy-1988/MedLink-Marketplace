import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Phone, Plus, Edit, Trash2, Star } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest, apiRequestJson } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const emergencyContactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  relationship: z.string().min(1, "Relationship is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  email: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  isPrimary: z.boolean().default(false),
});

type EmergencyContactFormData = z.infer<typeof emergencyContactSchema>;

interface EmergencyContact extends EmergencyContactFormData {
  id: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export function EmergencyContactManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<EmergencyContactFormData>({
    resolver: zodResolver(emergencyContactSchema),
    defaultValues: {
      name: "",
      relationship: "",
      phoneNumber: "",
      email: "",
      isPrimary: false,
    },
  });

  const { data: contacts = [], isLoading } = useQuery<EmergencyContact[]>({
    queryKey: ["/api/user/emergency-contacts"],
    queryFn: () => apiRequestJson<EmergencyContact[]>("GET", "/api/user/emergency-contacts"),
  });

  const createContactMutation = useMutation({
    mutationFn: (data: EmergencyContactFormData) =>
      apiRequest("POST", "/api/user/emergency-contacts", {
        ...data,
        email: data.email || null,
      }),
    onSuccess: () => {
      toast({
        title: "Emergency Contact Added",
        description: "Your emergency contact has been successfully added.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/emergency-contacts"] });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Add Contact",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateContactMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<EmergencyContactFormData> }) =>
      apiRequest("PUT", `/api/user/emergency-contacts/${id}`, {
        ...data,
        email: data.email === "" ? null : data.email,
      }),
    onSuccess: () => {
      toast({
        title: "Emergency Contact Updated",
        description: "Your emergency contact has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/emergency-contacts"] });
      setIsDialogOpen(false);
      setEditingContact(null);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Update Contact",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteContactMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/user/emergency-contacts/${id}`),
    onSuccess: () => {
      toast({
        title: "Emergency Contact Deleted",
        description: "Your emergency contact has been successfully deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/emergency-contacts"] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Delete Contact",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: EmergencyContactFormData) => {
    if (editingContact) {
      updateContactMutation.mutate({ id: editingContact.id, data });
    } else {
      createContactMutation.mutate(data);
    }
  };

  const handleEdit = (contact: EmergencyContact) => {
    setEditingContact(contact);
    form.reset({
      name: contact.name,
      relationship: contact.relationship,
      phoneNumber: contact.phoneNumber,
      email: contact.email || "",
      isPrimary: contact.isPrimary,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this emergency contact?")) {
      deleteContactMutation.mutate(id);
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
      <CardHeader className="bg-gradient-to-r from-red-50 to-red-25 p-8">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
              <Phone className="h-6 w-6" />
              Emergency Contacts
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Manage who should be contacted first in case of emergency
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                onClick={() => {
                  setEditingContact(null);
                  form.reset();
                }}
                data-testid="button-add-contact"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingContact ? "Edit Emergency Contact" : "Add Emergency Contact"}</DialogTitle>
                <DialogDescription>
                  {editingContact ? "Update your emergency contact information" : "Add someone to contact in emergencies"}
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="John Doe" data-testid="input-contact-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="relationship"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Relationship</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-relationship">
                                <SelectValue placeholder="Select relationship" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="spouse">Spouse</SelectItem>
                              <SelectItem value="parent">Parent</SelectItem>
                              <SelectItem value="child">Child</SelectItem>
                              <SelectItem value="sibling">Sibling</SelectItem>
                              <SelectItem value="friend">Friend</SelectItem>
                              <SelectItem value="guardian">Guardian</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
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
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input {...field} type="tel" placeholder="+1 (555) 123-4567" data-testid="input-contact-phone" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email (Optional)</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" placeholder="john@example.com" data-testid="input-contact-email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="isPrimary"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Primary Emergency Contact</FormLabel>
                          <div className="text-sm text-muted-foreground">Set this contact as the first person to call</div>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-primary-contact" />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} data-testid="button-cancel-contact">
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={createContactMutation.isPending || updateContactMutation.isPending}
                      data-testid="button-save-contact"
                    >
                      {(createContactMutation.isPending || updateContactMutation.isPending) && (
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                      )}
                      {editingContact ? "Update" : "Add"} Contact
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="p-8">
        {contacts.length === 0 ? (
          <div className="text-center py-12">
            <Phone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Emergency Contacts</h3>
            <p className="text-muted-foreground mb-6">Add emergency contacts who can be reached if needed</p>
            <Button onClick={() => setIsDialogOpen(true)} className="px-6 py-3 rounded-xl" data-testid="button-add-first-contact">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Contact
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="relative group p-6 rounded-2xl border-2 border-muted hover:border-primary/30 transition-all duration-200 bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-sm"
                data-testid={`contact-card-${contact.id}`}
              >
                {contact.isPrimary && (
                  <Badge className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-yellow-300 text-yellow-900">
                    <Star className="h-3 w-3 mr-1" />
                    Primary
                  </Badge>
                )}

                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">{contact.name}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{contact.relationship}</p>
                  <p className="text-sm">{contact.phoneNumber}</p>
                  {contact.email && <p className="text-sm text-muted-foreground">{contact.email}</p>}
                </div>

                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-muted/30">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(contact)}
                    className="flex-1"
                    data-testid={`button-edit-contact-${contact.id}`}
                  >
                    <Edit className="h-3 w-3 mr-2" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(contact.id)}
                    disabled={deleteContactMutation.isPending}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    data-testid={`button-delete-contact-${contact.id}`}
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

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Edit, Trash2, User, Baby, Heart } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest, apiRequestJson } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const familyMemberSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  relationship: z.string().min(1, "Relationship is required"),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
});

type FamilyMemberFormData = z.infer<typeof familyMemberSchema>;

interface FamilyMember extends FamilyMemberFormData {
  id: number;
  userId: string;
  healthProfileId: number | null;
  createdAt: string;
  updatedAt: string;
}

export function FamilyMemberManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FamilyMemberFormData>({
    resolver: zodResolver(familyMemberSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      relationship: "",
      dateOfBirth: "",
      gender: "",
    },
  });

  const { data: members = [], isLoading } = useQuery<FamilyMember[]>({
    queryKey: ["/api/user/family-members"],
    queryFn: () => apiRequestJson<FamilyMember[]>("GET", "/api/user/family-members"),
  });

  const createMemberMutation = useMutation({
    mutationFn: (data: FamilyMemberFormData) =>
      apiRequest("POST", "/api/user/family-members", {
        ...data,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        gender: data.gender || null,
        healthProfileId: null,
      }),
    onSuccess: () => {
      toast({
        title: "Family Member Added",
        description: "The family member has been successfully added.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/family-members"] });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Add Member",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateMemberMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<FamilyMemberFormData> }) =>
      apiRequest("PUT", `/api/user/family-members/${id}`, {
        ...data,
        dateOfBirth: data.dateOfBirth === undefined ? undefined : (data.dateOfBirth ? new Date(data.dateOfBirth) : null),
      }),
    onSuccess: () => {
      toast({
        title: "Family Member Updated",
        description: "The family member has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/family-members"] });
      setIsDialogOpen(false);
      setEditingMember(null);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Update Member",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteMemberMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/user/family-members/${id}`),
    onSuccess: () => {
      toast({
        title: "Family Member Deleted",
        description: "The family member has been successfully deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/family-members"] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Delete Member",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FamilyMemberFormData) => {
    if (editingMember) {
      updateMemberMutation.mutate({ id: editingMember.id, data });
    } else {
      createMemberMutation.mutate(data);
    }
  };

  const handleEdit = (member: FamilyMember) => {
    setEditingMember(member);
    form.reset({
      firstName: member.firstName,
      lastName: member.lastName,
      relationship: member.relationship,
      dateOfBirth: member.dateOfBirth ? new Date(member.dateOfBirth).toISOString().slice(0, 10) : "",
      gender: member.gender || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this family member?")) {
      deleteMemberMutation.mutate(id);
    }
  };

  const getMemberIcon = (relationship: string) => {
    const rel = relationship.toLowerCase();
    if (rel.includes("child") || rel.includes("son") || rel.includes("daughter")) {
      return <Baby className="h-5 w-5" />;
    }
    if (rel.includes("spouse") || rel.includes("partner")) {
      return <Heart className="h-5 w-5" />;
    }
    return <User className="h-5 w-5" />;
  };

  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
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
      <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-25 p-8">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
              <Users className="h-6 w-6" />
              Family Members
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Manage family members who may need appointments
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                onClick={() => {
                  setEditingMember(null);
                  form.reset();
                }}
                data-testid="button-add-member"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingMember ? "Edit Family Member" : "Add Family Member"}</DialogTitle>
                <DialogDescription>
                  {editingMember ? "Update family member information" : "Add a family member to your account"}
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Jane" data-testid="input-member-first-name" />
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
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Doe" data-testid="input-member-last-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                              <SelectItem value="partner">Partner</SelectItem>
                              <SelectItem value="child">Child</SelectItem>
                              <SelectItem value="parent">Parent</SelectItem>
                              <SelectItem value="sibling">Sibling</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth (Optional)</FormLabel>
                          <FormControl>
                            <Input {...field} type="date" data-testid="input-member-dob" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender (Optional)</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-member-gender">
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                              <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} data-testid="button-cancel-member">
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={createMemberMutation.isPending || updateMemberMutation.isPending}
                      data-testid="button-save-member"
                    >
                      {(createMemberMutation.isPending || updateMemberMutation.isPending) && (
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                      )}
                      {editingMember ? "Update" : "Add"} Member
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="p-8">
        {members.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Family Members Added</h3>
            <p className="text-muted-foreground mb-6">Add family members who may need healthcare services</p>
            <Button onClick={() => setIsDialogOpen(true)} className="px-6 py-3 rounded-xl" data-testid="button-add-first-member">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Family Member
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {members.map((member) => (
              <div
                key={member.id}
                className="relative group p-6 rounded-2xl border-2 border-muted hover:border-primary/30 transition-all duration-200 bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-sm"
                data-testid={`member-card-${member.id}`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 text-purple-600">
                    {getMemberIcon(member.relationship)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{member.firstName} {member.lastName}</h3>
                      {member.gender && (
                        <Badge variant="secondary" className="text-xs capitalize">{member.gender.replaceAll("_", " ")}</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2 capitalize">
                      {member.relationship}
                      {member.dateOfBirth && calculateAge(member.dateOfBirth) !== null && (
                        <span className="ml-2">• Age {calculateAge(member.dateOfBirth)}</span>
                      )}
                    </p>
                    {member.dateOfBirth && (
                      <p className="text-xs text-muted-foreground">DOB: {new Date(member.dateOfBirth).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-muted/30">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(member)}
                    className="flex-1"
                    data-testid={`button-edit-member-${member.id}`}
                  >
                    <Edit className="h-3 w-3 mr-2" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(member.id)}
                    disabled={deleteMemberMutation.isPending}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    data-testid={`button-delete-member-${member.id}`}
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

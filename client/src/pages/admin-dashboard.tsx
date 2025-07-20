import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import {
  Users,
  UserCheck,
  Calendar,
  DollarSign,
  Settings,
  BarChart3,
  TrendingUp,
  Eye,
  Check,
  X,
  UserPlus
} from "lucide-react";

export default function AdminDashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Redirect to home if not authenticated or not an admin
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.userType !== 'admin')) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, authLoading, user, toast]);

  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ["/api/admin/stats"],
    enabled: !!user?.id && user?.userType === 'admin' && isAuthenticated,
  });

  // Handle stats errors
  useEffect(() => {
    if (statsError && isUnauthorizedError(statsError as Error)) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [statsError, toast]);

  const { data: pendingProviders, isLoading: pendingLoading, error: pendingError } = useQuery({
    queryKey: ["/api/admin/pending-providers"],
    enabled: !!user?.id && user?.userType === 'admin' && isAuthenticated,
  });

  // Handle pending provider errors
  useEffect(() => {
    if (pendingError && isUnauthorizedError(pendingError as Error)) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [pendingError, toast]);

  const approveProviderMutation = useMutation({
    mutationFn: async ({ providerId, isApproved }: { providerId: number; isApproved: boolean }) => {
      await apiRequest("PATCH", `/api/admin/providers/${providerId}/approval`, { isApproved });
    },
    onSuccess: (_, { isApproved }) => {
      toast({
        title: isApproved ? "Provider Approved" : "Provider Rejected",
        description: isApproved 
          ? "The provider has been approved and can now accept bookings."
          : "The provider application has been rejected.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pending-providers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update provider status. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (authLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-8 w-64 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <Skeleton className="h-96 w-full" />
            </div>
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.userType !== 'admin') {
    return null;
  }

  const handleProviderAction = (providerId: number, isApproved: boolean) => {
    approveProviderMutation.mutate({ providerId, isApproved });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage providers, bookings, and platform analytics</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <nav className="space-y-2">
                  <div className="flex items-center px-4 py-3 text-[hsl(207,90%,54%)] bg-blue-50 rounded-lg">
                    <BarChart3 className="h-5 w-5 mr-3" />
                    Overview
                  </div>
                  <div className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <UserCheck className="h-5 w-5 mr-3" />
                    Providers
                  </div>
                  <div className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <Users className="h-5 w-5 mr-3" />
                    Patients
                  </div>
                  <div className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <Calendar className="h-5 w-5 mr-3" />
                    Bookings
                  </div>
                  <div className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <TrendingUp className="h-5 w-5 mr-3" />
                    Analytics
                  </div>
                  <div className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <Settings className="h-5 w-5 mr-3" />
                    Settings
                  </div>
                </nav>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Platform Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <UserCheck className="h-6 w-6 text-[hsl(207,90%,54%)]" />
                    </div>
                    <div className="ml-4">
                      <div className="text-2xl font-bold text-gray-900">
                        {(stats as any)?.providers?.approved || 0}
                      </div>
                      <div className="text-sm text-gray-600">Active Providers</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Users className="h-6 w-6 text-[hsl(159,100%,34%)]" />
                    </div>
                    <div className="ml-4">
                      <div className="text-2xl font-bold text-gray-900">
                        {(stats as any)?.patients?.total || 0}
                      </div>
                      <div className="text-sm text-gray-600">Registered Patients</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-yellow-500" />
                    </div>
                    <div className="ml-4">
                      <div className="text-2xl font-bold text-gray-900">
                        {(stats as any)?.bookings?.total || 0}
                      </div>
                      <div className="text-sm text-gray-600">Total Bookings</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-[hsl(259,78%,60%)]" />
                    </div>
                    <div className="ml-4">
                      <div className="text-2xl font-bold text-gray-900">
                        ${Math.round((stats as any)?.bookings?.revenue || 0).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Total Revenue</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Pending Provider Approvals */}
            <Card className="mb-8">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Pending Provider Approvals</CardTitle>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    {(pendingProviders as any[])?.length || 0} Pending
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {pendingLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between p-4">
                        <div className="flex items-center">
                          <Skeleton className="h-12 w-12 rounded-full mr-4" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-48" />
                            <div className="flex space-x-2">
                              <Skeleton className="h-4 w-20" />
                              <Skeleton className="h-4 w-24" />
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Skeleton className="h-8 w-16" />
                          <Skeleton className="h-8 w-16" />
                          <Skeleton className="h-8 w-8" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (pendingProviders as any[])?.length === 0 ? (
                  <div className="text-center py-8">
                    <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No pending provider applications</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {(pendingProviders as any[])?.map((provider: any) => (
                      <div key={provider.id} className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-[hsl(207,90%,54%)] rounded-full flex items-center justify-center text-white font-semibold">
                              {provider.user?.firstName?.charAt(0) || 'P'}
                            </div>
                            <div className="ml-4">
                              <h3 className="font-semibold text-gray-900">
                                {provider.user?.firstName} {provider.user?.lastName}
                              </h3>
                              <p className="text-gray-600">
                                {provider.specialization} • Applied {new Date(provider.createdAt).toLocaleDateString()}
                              </p>
                              <div className="flex items-center mt-1 space-x-2">
                                <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                                  License: {provider.licenseNumber}
                                </Badge>
                                {provider.isVerified && (
                                  <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                                    Verified
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Button
                              onClick={() => handleProviderAction(provider.id, true)}
                              disabled={approveProviderMutation.isPending}
                              className="bg-[hsl(159,100%,34%)] hover:bg-[hsl(159,100%,24%)]"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              onClick={() => handleProviderAction(provider.id, false)}
                              disabled={approveProviderMutation.isPending}
                              variant="destructive"
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Platform Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="divide-y divide-gray-200">
                  <div className="p-6">
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-gray-900">
                          New booking completed by <span className="font-medium">Healthcare Provider</span>
                        </p>
                        <p className="text-sm text-gray-500">
                          Patient appointment completed • Service: General Care • 15 minutes ago
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                        <UserPlus className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-gray-900">New patient registration</p>
                        <p className="text-sm text-gray-500">
                          New user joined the platform • 1 hour ago
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                        <UserCheck className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-gray-900">New provider application submitted</p>
                        <p className="text-sm text-gray-500">
                          Healthcare professional applied for verification • 2 hours ago
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

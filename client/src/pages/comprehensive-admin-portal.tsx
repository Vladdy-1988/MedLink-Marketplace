import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { 
  Users, 
  Calendar, 
  Star, 
  TrendingUp, 
  CheckCircle, 
  XCircle, 
  Clock,
  DollarSign,
  Shield,
  AlertTriangle,
  MapPin,
  CreditCard,
  FileText,
  Settings,
  MessageSquare,
  Search,
  Filter,
  BarChart3,
  UserCheck,
  History,
  Flag,
  Eye,
  Download,
  PlusCircle,
  Ban,
  UserX,
  Trash2
} from "lucide-react";
import Navigation from "@/components/Navigation";

interface AdminStats {
  totalBookings: number;
  dailyBookings: number;
  weeklyBookings: number;
  monthlyBookings: number;
  activeProviders: number;
  pendingProviders: number;
  totalUsers: number;
  totalRevenue: number;
  avgRating: number;
  pendingCredentials: number;
  totalTransactions: number;
  platformCommission: number;
}

interface PendingCredential {
  id: number;
  providerId: number;
  providerName: string;
  credentialType: string;
  documentUrl: string;
  documentName: string;
  verificationStatus: string;
  expiryDate: string | null;
  submittedAt: string;
}

interface Transaction {
  id: number;
  bookingId: number;
  providerId: number;
  providerName: string;
  type: string;
  amount: number;
  platformFee: number;
  providerPayout: number;
  status: string;
  stripeTransactionId: string;
  createdAt: string;
}

interface Conversation {
  senderId: string;
  receiverId: string;
  senderName: string;
  receiverName: string;
  lastMessage: string;
  lastMessageAt: string;
  messageCount: number;
}

interface AuditLog {
  id: number;
  adminName: string;
  action: string;
  targetType: string;
  targetId: string;
  reason: string;
  ipAddress: string;
  createdAt: string;
}

interface SystemSetting {
  id: number;
  key: string;
  value: string;
  category: string;
  description: string;
  updatedBy: string;
  updatedAt: string;
}

export default function ComprehensiveAdminPortal() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedCredential, setSelectedCredential] = useState<PendingCredential | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [transactionFilter, setTransactionFilter] = useState({ status: "", type: "" });
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [suspendReason, setSuspendReason] = useState("");

  // Queries
  const { data: stats, isLoading: statsLoading } = useQuery<AdminStats>({
    queryKey: ['/api/admin/stats'],
    enabled: user?.userType === 'admin',
  });

  const { data: pendingCredentials, isLoading: credentialsLoading } = useQuery<PendingCredential[]>({
    queryKey: ['/api/admin/pending-credentials'],
    enabled: user?.userType === 'admin',
  });

  const { data: transactions, isLoading: transactionsLoading } = useQuery<Transaction[]>({
    queryKey: ['/api/admin/transactions', transactionFilter],
    enabled: user?.userType === 'admin',
  });

  const { data: allUsers, isLoading: usersLoading } = useQuery({
    queryKey: ['/api/admin/users'],
    enabled: user?.userType === 'admin',
  });

  const { data: auditLogs, isLoading: auditLogsLoading } = useQuery<AuditLog[]>({
    queryKey: ['/api/admin/audit-logs'],
    enabled: user?.userType === 'admin',
  });

  const { data: conversations, isLoading: conversationsLoading } = useQuery<Conversation[]>({
    queryKey: ['/api/admin/conversations'],
    enabled: user?.userType === 'admin',
  });

  const { data: systemSettings, isLoading: settingsLoading } = useQuery<SystemSetting[]>({
    queryKey: ['/api/admin/settings'],
    enabled: user?.userType === 'admin',
  });

  // Mutations
  const verificationMutation = useMutation({
    mutationFn: ({ id, status, reviewNotes }: { id: number; status: string; reviewNotes: string }) =>
      apiRequest("PATCH", `/api/admin/credentials/${id}/verification`, { status, reviewNotes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/pending-credentials'] });
      setSelectedCredential(null);
      setReviewNotes("");
      toast({
        title: "Verification Updated",
        description: "Provider credential verification has been updated successfully.",
      });
    },
  });

  const suspendUserMutation = useMutation({
    mutationFn: ({ userId, reason }: { userId: string; reason: string }) =>
      apiRequest("PATCH", `/api/admin/users/${userId}/suspend`, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      setSelectedUser(null);
      setSuspendReason("");
      toast({
        title: "User Suspended",
        description: "User has been suspended successfully.",
      });
    },
  });

  const reactivateUserMutation = useMutation({
    mutationFn: (userId: string) =>
      apiRequest("PATCH", `/api/admin/users/${userId}/reactivate`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: "User Reactivated",
        description: "User has been reactivated successfully.",
      });
    },
  });

  const flagConversationMutation = useMutation({
    mutationFn: ({ conversationId, reason }: { conversationId: string; reason: string }) =>
      apiRequest("POST", `/api/admin/conversations/${conversationId}/flag`, { reason }),
    onSuccess: () => {
      toast({
        title: "Conversation Flagged",
        description: "Conversation has been flagged for review.",
      });
    },
  });

  // Helper functions
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'verified':
      case 'approved':
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Verified</Badge>;
      case 'rejected':
      case 'failed':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      case 'suspended':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200"><Ban className="w-3 h-3 mr-1" />Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
    }).format(amount);
  };

  if (user?.userType !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="text-center py-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
              <p className="text-gray-600">You don't have permission to access this page.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 data-testid="page-title" className="text-3xl font-bold text-gray-900">Comprehensive Admin Portal</h1>
          <p className="text-gray-600 mt-2">Complete healthcare marketplace management system</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-8 w-full">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="verification" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Verification
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Financial
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="communications" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Communications
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="audit" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              Audit Logs
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {statsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                          <p className="text-2xl font-bold text-gray-900">{stats?.totalBookings || 0}</p>
                        </div>
                        <Calendar className="h-8 w-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Active Providers</p>
                          <p className="text-2xl font-bold text-gray-900">{stats?.activeProviders || 0}</p>
                        </div>
                        <UserCheck className="h-8 w-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                          <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats?.totalRevenue || 0)}</p>
                        </div>
                        <DollarSign className="h-8 w-8 text-purple-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Platform Rating</p>
                          <p className="text-2xl font-bold text-gray-900">{stats?.avgRating?.toFixed(1) || 0}</p>
                        </div>
                        <Star className="h-8 w-8 text-yellow-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Pending Reviews
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Provider Applications</span>
                          <span className="font-semibold">{stats?.pendingProviders || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Document Verifications</span>
                          <span className="font-semibold">{stats?.pendingCredentials || 0}</span>
                        </div>
                        <Link href="/provider-verification">
                          <Button size="sm" className="w-full mt-3">
                            Review Pending Items
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Financial Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Total Transactions</span>
                          <span className="font-semibold">{stats?.totalTransactions || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Platform Commission</span>
                          <span className="font-semibold">{formatCurrency(stats?.platformCommission || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Monthly Revenue</span>
                          <span className="font-semibold">{formatCurrency(stats?.monthlyBookings || 0)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Quick Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => setActiveTab('verification')}>
                          <FileText className="w-4 h-4 mr-2" />
                          Review Documents
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => setActiveTab('users')}>
                          <Users className="w-4 h-4 mr-2" />
                          Manage Users
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => setActiveTab('audit')}>
                          <History className="w-4 h-4 mr-2" />
                          View Audit Logs
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>

          {/* Verification Tab */}
          <TabsContent value="verification" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Provider Document Verification
                </CardTitle>
                <CardDescription>
                  Review and verify provider credentials and professional documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                {credentialsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Provider</TableHead>
                        <TableHead>Document Type</TableHead>
                        <TableHead>Document Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingCredentials?.map((credential) => (
                        <TableRow key={credential.id} data-testid={`credential-row-${credential.id}`}>
                          <TableCell className="font-medium">{credential.providerName}</TableCell>
                          <TableCell>{credential.credentialType}</TableCell>
                          <TableCell className="max-w-xs truncate">{credential.documentName || 'Document'}</TableCell>
                          <TableCell>{getStatusBadge(credential.verificationStatus)}</TableCell>
                          <TableCell>{new Date(credential.submittedAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedCredential(credential)}
                                  data-testid={`button-review-${credential.id}`}
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  Review
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Review Provider Credential</DialogTitle>
                                  <DialogDescription>
                                    Verify the submitted document and approve or reject the credential
                                  </DialogDescription>
                                </DialogHeader>
                                
                                {selectedCredential && (
                                  <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label className="text-sm font-medium">Provider</Label>
                                        <p className="text-gray-600">{selectedCredential.providerName}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Document Type</Label>
                                        <p className="text-gray-600">{selectedCredential.credentialType}</p>
                                      </div>
                                    </div>

                                    <div className="border rounded-lg p-4 bg-gray-50">
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-900">Document</span>
                                        <Button variant="outline" size="sm" asChild>
                                          <a href={selectedCredential.documentUrl} target="_blank" rel="noopener noreferrer">
                                            <Download className="w-4 h-4 mr-1" />
                                            View Document
                                          </a>
                                        </Button>
                                      </div>
                                      <p className="text-sm text-gray-600">Click "View Document" to open the submitted file for review.</p>
                                    </div>

                                    <div className="space-y-2">
                                      <Label htmlFor="reviewNotes">Review Notes</Label>
                                      <Textarea
                                        id="reviewNotes"
                                        data-testid="textarea-review-notes"
                                        placeholder="Add any notes about the verification..."
                                        value={reviewNotes}
                                        onChange={(e) => setReviewNotes(e.target.value)}
                                        rows={3}
                                      />
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                      <Button
                                        onClick={() => verificationMutation.mutate({ 
                                          id: selectedCredential.id, 
                                          status: 'verified', 
                                          reviewNotes 
                                        })}
                                        disabled={verificationMutation.isPending}
                                        className="bg-green-600 hover:bg-green-700"
                                        data-testid="button-approve"
                                      >
                                        <CheckCircle className="w-4 h-4 mr-1" />
                                        Approve & Verify
                                      </Button>
                                      <Button
                                        variant="destructive"
                                        onClick={() => verificationMutation.mutate({ 
                                          id: selectedCredential.id, 
                                          status: 'rejected', 
                                          reviewNotes 
                                        })}
                                        disabled={verificationMutation.isPending}
                                        data-testid="button-reject"
                                      >
                                        <XCircle className="w-4 h-4 mr-1" />
                                        Reject
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}

                {!credentialsLoading && (!pendingCredentials || pendingCredentials.length === 0) && (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Reviews</h3>
                    <p className="text-gray-600">All provider credentials have been reviewed.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Financial Management Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Financial Management
                </CardTitle>
                <CardDescription>
                  Monitor transactions, payments, and platform revenue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-6">
                  <Select value={transactionFilter.status} onValueChange={(value) => setTransactionFilter(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={transactionFilter.type} onValueChange={(value) => setTransactionFilter(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Types</SelectItem>
                      <SelectItem value="booking">Booking Payment</SelectItem>
                      <SelectItem value="payout">Provider Payout</SelectItem>
                      <SelectItem value="refund">Refund</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {transactionsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Provider</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Platform Fee</TableHead>
                        <TableHead>Provider Payout</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions?.map((transaction) => (
                        <TableRow key={transaction.id} data-testid={`transaction-row-${transaction.id}`}>
                          <TableCell className="font-medium">#{transaction.id}</TableCell>
                          <TableCell>{transaction.providerName || 'N/A'}</TableCell>
                          <TableCell className="capitalize">{transaction.type}</TableCell>
                          <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                          <TableCell>{formatCurrency(transaction.platformFee)}</TableCell>
                          <TableCell>{formatCurrency(transaction.providerPayout)}</TableCell>
                          <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                          <TableCell>{new Date(transaction.createdAt).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Management
                </CardTitle>
                <CardDescription>
                  Manage platform users, suspend accounts, and monitor user activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>User Type</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allUsers?.map((user: any) => (
                        <TableRow key={user.id} data-testid={`user-row-${user.id}`}>
                          <TableCell className="font-medium">{user.firstName} {user.lastName}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell className="capitalize">{user.userType}</TableCell>
                          <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>{getStatusBadge(user.userType === 'suspended' ? 'suspended' : 'active')}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {user.userType !== 'suspended' ? (
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setSelectedUser(user)}
                                      data-testid={`button-suspend-${user.id}`}
                                    >
                                      <Ban className="w-4 h-4 mr-1" />
                                      Suspend
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Suspend User</DialogTitle>
                                      <DialogDescription>
                                        Suspend {selectedUser?.firstName} {selectedUser?.lastName} from the platform
                                      </DialogDescription>
                                    </DialogHeader>
                                    
                                    <div className="space-y-4">
                                      <div>
                                        <Label htmlFor="suspendReason">Reason for Suspension</Label>
                                        <Textarea
                                          id="suspendReason"
                                          placeholder="Provide a reason for suspension..."
                                          value={suspendReason}
                                          onChange={(e) => setSuspendReason(e.target.value)}
                                          rows={3}
                                        />
                                      </div>
                                      
                                      <div className="flex gap-3">
                                        <Button
                                          variant="destructive"
                                          onClick={() => suspendUserMutation.mutate({ 
                                            userId: selectedUser?.id, 
                                            reason: suspendReason 
                                          })}
                                          disabled={suspendUserMutation.isPending || !suspendReason}
                                        >
                                          <Ban className="w-4 h-4 mr-1" />
                                          Suspend User
                                        </Button>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => reactivateUserMutation.mutate(user.id)}
                                  disabled={reactivateUserMutation.isPending}
                                  data-testid={`button-reactivate-${user.id}`}
                                >
                                  <UserCheck className="w-4 h-4 mr-1" />
                                  Reactivate
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Communications Tab */}
          <TabsContent value="communications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Communication Oversight
                </CardTitle>
                <CardDescription>
                  Monitor conversations between patients and providers
                </CardDescription>
              </CardHeader>
              <CardContent>
                {conversationsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Participants</TableHead>
                        <TableHead>Last Message</TableHead>
                        <TableHead>Message Count</TableHead>
                        <TableHead>Last Activity</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {conversations?.map((conversation, index) => (
                        <TableRow key={`${conversation.senderId}-${conversation.receiverId}`} data-testid={`conversation-row-${index}`}>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium">{conversation.senderName}</div>
                              <div className="text-sm text-gray-600">↔ {conversation.receiverName}</div>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">{conversation.lastMessage}</TableCell>
                          <TableCell>{conversation.messageCount}</TableCell>
                          <TableCell>{new Date(conversation.lastMessageAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => flagConversationMutation.mutate({ 
                                conversationId: `${conversation.senderId}-${conversation.receiverId}`, 
                                reason: 'Manual review requested' 
                              })}
                              disabled={flagConversationMutation.isPending}
                              data-testid={`button-flag-${index}`}
                            >
                              <Flag className="w-4 h-4 mr-1" />
                              Flag
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  System Settings
                </CardTitle>
                <CardDescription>
                  Configure platform settings and system parameters
                </CardDescription>
              </CardHeader>
              <CardContent>
                {settingsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {systemSettings?.map((setting) => (
                      <div key={setting.id} className="border rounded-lg p-4" data-testid={`setting-${setting.key}`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{setting.key}</h3>
                            <p className="text-sm text-gray-600">{setting.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Input
                              defaultValue={setting.value}
                              className="w-48"
                              data-testid={`input-setting-${setting.key}`}
                            />
                            <Button size="sm" data-testid={`button-update-${setting.key}`}>
                              Update
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Logs Tab */}
          <TabsContent value="audit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Audit Logs
                </CardTitle>
                <CardDescription>
                  Track all administrative actions and system changes
                </CardDescription>
              </CardHeader>
              <CardContent>
                {auditLogsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Admin</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Target Type</TableHead>
                        <TableHead>Target ID</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {auditLogs?.map((log) => (
                        <TableRow key={log.id} data-testid={`audit-log-${log.id}`}>
                          <TableCell className="font-medium">{log.adminName}</TableCell>
                          <TableCell className="capitalize">{log.action.replace('_', ' ')}</TableCell>
                          <TableCell className="capitalize">{log.targetType}</TableCell>
                          <TableCell>{log.targetId}</TableCell>
                          <TableCell className="max-w-xs truncate">{log.reason}</TableCell>
                          <TableCell>{new Date(log.createdAt).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Platform Analytics
                </CardTitle>
                <CardDescription>
                  Detailed insights and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Advanced Analytics</h3>
                  <p className="text-gray-600">Detailed analytics dashboard coming soon.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock,
  Eye,
  Download,
  Calendar
} from "lucide-react";
import Navigation from "@/components/Navigation";

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

export default function ProviderVerification() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedCredential, setSelectedCredential] = useState<PendingCredential | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");

  const { data: pendingCredentials, isLoading } = useQuery<PendingCredential[]>({
    queryKey: ['/api/admin/pending-credentials'],
    // UI-only role check for query gating. Server/API enforce real authorization.
    enabled: user?.userType === 'admin',
  });

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
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update verification status.",
        variant: "destructive",
      });
    },
  });

  const handleVerification = (status: 'verified' | 'rejected') => {
    if (!selectedCredential) return;
    
    verificationMutation.mutate({
      id: selectedCredential.id,
      status,
      reviewNotes,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'verified':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Verified</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCredentialTypeLabel = (type: string) => {
    switch (type) {
      case 'license':
        return 'Professional License';
      case 'certification':
        return 'Certification';
      case 'insurance':
        return 'Insurance Certificate';
      case 'education':
        return 'Education Credentials';
      case 'background_check':
        return 'Background Check';
      default:
        return type;
    }
  };

  // UI-only role check for rendering. Server/API enforce real authorization.
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
          <h1 data-testid="page-title" className="text-3xl font-bold text-gray-900">Provider Verification</h1>
          <p className="text-gray-600 mt-2">Review and verify provider credentials and documents</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Pending Credential Reviews
            </CardTitle>
            <CardDescription>
              Review submitted provider documents for verification
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
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
                    <TableHead>Expires</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingCredentials?.map((credential: PendingCredential) => (
                    <TableRow key={credential.id} data-testid={`credential-row-${credential.id}`}>
                      <TableCell className="font-medium">{credential.providerName}</TableCell>
                      <TableCell>{getCredentialTypeLabel(credential.credentialType)}</TableCell>
                      <TableCell className="max-w-xs truncate">{credential.documentName || 'Document'}</TableCell>
                      <TableCell>{getStatusBadge(credential.verificationStatus)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="w-3 h-3" />
                          {new Date(credential.submittedAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        {credential.expiryDate ? (
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Calendar className="w-3 h-3" />
                            {new Date(credential.expiryDate).toLocaleDateString()}
                          </div>
                        ) : (
                          <span className="text-gray-400">No expiry</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                data-testid={`button-review-${credential.id}`}
                                onClick={() => setSelectedCredential(credential)}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Review
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Review Credential</DialogTitle>
                                <DialogDescription>
                                  Review and verify the submitted document for {selectedCredential?.providerName}
                                </DialogDescription>
                              </DialogHeader>
                              
                              {selectedCredential && (
                                <div className="space-y-6">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium text-gray-900">Provider</label>
                                      <p className="text-gray-600">{selectedCredential.providerName}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-900">Document Type</label>
                                      <p className="text-gray-600">{getCredentialTypeLabel(selectedCredential.credentialType)}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-900">Document Name</label>
                                      <p className="text-gray-600">{selectedCredential.documentName || 'Document'}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-900">Submitted</label>
                                      <p className="text-gray-600">{new Date(selectedCredential.submittedAt).toLocaleDateString()}</p>
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
                                    <p className="text-sm text-gray-600">Click "View Document" to open the submitted file in a new tab for review.</p>
                                  </div>

                                  <div className="space-y-2">
                                    <label htmlFor="reviewNotes" className="text-sm font-medium text-gray-900">
                                      Review Notes
                                    </label>
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
                                      onClick={() => handleVerification('verified')}
                                      disabled={verificationMutation.isPending}
                                      className="bg-green-600 hover:bg-green-700"
                                      data-testid="button-approve"
                                    >
                                      <CheckCircle className="w-4 h-4 mr-1" />
                                      Approve & Verify
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      onClick={() => handleVerification('rejected')}
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
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {!isLoading && (!pendingCredentials || pendingCredentials.length === 0) && (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Reviews</h3>
                <p className="text-gray-600">All provider credentials have been reviewed.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

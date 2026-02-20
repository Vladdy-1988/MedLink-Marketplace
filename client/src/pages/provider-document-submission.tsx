import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, apiRequestJson, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ObjectUploader } from "@/components/ObjectUploader";
import { 
  FileText, 
  Upload,
  CheckCircle, 
  XCircle, 
  Clock,
  Calendar,
  AlertCircle
} from "lucide-react";
import Navigation from "@/components/Navigation";

interface ProviderCredential {
  id: number;
  credentialType: string;
  documentName: string;
  verificationStatus: string;
  submittedAt: string;
  expiryDate: string | null;
}

export default function ProviderDocumentSubmission() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [credentialType, setCredentialType] = useState("");
  const [documentName, setDocumentName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [uploadedDocumentUrl, setUploadedDocumentUrl] = useState("");

  const { data: credentials, isLoading } = useQuery<ProviderCredential[]>({
    queryKey: ['/api/providers/credentials', user?.id],
    queryFn: () => apiRequestJson<ProviderCredential[]>('GET', `/api/providers/credentials/${user?.id}`),
    enabled: !!user?.id,
  });

  const submitCredentialMutation = useMutation({
    mutationFn: (data: { credentialType: string; documentUrl: string; documentName: string; expiryDate?: string }) =>
      apiRequest("POST", '/api/providers/credentials', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/providers/credentials'] });
      setCredentialType("");
      setDocumentName("");
      setExpiryDate("");
      setUploadedDocumentUrl("");
      toast({
        title: "Document Submitted",
        description: "Your credential document has been submitted for review.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit document.",
        variant: "destructive",
      });
    },
  });

  const handleGetUploadParameters = async () => {
    const response = await apiRequest("POST", '/api/providers/documents/upload');
    const data = await response.json();
    return { method: "PUT" as const, url: data.uploadURL };
  };

  const handleUploadComplete = (result: any) => {
    if (result.successful && result.successful.length > 0) {
      setUploadedDocumentUrl(result.successful[0].uploadURL);
      toast({
        title: "Upload Complete",
        description: "Document uploaded successfully. Please fill in the details below.",
      });
    }
  };

  const handleSubmit = () => {
    if (!credentialType || !uploadedDocumentUrl || !documentName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and upload a document.",
        variant: "destructive",
      });
      return;
    }

    submitCredentialMutation.mutate({
      credentialType,
      documentUrl: uploadedDocumentUrl,
      documentName,
      expiryDate: expiryDate || undefined,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1" />Pending Review</Badge>;
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 data-testid="page-title" className="text-3xl font-bold text-gray-900">Submit Credentials</h1>
          <p className="text-gray-600 mt-2">Upload your professional documents for verification</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload New Document
              </CardTitle>
              <CardDescription>
                Submit your professional credentials for admin review and verification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="credentialType">Document Type *</Label>
                <Select value={credentialType} onValueChange={setCredentialType}>
                  <SelectTrigger data-testid="select-credential-type">
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="license">Professional License</SelectItem>
                    <SelectItem value="certification">Certification</SelectItem>
                    <SelectItem value="insurance">Insurance Certificate</SelectItem>
                    <SelectItem value="education">Education Credentials</SelectItem>
                    <SelectItem value="background_check">Background Check</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="documentName">Document Name *</Label>
                <Input
                  id="documentName"
                  data-testid="input-document-name"
                  placeholder="e.g., RN License - Alberta"
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
                <Input
                  id="expiryDate"
                  data-testid="input-expiry-date"
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Upload Document *</Label>
                <ObjectUploader
                  maxNumberOfFiles={1}
                  maxFileSize={10485760} // 10MB
                  onGetUploadParameters={handleGetUploadParameters}
                  onComplete={handleUploadComplete}
                  buttonClassName="w-full"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    {uploadedDocumentUrl ? 'Document Uploaded ✓' : 'Choose File to Upload'}
                  </div>
                </ObjectUploader>
                {uploadedDocumentUrl && (
                  <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 p-2 rounded">
                    <CheckCircle className="w-4 h-4" />
                    Document uploaded successfully
                  </div>
                )}
              </div>

              <Button
                onClick={handleSubmit}
                disabled={submitCredentialMutation.isPending || !credentialType || !uploadedDocumentUrl || !documentName}
                className="w-full"
                data-testid="button-submit-document"
              >
                {submitCredentialMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    Submitting...
                  </div>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Submit Document
                  </>
                )}
              </Button>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900 mb-1">Important Guidelines:</p>
                    <ul className="text-blue-700 space-y-1">
                      <li>• Upload clear, high-quality scans or photos</li>
                      <li>• Ensure all text is readable</li>
                      <li>• File size limit: 10MB</li>
                      <li>• Supported formats: PDF, JPG, PNG</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Existing Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Submitted Documents
              </CardTitle>
              <CardDescription>
                Track the status of your submitted credentials
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  {credentials?.map((credential: ProviderCredential) => (
                    <div key={credential.id} className="border rounded-lg p-4" data-testid={`credential-card-${credential.id}`}>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-900">{credential.documentName}</h3>
                        {getStatusBadge(credential.verificationStatus)}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">
                        {getCredentialTypeLabel(credential.credentialType)}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Submitted: {new Date(credential.submittedAt).toLocaleDateString()}
                        </div>
                        {credential.expiryDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Expires: {new Date(credential.expiryDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {(!credentials || credentials.length === 0) && (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Documents Submitted</h3>
                      <p className="text-gray-600">Upload your first credential document to get started.</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

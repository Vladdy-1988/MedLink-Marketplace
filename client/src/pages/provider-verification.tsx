import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { ProviderCredential } from "@shared/schema";

const credentialTypes = [
  {
    type: "license",
    name: "Medical License",
    description: "Your primary medical practice license",
    required: true,
  },
  {
    type: "certification",
    name: "Board Certification",
    description: "Specialty board certification documents",
    required: false,
  },
  {
    type: "insurance",
    name: "Malpractice Insurance",
    description: "Current malpractice insurance certificate",
    required: true,
  },
  {
    type: "education",
    name: "Medical Degree",
    description: "Medical school diploma or transcript",
    required: false,
  },
];

export default function ProviderVerification() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [credentials, setCredentials] = useState<ProviderCredential[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingType, setUploadingType] = useState<string | null>(null);

  useEffect(() => {
    fetchCredentials();
  }, []);

  const fetchCredentials = async () => {
    try {
      const response = await apiRequest("GET", `/api/providers/credentials/${user?.id}`);
      const data = await response.json();
      setCredentials(data);
    } catch (error) {
      console.error("Error fetching credentials:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (file: File, credentialType: string) => {
    setUploadingType(credentialType);
    
    try {
      // In a real implementation, you would upload to object storage
      // For now, we'll simulate the upload
      const formData = new FormData();
      formData.append("file", file);
      formData.append("credentialType", credentialType);

      const response = await apiRequest("POST", "/api/providers/credentials/upload", formData);
      const result = await response.json();

      toast({
        title: "Document Uploaded",
        description: "Your document has been uploaded and is pending verification.",
      });

      fetchCredentials();
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingType(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Verified</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Pending</Badge>;
      default:
        return <Badge variant="outline">Not Uploaded</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Provider Verification
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Upload your credentials to complete the verification process and start accepting patients.
          </p>
        </div>

        {/* Verification Status Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Verification Status</CardTitle>
            <CardDescription>
              Your overall verification progress and next steps
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                  Verification in Progress
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Upload all required documents to complete your verification and start accepting patients.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Credential Types */}
        <div className="space-y-6">
          {credentialTypes.map((credType) => {
            const existingCredential = credentials.find(c => c.credentialType === credType.type);
            
            return (
              <Card key={credType.type}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(existingCredential?.verificationStatus || "not_uploaded")}
                      <div>
                        <CardTitle className="text-lg">
                          {credType.name}
                          {credType.required && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </CardTitle>
                        <CardDescription>{credType.description}</CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(existingCredential?.verificationStatus || "not_uploaded")}
                  </div>
                </CardHeader>
                
                <CardContent>
                  {existingCredential ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Document Uploaded</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Uploaded on {new Date(existingCredential.createdAt!).toLocaleDateString()}
                            </p>
                            {existingCredential.expiryDate && (
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Expires: {new Date(existingCredential.expiryDate).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          
                          {existingCredential.verificationStatus === "rejected" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const input = document.createElement("input");
                                input.type = "file";
                                input.accept = ".pdf,.jpg,.jpeg,.png";
                                input.onchange = (e) => {
                                  const file = (e.target as HTMLInputElement).files?.[0];
                                  if (file) handleFileUpload(file, credType.type);
                                };
                                input.click();
                              }}
                              disabled={uploadingType === credType.type}
                              data-testid={`button-reupload-${credType.type}`}
                            >
                              {uploadingType === credType.type ? (
                                <>
                                  <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                                  Uploading...
                                </>
                              ) : (
                                <>
                                  <Upload className="w-4 h-4 mr-2" />
                                  Re-upload
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                        
                        {existingCredential.verificationStatus === "rejected" && (
                          <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                            <p className="text-sm text-red-700 dark:text-red-300">
                              <strong>Rejection Reason:</strong> Document quality was insufficient or information was unclear. 
                              Please upload a clearer, high-resolution version.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                        <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          Upload your {credType.name.toLowerCase()}
                        </p>
                        <Button
                          onClick={() => {
                            const input = document.createElement("input");
                            input.type = "file";
                            input.accept = ".pdf,.jpg,.jpeg,.png";
                            input.onchange = (e) => {
                              const file = (e.target as HTMLInputElement).files?.[0];
                              if (file) handleFileUpload(file, credType.type);
                            };
                            input.click();
                          }}
                          disabled={uploadingType === credType.type}
                          data-testid={`button-upload-${credType.type}`}
                        >
                          {uploadingType === credType.type ? (
                            <>
                              <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4 mr-2" />
                              Choose File
                            </>
                          )}
                        </Button>
                      </div>
                      
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <p><strong>Accepted formats:</strong> PDF, JPG, PNG</p>
                        <p><strong>Max file size:</strong> 10MB</p>
                        <p><strong>Requirements:</strong> Clear, readable, and current documents</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Help Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
            <CardDescription>
              Having trouble with the verification process?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <p>
                <strong>Verification Timeline:</strong> Most documents are reviewed within 24-48 hours.
              </p>
              <p>
                <strong>Document Quality:</strong> Ensure all text is clearly readable and the document is complete.
              </p>
              <p>
                <strong>Support:</strong> Contact our verification team at{" "}
                <a href="mailto:verification@medlink.ca" className="text-blue-600 dark:text-blue-400 hover:underline">
                  verification@medlink.ca
                </a>
                {" "}if you have questions.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
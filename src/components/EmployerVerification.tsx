import { useState } from 'react';
import { Upload, FileText, CheckCircle, XCircle, Clock, Building2, Shield, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface VerificationDocument {
  id: string;
  type: 'business_license' | 'gst_certificate' | 'pan_card' | 'address_proof' | 'authorization_letter';
  name: string;
  description: string;
  required: boolean;
  uploaded: boolean;
  status: 'pending' | 'approved' | 'rejected';
  fileUrl?: string;
  uploadedAt?: string;
  rejectionReason?: string;
}

interface EmployerVerificationProps {
  onNavigate: (page: string) => void;
}

const verificationDocuments: VerificationDocument[] = [
  {
    id: 'doc-1',
    type: 'business_license',
    name: 'Business License',
    description: 'Valid business license or registration certificate',
    required: true,
    uploaded: false,
    status: 'pending'
  },
  {
    id: 'doc-2',
    type: 'gst_certificate',
    name: 'GST Certificate',
    description: 'GST registration certificate (if applicable)',
    required: true,
    uploaded: false,
    status: 'pending'
  },
  {
    id: 'doc-3',
    type: 'pan_card',
    name: 'PAN Card',
    description: 'PAN card of the organization or authorized signatory',
    required: true,
    uploaded: false,
    status: 'pending'
  },
  {
    id: 'doc-4',
    type: 'address_proof',
    name: 'Address Proof',
    description: 'Utility bill or rent agreement for business address',
    required: true,
    uploaded: false,
    status: 'pending'
  },
  {
    id: 'doc-5',
    type: 'authorization_letter',
    name: 'Authorization Letter',
    description: 'Letter authorizing the contact person to post jobs on behalf of the organization',
    required: true,
    uploaded: false,
    status: 'pending'
  }
];

export function EmployerVerification({ onNavigate }: EmployerVerificationProps) {
  const [documents, setDocuments] = useState<VerificationDocument[]>(verificationDocuments);
  const [currentStep, setCurrentStep] = useState(1);

  const uploadedCount = documents.filter(doc => doc.uploaded).length;
  const approvedCount = documents.filter(doc => doc.status === 'approved').length;
  const totalRequired = documents.filter(doc => doc.required).length;
  const progress = (uploadedCount / totalRequired) * 100;

  const handleFileUpload = (documentId: string, file: File) => {
    // In a real app, this would upload to a server
    setDocuments(prev => 
      prev.map(doc => 
        doc.id === documentId 
          ? { 
              ...doc, 
              uploaded: true, 
              fileUrl: URL.createObjectURL(file),
              uploadedAt: new Date().toISOString(),
              status: 'pending'
            }
          : doc
      )
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const isVerificationComplete = approvedCount === totalRequired;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl text-gray-900 mb-2">Employer Verification</h1>
          <p className="text-gray-600">Complete your verification to start posting jobs</p>
        </div>

        {/* Progress Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Documents Uploaded</p>
                <p className="text-3xl text-gray-900">{uploadedCount}/{totalRequired}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Approved</p>
                <p className="text-3xl text-gray-900">{approvedCount}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Pending Review</p>
                <p className="text-3xl text-gray-900">{uploadedCount - approvedCount}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Verification Status</p>
                <p className="text-sm font-medium">
                  {isVerificationComplete ? 'Complete' : 'In Progress'}
                </p>
              </div>
              <Shield className={`w-8 h-8 ${isVerificationComplete ? 'text-green-600' : 'text-orange-600'}`} />
            </div>
          </Card>
        </div>

        {/* Progress Bar */}
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg text-gray-900">Verification Progress</h3>
            <span className="text-sm text-gray-600">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-3" />
          <p className="text-sm text-gray-600 mt-2">
            {uploadedCount} of {totalRequired} required documents uploaded
          </p>
        </Card>

        {/* Status Alert */}
        {!isVerificationComplete && (
          <Alert className="mb-8 border-yellow-200 bg-yellow-50">
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              Your account is under verification. You can upload documents and browse the platform, 
              but job posting will be enabled only after verification is complete.
            </AlertDescription>
          </Alert>
        )}

        {isVerificationComplete && (
          <Alert className="mb-8 border-green-200 bg-green-50">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Congratulations! Your verification is complete. You can now post jobs and access all employer features.
            </AlertDescription>
          </Alert>
        )}

        {/* Documents Section */}
        <Tabs defaultValue="documents" className="w-full">
          <TabsList>
            <TabsTrigger value="documents">Upload Documents</TabsTrigger>
            <TabsTrigger value="status">Verification Status</TabsTrigger>
            <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
          </TabsList>

          <TabsContent value="documents" className="mt-6">
            <div className="space-y-6">
              {documents.map((document) => (
                <Card key={document.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg text-gray-900">{document.name}</h3>
                        {document.required && (
                          <Badge className="bg-red-100 text-red-700 border-red-200" variant="outline">
                            Required
                          </Badge>
                        )}
                        {document.uploaded && (
                          <Badge className={getStatusColor(document.status)} variant="outline">
                            {document.status}
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600 mb-4">{document.description}</p>
                      
                      {document.uploaded && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                          {getStatusIcon(document.status)}
                          <span>
                            Uploaded on {document.uploadedAt ? new Date(document.uploadedAt).toLocaleDateString('en-IN') : 'N/A'}
                          </span>
                        </div>
                      )}

                      {document.status === 'rejected' && document.rejectionReason && (
                        <Alert className="mb-4 border-red-200 bg-red-50">
                          <XCircle className="w-4 h-4 text-red-600" />
                          <AlertDescription className="text-red-800">
                            <strong>Rejection Reason:</strong> {document.rejectionReason}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {!document.uploaded ? (
                      <FileUploadButton
                        onFileSelect={(file) => handleFileUpload(document.id, file)}
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                    ) : (
                      <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm">
                          <FileText className="w-4 h-4 mr-2" />
                          View Document
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            // Reset document status
                            setDocuments(prev => 
                              prev.map(doc => 
                                doc.id === document.id 
                                  ? { ...doc, uploaded: false, status: 'pending', fileUrl: undefined }
                                  : doc
                              )
                            );
                          }}
                        >
                          Replace
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="status" className="mt-6">
            <Card className="p-6">
              <h3 className="text-lg text-gray-900 mb-4">Verification Timeline</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium">Document Upload</p>
                    <p className="text-sm text-gray-600">Upload all required documents</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    uploadedCount > 0 ? 'bg-yellow-500' : 'bg-gray-300'
                  }`}>
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium">Under Review</p>
                    <p className="text-sm text-gray-600">Our team is reviewing your documents (1-2 business days)</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isVerificationComplete ? 'bg-green-500' : 'bg-gray-300'
                  }`}>
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium">Verification Complete</p>
                    <p className="text-sm text-gray-600">Start posting jobs and accessing all features</p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="guidelines" className="mt-6">
            <Card className="p-6">
              <h3 className="text-lg text-gray-900 mb-4">Document Guidelines</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">File Requirements</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Supported formats: PDF, JPG, JPEG, PNG</li>
                    <li>• Maximum file size: 5MB per document</li>
                    <li>• Documents must be clear and readable</li>
                    <li>• All text should be visible and not cut off</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Document Quality</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Ensure documents are not expired</li>
                    <li>• All information should be clearly visible</li>
                    <li>• Avoid blurry or low-quality images</li>
                    <li>• Documents should be in English or Hindi</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Privacy & Security</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Your documents are encrypted and secure</li>
                    <li>• We only use them for verification purposes</li>
                    <li>• Documents are not shared with third parties</li>
                    <li>• You can request document deletion anytime</li>
                  </ul>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-8">
          <Button variant="outline" onClick={() => onNavigate('dashboard')}>
            Back to Dashboard
          </Button>
          {isVerificationComplete && (
            <Button 
              className="bg-green-600 hover:bg-green-700"
              onClick={() => onNavigate('post-job')}
            >
              Start Posting Jobs
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

interface FileUploadButtonProps {
  onFileSelect: (file: File) => void;
  accept: string;
}

function FileUploadButton({ onFileSelect, accept }: FileUploadButtonProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
        isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
    >
      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
      <p className="text-sm text-gray-600 mb-2">
        Drag and drop your file here, or click to browse
      </p>
      <input
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
      />
      <Button variant="outline" size="sm" asChild>
        <label htmlFor="file-upload" className="cursor-pointer">
          Choose File
        </label>
      </Button>
    </div>
  );
}



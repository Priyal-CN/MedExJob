import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Bell, 
  User, 
  Building, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock,
  Eye,
  Download
} from 'lucide-react';
import { fetchVerificationRequests, VerificationRequest } from '../api/employers';

interface VerificationNotificationProps {
  onNavigate: (page: string) => void;
}

export const VerificationNotification: React.FC<VerificationNotificationProps> = ({ onNavigate }) => {
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);

  // Load real verification requests from API
  useEffect(() => {
    const loadVerificationRequests = async () => {
      try {
        setLoading(true);
        const data = await fetchVerificationRequests(0, 50);
        setRequests(data.requests);
      } catch (err) {
        setError('Failed to load verification requests');
        console.error('Error loading verification requests:', err);
      } finally {
        setLoading(false);
      }
    };

    loadVerificationRequests();
    
    // Refresh every 30 seconds
    const interval = setInterval(loadVerificationRequests, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleApprove = async (requestId: string) => {
    try {
      console.log('Approving verification request:', requestId);
      
      // Call backend API to approve verification
      const response = await fetch(`http://localhost:8082/api/employers/${requestId}/verification?status=approved`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to approve verification');
      }
      
      // Update local state
      setRequests(prev => prev.map(req => 
        req.id === requestId ? { ...req, status: 'approved' } : req
      ));
      
      // Show success message
      alert('Verification approved successfully!');
    } catch (err) {
      console.error('Error approving verification:', err);
      alert('Failed to approve verification');
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      console.log('Rejecting verification request:', requestId);
      
      // Call backend API to reject verification
      const response = await fetch(`http://localhost:8082/api/employers/${requestId}/verification?status=rejected`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to reject verification');
      }
      
      // Update local state
      setRequests(prev => prev.map(req => 
        req.id === requestId ? { ...req, status: 'rejected' } : req
      ));
      
      // Show success message
      alert('Verification rejected');
    } catch (err) {
      console.error('Error rejecting verification:', err);
      alert('Failed to reject verification');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="text-green-600 border-green-600"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="text-red-600 border-red-600"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading verification requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Verification Requests</h1>
                  <p className="text-sm text-gray-600">Review and approve employer verification requests</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-4 py-2">
                  {requests.filter(r => r.status === 'pending').length} Pending
                </Badge>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => onNavigate('dashboard')}
                variant="outline"
                className="border-blue-300 text-blue-700 hover:bg-blue-50 px-6 py-2 rounded-lg font-medium"
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {requests.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-blue-200 p-12 text-center">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bell className="w-10 h-10 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Verification Requests</h3>
            <p className="text-lg text-gray-600 mb-6">No pending verification requests at the moment.</p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-sm text-blue-800">
                New verification requests will appear here as employers submit their KYC documents.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {requests.map((request) => (
              <Card key={request.id} className="bg-white rounded-2xl shadow-lg border border-blue-200 hover:shadow-xl transition-all duration-300">
                <div className="p-8">
                  {/* Header Section */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{request.employerName}</h3>
                        <p className="text-gray-600">{request.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {getStatusBadge(request.status)}
                      <Button
                        variant="outline"
                        onClick={() => setSelectedRequest(request)}
                        className="border-blue-300 text-blue-700 hover:bg-blue-50"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>

                  {/* Company Information */}
                  <div className="bg-gray-50 rounded-xl p-6 mb-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Building className="w-5 h-5 text-gray-600" />
                      <h4 className="font-semibold text-gray-900">Company Information</h4>
                    </div>
                    <p className="text-lg text-gray-700">{request.companyName}</p>
                  </div>

                  {/* Document Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                      <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                        <FileText className="w-5 h-5 mr-2" />
                        Aadhaar Number
                      </h4>
                      <p className="text-lg font-mono text-green-700">{request.aadhaarNumber}</p>
                      {request.documents?.aadhaarUrl && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-3 border-green-300 text-green-700 hover:bg-green-50"
                          onClick={() => window.open(request.documents.aadhaarUrl, '_blank')}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Document
                        </Button>
                      )}
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                      <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                        <FileText className="w-5 h-5 mr-2" />
                        PAN Number
                      </h4>
                      <p className="text-lg font-mono text-blue-700">{request.panNumber}</p>
                      {request.documents?.panUrl && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-3 border-blue-300 text-blue-700 hover:bg-blue-50"
                          onClick={() => window.open(request.documents.panUrl, '_blank')}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Document
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Submission Info and Actions */}
                  <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="w-5 h-5" />
                      <span className="font-medium">Submitted: {formatDate(request.submittedAt)}</span>
                    </div>
                    
                    {request.status === 'pending' && (
                      <div className="flex space-x-3">
                        <Button
                          onClick={() => handleApprove(request.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium"
                        >
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleReject(request.id)}
                          className="text-red-600 border-red-600 hover:bg-red-50 px-6 py-2 rounded-lg font-medium"
                        >
                          <XCircle className="w-5 h-5 mr-2" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Detailed View Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Verification Details</h3>
                <Button
                  variant="outline"
                  onClick={() => setSelectedRequest(null)}
                >
                  Close
                </Button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Employer Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{selectedRequest.employerName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{selectedRequest.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Company</p>
                      <p className="font-medium">{selectedRequest.companyName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      {getStatusBadge(selectedRequest.status)}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">KYC Documents</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Aadhaar Number</p>
                      <p className="font-mono text-sm">{selectedRequest.aadhaarNumber}</p>
                      {selectedRequest.documents.aadhaarUrl && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="mt-2"
                          onClick={() => window.open(selectedRequest.documents.aadhaarUrl, '_blank')}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download Aadhaar
                        </Button>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">PAN Number</p>
                      <p className="font-mono text-sm">{selectedRequest.panNumber}</p>
                      {selectedRequest.documents.panUrl && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="mt-2"
                          onClick={() => window.open(selectedRequest.documents.panUrl, '_blank')}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download PAN
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Submission Details</h4>
                  <p className="text-sm text-gray-600">
                    Submitted on: {formatDate(selectedRequest.submittedAt)}
                  </p>
                </div>
                
                {selectedRequest.status === 'pending' && (
                  <div className="flex space-x-3 pt-4 border-t">
                    <Button
                      onClick={() => {
                        handleApprove(selectedRequest.id);
                        setSelectedRequest(null);
                      }}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve Verification
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleReject(selectedRequest.id);
                        setSelectedRequest(null);
                      }}
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject Verification
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

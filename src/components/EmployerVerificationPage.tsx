import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Building2, User, Mail, FileText, Eye, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Input } from './ui/input';
import { useAuth } from '../contexts/AuthContext';
import { fetchEmployers, updateEmployerVerificationStatus, uploadEmployerDocument } from '../api/employers';

interface EmployerVerificationPageProps {
  onNavigate: (page: string) => void;
}

interface EmployerRequest {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  website?: string;
  companyType: 'private' | 'government' | 'ngo';
  verificationStatus: 'pending' | 'approved' | 'rejected';
  submittedDate: string;
  documents: string[];
  notes?: string;
}

export function EmployerVerificationPage({ onNavigate }: EmployerVerificationPageProps) {
  const { user, token } = useAuth();
  const [employers, setEmployers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployer, setSelectedEmployer] = useState<any | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewAction, setReviewAction] = useState<'approved' | 'rejected'>('approved');
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [approving, setApproving] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState<string | null>(null);

  useEffect(() => {
    loadEmployers();
  }, []);

  const loadEmployers = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await fetchEmployers({});
      setEmployers(response.employers || []);
    } catch (error) {
      console.error('Failed to load employers:', error);
      setEmployers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = (employer: any, action: 'approved' | 'rejected') => {
    setSelectedEmployer(employer);
    setReviewAction(action);
    setReviewNotes('');
    setIsReviewDialogOpen(true);
  };

  // Quick approve without dialog
  const handleQuickApprove = async (employer: any) => {
    if (!employer || !token) return;
    
    // Confirm before approving
    if (!window.confirm(`Are you sure you want to approve "${employer.companyName}"? They will be able to log in immediately.`)) {
      return;
    }

    setApproving(employer.id);
    try {
      await updateEmployerVerificationStatus(
        employer.id,
        'approved',
        'Approved by admin'
      );

      // Reload employers to get updated status
      await loadEmployers();
      
      alert(`✅ Success! Employer "${employer.companyName}" has been approved. They can now log in and access their dashboard.`);
    } catch (error: any) {
      console.error('Failed to update verification status:', error);
      const errorMessage = error?.message || 'Failed to update verification status. Please try again.';
      alert(`❌ Error: ${errorMessage}`);
    } finally {
      setApproving(null);
    }
  };

  // Quick reject without dialog
  const handleQuickReject = async (employer: any) => {
    if (!employer || !token) return;
    
    // Confirm before rejecting
    if (!window.confirm(`Are you sure you want to reject "${employer.companyName}"?`)) {
      return;
    }

    setRejecting(employer.id);
    try {
      await updateEmployerVerificationStatus(
        employer.id,
        'rejected',
        'Rejected by admin'
      );

      // Reload employers to get updated status
      await loadEmployers();
      
      alert(`Employer "${employer.companyName}" has been rejected.`);
    } catch (error: any) {
      console.error('Failed to update verification status:', error);
      const errorMessage = error?.message || 'Failed to update verification status. Please try again.';
      alert(`❌ Error: ${errorMessage}`);
    } finally {
      setRejecting(null);
    }
  };

  const submitReview = async () => {
    if (!selectedEmployer || !token) return;

    try {
      await updateEmployerVerificationStatus(
        selectedEmployer.id,
        reviewAction,
        reviewNotes
      );

      // Reload employers to get updated status
      await loadEmployers();

      setIsReviewDialogOpen(false);
      setSelectedEmployer(null);
      setReviewNotes('');
      
      // Show success message
      if (reviewAction === 'approved') {
        alert(`✅ Success! Employer "${selectedEmployer.companyName}" has been approved. They can now log in and access their dashboard.`);
      } else {
        alert(`Employer "${selectedEmployer.companyName}" has been rejected.`);
      }
    } catch (error: any) {
      console.error('Failed to update verification status:', error);
      const errorMessage = error?.message || 'Failed to update verification status. Please try again.';
      alert(`❌ Error: ${errorMessage}`);
      // Keep dialog open on error so user can see the error and retry if needed
      // The dialog will stay open because we're not calling setIsReviewDialogOpen(false)
    }
  };

  const handleDocumentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedEmployer || !token) return;

    try {
      setUploadingDocument(true);
      await uploadEmployerDocument(selectedEmployer.id, file);
      // Could show success message here
    } catch (error) {
      console.error('Failed to upload document:', error);
    } finally {
      setUploadingDocument(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getCompanyTypeBadge = (type: string) => {
    switch (type) {
      case 'private':
        return <Badge className="bg-blue-100 text-blue-800">Private</Badge>;
      case 'government':
        return <Badge className="bg-purple-100 text-purple-800">Government</Badge>;
      case 'ngo':
        return <Badge className="bg-green-100 text-green-800">NGO</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  const pendingEmployers = employers.filter(emp => emp.verificationStatus === 'pending');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading employers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl text-gray-900 mb-2">Employer Verification</h1>
            <p className="text-gray-600">Review and approve employer verification requests</p>
          </div>
          <Button variant="outline" onClick={() => onNavigate('dashboard')}>
            Back to Dashboard
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-yellow-600 mr-4" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{pendingEmployers.length}</p>
                <p className="text-gray-600">Pending Reviews</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600 mr-4" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {employers.filter(emp => emp.verificationStatus === 'approved').length}
                </p>
                <p className="text-gray-600">Approved</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center">
              <XCircle className="w-8 h-8 text-red-600 mr-4" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {employers.filter(emp => emp.verificationStatus === 'rejected').length}
                </p>
                <p className="text-gray-600">Rejected</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Employers Table */}
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Verification Requests</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employers.map((employer) => (
                  <TableRow key={employer.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{employer.companyName}</p>
                        <p className="text-sm text-gray-500">{employer.website}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{employer.userName}</p>
                        <p className="text-sm text-gray-500">{employer.userEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getCompanyTypeBadge(employer.companyType)}</TableCell>
                    <TableCell>{getStatusBadge(employer.verificationStatus)}</TableCell>
                    <TableCell>{new Date(employer.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => { setSelectedEmployer(employer); setIsViewDialogOpen(true); }}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        {employer.verificationStatus === 'pending' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuickApprove(employer)}
                              disabled={approving === employer.id}
                              className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                            >
                              {approving === employer.id ? (
                                <>
                                  <div className="w-4 h-4 mr-1 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                                  Approving...
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Approve
                                </>
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuickReject(employer)}
                              disabled={rejecting === employer.id}
                              className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
                            >
                              {rejecting === employer.id ? (
                                <>
                                  <div className="w-4 h-4 mr-1 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                  Rejecting...
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Reject
                                </>
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleReview(employer, 'approved')}
                              className="text-blue-600 hover:text-blue-700"
                              title="Approve with custom notes"
                            >
                              Review
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Review Dialog */}
        <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {reviewAction === 'approved' ? 'Approve' : 'Reject'} Verification Request
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="reviewNotes">Review Notes (Optional)</Label>
                <Textarea
                  id="reviewNotes"
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder={`Add any notes about this ${reviewAction} decision...`}
                  rows={3}
                />
              </div>
              <div className="flex gap-3">
                <Button onClick={submitReview} className="flex-1">
                  {reviewAction === 'approved' ? 'Approve' : 'Reject'} Request
                </Button>
                <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* View Employer Details Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[560px]">
            <DialogHeader>
              <DialogTitle>Employer Details</DialogTitle>
            </DialogHeader>
            {selectedEmployer && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">Company</Label>
                    <p className="text-sm text-gray-900">{selectedEmployer.companyName}</p>
                  </div>
                  <div>
                    <Label className="text-sm">Type</Label>
                    <div className="mt-1">{getCompanyTypeBadge(selectedEmployer.companyType)}</div>
                  </div>
                  <div>
                    <Label className="text-sm">Contact Name</Label>
                    <p className="text-sm text-gray-900">{selectedEmployer.userName}</p>
                  </div>
                  <div>
                    <Label className="text-sm">Email</Label>
                    <p className="text-sm text-gray-900">{selectedEmployer.userEmail}</p>
                  </div>
                  <div>
                    <Label className="text-sm">Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedEmployer.verificationStatus)}</div>
                  </div>
                  <div>
                    <Label className="text-sm">Submitted</Label>
                    <p className="text-sm text-gray-900">{new Date(selectedEmployer.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                {selectedEmployer.verificationNotes && (
                  <div>
                    <Label className="text-sm">Notes</Label>
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedEmployer.verificationNotes}</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

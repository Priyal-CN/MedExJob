import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Shield, IdCard, FileText, Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { submitEmployerKYC, uploadEmployerKycDocument } from '../api/employers';

export function EmployerKYCForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);
  const [panFile, setPanFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const employerId = user?.id || location.state?.employerId || '';
  const emailFromState = location.state?.email || '';
  const nameFromState = location.state?.name || user?.name || '';
  const companyNameFromState = location.state?.companyName || '';

  // Handle authentication and test mode checks in useEffect
  useEffect(() => {
    // Redirect to login if user is not authenticated and no employerId from state
    if (!user && !location.state?.employerId) {
      navigate('/login');
      return;
    }

    // If using test mode, show a warning
    if (employerId === 'test-admin-1') {
      setError('Test mode detected. Please login with real credentials to submit KYC.');
      return;
    }
  }, [user, location.state?.employerId, employerId, navigate]);

  // Redirect to login if user is not authenticated and no employerId from state
  if (!user && !location.state?.employerId) {
    return null;
  }

  // If using test mode, show error
  if (employerId === 'test-admin-1') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl p-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Test Mode Detected</h1>
            <p className="text-red-600 mb-4">Please login with real credentials to submit KYC.</p>
            <Button onClick={() => navigate('/login')}>
              Go to Login
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const validate = () => {
    if (!aadhaarNumber || aadhaarNumber.replace(/\D/g, '').length !== 12) {
      setError('Please enter a valid 12-digit Aadhaar number.');
      return false;
    }
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i;
    if (!panNumber || !panRegex.test(panNumber.trim())) {
      setError('Please enter a valid PAN number (e.g., ABCDE1234F).');
      return false;
    }
    if (!aadhaarFile || !panFile) {
      setError('Please upload both Aadhaar and PAN card documents.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    if (!validate()) return;
    setLoading(true);
    
    try {
      // Use the new endpoint that doesn't require authentication
      const response = await fetch('http://localhost:8082/api/employers/kyc-submission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailFromState || user?.email,
          name: nameFromState,
          companyName: companyNameFromState,
          aadhaarNumber: aadhaarNumber.replace(/\D/g, ''),
          panNumber: panNumber.toUpperCase().trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit KYC');
      }

      // Note: Document upload will be handled after admin approval
      // For now, we just store the KYC details for admin review

      // Redirect to success page
      navigate('/kyc-success', {
        state: {
          kycData: {
            employerEmail: data.employerEmail,
            employerId: data.employerId,
            message: data.message,
            status: data.status,
            submittedAt: data.submittedAt
          }
        }
      });
    } catch (err: any) {
      setError(err?.message || 'Failed to submit KYC. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8">
        <div className="text-center mb-8">
          <Shield className="mx-auto w-12 h-12 text-blue-600 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Employer KYC Verification</h1>
          <p className="text-gray-600">Enter Aadhaar and PAN details and upload documents. Admin will verify within 24 hours.</p>
          {location.state?.message && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">{location.state.message}</p>
            </div>
          )}
          {!user && location.state?.employerId && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">
                Registration successful! Please complete your verification below. After submission, you'll be able to login and access your dashboard.
              </p>
            </div>
          )}
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="mb-4">
            <CheckCircle className="w-4 h-4 mr-2 text-emerald-600" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="aadhaar">Aadhaar Number</Label>
              <Input
                id="aadhaar"
                inputMode="numeric"
                value={aadhaarNumber}
                onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, '').slice(0, 12))}
                placeholder="Enter 12 digits"
                maxLength={12}
                required
              />
              <p className="text-xs text-gray-500 mt-1">Enter exactly 12 digits. No spaces or symbols.</p>
            </div>
            <div>
              <Label htmlFor="pan">PAN Number</Label>
              <Input
                id="pan"
                value={panNumber}
                onChange={(e) => setPanNumber(e.target.value.toUpperCase().slice(0, 10))}
                placeholder="ABCDE1234F"
                maxLength={10}
                required
              />
              <p className="text-xs text-gray-500 mt-1">Format: 5 letters, 4 digits, 1 letter.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="aadhaarFile">Upload Aadhaar Card (PDF/JPG/PNG)</Label>
              <Input
                id="aadhaarFile"
                type="file"
                accept=".pdf,image/*"
                onChange={(e) => setAadhaarFile(e.target.files?.[0] || null)}
                required
              />
            </div>
            <div>
              <Label htmlFor="panFile">Upload PAN Card (PDF/JPG/PNG)</Label>
              <Input
                id="panFile"
                type="file"
                accept=".pdf,image/*"
                onChange={(e) => setPanFile(e.target.files?.[0] || null)}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => navigate('/login')}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit for Verification'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default EmployerKYCForm;

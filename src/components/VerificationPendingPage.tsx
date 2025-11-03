import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Shield, Clock, CheckCircle, RefreshCw, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getEmployerVerificationStatus } from '../api/employers';

export function VerificationPendingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user, refreshUser } = useAuth();
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verified' | 'rejected'>('pending');

  const message = location.state?.message || 'Your account is pending verification.';
  const currentUser = location.state?.user || user;

  useEffect(() => {
    // Check verification status periodically
    const checkStatus = async () => {
      if (!currentUser?.id) return;
      
      try {
        setCheckingStatus(true);
        const statusData = await getEmployerVerificationStatus(currentUser.id);
        
        // Map backend status to our local status
        if (statusData.status === 'approved') {
          setVerificationStatus('verified');
          // Refresh user data to update verification status
          await refreshUser();
          // Redirect to employer dashboard after a short delay
          setTimeout(() => {
            navigate('/dashboard/employer', { replace: true });
          }, 2000);
        } else if (statusData.status === 'rejected') {
          setVerificationStatus('rejected');
        } else {
          setVerificationStatus('pending');
        }
        
        setCheckingStatus(false);
      } catch (error) {
        console.error('Error checking verification status:', error);
        setCheckingStatus(false);
      }
    };

    // Check immediately
    checkStatus();

    // Check every 30 seconds
    const interval = setInterval(checkStatus, 30000);

    return () => clearInterval(interval);
  }, [currentUser?.id]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  if (verificationStatus === 'verified') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center shadow-xl">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">🎉 Verification Approved!</h1>
          <p className="text-lg text-gray-700 mb-2 font-semibold">Your account has been verified by the admin.</p>
          <p className="text-gray-600 mb-6">You can now log in and access your employer dashboard to start posting jobs!</p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-800">
              ✅ Admin has approved your verification request<br/>
              ✅ Your account is now active<br/>
              ✅ You can now login and post jobs
            </p>
          </div>
          <Button 
            onClick={() => navigate('/dashboard/employer')}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 text-lg"
          >
            Go to Employer Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  if (verificationStatus === 'rejected') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <Shield className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Rejected</h1>
          <p className="text-gray-600 mb-6">Your verification documents were not approved. Please contact support for more information.</p>
          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/aadhaar-verification')}
              className="w-full"
            >
              Resubmit Documents
            </Button>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="w-full"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-6">
          <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Pending</h1>
          <p className="text-gray-600">Your employer account is under review</p>
        </div>

        <Alert className="mb-6">
          <Clock className="w-4 h-4" />
          <AlertDescription>
            {message}
          </AlertDescription>
        </Alert>

        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-blue-600 mr-3" />
              <span className="text-sm font-medium text-gray-900">Aadhaar Verification</span>
            </div>
            <span className="text-sm text-blue-600">Pending</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-blue-600 mr-3" />
              <span className="text-sm font-medium text-gray-900">PAN Verification</span>
            </div>
            <span className="text-sm text-blue-600">Pending</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-blue-600 mr-3" />
              <span className="text-sm font-medium text-gray-900">Document Review</span>
            </div>
            <span className="text-sm text-blue-600">Pending</span>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500 mb-6">
          <p>We'll notify you once your verification is complete.</p>
          <p>This usually takes within 24 hours.</p>
        </div>

        <div className="space-y-3">
          <Button 
            onClick={handleRefresh}
            disabled={checkingStatus}
            className="w-full"
            variant="outline"
          >
            {checkingStatus ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Checking Status...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Check Status
              </>
            )}
          </Button>
          
          <Button 
            onClick={handleLogout}
            variant="ghost"
            className="w-full"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default VerificationPendingPage;


import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { CheckCircle, Clock, Shield, ArrowRight } from 'lucide-react';

export function KYCSubmissionSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const kycData = location.state?.kycData || {};
  const { employerEmail, employerId, message, status, submittedAt } = kycData;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            KYC Submitted Successfully!
          </h1>
          
          <p className="text-lg text-gray-600 mb-6">
            Your verification details have been sent to our admin team.
          </p>

          {employerEmail && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">Submission Details:</h3>
              <p className="text-blue-800"><strong>Email:</strong> {employerEmail}</p>
              <p className="text-blue-800"><strong>Status:</strong> {status || 'Pending'}</p>
              {submittedAt && (
                <p className="text-blue-800"><strong>Submitted:</strong> {new Date(submittedAt).toLocaleString()}</p>
              )}
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-yellow-600 mr-2" />
              <h3 className="text-lg font-semibold text-yellow-900">What Happens Next?</h3>
            </div>
            <div className="text-left space-y-3 text-yellow-800">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p>Our admin team will review your Aadhaar and PAN documents</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p>Verification will be completed within 24 hours</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p>Check back in 24 hours or try logging in to see your verification status</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p>After approval, you can login and access your employer dashboard</p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-center mb-2">
              <Shield className="w-5 h-5 text-red-600 mr-2" />
              <h3 className="font-semibold text-red-900">Important Notice</h3>
            </div>
            <p className="text-red-800 text-sm">
              If your documents are found to be fraudulent or invalid, your account will be permanently rejected. 
              Please ensure all submitted documents are authentic and belong to you.
            </p>
          </div>

          <div className="space-y-4">
            <Button 
              onClick={() => navigate('/login')}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Go to Login Page
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="w-full"
            >
              Back to Home
            </Button>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            Need help? Contact our support team for assistance.
          </p>
        </div>
      </Card>
    </div>
  );
}

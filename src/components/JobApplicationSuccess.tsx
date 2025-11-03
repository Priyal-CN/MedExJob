import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { CheckCircle2, Briefcase, ArrowLeft } from 'lucide-react';

interface JobApplicationSuccessProps {
  onNavigate: (page: string, entityId?: string) => void;
}

export function JobApplicationSuccess({ onNavigate }: JobApplicationSuccessProps) {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();

  const handleBackToJob = () => {
    if (jobId) {
      navigate(`/job-detail/${jobId}`);
    } else {
      navigate('/jobs');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="p-8 text-center space-y-6">
          <div className="flex items-center justify-center">
            <CheckCircle2 className="w-14 h-14 text-green-600" />
          </div>
          <h1 className="text-2xl text-gray-900">Application Submitted Successfully</h1>
          <p className="text-gray-600">
            Thank you for applying. We have sent your application to the employer. You can track your application status in your dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button className="bg-green-600 hover:bg-green-700" onClick={() => onNavigate('dashboard')}>
              <Briefcase className="w-4 h-4 mr-2" /> Go to Dashboard
            </Button>
            <Button variant="outline" onClick={handleBackToJob}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Job
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

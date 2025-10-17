import { MapPin, Briefcase, Calendar, Building2, GraduationCap, DollarSign, FileText, ExternalLink, Clock, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { mockJobs } from '../data/mockData';

interface JobDetailPageProps {
  jobId: string;
  onNavigate: (page: string) => void;
  isAuthenticated: boolean;
}

export function JobDetailPage({ jobId, onNavigate, isAuthenticated }: JobDetailPageProps) {
  const job = mockJobs.find(j => j.id === jobId);

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-gray-900 mb-2">Job Not Found</h2>
          <p className="text-gray-600 mb-4">The job you're looking for doesn't exist.</p>
          <Button onClick={() => onNavigate('jobs')}>Browse All Jobs</Button>
        </div>
      </div>
    );
  }

  const isGovernment = job.sector === 'government';
  const daysLeft = Math.ceil((new Date(job.lastDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  const handleApply = () => {
    if (!isAuthenticated) {
      onNavigate('login');
    } else {
      // In a real app, this would submit the application
      alert('Application submitted successfully!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Job Header */}
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Badge 
                    className={`${
                      isGovernment 
                        ? 'bg-blue-100 text-blue-700 border-blue-200' 
                        : 'bg-green-100 text-green-700 border-green-200'
                    }`}
                    variant="outline"
                  >
                    {isGovernment ? 'Government' : 'Private'}
                  </Badge>
                  <Badge variant="outline">{job.category}</Badge>
                  {job.featured && (
                    <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200" variant="outline">
                      Featured
                    </Badge>
                  )}
                </div>

                <div>
                  <h1 className="text-3xl text-gray-900 mb-2">{job.title}</h1>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Building2 className="w-5 h-5" />
                    <span className="text-lg">{job.organization}</span>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{job.views} views</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    <span>{job.applications} applications</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>Posted {new Date(job.postedDate).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Job Details */}
            <Card className="p-6">
              <h2 className="text-xl text-gray-900 mb-4">Job Details</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="text-gray-900">{job.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Briefcase className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Number of Posts</p>
                    <p className="text-gray-900">{job.numberOfPosts}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <GraduationCap className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Qualification</p>
                    <p className="text-gray-900">{job.qualification}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Briefcase className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Experience</p>
                    <p className="text-gray-900">{job.experience}</p>
                  </div>
                </div>

                {job.salary && (
                  <div className="flex items-start gap-3">
                    <DollarSign className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Salary</p>
                      <p className="text-gray-900">{job.salary}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Last Date to Apply</p>
                    <p className="text-gray-900">{new Date(job.lastDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Job Description */}
            <Card className="p-6">
              <h2 className="text-xl text-gray-900 mb-4">Job Description</h2>
              <p className="text-gray-700 leading-relaxed">{job.description}</p>
            </Card>

            {/* Government Job Additional Info */}
            {isGovernment && job.pdfUrl && (
              <Card className="p-6">
                <h2 className="text-xl text-gray-900 mb-4">Official Documents</h2>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href={job.pdfUrl} target="_blank" rel="noopener noreferrer">
                      <FileText className="w-4 h-4 mr-2" />
                      View Official Notification PDF
                      <ExternalLink className="w-4 h-4 ml-auto" />
                    </a>
                  </Button>
                  {job.applyLink && (
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <a href={job.applyLink} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Official Apply Link
                        <ExternalLink className="w-4 h-4 ml-auto" />
                      </a>
                    </Button>
                  )}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1 space-y-6">
            {/* Apply Card */}
            <Card className="p-6 sticky top-20">
              <div className="space-y-4">
                {daysLeft > 0 && (
                  <Alert className={daysLeft <= 7 ? 'border-red-200 bg-red-50' : 'border-blue-200 bg-blue-50'}>
                    <Calendar className="w-4 h-4" />
                    <AlertDescription>
                      {daysLeft <= 7 ? (
                        <span className="text-red-700">Only {daysLeft} days left to apply!</span>
                      ) : (
                        <span className="text-blue-700">{daysLeft} days remaining</span>
                      )}
                    </AlertDescription>
                  </Alert>
                )}

                <Separator />

                {isGovernment ? (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                      This is a government job. Please visit the official website to apply.
                    </p>
                    {job.applyLink && (
                      <Button className="w-full bg-blue-600 hover:bg-blue-700" asChild>
                        <a href={job.applyLink} target="_blank" rel="noopener noreferrer">
                          Apply on Official Website
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </a>
                      </Button>
                    )}
                    {job.pdfUrl && (
                      <Button variant="outline" className="w-full" asChild>
                        <a href={job.pdfUrl} target="_blank" rel="noopener noreferrer">
                          <FileText className="w-4 h-4 mr-2" />
                          View Notification
                        </a>
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                      Apply directly through our platform. Your profile and resume will be shared with the employer.
                    </p>
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={handleApply}
                    >
                      Apply Now
                    </Button>
                    {!isAuthenticated && (
                      <p className="text-xs text-center text-gray-500">
                        You need to login to apply for this job
                      </p>
                    )}
                  </div>
                )}

                <Separator />

                <Button variant="outline" className="w-full">
                  Save Job
                </Button>
              </div>
            </Card>

            {/* Company Info */}
            <Card className="p-6">
              <h3 className="text-lg text-gray-900 mb-4">About Organization</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-700">{job.organization}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-700">{job.location}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

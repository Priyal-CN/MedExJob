import { Briefcase, BookmarkIcon, Bell, User, FileText, TrendingUp, ArrowLeft, Trash2, Heart } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { mockJobs, mockCandidate, mockNotifications } from '../data/mockData';
import { Progress } from './ui/progress';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

interface CandidateDashboardProps {
  onNavigate: (page: string, jobId?: string) => void;
}

export function CandidateDashboard({ onNavigate }: CandidateDashboardProps) {
  const { user } = useAuth();
  const [savedJobs, setSavedJobs] = useState(mockJobs.filter(job => mockCandidate.savedJobs.includes(job.id)));
  const [appliedJobs, setAppliedJobs] = useState([
    { ...mockJobs[0], status: 'under_review', appliedDate: '2025-10-12' },
    { ...mockJobs[2], status: 'shortlisted', appliedDate: '2025-10-10' },
    { ...mockJobs[5], status: 'interview', appliedDate: '2025-10-08', interviewDate: '2025-10-20' },
  ]);

  const notifications = mockNotifications.filter(n => n.userId === mockCandidate.id);
  const profileCompleteness = 75;

  const handleRemoveSavedJob = (jobId: string) => {
    setSavedJobs(prev => prev.filter(job => job.id !== jobId));
  };

  const handleSaveForLater = (job: any) => {
    setSavedJobs(prev => [...prev, job]);
  };

  const handleTrackStatus = (jobId: string) => {
    // In a real app, this would open a modal or navigate to a tracking page
    alert(`Tracking status for job ${jobId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
          </div>
          <h1 className="text-3xl text-gray-900 mb-2">Welcome, {user?.name || mockCandidate.name}</h1>
          <p className="text-gray-600">Manage your job applications and profile</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Applied Jobs</p>
                <p className="text-3xl text-gray-900">{appliedJobs.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Saved Jobs</p>
                <p className="text-3xl text-gray-900">{savedJobs.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <BookmarkIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Interviews</p>
                <p className="text-3xl text-gray-900">1</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Profile Views</p>
                <p className="text-3xl text-gray-900">24</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            <Tabs defaultValue="applied" className="w-full">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="applied">Applied Jobs</TabsTrigger>
                <TabsTrigger value="saved">Saved Jobs</TabsTrigger>
                <TabsTrigger value="recommended">Recommended</TabsTrigger>
              </TabsList>

              <TabsContent value="applied" className="space-y-4 mt-6">
                {appliedJobs.map((job) => (
                  <Card key={job.id} className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge 
                              className={job.sector === 'government' 
                                ? 'bg-blue-100 text-blue-700 border-blue-200' 
                                : 'bg-green-100 text-green-700 border-green-200'}
                              variant="outline"
                            >
                              {job.sector === 'government' ? 'Government' : 'Private'}
                            </Badge>
                            <Badge 
                              className={
                                job.status === 'shortlisted' ? 'bg-green-100 text-green-700 border-green-200' :
                                job.status === 'interview' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                                'bg-gray-100 text-gray-700 border-gray-200'
                              }
                              variant="outline"
                            >
                              {job.status === 'under_review' ? 'Under Review' :
                               job.status === 'shortlisted' ? 'Shortlisted' :
                               job.status === 'interview' ? 'Interview Scheduled' : job.status}
                            </Badge>
                          </div>
                          <h3 
                            className="text-lg text-gray-900 mb-1 cursor-pointer hover:text-blue-600"
                            onClick={() => onNavigate('job-detail', job.id)}
                          >
                            {job.title}
                          </h3>
                          <p className="text-sm text-gray-600">{job.organization}</p>
                        </div>
                      </div>

                      <div className="text-sm text-gray-600">
                        <p>Applied on: {new Date(job.appliedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        {job.interviewDate && (
                          <p className="text-purple-600 mt-1">
                            Interview scheduled: {new Date(job.interviewDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => onNavigate('job-detail', job.id)}>
                          View Job
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleTrackStatus(job.id)}>
                          Track Status
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="saved" className="space-y-4 mt-6">
                {savedJobs.map((job) => (
                  <Card key={job.id} className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <Badge 
                            className={job.sector === 'government' 
                              ? 'bg-blue-100 text-blue-700 border-blue-200' 
                              : 'bg-green-100 text-green-700 border-green-200'}
                            variant="outline"
                          >
                            {job.sector === 'government' ? 'Government' : 'Private'}
                          </Badge>
                          <h3 
                            className="text-lg text-gray-900 mt-2 mb-1 cursor-pointer hover:text-blue-600"
                            onClick={() => onNavigate('job-detail', job.id)}
                          >
                            {job.title}
                          </h3>
                          <p className="text-sm text-gray-600">{job.organization} • {job.location}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => onNavigate('job-detail', job.id)}>
                          Apply Now
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleRemoveSavedJob(job.id)}>
                          <Trash2 className="w-4 h-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="recommended" className="space-y-4 mt-6">
                <p className="text-gray-600">Based on your profile and preferences, here are jobs we recommend:</p>
                {mockJobs.slice(0, 3).map((job) => (
                  <Card key={job.id} className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <Badge 
                            className={job.sector === 'government' 
                              ? 'bg-blue-100 text-blue-700 border-blue-200' 
                              : 'bg-green-100 text-green-700 border-green-200'}
                            variant="outline"
                          >
                            {job.sector === 'government' ? 'Government' : 'Private'}
                          </Badge>
                          <h3 
                            className="text-lg text-gray-900 mt-2 mb-1 cursor-pointer hover:text-blue-600"
                            onClick={() => onNavigate('job-detail', job.id)}
                          >
                            {job.title}
                          </h3>
                          <p className="text-sm text-gray-600">{job.organization} • {job.location}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => onNavigate('job-detail', job.id)}>
                          View Details
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleSaveForLater(job)}>
                          <Heart className="w-4 h-4 mr-1" />
                          Save for Later
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Completeness */}
            <Card className="p-6">
              <h3 className="text-lg text-gray-900 mb-4">Profile Completeness</h3>
              <div className="space-y-3">
                <Progress value={profileCompleteness} className="h-2" />
                <p className="text-sm text-gray-600">{profileCompleteness}% complete</p>
                <Button variant="outline" className="w-full" onClick={() => onNavigate('profile')}>
                  <User className="w-4 h-4 mr-2" />
                  Complete Profile
                </Button>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Update Resume
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => onNavigate('job-alerts')}
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Manage Alerts
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => onNavigate('jobs')}>
                  <Briefcase className="w-4 h-4 mr-2" />
                  Browse All Jobs
                </Button>
              </div>
            </Card>

            {/* Notifications */}
            <Card className="p-6">
              <h3 className="text-lg text-gray-900 mb-4">Recent Notifications</h3>
              <div className="space-y-3">
                {notifications.slice(0, 3).map((notification) => (
                  <div key={notification.id} className="pb-3 border-b last:border-b-0">
                    <p className="text-sm text-gray-900 mb-1">{notification.message}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(notification.createdAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                ))}
              </div>
              <Button 
                variant="link" 
                className="w-full mt-2 text-blue-600"
                onClick={() => onNavigate('notifications')}
              >
                View All Notifications
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Briefcase, BookmarkIcon, Bell, User, FileText, TrendingUp, ArrowLeft, Trash2, Heart } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge'; // This is the correct import
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useMemo, useState } from 'react';
import { fetchJobs } from '../api/jobs';
import { fetchApplications, fetchMyApplications } from '../api/applications';
import { onSavedJobsChanged, notifySavedJobsChanged } from '../utils/savedJobsEvents';

interface CandidateDashboardProps {
  onNavigate: (page: string, jobId?: string) => void;
}

export function CandidateDashboard({ onNavigate }: CandidateDashboardProps) {
  const { user, token } = useAuth(); // Destructure token from useAuth
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<any[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<any[]>([]);
  const [latestJobs, setLatestJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const profileCompleteness = 75;
  const [recentNotifications, setRecentNotifications] = useState<Array<{id:string; message:string; createdAt:string;}>>([]);
  const [interviewCount, setInterviewCount] = useState(0);

  // Load saved jobs from localStorage
  const loadSavedJobs = () => {
    const raw = localStorage.getItem('saved_jobs');
    try {
      const jobs = raw ? JSON.parse(raw) : [];
      console.log('Loaded saved jobs:', jobs);
      setSavedJobs(jobs);
    } catch (error) {
      console.error('Error loading saved jobs:', error);
      setSavedJobs([]);
    }
  };

  useEffect(() => {
    loadSavedJobs();
  }, []);

  // Listen for storage changes (when saved jobs are updated from other tabs/pages)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'saved_jobs') {
        console.log('Saved jobs changed in localStorage');
        loadSavedJobs();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Also reload saved jobs when component becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('Page became visible, reloading saved jobs');
        loadSavedJobs();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Listen for custom saved jobs change events (from other components in same tab)
  useEffect(() => {
    const cleanup = onSavedJobsChanged(() => {
      loadSavedJobs();
    });
    return cleanup;
  }, []);

  // Loader function used by effects
  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Applied applications
      let appsRes: any;
      let appsContent: any[] = [];
      try {
        console.log('Fetching my applications...');
        appsRes = await fetchMyApplications({ page: 0, size: 50, sort: 'appliedDate,desc' } as any);
        console.log('My applications response:', appsRes);
        appsContent = Array.isArray(appsRes?.content)
          ? appsRes.content
          : Array.isArray(appsRes)
          ? appsRes
          : [];
      } catch (error) {
        console.error('Error fetching my applications:', error);
        // Fallback: query by candidateEmail if backend doesn't support /my
        if (user?.email) {
          console.log('Trying fallback with candidateEmail:', user.email);
          try {
            // Don't pass token - apiClient handles it automatically via Authorization header
            appsRes = await fetchApplications({ page: 0, size: 50, sort: 'appliedDate,desc', candidateEmail: user.email });
            console.log('Fallback applications response:', appsRes);
            appsContent = Array.isArray(appsRes?.content)
              ? appsRes.content
              : Array.isArray(appsRes)
              ? appsRes
              : [];
          } catch (fallbackError) {
            console.error('Fallback also failed:', fallbackError);
          }
        }
      }
      
      const mappedApplied = appsContent.map((a: any) => ({
        id: a.jobId || a.id,
        title: a.jobTitle,
        organization: a.jobOrganization,
        sector: 'private',
        category: '',
        location: '',
        status: a.status,
        appliedDate: a.appliedDate,
        interviewDate: a.interviewDate,
      }));
      console.log('Mapped applied jobs:', mappedApplied);
      setAppliedJobs(mappedApplied);

      // Calculate interview count from applied jobs
      const interviews = appsContent.filter((app: any) => app.status === 'interview' || app.interviewDate);
      setInterviewCount(interviews.length);

      // Latest jobs (all jobs, sorted by creation date)
      console.log('Fetching latest jobs...');
      let latestJobsRes = await fetchJobs({ size: 10, sort: 'createdAt,desc' });
      console.log('Latest jobs response:', latestJobsRes);
      let latest = Array.isArray(latestJobsRes?.content)
        ? latestJobsRes.content
        : Array.isArray(latestJobsRes)
        ? latestJobsRes
        : [];
      setLatestJobs(latest);

      // Recommended jobs (latest active) with fallback if empty
      console.log('Fetching recommended jobs...');
      let jobsRes = await fetchJobs({ status: 'active', size: 10, sort: 'createdAt,desc' });
      console.log('Jobs response:', jobsRes);
      let rec = Array.isArray(jobsRes?.content)
        ? jobsRes.content
        : Array.isArray(jobsRes)
        ? jobsRes
        : [];
      if (rec.length === 0) {
        console.log('No jobs with status filter, trying without status...');
        const { status, ...fallback } = { status: 'active', size: 10, sort: 'createdAt,desc' } as any;
        jobsRes = await fetchJobs(fallback);
        console.log('Fallback jobs response:', jobsRes);
        rec = Array.isArray(jobsRes?.content)
          ? jobsRes.content
          : Array.isArray(jobsRes)
          ? jobsRes
          : [];
      }
      console.log('Recommended jobs:', rec);
      setRecommendedJobs(rec);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data. Please try refreshing.');
      setAppliedJobs([]);
      setRecommendedJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadData();
  }, [user?.email]);

  // Auto-refresh periodically and on tab focus
  useEffect(() => {
    const interval = setInterval(() => {
      loadData();
    }, 30000);
    const onVisibility = () => {
      if (!document.hidden) loadData();
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [user?.email]);

  // Build recent notifications from recommended jobs (dynamic, no mocks)
  useEffect(() => {
    const notes = (recommendedJobs || []).slice(0, 5).map((j: any) => ({
      id: `job-${j.id}`,
      message: `New job posted: ${j.title} at ${j.organization || 'an employer'}`,
      createdAt: j.postedDate || new Date().toISOString(),
    }));
    setRecentNotifications(notes);
  }, [recommendedJobs]);

  const handleRemoveSavedJob = (jobId: string) => {
    const savedJobs = JSON.parse(localStorage.getItem('saved_jobs') || '[]');
    const next = savedJobs.filter((job: any) => job.id !== jobId);
    localStorage.setItem('saved_jobs', JSON.stringify(next));
    setSavedJobs(next);
    console.log('Removed job from saved:', jobId);
    notifySavedJobsChanged(); // Notify other components
  };

  const handleSaveForLater = (job: any) => {
    setSavedJobs(prev => {
      const exists = prev.some(j => j.id === job.id);
      const next = exists ? prev : [...prev, job];
      localStorage.setItem('saved_jobs', JSON.stringify(next));
      notifySavedJobsChanged(); // Notify other components
      return next;
    });
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                loadData();
                loadSavedJobs();
              }}
            >
              Refresh
            </Button>
          </div>
          <h1 className="text-3xl text-gray-900 mb-2">Welcome, {user?.name || 'Candidate'}</h1>
          <p className="text-gray-600">Manage your job applications and profile</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">{error}</p>
          </div>
        )}
        
        {/* Loading State */}
        {loading && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800">Loading your dashboard data...</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
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
                <p className="text-3xl text-gray-900">{interviewCount}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Latest Jobs Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">Latest Jobs</h2>
            <Button variant="outline" onClick={() => onNavigate('jobs')}>
              View All Jobs
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {latestJobs.slice(0, 6).map((job) => (
              <Card key={`latest-${job.id}`} className="p-4 hover:shadow-md transition-shadow">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 
                        className="text-lg font-medium text-gray-900 cursor-pointer hover:text-blue-600"
                        onClick={() => onNavigate('job-detail', job.id)}
                      >
                        {job.title}
                      </h3>
                      <p className="text-sm text-gray-600">{job.organization}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {job.sector === 'government' ? 'Government' : 'Private'}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {job.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">{job.location}</p>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => onNavigate('job-detail', job.id)}
                      >
                        View Details
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleSaveForLater(job)}
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          {latestJobs.length === 0 && !loading && (
            <Card className="p-8 text-center">
              <p className="text-gray-600">No jobs available at the moment.</p>
            </Card>
          )}
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
                {loading && (
                  <Card className="p-8 text-center">
                    <p className="text-gray-600">Loading your applications...</p>
                  </Card>
                )}
                {!loading && appliedJobs.length === 0 && (
                  <Card className="p-8 text-center">
                    <p className="text-gray-600 mb-3">You haven't applied to any jobs yet.</p>
                    <p className="text-sm text-gray-500 mb-3">Start applying to jobs to see them here.</p>
                    <Button onClick={() => onNavigate('jobs')}>Browse Jobs</Button>
                  </Card>
                )}
                {appliedJobs.map((job) => (
                  <Card key={`applied-${job.id}`} className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={'bg-green-100 text-green-700 border-green-200'} variant="outline">Applied</Badge>
                            <Badge 
                              className={
                                job.status === 'shortlisted' ? 'bg-green-100 text-green-700 border-green-200' :
                                job.status === 'interview' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                                job.status === 'selected' ? 'bg-green-100 text-green-700 border-green-200' :
                                job.status === 'rejected' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-gray-100 text-gray-700 border-gray-200'
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
                {savedJobs.length === 0 && (
                  <Card className="p-8 text-center">
                    <p className="text-gray-600 mb-3">No saved jobs yet.</p>
                    <p className="text-sm text-gray-500 mb-3">Click the star icon on any job to save it for later.</p>
                    <Button onClick={() => onNavigate('jobs')}>Browse Jobs</Button>
                  </Card>
                )}
                {savedJobs.map((job) => (
                  <Card key={`saved-${job.id}`} className="p-6">
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
                            {job.title || job.jobTitle || 'Untitled Job'}
                          </h3>
                          <p className="text-sm text-gray-600">{(job.organization || job.jobOrganization || job.employer?.companyName || 'An employer')} • {job.location || job.city || ''}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => onNavigate('job-apply', job.id)}>
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
                {loading && (
                  <Card className="p-8 text-center">
                    <p className="text-gray-600">Loading recommended jobs...</p>
                  </Card>
                )}
                {!loading && recommendedJobs.length > 0 && (
                  <p className="text-gray-600 mb-4">Latest jobs you might be interested in:</p>
                )}
                {!loading && recommendedJobs.length === 0 && (
                  <Card className="p-8 text-center">
                    <p className="text-gray-600 mb-3">No recommended jobs right now.</p>
                    <p className="text-sm text-gray-500 mb-3">Check back later for new opportunities.</p>
                    <Button onClick={() => onNavigate('jobs')}>Browse All Jobs</Button>
                  </Card>
                )}
                {recommendedJobs.map((job) => (
                  <Card key={`rec-${job.id}`} className="p-6">
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
            {/*
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
            */}


            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => onNavigate('profile')}
                >
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
              </div>
            </Card>

            {/* Notifications */}
            <Card className="p-6">
              <h3 className="text-lg text-gray-900 mb-4">Recent Notifications</h3>
              <div className="space-y-3">
                {recentNotifications.slice(0, 3).map((notification) => (
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

import { Plus, Briefcase, Users, Eye, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { mockJobs, mockApplications, mockEmployer } from '../data/mockData';

interface EmployerDashboardProps {
  onNavigate: (page: string) => void;
}

export function EmployerDashboard({ onNavigate }: EmployerDashboardProps) {
  const myJobs = mockJobs.filter(job => job.employerId === mockEmployer.id);
  const myApplications = mockApplications.filter(app => 
    myJobs.some(job => job.id === app.jobId)
  );

  const totalViews = myJobs.reduce((sum, job) => sum + job.views, 0);
  const totalApplications = myJobs.reduce((sum, job) => sum + job.applications, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl text-gray-900 mb-2">{mockEmployer.companyName}</h1>
            <p className="text-gray-600">Manage your job postings and applications</p>
          </div>
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => onNavigate('post-job')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Post New Job
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Active Jobs</p>
                <p className="text-3xl text-gray-900">{myJobs.filter(j => j.status === 'active').length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Applications</p>
                <p className="text-3xl text-gray-900">{totalApplications}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Views</p>
                <p className="text-3xl text-gray-900">{totalViews}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Subscription</p>
                <p className="text-sm text-green-600">Active</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="jobs" className="w-full">
          <TabsList>
            <TabsTrigger value="jobs">My Jobs</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="mt-6">
            <Card>
              <div className="p-6">
                <h3 className="text-lg text-gray-900 mb-4">Your Job Postings</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Applications</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Posted Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myJobs.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell>
                          <div>
                            <p className="text-gray-900">{job.title}</p>
                            <p className="text-sm text-gray-500">{job.location}</p>
                          </div>
                        </TableCell>
                        <TableCell>{job.category}</TableCell>
                        <TableCell>{job.applications}</TableCell>
                        <TableCell>{job.views}</TableCell>
                        <TableCell>{new Date(job.postedDate).toLocaleDateString('en-IN')}</TableCell>
                        <TableCell>
                          <Badge className={
                            job.status === 'active' ? 'bg-green-100 text-green-700 border-green-200' :
                            job.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                            'bg-gray-100 text-gray-700 border-gray-200'
                          } variant="outline">
                            {job.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="outline" size="sm">Close</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="applications" className="mt-6">
            <Card>
              <div className="p-6">
                <h3 className="text-lg text-gray-900 mb-4">Recent Applications</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Candidate</TableHead>
                      <TableHead>Job Applied</TableHead>
                      <TableHead>Applied Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myApplications.map((application) => {
                      const job = myJobs.find(j => j.id === application.jobId);
                      return (
                        <TableRow key={application.id}>
                          <TableCell>
                            <div>
                              <p className="text-gray-900">{application.candidateName}</p>
                              <p className="text-sm text-gray-500">{application.candidateEmail}</p>
                            </div>
                          </TableCell>
                          <TableCell>{job?.title}</TableCell>
                          <TableCell>{new Date(application.appliedDate).toLocaleDateString('en-IN')}</TableCell>
                          <TableCell>
                            <Badge className={
                              application.status === 'shortlisted' ? 'bg-green-100 text-green-700 border-green-200' :
                              application.status === 'interview' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                              application.status === 'rejected' ? 'bg-red-100 text-red-700 border-red-200' :
                              'bg-gray-100 text-gray-700 border-gray-200'
                            } variant="outline">
                              {application.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                View Resume
                              </Button>
                              <Button variant="outline" size="sm">
                                <Calendar className="w-4 h-4 mr-1" />
                                Schedule
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg text-gray-900 mb-4">Job Performance</h3>
                <div className="space-y-4">
                  {myJobs.map((job) => (
                    <div key={job.id} className="pb-4 border-b last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-900">{job.title}</p>
                        <Badge variant="outline">{job.applications} applications</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{job.views} views</span>
                        <span>•</span>
                        <span>{Math.round((job.applications / job.views) * 100)}% conversion</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg text-gray-900 mb-4">Subscription Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Plan</span>
                    <span className="text-gray-900">Annual Plan</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Jobs Posted</span>
                    <span className="text-gray-900">{myJobs.length} / 150</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Valid Until</span>
                    <span className="text-gray-900">{mockEmployer.subscriptionEndDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <Badge className="bg-green-100 text-green-700 border-green-200" variant="outline">
                      Active
                    </Badge>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => onNavigate('subscription')}
                  >
                    Manage Subscription
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="verification" className="mt-6">
            <Card className="p-6">
              <div className="text-center py-8">
                <h3 className="text-lg text-gray-900 mb-4">Employer Verification</h3>
                <p className="text-gray-600 mb-6">
                  Complete your verification to access all features and build trust with candidates.
                </p>
                <Button onClick={() => onNavigate('verification')}>
                  Go to Verification
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

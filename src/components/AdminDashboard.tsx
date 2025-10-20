import { Plus, Briefcase, Users, Building2, CheckCircle, XCircle, AlertTriangle, ArrowLeft } from 'lucide-react';
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
import { mockJobs, mockApplications } from '../data/mockData';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const totalJobs = mockJobs.length;
  const governmentJobs = mockJobs.filter(j => j.sector === 'government').length;
  const privateJobs = mockJobs.filter(j => j.sector === 'private').length;
  const pendingApprovals = mockJobs.filter(j => j.status === 'pending').length;
  const totalApplications = mockApplications.length;

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl text-gray-900 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Complete control over MedExJob.com</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Post Government Job
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Jobs</p>
                <p className="text-3xl text-gray-900">{totalJobs}</p>
                <p className="text-xs text-gray-500 mt-1">Govt: {governmentJobs} | Pvt: {privateJobs}</p>
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
                <p className="text-sm text-gray-500 mb-1">Employers</p>
                <p className="text-3xl text-gray-900">234</p>
                <p className="text-xs text-gray-500 mt-1">12 pending verification</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Building2 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Pending Approvals</p>
                <p className="text-3xl text-gray-900">{pendingApprovals}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="jobs" className="w-full">
          <TabsList>
            <TabsTrigger value="jobs">All Jobs</TabsTrigger>
            <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
            <TabsTrigger value="employers">Employers</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="mt-6">
            <Card>
              <div className="p-6">
                <h3 className="text-lg text-gray-900 mb-4">All Job Postings</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job Title</TableHead>
                      <TableHead>Organization</TableHead>
                      <TableHead>Sector</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Applications</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockJobs.slice(0, 10).map((job) => (
                      <TableRow key={job.id}>
                        <TableCell>
                          <div>
                            <p className="text-gray-900">{job.title}</p>
                            <p className="text-sm text-gray-500">{job.location}</p>
                          </div>
                        </TableCell>
                        <TableCell>{job.organization}</TableCell>
                        <TableCell>
                          <Badge className={
                            job.sector === 'government'
                              ? 'bg-blue-100 text-blue-700 border-blue-200'
                              : 'bg-green-100 text-green-700 border-green-200'
                          } variant="outline">
                            {job.sector}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{job.category}</TableCell>
                        <TableCell>{job.applications}</TableCell>
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
                            <Button variant="outline" size="sm">Delete</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="pending" className="mt-6">
            <Card>
              <div className="p-6">
                <h3 className="text-lg text-gray-900 mb-4">Pending Job Approvals</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job Title</TableHead>
                      <TableHead>Organization</TableHead>
                      <TableHead>Employer</TableHead>
                      <TableHead>Posted Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <div>
                          <p className="text-gray-900">Consultant Neurologist</p>
                          <p className="text-sm text-gray-500">Mumbai, Maharashtra</p>
                        </div>
                      </TableCell>
                      <TableCell>Medanta Hospital</TableCell>
                      <TableCell>medanta@example.com</TableCell>
                      <TableCell>2025-10-14</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button size="sm" variant="destructive">
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="employers" className="mt-6">
            <Card>
              <div className="p-6">
                <h3 className="text-lg text-gray-900 mb-4">Registered Employers</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Jobs Posted</TableHead>
                      <TableHead>Subscription</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Apollo Hospitals</TableCell>
                      <TableCell>Hospital</TableCell>
                      <TableCell>contact@apollo.com</TableCell>
                      <TableCell>5</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-700 border-green-200" variant="outline">
                          Annual Plan
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-700 border-green-200" variant="outline">
                          Verified
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Fortis Healthcare</TableCell>
                      <TableCell>Hospital</TableCell>
                      <TableCell>hr@fortis.com</TableCell>
                      <TableCell>3</TableCell>
                      <TableCell>
                        <Badge className="bg-blue-100 text-blue-700 border-blue-200" variant="outline">
                          Monthly Plan
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-700 border-green-200" variant="outline">
                          Verified
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg text-gray-900 mb-4">User Statistics</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b">
                    <span className="text-sm text-gray-600">Total Candidates</span>
                    <span className="text-gray-900">12,345</span>
                  </div>
                  <div className="flex items-center justify-between pb-3 border-b">
                    <span className="text-sm text-gray-600">Active Users (Last 30 days)</span>
                    <span className="text-gray-900">4,567</span>
                  </div>
                  <div className="flex items-center justify-between pb-3 border-b">
                    <span className="text-sm text-gray-600">New Registrations (This Month)</span>
                    <span className="text-gray-900">456</span>
                  </div>
                  <div className="flex items-center justify-between pb-3 border-b">
                    <span className="text-sm text-gray-600">Total Applications Submitted</span>
                    <span className="text-gray-900">23,456</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg text-gray-900 mb-4">System Health</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b">
                    <span className="text-sm text-gray-600">Database Status</span>
                    <Badge className="bg-green-100 text-green-700 border-green-200" variant="outline">
                      Healthy
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between pb-3 border-b">
                    <span className="text-sm text-gray-600">Active Sessions</span>
                    <span className="text-gray-900">234</span>
                  </div>
                  <div className="flex items-center justify-between pb-3 border-b">
                    <span className="text-sm text-gray-600">Reported Issues</span>
                    <span className="text-gray-900">3</span>
                  </div>
                  <div className="flex items-center justify-between pb-3 border-b">
                    <span className="text-sm text-gray-600">Server Uptime</span>
                    <span className="text-gray-900">99.9%</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

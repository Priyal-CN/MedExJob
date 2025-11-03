import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { FileText, Upload, Download, Trash2 } from 'lucide-react';
import { fetchMyApplications } from '../api/applications';

interface ProfilePageProps {
  onNavigate: (page: string) => void;
}

export function ProfilePage({ onNavigate }: ProfilePageProps) {
  const { user } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [currentResume, setCurrentResume] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const initials = (user?.name || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    const loadApplications = async () => {
      try {
        const data = await fetchMyApplications();
        setApplications(data?.content || []);
        
        // Find the most recent resume from applications
        const recentApp = data?.content?.find((app: any) => app.resumeUrl);
        if (recentApp?.resumeUrl) {
          // Resolve the resume URL to a full URL
          const fullUrl = resolveFileUrl(recentApp.resumeUrl);
          setCurrentResume(fullUrl);
        }
      } catch (error) {
        console.error('Error loading applications:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'CANDIDATE') {
      loadApplications();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Here you would typically upload the resume to the server
      // For now, we'll just show a success message
      alert('Resume uploaded successfully! It will be used for future job applications.');
      
      // Update the current resume display
      const url = URL.createObjectURL(file);
      setCurrentResume(url);
    }
  };

  const downloadResume = () => {
    if (currentResume) {
      const link = document.createElement('a');
      link.href = currentResume;
      link.download = 'resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const deleteResume = () => {
    if (window.confirm('Are you sure you want to delete your current resume?')) {
      setCurrentResume(null);
      alert('Resume deleted successfully!');
    }
  };

  const resolveFileUrl = (url?: string): string => {
    if (!url) return '';

    // 1. If it's already a full absolute URL or blob URL, return it as is
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:')) {
      return url;
    }

    // 2. Get the API base URL from the environment
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082';

    // 3. Handle /uploads/ paths - convert to absolute backend URL
    // Backend serves files via /uploads/** through WebConfig
    if (url.startsWith('/uploads/')) {
      const base = apiBase.endsWith('/') ? apiBase.slice(0, -1) : apiBase;
      return `${base}${url}`;
    }

    // 4. Handle /api/jobs/files/ paths (alternative endpoint)
    if (url.startsWith('/api/jobs/files/')) {
      const base = apiBase.endsWith('/') ? apiBase.slice(0, -1) : apiBase;
      return `${base}${url}`;
    }

    // 5. For other relative paths, prepend API base
    const base = apiBase.endsWith('/') ? apiBase.slice(0, -1) : apiBase;
    const path = url.startsWith('/') ? url : `/${url}`;
    
    // Construct the absolute URL
    return `${base}${path}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl text-gray-900 mb-6">My Profile</h1>
        
        {/* Basic Profile Information */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-16 w-16">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xl text-gray-900">{user?.name}</p>
              <p className="text-gray-600">{user?.role}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Full Name</p>
              <p className="text-gray-900">{user?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Email</p>
              <p className="text-gray-900">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Role</p>
              <p className="text-gray-900 capitalize">{user?.role}</p>
            </div>
          </div>
        </Card>

        {/* Resume Management - Only for Candidates */}
        {user?.role === 'CANDIDATE' && (
          <Card className="p-6 mb-6">
            <h2 className="text-xl text-gray-900 mb-4">Resume Management</h2>
            
            {loading ? (
              <p className="text-gray-600">Loading resume information...</p>
            ) : (
              <div className="space-y-4">
                {/* Current Resume Display */}
                {currentResume ? (
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Current Resume</p>
                          <p className="text-xs text-gray-500">Uploaded from recent application</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={downloadResume}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={deleteResume}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">No resume uploaded yet</p>
                    <p className="text-sm text-gray-500">Upload a resume to apply for jobs faster</p>
                  </div>
                )}

                {/* Upload New Resume */}
                <div>
                  <Label htmlFor="resume-upload" className="text-sm font-medium text-gray-700">
                    {currentResume ? 'Update Resume' : 'Upload Resume'}
                  </Label>
                  <div className="mt-2">
                    <Input
                      id="resume-upload"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeUpload}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Supported formats: PDF, DOC, DOCX (Max 5MB)
                    </p>
                  </div>
                </div>

                {/* Recent Applications with Resume */}
                {applications.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Recent Applications</h3>
                    <div className="space-y-2">
                      {applications.slice(0, 3).map((app: any) => (
                        <div key={app.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{app.jobTitle}</p>
                            <p className="text-xs text-gray-500">{app.jobOrganization}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              app.status === 'applied' ? 'bg-blue-100 text-blue-700' :
                              app.status === 'shortlisted' ? 'bg-green-100 text-green-700' :
                              app.status === 'interview' ? 'bg-purple-100 text-purple-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {app.status}
                            </span>
                            {app.resumeUrl && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(resolveFileUrl(app.resumeUrl), '_blank')}
                              >
                                <FileText className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        )}

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => onNavigate('dashboard')}>
            Back to Dashboard
          </Button>
          {user?.role === 'CANDIDATE' && (
            <Button onClick={() => onNavigate('job-alerts')}>
              Manage Job Alerts
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

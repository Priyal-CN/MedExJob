import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { Calendar, FileText, Building2 } from 'lucide-react';
import { fetchJob } from '../api/jobs';
import { applyForJob } from '../api/applications';
import { useAuth } from '../contexts/AuthContext';

interface JobApplicationPageProps {
  onNavigate: (page: string, entityId?: string) => void;
}

export function JobApplicationPage({ onNavigate }: JobApplicationPageProps) {
  const { jobId } = useParams<{ jobId: string }>();
  const { isAuthenticated, user } = useAuth();

  const [job, setJob] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [applying, setApplying] = useState(false);
  const [form, setForm] = useState({
    candidateName: '',
    candidateEmail: '',
    candidatePhone: '',
    resume: null as File | null,
    notes: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      onNavigate('login');
      return;
    }
  }, [isAuthenticated, onNavigate]);

  useEffect(() => {
    (async () => {
      if (!jobId) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      try {
        const data = await fetchJob(jobId);
        setJob(data);
        setNotFound(false);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [jobId]);

  useEffect(() => {
    if (user) {
      setForm(prev => ({ ...prev, candidateName: user.name, candidateEmail: user.email }));
    }
  }, [user]);

  // Resolve file URLs to absolute URLs for proper display
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

  const handleSubmit = async () => {
    if (!job) return;
    // Check token from localStorage directly (apiClient will also check this)
    const authToken = localStorage.getItem('token');
    if (!authToken) {
      alert('You must be logged in to apply for jobs.');
      onNavigate('login');
      return;
    }
    setApplying(true);
    try {
      await applyForJob({
        jobId: job.id,
        candidateId: user!.id,
        candidateName: form.candidateName,
        candidateEmail: form.candidateEmail,
        candidatePhone: form.candidatePhone,
        resume: form.resume || undefined,
        notes: form.notes || undefined
      });
      if (jobId) {
        onNavigate('job-apply', `${jobId}/success`);
      } else {
        onNavigate('dashboard');
      }
    } catch (e) {
      alert('Failed to submit application. Please try again.');
      console.error(e);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading…</div>
      </div>
    );
  }

  if (notFound || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-gray-900 mb-2">Job Not Found</h2>
          <Button onClick={() => onNavigate('jobs')}>Browse Jobs</Button>
        </div>
      </div>
    );
  }

  const daysLeft = job.lastDate ? Math.ceil((new Date(job.lastDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid md:grid-cols-5 gap-6">
          <div className="md:col-span-3 space-y-6">
            <Card className="p-6">
              <h1 className="text-2xl text-gray-900 mb-1">Apply for {job.title}</h1>
              <div className="text-gray-600 flex items-center gap-2 mb-4">
                <Building2 className="w-4 h-4" />
                <span>{job.organization}</span>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="candidateName">Full Name *</Label>
                  <Input id="candidateName" value={form.candidateName} onChange={(e) => setForm(prev => ({ ...prev, candidateName: e.target.value }))} placeholder="Enter your full name" />
                </div>
                <div>
                  <Label htmlFor="candidateEmail">Email Address *</Label>
                  <Input id="candidateEmail" type="email" value={form.candidateEmail} onChange={(e) => setForm(prev => ({ ...prev, candidateEmail: e.target.value }))} placeholder="Enter your email" />
                </div>
                <div>
                  <Label htmlFor="candidatePhone">Phone Number *</Label>
                  <Input id="candidatePhone" value={form.candidatePhone} onChange={(e) => setForm(prev => ({ ...prev, candidatePhone: e.target.value }))} placeholder="Enter your phone number" />
                </div>
                <div>
                  <Label htmlFor="resume">Resume/CV</Label>
                  <Input id="resume" type="file" accept=".pdf,.doc,.docx" onChange={(e) => setForm(prev => ({ ...prev, resume: e.target.files?.[0] || null }))} />
                  <p className="text-xs text-gray-500 mt-1">Upload PDF, DOC, or DOCX (max 10MB)</p>
                </div>
                <div>
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea id="notes" rows={4} value={form.notes} onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))} placeholder="Any additional information you'd like to share..." />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" className="flex-1" onClick={() => jobId && onNavigate('job-detail', jobId)}>Cancel</Button>
                  <Button className="flex-1 bg-green-600 hover:bg-green-700" disabled={applying || !form.candidateName || !form.candidateEmail || !form.candidatePhone} onClick={handleSubmit}>
                    {applying ? 'Submitting...' : 'Submit Application'}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
          <div className="md:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="space-y-3">
                <div className="text-sm text-gray-600">Application closes on</div>
                <div className="flex items-center gap-2 text-gray-900">
                  <Calendar className="w-4 h-4" />
                  <span>{job.lastDate ? new Date(job.lastDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}</span>
                </div>
                {daysLeft > 0 && (
                  <Alert className={daysLeft <= 7 ? 'border-red-200 bg-red-50' : 'border-blue-200 bg-blue-50'}>
                    <AlertDescription>
                      {daysLeft <= 7 ? (
                        <span className="text-red-700">Only {daysLeft} days left to apply!</span>
                      ) : (
                        <span className="text-blue-700">{daysLeft} days remaining</span>
                      )}
                    </AlertDescription>
                  </Alert>
                )}
                {job.pdfUrl && (
                  <Button asChild variant="outline" className="w-full">
                    <a href={resolveFileUrl(job.pdfUrl)} target="_blank" rel="noopener noreferrer">
                      <FileText className="w-4 h-4 mr-2" /> View Notification
                    </a>
                  </Button>
                )}
              </div>
              <Separator className="my-4" />
              <Button variant="outline" className="w-full" onClick={() => onNavigate('jobs')}>Back to Jobs</Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { AuthPage } from './components/AuthPage';
import { JobListingPage } from './components/JobListingPage';
import { JobDetailPage } from './components/JobDetailPage';
import { CandidateDashboard } from './components/CandidateDashboard';
import { EmployerDashboard } from './components/EmployerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { ProfilePage } from './components/ProfilePage';
import { AboutPage } from './components/AboutPage';
import { FAQPage } from './components/FAQPage';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { TermsConditionsPage } from './components/TermsConditionsPage';
import { AdminJobManagementPage } from './components/AdminJobManagementPage';
import { JobPostingForm } from './components/JobPostingForm';
import { AdminUsersPage } from './components/AdminUsersPage';
import { EmployerVerificationPage } from './components/EmployerVerificationPage';
import { AdminApplications } from './components/AdminApplications';
import { AadhaarVerificationPage } from './components/AadhaarVerificationPage';
import { EmployerKYCForm } from './components/EmployerKYCForm';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { NotificationCenter } from './components/NotificationCenter';
import { SubscriptionPage } from './components/SubscriptionPage';
import { EmployerVerification } from './components/EmployerVerification';
import { AdminSettingsPage } from './components/AdminSettingsPage';
import { JobAlerts } from './components/JobAlerts';
import { VerificationNotification } from './components/VerificationNotification';
import { KYCSubmissionSuccess } from './components/KYCSubmissionSuccess';
import { createJob } from './api/jobs';
import { JobApplicationPage } from './components/JobApplicationPage';
import { JobApplicationSuccess } from './components/JobApplicationSuccess';
import { VerificationPendingPage } from './components/VerificationPendingPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { NotificationCenterRoute } from './components/routes/NotificationCenterRoute';
import { AnalyticsRoute } from './components/routes/AnalyticsRoute';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState(location.pathname.substring(1) || 'home');

  useEffect(() => {
    setCurrentPage(location.pathname.substring(1) || 'home');
  }, [location]);

  const handleNavigate = (page: string, entityId?: string) => {
    console.log('handleNavigate called with:', { page, entityId, currentPath: location.pathname });
    
    if (page === 'logout') {
      logout();
      navigate('/login');
      return;
    }
    if (page === 'dashboard') {
      if (!isAuthenticated || !user) {
        navigate('/login');
      } else {
        // Normalize role to uppercase for consistent comparison
        const userRole = user.role ? String(user.role).toUpperCase() : '';
        console.log('App.tsx - Navigating to dashboard for role:', userRole);
        
        if (userRole === 'ADMIN') {
          console.log('App.tsx - Going to admin dashboard');
          navigate('/dashboard/admin');
        } else if (userRole === 'EMPLOYER') {
          console.log('App.tsx - Going to employer dashboard');
          navigate('/dashboard/employer');
        } else if (userRole === 'CANDIDATE') {
          console.log('App.tsx - Going to candidate dashboard');
          navigate('/dashboard/candidate');
        } else {
          console.log('App.tsx - Unknown role, defaulting to candidate dashboard. Role was:', userRole);
          navigate('/dashboard/candidate');
        }
      }
      return;
    }
    if (page === 'subscription') {
      console.log('Navigating to subscription page...');
      navigate('/subscription');
      return;
    }
    // Handle nested paths (e.g., "job-apply" with "123/success")
    if (entityId && entityId.includes('/')) {
      const path = `/${page}/${entityId}`;
      console.log('Navigating to nested path:', path);
      navigate(path);
      return;
    }
    // For other pages, navigate directly
    const path = entityId ? `/${page}/${entityId}` : `/${page}`;
    console.log('Navigating to path:', path);
    navigate(path);
  };

  return (
    <>
      <Header currentPage={currentPage} onNavigate={handleNavigate} isAuthenticated={isAuthenticated} userRole={user?.role} />
      <main>
        <Routes>
          <Route path="/" element={<HomePage onNavigate={handleNavigate} />} />
          <Route path="/home" element={<HomePage onNavigate={handleNavigate} />} />
          <Route path="/login" element={<AuthPage mode="login" onNavigate={handleNavigate} />} />
          <Route path="/register" element={<AuthPage mode="register" onNavigate={handleNavigate} />} />
          <Route path="/aadhaar-verification" element={<EmployerKYCForm />} />
          <Route path="/kyc-success" element={<KYCSubmissionSuccess />} />

          <Route path="/verification-pending" element={
            <ProtectedRoute allowedRoles={['EMPLOYER']}>
              <VerificationPendingPage />
            </ProtectedRoute>
          } />
          <Route path="/jobs" element={<JobListingPage onNavigate={handleNavigate} />} />
          <Route path="/govt-jobs" element={<JobListingPage onNavigate={handleNavigate} sector="government" />} />
          <Route path="/private-jobs" element={<JobListingPage onNavigate={handleNavigate} sector="private" />} />
          <Route path="/job-detail/:jobId" element={<JobDetailPage onNavigate={handleNavigate} />} />
          <Route path="/job-detail/:jobId/apply" element={<JobDetailPage onNavigate={handleNavigate} showApplyDialog />} />
          <Route path="/job-apply/:jobId" element={<JobApplicationPage onNavigate={handleNavigate} />} />
          <Route path="/job-apply/:jobId/success" element={<JobApplicationSuccess onNavigate={handleNavigate} />} />
          <Route path="/about" element={<AboutPage onNavigate={handleNavigate} />} />
          <Route path="/faq" element={<FAQPage onNavigate={handleNavigate} />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage onNavigate={handleNavigate} />} />
          <Route path="/terms-conditions" element={<TermsConditionsPage onNavigate={handleNavigate} />} />
          <Route path="/subscription" element={<SubscriptionPage onNavigate={handleNavigate} />} />

          <Route path="/job-alerts" element={
            <ProtectedRoute allowedRoles={['CANDIDATE']}>
              <JobAlerts onNavigate={handleNavigate} />
            </ProtectedRoute>
          } />

          <Route path="/dashboard/candidate" element={
            <ProtectedRoute allowedRoles={['CANDIDATE']}>
              <CandidateDashboard onNavigate={handleNavigate} />
            </ProtectedRoute>
          } />

          <Route path="/dashboard/employer" element={
            <ProtectedRoute allowedRoles={['EMPLOYER']}>
              <EmployerDashboard onNavigate={handleNavigate} />
            </ProtectedRoute>
          } />

          <Route path="/dashboard/admin" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard onNavigate={handleNavigate} />
            </ProtectedRoute>
          } />

          <Route path="/notifications" element={<NotificationCenterRoute />} />

          <Route path="/verification" element={
            <ProtectedRoute allowedRoles={['EMPLOYER']}>
              <EmployerVerification onNavigate={handleNavigate} />
            </ProtectedRoute>
          } />

          <Route path="/admin-jobs" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminJobManagementPage onNavigate={handleNavigate} />
            </ProtectedRoute>
          } />

          <Route path="/admin-post-job" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <JobPostingForm onCancel={() => handleNavigate('admin-jobs')} onSave={async (jobData) => {
                try {
                  const payload: any = {
                    title: jobData.title || '',
                    organization: jobData.organization || '',
                    sector: jobData.sector || 'private',
                    category: jobData.category || 'Medical Officer',
                    location: jobData.location || '',
                    qualification: jobData.qualification || '',
                    salary: jobData.salary || '',
                    description: jobData.description || '',
                    lastDate: jobData.lastDate || new Date().toISOString().split('T')[0],
                    requirements: jobData.requirements || '',
                    benefits: jobData.benefits || '',
                    contactEmail: jobData.contactEmail || 'noreply@medexjob.com',
                    contactPhone: jobData.contactPhone || '0000000000',
                    pdfUrl: jobData.pdfUrl || '',
                    imageUrl: jobData.imageUrl || '',
                    applyLink: jobData.applyLink || '',
                    status: (jobData as any)?.status || 'active',
                    featured: (jobData as any)?.featured ?? false,
                    views: (jobData as any)?.views ?? 0,
                    applications: (jobData as any)?.applications ?? 0,
                    type: (jobData as any)?.type || 'hospital',
                  };

                  // Only include optional fields if they have values
                  if (jobData.experience && jobData.experience.trim()) {
                    payload.experience = jobData.experience;
                  }
                  if (jobData.experienceLevel) {
                    payload.experienceLevel = jobData.experienceLevel;
                  }
                  if (jobData.speciality && jobData.speciality.trim()) {
                    payload.speciality = jobData.speciality;
                  }
                  if (jobData.dutyType) {
                    payload.dutyType = jobData.dutyType;
                  }
                  if (jobData.numberOfPosts && jobData.numberOfPosts > 0) {
                    payload.numberOfPosts = jobData.numberOfPosts;
                  }
                  if (jobData.gender && jobData.gender.trim() && jobData.gender !== 'any') {
                    payload.gender = jobData.gender;
                  }

                  await createJob(payload);
                  alert('Job posted successfully');
                  handleNavigate('admin-jobs');
                } catch (e: any) {
                  alert(`Failed to post job: ${e?.message || 'Unknown error'}`);
                }
              }} />
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage onNavigate={handleNavigate} />
            </ProtectedRoute>
          } />

          <Route path="/admin-users" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminUsersPage onNavigate={handleNavigate} />
            </ProtectedRoute>
          } />

          <Route path="/admin-employer-verification" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <EmployerVerificationPage onNavigate={handleNavigate} />
            </ProtectedRoute>
          } />

          <Route path="/admin-applications" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminApplications onNavigate={handleNavigate} />
            </ProtectedRoute>
          } />

          <Route path="/analytics" element={<AnalyticsRoute />} />

          <Route path="/admin-settings" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminSettingsPage onNavigate={handleNavigate} />
            </ProtectedRoute>
          } />

          <Route path="/verification-notifications" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <VerificationNotification onNavigate={handleNavigate} />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer onNavigate={handleNavigate} />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
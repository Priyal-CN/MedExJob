import { useState, useEffect } from 'react';
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
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { NotificationCenter } from './components/NotificationCenter';
import { SubscriptionPage } from './components/SubscriptionPage';
import { EmployerVerification } from './components/EmployerVerification';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState(location.pathname.substring(1) || 'home');

  useEffect(() => {
    setCurrentPage(location.pathname.substring(1) || 'home');
  }, [location]);

  const handleNavigate = (page: string, entityId?: string) => {
    if (page === 'logout') {
      logout();
      navigate('/login');
      return;
    }
    // Handle dashboard navigation based on user role - ignore entityId for dashboard
    if (page === 'dashboard') {
      if (!isAuthenticated || !user) {
        navigate('/login');
        return;
      }
      // Navigate to role-specific dashboard
      if (user.role === 'admin') {
        navigate('/dashboard/admin');
      } else if (user.role === 'employer') {
        navigate('/dashboard/employer');
      } else if (user.role === 'candidate') {
        navigate('/dashboard/candidate');
      } else {
        navigate('/dashboard/candidate'); // Default fallback
      }
      return;
    }
    const path = entityId ? `/${page}/${entityId}` : `/${page}`;
    navigate(path);
  };

  const getDashboard = () => {
    if (!isAuthenticated || !user) return <AuthPage mode="login" onNavigate={handleNavigate} />;    
    if (user.role === 'admin') return <AdminDashboard onNavigate={handleNavigate} />;    
    if (user.role === 'employer') return <EmployerVerification onNavigate={handleNavigate} />; // Employers land on verification first
    return <CandidateDashboard onNavigate={handleNavigate} />;    
  }  

  return (
    <>
      <Header currentPage={currentPage} onNavigate={handleNavigate} isAuthenticated={isAuthenticated} userRole={user?.role} />
      <main>
        <Routes>
          <Route path="/" element={<HomePage onNavigate={handleNavigate} />} />
          <Route path="/home" element={<HomePage onNavigate={handleNavigate} />} />
          <Route path="/login" element={<AuthPage mode="login" onNavigate={handleNavigate} />} />
          <Route path="/register" element={<AuthPage mode="register" onNavigate={handleNavigate} />} />
          <Route path="/jobs" element={<JobListingPage onNavigate={handleNavigate} />} />
          <Route path="/govt-jobs" element={<JobListingPage onNavigate={handleNavigate} sector="government" />} />
          <Route path="/private-jobs" element={<JobListingPage onNavigate={handleNavigate} sector="private" />} />
          <Route path="/job-detail/:jobId" element={<JobDetailPage onNavigate={handleNavigate} />} />
          <Route path="/about" element={<AboutPage onNavigate={handleNavigate} />} />
          <Route path="/faq" element={<FAQPage onNavigate={handleNavigate} />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage onNavigate={handleNavigate} />} />
          <Route path="/terms-conditions" element={<TermsConditionsPage onNavigate={handleNavigate} />} />
          <Route path="/subscription" element={<SubscriptionPage onNavigate={handleNavigate} />} />

          {/* Authenticated Routes */}
          {isAuthenticated && user && (
            <>
              {/* Generic dashboard route, redirects based on role */}
              <Route path="/dashboard" element={getDashboard()} />

              {/* Role-specific dashboard routes */}
              <Route path="/dashboard/candidate" element={<CandidateDashboard onNavigate={handleNavigate} />} />
              <Route path="/dashboard/employer" element={<EmployerDashboard onNavigate={handleNavigate} />} />
              <Route path="/notifications" element={<NotificationCenter userId={user.id} userRole={user.role} />} />
              <Route path="/verification" element={<EmployerVerification onNavigate={handleNavigate} />} />

              {/* Admin Routes */}
              <Route path="/dashboard/admin" element={<AdminDashboard onNavigate={handleNavigate} />} />
              <Route path="/admin-jobs" element={<AdminJobManagementPage onNavigate={handleNavigate} />} />
              <Route path="/admin-post-job" element={<JobPostingForm onCancel={() => handleNavigate('admin-jobs')} onSave={() => {}} />} />
              <Route path="/profile" element={<ProfilePage onNavigate={handleNavigate} />} />
              <Route path="/admin-users" element={<AdminUsersPage onNavigate={handleNavigate} />} />
              <Route path="/admin-employer-verification" element={<EmployerVerificationPage onNavigate={handleNavigate} />} />
              <Route path="/admin-applications" element={<AdminApplications onNavigate={handleNavigate} />} />
              <Route path="/analytics" element={<AnalyticsDashboard userRole={user.role} userId={user.id} />} />
            </>
          )}
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
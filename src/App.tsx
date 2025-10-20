import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { JobListingPage } from './components/JobListingPage';
import { JobDetailPage } from './components/JobDetailPage';
import { AuthPage } from './components/AuthPage';
import { CandidateDashboard } from './components/CandidateDashboard';
import { EmployerDashboard } from './components/EmployerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AboutPage } from './components/AboutPage';
import { SubscriptionPage } from './components/SubscriptionPage';
import { JobPostingForm } from './components/JobPostingForm';
import { NotificationCenter } from './components/NotificationCenter';
import { JobAlerts } from './components/JobAlerts';
import { ApplicationTracking } from './components/ApplicationTracking';
import { EmployerVerification } from './components/EmployerVerification';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { FraudProtection } from './components/FraudProtection';
import { ProfilePage } from './components/ProfilePage';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { TermsConditionsPage } from './components/TermsConditionsPage';
import { FAQPage } from './components/FAQPage';

type Page = 'home' | 'jobs' | 'govt-jobs' | 'private-jobs' | 'job-detail' | 'about' | 'login' | 'register' | 'dashboard' | 'profile' | 'subscription' | 'post-job' | 'notifications' | 'job-alerts' | 'applications' | 'verification' | 'analytics' | 'fraud-protection' | 'privacy-policy' | 'terms-conditions' | 'faq';

function AppContent() {
  const { user, logout, isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const handleNavigate = (page: string, param?: string) => {
    setCurrentPage(page as Page);

    if (page === 'job-detail' && param) {
      setSelectedJobId(param);
    }

    if (page === 'login' || page === 'register') {
      logout();
    }

    // Scroll to top on navigation
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      
      case 'jobs':
        return <JobListingPage onNavigate={handleNavigate} />;
      
      case 'govt-jobs':
        return <JobListingPage onNavigate={handleNavigate} sector="government" />;
      
      case 'private-jobs':
        return <JobListingPage onNavigate={handleNavigate} sector="private" />;
      
      case 'job-detail':
        return selectedJobId ? (
          <JobDetailPage 
            jobId={selectedJobId} 
            onNavigate={handleNavigate}
            isAuthenticated={isAuthenticated}
          />
        ) : (
          <HomePage onNavigate={handleNavigate} />
        );
      
      case 'login':
        return <AuthPage mode="login" onNavigate={handleNavigate} />;
      
      case 'register':
        return <AuthPage mode="register" onNavigate={handleNavigate} />;
      
      case 'dashboard':
        if (!isAuthenticated) {
          return <AuthPage mode="login" onNavigate={handleNavigate} />;
        }

        if (user?.role === 'admin') {
          return <AdminDashboard onNavigate={handleNavigate} />;
        } else if (user?.role === 'employer') {
          return <EmployerDashboard onNavigate={handleNavigate} />;
        } else {
          return <CandidateDashboard onNavigate={handleNavigate} />;
        }
      
      case 'about':
        return <AboutPage onNavigate={handleNavigate} />;
      
      case 'subscription':
        return <SubscriptionPage onNavigate={handleNavigate} />;
      
      case 'profile':
        if (!isAuthenticated) {
          return <AuthPage mode="login" onNavigate={handleNavigate} />;
        }
        return <ProfilePage onNavigate={handleNavigate} />;

      case 'post-job':
        if (!isAuthenticated || user?.role !== 'employer') {
          return <AuthPage mode="login" onNavigate={handleNavigate} />;
        }
        return <JobPostingForm onNavigate={handleNavigate} />;

      case 'notifications':
        if (!isAuthenticated) {
          return <AuthPage mode="login" onNavigate={handleNavigate} />;
        }
        return <NotificationCenter userId={user?.id || 'current-user'} userRole={user?.role || 'candidate'} />;

      case 'job-alerts':
        if (!isAuthenticated || user?.role !== 'candidate') {
          return <AuthPage mode="login" onNavigate={handleNavigate} />;
        }
        return <JobAlerts />;

      case 'applications':
        if (!isAuthenticated) {
          return <AuthPage mode="login" onNavigate={handleNavigate} />;
        }
        return <ApplicationTracking userRole={user?.role || 'candidate'} userId={user?.id || 'current-user'} />;

      case 'verification':
        if (!isAuthenticated || user?.role !== 'employer') {
          return <AuthPage mode="login" onNavigate={handleNavigate} />;
        }
        return <EmployerVerification onNavigate={handleNavigate} />;

      case 'analytics':
        if (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'employer')) {
          return <AuthPage mode="login" onNavigate={handleNavigate} />;
        }
        return <AnalyticsDashboard userRole={user?.role || 'employer'} userId={user?.id || 'current-user'} />;

      case 'fraud-protection':
        if (!isAuthenticated) {
          return <AuthPage mode="login" onNavigate={handleNavigate} />;
        }
        return <FraudProtection userRole={user?.role || 'candidate'} userId={user?.id || 'current-user'} />;

      case 'privacy-policy':
        return <PrivacyPolicyPage onNavigate={handleNavigate} />;

      case 'terms-conditions':
        return <TermsConditionsPage onNavigate={handleNavigate} />;

      case 'faq':
        return <FAQPage onNavigate={handleNavigate} />;

      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  const showHeaderFooter = currentPage !== 'login' && currentPage !== 'register';

  return (
    <div className="min-h-screen flex flex-col">
      {showHeaderFooter && (
        <Header
          currentPage={currentPage}
          onNavigate={handleNavigate}
          isAuthenticated={isAuthenticated}
          userRole={user?.role || undefined}
        />
      )}

      <main className="flex-1">
        {renderPage()}
      </main>

      {showHeaderFooter && <Footer onNavigate={handleNavigate} />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

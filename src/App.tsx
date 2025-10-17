import { useState } from 'react';
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

type Page = 'home' | 'jobs' | 'govt-jobs' | 'private-jobs' | 'job-detail' | 'about' | 'login' | 'register' | 'dashboard' | 'profile' | 'subscription';
type UserRole = 'admin' | 'employer' | 'candidate' | null;

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(null);

  const handleNavigate = (page: string, param?: string) => {
    setCurrentPage(page as Page);
    
    if (page === 'job-detail' && param) {
      setSelectedJobId(param);
    }
    
    if (page === 'dashboard' && param) {
      setUserRole(param as UserRole);
      setIsAuthenticated(true);
    }

    if (page === 'login' || page === 'register') {
      setIsAuthenticated(false);
      setUserRole(null);
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
        
        if (userRole === 'admin') {
          return <AdminDashboard onNavigate={handleNavigate} />;
        } else if (userRole === 'employer') {
          return <EmployerDashboard onNavigate={handleNavigate} />;
        } else {
          return <CandidateDashboard onNavigate={handleNavigate} />;
        }
      
      case 'about':
        return <AboutPage onNavigate={handleNavigate} />;
      
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
          userRole={userRole || undefined}
        />
      )}
      
      <main className="flex-1">
        {renderPage()}
      </main>
      
      {showHeaderFooter && <Footer onNavigate={handleNavigate} />}
    </div>
  );
}

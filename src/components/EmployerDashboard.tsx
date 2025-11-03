import { Plus, Briefcase, Users, Eye, CheckCircle, XCircle, Calendar, ArrowLeft, Edit, Trash2, AlertTriangle, TrendingUp, Clock, Award, Sparkles, Building2, FileText, Heart, Activity, BarChart3, Target, Zap, Star, Shield, Globe, Mail, Phone, MapPin, ExternalLink, Crown } from 'lucide-react';
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
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchEmployer } from '../api/employers';
import { EmployerResponse } from '../api/employers';
import { Alert, AlertDescription } from './ui/alert';

interface EmployerDashboardProps {
  onNavigate: (page: string) => void;
}

export function EmployerDashboard({ onNavigate }: EmployerDashboardProps) {
  const { user, token } = useAuth();
  const [myJobs, setMyJobs] = useState<any[]>([]);
  const [myApplications, setMyApplications] = useState<any[]>([]);
  const [employer, setEmployer] = useState<EmployerResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'none' | 'basic' | 'professional' | 'enterprise'>('none');

  // Calculate total metrics from actual data
  const totalViews = myJobs.reduce((sum, job) => sum + job.views, 0);
  const totalApplications = myApplications.length; // Use myApplications length for total applications

  // Subscription helper functions
  const canPostJobs = () => {
    if (subscriptionStatus === 'none') return false;
    if (subscriptionStatus === 'basic') return myJobs.length < 3;
    return true; // professional and enterprise have unlimited
  };

  const getJobLimit = () => {
    switch (subscriptionStatus) {
      case 'none': return 0;
      case 'basic': return 3;
      case 'professional':
      case 'enterprise': return 'Unlimited';
      default: return 0;
    }
  };

  const getSubscriptionDisplayName = () => {
    switch (subscriptionStatus) {
      case 'none': return 'No Subscription';
      case 'basic': return 'Basic Plan';
      case 'professional': return 'Professional Plan';
      case 'enterprise': return 'Enterprise Plan';
      default: return 'Unknown';
    }
  };

  // Check employer verification status on mount
  useEffect(() => {
    const checkVerificationStatus = async () => {
      if (!user || !token) {
        setLoading(false);
        return;
      }

      try {
        // Try to fetch employer data from API
                 try {
                   const employerData = await fetchEmployer(user.id);
                   setEmployer(employerData);
                   setSubscriptionStatus(employerData.plan as 'basic' | 'professional' | 'enterprise');
                 } catch (fetchError: any) {
          // If employer doesn't exist (404), create a basic employer record
          if (fetchError.message && fetchError.message.includes('[404]')) {
            console.log('Employer record not found, creating basic employer data');
            const basicEmployerData: EmployerResponse = {
              id: user.id,
              userId: user.id,
              userName: user.name,
              userEmail: user.email,
              companyName: user.name + "'s Company",
              companyType: 'hr',
              verificationStatus: 'pending',
              plan: undefined, // No plan initially
              isVerified: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            setEmployer(basicEmployerData);
            setSubscriptionStatus('none');
          } else {
            throw fetchError;
          }
        }
        
      } catch (error) {
        console.error('Failed to fetch employer data:', error);
                 // Set a fallback employer data
                 const fallbackEmployerData: EmployerResponse = {
                   id: user.id,
                   userId: user.id,
                   userName: user.name,
                   userEmail: user.email,
                   companyName: user.name + "'s Company",
                   companyType: 'hr',
                   verificationStatus: 'pending',
                   plan: undefined, // No plan initially
                   isVerified: false,
                   createdAt: new Date().toISOString(),
                   updatedAt: new Date().toISOString()
                 };
                 setEmployer(fallbackEmployerData);
                 
                 // Set subscription status to none for new employers
                 setSubscriptionStatus('none');
      } finally {
        setLoading(false);
      }
    };

    checkVerificationStatus();
  }, [user, token, onNavigate]);

  const handleEditJob = (jobId: string) => {
    // Should be disabled/require upgrade in this version
    alert(`This feature requires a premium plan. Job ID: ${jobId}`);
  };

  const handleCloseJob = (jobId: string) => {
    // Should be disabled/require upgrade in this version
    alert(`This feature requires a premium plan. Job ID: ${jobId}`);
    setMyJobs(prev => prev.map(job =>
      job.id === jobId ? { ...job, status: 'closed' as const } : job
    ));
  };

  const handleViewApplications = (jobId: string) => {
    // Should be disabled/require upgrade in this version
    alert(`This feature requires a premium plan. Job ID: ${jobId}`);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-indigo-400 rounded-full animate-spin mx-auto" style={{animationDelay: '0.5s', animationDuration: '1.5s'}}></div>
          </div>
          <p className="text-slate-600 text-lg font-medium">Loading your dashboard...</p>
          <p className="text-slate-500 text-sm mt-2">Preparing your workspace</p>
        </div>
      </div>
    );
  }

  // If employer is not verified (simulated 'pending' status for the full screen block, mirroring image 618782.png)
  // NOTE: This logic assumes the outer navigation didn't redirect to a dedicated Verification page.
  // I will adapt the logic to only show this "required" screen if we are not on the verification tab.
  if (employer?.verificationStatus === 'pending' && false /* Disabled full-page block to allow tab view */) { 
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-amber-100">
              <AlertTriangle className="w-10 h-10 text-amber-500" />
            </div>
            <h1 className="text-3xl text-gray-900 mb-3">Verification Required</h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Your employer account needs to be verified before you can access the dashboard and post jobs.
              Please complete the verification process to unlock all features.
            </p>
            <Button onClick={() => onNavigate('verification')} className="bg-blue-600 hover:bg-blue-700 shadow-lg">
              <CheckCircle className="w-4 h-4 mr-2" />
              Go to Verification
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isVerified = employer?.verificationStatus === 'approved';

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('home')}
                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg px-4 py-2"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <div className="h-8 w-px bg-blue-200" />
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Employer Dashboard</h1>
                  <p className="text-sm text-gray-600">Manage your job postings and applications</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => onNavigate('verification')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
              >
                <Shield className="w-4 h-4 mr-2" />
                Verification
              </Button>
              <Button
                onClick={() => onNavigate('profile')}
                variant="outline"
                className="border-blue-300 text-blue-700 hover:bg-blue-50 px-6 py-2 rounded-lg font-medium"
              >
                Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-200 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{employer?.companyName || 'Your Company'}</h1>
                <div className="flex items-center gap-4">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isVerified ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                    {isVerified ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                    <span className="font-medium">
                      {isVerified ? 'Verified Healthcare Employer' : 'Verification Pending'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg">
                    <Star className="w-5 h-5" />
                    <span className="font-medium">Premium Account</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">{totalViews.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Views</div>
            </div>
          </div>
          
          <p className="text-lg text-gray-700 mb-6 max-w-3xl">
            {isVerified 
              ? 'Welcome back! Your account is verified and ready to connect with top healthcare professionals.' 
              : 'Complete your verification to unlock the full potential of our platform and start posting jobs.'
            }
          </p>
          
          <div className="flex items-center gap-4">
            <Button
              size="lg"
              onClick={() => {
                if (!canPostJobs()) {
                  if (subscriptionStatus === 'none') {
                    alert('You need to choose a subscription plan first to post jobs. Redirecting to subscription page...');
                    onNavigate('subscription');
                  } else if (subscriptionStatus === 'basic' && myJobs.length >= 3) {
                    alert('You have reached your job limit on the Basic plan. Please upgrade to post more jobs. Redirecting to subscription page...');
                    onNavigate('subscription');
                  } else {
                    onNavigate('subscription');
                  }
                } else {
                  // TODO: Navigate to job posting form
                  alert('Job posting form will open here');
                }
              }}
              className={`px-8 py-3 rounded-lg font-medium ${
                canPostJobs() 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-gray-400 text-white cursor-not-allowed'
              }`}
              disabled={!canPostJobs()}
            >
              <Plus className="w-5 h-5 mr-2" />
{canPostJobs() ? 'Post New Job' : subscriptionStatus === 'none' ? 'Choose Subscription First' : 'Upgrade to Post Jobs'}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-blue-300 text-blue-700 hover:bg-blue-50 px-8 py-3 rounded-lg font-medium"
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              View Analytics
            </Button>
          </div>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Account Status */}
          <div className={`p-6 rounded-xl shadow-md border ${isVerified ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isVerified ? 'bg-green-500' : 'bg-amber-500'}`}>
                {isVerified ? <CheckCircle className="w-6 h-6 text-white" /> : <Clock className="w-6 h-6 text-white" />}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Account Status</h3>
                <p className={`text-sm font-medium ${isVerified ? 'text-green-700' : 'text-amber-700'}`}>
                  {isVerified ? 'Verified & Active' : 'Pending Verification'}
                </p>
              </div>
            </div>
          </div>

          {/* Current Plan */}
          <div className="p-6 rounded-xl shadow-md border bg-blue-50 border-blue-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Current Plan</h3>
                <p className="text-sm font-medium text-blue-700">{getSubscriptionDisplayName()}</p>
              </div>
            </div>
          </div>

          {/* Member Since */}
          <div className="p-6 rounded-xl shadow-md border bg-gray-50 border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Member Since</h3>
                <p className="text-sm font-medium text-gray-700">
                  {employer?.createdAt ? new Date(employer.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recently'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Status Alert */}
        {subscriptionStatus === 'none' && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-amber-800 mb-2">No Active Subscription</h3>
                <p className="text-amber-700 mb-3">
                  You need a subscription to post jobs and access premium features. Choose a plan that fits your needs.
                </p>
                <Button
                  onClick={() => {
                    console.log('Subscription button clicked - no subscription alert');
                    onNavigate('subscription');
                  }}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-medium"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Choose Subscription Plan
                </Button>
              </div>
            </div>
          </div>
        )}

        {subscriptionStatus === 'basic' && myJobs.length >= 3 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Job Limit Reached</h3>
                <p className="text-blue-700 mb-3">
                  You've reached your limit of 3 jobs on the Basic plan. Upgrade to post unlimited jobs and access more features.
                </p>
                <Button
                  onClick={() => {
                    console.log('Subscription button clicked - job limit reached');
                    onNavigate('subscription');
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Upgrade Plan
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Key Metrics */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-1">{myJobs.length}</div>
              <div className="text-sm text-gray-600 mb-2">Active Jobs</div>
              <div className="flex items-center justify-center text-sm text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>+12% this month</span>
              </div>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-green-600 mb-1">{totalApplications}</div>
              <div className="text-sm text-gray-600 mb-2">Applications</div>
              <div className="flex items-center justify-center text-sm text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>+8% this month</span>
              </div>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-purple-600 mb-1">{totalViews.toLocaleString()}</div>
              <div className="text-sm text-gray-600 mb-2">Profile Views</div>
              <div className="flex items-center justify-center text-sm text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>+15% this month</span>
              </div>
            </div>

            <div className="text-center p-4 bg-orange-50 rounded-xl border border-orange-200">
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-orange-600 mb-1">94%</div>
              <div className="text-sm text-gray-600 mb-2">Success Rate</div>
              <div className="flex items-center justify-center text-sm text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>+3% this month</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-200">
          <Tabs defaultValue="jobs" className="w-full">
            <div className="border-b border-blue-200">
              <TabsList className="bg-transparent h-auto p-0 w-full justify-start">
                <TabsTrigger 
                  value="subscription" 
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-none border-b-2 data-[state=active]:border-blue-600 px-6 py-4 font-medium"
                >
                  <Award className="w-4 h-4 mr-2" />
                  Subscription
                </TabsTrigger>
                <TabsTrigger 
                  value="jobs" 
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-none border-b-2 data-[state=active]:border-blue-600 px-6 py-4 font-medium"
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  My Jobs
                </TabsTrigger>
                <TabsTrigger 
                  value="applications" 
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-none border-b-2 data-[state=active]:border-blue-600 px-6 py-4 font-medium"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Applications
                </TabsTrigger>
                <TabsTrigger 
                  value="analytics" 
                  onClick={() => onNavigate('analytics')}
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-none border-b-2 data-[state=active]:border-blue-600 px-6 py-4 font-medium"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger 
                  value="verification" 
                  onClick={() => onNavigate('verification')}
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-none border-b-2 data-[state=active]:border-blue-600 px-6 py-4 font-medium"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Verification
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Subscription Tab Content */}
            <TabsContent value="subscription" className="p-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Crown className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Current Subscription</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 max-w-md mx-auto">
                  <h4 className="text-xl font-semibold text-blue-800 mb-2">{getSubscriptionDisplayName()}</h4>
                  <p className="text-blue-700 mb-4">
                    {subscriptionStatus === 'none' && 'No active subscription'}
                    {subscriptionStatus === 'basic' && 'Up to 3 job postings'}
                    {subscriptionStatus === 'professional' && 'Unlimited job postings + Advanced features'}
                    {subscriptionStatus === 'enterprise' && 'Unlimited everything + Premium support'}
                  </p>
                  <div className="text-sm text-blue-600">
                    Job Limit: {getJobLimit()}
                  </div>
                </div>
                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                  {subscriptionStatus === 'none' 
                    ? 'Choose a subscription plan to start posting jobs and accessing premium features.'
                    : 'Upgrade your plan to unlock more features and increase your job posting limits.'
                  }
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                    <Zap className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Unlimited Jobs</h4>
                    <p className="text-gray-600 text-sm">Post as many jobs as you need</p>
                  </div>
                  <div className="p-6 bg-green-50 rounded-xl border border-green-200">
                    <BarChart3 className="w-8 h-8 text-green-600 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Advanced Analytics</h4>
                    <p className="text-gray-600 text-sm">Detailed insights and reporting</p>
                  </div>
                  <div className="p-6 bg-purple-50 rounded-xl border border-purple-200">
                    <Users className="w-8 h-8 text-purple-600 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Direct Access</h4>
                    <p className="text-gray-600 text-sm">Connect with top candidates</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
                  <Button 
                    size="lg"
                    onClick={() => {
                      console.log('Subscription button clicked - subscription tab');
                      onNavigate('subscription');
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium"
                  >
                    <Crown className="w-5 h-5 mr-2" />
                    {subscriptionStatus === 'none' ? 'Choose Plan' : 'Upgrade Plan'}
                  </Button>
                  <Button 
                    size="lg"
                    variant="outline"
                    onClick={() => {
                      console.log('Subscription button clicked - view all plans');
                      onNavigate('subscription');
                    }}
                    className="border-blue-300 text-blue-700 hover:bg-blue-50 px-8 py-3 rounded-lg font-medium"
                  >
                    View All Plans
                  </Button>
                </div>
                
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 inline-flex items-center gap-3">
                  <Clock className="w-5 h-5 text-amber-600" />
                  <span className="font-medium text-amber-800">Limited time offer: Get 2 months free on annual plans!</span>
                </div>
              </div>
            </TabsContent>

            {/* Jobs Tab Content */}
            <TabsContent value="jobs" className="p-0">
              <div className="p-8 border-b border-blue-200 flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-white" />
                    </div>
                    Your Job Postings
                  </h3>
                  <p className="text-gray-600">
                    Manage and track all your job listings with detailed analytics.
                  </p>
                </div>
                <Button
                  onClick={() => {
                    if (!isVerified) {
                      alert('Please complete verification first');
                      return;
                    }
                    if (!canPostJobs()) {
                      if (subscriptionStatus === 'none') {
                        alert('You need to choose a subscription plan first to post jobs. Redirecting to subscription page...');
                        onNavigate('subscription');
                      } else if (subscriptionStatus === 'basic' && myJobs.length >= 3) {
                        alert('You have reached your job limit on the Basic plan. Please upgrade to post more jobs. Redirecting to subscription page...');
                        onNavigate('subscription');
                      } else {
                        onNavigate('subscription');
                      }
                    } else {
                      // TODO: Navigate to job posting form
                      alert('Job posting form will open here');
                    }
                  }}
                  className={`px-6 py-3 rounded-lg font-medium ${
                    !isVerified || !canPostJobs()
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                  disabled={!isVerified || !canPostJobs()}
                >
                  <Plus className="w-5 h-5 mr-2" /> 
{!isVerified ? 'Complete Verification First' : 
                   !canPostJobs() ? (subscriptionStatus === 'none' ? 'Choose Subscription First' : 'Upgrade to Post Jobs') : 'Post New Job'}
                </Button>
              </div>
              <div className="p-8 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-blue-200">
                      <TableHead className="text-gray-700 font-semibold">Job Details</TableHead>
                      <TableHead className="text-gray-700 font-semibold">Category</TableHead>
                      <TableHead className="text-center text-gray-700 font-semibold">Applications</TableHead>
                      <TableHead className="text-center text-gray-700 font-semibold">Views</TableHead>
                      <TableHead className="text-gray-700 font-semibold">Posted Date</TableHead>
                      <TableHead className="text-gray-700 font-semibold">Status</TableHead>
                      <TableHead className="text-right text-gray-700 font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myJobs.map((job) => (
                      <TableRow
                        key={job.id}
                        className="hover:bg-blue-50 transition-all duration-200 border-blue-100"
                      >
                        <TableCell>
                          <div>
                            <p className="text-gray-900 font-semibold text-lg">
                              {job.title}
                            </p>
                            <p className="text-sm text-gray-600 flex items-center mt-1">
                              <MapPin className="w-3 h-3 inline mr-1" />
                              {job.location}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-700 border-blue-200 rounded-full px-3 py-1"
                          >
                            {job.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                              <Users className="w-4 h-4 text-emerald-600" />
                            </div>
                            <span className="font-semibold text-gray-900 text-lg">{job.applications || 0}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                              <Eye className="w-4 h-4 text-purple-600" />
                            </div>
                            <span className="font-semibold text-gray-900 text-lg">{job.views || 0}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-600 font-medium flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(job.postedDate).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`rounded-full px-3 py-1 font-medium ${
                              job.status === 'active'
                                ? 'bg-green-100 text-green-800 border-green-200'
                                : job.status === 'pending'
                                ? 'bg-amber-100 text-amber-800 border-amber-200'
                                : 'bg-gray-100 text-gray-800 border-gray-200'
                            }`}
                          >
                            {job.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled
                            onClick={() => handleEditJob(job.id)}
                            className="border-blue-200 text-blue-500 hover:bg-blue-50 rounded-lg px-4 py-2"
                          >
                            <Edit className="w-4 h-4 mr-2" /> Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <p className="text-center text-sm text-gray-500 mt-4">
                  <Sparkles className="w-4 h-4 inline mr-1 text-blue-600" />
                  Upgrade to edit and manage jobs seamlessly.
                </p>
              </div>
            </TabsContent>

            {/* Applications Tab Content */}
            <TabsContent value="applications" className="p-0">
              <div className="p-8 border-b border-blue-200 flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  Recent Applications
                </h3>
                <Badge className="bg-green-50 text-green-700 border-green-200 rounded-full px-4 py-2">
                  {myApplications.length} Total
                </Badge>
              </div>
              <div className="p-8 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-blue-200">
                      <TableHead className="text-gray-700 font-semibold">Candidate</TableHead>
                      <TableHead className="text-gray-700 font-semibold">Job Applied</TableHead>
                      <TableHead className="text-gray-700 font-semibold">Applied Date</TableHead>
                      <TableHead className="text-gray-700 font-semibold">Status</TableHead>
                      <TableHead className="text-right text-gray-700 font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myApplications.map((application) => {
                      const job = myJobs.find((j) => j.id === application.jobId);
                      return (
                        <TableRow
                          key={application.id}
                          className="hover:bg-blue-50 transition-all duration-200 border-blue-100"
                        >
                          <TableCell>
                            <p className="text-gray-900 font-semibold text-lg">
                              {application.candidateName}
                            </p>
                            <p className="text-sm text-gray-600 flex items-center mt-1">
                              <Mail className="w-3 h-3 mr-1" />
                              {application.candidateEmail}
                            </p>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <Briefcase className="w-4 h-4 text-blue-600" />
                              </div>
                              <span className="font-medium text-gray-900">{job?.title}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-gray-600 font-medium flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {new Date(application.appliedDate).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric' 
                              })}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`rounded-full px-3 py-1 font-medium ${
                                application.status === 'shortlisted'
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                  : application.status === 'interview'
                                  ? 'bg-purple-100 text-purple-800 border-purple-200'
                                  : application.status === 'rejected'
                                  ? 'bg-red-100 text-red-800 border-red-200'
                                  : 'bg-slate-100 text-slate-800 border-slate-200'
                              }`}
                            >
                              {application.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              disabled
                              className="border-slate-200 text-slate-500 hover:bg-slate-100 rounded-lg px-4 py-2"
                              onClick={() => handleViewApplications(application.jobId)}
                            >
                              <Eye className="w-4 h-4 mr-2" /> View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                <p className="text-center text-sm text-gray-500 mt-6">
                  <Sparkles className="w-4 h-4 inline mr-2 text-blue-600" />
                  Subscribe to access candidate resumes and schedule interviews.
                </p>
              </div>
            </TabsContent>

          {/* Verification Tab Content */}
          <TabsContent value="verification">
            <div className={`relative overflow-hidden rounded-3xl p-8 text-white shadow-2xl ${isVerified ? 'bg-gradient-to-br from-emerald-600 via-green-700 to-teal-800' : 'bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800'}`}>
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
              
              <div className="relative z-10 text-center">
                <div className={`w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl`}>
                  {isVerified ? <CheckCircle className="w-12 h-12 text-white" /> : <FileText className="w-12 h-12 text-white" />}
                </div>
                <h3 className="text-4xl font-bold text-white mb-6">Employer Verification Status</h3>
                <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
                  {isVerified
                    ? 'Your organization is fully verified! This badge builds trust and helps you attract 3x more quality applications.'
                    : 'Complete the verification process to unlock all platform features and gain the Verified Employer badge.'}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                  <Button 
                    size="lg"
                    onClick={() => onNavigate('verification')}
                    className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm rounded-xl px-8 py-4 text-lg font-semibold transition-all duration-200"
                  >
                    {isVerified ? (
                        <>
                          <Award className="w-5 h-5 mr-2" />
                          View Verification Details
                        </>
                    ) : (
                        <>
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Complete Verification Steps
                        </>
                    )}
                  </Button>
                  {!isVerified && (
                    <Button 
                      size="lg"
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white/10 rounded-xl px-8 py-4 text-lg font-semibold transition-all duration-200"
                    >
                      <Shield className="w-5 h-5 mr-2" />
                      Learn More
                    </Button>
                  )}
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 inline-flex items-center gap-3">
                  <Clock className="w-5 h-5 text-white/80" />
                  <span className="font-medium text-white">
                    {isVerified ? 'Verification successful and active.' : 'Quick and secure verification process - typically takes 24-48 hours.'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Verification Progress Section */}
            {!isVerified && (
                <Card className="mt-8 bg-white/80 backdrop-blur-sm border border-slate-200 shadow-xl rounded-3xl overflow-hidden">
                    <div className="p-8">
                      <h4 className='text-2xl font-bold mb-6 text-slate-900 flex items-center gap-3'>
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                          <Target className="w-4 h-4 text-white" />
                        </div>
                        Verification Progress
                      </h4>
                      <div className='flex justify-between items-center mb-6'>
                        <span className='text-lg text-slate-600 font-medium'>3 of 4 steps completed</span>
                        <span className='text-2xl font-bold text-blue-600'>75%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-3 mb-8">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500" style={{width: '75%'}}></div>
                      </div>

                      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div className='p-6 border border-emerald-200 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center gap-4 hover:shadow-lg transition-all duration-200'>
                          <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                            <CheckCircle className='w-5 h-5 text-white'/>
                          </div>
                          <div>
                            <p className='font-semibold text-slate-900'>Company Registration</p>
                            <p className='text-sm text-emerald-700 font-medium'>Completed</p>
                          </div>
                        </div>
                        <div className='p-6 border border-emerald-200 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center gap-4 hover:shadow-lg transition-all duration-200'>
                          <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                            <CheckCircle className='w-5 h-5 text-white'/>
                          </div>
                          <div>
                            <p className='font-semibold text-slate-900'>Business License</p>
                            <p className='text-sm text-emerald-700 font-medium'>Completed</p>
                          </div>
                        </div>
                        <div className='p-6 border border-emerald-200 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center gap-4 hover:shadow-lg transition-all duration-200'>
                          <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                            <CheckCircle className='w-5 h-5 text-white'/>
                          </div>
                          <div>
                            <p className='font-semibold text-slate-900'>KYC Verification</p>
                            <p className='text-sm text-emerald-700 font-medium'>Completed</p>
                          </div>
                        </div>
                        <div className='p-6 border border-amber-200 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 flex items-center gap-4 hover:shadow-lg transition-all duration-200'>
                          <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
                            <Clock className='w-5 h-5 text-white'/>
                          </div>
                          <div>
                            <p className='font-semibold text-slate-900'>Address Verification</p>
                            <p className='text-sm text-amber-700 font-medium'>Pending</p>
                          </div>
                        </div>
                      </div>
                    </div>
                </Card>
            )}
          </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
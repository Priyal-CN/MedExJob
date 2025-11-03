import React, { useState, useEffect } from 'react';
import { BarChart, Briefcase, Users, Building2, Bell, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';
import { NotificationBadge } from './NotificationBadge';
import { getPendingVerificationCount } from '../api/employers';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const navigate = useNavigate();
  const [pendingVerifications, setPendingVerifications] = useState(0);

  // Load pending verification count
  useEffect(() => {
    const loadPendingCount = async () => {
      try {
        const data = await getPendingVerificationCount();
        setPendingVerifications(data.count);
      } catch (error) {
        console.error('Error loading pending verifications:', error);
        // Fallback to 0 if API fails
        setPendingVerifications(0);
      }
    };

    loadPendingCount();
    
    // Refresh every 30 seconds
    const interval = setInterval(loadPendingCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const adminCards = [
    {
      title: 'Manage Jobs',
      description: 'View, create, edit, and delete job postings.',
      icon: <Briefcase className="w-8 h-8 text-blue-600" />,
      action: () => onNavigate('admin-jobs'),
    },
    {
      title: 'Manage Users',
      description: 'Oversee candidate and employer accounts.',
      icon: <Users className="w-8 h-8 text-green-600" />,
      action: () => onNavigate('admin-users'),
    },
    {
      title: 'Employer Verification',
      description: 'Review and approve employer verification requests.',
      icon: <Building2 className="w-8 h-8 text-purple-600" />,
      action: () => onNavigate('admin-employer-verification'),
    },
    {
      title: 'Manage Applications',
      description: 'Review and manage job applications from candidates.',
      icon: <Briefcase className="w-8 h-8 text-purple-600" />,
      action: () => onNavigate('admin-applications'),
    },
    {
      title: 'Site Analytics',
      description: 'Monitor platform performance and job statistics.',
      icon: <BarChart className="w-8 h-8 text-orange-600" />,
      action: () => onNavigate('analytics'),
    },
    {
      title: 'Notifications & Alerts',
      description: 'Send global notifications or manage system alerts.',
      icon: <Bell className="w-8 h-8 text-red-600" />,
      action: () => onNavigate('notifications'),
    },
    {
      title: 'Settings',
      description: 'Configure platform-wide settings and parameters.',
      icon: <Settings className="w-8 h-8 text-gray-600" />,
      action: () => onNavigate('admin-settings'),
    },
  ];

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="flex justify-between items-center py-8">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Settings className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                  <p className="text-sm text-gray-600">Manage your MedExJob.com platform</p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                {/* <NotificationBadge 
                  count={pendingVerifications}
                  onClick={() => onNavigate('verification-notifications')}
                /> */}
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <Button 
                variant="outline" 
                onClick={() => navigate('/home')}
                className="border-blue-300 text-blue-700 hover:bg-blue-50 px-8 py-3 rounded-lg font-medium"
              >
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-200 p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome, Administrator!</h2>
              <p className="text-lg text-gray-600 mb-4">
                Manage your MedExJob.com platform efficiently with the tools below.
              </p>
              {pendingVerifications > 0 && (
                <div 
                  onClick={() => onNavigate('admin-employer-verification')}
                  className="bg-amber-50 border border-amber-200 rounded-xl p-4 max-w-md cursor-pointer hover:bg-amber-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-amber-600" />
                    <div>
                      <p className="font-medium text-amber-800">
                        {pendingVerifications} verification request{pendingVerifications > 1 ? 's' : ''} pending review
                      </p>
                      <p className="text-sm text-amber-700">Click the notification bell to review them</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div 
              onClick={() => pendingVerifications > 0 && onNavigate('admin-employer-verification')}
              className={`text-right ${pendingVerifications > 0 ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
            >
              <div className="text-3xl font-bold text-blue-600">{pendingVerifications}</div>
              <div className="text-sm text-gray-600">Pending Reviews</div>
            </div>
          </div>
        </div>

        {/* Admin Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminCards.map((card, index) => (
            <Card key={index} className="p-6 hover:shadow-xl transition-all duration-300 border border-blue-200 bg-white">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  {card.icon}
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Admin Tool
                </Badge>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{card.title}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{card.description}</p>
              <Button 
                onClick={card.action} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
              >
                Access {card.title}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import { Mail, Lock, User, Phone, Building2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useLocation, useNavigate } from 'react-router-dom';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { useAuth } from '../contexts/AuthContext';
import { testRoleNavigation } from '../utils/roleNavigation';

interface AuthPageProps {
  mode: 'login' | 'register';
  onNavigate: (page: string, role?: string) => void;
}

export function AuthPage({ mode, onNavigate }: AuthPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();
  const [userRole, setUserRole] = useState<'candidate' | 'employer' | 'admin'>('candidate');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // This effect handles success messages passed via navigation state
  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
      // Clear the state from history so the message doesn't reappear on back/forward
      navigate(location.pathname, { replace: true, state: {} });
    } else if (mode === 'login') {
        const flag = localStorage.getItem('registrationSuccess');
        if (flag) {
            setSuccessMessage('Registration successful! Please log in to continue.');
            localStorage.removeItem('registrationSuccess');
        }
    }
  }, [mode, location, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const loggedInUser = await login(email, password);
      // If there's a redirect path from location state, use it
      if (location.state?.from?.pathname) {
        navigate(location.state.from.pathname, { replace: true });
      } else {
        // Navigate directly to the correct dashboard based on the logged-in user's role
        // Get role and normalize to uppercase for comparison
        const userRole = loggedInUser.role ? String(loggedInUser.role).toUpperCase() : '';
        
        // Debug logging
        console.log('Login successful - User data:', loggedInUser);
        console.log('Detected role:', userRole);
        console.log('Role comparison - ADMIN:', userRole === 'ADMIN');
        console.log('Role comparison - EMPLOYER:', userRole === 'EMPLOYER');
        console.log('Role comparison - CANDIDATE:', userRole === 'CANDIDATE');
        
        // Test role navigation
        const expectedPath = testRoleNavigation(userRole);
        console.log('Expected navigation path:', expectedPath);
        
        // Navigate based on role - ensure exact match with fallback
        if (userRole === 'ADMIN') {
          console.log('✅ Navigating to ADMIN dashboard');
          navigate('/dashboard/admin', { replace: true });
        } else if (userRole === 'EMPLOYER') {
          console.log('✅ Navigating to EMPLOYER dashboard');
          // Check if employer is verified
          if (!loggedInUser.isVerified) {
            console.log('Employer not verified, going to verification pending');
            navigate('/verification-pending', { 
              replace: true,
              state: { 
                message: 'Your account is pending verification. Admin will verify within 24 hours.',
                user: loggedInUser
              }
            });
          } else {
            console.log('Employer verified, going to employer dashboard');
            navigate('/dashboard/employer', { replace: true });
          }
        } else if (userRole === 'CANDIDATE') {
          console.log('✅ Navigating to CANDIDATE dashboard');
          navigate('/dashboard/candidate', { replace: true });
        } else {
          console.log('❌ Unknown role, defaulting to candidate dashboard. Role was:', userRole);
          // Default to candidate dashboard for unknown roles
          navigate('/dashboard/candidate', { replace: true });
        }
      }
    } catch (err: any) {
      setErrors({ form: err.message || 'Login failed. Please check your credentials.' });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const formData = new FormData(e.target as HTMLFormElement);
    const userData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      password: formData.get('password') as string,
      role: userRole,
      ...(userRole === 'employer' && { companyName: formData.get('company') as string })
    };

    try {
      const registeredUser = await register(userData);
      // For candidates and admins, skip Aadhaar verification and go directly to login
      if (userRole === 'candidate' || userRole === 'admin') {
        localStorage.setItem('registrationSuccess', 'true');
        navigate('/login');
      } else {
        // For employers, redirect to Aadhaar verification page with the new user's ID
        navigate('/aadhaar-verification', { 
          state: { 
            employerId: registeredUser.id, 
            email: userData.email,
            name: userData.name,
            companyName: userData.companyName
          } 
        });
      }
    } catch (err: any) {
      // Handle specific error cases
      if (err.message && (err.message.includes('already registered') || err.message.includes('Please login instead'))) {
        // For all users with existing email, show helpful message with login option
        setErrors({ 
          form: 'This email is already registered. Please login instead.',
          loginHint: 'Click here to login with your existing account'
        });
      } else if (err.errors) {
        // Handle structured validation errors from the backend
        setErrors(err.errors);
      } else {
        setErrors({ form: err.message || 'An unknown registration error occurred.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl text-blue-600 mb-2">MedExJob.com</h1>
          <p className="text-gray-600">
            {mode === 'login' ? 'Welcome back!' : 'Create your account'}
          </p>
        </div>

        <Tabs value={mode} onValueChange={(value) => {
          if (value === 'login') {
            onNavigate('login');
          } else if (value === 'register') {
            onNavigate('register');
          }
        }} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4 mt-6">
            {successMessage && (
              <div className="text-green-700 bg-green-100 border border-green-200 rounded px-3 py-2 text-sm">
                {successMessage}
              </div>
            )}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label>Login as</Label>
                <RadioGroup value={userRole} onValueChange={(value) => setUserRole(value as 'candidate' | 'employer' | 'admin')} className="mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="candidate" id="candidate-login" />
                    <Label htmlFor="candidate-login" className="cursor-pointer">Candidate</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="employer" id="employer-login" />
                    <Label htmlFor="employer-login" className="cursor-pointer">Employer</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="admin" id="admin-login" />
                    <Label htmlFor="admin-login" className="cursor-pointer">Admin</Label>
                  </div>
                </RadioGroup>
              </div>

              {errors.form && <p className="text-red-500 text-sm">{errors.form}</p>}
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </Button>

              <div className="text-center">
                <button type="button" className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="register" className="space-y-4 mt-6">
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <Label>I want to register as</Label>
                <RadioGroup value={userRole} onValueChange={(value) => setUserRole(value as 'candidate' | 'employer' | 'admin')} className="mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="candidate" id="candidate-register" />
                    <Label htmlFor="candidate-register" className="cursor-pointer">
                      Candidate (Doctor/Nurse/Paramedic)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="employer" id="employer-register" />
                    <Label htmlFor="employer-register" className="cursor-pointer">
                      Employer (Hospital/Consultancy)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="admin" id="admin-register" />
                    <Label htmlFor="admin-register" className="cursor-pointer">
                      Admin
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="name">Full Name {userRole === 'employer' && '/ Contact Person'}</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    className="pl-10"
                    required
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
              </div>

              {userRole === 'employer' && (
                <div>
                  <Label htmlFor="company">Company/Hospital Name</Label>
                  <div className="relative mt-1">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="company"
                      name="company"
                      type="text"
                      placeholder="Enter company name"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    className="pl-10"
                    required
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="email-register">Email</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email-register"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    className="pl-10"
                    required
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="password-register">Password</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="password-register"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    required
                  />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>
              </div>

              {errors.form && (
                <div className="text-center">
                  <p className="text-red-500 text-sm mb-2">{errors.form}</p>
                  {errors.loginHint && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => onNavigate('login')}
                      className="text-sm"
                    >
                      {errors.loginHint}
                    </Button>
                  )}
                </div>
              )}
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>

              <p className="text-xs text-center text-gray-500">
                By registering, you agree to our Terms & Conditions and Privacy Policy
              </p>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}

import { useState } from 'react';
import { Mail, Lock, User, Phone, Building2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

interface AuthPageProps {
  mode: 'login' | 'register';
  onNavigate: (page: string, role?: string) => void;
}

export function AuthPage({ mode, onNavigate }: AuthPageProps) {
  const [userRole, setUserRole] = useState<'candidate' | 'employer'>('candidate');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would authenticate the user
    onNavigate('dashboard', userRole);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would create a new user account
    onNavigate('dashboard', userRole);
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

        <Tabs defaultValue={mode} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" onClick={() => onNavigate('login')}>Login</TabsTrigger>
            <TabsTrigger value="register" onClick={() => onNavigate('register')}>Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4 mt-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
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
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label>Login as</Label>
                <RadioGroup value={userRole} onValueChange={(value) => setUserRole(value as 'candidate' | 'employer')} className="mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="candidate" id="candidate-login" />
                    <Label htmlFor="candidate-login" className="cursor-pointer">Candidate</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="employer" id="employer-login" />
                    <Label htmlFor="employer-login" className="cursor-pointer">Employer</Label>
                  </div>
                </RadioGroup>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Login
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
                <RadioGroup value={userRole} onValueChange={(value) => setUserRole(value as 'candidate' | 'employer')} className="mt-2">
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
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="name">Full Name {userRole === 'employer' && '/ Contact Person'}</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {userRole === 'employer' && (
                <div>
                  <Label htmlFor="company">Company/Hospital Name</Label>
                  <div className="relative mt-1">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="company"
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
                    type="tel"
                    placeholder="+91 98765 43210"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email-register">Email</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email-register"
                    type="email"
                    placeholder="your.email@example.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password-register">Password</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="password-register"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Create Account
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

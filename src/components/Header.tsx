import { Bell, User, Menu, Briefcase } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isAuthenticated: boolean;
  userRole?: 'admin' | 'employer' | 'candidate';
}

export function Header({ currentPage, onNavigate, isAuthenticated, userRole }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl text-blue-600">MedExJob.com</h1>
              <p className="text-xs text-gray-500">Medical Excellence Jobs</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => onNavigate('home')}
              className={`transition-colors ${
                currentPage === 'home' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('jobs')}
              className={`transition-colors ${
                currentPage === 'jobs' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              All Jobs
            </button>
            <button
              onClick={() => onNavigate('govt-jobs')}
              className={`transition-colors ${
                currentPage === 'govt-jobs' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Government Jobs
            </button>
            <button
              onClick={() => onNavigate('private-jobs')}
              className={`transition-colors ${
                currentPage === 'private-jobs' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Private Jobs
            </button>
            <button
              onClick={() => onNavigate('about')}
              className={`transition-colors ${
                currentPage === 'about' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              About
            </button>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500">
                    3
                  </Badge>
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onNavigate('dashboard')}>
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onNavigate('profile')}>
                      Profile
                    </DropdownMenuItem>
                    {userRole === 'employer' && (
                      <DropdownMenuItem onClick={() => onNavigate('subscription')}>
                        Subscription
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onNavigate('login')}>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => onNavigate('login')}>
                  Login
                </Button>
                <Button onClick={() => onNavigate('register')} className="bg-blue-600 hover:bg-blue-700">
                  Register
                </Button>
              </>
            )}

            {/* Mobile Menu */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

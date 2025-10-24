import { useState, useEffect } from 'react';
import { Search, TrendingUp, Shield, Users, ChevronRight, MapPin, Briefcase as BriefcaseIcon, Building2, UserCheck } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { JobCard } from './JobCard';
import { fetchJobs, fetchJobsMeta } from '../api/jobs';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HomePageProps {
  onNavigate: (page: string, jobId?: string) => void;
}

// Custom hook for animated counter
function useCounter(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return count;
}

function StatCard({ icon: Icon, end, label, suffix = '' }: { icon: any, end: number, label: string, suffix?: string }) {
  const count = useCounter(end);
  
  return (
    <div className="text-center transform hover:scale-105 transition-transform duration-300">
      <div className="flex items-center justify-center mb-2">
        <Icon className="w-8 h-8 text-blue-600 mr-2" />
        <div className="text-4xl text-blue-600">{count.toLocaleString()}{suffix}</div>
      </div>
      <div className="text-gray-600">{label}</div>
    </div>
  );
}

export function HomePage({ onNavigate }: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState<any[]>([]);
  const [governmentJobs, setGovernmentJobs] = useState<any[]>([]);
  const [privateJobs, setPrivateJobs] = useState<any[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [categories, setCategories] = useState<{ name: string; icon: string; color: string }[]>([]);

  useEffect(() => {
    // Load featured, government, private jobs
    (async () => {
      try {
        const [feat, gov, priv, meta] = await Promise.all([
          fetchJobs({ featured: true, size: 4 }).then(r => r.content ?? r.content),
          fetchJobs({ sector: 'government', size: 3 }).then(r => r.content ?? r.content),
          fetchJobs({ sector: 'private', size: 3 }).then(r => r.content ?? r.content),
          fetchJobsMeta(),
        ]);
        setFeaturedJobs(feat || []);
        setGovernmentJobs(gov || []);
        setPrivateJobs(priv || []);
        const locs: string[] = Array.isArray(meta?.locations) ? meta.locations : [];
        setLocations(locs);
        const cats: string[] = Array.isArray(meta?.categories) ? meta.categories : [];
        setCategories(
          cats.map((c, i) => ({
            name: c,
            icon: ['👨‍⚕️','👩‍⚕️','⚕️','🏥','🩺','🌿','🧑‍⚕️'][i % 7],
            color: ['from-blue-500 to-blue-600','from-green-500 to-green-600','from-purple-500 to-purple-600','from-red-500 to-red-600','from-pink-500 to-pink-600','from-emerald-500 to-emerald-600','from-indigo-500 to-indigo-600'][i % 7]
          }))
        );
      } catch (e) {
        // silent fail for homepage
        setFeaturedJobs([]);
        setGovernmentJobs([]);
        setPrivateJobs([]);
        setLocations([]);
        setCategories([]);
      }
    })();
  }, []);

  const handleSearch = () => {
    onNavigate('jobs');
  };

  const handleCategoryClick = (category: string) => {
    // In a real app, this would filter by category
    onNavigate('jobs');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Better Visible Background */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white py-24 overflow-hidden">
        {/* Background Image with Better Visibility */}
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1666886573590-5815157da865?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwaGVhbHRoY2FyZSUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NjAzNzY2MDB8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Medical professionals"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/70 via-blue-700/70 to-blue-900/70"></div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* <div className="inline-block mb-4 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 animate-fade-in">
              <span className="text-sm"></span>
            </div> */}
            
            <h1 className="text-5xl md:text-6xl mb-6 animate-fade-in-up">
              Find Your Dream Medical Career
            </h1>
            <p className="text-xl text-blue-100 mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              India's Premier Job Portal for Doctors, Nurses & Paramedical Professionals
            </p>

            {/* Enhanced Search Bar */}
            <div className="bg-white rounded-xl p-3 shadow-2xl animate-fade-in-up hover:shadow-3xl transition-shadow duration-300" style={{ animationDelay: '0.4s' }}>
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Job title, keywords, or company"
                    className="pl-10 border-0 focus-visible:ring-0 text-gray-900 h-12"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger className="pl-10 border-0 focus:ring-0 text-gray-900 h-12">
                      <SelectValue placeholder="Select Location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 px-8 h-12 transform hover:scale-105 transition-transform"
                  onClick={handleSearch}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search Jobs
                </Button>
              </div>
            </div>

            {/* Interactive Category Badges */}
            <div className="mt-8 flex flex-wrap justify-center gap-3 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              {categories.map((category, index) => (
                <button
                  key={category.name}
                  onClick={() => handleCategoryClick(category.name)}
                  className="group relative overflow-hidden"
                  style={{ animationDelay: `${0.7 + index * 0.1}s` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  <Badge className="relative bg-white/20 hover:bg-transparent border-white/30 backdrop-blur-sm cursor-pointer transition-all duration-300 text-white px-4 py-2 transform group-hover:scale-110 group-hover:shadow-lg">
                    <span className="mr-2">{category.icon}</span>
                    {category.name}
                  </Badge>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Animated Stats Section */}
      <section className="py-16 bg-white border-b relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard icon={BriefcaseIcon} end={5000} label="Active Jobs" suffix="+" />
            <StatCard icon={Building2} end={2000} label="Hospitals" suffix="+" />
            <StatCard icon={Users} end={50000} label="Candidates" suffix="+" />
            <StatCard icon={UserCheck} end={10000} label="Placements" suffix="+" />
          </div>
        </div>
      </section>

      {/* Featured Jobs with Animations */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl text-gray-900 mb-2">Featured Jobs</h2>
              <p className="text-gray-600">Top opportunities handpicked for you</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => onNavigate('jobs')}
              className="group hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300"
            >
              View All 
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {featuredJobs.map((job, index) => (
              <div 
                key={job.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <JobCard
                  job={job}
                  onViewDetails={(jobId) => onNavigate('job-detail', jobId)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Government & Private Jobs Split with Hover Effects */}
      <section className="py-16 bg-gray-100 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-green-100 rounded-full blur-3xl opacity-20"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Government Jobs */}
            <div className="transform hover:scale-[1.02] transition-transform duration-300">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl text-gray-900 flex items-center">
                    <span className="w-2 h-8 bg-blue-600 rounded-full mr-3"></span>
                    Government Jobs
                  </h2>
                  <p className="text-sm text-gray-600 ml-5 mt-1">Official government vacancies</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300"
                  onClick={() => onNavigate('govt-jobs')}
                >
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                {governmentJobs.map((job, index) => (
                  <Card 
                    key={job.id} 
                    className="p-5 hover:shadow-lg transition-all duration-300 cursor-pointer group border-l-4 border-l-blue-600 animate-fade-in-right" 
                    onClick={() => onNavigate('job-detail', job.id)}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200 mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors" variant="outline">
                      Government
                    </Badge>
                    <h3 className="text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 flex items-center">
                      <Building2 className="w-4 h-4 mr-2" />
                      {job.organization}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {job.location}
                      </span>
                      <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">{job.numberOfPosts} Posts</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Private Jobs */}
            <div className="transform hover:scale-[1.02] transition-transform duration-300">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl text-gray-900 flex items-center">
                    <span className="w-2 h-8 bg-green-600 rounded-full mr-3"></span>
                    Private Jobs
                  </h2>
                  <p className="text-sm text-gray-600 ml-5 mt-1">Top hospitals & healthcare providers</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-all duration-300"
                  onClick={() => onNavigate('private-jobs')}
                >
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                {privateJobs.map((job, index) => (
                  <Card 
                    key={job.id} 
                    className="p-5 hover:shadow-lg transition-all duration-300 cursor-pointer group border-l-4 border-l-green-600 animate-fade-in-left" 
                    onClick={() => onNavigate('job-detail', job.id)}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Badge className="bg-green-100 text-green-700 border-green-200 mb-3 group-hover:bg-green-600 group-hover:text-white transition-colors" variant="outline">
                      Private
                    </Badge>
                    <h3 className="text-lg text-gray-900 mb-2 group-hover:text-green-600 transition-colors">{job.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 flex items-center">
                      <Building2 className="w-4 h-4 mr-2" />
                      {job.organization}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {job.location}
                      </span>
                      <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">{job.salary}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us - More Interactive */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl text-gray-900 mb-3">Why Choose MedExJob.com?</h2>
            <p className="text-gray-600">Your trusted partner in medical career advancement</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-t-4 border-t-blue-600">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-blue-600 transition-all duration-300">
                <Shield className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">Verified Employers</h3>
              <p className="text-gray-600">All employers are verified to ensure authentic job postings</p>
            </Card>

            <Card className="p-8 text-center group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-t-4 border-t-green-600">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-green-600 transition-all duration-300">
                <TrendingUp className="w-8 h-8 text-green-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl text-gray-900 mb-2 group-hover:text-green-600 transition-colors">Latest Opportunities</h3>
              <p className="text-gray-600">Get instant alerts for the latest government and private jobs</p>
            </Card>

            <Card className="p-8 text-center group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-t-4 border-t-purple-600">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-purple-600 transition-all duration-300">
                <Users className="w-8 h-8 text-purple-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">Direct Applications</h3>
              <p className="text-gray-600">Apply directly and track your application status in real-time</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section with Animation */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl mb-4 animate-fade-in-up">Ready to Start Your Medical Career?</h2>
          <p className="text-xl text-blue-100 mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>Join thousands of medical professionals who found their dream jobs</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
              onClick={() => onNavigate('register')}
            >
              Register as Candidate
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-300"
              onClick={() => onNavigate('register')}
            >
              Register as Employer
            </Button>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fade-in-left {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
          animation-fill-mode: both;
        }

        .animate-fade-in-right {
          animation: fade-in-right 0.6s ease-out;
          animation-fill-mode: both;
        }

        .animate-fade-in-left {
          animation: fade-in-left 0.6s ease-out;
          animation-fill-mode: both;
        }
      `}</style>
    </div>
  );
}

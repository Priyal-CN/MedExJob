import React, { useState, useEffect, useRef } from 'react';
import { Search, TrendingUp, Shield, Users, ChevronRight, MapPin, Briefcase as BriefcaseIcon, Building2, UserCheck, ChevronLeft, Flame, FileText, Award, Zap, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { JobCard } from './JobCard';
import { fetchJobs, fetchJobsMeta } from '../api/jobs';
import { fetchAnalyticsOverview } from '../api/analytics';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { notifySavedJobsChanged } from '../utils/savedJobsEvents';

interface HomePageProps {
  onNavigate: (page: string, jobId?: string) => void;
}

// Custom hook for animated counter with easing
function useCounter(end: number, duration: number = 2000, shouldStart: boolean = true) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!shouldStart) return;
    
    let startTime: number;
    let animationFrame: number;

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      
      setCount(Math.floor(eased * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, shouldStart]);

  return count;
}

// Custom hook for intersection observer
function useInView(options?: IntersectionObserverInit) {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
      }
    }, { threshold: 0.1, ...options });

    observer.observe(ref);

    return () => observer.disconnect();
  }, [ref, options]);

  return { ref: setRef as (instance: HTMLElement | null) => void, isInView };
}

function StatCard({ 
  icon: Icon, 
  end, 
  label, 
  suffix = '', 
  index,
  isVisible 
}: { 
  icon: any, 
  end: number, 
  label: string, 
  suffix?: string,
  index: number,
  isVisible: boolean
}) {
  const count = useCounter(end, 2500, isVisible);
  const [isClicked, setIsClicked] = React.useState(false);
  
  // Format number with K for thousands
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace('.0', '') + 'K';
    }
    return num.toString();
  };
  
  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 600);
  };
  
  return (
    <div 
      onClick={handleClick}
      className={`text-center transform transition-all duration-700 relative overflow-hidden ${
        isVisible 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-8 scale-95'
      } hover:scale-110 hover:shadow-lg rounded-lg p-4 bg-white/50 backdrop-blur-sm cursor-pointer group ${isClicked ? 'border-click-animation' : ''}`}
      style={{ 
        transitionDelay: `${index * 100}ms`,
        animation: isVisible ? 'pulse 2s ease-in-out infinite' : 'none'
      }}
    >
      {/* Animated Gradient Border on Hover */}
      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div 
          className="absolute inset-0 rounded-lg border-2"
          style={{
            background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #3b82f6)',
            backgroundSize: '200% 100%',
            animation: 'border-shimmer 2s ease-in-out infinite',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            padding: '2px',
          }}
        ></div>
      </div>
      
      {/* Pulsing Border Animation When Visible */}
      {isVisible && (
        <div 
          className="absolute inset-0 rounded-lg border-2 border-blue-400 opacity-30 pointer-events-none"
          style={{
            animation: `border-pulse 2s ease-in-out infinite`,
            animationDelay: `${index * 200}ms`
          }}
        ></div>
      )}
      
      {/* Static Border with Hover Effect */}
      <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-blue-300 transition-all duration-300"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center mb-2">
        <div className="relative">
          <Icon className="w-10 h-10 text-blue-600 mb-3 transform group-hover:rotate-12 transition-transform duration-300 group-hover:scale-110" />
          <div className="absolute inset-0 bg-blue-200 rounded-full opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
        </div>
        <div className="text-5xl font-bold text-blue-600 mb-2 transform group-hover:text-blue-700 transition-colors duration-300">
          {formatNumber(count)}{suffix}
        </div>
      </div>
      <div className="relative z-10 text-gray-700 font-medium text-sm uppercase tracking-wide group-hover:text-blue-600 transition-colors duration-300">
        {label}
      </div>
    </div>
  );
}

// Quick Stat Card Component for the stats bar
function QuickStatCard({ 
  value, 
  label, 
  color,
  index,
  isVisible 
}: { 
  value: number, 
  label: string, 
  color: 'blue' | 'green' | 'purple' | 'orange',
  index: number,
  isVisible: boolean
}) {
  const count = useCounter(value, 2500, isVisible);
  
  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600'
  };
  
  // Format number with K for thousands
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace('.0', '') + 'K';
    }
    return num.toString();
  };
  
  return (
    <div 
      className={`text-center p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200 transform transition-all duration-700 hover:scale-105 hover:shadow-md ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-4'
      }`}
      style={{ 
        transitionDelay: `${index * 150}ms`
      }}
    >
      <div className={`text-2xl font-bold ${colorClasses[color]}`}>
        {formatNumber(count)}+
      </div>
      <div className="text-xs text-gray-600 mt-1">{label}</div>
    </div>
  );
}

// Trending Searches Component
function TrendingSearches({ 
  onSearchClick 
}: { 
  onSearchClick: (searchTerm: string) => void;
}) {
  const trendingSearches = [
    'Cardiologist',
    'Pediatrician',
    'Orthopedic Surgeon',
    'Anesthesiologist',
    'Emergency Medicine',
    'Radiologist',
    'Gynecologist',
    'Neurologist',
    'Oncologist',
    'Psychiatrist'
  ];

  return (
    <div 
      className="mt-6 animate-fade-in-up"
      style={{ animationDelay: '0.5s' }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Flame className="w-5 h-5 text-orange-400" />
        <span className="text-sm text-blue-100 font-medium">Trending Searches</span>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {trendingSearches.map((search, index) => (
          <button
            key={search}
            onClick={() => onSearchClick(search)}
            className="group bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/40 rounded-full px-4 py-2 text-sm text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            style={{ animationDelay: `${0.6 + index * 0.05}s` }}
          >
            {search}
          </button>
        ))}
      </div>
    </div>
  );
}

// Category Slider Component with smooth auto-scrolling
function CategorySlider({ 
  categories, 
  onCategoryClick 
}: { 
  categories: { name: string; icon: string; color: string }[]; 
  onCategoryClick: (category: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  
  useEffect(() => {
    if (!scrollRef.current || categories.length === 0) return;

    const scrollContainer = scrollRef.current;
    let scrollPosition = 0;
    const scrollSpeed = 0.3; // Very slow speed for smooth transition (pixels per frame)
    let animationId: number;

    const animate = () => {
      if (!scrollRef.current) return;
      
      if (!isPaused) {
        scrollPosition += scrollSpeed;
        
        // Calculate when to loop back
        const containerWidth = scrollContainer.clientWidth;
        const scrollWidth = scrollContainer.scrollWidth;
        const singleSetWidth = scrollWidth / 3; // Since we duplicate 3 times
        
        // Reset smoothly when one complete set has scrolled
        if (scrollPosition >= singleSetWidth) {
          scrollPosition = 0;
        }
        
        scrollContainer.scrollLeft = scrollPosition;
      }
      
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [categories, isPaused]);

  // Duplicate categories 3 times for seamless infinite loop
  const duplicatedCategories = categories.length > 0 
    ? [...categories, ...categories, ...categories]
    : [];

  if (categories.length === 0) {
    return null;
  }

  return (
    <div 
      className="mt-8 relative animate-fade-in-up"
      style={{ animationDelay: '0.6s' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Left gradient fade */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-blue-700 via-blue-700 to-transparent z-10 pointer-events-none"></div>
      
      {/* Right gradient fade */}
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-blue-700 via-blue-700 to-transparent z-10 pointer-events-none"></div>
      
      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-hidden scrollbar-hide"
        style={{
          scrollBehavior: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {duplicatedCategories.map((category, index) => (
          <button
            key={`${category.name}-${index}`}
            onClick={() => onCategoryClick(category.name)}
            className="group relative overflow-hidden flex-shrink-0"
            style={{ 
              minWidth: '180px',
            }}
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full`}></div>
            <Badge className="relative bg-white/20 hover:bg-transparent border-white/30 backdrop-blur-sm cursor-pointer transition-all duration-300 text-white px-4 py-2 transform group-hover:scale-110 group-hover:shadow-lg whitespace-nowrap w-full justify-center">
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </Badge>
          </button>
        ))}
      </div>
      
    </div>
  );
}

// Function to get all Indian locations (cities, states, and union territories)
function getAllIndianLocations(): string[] {
  const locations = [
    // Major Metro Cities
    'New Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune',
    // Tier 1 & 2 Cities
    'Ahmedabad', 'Jaipur', 'Surat', 'Lucknow', 'Kanpur', 'Nagpur', 'Visakhapatnam',
    'Indore', 'Thane', 'Bhopal', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana',
    'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Varanasi', 'Srinagar',
    'Amritsar', 'Noida', 'Ranchi', 'Jabalpur', 'Gwalior', 'Coimbatore', 'Vijayawada',
    'Jodhpur', 'Madurai', 'Raipur', 'Kota', 'Guwahati', 'Chandigarh', 'Solapur',
    'Hubli', 'Dharwad', 'Mysore', 'Tiruchirappalli', 'Bareilly', 'Aligarh', 'Gorakhpur',
    'Bhubaneswar', 'Kochi', 'Kozhikode', 'Thiruvananthapuram', 'Dehradun', 'Mangalore',
    'Jamshedpur', 'Warangal', 'Salem', 'Tiruppur', 'Udaipur', 'Bikaner', 'Ajmer',
    'Asansol', 'Bhavnagar', 'Nanded', 'Kolhapur', 'Belgaum', 'Davangere', 'Gulbarga',
    'Jalandhar', 'Bathinda', 'Rohtak', 'Karnal', 'Panipat', 'Hisar', 'Sonipat',
    'Gurgaon', 'Greater Noida', 'Allahabad', 'Moradabad', 'Saharanpur', 'Muzaffarnagar',
    'Shahjahanpur', 'Firozabad', 'Mathura', 'Bulandshahr', 'Rampur', 'Amroha',
    'Bahraich', 'Barabanki', 'Unnao', 'Rae Bareli', 'Etawah', 'Amethi', 'Pratapgarh',
    'Jaunpur', 'Azamgarh', 'Mau', 'Ballia', 'Deoria', 'Gonda', 'Basti', 'Siddharthnagar',
    'Maharajganj', 'Kushinagar', 'Kheri', 'Hardoi', 'Sultanpur', 'Faizabad', 'Ayodhya',
    'Ambedkar Nagar', 'Shravasti', 'Balrampur', 'Sant Kabir Nagar', 'Ghazipur',
    'Chandauli', 'Mirzapur', 'Sonbhadra', 'Robertsganj', 'Bhadohi',
    // States
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
    'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    // Union Territories
    'Andaman and Nicobar Islands', 'Dadra and Nagar Haveli and Daman and Diu',
    'Lakshadweep', 'Delhi', 'Puducherry', 'Jammu and Kashmir', 'Ladakh'
  ];
  
  // Remove duplicates and sort alphabetically
  return [...new Set(locations)].sort();
}

export function HomePage({ onNavigate }: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState<any[]>([]);
  const [governmentJobs, setGovernmentJobs] = useState<any[]>([]);
  const [privateJobs, setPrivateJobs] = useState<any[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [categories, setCategories] = useState<{ name: string; icon: string; color: string }[]>([]);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [stats, setStats] = useState({
    activeJobs: 0,
    hospitals: 0,
    candidates: 0,
    placements: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);
  
  // Intersection observer for stats section
  const { ref: statsRef, isInView: statsInView } = useInView({ threshold: 0.2 });
  
  // Intersection observer for "All Jobs" section quick stats
  const { ref: allJobsStatsRef, isInView: allJobsStatsInView } = useInView({ threshold: 0.2 });

  useEffect(() => {
    // Load saved job IDs from localStorage
    const savedJobs = JSON.parse(localStorage.getItem('saved_jobs') || '[]');
    setSavedJobIds(savedJobs.map((j: any) => j.id));
    
    // Load featured, government, private jobs and stats
    (async () => {
      try {
        // First try with status: 'active'
        let [featRes, govRes, privRes, meta, analytics] = await Promise.all([
          fetchJobs({ featured: true, size: 4, status: 'active' }),
          fetchJobs({ sector: 'government', size: 3, status: 'active' }),
          fetchJobs({ sector: 'private', size: 3, status: 'active' }),
          fetchJobsMeta(),
          fetchAnalyticsOverview().catch(() => null)
        ]);
        let feat = featRes?.content || [];
        let gov = govRes?.content || [];
        let priv = privRes?.content || [];
        // Fallback without status if backend ignores/filters differently
        if (feat.length === 0) feat = (await fetchJobs({ featured: true, size: 4 }))?.content || [];
        if (gov.length === 0) gov = (await fetchJobs({ sector: 'government', size: 3 }))?.content || [];
        if (priv.length === 0) priv = (await fetchJobs({ sector: 'private', size: 3 }))?.content || [];

        setFeaturedJobs(feat);
        setGovernmentJobs(gov);
        setPrivateJobs(priv);
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

        // Set dynamic stats from analytics API
        if (analytics) {
          // Try to get active jobs count
          try {
            const activeJobsRes = await fetchJobs({ status: 'active', size: 1 });
            const activeJobsCount = activeJobsRes?.totalElements || analytics.totalJobs || 0;
            
            // Calculate stats
            const hospitals = analytics.totalEmployers || 0;
            const candidates = Math.max(0, (analytics.totalUsers || 0) - (analytics.totalEmployers || 0));
            const placements = analytics.totalApplications ? Math.floor(analytics.totalApplications * 0.2) : 0; // Estimate 20% success rate
            
            setStats({
              activeJobs: activeJobsCount,
              hospitals: hospitals,
              candidates: candidates > 0 ? candidates : analytics.totalUsers || 0,
              placements: placements > 0 ? placements : analytics.totalApplications || 0
            });
          } catch {
            // Fallback to analytics data
            setStats({
              activeJobs: analytics.totalJobs || 0,
              hospitals: analytics.totalEmployers || 0,
              candidates: analytics.totalUsers || 0,
              placements: analytics.totalApplications ? Math.floor(analytics.totalApplications * 0.2) : 0
            });
          }
        } else {
          // Fallback: try to get job counts directly
          try {
            const allJobsRes = await fetchJobs({ size: 1 });
            setStats({
              activeJobs: allJobsRes?.totalElements || 0,
              hospitals: 0,
              candidates: 0,
              placements: 0
            });
          } catch {
            // Keep defaults
          }
        }
      } catch (e) {
        // silent fail for homepage
        setFeaturedJobs([]);
        setGovernmentJobs([]);
        setPrivateJobs([]);
        setLocations([]);
        setCategories([]);
      } finally {
        setStatsLoading(false);
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
                    className="pl-10 border-0 focus-visible:ring-0 text-gray-900 h-12 bg-input-background"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-20 pointer-events-none" />
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger 
                      className="pl-10 border-0 focus-visible:ring-0 text-gray-900 h-12 bg-input-background shadow-none py-1 px-3 rounded-md data-[size=default]:h-12 [&_svg]:opacity-50 [&_svg]:text-gray-400"
                      style={{ 
                        boxShadow: 'none',
                        border: 'none',
                        outline: 'none',
                        paddingTop: '0.25rem',
                        paddingBottom: '0.25rem',
                        paddingLeft: '2.5rem'
                      }}
                    >
                      <SelectValue placeholder="Select Location" className="pl-0" />
                    </SelectTrigger>
                    <SelectContent 
                      className="!max-h-[300px] overflow-y-auto"
                      style={{ maxHeight: '300px' }}
                    >
                      {getAllIndianLocations().map((location) => (
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

            {/* Trending Searches */}
            <TrendingSearches onSearchClick={(searchTerm) => {
              setSearchQuery(searchTerm);
              handleSearch();
            }} />

            {/* Interactive Category Badges - Smooth Slider */}
            <CategorySlider categories={categories} onCategoryClick={handleCategoryClick} />
          </div>
        </div>
      </section>

      {/* Animated Stats Section - Right After Hero */}
      <section 
        ref={statsRef}
        className="py-16 relative overflow-hidden"
        style={{
          background: 'linear-gradient(to bottom, white 0%, rgba(239, 246, 255, 0.3) 50%, rgba(249, 250, 251, 0.5) 100%)'
        }}
      >
        {/* Decorative background with animated gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 via-purple-50/30 to-blue-50/20"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <StatCard 
              icon={BriefcaseIcon} 
              end={200} 
              label="Active Jobs" 
              suffix="+" 
              index={0}
              isVisible={statsInView && !statsLoading}
            />
            <StatCard 
              icon={Building2} 
              end={1000} 
              label="Hospitals" 
              suffix="+" 
              index={1}
              isVisible={statsInView && !statsLoading}
            />
            <StatCard 
              icon={Users} 
              end={200} 
              label="Candidates" 
              suffix="+" 
              index={2}
              isVisible={statsInView && !statsLoading}
            />
            <StatCard 
              icon={UserCheck} 
              end={10000} 
              label="Placements" 
              suffix="+" 
              index={3}
              isVisible={statsInView && !statsLoading}
            />
          </div>
        </div>
      </section>

      {/* All Jobs Section - Enhanced - Connected */}
      <section 
        ref={allJobsStatsRef}
        className="pt-8 pb-20 relative overflow-hidden"
        style={{
          background: 'linear-gradient(to bottom, rgba(249, 250, 251, 0.5) 0%, rgba(239, 246, 255, 0.3) 30%, rgba(249, 250, 251, 1) 100%)'
        }}
      >
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '3s' }}></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-200/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-200/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Header Section with Enhanced Styling */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 flex items-center justify-center gap-4">
              <BriefcaseIcon className="w-10 h-10 md:w-12 md:h-12 text-blue-600 flex-shrink-0" />
              <span>Explore All Job Opportunities</span>
            </h2>
            <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto px-4">
              Discover thousands of medical career opportunities across India
            </p>
            <div className="flex items-center justify-center gap-2 mt-6 mb-2 px-4 py-2 text-sm text-gray-500">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span>Updated daily • Verified employers • Fast applications</span>
            </div>
          </div>

          {/* Enhanced Job Category Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* View All Jobs Card */}
            <div 
              onClick={() => onNavigate('jobs')}
              className="group relative bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-2xl transform translate-x-8 -translate-y-8 group-hover:translate-x-12 group-hover:-translate-y-12 transition-transform duration-500"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full blur-xl transform -translate-x-8 translate-y-8 group-hover:-translate-x-12 group-hover:translate-y-12 transition-transform duration-500"></div>
              </div>
              
              {/* Animated Border on Hover */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div 
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.3), rgba(255,255,255,0.6), rgba(255,255,255,0.3))',
                    backgroundSize: '200% 100%',
                    animation: 'border-shimmer 2s ease-in-out infinite',
                    padding: '2px',
                  }}
                ></div>
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
                    <BriefcaseIcon className="w-8 h-8 text-white" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-white/80 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:scale-105 transition-transform duration-300">View All Jobs</h3>
                <p className="text-blue-100 text-sm mb-4 group-hover:text-white transition-colors duration-300">
                  Browse complete job listings across all categories and locations
                </p>
                <div className="flex items-center gap-2 text-white/90 group-hover:text-white transition-colors duration-300">
                  <FileText className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-sm font-medium">{stats.activeJobs > 0 ? `${stats.activeJobs.toLocaleString()}+` : '1000+'} Opportunities</span>
                </div>
              </div>
              
              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              
              {/* Click Ripple Effect */}
              <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-active:opacity-50 group-active:bg-white/20 transition-opacity duration-200"></div>
            </div>

            {/* Government Jobs Card */}
            <div 
              onClick={() => onNavigate('govt-jobs')}
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl border-2 border-blue-200 hover:border-blue-400 transform hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              {/* Decorative Accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-blue-400 group-hover:h-1.5 transition-all duration-300"></div>
              <div className="absolute top-4 right-4 w-20 h-20 bg-blue-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Animated Border on Hover */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-300 transition-all duration-500">
                <div 
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent)',
                    backgroundSize: '200% 100%',
                    animation: 'border-shimmer 2.5s ease-in-out infinite',
                  }}
                ></div>
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-sm group-hover:shadow-md">
                    <Shield className="w-8 h-8 text-blue-600 group-hover:text-blue-700 transition-colors duration-300" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 group-hover:scale-105 transition-all duration-300">Government Jobs</h3>
                <p className="text-gray-600 text-sm mb-4 group-hover:text-gray-700 transition-colors duration-300">
                  Secure government positions with excellent benefits and stability
                </p>
                <div className="flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
                  <Award className="w-4 h-4 text-blue-600 group-hover:scale-110 group-hover:text-blue-700 transition-all duration-300" />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors duration-300">Official Vacancies</span>
                </div>
              </div>
              
              {/* Click Ripple Effect */}
              <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-active:opacity-30 group-active:bg-blue-50 transition-opacity duration-200"></div>
            </div>

            {/* Private Jobs Card */}
            <div 
              onClick={() => onNavigate('private-jobs')}
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl border-2 border-green-200 hover:border-green-400 transform hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              {/* Decorative Accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-600 to-green-400 group-hover:h-1.5 transition-all duration-300"></div>
              <div className="absolute top-4 right-4 w-20 h-20 bg-green-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Animated Border on Hover */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-green-300 transition-all duration-500">
                <div 
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(34, 197, 94, 0.3), transparent)',
                    backgroundSize: '200% 100%',
                    animation: 'border-shimmer 2.5s ease-in-out infinite',
                  }}
                ></div>
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-sm group-hover:shadow-md">
                    <Building2 className="w-8 h-8 text-green-600 group-hover:text-green-700 transition-colors duration-300" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-green-600 group-hover:scale-105 transition-all duration-300">Private Jobs</h3>
                <p className="text-gray-600 text-sm mb-4 group-hover:text-gray-700 transition-colors duration-300">
                  Top-tier hospitals and healthcare organizations offering competitive packages
                </p>
                <div className="flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
                  <TrendingUp className="w-4 h-4 text-green-600 group-hover:scale-110 group-hover:text-green-700 transition-all duration-300" />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-green-600 transition-colors duration-300">Fast Growing Sector</span>
                </div>
              </div>
              
              {/* Click Ripple Effect */}
              <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-active:opacity-30 group-active:bg-green-50 transition-opacity duration-200"></div>
            </div>
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
              className="bg-white text-blue-600 hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl font-semibold"
              onClick={() => onNavigate('register')}
            >
              Register as Candidate
            </Button>
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl font-semibold"
              onClick={() => onNavigate('register')}
            >
              Register as Employer
            </Button>
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl font-semibold"
              onClick={() => onNavigate('register')}
            >
              Register as Admin
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

        @keyframes border-shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        @keyframes border-pulse {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.01);
          }
        }

        .border-click-animation {
          animation: border-click-ripple 0.6s ease-out;
        }

        @keyframes border-click-ripple {
          0% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
            border-color: transparent;
          }
          50% {
            box-shadow: 0 0 0 10px rgba(59, 130, 246, 0.3);
            border-color: rgba(59, 130, 246, 0.5);
          }
          100% {
            box-shadow: 0 0 0 20px rgba(59, 130, 246, 0);
            border-color: transparent;
          }
        }
      `}</style>
    </div>
  );
}

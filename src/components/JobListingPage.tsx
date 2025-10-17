import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { JobCard } from './JobCard';
import { FilterSidebar, FilterOptions } from './FilterSidebar';
import { mockJobs } from '../data/mockData';
import { Job } from '../types';

interface JobListingPageProps {
  onNavigate: (page: string, jobId?: string) => void;
  sector?: 'government' | 'private';
}

export function JobListingPage({ onNavigate, sector }: JobListingPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    sectors: sector ? [sector] : [],
    categories: [],
    locations: [],
    featured: false
  });

  const filteredJobs = mockJobs.filter((job: Job) => {
    // Search filter
    const matchesSearch = !searchQuery || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());

    // Sector filter
    const matchesSector = filters.sectors.length === 0 || filters.sectors.includes(job.sector);

    // Category filter
    const matchesCategory = filters.categories.length === 0 || filters.categories.includes(job.category);

    // Location filter
    const matchesLocation = filters.locations.length === 0 || 
      filters.locations.some(loc => job.location.includes(loc));

    // Featured filter
    const matchesFeatured = !filters.featured || job.featured;

    return matchesSearch && matchesSector && matchesCategory && matchesLocation && matchesFeatured;
  });

  const title = sector === 'government' ? 'Government Jobs' : sector === 'private' ? 'Private Jobs' : 'All Jobs';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl text-gray-900 mb-4">{title}</h1>
          
          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by job title, organization, or location..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button>Search</Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="md:col-span-1">
            <FilterSidebar onFilterChange={setFilters} />
          </div>

          {/* Job Listings */}
          <div className="md:col-span-3">
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="space-y-4">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onViewDetails={(jobId) => onNavigate('job-detail', jobId)}
                  />
                ))
              ) : (
                <div className="text-center py-16">
                  <p className="text-gray-500 text-lg mb-4">No jobs found matching your criteria</p>
                  <Button variant="outline" onClick={() => setFilters({
                    sectors: [],
                    categories: [],
                    locations: [],
                    featured: false
                  })}>
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

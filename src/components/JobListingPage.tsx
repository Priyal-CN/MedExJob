import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { JobCard } from './JobCard';
import { FilterSidebar, FilterOptions } from './FilterSidebar';
import { fetchJobs, fetchJobsMeta } from '../api/jobs';
import { notifySavedJobsChanged } from '../utils/savedJobsEvents';

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
  const [jobs, setJobs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [metaCategories, setMetaCategories] = useState<string[]>([]);
  const [metaLocations, setMetaLocations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);

  useEffect(() => {
    // load meta on mount
    (async () => {
      try {
        const meta = await fetchJobsMeta();
        setMetaCategories(Array.isArray(meta?.categories) ? meta.categories : []);
        setMetaLocations(Array.isArray(meta?.locations) ? meta.locations : []);
      } catch {}
    })();
    
    // Load saved job IDs from localStorage
    const savedJobs = JSON.parse(localStorage.getItem('saved_jobs') || '[]');
    setSavedJobIds(savedJobs.map((j: any) => j.id));
  }, []);

  useEffect(() => {
    // fetch jobs on filters/search change
    (async () => {
      setLoading(true);
      try {
        const params: any = {
          search: searchQuery || undefined,
          sector: sector || filters.sectors[0], // Use sector prop if provided, otherwise use filter
          category: filters.categories[0],
          location: filters.locations[0],
          featured: filters.featured || undefined,
          status: 'active',
          size: 50,
        };
        let res = await fetchJobs(params);
        let content = res?.content || [];
        let total = res?.totalElements || 0;

        // Fallback: if no results with status filter, retry without it (handles backend variants)
        if (content.length === 0) {
          const { status, ...fallbackParams } = params;
          res = await fetchJobs(fallbackParams);
          content = res?.content || [];
          total = res?.totalElements || 0;
        }

        setJobs(content);
        setTotal(total);
      } catch {
        setJobs([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    })();
  }, [searchQuery, filters, sector]);

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
            <FilterSidebar onFilterChange={setFilters} categories={metaCategories} locations={metaLocations} />
          </div>

          {/* Job Listings */}
          <div className="md:col-span-3">
            <div className="mb-6">
              <p className="text-gray-600">
                {loading ? 'Loading jobs…' : `Showing ${jobs.length} of ${total} job${total !== 1 ? 's' : ''}`}
              </p>
            </div>

            <div className="space-y-4">
              {jobs.length > 0 ? (
                jobs.map((job: any) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onViewDetails={(jobId) => onNavigate('job-detail', jobId)}
                    onSaveJob={(jobId) => {
                      const savedJobs = JSON.parse(localStorage.getItem('saved_jobs') || '[]');
                      const exists = savedJobs.some((j: any) => j.id === jobId);
                      
                      if (exists) {
                        const updated = savedJobs.filter((j: any) => j.id !== jobId);
                        localStorage.setItem('saved_jobs', JSON.stringify(updated));
                        setSavedJobIds(updated.map((j: any) => j.id));
                      } else {
                        savedJobs.push(job);
                        localStorage.setItem('saved_jobs', JSON.stringify(savedJobs));
                        setSavedJobIds(savedJobs.map((j: any) => j.id));
                      }
                      notifySavedJobsChanged(); // Notify other components
                    }}
                    isSaved={savedJobIds.includes(job.id)}
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

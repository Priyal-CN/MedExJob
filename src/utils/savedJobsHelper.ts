/**
 * Helper utilities for managing saved jobs in localStorage
 */

const SAVED_JOBS_KEY = 'saved_jobs';

export interface SavedJob {
  id: string;
  title: string;
  organization: string;
  sector?: string;
  location?: string;
  [key: string]: any;
}

/**
 * Get all saved jobs from localStorage
 */
export function getSavedJobs(): SavedJob[] {
  try {
    const raw = localStorage.getItem(SAVED_JOBS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error('Error reading saved jobs:', error);
    return [];
  }
}

/**
 * Get IDs of all saved jobs
 */
export function getSavedJobIds(): string[] {
  return getSavedJobs().map(job => job.id);
}

/**
 * Check if a job is saved
 */
export function isJobSaved(jobId: string): boolean {
  return getSavedJobIds().includes(jobId);
}

/**
 * Save a job to localStorage
 */
export function saveJob(job: SavedJob): boolean {
  try {
    const savedJobs = getSavedJobs();
    
    // Check if job already exists
    if (savedJobs.some(j => j.id === job.id)) {
      console.log('Job already saved:', job.id);
      return false;
    }
    
    savedJobs.push(job);
    localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(savedJobs));
    console.log('Job saved:', job.id);
    return true;
  } catch (error) {
    console.error('Error saving job:', error);
    return false;
  }
}

/**
 * Remove a job from saved jobs
 */
export function unsaveJob(jobId: string): boolean {
  try {
    const savedJobs = getSavedJobs();
    const filtered = savedJobs.filter(job => job.id !== jobId);
    
    if (filtered.length === savedJobs.length) {
      console.log('Job not found in saved jobs:', jobId);
      return false;
    }
    
    localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(filtered));
    console.log('Job removed from saved:', jobId);
    return true;
  } catch (error) {
    console.error('Error removing saved job:', error);
    return false;
  }
}

/**
 * Toggle save status of a job
 */
export function toggleSaveJob(job: SavedJob): boolean {
  if (isJobSaved(job.id)) {
    unsaveJob(job.id);
    return false; // Now unsaved
  } else {
    saveJob(job);
    return true; // Now saved
  }
}

/**
 * Clear all saved jobs
 */
export function clearSavedJobs(): void {
  try {
    localStorage.removeItem(SAVED_JOBS_KEY);
    console.log('All saved jobs cleared');
  } catch (error) {
    console.error('Error clearing saved jobs:', error);
  }
}

/**
 * Get count of saved jobs
 */
export function getSavedJobsCount(): number {
  return getSavedJobs().length;
}

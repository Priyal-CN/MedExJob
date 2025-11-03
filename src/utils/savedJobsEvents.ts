/**
 * Custom event system for saved jobs changes
 * This allows components to notify each other when saved jobs are updated
 */

const SAVED_JOBS_CHANGE_EVENT = 'savedJobsChanged';

/**
 * Dispatch event when saved jobs are updated
 */
export function notifySavedJobsChanged() {
  console.log('Notifying saved jobs changed');
  window.dispatchEvent(new CustomEvent(SAVED_JOBS_CHANGE_EVENT));
}

/**
 * Listen for saved jobs changes
 */
export function onSavedJobsChanged(callback: () => void) {
  const handler = () => {
    console.log('Saved jobs changed event received');
    callback();
  };
  
  window.addEventListener(SAVED_JOBS_CHANGE_EVENT, handler);
  
  // Return cleanup function
  return () => window.removeEventListener(SAVED_JOBS_CHANGE_EVENT, handler);
}

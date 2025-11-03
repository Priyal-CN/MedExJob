import apiClient from './apiClient';

export async function fetchAnalyticsOverview() {
  const response = await apiClient.get('/api/analytics/overview');
  return response.data;
}

export async function fetchJobsByCategory() {
  const response = await apiClient.get('/api/analytics/jobs-by-category');
  return response.data;
}

export async function fetchJobsByLocation() {
  const response = await apiClient.get('/api/analytics/jobs-by-location');
  return response.data;
}

export async function fetchTopJobs() {
  const response = await apiClient.get('/api/analytics/top-jobs');
  return response.data;
}

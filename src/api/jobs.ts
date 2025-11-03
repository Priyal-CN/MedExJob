import apiClient from './apiClient';

export interface JobsQuery {
  search?: string;
  sector?: 'government' | 'private';
  category?: string;
  location?: string;
  experienceLevel?: 'entry' | 'mid' | 'senior' | 'executive';
  speciality?: string;
  dutyType?: 'full_time' | 'part_time' | 'contract';
  featured?: boolean;
  page?: number;
  size?: number;
  sort?: string; // e.g. 'createdAt,desc'
  status?: 'active' | 'closed' | 'pending' | 'draft';
}

export async function fetchJobs(params: JobsQuery = {}) {
  const res = await apiClient.get('/api/jobs', {
    params: {
      ...params,
      page: params.page ?? 0,
      size: params.size ?? 20,
      sort: params.sort || 'createdAt,desc',
    },
  });
  return res.data;
}

export async function fetchJob(id: string) {
  const res = await apiClient.get(`/api/jobs/${id}`);
  return res.data;
}

export async function fetchJobsMeta() {
  const res = await apiClient.get('/api/jobs/meta');
  return res.data;
}

export interface JobPayload {
  title: string;
  organization: string;
  sector: 'government' | 'private';
  category: string;
  location: string;
  qualification: string;
  experience?: string;
  experienceLevel?: 'entry' | 'mid' | 'senior' | 'executive';
  speciality?: string;
  dutyType?: 'full_time' | 'part_time' | 'contract';
  numberOfPosts?: number;
  gender?: string;
  salary?: string;
  description: string;
  lastDate: string; // yyyy-MM-dd
  pdfUrl?: string;
  imageUrl?: string;
  applyLink?: string;
  status?: 'active' | 'closed' | 'pending' | 'draft';
  featured?: boolean;
  views?: number;
  applications?: number;
  contactEmail?: string;
  contactPhone?: string;
  type?: 'hospital' | 'consultancy' | 'hr' | string;
}

export async function createJob(payload: JobPayload) {
  // The token is now added automatically by the interceptor
  const res = await apiClient.post('/api/jobs', payload);
  return res.data;
}

export async function updateJob(id: string, payload: Partial<JobPayload>) {
  console.log('Updating job with ID:', id, 'Payload:', payload);
  const res = await apiClient.put(`/api/jobs/${id}`, payload);
  console.log('Update response:', res.data);
  return res.data;
}

export async function deleteJob(id: string) {
  console.log('Deleting job with ID:', id);
  const res = await apiClient.delete(`/api/jobs/${id}`);
  console.log('Delete response:', res);
  return res;
}

export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await apiClient.post('/api/jobs/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
}

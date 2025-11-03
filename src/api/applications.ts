import apiClient from './apiClient';

export interface ApplicationPayload {
  jobId: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  resume?: File;
  notes?: string;
}

export interface ApplicationQuery {
  jobId?: string;
  candidateId?: string;
  candidateEmail?: string;
  status?: 'applied' | 'shortlisted' | 'interview' | 'selected' | 'rejected';
  search?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface ApplicationResponse {
  id: string;
  jobId: string;
  jobTitle: string;
  jobOrganization: string;
  candidateId?: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  resumeUrl?: string;
  status: 'applied' | 'shortlisted' | 'interview' | 'selected' | 'rejected';
  notes?: string;
  interviewDate?: string;
  appliedDate: string;
}

export async function applyForJob(payload: ApplicationPayload): Promise<ApplicationResponse> {
    const formData = new FormData();
    formData.append('jobId', payload.jobId);
    formData.append('candidateId', payload.candidateId);
    formData.append('candidateName', payload.candidateName);
    formData.append('candidateEmail', payload.candidateEmail);
    formData.append('candidatePhone', payload.candidatePhone);
    if (payload.resume) {
        formData.append('resume', payload.resume);
    }
    if (payload.notes) {
        formData.append('notes', payload.notes);
    }
    
    // Use apiClient which handles auth token automatically
    // Don't set Content-Type header - let the browser set it with boundary for multipart/form-data
    const response = await apiClient.post('/api/applications', formData);
    return response.data;
}

export async function fetchApplications(params: ApplicationQuery = {}) {
    try {
        console.log('Fetching applications with params:', params);
        const response = await apiClient.get('/api/applications', { params });
        console.log('Applications API response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error in fetchApplications:', error);
        throw error;
    }
}

export async function fetchMyApplications(params: ApplicationQuery = {}) {
    const response = await apiClient.get('/api/applications/my', { params });
    return response.data;
}

export async function updateApplicationStatus(id: string, status: string, notes?: string, interviewDate?: string | null) {
    const payload: any = { status };
    if (notes) payload.notes = notes;
    if (interviewDate) payload.interviewDate = interviewDate;
    
    const response = await apiClient.put(`/api/applications/${id}/status`, payload);
    return response.data;
}

export async function deleteApplication(id: string) {
    const response = await apiClient.delete(`/api/applications/${id}`);
    // Axios throws for non-2xx statuses, so no need to check for res.ok
    return response.data;
}

import apiClient from './apiClient';

// const API_BASE = (import.meta as any).env?.VITE_API_BASE || '';

export interface EmployerPayload {
  companyName: string;
  companyType: 'hospital' | 'consultancy' | 'hr';
  companyDescription?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface EmployerResponse {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  companyName: string;
  companyType: 'hospital' | 'consultancy' | 'hr';
  companyDescription?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  isVerified: boolean;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  verificationNotes?: string;
  verifiedAt?: string;
  plan?: 'basic' | 'professional' | 'enterprise';
  createdAt: string;
  updatedAt?: string;
}

export interface EmployerQuery {
  page?: number;
  size?: number;
  verificationStatus?: 'pending' | 'approved' | 'rejected';
  search?: string;
}

export async function fetchEmployers(params: EmployerQuery = {}) {
  try {
    const response = await apiClient.get('/api/employers', { params });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch employers`);
  }
}

export async function fetchEmployer(id: string): Promise<EmployerResponse> {
  const response = await apiClient.get(`/api/employers/${id}`);
  return response.data;
}

export async function updateEmployerVerificationStatus(
  id: string,
  status: 'pending' | 'approved' | 'rejected',
  notes?: string
): Promise<EmployerResponse> {
  const response = await apiClient.put(`/api/employers/${id}/verification`, null, {
    params: { status, notes },
  });
  return response.data;
}

export async function uploadEmployerDocument(id: string, document: File) {
  const formData = new FormData();
  formData.append('document', document);

  const response = await apiClient.post(`/api/employers/${id}/documents`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

// KYC flow additions
export interface EmployerKycPayload {
  aadhaarNumber: string;
  panNumber: string;
}

export interface EmployerVerificationStatus {
  verificationStatus: 'pending' | 'approved' | 'rejected';
  verificationNotes?: string;
}

export async function submitEmployerKYC(id: string, payload: EmployerKycPayload) {
  const response = await apiClient.post(`/api/employers/${id}/kyc`, payload);
  return response.data;
}

export async function uploadEmployerKycDocument(id: string, type: 'aadhaar' | 'pan', file: File) {
  const formData = new FormData();
  formData.append('type', type);
  formData.append('document', file);
  const response = await apiClient.post(`/api/employers/${id}/documents`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

export async function getEmployerVerificationStatus(id: string): Promise<EmployerVerificationStatus> {
  const response = await apiClient.get(`/api/employers/${id}/verification/status`);
  return response.data;
}

export interface VerificationRequest {
  id: string;
  employerId: string;
  employerName: string;
  companyName: string;
  email: string;
  aadhaarNumber: string;
  panNumber: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  documents: {
    aadhaarUrl?: string;
    panUrl?: string;
  };
}

export interface VerificationRequestsResponse {
  requests: VerificationRequest[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
}

export async function fetchVerificationRequests(page: number = 0, size: number = 20): Promise<VerificationRequestsResponse> {
  try {
    const response = await apiClient.get('/api/employers/verification-requests', {
      params: { page, size }
    });
    return response.data;
  } catch (error: any) {
    // If we get a 401 error, try again without authentication
    if (error.message && error.message.includes('[401]')) {
      console.log('Retrying verification requests without authentication...');
      const response = await fetch(`http://localhost:8082/api/employers/verification-requests?page=${page}&size=${size}`);
      const data = await response.json();
      return data;
    }
    throw error;
  }
}

export async function getPendingVerificationCount(): Promise<{ count: number }> {
  try {
    const response = await apiClient.get('/api/employers/verification-requests/pending-count');
    return response.data;
  } catch (error: any) {
    // If we get a 401 error, try again without authentication
    if (error.message && error.message.includes('[401]')) {
      console.log('Retrying pending count without authentication...');
      const response = await fetch('http://localhost:8082/api/employers/verification-requests/pending-count');
      const data = await response.json();
      return data;
    }
    throw error;
  }
}
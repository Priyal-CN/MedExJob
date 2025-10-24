const API_BASE = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:8081';

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
  createdAt: string;
  updatedAt?: string;
}

export interface EmployerQuery {
  page?: number;
  size?: number;
  verificationStatus?: 'pending' | 'approved' | 'rejected';
  search?: string;
}

export async function fetchEmployers(params: EmployerQuery = {}, token: string) {
  const qs = new URLSearchParams();
  if (params.page !== undefined) qs.set('page', String(params.page));
  if (params.size !== undefined) qs.set('size', String(params.size));
  if (params.verificationStatus) qs.set('verificationStatus', params.verificationStatus);
  if (params.search) qs.set('search', params.search);

  const res = await fetch(`${API_BASE}/api/employers?${qs.toString()}`, {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache',
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error(`Failed to fetch employers (${res.status})`);
  return res.json();
}

export async function fetchEmployer(id: string, token: string): Promise<EmployerResponse> {
  const res = await fetch(`${API_BASE}/api/employers/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error(`Failed to fetch employer (${res.status})`);
  return res.json();
}

export async function updateEmployerVerificationStatus(
  id: string,
  status: 'pending' | 'approved' | 'rejected',
  token: string,
  notes?: string
): Promise<EmployerResponse> {
  const qs = new URLSearchParams();
  qs.set('status', status);
  if (notes) qs.set('notes', notes);

  const res = await fetch(`${API_BASE}/api/employers/${id}/verification?${qs.toString()}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error(`Failed to update employer verification status (${res.status})`);
  return res.json();
}

export async function uploadEmployerDocument(id: string, document: File, token: string) {
  const formData = new FormData();
  formData.append('document', document);

  const res = await fetch(`${API_BASE}/api/employers/${id}/documents`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });
  if (!res.ok) throw new Error(`Failed to upload document (${res.status})`);
  return res.json();
}

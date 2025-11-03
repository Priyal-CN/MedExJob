import apiClient from './apiClient';

export interface UsersQuery {
  role?: 'candidate' | 'employer' | 'admin' | 'all';
  status?: 'active' | 'inactive' | 'suspended' | 'all';
  search?: string;
  page?: number;
  size?: number;
  sort?: string; // createdAt,desc
}

export interface UserDto {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'candidate' | 'employer' | 'admin';
  status: 'active' | 'suspended';
  createdDate?: string;
  lastLogin?: string | null;
}

export async function fetchUsers(params: UsersQuery = {}) {
  const res = await apiClient.get('/api/users', { params });
  return res.data as { content: UserDto[]; totalElements: number; totalPages: number; page: number; size: number };
}

export async function updateUserStatus(id: string, status: 'active' | 'suspended') {
  const res = await apiClient.put(`/api/users/${id}/status`, null, { params: { status } });
  return res.data as UserDto;
}

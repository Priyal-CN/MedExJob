import apiClient from './apiClient';

export interface Notification {
  id: string;
  userId: string;
  type: 'job_alert' | 'application_update' | 'interview_scheduled' | 'job_created' | 'general';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  metadata?: any;
}

export interface CreateNotificationRequest {
  userId?: string; // If not provided, will be sent to all users
  type: 'job_alert' | 'application_update' | 'interview_scheduled' | 'job_created' | 'general';
  title: string;
  message: string;
  metadata?: any;
}

export async function createNotification(data: CreateNotificationRequest): Promise<Notification> {
  const response = await apiClient.post('/api/notifications', data);
  return response.data;
}

export async function getNotifications(params?: {
  page?: number;
  size?: number;
  type?: string;
  read?: boolean;
}): Promise<{ content: Notification[]; totalElements: number; totalPages: number }> {
  const response = await apiClient.get('/api/notifications', { params });
  return response.data;
}

export async function markNotificationAsRead(notificationId: string): Promise<void> {
  await apiClient.patch(`/api/notifications/${notificationId}/read`);
}

export async function markAllNotificationsAsRead(): Promise<void> {
  await apiClient.patch('/api/notifications/read-all');
}

export async function deleteNotification(notificationId: string): Promise<void> {
  await apiClient.delete(`/api/notifications/${notificationId}`);
}

// Create a job creation notification for all users
export async function createJobCreationNotification(job: any): Promise<void> {
  try {
    await createNotification({
      type: 'job_created',
      title: 'New Job Posted',
      message: `A new ${job.sector === 'government' ? 'government' : 'private'} job "${job.title}" has been posted by ${job.organization}`,
      metadata: {
        jobId: job.id,
        jobTitle: job.title,
        organization: job.organization,
        sector: job.sector,
        category: job.category,
        location: job.location
      }
    });
  } catch (error) {
    console.error('Failed to create job creation notification:', error);
    // Don't throw error to avoid breaking job creation flow
  }
}

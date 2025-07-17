import { apiClient } from './api';

export interface Notification {
  id: string;
  type: 'session_scheduled' | 'session_modified' | 'session_cancelled' | 'session_starting' | 'assignment_due' | 'grade_posted' | 'announcement' | 'message_received';
  title: string;
  message: string;
  data?: Record<string, any>;
  userId: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  channels: ('push' | 'email' | 'sms' | 'in_app')[];
  scheduledFor?: string;
  sentAt?: string;
  readAt?: string;
  createdAt: string;
}

export interface NotificationSettings {
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  sessionReminders: boolean;
  assignmentReminders: boolean;
  gradeNotifications: boolean;
  announcementNotifications: boolean;
  messageNotifications: boolean;
  reminderTiming: number; // minutes before event
}

export interface SessionNotification {
  sessionId: string;
  type: 'scheduled' | 'modified' | 'cancelled' | 'starting';
  recipients: string[]; // user IDs
  customMessage?: string;
  sendImmediately?: boolean;
  scheduleFor?: string;
}

class NotificationService {
  // Get user notifications
  async getNotifications(params?: {
    unreadOnly?: boolean;
    type?: string;
    page?: number;
    limit?: number;
  }) {
    const response = await apiClient.get('/notifications', { params });
    return response.data;
  }

  // Mark notification as read
  async markAsRead(notificationId: string) {
    const response = await apiClient.patch(`/notifications/${notificationId}/read`);
    return response.data;
  }

  // Mark all notifications as read
  async markAllAsRead() {
    const response = await apiClient.patch('/notifications/read-all');
    return response.data;
  }

  // Delete notification
  async deleteNotification(notificationId: string) {
    const response = await apiClient.delete(`/notifications/${notificationId}`);
    return response.data;
  }

  // Send session notification
  async sendSessionNotification(data: SessionNotification) {
    const response = await apiClient.post('/notifications/session', data);
    return response.data;
  }

  // Send custom notification
  async sendCustomNotification(data: {
    recipients: string[];
    title: string;
    message: string;
    type?: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    channels?: ('push' | 'email' | 'sms' | 'in_app')[];
    data?: Record<string, any>;
    scheduleFor?: string;
  }) {
    const response = await apiClient.post('/notifications/custom', data);
    return response.data;
  }

  // Get notification settings
  async getNotificationSettings() {
    const response = await apiClient.get('/notifications/settings');
    return response.data;
  }

  // Update notification settings
  async updateNotificationSettings(settings: Partial<NotificationSettings>) {
    const response = await apiClient.patch('/notifications/settings', settings);
    return response.data;
  }

  // Subscribe to push notifications
  async subscribeToPush(subscription: PushSubscription) {
    const response = await apiClient.post('/notifications/push/subscribe', {
      subscription: subscription.toJSON()
    });
    return response.data;
  }

  // Unsubscribe from push notifications
  async unsubscribeFromPush() {
    const response = await apiClient.post('/notifications/push/unsubscribe');
    return response.data;
  }

  // Send test notification
  async sendTestNotification(channels: ('push' | 'email' | 'sms')[]) {
    const response = await apiClient.post('/notifications/test', { channels });
    return response.data;
  }

  // Get notification statistics
  async getNotificationStats(params?: {
    dateFrom?: string;
    dateTo?: string;
    type?: string;
  }) {
    const response = await apiClient.get('/notifications/stats', { params });
    return response.data;
  }

  // Schedule session reminders
  async scheduleSessionReminders(sessionId: string, reminderTimes: number[]) {
    const response = await apiClient.post(`/sessions/${sessionId}/reminders`, {
      reminderTimes // minutes before session
    });
    return response.data;
  }

  // Cancel scheduled notifications
  async cancelScheduledNotifications(sessionId: string) {
    const response = await apiClient.delete(`/sessions/${sessionId}/notifications`);
    return response.data;
  }
}

export const notificationService = new NotificationService();
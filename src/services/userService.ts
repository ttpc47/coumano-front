import { apiClient } from './api';

export interface User {
  id: string;
  matricule: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'admin' | 'lecturer' | 'student';
  avatar?: string;
  department?: string;
  departmentId?: string;
  specialty?: string;
  specialtyId?: string;
  level?: number;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  isFirstLogin: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'admin' | 'lecturer' | 'student';
  departmentId?: string;
  specialtyId?: string;
  level?: number;
  generateMatricule?: boolean;
  sendWelcomeEmail?: boolean;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  departmentId?: string;
  specialtyId?: string;
  level?: number;
}

export interface UserFilters {
  role?: string;
  department?: string;
  specialty?: string;
  status?: string;
  level?: number;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface BulkImportResult {
  success: boolean;
  totalRows: number;
  successCount: number;
  errorCount: number;
  errors: {
    row: number;
    field: string;
    message: string;
  }[];
  createdUsers: {
    matricule: string;
    firstName: string;
    lastName: string;
    role: string;
    password: string;
  }[];
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  usersByRole: { role: string; count: number }[];
  usersByDepartment: { department: string; count: number }[];
  usersByStatus: { status: string; count: number }[];
  loginActivity: {
    date: string;
    logins: number;
  }[];
}

class UserService {
  // Get users with filters and pagination
  async getUsers(filters?: UserFilters) {
    const response = await apiClient.get('/users', { params: filters });
    return response.data;
  }

  // Get user by ID
  async getUser(userId: string) {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  }

  // Create new user
  async createUser(userData: CreateUserData) {
    const response = await apiClient.post('/users', userData);
    return response.data;
  }

  // Update user
  async updateUser(userId: string, userData: UpdateUserData) {
    const response = await apiClient.patch(`/users/${userId}`, userData);
    return response.data;
  }

  // Delete user
  async deleteUser(userId: string) {
    const response = await apiClient.delete(`/users/${userId}`);
    return response.data;
  }

  // Bulk delete users
  async bulkDeleteUsers(userIds: string[]) {
    const response = await apiClient.post('/users/bulk-delete', { userIds });
    return response.data;
  }

  // Reset user password
  async resetPassword(userId: string, sendEmail: boolean = true) {
    const response = await apiClient.post(`/users/${userId}/reset-password`, { sendEmail });
    return response.data;
  }

  // Change user status
  async changeUserStatus(userId: string, status: 'active' | 'inactive' | 'suspended') {
    const response = await apiClient.patch(`/users/${userId}/status`, { status });
    return response.data;
  }

  // Bulk import users from CSV
  async bulkImportUsers(formData: FormData): Promise<BulkImportResult> {
    const response = await apiClient.post('/users/bulk-import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  // Export users to CSV/Excel
  async exportUsers(filters?: UserFilters, format: 'csv' | 'excel' = 'csv') {
    const response = await apiClient.get('/users/export', {
      params: { ...filters, format },
      responseType: 'blob'
    });
    return response.data;
  }

  // Get user statistics
  async getUserStats(dateRange?: { from: string; to: string }) {
    const response = await apiClient.get('/users/stats', { params: dateRange });
    return response.data;
  }

  // Search users
  async searchUsers(query: string, filters?: Partial<UserFilters>) {
    const response = await apiClient.get('/users/search', {
      params: { q: query, ...filters }
    });
    return response.data;
  }

  // Get user permissions
  async getUserPermissions(userId: string) {
    const response = await apiClient.get(`/users/${userId}/permissions`);
    return response.data;
  }

  // Update user permissions
  async updateUserPermissions(userId: string, permissions: string[]) {
    const response = await apiClient.patch(`/users/${userId}/permissions`, { permissions });
    return response.data;
  }

  // Get user activity log
  async getUserActivity(userId: string, params?: {
    page?: number;
    limit?: number;
    dateFrom?: string;
    dateTo?: string;
  }) {
    const response = await apiClient.get(`/users/${userId}/activity`, { params });
    return response.data;
  }

  // Send welcome email
  async sendWelcomeEmail(userId: string) {
    const response = await apiClient.post(`/users/${userId}/send-welcome`);
    return response.data;
  }

  // Validate matricule uniqueness
  async validateMatricule(matricule: string, excludeUserId?: string) {
    const response = await apiClient.get('/users/validate-matricule', {
      params: { matricule, excludeUserId }
    });
    return response.data;
  }

  // Validate email uniqueness
  async validateEmail(email: string, excludeUserId?: string) {
    const response = await apiClient.get('/users/validate-email', {
      params: { email, excludeUserId }
    });
    return response.data;
  }
}

export const userService = new UserService();
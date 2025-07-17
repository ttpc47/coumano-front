// API Configuration and Client
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('coumano_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (response.status === 401) {
        this.handleUnauthorized();
        throw new Error('Unauthorized');
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  private handleUnauthorized() {
    this.token = null;
    localStorage.removeItem('coumano_token');
    localStorage.removeItem('coumano_user');
    window.location.href = '/login';
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('coumano_token', token);
  }

  // Auth endpoints
  async login(matricule: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ matricule, password }),
    });
  }

  async logout() {
    return this.request('/auth/logout/', { method: 'POST' });
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.request('/auth/change-password/', {
      method: 'POST',
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
    });
  }

  // User management
  async getUsers(params?: any) {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`/users/${query}`);
  }

  async createUser(userData: any) {
    return this.request('/users/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(userId: string, userData: any) {
    return this.request(`/users/${userId}/`, {
      method: 'PATCH',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(userId: string) {
    return this.request(`/users/${userId}/`, { method: 'DELETE' });
  }

  // Department management
  async getDepartments() {
    return this.request('/departments/');
  }

  async createDepartment(data: any) {
    return this.request('/departments/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Specialty management
  async getSpecialties(departmentId?: string) {
    const query = departmentId ? `?department=${departmentId}` : '';
    return this.request(`/specialties/${query}`);
  }

  async createSpecialty(data: any) {
    return this.request('/specialties/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Course management
  async getCourses(params?: any) {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`/courses/${query}`);
  }

  async createCourse(data: any) {
    return this.request('/courses/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Session management
  async getSessions(params?: any) {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`/sessions/${query}`);
  }

  async createSession(data: any) {
    return this.request('/sessions/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async startSession(sessionId: string) {
    return this.request(`/sessions/${sessionId}/start/`, { method: 'POST' });
  }

  async endSession(sessionId: string) {
    return this.request(`/sessions/${sessionId}/end/`, { method: 'POST' });
  }

  // Materials
  async uploadMaterial(formData: FormData) {
    return this.request('/materials/', {
      method: 'POST',
      headers: {}, // Remove Content-Type to let browser set it for FormData
      body: formData,
    });
  }

  async getMaterials(params?: any) {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`/materials/${query}`);
  }

  // Messages
  async getMessages(params?: any) {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`/messages/${query}`);
  }

  async sendMessage(data: any) {
    return this.request('/messages/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Analytics
  async getAnalytics(params?: any) {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`/analytics/${query}`);
  }

  // System settings
  async getSystemSettings() {
    return this.request('/settings/');
  }

  async updateSystemSettings(data: any) {
    return this.request('/settings/', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Bulk operations
  async bulkImportUsers(formData: FormData) {
    return this.request('/users/bulk-import/', {
      method: 'POST',
      headers: {}, // Remove Content-Type for FormData
      body: formData,
    });
  }

  // File operations
  get(endpoint: string, params?: any) {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`${endpoint}${query}`);
  }

  post(endpoint: string, data?: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  patch(endpoint: string, data?: any) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  delete(endpoint: string) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
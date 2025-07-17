import { apiClient } from './api';

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  userId: string;
  userName: string;
  userRole: 'student' | 'lecturer';
  status: 'present' | 'absent' | 'late' | 'left_early';
  connectTime?: string;
  disconnectTime?: string;
  totalDuration: number; // in minutes
  connectionEvents: ConnectionEvent[];
  ipAddress?: string;
  device?: string;
  location?: string;
}

export interface ConnectionEvent {
  id: string;
  type: 'connect' | 'disconnect' | 'reconnect';
  timestamp: string;
  duration?: number; // for disconnect events
  reason?: string; // network, manual, etc.
}

export interface AttendanceSession {
  id: string;
  courseId: string;
  courseName: string;
  lecturerId: string;
  lecturerName: string;
  title: string;
  scheduledStart: string;
  scheduledEnd: string;
  actualStart?: string;
  actualEnd?: string;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  totalStudents: number;
  presentStudents: number;
  attendanceRate: number;
  recordingId?: string;
  isRecorded: boolean;
  autoAttendanceEnabled: boolean;
}

export interface AttendanceStats {
  totalSessions: number;
  attendedSessions: number;
  attendanceRate: number;
  averageDuration: number;
  totalHours: number;
  lateCount: number;
  earlyLeaveCount: number;
  perfectAttendanceDays: number;
}

class AttendanceService {
  // Get attendance records for a session
  async getSessionAttendance(sessionId: string) {
    const response = await apiClient.get(`/sessions/${sessionId}/attendance`);
    return response.data;
  }

  // Get user's attendance history
  async getUserAttendance(userId: string, params?: {
    courseId?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  }) {
    const response = await apiClient.get(`/users/${userId}/attendance`, { params });
    return response.data;
  }

  // Get attendance statistics for a user
  async getUserAttendanceStats(userId: string, params?: {
    courseId?: string;
    semester?: string;
    year?: number;
  }) {
    const response = await apiClient.get(`/users/${userId}/attendance/stats`, { params });
    return response.data;
  }

  // Record user connection to session
  async recordConnection(sessionId: string, data: {
    userId: string;
    connectTime: string;
    ipAddress?: string;
    device?: string;
    location?: string;
  }) {
    const response = await apiClient.post(`/sessions/${sessionId}/attendance/connect`, data);
    return response.data;
  }

  // Record user disconnection from session
  async recordDisconnection(sessionId: string, data: {
    userId: string;
    disconnectTime: string;
    reason?: string;
  }) {
    const response = await apiClient.post(`/sessions/${sessionId}/attendance/disconnect`, data);
    return response.data;
  }

  // Get real-time attendance for live session
  async getLiveAttendance(sessionId: string) {
    const response = await apiClient.get(`/sessions/${sessionId}/attendance/live`);
    return response.data;
  }

  // Mark manual attendance (for lecturers)
  async markManualAttendance(sessionId: string, data: {
    userId: string;
    status: 'present' | 'absent' | 'late' | 'excused';
    notes?: string;
  }) {
    const response = await apiClient.post(`/sessions/${sessionId}/attendance/manual`, data);
    return response.data;
  }

  // Generate attendance report
  async generateAttendanceReport(params: {
    courseId?: string;
    departmentId?: string;
    specialtyId?: string;
    dateFrom: string;
    dateTo: string;
    format: 'pdf' | 'excel' | 'csv';
  }) {
    const response = await apiClient.post('/attendance/reports/generate', params, {
      responseType: 'blob'
    });
    return response.data;
  }

  // Get attendance summary for course
  async getCourseAttendanceSummary(courseId: string, params?: {
    dateFrom?: string;
    dateTo?: string;
  }) {
    const response = await apiClient.get(`/courses/${courseId}/attendance/summary`, { params });
    return response.data;
  }

  // Update attendance settings
  async updateAttendanceSettings(sessionId: string, settings: {
    autoAttendanceEnabled: boolean;
    minimumDuration?: number; // minimum minutes to be marked present
    lateThreshold?: number; // minutes after start time to be marked late
    earlyLeaveThreshold?: number; // minutes before end time to be marked early leave
  }) {
    const response = await apiClient.patch(`/sessions/${sessionId}/attendance/settings`, settings);
    return response.data;
  }

  // Export attendance data
  async exportAttendance(params: {
    sessionIds?: string[];
    courseId?: string;
    userId?: string;
    dateFrom?: string;
    dateTo?: string;
    format: 'json' | 'csv' | 'excel';
  }) {
    const response = await apiClient.get('/attendance/export', {
      params,
      responseType: 'blob'
    });
    return response.data;
  }
}

export const attendanceService = new AttendanceService();
import { apiClient } from './api';

export interface CourseSchedule {
  id: string;
  courseId: string;
  courseName: string;
  courseCode: string;
  lecturerId: string;
  lecturerName: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
  building?: string;
  type: 'lecture' | 'practical' | 'tutorial' | 'exam';
  capacity?: number;
  enrolledCount?: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  isRecurring: boolean;
  recurrencePattern?: RecurrencePattern;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecurrencePattern {
  type: 'weekly' | 'biweekly' | 'monthly';
  interval: number;
  endDate?: string;
  occurrences?: number;
}

export interface CreateScheduleData {
  courseId: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
  building?: string;
  type: 'lecture' | 'practical' | 'tutorial' | 'exam';
  isRecurring?: boolean;
  recurrencePattern?: RecurrencePattern;
  notes?: string;
}

export interface UpdateScheduleData {
  day?: string;
  startTime?: string;
  endTime?: string;
  room?: string;
  building?: string;
  type?: 'lecture' | 'practical' | 'tutorial' | 'exam';
  status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
}

export interface ScheduleFilters {
  courseId?: string;
  lecturerId?: string;
  day?: string;
  room?: string;
  building?: string;
  type?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface ScheduleConflict {
  type: 'room' | 'lecturer' | 'time';
  severity: 'high' | 'medium' | 'low';
  conflictingSchedules: CourseSchedule[];
  suggestedSolutions: SuggestedSolution[];
}

export interface SuggestedSolution {
  id: string;
  type: 'change_room' | 'change_time' | 'split_session';
  description: string;
  newRoom?: string;
  newStartTime?: string;
  newEndTime?: string;
  impact: 'low' | 'medium' | 'high';
}

export interface RoomAvailability {
  room: string;
  building: string;
  capacity: number;
  isAvailable: boolean;
  conflictingSchedules: CourseSchedule[];
}

export interface ScheduleStats {
  totalSchedules: number;
  schedulesThisWeek: number;
  roomUtilization: { room: string; utilizationRate: number }[];
  lecturerWorkload: { lecturerId: string; lecturerName: string; hoursPerWeek: number }[];
  peakHours: { hour: string; scheduleCount: number }[];
}

class CourseScheduleService {
  // Get all schedules with filters
  async getSchedules(filters?: ScheduleFilters) {
    const response = await apiClient.get('/course-schedules', { params: filters });
    return response.data;
  }

  // Get schedule by ID
  async getSchedule(scheduleId: string) {
    const response = await apiClient.get(`/course-schedules/${scheduleId}`);
    return response.data;
  }

  // Create new schedule
  async createSchedule(scheduleData: CreateScheduleData) {
    const response = await apiClient.post('/course-schedules', scheduleData);
    return response.data;
  }

  // Update schedule
  async updateSchedule(scheduleId: string, scheduleData: UpdateScheduleData) {
    const response = await apiClient.patch(`/course-schedules/${scheduleId}`, scheduleData);
    return response.data;
  }

  // Delete schedule
  async deleteSchedule(scheduleId: string) {
    const response = await apiClient.delete(`/course-schedules/${scheduleId}`);
    return response.data;
  }

  // Check for schedule conflicts
  async checkConflicts(scheduleData: CreateScheduleData | UpdateScheduleData, excludeId?: string) {
    const response = await apiClient.post('/course-schedules/check-conflicts', {
      ...scheduleData,
      excludeId
    });
    return response.data;
  }

  // Get room availability
  async getRoomAvailability(room: string, building: string, day: string, startTime: string, endTime: string) {
    const response = await apiClient.get('/course-schedules/room-availability', {
      params: { room, building, day, startTime, endTime }
    });
    return response.data;
  }

  // Get available rooms for a time slot
  async getAvailableRooms(day: string, startTime: string, endTime: string, building?: string) {
    const response = await apiClient.get('/course-schedules/available-rooms', {
      params: { day, startTime, endTime, building }
    });
    return response.data;
  }

  // Get lecturer schedule
  async getLecturerSchedule(lecturerId: string, filters?: { dateFrom?: string; dateTo?: string }) {
    const response = await apiClient.get(`/course-schedules/lecturer/${lecturerId}`, { params: filters });
    return response.data;
  }

  // Get course schedules
  async getCourseSchedules(courseId: string) {
    const response = await apiClient.get(`/course-schedules/course/${courseId}`);
    return response.data;
  }

  // Bulk create schedules (for recurring schedules)
  async bulkCreateSchedules(schedules: CreateScheduleData[]) {
    const response = await apiClient.post('/course-schedules/bulk', { schedules });
    return response.data;
  }

  // Generate recurring schedules
  async generateRecurringSchedules(scheduleId: string, pattern: RecurrencePattern) {
    const response = await apiClient.post(`/course-schedules/${scheduleId}/generate-recurring`, pattern);
    return response.data;
  }

  // Get schedule statistics
  async getScheduleStats(filters?: { dateFrom?: string; dateTo?: string }) {
    const response = await apiClient.get('/course-schedules/stats', { params: filters });
    return response.data;
  }

  // Export schedules
  async exportSchedules(filters?: ScheduleFilters, format: 'csv' | 'excel' | 'ics' = 'csv') {
    const response = await apiClient.get('/course-schedules/export', {
      params: { ...filters, format },
      responseType: 'blob'
    });
    return response.data;
  }

  // Import schedules from file
  async importSchedules(formData: FormData) {
    const response = await apiClient.post('/course-schedules/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  // Resolve schedule conflicts
  async resolveConflict(conflictId: string, solution: SuggestedSolution) {
    const response = await apiClient.post(`/course-schedules/conflicts/${conflictId}/resolve`, solution);
    return response.data;
  }

  // Get optimal schedule suggestions
  async getOptimalSchedule(courseId: string, preferences: {
    preferredDays?: string[];
    preferredTimes?: string[];
    roomPreferences?: string[];
    avoidConflicts?: boolean;
  }) {
    const response = await apiClient.post(`/course-schedules/optimize/${courseId}`, preferences);
    return response.data;
  }

  // Validate schedule data
  async validateSchedule(scheduleData: CreateScheduleData) {
    const response = await apiClient.post('/course-schedules/validate', scheduleData);
    return response.data;
  }

  // Get schedule templates
  async getScheduleTemplates() {
    const response = await apiClient.get('/course-schedules/templates');
    return response.data;
  }

  // Create schedule from template
  async createFromTemplate(templateId: string, courseId: string, customizations?: any) {
    const response = await apiClient.post('/course-schedules/from-template', {
      templateId,
      courseId,
      customizations
    });
    return response.data;
  }
}

export const courseScheduleService = new CourseScheduleService();
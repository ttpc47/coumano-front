import { apiClient } from './api';

export interface ScheduleEvent {
  id: string;
  title: string;
  description?: string;
  courseId: string;
  courseName: string;
  courseCode: string;
  lecturerId: string;
  lecturerName: string;
  type: 'lecture' | 'practical' | 'tutorial' | 'exam' | 'meeting';
  startTime: string;
  endTime: string;
  room: string;
  building?: string;
  capacity?: number;
  enrolledCount?: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'postponed';
  isRecurring: boolean;
  recurrencePattern?: RecurrencePattern;
  color?: string;
  isVirtual: boolean;
  virtualRoomId?: string;
  attendanceRequired: boolean;
  materials?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecurrencePattern {
  type: 'daily' | 'weekly' | 'monthly';
  interval: number; // every N days/weeks/months
  daysOfWeek?: number[]; // 0-6, Sunday = 0
  endDate?: string;
  occurrences?: number;
}

export interface CreateEventData {
  title: string;
  description?: string;
  courseId: string;
  lecturerId: string;
  type: 'lecture' | 'practical' | 'tutorial' | 'exam' | 'meeting';
  startTime: string;
  endTime: string;
  room: string;
  building?: string;
  isRecurring?: boolean;
  recurrencePattern?: RecurrencePattern;
  isVirtual?: boolean;
  attendanceRequired?: boolean;
  notes?: string;
  notifyParticipants?: boolean;
}

export interface UpdateEventData {
  title?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  room?: string;
  building?: string;
  status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'postponed';
  notes?: string;
  notifyParticipants?: boolean;
  updateSeries?: boolean; // for recurring events
}

export interface ScheduleFilters {
  courseId?: string;
  lecturerId?: string;
  departmentId?: string;
  specialtyId?: string;
  type?: string;
  status?: string;
  room?: string;
  building?: string;
  dateFrom?: string;
  dateTo?: string;
  isVirtual?: boolean;
  page?: number;
  limit?: number;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  conflictingEvents?: ScheduleEvent[];
}

export interface RoomAvailability {
  room: string;
  building: string;
  capacity: number;
  timeSlots: TimeSlot[];
}

export interface ScheduleConflict {
  type: 'room' | 'lecturer' | 'student_group';
  conflictingEvents: ScheduleEvent[];
  affectedParticipants?: string[];
}

export interface ScheduleStats {
  totalEvents: number;
  upcomingEvents: number;
  completedEvents: number;
  cancelledEvents: number;
  eventsByType: { type: string; count: number }[];
  roomUtilization: { room: string; utilizationRate: number }[];
  lecturerWorkload: { lecturerId: string; lecturerName: string; hoursPerWeek: number }[];
}

class ScheduleService {
  // Get schedule events with filters
  async getEvents(filters?: ScheduleFilters) {
    const response = await apiClient.get('/schedule/events', { params: filters });
    return response.data;
  }

  // Get event by ID
  async getEvent(eventId: string) {
    const response = await apiClient.get(`/schedule/events/${eventId}`);
    return response.data;
  }

  // Create new event
  async createEvent(eventData: CreateEventData) {
    const response = await apiClient.post('/schedule/events', eventData);
    return response.data;
  }

  // Update event
  async updateEvent(eventId: string, eventData: UpdateEventData) {
    const response = await apiClient.patch(`/schedule/events/${eventId}`, eventData);
    return response.data;
  }

  // Delete event
  async deleteEvent(eventId: string, deleteSeries: boolean = false) {
    const response = await apiClient.delete(`/schedule/events/${eventId}`, {
      params: { deleteSeries }
    });
    return response.data;
  }

  // Get user's schedule (student/lecturer)
  async getUserSchedule(userId: string, filters?: {
    dateFrom?: string;
    dateTo?: string;
    includeCompleted?: boolean;
  }) {
    const response = await apiClient.get(`/schedule/users/${userId}`, { params: filters });
    return response.data;
  }

  // Get course schedule
  async getCourseSchedule(courseId: string, filters?: {
    dateFrom?: string;
    dateTo?: string;
  }) {
    const response = await apiClient.get(`/schedule/courses/${courseId}`, { params: filters });
    return response.data;
  }

  // Get room schedule
  async getRoomSchedule(room: string, building?: string, filters?: {
    dateFrom?: string;
    dateTo?: string;
  }) {
    const response = await apiClient.get('/schedule/rooms', {
      params: { room, building, ...filters }
    });
    return response.data;
  }

  // Check room availability
  async checkRoomAvailability(room: string, building: string, date: string) {
    const response = await apiClient.get('/schedule/rooms/availability', {
      params: { room, building, date }
    });
    return response.data;
  }

  // Get available time slots
  async getAvailableTimeSlots(params: {
    date: string;
    duration: number; // in minutes
    room?: string;
    building?: string;
    lecturerId?: string;
  }) {
    const response = await apiClient.get('/schedule/available-slots', { params });
    return response.data;
  }

  // Check for schedule conflicts
  async checkConflicts(eventData: {
    startTime: string;
    endTime: string;
    room: string;
    building?: string;
    lecturerId: string;
    courseId: string;
    excludeEventId?: string;
  }) {
    const response = await apiClient.post('/schedule/check-conflicts', eventData);
    return response.data;
  }

  // Get schedule statistics
  async getScheduleStats(filters?: {
    dateFrom?: string;
    dateTo?: string;
    departmentId?: string;
  }) {
    const response = await apiClient.get('/schedule/stats', { params: filters });
    return response.data;
  }

  // Export schedule
  async exportSchedule(filters?: ScheduleFilters, format: 'ics' | 'pdf' | 'excel' = 'ics') {
    const response = await apiClient.get('/schedule/export', {
      params: { ...filters, format },
      responseType: 'blob'
    });
    return response.data;
  }

  // Import schedule from file
  async importSchedule(formData: FormData) {
    const response = await apiClient.post('/schedule/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  // Generate recurring events
  async generateRecurringEvents(eventId: string, pattern: RecurrencePattern) {
    const response = await apiClient.post(`/schedule/events/${eventId}/generate-series`, pattern);
    return response.data;
  }

  // Cancel event
  async cancelEvent(eventId: string, reason?: string, notifyParticipants: boolean = true) {
    const response = await apiClient.post(`/schedule/events/${eventId}/cancel`, {
      reason,
      notifyParticipants
    });
    return response.data;
  }

  // Reschedule event
  async rescheduleEvent(eventId: string, newStartTime: string, newEndTime: string, newRoom?: string) {
    const response = await apiClient.post(`/schedule/events/${eventId}/reschedule`, {
      newStartTime,
      newEndTime,
      newRoom
    });
    return response.data;
  }

  // Get lecturer workload
  async getLecturerWorkload(lecturerId: string, filters?: {
    dateFrom?: string;
    dateTo?: string;
  }) {
    const response = await apiClient.get(`/schedule/lecturers/${lecturerId}/workload`, { params: filters });
    return response.data;
  }

  // Get room utilization
  async getRoomUtilization(filters?: {
    room?: string;
    building?: string;
    dateFrom?: string;
    dateTo?: string;
  }) {
    const response = await apiClient.get('/schedule/rooms/utilization', { params: filters });
    return response.data;
  }

  // Search events
  async searchEvents(query: string, filters?: Partial<ScheduleFilters>) {
    const response = await apiClient.get('/schedule/search', {
      params: { q: query, ...filters }
    });
    return response.data;
  }

  // Get upcoming events for user
  async getUpcomingEvents(userId: string, limit: number = 10) {
    const response = await apiClient.get(`/schedule/users/${userId}/upcoming`, {
      params: { limit }
    });
    return response.data;
  }

  // Mark event as completed
  async markEventCompleted(eventId: string, notes?: string) {
    const response = await apiClient.post(`/schedule/events/${eventId}/complete`, { notes });
    return response.data;
  }
}

export const scheduleService = new ScheduleService();
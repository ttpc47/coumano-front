import { apiClient } from './api';

export interface Recording {
  id: string;
  sessionId: string;
  title: string;
  course: string;
  lecturer: string;
  startTime: string;
  endTime: string;
  duration: number;
  fileUrl: string;
  thumbnailUrl?: string;
  transcriptionStatus: 'pending' | 'processing' | 'completed' | 'failed';
  transcriptionUrl?: string;
  summaryUrl?: string;
  size: number;
  quality: 'HD' | 'SD' | 'Audio Only';
  attendanceCount: number;
  isPublic: boolean;
  createdAt: string;
}

export interface TranscriptionSegment {
  id: string;
  startTime: number;
  endTime: number;
  speaker: string;
  text: string;
  confidence: number;
}

export interface SessionSummary {
  id: string;
  recordingId: string;
  keyTopics: string[];
  mainPoints: string[];
  actionItems: string[];
  questions: string[];
  duration: number;
  participantCount: number;
  generatedAt: string;
}

class RecordingService {
  // Get all recordings with filters
  async getRecordings(params?: {
    course?: string;
    lecturer?: string;
    dateFrom?: string;
    dateTo?: string;
    transcribed?: boolean;
    page?: number;
    limit?: number;
  }) {
    const response = await apiClient.get('/recordings', { params });
    return response.data;
  }

  // Get recording by ID
  async getRecording(id: string) {
    const response = await apiClient.get(`/recordings/${id}`);
    return response.data;
  }

  // Start recording for a session
  async startRecording(sessionId: string, options?: {
    quality?: 'HD' | 'SD' | 'Audio Only';
    autoTranscribe?: boolean;
    generateSummary?: boolean;
  }) {
    const response = await apiClient.post(`/sessions/${sessionId}/recording/start`, options);
    return response.data;
  }

  // Stop recording
  async stopRecording(sessionId: string) {
    const response = await apiClient.post(`/sessions/${sessionId}/recording/stop`);
    return response.data;
  }

  // Get transcription for a recording
  async getTranscription(recordingId: string) {
    const response = await apiClient.get(`/recordings/${recordingId}/transcription`);
    return response.data;
  }

  // Request transcription processing
  async requestTranscription(recordingId: string, options?: {
    language?: string;
    speakerIdentification?: boolean;
    generateSummary?: boolean;
  }) {
    const response = await apiClient.post(`/recordings/${recordingId}/transcription`, options);
    return response.data;
  }

  // Get session summary
  async getSessionSummary(recordingId: string) {
    const response = await apiClient.get(`/recordings/${recordingId}/summary`);
    return response.data;
  }

  // Download recording
  async downloadRecording(recordingId: string) {
    const response = await apiClient.get(`/recordings/${recordingId}/download`, {
      responseType: 'blob'
    });
    return response.data;
  }

  // Delete recording
  async deleteRecording(recordingId: string) {
    const response = await apiClient.delete(`/recordings/${recordingId}`);
    return response.data;
  }

  // Update recording metadata
  async updateRecording(recordingId: string, data: {
    title?: string;
    isPublic?: boolean;
    description?: string;
  }) {
    const response = await apiClient.patch(`/recordings/${recordingId}`, data);
    return response.data;
  }

  // Search recordings by content
  async searchRecordings(query: string, filters?: {
    course?: string;
    dateFrom?: string;
    dateTo?: string;
  }) {
    const response = await apiClient.get('/recordings/search', {
      params: { q: query, ...filters }
    });
    return response.data;
  }
}

export const recordingService = new RecordingService();
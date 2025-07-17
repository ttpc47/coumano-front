import { apiClient } from './api';

export interface TranscriptionSegment {
  id: string;
  startTime: number; // seconds
  endTime: number; // seconds
  speaker: string;
  speakerId?: string;
  text: string;
  confidence: number;
  language: string;
  isEdited: boolean;
  editedBy?: string;
  editedAt?: string;
}

export interface SubtitleTrack {
  id: string;
  language: string;
  label: string;
  isDefault: boolean;
  segments: TranscriptionSegment[];
  format: 'vtt' | 'srt' | 'ass';
  createdAt: string;
  updatedAt: string;
}

export interface TranscriptionJob {
  id: string;
  sessionId: string;
  recordingId?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  progress: number; // 0-100
  language: string;
  speakerIdentification: boolean;
  realTimeEnabled: boolean;
  autoCorrection: boolean;
  customVocabulary?: string[];
  startedAt?: string;
  completedAt?: string;
  errorMessage?: string;
  processingTime?: number; // seconds
  wordCount?: number;
  accuracy?: number; // 0-100
}

export interface RealTimeTranscription {
  id: string;
  sessionId: string;
  speakerId: string;
  speakerName: string;
  text: string;
  confidence: number;
  isFinal: boolean;
  timestamp: string;
  language: string;
}

export interface TranscriptionSettings {
  language: string;
  enableSpeakerIdentification: boolean;
  enableRealTime: boolean;
  enableAutoCorrection: boolean;
  enablePunctuation: boolean;
  enableProfanityFilter: boolean;
  customVocabulary: string[];
  maxSpeakers: number;
  confidenceThreshold: number;
  outputFormats: ('vtt' | 'srt' | 'ass' | 'txt' | 'json')[];
}

export interface TranscriptionAnalytics {
  totalSessions: number;
  transcribedSessions: number;
  totalDuration: number; // minutes
  totalWords: number;
  averageAccuracy: number;
  languageDistribution: { language: string; count: number }[];
  speakerStats: { speakerId: string; speakerName: string; wordCount: number; talkTime: number }[];
  processingStats: {
    averageProcessingTime: number;
    successRate: number;
    errorRate: number;
  };
}

class TranscriptionService {
  // Start real-time transcription for a session
  async startRealTimeTranscription(sessionId: string, settings: Partial<TranscriptionSettings>) {
    const response = await apiClient.post(`/sessions/${sessionId}/transcription/start`, settings);
    return response.data;
  }

  // Stop real-time transcription
  async stopRealTimeTranscription(sessionId: string) {
    const response = await apiClient.post(`/sessions/${sessionId}/transcription/stop`);
    return response.data;
  }

  // Get real-time transcription stream (WebSocket connection)
  connectRealTimeTranscription(sessionId: string, onMessage: (transcription: RealTimeTranscription) => void) {
    const wsUrl = `${import.meta.env.VITE_WS_BASE_URL}/sessions/${sessionId}/transcription/live`;
    const ws = new WebSocket(wsUrl);
    
    ws.onmessage = (event) => {
      const transcription = JSON.parse(event.data);
      onMessage(transcription);
    };
    
    return ws;
  }

  // Request post-session transcription
  async requestTranscription(recordingId: string, settings: Partial<TranscriptionSettings>) {
    const response = await apiClient.post(`/recordings/${recordingId}/transcription`, settings);
    return response.data;
  }

  // Get transcription job status
  async getTranscriptionJob(jobId: string) {
    const response = await apiClient.get(`/transcription/jobs/${jobId}`);
    return response.data;
  }

  // Get transcription for recording
  async getTranscription(recordingId: string, language?: string) {
    const response = await apiClient.get(`/recordings/${recordingId}/transcription`, {
      params: { language }
    });
    return response.data;
  }

  // Get subtitle tracks for recording
  async getSubtitleTracks(recordingId: string) {
    const response = await apiClient.get(`/recordings/${recordingId}/subtitles`);
    return response.data;
  }

  // Download subtitle file
  async downloadSubtitles(recordingId: string, language: string, format: 'vtt' | 'srt' | 'ass') {
    const response = await apiClient.get(`/recordings/${recordingId}/subtitles/download`, {
      params: { language, format },
      responseType: 'blob'
    });
    return response.data;
  }

  // Edit transcription segment
  async editTranscriptionSegment(segmentId: string, newText: string) {
    const response = await apiClient.patch(`/transcription/segments/${segmentId}`, {
      text: newText
    });
    return response.data;
  }

  // Merge transcription segments
  async mergeSegments(segmentIds: string[]) {
    const response = await apiClient.post('/transcription/segments/merge', {
      segmentIds
    });
    return response.data;
  }

  // Split transcription segment
  async splitSegment(segmentId: string, splitTime: number) {
    const response = await apiClient.post(`/transcription/segments/${segmentId}/split`, {
      splitTime
    });
    return response.data;
  }

  // Search transcription content
  async searchTranscriptions(query: string, filters?: {
    sessionId?: string;
    recordingId?: string;
    speakerId?: string;
    dateFrom?: string;
    dateTo?: string;
    language?: string;
  }) {
    const response = await apiClient.get('/transcription/search', {
      params: { q: query, ...filters }
    });
    return response.data;
  }

  // Get transcription analytics
  async getTranscriptionAnalytics(filters?: {
    dateFrom?: string;
    dateTo?: string;
    courseId?: string;
    lecturerId?: string;
  }) {
    const response = await apiClient.get('/transcription/analytics', {
      params: filters
    });
    return response.data;
  }

  // Export transcription
  async exportTranscription(recordingId: string, format: 'txt' | 'docx' | 'pdf' | 'json') {
    const response = await apiClient.get(`/recordings/${recordingId}/transcription/export`, {
      params: { format },
      responseType: 'blob'
    });
    return response.data;
  }

  // Generate transcription summary
  async generateSummary(recordingId: string, options?: {
    summaryType: 'brief' | 'detailed' | 'key_points';
    includeTimestamps: boolean;
    includeSpeakerStats: boolean;
  }) {
    const response = await apiClient.post(`/recordings/${recordingId}/transcription/summary`, options);
    return response.data;
  }

  // Get speaker identification results
  async getSpeakerIdentification(recordingId: string) {
    const response = await apiClient.get(`/recordings/${recordingId}/speakers`);
    return response.data;
  }

  // Update speaker information
  async updateSpeakerInfo(recordingId: string, speakerId: string, speakerName: string) {
    const response = await apiClient.patch(`/recordings/${recordingId}/speakers/${speakerId}`, {
      name: speakerName
    });
    return response.data;
  }

  // Get transcription settings
  async getTranscriptionSettings() {
    const response = await apiClient.get('/transcription/settings');
    return response.data;
  }

  // Update transcription settings
  async updateTranscriptionSettings(settings: Partial<TranscriptionSettings>) {
    const response = await apiClient.patch('/transcription/settings', settings);
    return response.data;
  }

  // Cancel transcription job
  async cancelTranscriptionJob(jobId: string) {
    const response = await apiClient.post(`/transcription/jobs/${jobId}/cancel`);
    return response.data;
  }

  // Retry failed transcription
  async retryTranscription(jobId: string) {
    const response = await apiClient.post(`/transcription/jobs/${jobId}/retry`);
    return response.data;
  }

  // Get supported languages
  async getSupportedLanguages() {
    const response = await apiClient.get('/transcription/languages');
    return response.data;
  }

  // Validate custom vocabulary
  async validateVocabulary(words: string[]) {
    const response = await apiClient.post('/transcription/vocabulary/validate', { words });
    return response.data;
  }
}

export const transcriptionService = new TranscriptionService();
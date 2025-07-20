import { apiClient } from './api';

export interface VirtualSession {
  id: string;
  title: string;
  description: string;
  courseId: string;
  instructorId: string;
  type: 'live' | 'recorded' | 'interactive' | 'lab';
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  scheduledStart: string;
  scheduledEnd: string;
  actualStart?: string;
  actualEnd?: string;
  maxParticipants: number;
  currentParticipants: number;
  roomId: string;
  recordingEnabled: boolean;
  transcriptionEnabled: boolean;
  interactiveElementsEnabled: boolean;
  aiAssistantEnabled: boolean;
  recordingUrl?: string;
  transcriptionUrl?: string;
  materials: SessionMaterial[];
  interactiveElements: InteractiveElement[];
  settings: SessionSettings;
}

export interface SessionMaterial {
  id: string;
  title: string;
  type: 'document' | 'video' | 'audio' | 'image' | 'code' | 'dataset';
  url: string;
  size: number;
  uploadedAt: string;
  isRequired: boolean;
  accessLevel: 'public' | 'enrolled' | 'instructor';
}

export interface InteractiveElement {
  id: string;
  type: 'quiz' | 'poll' | 'discussion' | 'breakout' | 'whiteboard' | 'code_exercise';
  title: string;
  description: string;
  timestamp: number; // seconds from session start
  duration: number; // seconds
  isActive: boolean;
  configuration: any; // type-specific configuration
  responses: ElementResponse[];
  analytics: ElementAnalytics;
}

export interface ElementResponse {
  id: string;
  userId: string;
  elementId: string;
  response: any; // type-specific response data
  submittedAt: string;
  score?: number;
  feedback?: string;
}

export interface ElementAnalytics {
  totalResponses: number;
  averageScore?: number;
  completionRate: number;
  engagementLevel: number;
  responseDistribution: any;
}

export interface SessionSettings {
  autoRecording: boolean;
  autoTranscription: boolean;
  attendanceTracking: boolean;
  chatEnabled: boolean;
  screenSharing: boolean;
  breakoutRooms: boolean;
  aiModeration: boolean;
  qualitySettings: {
    video: 'SD' | 'HD' | '4K';
    audio: 'standard' | 'high' | 'studio';
    bandwidth: 'auto' | 'low' | 'medium' | 'high';
  };
  accessibilityFeatures: {
    closedCaptions: boolean;
    signLanguage: boolean;
    audioDescription: boolean;
    highContrast: boolean;
  };
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number; // hours
  prerequisites: string[];
  learningObjectives: string[];
  sessions: string[]; // session IDs
  assessments: string[]; // assessment IDs
  completionCriteria: CompletionCriteria;
  analytics: PathAnalytics;
}

export interface CompletionCriteria {
  minimumSessionAttendance: number; // percentage
  minimumAssessmentScore: number; // percentage
  requiredInteractions: number;
  timeRequirement: number; // hours
}

export interface PathAnalytics {
  enrolledStudents: number;
  completedStudents: number;
  averageCompletionTime: number;
  averageScore: number;
  dropoffPoints: DropoffPoint[];
  engagementMetrics: EngagementMetrics;
}

export interface DropoffPoint {
  sessionId: string;
  sessionTitle: string;
  dropoffRate: number;
  commonReasons: string[];
}

export interface EngagementMetrics {
  averageSessionDuration: number;
  interactionRate: number;
  questionFrequency: number;
  collaborationLevel: number;
  satisfactionScore: number;
}

export interface AIRecommendation {
  id: string;
  userId: string;
  type: 'content' | 'study_plan' | 'skill_gap' | 'peer_collaboration';
  title: string;
  description: string;
  confidence: number; // 0-100
  relevanceScore: number; // 0-100
  estimatedImpact: 'low' | 'medium' | 'high';
  actionable: boolean;
  expiresAt?: string;
  metadata: any;
}

export interface VirtualLabEnvironment {
  id: string;
  name: string;
  description: string;
  type: 'programming' | 'data_science' | 'simulation' | 'design';
  language: string;
  framework?: string;
  preInstalledPackages: string[];
  resourceLimits: {
    cpu: number; // cores
    memory: number; // GB
    storage: number; // GB
    executionTime: number; // seconds
  };
  collaborationEnabled: boolean;
  persistentStorage: boolean;
  templateFiles: LabFile[];
  exercises: LabExercise[];
}

export interface LabFile {
  id: string;
  name: string;
  path: string;
  content: string;
  language: string;
  isReadonly: boolean;
  isTemplate: boolean;
}

export interface LabExercise {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number;
  instructions: string[];
  starterCode: string;
  testCases: TestCase[];
  hints: string[];
  solution?: string;
  gradingCriteria: GradingCriteria[];
}

export interface TestCase {
  id: string;
  input: any;
  expectedOutput: any;
  description: string;
  isHidden: boolean;
  weight: number;
}

export interface GradingCriteria {
  id: string;
  name: string;
  description: string;
  maxPoints: number;
  autoGraded: boolean;
  rubric?: string[];
}

class VirtualLearningService {
  // Session Management
  async getSessions(filters?: {
    type?: string;
    status?: string;
    courseId?: string;
    dateFrom?: string;
    dateTo?: string;
  }) {
    const response = await apiClient.get('/virtual-learning/sessions', { params: filters });
    return response.data;
  }

  async createSession(sessionData: Partial<VirtualSession>) {
    const response = await apiClient.post('/virtual-learning/sessions', sessionData);
    return response.data;
  }

  async updateSession(sessionId: string, updates: Partial<VirtualSession>) {
    const response = await apiClient.patch(`/virtual-learning/sessions/${sessionId}`, updates);
    return response.data;
  }

  async joinSession(sessionId: string, deviceInfo?: any) {
    const response = await apiClient.post(`/virtual-learning/sessions/${sessionId}/join`, deviceInfo);
    return response.data;
  }

  async leaveSession(sessionId: string) {
    const response = await apiClient.post(`/virtual-learning/sessions/${sessionId}/leave`);
    return response.data;
  }

  // Interactive Elements
  async addInteractiveElement(sessionId: string, element: Partial<InteractiveElement>) {
    const response = await apiClient.post(`/virtual-learning/sessions/${sessionId}/elements`, element);
    return response.data;
  }

  async activateElement(sessionId: string, elementId: string) {
    const response = await apiClient.post(`/virtual-learning/sessions/${sessionId}/elements/${elementId}/activate`);
    return response.data;
  }

  async submitElementResponse(sessionId: string, elementId: string, response: any) {
    const response_data = await apiClient.post(`/virtual-learning/sessions/${sessionId}/elements/${elementId}/responses`, response);
    return response_data.data;
  }

  async getElementAnalytics(sessionId: string, elementId: string) {
    const response = await apiClient.get(`/virtual-learning/sessions/${sessionId}/elements/${elementId}/analytics`);
    return response.data;
  }

  // Learning Paths
  async getLearningPaths(filters?: {
    category?: string;
    difficulty?: string;
    userId?: string;
  }) {
    const response = await apiClient.get('/virtual-learning/paths', { params: filters });
    return response.data;
  }

  async enrollInPath(pathId: string) {
    const response = await apiClient.post(`/virtual-learning/paths/${pathId}/enroll`);
    return response.data;
  }

  async getPathProgress(pathId: string, userId?: string) {
    const response = await apiClient.get(`/virtual-learning/paths/${pathId}/progress`, {
      params: { userId }
    });
    return response.data;
  }

  // AI Recommendations
  async getAIRecommendations(userId: string, context?: any) {
    const response = await apiClient.get(`/virtual-learning/ai/recommendations/${userId}`, {
      params: context
    });
    return response.data;
  }

  async submitFeedback(recommendationId: string, feedback: {
    helpful: boolean;
    rating: number;
    comments?: string;
  }) {
    const response = await apiClient.post(`/virtual-learning/ai/recommendations/${recommendationId}/feedback`, feedback);
    return response.data;
  }

  // Virtual Lab Environments
  async getLabEnvironments(filters?: {
    type?: string;
    language?: string;
    courseId?: string;
  }) {
    const response = await apiClient.get('/virtual-learning/labs', { params: filters });
    return response.data;
  }

  async createLabSession(environmentId: string, exerciseId?: string) {
    const response = await apiClient.post(`/virtual-learning/labs/${environmentId}/sessions`, {
      exerciseId
    });
    return response.data;
  }

  async saveLabWork(sessionId: string, files: LabFile[]) {
    const response = await apiClient.post(`/virtual-learning/labs/sessions/${sessionId}/save`, {
      files
    });
    return response.data;
  }

  async executeCode(sessionId: string, code: string, language: string) {
    const response = await apiClient.post(`/virtual-learning/labs/sessions/${sessionId}/execute`, {
      code,
      language
    });
    return response.data;
  }

  async runTests(sessionId: string, exerciseId: string) {
    const response = await apiClient.post(`/virtual-learning/labs/sessions/${sessionId}/test`, {
      exerciseId
    });
    return response.data;
  }

  async submitExercise(sessionId: string, exerciseId: string, submission: any) {
    const response = await apiClient.post(`/virtual-learning/labs/sessions/${sessionId}/submit`, {
      exerciseId,
      submission
    });
    return response.data;
  }

  // Analytics and Reporting
  async getSessionAnalytics(sessionId: string) {
    const response = await apiClient.get(`/virtual-learning/sessions/${sessionId}/analytics`);
    return response.data;
  }

  async getUserLearningAnalytics(userId: string, timeframe?: string) {
    const response = await apiClient.get(`/virtual-learning/analytics/users/${userId}`, {
      params: { timeframe }
    });
    return response.data;
  }

  async getCourseEngagementMetrics(courseId: string) {
    const response = await apiClient.get(`/virtual-learning/analytics/courses/${courseId}/engagement`);
    return response.data;
  }

  // Content Management
  async uploadSessionMaterial(sessionId: string, formData: FormData) {
    const response = await apiClient.post(`/virtual-learning/sessions/${sessionId}/materials`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  async getSessionMaterials(sessionId: string) {
    const response = await apiClient.get(`/virtual-learning/sessions/${sessionId}/materials`);
    return response.data;
  }

  async downloadSessionRecording(sessionId: string) {
    const response = await apiClient.get(`/virtual-learning/sessions/${sessionId}/recording`, {
      responseType: 'blob'
    });
    return response.data;
  }

  // Real-time Communication
  connectToSession(sessionId: string, onMessage: (message: any) => void) {
    const wsUrl = `${import.meta.env.VITE_WS_BASE_URL}/virtual-learning/sessions/${sessionId}/ws`;
    const ws = new WebSocket(wsUrl);
    
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      onMessage(message);
    };
    
    return ws;
  }

  sendSessionMessage(ws: WebSocket, message: any) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }
}

export const virtualLearningService = new VirtualLearningService();
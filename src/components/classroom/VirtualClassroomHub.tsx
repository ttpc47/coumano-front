import React, { useState, useEffect } from 'react';
import { 
  Video, 
  Plus, 
  Calendar, 
  Clock, 
  Users, 
  Play, 
  Settings,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  Copy,
  Share2,
  Bell,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  FileText,
  BarChart3
} from 'lucide-react';
import { JitsiVirtualClassroom } from './JitsiVirtualClassroom';

interface ClassroomSession {
  id: string;
  title: string;
  course: string;
  instructor: string;
  startTime: string;
  endTime?: string;
  participants: number;
  maxParticipants: number;
  status: 'scheduled' | 'live' | 'ended';
  roomId: string;
  isRecording: boolean;
  recordingId?: string;
  autoAttendanceEnabled: boolean;
  notificationsEnabled: boolean;
  transcriptionEnabled: boolean;
  subtitlesEnabled: boolean;
  description?: string;
  recordingUrl?: string;
  transcriptionUrl?: string;
  duration?: number;
  attendanceRate?: number;
}

export const VirtualClassroomHub: React.FC = () => {
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [sessions, setSessions] = useState<ClassroomSession[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<ClassroomSession | null>(null);

  // Mock sessions data
  const mockSessions: ClassroomSession[] = [
    {
      id: '1',
      title: 'Advanced Algorithms - Dynamic Programming',
      course: 'CS301',
      instructor: 'Dr. Paul Mbarga',
      startTime: '2024-03-15T08:00:00',
      participants: 34,
      maxParticipants: 80,
      status: 'live',
      roomId: 'cs301-algo-dp-20240315',
      isRecording: true,
      recordingId: 'rec001',
      autoAttendanceEnabled: true,
      notificationsEnabled: true,
      transcriptionEnabled: true,
      subtitlesEnabled: true,
      description: 'Deep dive into dynamic programming algorithms with practical examples',
      attendanceRate: 85
    },
    {
      id: '2',
      title: 'Database Systems - Query Optimization',
      course: 'CS205',
      instructor: 'Prof. Marie Nkomo',
      startTime: '2024-03-15T14:00:00',
      participants: 0,
      maxParticipants: 50,
      status: 'scheduled',
      roomId: 'cs205-db-optimization-20240315',
      isRecording: false,
      autoAttendanceEnabled: true,
      notificationsEnabled: true,
      transcriptionEnabled: true,
      subtitlesEnabled: false,
      description: 'Advanced techniques for optimizing database queries and performance tuning'
    },
    {
      id: '3',
      title: 'Linear Algebra - Matrix Operations',
      course: 'MATH201',
      instructor: 'Dr. Jean Fotso',
      startTime: '2024-03-14T10:00:00',
      endTime: '2024-03-14T12:00:00',
      participants: 67,
      maxParticipants: 100,
      status: 'ended',
      roomId: 'math201-matrices-20240314',
      isRecording: false,
      recordingId: 'rec002',
      autoAttendanceEnabled: true,
      notificationsEnabled: true,
      transcriptionEnabled: true,
      subtitlesEnabled: true,
      description: 'Comprehensive coverage of matrix operations and their applications',
      recordingUrl: '/recordings/math201-matrices-20240314.mp4',
      transcriptionUrl: '/transcriptions/math201-matrices-20240314.vtt',
      duration: 118,
      attendanceRate: 92
    }
  ];

  useEffect(() => {
    setSessions(mockSessions);
  }, []);

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || session.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-red-100 text-red-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'ended': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'live': return <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>;
      case 'scheduled': return <Clock className="w-4 h-4" />;
      case 'ended': return <VideoOff className="w-4 h-4" />;
      default: return null;
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const handleJoinSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setSelectedSession(session);
      setActiveSession(sessionId);
    }
  };

  const handleLeaveSession = () => {
    setActiveSession(null);
    setSelectedSession(null);
  };

  const handleCreateSession = () => {
    setShowCreateModal(true);
  };

  const handleDuplicateSession = (session: ClassroomSession) => {
    const newSession: ClassroomSession = {
      ...session,
      id: Date.now().toString(),
      title: `${session.title} (Copy)`,
      roomId: `${session.roomId}-copy-${Date.now()}`,
      status: 'scheduled',
      participants: 0,
      isRecording: false
    };
    setSessions(prev => [...prev, newSession]);
  };

  const handleDeleteSession = (sessionId: string) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      setSessions(prev => prev.filter(s => s.id !== sessionId));
    }
  };

  // If in active session, show the classroom
  if (activeSession && selectedSession) {
    return (
      <JitsiVirtualClassroom
        session={selectedSession}
        onSessionEnd={handleLeaveSession}
        onParticipantCountChange={(count) => {
          setSessions(prev => prev.map(s => 
            s.id === activeSession ? { ...s, participants: count } : s
          ));
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Virtual Classroom Hub</h1>
          <p className="text-gray-600 mt-1">Manage and join virtual learning sessions with advanced features</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
          <button 
            onClick={handleCreateSession}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Create Session</span>
          </button>
        </div>
      </div>

      {/* Enhanced Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-100 rounded-xl">
              <Video className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">HD Recording</p>
              <p className="text-lg font-bold text-gray-900">Automatic</p>
              <p className="text-xs text-gray-500">With transcription</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Live Subtitles</p>
              <p className="text-lg font-bold text-gray-900">Multi-language</p>
              <p className="text-xs text-gray-500">Real-time AI</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-xl">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Smart Attendance</p>
              <p className="text-lg font-bold text-gray-900">Automatic</p>
              <p className="text-xs text-gray-500">Connection tracking</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-xl">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Analytics</p>
              <p className="text-lg font-bold text-gray-900">Real-time</p>
              <p className="text-xs text-gray-500">Engagement metrics</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search sessions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Sessions</option>
            <option value="live">Live Sessions</option>
            <option value="scheduled">Scheduled</option>
            <option value="ended">Completed</option>
          </select>

          <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Filter className="w-4 h-4" />
            <span>More Filters</span>
          </button>

          <div className="text-sm text-gray-600 flex items-center">
            Showing {filteredSessions.length} of {sessions.length} sessions
          </div>
        </div>
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        {filteredSessions.map((session) => (
          <div key={session.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{session.title}</h3>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(session.status)}
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(session.status)}`}>
                      {session.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-3">{session.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{session.course}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{session.participants}/{session.maxParticipants}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>
                      {session.status === 'ended' && session.duration 
                        ? formatDuration(session.duration)
                        : formatTime(session.startTime)
                      }
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span>{session.instructor}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {session.isRecording && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                      Recording
                    </span>
                  )}
                  {session.transcriptionEnabled && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      Transcription
                    </span>
                  )}
                  {session.subtitlesEnabled && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                      Subtitles
                    </span>
                  )}
                  {session.autoAttendanceEnabled && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      Auto-Attendance
                    </span>
                  )}
                  {session.attendanceRate && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                      {session.attendanceRate}% Attendance
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                {session.status === 'live' && (
                  <button
                    onClick={() => handleJoinSession(session.id)}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    <Video className="w-4 h-4" />
                    <span>Join Live</span>
                  </button>
                )}
                
                {session.status === 'scheduled' && (
                  <button
                    onClick={() => handleJoinSession(session.id)}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <Video className="w-4 h-4" />
                    <span>Join Session</span>
                  </button>
                )}
                
                {session.status === 'ended' && session.recordingUrl && (
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Play className="w-4 h-4" />
                    <span>Watch Recording</span>
                  </button>
                )}

                {/* Action Menu */}
                <div className="relative group">
                  <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                    <Settings className="w-4 h-4" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                    </button>
                    <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <Edit className="w-4 h-4" />
                      <span>Edit Session</span>
                    </button>
                    <button
                      onClick={() => handleDuplicateSession(session)}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Duplicate</span>
                    </button>
                    <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <Share2 className="w-4 h-4" />
                      <span>Share Link</span>
                    </button>
                    {session.transcriptionUrl && (
                      <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <Download className="w-4 h-4" />
                        <span>Download Transcript</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteSession(session.id)}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Session</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSessions.length === 0 && (
        <div className="text-center py-12">
          <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions found</h3>
          <p className="text-gray-600 mb-4">No virtual classroom sessions match your search criteria.</p>
          <button 
            onClick={handleCreateSession}
            className="px-4 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all duration-200"
          >
            Create First Session
          </button>
        </div>
      )}
    </div>
  );
};
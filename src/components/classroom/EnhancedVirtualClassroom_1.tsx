import React, { useState, useEffect } from 'react';
import { Video, VideoOff, Mic, MicOff, Users, MessageCircle, Share, Settings, Monitor, Phone, Calendar, Clock, User, Plus, SwordIcon as Record, Square, FileText, Download, Bell, BellOff } from 'lucide-react';
import { recordingService } from '../../services/recordingService';
import { attendanceService } from '../../services/attendanceService';
import { notificationService } from '../../services/notificationService';

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
}

export const EnhancedVirtualClassroom: React.FC = () => {
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [attendanceCount, setAttendanceCount] = useState(0);

  const mockSessions: ClassroomSession[] = [
    {
      id: '1',
      title: 'Advanced Algorithms - Lecture 5',
      course: 'CS301',
      instructor: 'Dr. Paul Mbarga',
      startTime: '2024-03-15T08:00:00',
      participants: 34,
      maxParticipants: 80,
      status: 'live',
      roomId: 'cs301-algo-lec5',
      isRecording: true,
      recordingId: 'rec001',
      autoAttendanceEnabled: true,
      notificationsEnabled: true
    },
    {
      id: '2',
      title: 'Database Systems - Practical Session',
      course: 'CS205',
      instructor: 'Prof. Marie Nkomo',
      startTime: '2024-03-15T14:00:00',
      participants: 0,
      maxParticipants: 50,
      status: 'scheduled',
      roomId: 'cs205-db-prac',
      isRecording: false,
      autoAttendanceEnabled: true,
      notificationsEnabled: true
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleStartRecording = async (sessionId: string) => {
    try {
      await recordingService.startRecording(sessionId, {
        quality: 'HD',
        autoTranscribe: true,
        generateSummary: true
      });
      setIsRecording(true);
      setRecordingDuration(0);
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const handleStopRecording = async (sessionId: string) => {
    try {
      await recordingService.stopRecording(sessionId);
      setIsRecording(false);
      setRecordingDuration(0);
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };

  const handleJoinSession = async (sessionId: string) => {
    try {
      // Record user connection
      await attendanceService.recordConnection(sessionId, {
        userId: 'current-user-id',
        connectTime: new Date().toISOString(),
        ipAddress: '192.168.1.100',
        device: 'Chrome on Windows',
        location: 'Yaoundé, Cameroon'
      });
      
      setActiveSession(sessionId);
      setAttendanceCount(prev => prev + 1);
    } catch (error) {
      console.error('Failed to join session:', error);
    }
  };

  const handleLeaveSession = async (sessionId: string) => {
    try {
      // Record user disconnection
      await attendanceService.recordDisconnection(sessionId, {
        userId: 'current-user-id',
        disconnectTime: new Date().toISOString(),
        reason: 'manual'
      });
      
      setActiveSession(null);
      setAttendanceCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to leave session:', error);
    }
  };

  const handleScheduleSession = async (sessionData: any) => {
    try {
      // Send notifications to enrolled students
      await notificationService.sendSessionNotification({
        sessionId: sessionData.id,
        type: 'scheduled',
        recipients: sessionData.enrolledStudents,
        sendImmediately: true
      });
    } catch (error) {
      console.error('Failed to send session notifications:', error);
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

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

  if (activeSession) {
    const session = mockSessions.find(s => s.id === activeSession);
    
    return (
      <div className="h-screen bg-gray-900 flex flex-col">
        {/* Session Header */}
        <div className="bg-gray-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-white text-xl font-semibold">{session?.title}</h1>
            {session?.isRecording && (
              <div className="flex items-center space-x-2 bg-red-600 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-white text-sm font-medium">
                  REC {formatDuration(recordingDuration)}
                </span>
              </div>
            )}
            {session?.autoAttendanceEnabled && (
              <div className="flex items-center space-x-2 bg-green-600 px-3 py-1 rounded-full">
                <Users className="w-3 h-3 text-white" />
                <span className="text-white text-sm font-medium">Auto-tracking</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4 text-white">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span className="text-sm">{attendanceCount} participants</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{formatDuration(recordingDuration)}</span>
            </div>
          </div>
        </div>

        {/* Video Area */}
        <div className="flex-1 bg-black relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Virtual classroom integration</p>
              <p className="text-sm opacity-75 mt-2">Jitsi Meet would be embedded here</p>
            </div>
          </div>
          
          {/* Enhanced Controls Overlay */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <div className="bg-gray-800 bg-opacity-90 rounded-full px-6 py-3 flex items-center space-x-4">
              <button
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`p-3 rounded-full transition-colors ${
                  isVideoOn ? 'bg-gray-700 text-white' : 'bg-red-600 text-white'
                }`}
              >
                {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>
              
              <button
                onClick={() => setIsAudioOn(!isAudioOn)}
                className={`p-3 rounded-full transition-colors ${
                  isAudioOn ? 'bg-gray-700 text-white' : 'bg-red-600 text-white'
                }`}
              >
                {isAudioOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>
              
              {/* Recording Controls */}
              {!isRecording ? (
                <button
                  onClick={() => handleStartRecording(activeSession)}
                  className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                  title="Start Recording"
                >
                  <Record className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={() => handleStopRecording(activeSession)}
                  className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                  title="Stop Recording"
                >
                  <Square className="w-5 h-5" />
                </button>
              )}
              
              <button className="p-3 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors">
                <Share className="w-5 h-5" />
              </button>
              
              <button className="p-3 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors">
                <MessageCircle className="w-5 h-5" />
              </button>
              
              <button className="p-3 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors">
                <Users className="w-5 h-5" />
              </button>
              
              <button className="p-3 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => handleLeaveSession(activeSession)}
                className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
              >
                <Phone className="w-5 h-5 rotate-[135deg]" />
              </button>
            </div>
          </div>

          {/* Session Info Overlay */}
          <div className="absolute top-4 right-4 bg-gray-800 bg-opacity-90 rounded-lg p-4 text-white">
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{session?.course}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>{session?.instructor}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>{attendanceCount}/{session?.maxParticipants}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Enhanced Virtual Classroom</h1>
          <p className="text-gray-600 mt-1">Join live classes with automatic recording and attendance tracking</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Session</span>
        </button>
      </div>

      {/* Enhanced Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-100 rounded-xl">
              <Record className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Auto Recording</p>
              <p className="text-lg font-bold text-gray-900">Enabled</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-xl">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Auto Attendance</p>
              <p className="text-lg font-bold text-gray-900">Active</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Transcription</p>
              <p className="text-lg font-bold text-gray-900">AI Powered</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-100 rounded-xl">
              <Bell className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Notifications</p>
              <p className="text-lg font-bold text-gray-900">Smart Alerts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Live Sessions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Sessions</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockSessions.filter(s => s.status === 'live').map((session) => (
            <div key={session.id} className="border border-red-200 bg-red-50 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{session.title}</h3>
                  <p className="text-sm text-gray-600">{session.course} • {session.instructor}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(session.status)}
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(session.status)}`}>
                    LIVE
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white rounded-lg p-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                    <Users className="w-4 h-4" />
                    <span>Participants</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {session.participants}/{session.maxParticipants}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                    <Record className="w-4 h-4" />
                    <span>Recording</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {session.isRecording ? 'Active' : 'Stopped'}
                  </p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {session.autoAttendanceEnabled && (
                  <div className="flex items-center space-x-2 text-sm text-green-600">
                    <Users className="w-4 h-4" />
                    <span>Automatic attendance tracking enabled</span>
                  </div>
                )}
                {session.isRecording && (
                  <div className="flex items-center space-x-2 text-sm text-red-600">
                    <Record className="w-4 h-4" />
                    <span>Session being recorded and will be transcribed</span>
                  </div>
                )}
                {session.notificationsEnabled && (
                  <div className="flex items-center space-x-2 text-sm text-blue-600">
                    <Bell className="w-4 h-4" />
                    <span>Participants notified of session updates</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleJoinSession(session.id)}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                <Video className="w-4 h-4" />
                <span>Join Live Session</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Scheduled Sessions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Scheduled Sessions</h2>
        <div className="space-y-4">
          {mockSessions.filter(s => s.status === 'scheduled').map((session) => (
            <div key={session.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                    <Video className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{session.title}</h3>
                    <p className="text-sm text-gray-600">{session.course} • {session.instructor}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                      <span>Starts at {new Date(session.startTime).toLocaleTimeString()}</span>
                      <span>Max {session.maxParticipants} participants</span>
                      {session.autoAttendanceEnabled && <span>Auto-tracking enabled</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(session.status)}`}>
                    Scheduled
                  </span>
                  <button
                    onClick={() => handleJoinSession(session.id)}
                    className="px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors text-sm font-medium"
                  >
                    Join Session
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Features */}
      <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl p-6">
        <div className="text-center">
          <Monitor className="w-12 h-12 text-primary-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Enhanced Learning Experience</h3>
          <p className="text-gray-600 mb-4">
            Every session is automatically recorded, transcribed, and attendance is tracked with detailed connection logs
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white rounded-lg p-4">
              <Record className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900">Auto Recording</h4>
              <p className="text-sm text-gray-600">All sessions recorded in HD quality</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900">AI Transcription</h4>
              <p className="text-sm text-gray-600">Automatic speech-to-text with summaries</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900">Smart Attendance</h4>
              <p className="text-sm text-gray-600">Detailed connection tracking and analytics</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Users, 
  MessageCircle,
  Share,
  Settings,
  Monitor,
  Phone,
  Calendar,
  Clock,
  User,
  Plus
} from 'lucide-react';

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
}

export const VirtualClassroom: React.FC = () => {
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);

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
      isRecording: true
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
      isRecording: false
    },
    {
      id: '3',
      title: 'Linear Algebra - Tutorial',
      course: 'MATH201',
      instructor: 'Dr. Jean Fotso',
      startTime: '2024-03-15T10:00:00',
      endTime: '2024-03-15T12:00:00',
      participants: 23,
      maxParticipants: 100,
      status: 'ended',
      roomId: 'math201-tutorial',
      isRecording: false
    }
  ];

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

  const joinSession = (sessionId: string) => {
    setActiveSession(sessionId);
    // In a real implementation, this would integrate with Jitsi Meet API
    console.log(`Joining session: ${sessionId}`);
  };

  const leaveSession = () => {
    setActiveSession(null);
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
                <span className="text-white text-sm font-medium">Recording</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2 text-white">
            <Users className="w-4 h-4" />
            <span className="text-sm">{session?.participants} participants</span>
          </div>
        </div>

        {/* Video Area */}
        <div className="flex-1 bg-black relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Virtual classroom would load here</p>
              <p className="text-sm opacity-75 mt-2">Jitsi Meet integration placeholder</p>
            </div>
          </div>
          
          {/* Video Controls Overlay */}
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
              
              <button className="p-3 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors">
                <Share className="w-5 h-5" />
              </button>
              
              <button className="p-3 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors">
                <MessageCircle className="w-5 h-5" />
              </button>
              
              <button className="p-3 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              
              <button
                onClick={leaveSession}
                className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
              >
                <Phone className="w-5 h-5 rotate-[135deg]" />
              </button>
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
          <h1 className="text-3xl font-bold text-gray-900">Virtual Classroom</h1>
          <p className="text-gray-600 mt-1">Join live classes and manage virtual sessions</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Create Session</span>
        </button>
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

              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Started at {formatTime(session.startTime)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{session.participants}/{session.maxParticipants}</span>
                  </div>
                </div>
                {session.isRecording && (
                  <div className="flex items-center space-x-1 text-red-600">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium">Recording</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => joinSession(session.id)}
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
                      <span>Starts at {formatTime(session.startTime)}</span>
                      <span>Max {session.maxParticipants} participants</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(session.status)}`}>
                    Scheduled
                  </span>
                  <button
                    onClick={() => joinSession(session.id)}
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

      {/* Recent Sessions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Sessions</h2>
        <div className="space-y-4">
          {mockSessions.filter(s => s.status === 'ended').map((session) => (
            <div key={session.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <VideoOff className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{session.title}</h3>
                    <p className="text-sm text-gray-600">{session.course} • {session.instructor}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                      <span>{formatTime(session.startTime)} - {session.endTime && formatTime(session.endTime)}</span>
                      <span>{session.participants} participants</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(session.status)}`}>
                    Ended
                  </span>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                    View Recording
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Start */}
      <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl p-6">
        <div className="text-center">
          <Monitor className="w-12 h-12 text-primary-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Instant Meeting</h3>
          <p className="text-gray-600 mb-4">
            Create an instant classroom session for ad-hoc discussions or impromptu lectures
          </p>
          <button className="px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all duration-200 font-medium">
            Start Instant Session
          </button>
        </div>
      </div>
    </div>
  );
};
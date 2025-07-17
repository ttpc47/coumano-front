import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  Calendar, 
  Search,
  Filter,
  Download,
  Plus,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Activity,
  Wifi,
  WifiOff,
  MapPin,
  Smartphone
} from 'lucide-react';
import { attendanceService, AttendanceRecord, AttendanceSession } from '../../services/attendanceService';

export const EnhancedAttendanceManagement: React.FC = () => {
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<AttendanceSession | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'sessions' | 'records' | 'analytics'>('sessions');

  useEffect(() => {
    loadSessions();
  }, [selectedCourse, selectedDate]);

  useEffect(() => {
    if (selectedSession) {
      loadSessionAttendance(selectedSession.id);
    }
  }, [selectedSession]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockSessions: AttendanceSession[] = [
        {
          id: '1',
          courseId: 'cs301',
          courseName: 'CS301 - Advanced Algorithms',
          lecturerId: 'lec001',
          lecturerName: 'Dr. Paul Mbarga',
          title: 'Dynamic Programming Algorithms',
          scheduledStart: '2024-03-15T08:00:00',
          scheduledEnd: '2024-03-15T10:00:00',
          actualStart: '2024-03-15T08:05:00',
          actualEnd: '2024-03-15T09:58:00',
          status: 'completed',
          totalStudents: 67,
          presentStudents: 62,
          attendanceRate: 92.5,
          recordingId: 'rec001',
          isRecorded: true,
          autoAttendanceEnabled: true
        },
        {
          id: '2',
          courseId: 'cs205',
          courseName: 'CS205 - Database Systems',
          lecturerId: 'lec002',
          lecturerName: 'Prof. Marie Nkomo',
          title: 'SQL Query Optimization',
          scheduledStart: '2024-03-15T14:00:00',
          scheduledEnd: '2024-03-15T17:00:00',
          status: 'live',
          totalStudents: 45,
          presentStudents: 38,
          attendanceRate: 84.4,
          isRecorded: true,
          autoAttendanceEnabled: true
        }
      ];
      setSessions(mockSessions);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSessionAttendance = async (sessionId: string) => {
    try {
      // Mock data - replace with actual API call
      const mockRecords: AttendanceRecord[] = [
        {
          id: '1',
          sessionId,
          userId: 'stu001',
          userName: 'Aminata Fouda',
          userRole: 'student',
          status: 'present',
          connectTime: '2024-03-15T08:03:00',
          disconnectTime: '2024-03-15T09:57:00',
          totalDuration: 114,
          connectionEvents: [
            {
              id: '1',
              type: 'connect',
              timestamp: '2024-03-15T08:03:00'
            },
            {
              id: '2',
              type: 'disconnect',
              timestamp: '2024-03-15T08:45:00',
              duration: 42,
              reason: 'network'
            },
            {
              id: '3',
              type: 'reconnect',
              timestamp: '2024-03-15T08:47:00'
            },
            {
              id: '4',
              type: 'disconnect',
              timestamp: '2024-03-15T09:57:00',
              duration: 70,
              reason: 'manual'
            }
          ],
          ipAddress: '192.168.1.100',
          device: 'Chrome on Windows',
          location: 'Yaoundé, Cameroon'
        },
        {
          id: '2',
          sessionId,
          userId: 'stu002',
          userName: 'Claude Njomo',
          userRole: 'student',
          status: 'late',
          connectTime: '2024-03-15T08:15:00',
          disconnectTime: '2024-03-15T09:58:00',
          totalDuration: 103,
          connectionEvents: [
            {
              id: '1',
              type: 'connect',
              timestamp: '2024-03-15T08:15:00'
            },
            {
              id: '2',
              type: 'disconnect',
              timestamp: '2024-03-15T09:58:00',
              duration: 103,
              reason: 'manual'
            }
          ],
          ipAddress: '192.168.1.101',
          device: 'Safari on iPhone',
          location: 'Douala, Cameroon'
        }
      ];
      setAttendanceRecords(mockRecords);
    } catch (error) {
      console.error('Failed to load attendance records:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      case 'left_early': return 'bg-orange-100 text-orange-800';
      case 'live': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'absent': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'late': return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'left_early': return <Clock className="w-4 h-4 text-orange-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Enhanced Attendance Management</h1>
          <p className="text-gray-600 mt-1">Track detailed attendance with connection timestamps and analytics</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all duration-200">
            <Plus className="w-4 h-4" />
            <span>New Session</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Courses</option>
            <option value="cs301">CS301 - Advanced Algorithms</option>
            <option value="cs205">CS205 - Database Systems</option>
            <option value="math201">MATH201 - Linear Algebra</option>
          </select>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />

          <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Filter className="w-4 h-4" />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'sessions', label: 'Sessions', icon: Calendar },
              { id: 'records', label: 'Detailed Records', icon: UserCheck },
              { id: 'analytics', label: 'Analytics', icon: Activity }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'sessions' && (
            <div className="space-y-4">
              {sessions.map((session) => (
                <div 
                  key={session.id} 
                  className={`border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow cursor-pointer ${
                    selectedSession?.id === session.id ? 'ring-2 ring-primary-500 border-primary-500' : ''
                  }`}
                  onClick={() => setSelectedSession(session)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{session.title}</h3>
                      <p className="text-sm text-gray-600">{session.courseName} • {session.lecturerName}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                        <span>Scheduled: {formatTime(session.scheduledStart)} - {formatTime(session.scheduledEnd)}</span>
                        {session.actualStart && (
                          <span>Actual: {formatTime(session.actualStart)} - {session.actualEnd ? formatTime(session.actualEnd) : 'Ongoing'}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(session.status)}`}>
                        {session.status}
                      </span>
                      {session.isRecorded && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                          Recorded
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{session.totalStudents}</p>
                      <p className="text-sm text-gray-600">Total Students</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{session.presentStudents}</p>
                      <p className="text-sm text-gray-600">Present</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">{session.totalStudents - session.presentStudents}</p>
                      <p className="text-sm text-gray-600">Absent</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary-600">{session.attendanceRate.toFixed(1)}%</p>
                      <p className="text-sm text-gray-600">Attendance Rate</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>Attendance Progress</span>
                      <span className="font-medium">{session.attendanceRate.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full" 
                        style={{width: `${session.attendanceRate}%`}}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm">
                    {session.autoAttendanceEnabled && (
                      <div className="flex items-center space-x-1 text-green-600">
                        <Activity className="w-4 h-4" />
                        <span>Auto-tracking enabled</span>
                      </div>
                    )}
                    {session.recordingId && (
                      <div className="flex items-center space-x-1 text-blue-600">
                        <Calendar className="w-4 h-4" />
                        <span>Recording available</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'records' && selectedSession && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{selectedSession.title}</h3>
                <p className="text-sm text-gray-600">{selectedSession.courseName} • {selectedSession.lecturerName}</p>
              </div>

              <div className="space-y-4">
                {attendanceRecords.map((record) => (
                  <div key={record.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {record.userName.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{record.userName}</h4>
                          <p className="text-sm text-gray-600 capitalize">{record.userRole}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center space-x-1 px-2 py-1 text-sm font-medium rounded-full ${getStatusColor(record.status)}`}>
                          {getStatusIcon(record.status)}
                          <span>{record.status.replace('_', ' ')}</span>
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatDuration(record.totalDuration)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                          <Wifi className="w-4 h-4" />
                          <span>Connection Times</span>
                        </div>
                        <div className="space-y-1">
                          {record.connectTime && (
                            <p className="text-sm">
                              <span className="font-medium">Connected:</span> {formatTime(record.connectTime)}
                            </p>
                          )}
                          {record.disconnectTime && (
                            <p className="text-sm">
                              <span className="font-medium">Disconnected:</span> {formatTime(record.disconnectTime)}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                          <Smartphone className="w-4 h-4" />
                          <span>Device Info</span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm">
                            <span className="font-medium">Device:</span> {record.device}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">IP:</span> {record.ipAddress}
                          </p>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                          <MapPin className="w-4 h-4" />
                          <span>Location</span>
                        </div>
                        <p className="text-sm">
                          <span className="font-medium">Location:</span> {record.location}
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-3">Connection Events</h5>
                      <div className="space-y-2">
                        {record.connectionEvents.map((event) => (
                          <div key={event.id} className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2">
                              {event.type === 'connect' || event.type === 'reconnect' ? (
                                <Wifi className="w-4 h-4 text-green-600" />
                              ) : (
                                <WifiOff className="w-4 h-4 text-red-600" />
                              )}
                              <span className="capitalize font-medium">{event.type}</span>
                              <span className="text-gray-600">{formatTime(event.timestamp)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {event.duration && (
                                <span className="text-gray-600">{formatDuration(event.duration)}</span>
                              )}
                              {event.reason && (
                                <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs">
                                  {event.reason}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Average Session Duration</h3>
                  <p className="text-3xl font-bold text-primary-600">1h 45m</p>
                  <p className="text-sm text-gray-600 mt-2">Across all sessions</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Peak Attendance Time</h3>
                  <p className="text-3xl font-bold text-green-600">08:15</p>
                  <p className="text-sm text-gray-600 mt-2">Most students connect</p>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Connection Stability</h3>
                  <p className="text-3xl font-bold text-yellow-600">94%</p>
                  <p className="text-sm text-gray-600 mt-2">Sessions without issues</p>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Attendance Patterns</h3>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Attendance analytics chart would be displayed here</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
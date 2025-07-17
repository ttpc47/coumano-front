import React, { useState } from 'react';
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
  AlertCircle
} from 'lucide-react';

interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  course: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  timeIn?: string;
  notes?: string;
}

interface AttendanceSession {
  id: string;
  course: string;
  lecturer: string;
  date: string;
  startTime: string;
  endTime: string;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  status: 'scheduled' | 'active' | 'completed';
}

export const AttendanceManagement: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'sessions' | 'records'>('sessions');

  const mockSessions: AttendanceSession[] = [
    {
      id: '1',
      course: 'CS301 - Advanced Algorithms',
      lecturer: 'Dr. Paul Mbarga',
      date: '2024-03-15',
      startTime: '08:00',
      endTime: '10:00',
      totalStudents: 67,
      presentCount: 62,
      absentCount: 3,
      lateCount: 2,
      status: 'completed'
    },
    {
      id: '2',
      course: 'CS205 - Database Systems',
      lecturer: 'Prof. Marie Nkomo',
      date: '2024-03-15',
      startTime: '14:00',
      endTime: '17:00',
      totalStudents: 45,
      presentCount: 0,
      absentCount: 0,
      lateCount: 0,
      status: 'active'
    },
    {
      id: '3',
      course: 'MATH201 - Linear Algebra',
      lecturer: 'Dr. Jean Fotso',
      date: '2024-03-16',
      startTime: '10:00',
      endTime: '12:00',
      totalStudents: 89,
      presentCount: 0,
      absentCount: 0,
      lateCount: 0,
      status: 'scheduled'
    }
  ];

  const mockRecords: AttendanceRecord[] = [
    {
      id: '1',
      studentId: 'STU2024001',
      studentName: 'Aminata Fouda',
      course: 'CS301',
      date: '2024-03-15',
      status: 'present',
      timeIn: '08:05'
    },
    {
      id: '2',
      studentId: 'STU2024002',
      studentName: 'Claude Njomo',
      course: 'CS301',
      date: '2024-03-15',
      status: 'late',
      timeIn: '08:15',
      notes: 'Traffic delay'
    },
    {
      id: '3',
      studentId: 'STU2024003',
      studentName: 'Sarah Biya',
      course: 'CS301',
      date: '2024-03-15',
      status: 'absent',
      notes: 'Sick leave'
    },
    {
      id: '4',
      studentId: 'STU2024004',
      studentName: 'Jean Fotso',
      course: 'CS301',
      date: '2024-03-15',
      status: 'present',
      timeIn: '07:58'
    }
  ];

  const courses = ['CS301', 'CS205', 'CS302', 'MATH201', 'PHYS101'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      case 'excused': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
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
      case 'excused': return <CheckCircle className="w-4 h-4 text-blue-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getAttendanceRate = (session: AttendanceSession) => {
    if (session.status === 'scheduled') return 0;
    return Math.round((session.presentCount / session.totalStudents) * 100);
  };

  const filteredSessions = mockSessions.filter(session => {
    const matchesCourse = selectedCourse === 'all' || session.course.includes(selectedCourse);
    const matchesDate = !selectedDate || session.date === selectedDate;
    const matchesSearch = session.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.lecturer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCourse && matchesDate && matchesSearch;
  });

  const filteredRecords = mockRecords.filter(record => {
    const matchesCourse = selectedCourse === 'all' || record.course === selectedCourse;
    const matchesDate = !selectedDate || record.date === selectedDate;
    const matchesSearch = record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCourse && matchesDate && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
          <p className="text-gray-600 mt-1">Track and manage student attendance</p>
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
            {courses.map(course => (
              <option key={course} value={course}>{course}</option>
            ))}
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-primary-100 rounded-xl">
              <Calendar className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sessions</p>
              <p className="text-2xl font-bold text-gray-900">{mockSessions.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Present Today</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockSessions.reduce((sum, s) => sum + s.presentCount, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-100 rounded-xl">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Absent Today</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockSessions.reduce((sum, s) => sum + s.absentCount, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-100 rounded-xl">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Late Today</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockSessions.reduce((sum, s) => sum + s.lateCount, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('sessions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'sessions'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Attendance Sessions
            </button>
            <button
              onClick={() => setActiveTab('records')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'records'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Individual Records
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'sessions' ? (
            <div className="space-y-4">
              {filteredSessions.map((session) => (
                <div key={session.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{session.course}</h3>
                      <p className="text-sm text-gray-600">{session.lecturer}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                        <span>{session.date}</span>
                        <span>{session.startTime} - {session.endTime}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(session.status)}`}>
                      {session.status}
                    </span>
                  </div>

                  {session.status !== 'scheduled' && (
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">{session.totalStudents}</p>
                        <p className="text-sm text-gray-600">Total</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{session.presentCount}</p>
                        <p className="text-sm text-gray-600">Present</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-red-600">{session.absentCount}</p>
                        <p className="text-sm text-gray-600">Absent</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-yellow-600">{session.lateCount}</p>
                        <p className="text-sm text-gray-600">Late</p>
                      </div>
                    </div>
                  )}

                  {session.status !== 'scheduled' && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span>Attendance Rate</span>
                        <span className="font-medium">{getAttendanceRate(session)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full" 
                          style={{width: `${getAttendanceRate(session)}%`}}
                        ></div>
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-3">
                    {session.status === 'scheduled' && (
                      <button className="flex items-center space-x-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors">
                        <UserCheck className="w-4 h-4" />
                        <span>Start Attendance</span>
                      </button>
                    )}
                    {session.status === 'active' && (
                      <button className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                        <Users className="w-4 h-4" />
                        <span>Manage Attendance</span>
                      </button>
                    )}
                    {session.status === 'completed' && (
                      <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                        <Download className="w-4 h-4" />
                        <span>Export Report</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time In
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{record.studentName}</p>
                          <p className="text-sm text-gray-500">{record.studentId}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.course}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(record.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(record.status)}
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                            {record.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.timeIn || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.notes || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
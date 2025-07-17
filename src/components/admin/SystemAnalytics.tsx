import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  BookOpen, 
  Video,
  TrendingUp,
  Calendar,
  Clock,
  Activity,
  Download,
  RefreshCw,
  Filter
} from 'lucide-react';
import { apiClient } from '../../services/api';

interface AnalyticsData {
  userStats: {
    totalUsers: number;
    activeUsers: number;
    newUsersThisMonth: number;
    usersByRole: { role: string; count: number }[];
  };
  sessionStats: {
    totalSessions: number;
    liveSessions: number;
    averageAttendance: number;
    totalHours: number;
  };
  courseStats: {
    totalCourses: number;
    activeCourses: number;
    averageEnrollment: number;
    topCourses: { name: string; enrollment: number }[];
  };
  systemStats: {
    uptime: string;
    averageResponseTime: number;
    totalStorage: number;
    usedStorage: number;
  };
}

export const SystemAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getAnalytics({ timeRange });
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
      // Mock data for development
      setAnalytics({
        userStats: {
          totalUsers: 1247,
          activeUsers: 892,
          newUsersThisMonth: 156,
          usersByRole: [
            { role: 'Students', count: 1089 },
            { role: 'Lecturers', count: 89 },
            { role: 'Admins', count: 12 }
          ]
        },
        sessionStats: {
          totalSessions: 342,
          liveSessions: 8,
          averageAttendance: 78.5,
          totalHours: 1456
        },
        courseStats: {
          totalCourses: 156,
          activeCourses: 134,
          averageEnrollment: 45.2,
          topCourses: [
            { name: 'Advanced Algorithms', enrollment: 89 },
            { name: 'Database Systems', enrollment: 76 },
            { name: 'Linear Algebra', enrollment: 67 }
          ]
        },
        systemStats: {
          uptime: '99.8%',
          averageResponseTime: 245,
          totalStorage: 500,
          usedStorage: 287
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAnalytics();
    setRefreshing(false);
  };

  const exportReport = async () => {
    try {
      const blob = await apiClient.get('/analytics/export', { 
        timeRange,
        format: 'pdf'
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-report-${timeRange}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to export report:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Analytics</h1>
          <p className="text-gray-600 mt-1">Monitor system performance and usage statistics</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={exportReport}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{analytics?.userStats.totalUsers}</p>
              <p className="text-sm text-green-600 mt-1">
                +{analytics?.userStats.newUsersThisMonth} this month
              </p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Sessions</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{analytics?.sessionStats.liveSessions}</p>
              <p className="text-sm text-blue-600 mt-1">
                {analytics?.sessionStats.totalSessions} total sessions
              </p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-secondary-500 to-secondary-600">
              <Video className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Attendance</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{analytics?.sessionStats.averageAttendance}%</p>
              <p className="text-sm text-green-600 mt-1">
                {analytics?.sessionStats.totalHours}h total
              </p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">System Uptime</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{analytics?.systemStats.uptime}</p>
              <p className="text-sm text-gray-600 mt-1">
                {analytics?.systemStats.averageResponseTime}ms avg response
              </p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600">
              <Activity className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Distribution</h3>
          <div className="space-y-4">
            {analytics?.userStats.usersByRole.map((role, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{role.role}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full" 
                      style={{width: `${(role.count / (analytics?.userStats.totalUsers || 1)) * 100}%`}}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-gray-900 w-12 text-right">{role.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Courses */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Popular Courses</h3>
          <div className="space-y-4">
            {analytics?.courseStats.topCourses.map((course, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{course.name}</p>
                  <p className="text-xs text-gray-500">{course.enrollment} students enrolled</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-secondary-600 h-2 rounded-full" 
                      style={{width: `${(course.enrollment / 100) * 100}%`}}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{course.enrollment}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Performance */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 relative">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="2"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeDasharray={`${99.8}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-900">{analytics?.systemStats.uptime}</span>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600">Uptime</p>
          </div>

          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 relative">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="2"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeDasharray={`${(analytics?.systemStats.usedStorage || 0) / (analytics?.systemStats.totalStorage || 1) * 100}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-gray-900">
                  {analytics?.systemStats.usedStorage}GB
                </span>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600">Storage Used</p>
            <p className="text-xs text-gray-500">of {analytics?.systemStats.totalStorage}GB</p>
          </div>

          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{analytics?.systemStats.averageResponseTime}</p>
                <p className="text-xs text-gray-500">ms</p>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
          </div>
        </div>
      </div>
    </div>
  );
};
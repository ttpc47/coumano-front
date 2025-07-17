import React from 'react';
import { 
  Users, 
  Building2, 
  BookOpen, 
  UserCheck, 
  TrendingUp, 
  Calendar,
  GraduationCap,
  AlertCircle
} from 'lucide-react';

const StatCard: React.FC<{
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  color: string;
}> = ({ title, value, icon, trend, trendUp, color }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        {trend && (
          <div className={`flex items-center mt-2 ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className={`w-4 h-4 mr-1 ${!trendUp && 'rotate-180'}`} />
            <span className="text-sm font-medium">{trend}</span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        {icon}
      </div>
    </div>
  </div>
);

export const AdminDashboard: React.FC = () => {
  const stats = [
    {
      title: 'Total Students',
      value: '1,247',
      icon: <Users className="w-6 h-6 text-white" />,
      trend: '+12% from last month',
      trendUp: true,
      color: 'bg-gradient-to-br from-primary-500 to-primary-600'
    },
    {
      title: 'Active Lecturers',
      value: '89',
      icon: <UserCheck className="w-6 h-6 text-white" />,
      trend: '+3 new this month',
      trendUp: true,
      color: 'bg-gradient-to-br from-secondary-500 to-secondary-600'
    },
    {
      title: 'Departments',
      value: '12',
      icon: <Building2 className="w-6 h-6 text-white" />,
      color: 'bg-gradient-to-br from-accent-500 to-accent-600'
    },
    {
      title: 'Active Courses',
      value: '156',
      icon: <BookOpen className="w-6 h-6 text-white" />,
      trend: '+8 this semester',
      trendUp: true,
      color: 'bg-gradient-to-br from-purple-500 to-purple-600'
    }
  ];

  const recentActivities = [
    {
      type: 'user',
      message: 'New student account created: STU2024045',
      time: '2 minutes ago',
      icon: <Users className="w-4 h-4" />
    },
    {
      type: 'course',
      message: 'Course "Advanced Algorithms" updated by Dr. Mbarga',
      time: '15 minutes ago',
      icon: <BookOpen className="w-4 h-4" />
    },
    {
      type: 'alert',
      message: 'Server maintenance scheduled for tonight',
      time: '1 hour ago',
      icon: <AlertCircle className="w-4 h-4" />
    },
    {
      type: 'department',
      message: 'New specialty added to Computer Science department',
      time: '2 hours ago',
      icon: <GraduationCap className="w-4 h-4" />
    }
  ];

  const upcomingTasks = [
    {
      task: 'Review pending lecturer applications',
      due: 'Today',
      priority: 'high'
    },
    {
      task: 'Generate semester enrollment report',
      due: 'Tomorrow',
      priority: 'medium'
    },
    {
      task: 'Update system maintenance schedule',
      due: 'This week',
      priority: 'low'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activities</h2>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="p-2 bg-primary-100 rounded-lg">
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Upcoming Tasks</h2>
            <AlertCircle className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {upcomingTasks.map((task, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{task.task}</p>
                  <p className="text-xs text-gray-500 mt-1">Due: {task.due}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  task.priority === 'high' 
                    ? 'bg-red-100 text-red-800' 
                    : task.priority === 'medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition-colors">
            <Users className="w-6 h-6 text-gray-400" />
            <span className="font-medium text-gray-700">Create New User</span>
          </button>
          <button className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-secondary-400 hover:bg-secondary-50 transition-colors">
            <Building2 className="w-6 h-6 text-gray-400" />
            <span className="font-medium text-gray-700">Add Department</span>
          </button>
          <button className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-accent-400 hover:bg-accent-50 transition-colors">
            <BookOpen className="w-6 h-6 text-gray-400" />
            <span className="font-medium text-gray-700">Create Course</span>
          </button>
        </div>
      </div>
    </div>
  );
};
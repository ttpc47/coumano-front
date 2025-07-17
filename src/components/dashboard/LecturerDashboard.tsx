import React from 'react';
import { 
  BookOpen, 
  Users, 
  Calendar, 
  Video,
  Clock,
  FileText,
  TrendingUp,
  MessageCircle
} from 'lucide-react';

const StatCard: React.FC<{
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        {icon}
      </div>
    </div>
  </div>
);

export const LecturerDashboard: React.FC = () => {
  const stats = [
    {
      title: 'My Courses',
      value: '6',
      icon: <BookOpen className="w-6 h-6 text-white" />,
      color: 'bg-gradient-to-br from-primary-500 to-primary-600'
    },
    {
      title: 'Total Students',
      value: '247',
      icon: <Users className="w-6 h-6 text-white" />,
      color: 'bg-gradient-to-br from-secondary-500 to-secondary-600'
    },
    {
      title: 'Classes Today',
      value: '3',
      icon: <Calendar className="w-6 h-6 text-white" />,
      color: 'bg-gradient-to-br from-accent-500 to-accent-600'
    },
    {
      title: 'Materials Shared',
      value: '28',
      icon: <FileText className="w-6 h-6 text-white" />,
      color: 'bg-gradient-to-br from-purple-500 to-purple-600'
    }
  ];

  const todaysClasses = [
    {
      course: 'Advanced Algorithms',
      time: '09:00 - 11:00',
      room: 'Lab A-205',
      students: 35,
      type: 'Practical'
    },
    {
      course: 'Data Structures',
      time: '14:00 - 16:00',  
      room: 'Amphitheater C',
      students: 80,
      type: 'Lecture'
    },
    {
      course: 'Software Engineering',
      time: '16:30 - 18:30',
      room: 'Room B-101',
      students: 45,
      type: 'Tutorial'
    }
  ];

  const recentMessages = [
    {
      student: 'Aminata Fouda',
      subject: 'Question about Assignment 3',
      time: '10 minutes ago'
    },
    {
      student: 'Claude Njomo',
      subject: 'Request for makeup exam',
      time: '1 hour ago'
    },
    {
      student: 'Sarah Biya',
      subject: 'Project submission clarification',
      time: '2 hours ago'
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
        {/* Today's Classes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Today's Classes</h2>
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {todaysClasses.map((cls, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{cls.course}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    cls.type === 'Lecture' 
                      ? 'bg-blue-100 text-blue-800'
                      : cls.type === 'Practical'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {cls.type}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{cls.time}</span>
                  <span>{cls.room}</span>
                  <span>{cls.students} students</span>
                </div>
                <div className="mt-3 flex space-x-2">
                  <button className="flex items-center space-x-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-md text-xs hover:bg-primary-200 transition-colors">
                    <Video className="w-3 h-3" />
                    <span>Start Class</span>
                  </button>
                  <button className="flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-xs hover:bg-gray-200 transition-colors">
                    <Users className="w-3 h-3" />
                    <span>Attendance</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Messages</h2>
            <MessageCircle className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentMessages.map((message, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {message.student.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{message.student}</p>
                  <p className="text-sm text-gray-600 truncate">{message.subject}</p>
                  <p className="text-xs text-gray-500 mt-1">{message.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-center text-primary-600 hover:text-primary-700 text-sm font-medium">
            View All Messages
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition-colors">
            <Video className="w-6 h-6 text-gray-400" />
            <span className="font-medium text-gray-700">Start Live Class</span>
          </button>
          <button className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-secondary-400 hover:bg-secondary-50 transition-colors">
            <FileText className="w-6 h-6 text-gray-400" />
            <span className="font-medium text-gray-700">Upload Material</span>
          </button>
          <button className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-accent-400 hover:bg-accent-50 transition-colors">
            <Users className="w-6 h-6 text-gray-400" />
            <span className="font-medium text-gray-700">Take Attendance</span>
          </button>
          <button className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors">
            <MessageCircle className="w-6 h-6 text-gray-400" />
            <span className="font-medium text-gray-700">Send Message</span>
          </button>
        </div>
      </div>
    </div>
  );
};
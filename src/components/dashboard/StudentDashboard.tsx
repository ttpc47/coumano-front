import React from 'react';
import { 
  BookOpen, 
  Calendar, 
  Clock,
  Video,
  FileText,
  TrendingUp,
  Award,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const StatCard: React.FC<{
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}> = ({ title, value, icon, color, subtitle }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-900">{title}</p>
      <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
      {subtitle && (
        <p className="text-sm text-gray-700 mt-1">{subtitle}</p>
      )}
    </div>
    <div className={`p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700`}>
      {icon}
    </div>
  </div>
);

export const StudentDashboard: React.FC = () => {
  const stats = [
    {
      title: 'Active Courses',
      value: '8',
      icon: <BookOpen className="w-6 h-6 text-white" />,
      color: '', // color now handled in StatCard
      subtitle: 'Level 3 Software Engineering'
    },
    {
      title: 'Attendance Rate',
      value: '92%',
      icon: <CheckCircle className="w-6 h-6 text-white" />,
      color: '',
      subtitle: 'Above average'
    },
    {
      title: 'Documents Accessed',
      value: '3',
      icon: <BookOpen className="w-6 h-6 text-white" />,
      color: '',
      subtitle: 'This week'
    },
    {
      title: 'Scheduled Courses',
      value: '',
      icon: <Video className="w-6 h-6 text-white" />,
      color: '',
      subtitle: 'This week'
    }
  ];

  const todaysClasses = [
    {
      course: 'Advanced Algorithms',
      time: '08:00 - 10:00',
      room: 'Lab A-205',
      lecturer: 'Dr. Paul Mbarga',
      type: 'Practical',
      status: 'upcoming'
    },
    {
      course: 'Software Engineering',
      time: '10:30 - 12:30',
      room: 'Amphitheater C',
      lecturer: 'Prof. Marie Nkomo',
      type: 'Lecture',
      status: 'upcoming'
    },
    {
      course: 'Database Systems',
      time: '14:00 - 16:00',
      room: 'Room B-101',
      lecturer: 'Dr. Jean Fotso',
      type: 'Tutorial',
      status: 'in-progress'
    }
  ];

  const recentGrades = [
    {
      course: 'Data Structures',
      assignment: 'Mid-term Exam',
      grade: 'A-',
      points: '17/20',
      date: '2 days ago'
    },
    {
      course: 'Web Development',
      assignment: 'Project Assignment',
      grade: 'B+',
      points: '16/20',
      date: '1 week ago'
    },
    {
      course: 'Mathematics III',
      assignment: 'Problem Set 3',
      grade: 'A',
      points: '19/20',
      date: '1 week ago'
    }
  ];

  const upcomingDeadlines = [
    {
      course: 'Advanced Algorithms',
      task: 'Algorithm Analysis Report',
      due: 'Tomorrow',
      priority: 'high'
    },
    {
      course: 'Software Engineering',
      task: 'UML Diagrams Assignment',
      due: 'In 3 days',
      priority: 'medium'
    },
    {
      course: 'Database Systems',
      task: 'SQL Query Optimization',
      due: 'Next week',
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

      {/* Today's Classes & Recent Grades */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Classes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Today's Classes</h2>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {todaysClasses.map((cls, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                {/* Class Info */}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{cls.course}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    cls.status === 'in-progress'
                      ? 'bg-green-100 text-green-800'
                      : cls.type === 'Lecture' 
                      ? 'bg-blue-100 text-blue-800'
                      : cls.type === 'Practical'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {cls.status === 'in-progress' ? 'Live' : cls.type}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>{cls.time} • {cls.room}</p>
                  <p>Lecturer: {cls.lecturer}</p>
                </div>
                {/* Action Buttons */}
                <div className="mt-3 flex space-x-2">
                  <button className="flex items-center space-x-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-md text-xs hover:bg-primary-200 transition-colors">
                    <Video className="w-3 h-3" />
                    <span>Join Class</span>
                  </button>
                  <button className="flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-xs hover:bg-gray-200 transition-colors">
                    <FileText className="w-3 h-3" />
                    <span>Materials</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Grades */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Grades</h2>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentGrades.map((grade, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{grade.course}</p>
                  <p className="text-xs text-gray-600">{grade.assignment}</p>
                  <p className="text-xs text-gray-500 mt-1">{grade.date}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2 py-1 text-sm font-semibold rounded-md ${
                    grade.grade.startsWith('A') 
                      ? 'bg-green-100 text-green-800'
                      : grade.grade.startsWith('B')
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {grade.grade}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{grade.points}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Academic Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Academic Progress</h2>
            <Award className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Current Semester</h3>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Semester Progress</span>
                <span className="text-sm font-medium text-gray-900">75%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full" style={{width: '75%'}}></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-2xl font-bold text-gray-900">24</p>
                <p className="text-sm text-gray-600">Credits Earned</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-2xl font-bold text-gray-900">32</p>
                <p className="text-sm text-gray-600">Total Credits</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
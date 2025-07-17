/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { 
  X, 
  User, 
  Mail, 
  Building, 
  Key, 
  Phone, 
  Calendar, 
  GraduationCap,
  Edit,
  UserCheck,
  UserX,
  Clock,
  FileText,
  Download,
  Star,
  Activity
} from 'lucide-react';
import { User as UserType } from '../../../types';

interface UserDetailsModalProps {
  user: UserType;
  onClose: () => void;
  onEdit: () => void;
}

export const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  user,
  onClose,
  onEdit
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not available';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student': return 'bg-blue-100 text-blue-800';
      case 'Lecturer': return 'bg-green-100 text-green-800';
      case 'admin': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Mock activity data - in real app, this would come from API
  const recentActivity = [
    { type: 'login', description: 'Logged into system', timestamp: '2024-01-16T14:20:00Z' },
    { type: 'download', description: 'Downloaded "Medieval History Notes"', timestamp: '2024-01-16T13:45:00Z' },
    { type: 'upload', description: 'Uploaded course material', timestamp: '2024-01-15T16:30:00Z' },
    { type: 'view', description: 'Viewed research paper', timestamp: '2024-01-15T10:15:00Z' }
  ];

  const userStats = {
    documentsAccessed: user.role === 'student' ? 47 : user.role === 'faculty' ? 127 : 234,
    downloads: user.role === 'student' ? 23 : user.role === 'faculty' ? 89 : 156,
    uploads: user.role === 'faculty' ? 34 : user.role === 'admin' ? 78 : 0,
    favorites: user.role === 'student' ? 15 : 8
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-gray-600" />
              </div>
            )}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">{user.name}</h2>
              <div className="flex items-center space-x-3 mt-1">
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getRoleColor(user.role)}`}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-400' : 'bg-red-400'}`}></div>
                  <span className={`text-sm ${user.isActive ? 'text-green-700' : 'text-red-700'}`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onEdit}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>Edit User</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Key className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Matricule Number</p>
                      <p className="font-medium text-gray-900">{user.matriculeNumber || 'Not assigned'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Building className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Department</p>
                      <p className="font-medium text-gray-900">{user.department || 'Not assigned'}</p>
                    </div>
                  </div>
                  {user.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium text-gray-900">{user.phone}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Role-specific Information */}
              {user.role === 'student' && user.yearOfStudy && (
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Information</h3>
                  <div className="flex items-center space-x-3">
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Year of Study</p>
                      <p className="font-medium text-gray-900">{user.yearOfStudy} Year</p>
                    </div>
                  </div>
                </div>
              )}

              {user.role === 'faculty' && user.specialization && (
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Faculty Information</h3>
                  <div className="flex items-center space-x-3">
                    <GraduationCap className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Specialization</p>
                      <p className="font-medium text-gray-900">{user.specialization}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Account Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Account Created</p>
                      <p className="font-medium text-gray-900">{formatDate(user.createdDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Last Login</p>
                      <p className="font-medium text-gray-900">{formatDate(user.lastLogin)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.type === 'login' ? 'bg-green-100 text-green-600' :
                        activity.type === 'download' ? 'bg-blue-100 text-blue-600' :
                        activity.type === 'upload' ? 'bg-purple-100 text-purple-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {activity.type === 'login' && <UserCheck className="w-4 h-4" />}
                        {activity.type === 'download' && <Download className="w-4 h-4" />}
                        {activity.type === 'upload' && <FileText className="w-4 h-4" />}
                        {activity.type === 'view' && <Activity className="w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                        <p className="text-xs text-gray-500">{formatDate(activity.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Statistics Sidebar */}
            <div className="space-y-6">
              {/* User Statistics */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-600">Documents Accessed</span>
                    </div>
                    <span className="font-semibold text-gray-900">{userStats.documentsAccessed}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Download className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-600">Downloads</span>
                    </div>
                    <span className="font-semibold text-gray-900">{userStats.downloads}</span>
                  </div>
                  {userStats.uploads > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-purple-600" />
                        <span className="text-sm text-gray-600">Uploads</span>
                      </div>
                      <span className="font-semibold text-gray-900">{userStats.uploads}</span>
                    </div>
                  )}
                  {user.role === 'student' && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm text-gray-600">Favorites</span>
                      </div>
                      <span className="font-semibold text-gray-900">{userStats.favorites}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
  
                <div className="space-y-2">
                  <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    Reset Password
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                    View Documents
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                    Send Message
                  </button>
                  <button className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                    user.isActive 
                      ? 'text-red-600 hover:bg-red-50' 
                      : 'text-green-600 hover:bg-green-50'
                  }`}>
                    {user.isActive ? 'Deactivate Account' : 'Activate Account'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
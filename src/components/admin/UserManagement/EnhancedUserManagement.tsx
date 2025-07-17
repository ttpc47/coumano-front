import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Search,
  Filter,
  Edit, 
  Trash2, 
  Eye,
  RotateCcw,
  Download,
  Upload,
  MoreVertical,
  UserCheck,
  UserX,
  Mail,
  Shield,
  Activity,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { userService, User, UserFilters, UserStats } from '../../../services/userService';

export const EnhancedUserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [filters, setFilters] = useState<UserFilters>({
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);

  useEffect(() => {
    loadUsers();
    loadStats();
  }, [filters]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getUsers(filters);
      setUsers(response.results || []);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await userService.getUserStats();
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load user stats:', error);
    }
  };

  const handleSearch = (searchTerm: string) => {
    setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }));
  };

  const handleFilterChange = (key: keyof UserFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleUserSelect = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(user => user.id));
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.deleteUser(userId);
        loadUsers();
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedUsers.length} users?`)) {
      try {
        await userService.bulkDeleteUsers(selectedUsers);
        setSelectedUsers([]);
        loadUsers();
      } catch (error) {
        console.error('Failed to delete users:', error);
      }
    }
  };

  const handleResetPassword = async (userId: string) => {
    try {
      await userService.resetPassword(userId);
      alert('Password reset email sent successfully');
    } catch (error) {
      console.error('Failed to reset password:', error);
    }
  };

  const handleChangeStatus = async (userId: string, status: 'active' | 'inactive' | 'suspended') => {
    try {
      await userService.changeUserStatus(userId, status);
      loadUsers();
    } catch (error) {
      console.error('Failed to change user status:', error);
    }
  };

  const handleExportUsers = async () => {
    try {
      const blob = await userService.exportUsers(filters, 'excel');
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'users-export.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to export users:', error);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'lecturer': return 'bg-blue-100 text-blue-800';
      case 'student': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'inactive': return <XCircle className="w-4 h-4 text-gray-600" />;
      case 'suspended': return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      default: return <XCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Enhanced User Management</h1>
          <p className="text-gray-600 mt-1">Comprehensive user administration with advanced features</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
          <button 
            onClick={handleExportUsers}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Upload className="w-4 h-4" />
            <span>Import</span>
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Create User</span>
          </button>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
                <p className="text-sm text-green-600 mt-1">+{stats.newUsersThisMonth} this month</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeUsers}</p>
                <p className="text-sm text-blue-600 mt-1">
                  {Math.round((stats.activeUsers / stats.totalUsers) * 100)}% of total
                </p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-secondary-500 to-secondary-600">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Students</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.usersByRole.find(r => r.role === 'student')?.count || 0}
                </p>
                <p className="text-sm text-green-600 mt-1">Enrolled students</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Lecturers</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.usersByRole.find(r => r.role === 'lecturer')?.count || 0}
                </p>
                <p className="text-sm text-purple-600 mt-1">Teaching staff</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users..."
                value={filters.search || ''}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <select
              value={filters.role || ''}
              onChange={(e) => handleFilterChange('role', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Roles</option>
              <option value="admin">Administrator</option>
              <option value="lecturer">Lecturer</option>
              <option value="student">Student</option>
            </select>

            <select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
            </select>

            <select
              value={filters.department || ''}
              onChange={(e) => handleFilterChange('department', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Engineering">Engineering</option>
            </select>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-blue-900">
                {selectedUsers.length} user(s) selected
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleBulkDelete}
                className="flex items-center space-x-2 px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Selected</span>
              </button>
              <button
                onClick={() => setSelectedUsers([])}
                className="flex items-center space-x-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                <XCircle className="w-4 h-4" />
                <span>Clear Selection</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Users ({users.length})</h2>
            <div className="flex items-center space-x-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedUsers.length === users.length && users.length > 0}
                  onChange={handleSelectAll}
                  className="rounded text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-600">Select All</span>
              </label>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === users.length && users.length > 0}
                    onChange={handleSelectAll}
                    className="rounded text-primary-600 focus:ring-primary-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleUserSelect(user.id)}
                      className="rounded text-primary-600 focus:ring-primary-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {user.firstName[0]}{user.lastName[0]}
                        </span>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{user.matricule}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.department || '-'}
                    {user.specialty && (
                      <p className="text-xs text-gray-500">{user.specialty}</p>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(user.status)}
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </div>
                    {user.isFirstLogin && (
                      <p className="text-xs text-yellow-600 mt-1">First login required</p>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => {
                          setSelectedUser(user);
                          setShowUserDetails(true);
                        }}
                        className="text-primary-600 hover:text-primary-900 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-secondary-600 hover:text-secondary-900 transition-colors"
                        title="Edit User"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleResetPassword(user.id)}
                        className="text-yellow-600 hover:text-yellow-900 transition-colors"
                        title="Reset Password"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      <div className="relative group">
                        <button className="text-gray-600 hover:text-gray-900 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                          <button
                            onClick={() => handleChangeStatus(user.id, user.status === 'active' ? 'inactive' : 'active')}
                            className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            {user.status === 'active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                            <span>{user.status === 'active' ? 'Deactivate' : 'Activate'}</span>
                          </button>
                          <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            <Mail className="w-4 h-4" />
                            <span>Send Email</span>
                          </button>
                          <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            <Activity className="w-4 h-4" />
                            <span>View Activity</span>
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete User</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">User Details</h3>
                <button
                  onClick={() => setShowUserDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {selectedUser.firstName[0]}{selectedUser.lastName[0]}
                  </span>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h4>
                  <p className="text-gray-600">{selectedUser.matricule}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    {getStatusIcon(selectedUser.status)}
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedUser.status)}`}>
                      {selectedUser.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Contact Information</h5>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Email:</span>
                      <span className="ml-2 text-gray-900">{selectedUser.email}</span>
                    </div>
                    {selectedUser.phone && (
                      <div>
                        <span className="text-gray-600">Phone:</span>
                        <span className="ml-2 text-gray-900">{selectedUser.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Academic Information</h5>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Role:</span>
                      <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(selectedUser.role)}`}>
                        {selectedUser.role}
                      </span>
                    </div>
                    {selectedUser.department && (
                      <div>
                        <span className="text-gray-600">Department:</span>
                        <span className="ml-2 text-gray-900">{selectedUser.department}</span>
                      </div>
                    )}
                    {selectedUser.specialty && (
                      <div>
                        <span className="text-gray-600">Specialty:</span>
                        <span className="ml-2 text-gray-900">{selectedUser.specialty}</span>
                      </div>
                    )}
                    {selectedUser.level && (
                      <div>
                        <span className="text-gray-600">Level:</span>
                        <span className="ml-2 text-gray-900">Level {selectedUser.level}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Account Information</h5>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Created:</span>
                      <span className="ml-2 text-gray-900">{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Last Login:</span>
                      <span className="ml-2 text-gray-900">
                        {selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleDateString() : 'Never'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">First Login:</span>
                      <span className="ml-2 text-gray-900">{selectedUser.isFirstLogin ? 'Required' : 'Completed'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                <button className="flex items-center space-x-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors">
                  <Edit className="w-4 h-4" />
                  <span>Edit User</span>
                </button>
                <button 
                  onClick={() => handleResetPassword(selectedUser.id)}
                  className="flex items-center space-x-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset Password</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <Activity className="w-4 h-4" />
                  <span>View Activity</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
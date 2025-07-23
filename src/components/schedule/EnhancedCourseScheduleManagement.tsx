import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Eye,
  Edit,
  Trash2,
  Copy,
  BarChart3,
  Settings,
  RefreshCw,
  FileText,
  Users,
  Building,
  Zap
} from 'lucide-react';
import { courseScheduleService, CourseSchedule, ScheduleFilters, ScheduleStats, ScheduleConflict } from '../../services/courseScheduleService';
import { CreateScheduleModal } from './CreateScheduleModal';
import { EditScheduleModal } from './EditScheduleModal';
import { ScheduleDetailsModal } from './ScheduleDetailsModal';
import { ConflictResolutionModal } from './ConflictResolutionModal';
import { ScheduleOptimizer } from './ScheduleOptimizer';

export const EnhancedCourseScheduleManagement: React.FC = () => {
  const [schedules, setSchedules] = useState<CourseSchedule[]>([]);
  const [stats, setStats] = useState<ScheduleStats | null>(null);
  const [conflicts, setConflicts] = useState<ScheduleConflict[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSchedule, setSelectedSchedule] = useState<CourseSchedule | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'weekly' | 'calendar'>('weekly');
  const [filters, setFilters] = useState<ScheduleFilters>({
    page: 1,
    limit: 50
  });

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [showOptimizerModal, setShowOptimizerModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadSchedules();
    loadStats();
    checkConflicts();
  }, [filters]);

  const loadSchedules = async () => {
    try {
      setLoading(true);
      const response = await courseScheduleService.getSchedules(filters);
      setSchedules(response.results || []);
    } catch (error) {
      console.error('Failed to load schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await courseScheduleService.getScheduleStats();
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load schedule stats:', error);
    }
  };

  const checkConflicts = async () => {
    try {
      // This would be implemented to check for conflicts across all schedules
      // For now, we'll use mock data
      setConflicts([]);
    } catch (error) {
      console.error('Failed to check conflicts:', error);
    }
  };

  const handleCreateSchedule = async (scheduleData: any) => {
    try {
      await courseScheduleService.createSchedule(scheduleData);
      setShowCreateModal(false);
      loadSchedules();
    } catch (error) {
      console.error('Failed to create schedule:', error);
    }
  };

  const handleUpdateSchedule = async (scheduleId: string, scheduleData: any) => {
    try {
      await courseScheduleService.updateSchedule(scheduleId, scheduleData);
      setShowEditModal(false);
      setSelectedSchedule(null);
      loadSchedules();
    } catch (error) {
      console.error('Failed to update schedule:', error);
    }
  };

  const handleDeleteSchedule = async (scheduleId: string) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      try {
        await courseScheduleService.deleteSchedule(scheduleId);
        loadSchedules();
      } catch (error) {
        console.error('Failed to delete schedule:', error);
      }
    }
  };

  const handleDuplicateSchedule = async (schedule: CourseSchedule) => {
    try {
      const duplicateData = {
        courseId: schedule.courseId,
        day: schedule.day,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        room: schedule.room,
        building: schedule.building,
        type: schedule.type,
        notes: `Copy of ${schedule.notes || 'schedule'}`
      };
      await courseScheduleService.createSchedule(duplicateData);
      loadSchedules();
    } catch (error) {
      console.error('Failed to duplicate schedule:', error);
    }
  };

  const handleExportSchedules = async (format: 'csv' | 'excel' | 'ics') => {
    try {
      const blob = await courseScheduleService.exportSchedules(filters, format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `schedules.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to export schedules:', error);
    }
  };

  const handleImportSchedules = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      await courseScheduleService.importSchedules(formData);
      loadSchedules();
    } catch (error) {
      console.error('Failed to import schedules:', error);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lecture': return 'bg-ocean-100 text-ocean-700';
      case 'practical': return 'bg-sage-100 text-sage-700';
      case 'tutorial': return 'bg-coral-100 text-coral-700';
      case 'exam': return 'bg-warning-100 text-warning-700';
      default: return 'bg-neutral-100 text-neutral-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-ocean-100 text-ocean-700';
      case 'in_progress': return 'bg-sage-100 text-sage-700';
      case 'completed': return 'bg-neutral-100 text-neutral-700';
      case 'cancelled': return 'bg-coral-100 text-coral-700';
      default: return 'bg-neutral-100 text-neutral-700';
    }
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-neutral-800">Enhanced Course Schedule Management</h1>
          <p className="text-neutral-600 mt-1">Comprehensive schedule management with conflict detection and optimization</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
          <div className="relative group">
            <button className="flex items-center space-x-2 px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <button
                onClick={() => handleExportSchedules('csv')}
                className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
              >
                <FileText className="w-4 h-4" />
                <span>Export as CSV</span>
              </button>
              <button
                onClick={() => handleExportSchedules('excel')}
                className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
              >
                <FileText className="w-4 h-4" />
                <span>Export as Excel</span>
              </button>
              <button
                onClick={() => handleExportSchedules('ics')}
                className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
              >
                <Calendar className="w-4 h-4" />
                <span>Export as iCal</span>
              </button>
            </div>
          </div>
          <button
            onClick={() => setShowOptimizerModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-coral-100 text-coral-700 rounded-lg hover:bg-coral-200 transition-colors"
          >
            <Zap className="w-4 h-4" />
            <span>Optimize</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-ocean-600 to-sage-600 text-white rounded-lg hover:from-ocean-700 hover:to-sage-700 transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Create Schedule</span>
          </button>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Total Schedules</p>
                <p className="text-3xl font-bold text-neutral-800 mt-2">{stats.totalSchedules}</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-ocean-500 to-ocean-600">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">This Week</p>
                <p className="text-3xl font-bold text-neutral-800 mt-2">{stats.schedulesThisWeek}</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-sage-500 to-sage-600">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Room Usage</p>
                <p className="text-3xl font-bold text-neutral-800 mt-2">
                  {Math.round(stats.roomUtilization.reduce((sum, r) => sum + r.utilizationRate, 0) / stats.roomUtilization.length || 0)}%
                </p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-coral-500 to-coral-600">
                <Building className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Peak Hour</p>
                <p className="text-3xl font-bold text-neutral-800 mt-2">
                  {stats.peakHours.length > 0 ? stats.peakHours[0].hour : 'N/A'}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-warning-500 to-warning-600">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Conflicts</p>
                <p className="text-3xl font-bold text-neutral-800 mt-2">{conflicts.length}</p>
                {conflicts.length > 0 && (
                  <button
                    onClick={() => setShowConflictModal(true)}
                    className="text-xs text-coral-600 hover:text-coral-700 mt-1"
                  >
                    View Conflicts
                  </button>
                )}
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-coral-500 to-coral-600">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <h3 className="text-lg font-semibold text-neutral-800 mb-4">Advanced Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search schedules..."
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
              />
            </div>
            
            <select
              value={filters.courseId || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, courseId: e.target.value }))}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
            >
              <option value="">All Courses</option>
              <option value="cs301">CS301 - Advanced Algorithms</option>
              <option value="cs205">CS205 - Database Systems</option>
              <option value="math201">MATH201 - Linear Algebra</option>
            </select>

            <select
              value={filters.type || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
            >
              <option value="">All Types</option>
              <option value="lecture">Lecture</option>
              <option value="practical">Practical</option>
              <option value="tutorial">Tutorial</option>
              <option value="exam">Exam</option>
            </select>

            <select
              value={filters.room || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, room: e.target.value }))}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
            >
              <option value="">All Rooms</option>
              <option value="Amphitheater A">Amphitheater A</option>
              <option value="Lab A-205">Lab A-205</option>
              <option value="Room B-101">Room B-101</option>
            </select>
          </div>
        </div>
      )}

      {/* View Mode Toggle */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex bg-neutral-100 rounded-lg p-1">
            {['list', 'weekly', 'calendar'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as any)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors capitalize ${
                  viewMode === mode 
                    ? 'bg-white text-neutral-800 shadow-sm' 
                    : 'text-neutral-600 hover:text-neutral-800'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={loadSchedules}
              className="p-2 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button className="p-2 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Schedule Content */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
        {viewMode === 'list' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-neutral-800 mb-4">
              Course Schedules ({schedules.length})
            </h2>
            {schedules.map((schedule) => (
              <div key={schedule.id} className="border border-neutral-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-neutral-800">{schedule.courseName}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(schedule.type)}`}>
                        {schedule.type}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(schedule.status)}`}>
                        {schedule.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-neutral-600">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{schedule.day}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{schedule.room}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span>{schedule.lecturerName}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedSchedule(schedule);
                        setShowDetailsModal(true);
                      }}
                      className="text-ocean-600 hover:text-ocean-800 transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedSchedule(schedule);
                        setShowEditModal(true);
                      }}
                      className="text-sage-600 hover:text-sage-800 transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDuplicateSchedule(schedule)}
                      className="text-coral-600 hover:text-coral-800 transition-colors"
                      title="Duplicate"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSchedule(schedule.id)}
                      className="text-error-600 hover:text-error-800 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {viewMode === 'weekly' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-neutral-800 mb-4">Weekly View</h2>
            {/* Weekly calendar view would be implemented here */}
            <div className="h-96 bg-neutral-50 rounded-lg flex items-center justify-center">
              <p className="text-neutral-500">Weekly calendar view implementation</p>
            </div>
          </div>
        )}

        {viewMode === 'calendar' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-neutral-800 mb-4">Calendar View</h2>
            {/* Full calendar view would be implemented here */}
            <div className="h-96 bg-neutral-50 rounded-lg flex items-center justify-center">
              <p className="text-neutral-500">Full calendar view implementation</p>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateScheduleModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateSchedule}
        />
      )}

      {showEditModal && selectedSchedule && (
        <EditScheduleModal
          schedule={selectedSchedule}
          onClose={() => {
            setShowEditModal(false);
            setSelectedSchedule(null);
          }}
          onSubmit={(data) => handleUpdateSchedule(selectedSchedule.id, data)}
        />
      )}

      {showDetailsModal && selectedSchedule && (
        <ScheduleDetailsModal
          schedule={selectedSchedule}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedSchedule(null);
          }}
          onEdit={() => {
            setShowDetailsModal(false);
            setShowEditModal(true);
          }}
        />
      )}

      {showConflictModal && (
        <ConflictResolutionModal
          conflicts={conflicts}
          onClose={() => setShowConflictModal(false)}
          onResolve={async (conflictId, solution) => {
            try {
              await courseScheduleService.resolveConflict(conflictId, solution);
              setShowConflictModal(false);
              loadSchedules();
              checkConflicts();
            } catch (error) {
              console.error('Failed to resolve conflict:', error);
            }
          }}
        />
      )}

      {showOptimizerModal && (
        <ScheduleOptimizer
          onClose={() => setShowOptimizerModal(false)}
          onOptimize={async (courseId, preferences) => {
            try {
              await courseScheduleService.getOptimalSchedule(courseId, preferences);
              setShowOptimizerModal(false);
              loadSchedules();
            } catch (error) {
              console.error('Failed to optimize schedule:', error);
            }
          }}
        />
      )}
    </div>
  );
};
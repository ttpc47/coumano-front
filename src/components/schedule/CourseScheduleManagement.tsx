import React, { useState } from 'react';
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
  BarChart3
} from 'lucide-react';
import { Course, CourseSchedule } from '../../types';
import { CourseScheduleModal } from './CourseScheduleModal';
import { WeeklyScheduleView } from './WeeklyScheduleView';
import { ScheduleDetailsModal } from './ScheduleDetailsModal';
import { ScheduleConflictResolver } from './ScheduleConflictResolver';

export const CourseScheduleManagement: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: '1',
      name: 'Advanced Algorithms',
      code: 'CS301',
      credits: 4,
      lecturer: {
        id: 'l1',
        matricule: 'LEC001',
        firstName: 'Paul',
        lastName: 'Mbarga',
        email: 'p.mbarga@university.cm',
        phone: '',
        isActive: true,
        role: 'lecturer',
        isFirstLogin: false,
        createdAt: '',
        name: 'Dr. Paul Mbarga',
        department: 'Computer Science'
      },
      specialties: ['Software Engineering', 'Data Science'],
      schedule: [
        {
          id: 's1',
          day: 'Monday',
          startTime: '08:00',
          endTime: '10:00',
          room: 'Amphitheater C',
          type: 'lecture'
        },
        {
          id: 's2',
          day: 'Wednesday',
          startTime: '14:00',
          endTime: '17:00',
          room: 'Lab A-205',
          type: 'practical'
        }
      ],
      materials: [],
      isShared: true,
      description: 'Advanced algorithmic techniques and complexity analysis'
    },
    {
      id: '2',
      name: 'Database Systems',
      code: 'CS205',
      credits: 3,
      lecturer: {
        id: 'l2',
        matricule: 'LEC002',
        firstName: 'Marie',
        lastName: 'Nkomo',
        email: 'm.nkomo@university.cm',
        phone: '',
        isActive: true,
        role: 'lecturer',
        isFirstLogin: false,
        createdAt: '',
        name: 'Prof. Marie Nkomo',
        department: 'Computer Science'
      },
      specialties: ['Software Engineering'],
      schedule: [
        {
          id: 's3',
          day: 'Tuesday',
          startTime: '10:00',
          endTime: '12:00',
          room: 'Room B-101',
          type: 'lecture'
        },
        {
          id: 's4',
          day: 'Thursday',
          startTime: '14:00',
          endTime: '17:00',
          room: 'Lab B-205',
          type: 'practical'
        }
      ],
      materials: [],
      isShared: false,
      description: 'Relational databases, SQL, and database design principles'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'weekly'>('weekly');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showConflictResolver, setShowConflictResolver] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<CourseSchedule | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const departments = ['Computer Science', 'Mathematics', 'Physics', 'Engineering'];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.lecturer?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || course.lecturer?.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const getAllSchedules = (): CourseSchedule[] => {
    return courses.flatMap(course => course.schedule);
  };

  const handleAddSchedule = (course: Course) => {
    setSelectedCourse(course);
    setSelectedSchedule(null);
    setIsEditMode(false);
    setShowScheduleModal(true);
  };

  const handleEditSchedule = (course: Course, schedule: CourseSchedule) => {
    setSelectedCourse(course);
    setSelectedSchedule(schedule);
    setIsEditMode(true);
    setShowScheduleModal(true);
  };

  const handleDeleteSchedule = (course: Course, scheduleId: string) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      setCourses(prevCourses =>
        prevCourses.map(c =>
          c.id === course.id
            ? { ...c, schedule: c.schedule.filter(s => s.id !== scheduleId) }
            : c
        )
      );
    }
  };

  const handleViewDetails = (course: Course, schedule: CourseSchedule) => {
    setSelectedCourse(course);
    setSelectedSchedule(schedule);
    setShowDetailsModal(true);
  };

  const handleSubmitSchedule = (scheduleData: Omit<CourseSchedule, 'id'>) => {
    if (!selectedCourse) return;

    const newSchedule: CourseSchedule = {
      ...scheduleData,
      id: isEditMode ? selectedSchedule!.id : Date.now().toString()
    };

    setCourses(prevCourses =>
      prevCourses.map(course =>
        course.id === selectedCourse.id
          ? {
              ...course,
              schedule: isEditMode
                ? course.schedule.map(s => s.id === selectedSchedule!.id ? newSchedule : s)
                : [...course.schedule, newSchedule]
            }
          : course
      )
    );

    setShowScheduleModal(false);
    setSelectedCourse(null);
    setSelectedSchedule(null);
  };

  const handleDuplicateSchedule = () => {
    if (!selectedCourse || !selectedSchedule) return;
    
    setIsEditMode(false);
    setShowDetailsModal(false);
    setShowScheduleModal(true);
  };

  const getScheduleStats = () => {
    const allSchedules = getAllSchedules();
    const totalSessions = allSchedules.length;
    const lectureCount = allSchedules.filter(s => s.type === 'lecture').length;
    const practicalCount = allSchedules.filter(s => s.type === 'practical').length;
    const tutorialCount = allSchedules.filter(s => s.type === 'tutorial').length;
    
    const roomUsage = allSchedules.reduce((acc, schedule) => {
      acc[schedule.room] = (acc[schedule.room] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostUsedRoom = Object.entries(roomUsage).sort(([,a], [,b]) => b - a)[0];

    return {
      totalSessions,
      lectureCount,
      practicalCount,
      tutorialCount,
      mostUsedRoom: mostUsedRoom ? mostUsedRoom[0] : 'N/A',
      roomUsageCount: mostUsedRoom ? mostUsedRoom[1] : 0
    };
  };

  const stats = getScheduleStats();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Course Schedule Management</h1>
          <p className="text-gray-600 mt-1">Manage course schedules with conflict detection and optimization</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Upload className="w-4 h-4" />
            <span>Import</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button
            onClick={() => setShowConflictResolver(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Check Conflicts</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sessions</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalSessions}</p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Lectures</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.lectureCount}</p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Practicals</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.practicalCount}</p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tutorials</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.tutorialCount}</p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Most Used Room</p>
              <p className="text-lg font-bold text-gray-900 mt-2">{stats.mostUsedRoom}</p>
              <p className="text-xs text-gray-500">{stats.roomUsageCount} sessions</p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600">
              <MapPin className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and View Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>

            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <Filter className="w-4 h-4" />
              <span>More Filters</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('weekly')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'weekly' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Weekly View
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                List View
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {viewMode === 'weekly' ? (
        <WeeklyScheduleView
          courses={filteredCourses}
          onEditSchedule={handleEditSchedule}
          onDeleteSchedule={handleDeleteSchedule}
          onAddSchedule={handleAddSchedule}
          onViewDetails={handleViewDetails}
        />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Schedules</h2>
          <div className="space-y-6">
            {filteredCourses.map((course) => (
              <div key={course.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{course.name}</h3>
                    <p className="text-sm text-gray-600">{course.code} • {course.lecturer?.name}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                      <span>{course.credits} credits</span>
                      <span>{course.schedule.length} sessions/week</span>
                      <span>{course.specialties.length} specialties</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddSchedule(course)}
                    className="flex items-center space-x-2 px-3 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Schedule</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {course.schedule.map((schedule) => (
                    <div key={schedule.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          schedule.type === 'lecture' ? 'bg-blue-100 text-blue-800' :
                          schedule.type === 'practical' ? 'bg-green-100 text-green-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {schedule.type}
                        </span>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleViewDetails(course, schedule)}
                            className="text-gray-600 hover:text-blue-600 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditSchedule(course, schedule)}
                            className="text-gray-600 hover:text-blue-600 transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSchedule(course, schedule.id)}
                            className="text-gray-600 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{schedule.day}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span>{schedule.startTime} - {schedule.endTime}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>{schedule.room}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {course.schedule.length === 0 && (
                    <div className="col-span-full text-center py-8 text-gray-500">
                      <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No schedules configured</p>
                      <button
                        onClick={() => handleAddSchedule(course)}
                        className="mt-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        Add first schedule
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      {showScheduleModal && selectedCourse && (
        <CourseScheduleModal
          course={selectedCourse}
          schedule={selectedSchedule || undefined}
          onClose={() => {
            setShowScheduleModal(false);
            setSelectedCourse(null);
            setSelectedSchedule(null);
          }}
          onSubmit={handleSubmitSchedule}
          existingSchedules={getAllSchedules()}
          isEdit={isEditMode}
        />
      )}

      {showDetailsModal && selectedCourse && selectedSchedule && (
        <ScheduleDetailsModal
          course={selectedCourse}
          schedule={selectedSchedule}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedCourse(null);
            setSelectedSchedule(null);
          }}
          onEdit={() => {
            setShowDetailsModal(false);
            setIsEditMode(true);
            setShowScheduleModal(true);
          }}
          onDelete={() => {
            handleDeleteSchedule(selectedCourse, selectedSchedule.id);
            setShowDetailsModal(false);
            setSelectedCourse(null);
            setSelectedSchedule(null);
          }}
          onDuplicate={handleDuplicateSchedule}
        />
      )}

      {showConflictResolver && (
        <ScheduleConflictResolver
          conflicts={[]} // You would implement conflict detection logic here
          onResolve={(conflictId, solution) => {
            console.log('Resolving conflict:', conflictId, solution);
            setShowConflictResolver(false);
          }}
          onIgnore={(conflictId) => {
            console.log('Ignoring conflict:', conflictId);
            setShowConflictResolver(false);
          }}
          onClose={() => setShowConflictResolver(false)}
        />
      )}
    </div>
  );
};
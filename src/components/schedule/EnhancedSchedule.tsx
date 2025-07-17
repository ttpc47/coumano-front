import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Clock,
  MapPin,
  User,
  BookOpen,
  Filter,
  Download,
  Search,
  Edit,
  Trash2,
  Copy,
  AlertCircle,
  CheckCircle,
  XCircle,
  MoreVertical,
  Video,
  Users,
  Bell,
  Settings
} from 'lucide-react';
import { scheduleService, ScheduleEvent, ScheduleFilters, ScheduleStats } from '../../services/scheduleService';

export const EnhancedSchedule: React.FC = () => {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [stats, setStats] = useState<ScheduleStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month' | 'day'>('week');
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<ScheduleFilters>({
    dateFrom: new Date().toISOString().split('T')[0],
    dateTo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  useEffect(() => {
    loadEvents();
    loadStats();
  }, [filters, currentDate]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await scheduleService.getEvents(filters);
      setEvents(response.results || []);
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await scheduleService.getScheduleStats(filters);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load schedule stats:', error);
    }
  };

  const getWeekDays = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay() + 1); // Start from Monday
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventsForDay = (date: Date) => {
    const dayStr = date.toISOString().split('T')[0];
    return events.filter(event => 
      event.startTime.startsWith(dayStr)
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lecture': return <BookOpen className="w-4 h-4" />;
      case 'practical': return <Settings className="w-4 h-4" />;
      case 'tutorial': return <User className="w-4 h-4" />;
      case 'exam': return <AlertCircle className="w-4 h-4" />;
      case 'meeting': return <Users className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lecture': return 'bg-blue-500';
      case 'practical': return 'bg-green-500';
      case 'tutorial': return 'bg-yellow-500';
      case 'exam': return 'bg-red-500';
      case 'meeting': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'in_progress': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-gray-600" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'postponed': return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'postponed': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    const days = viewMode === 'day' ? 1 : viewMode === 'week' ? 7 : 30;
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? days : -days));
    setCurrentDate(newDate);
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await scheduleService.deleteEvent(eventId);
        loadEvents();
      } catch (error) {
        console.error('Failed to delete event:', error);
      }
    }
  };

  const handleCancelEvent = async (eventId: string) => {
    if (window.confirm('Are you sure you want to cancel this event?')) {
      try {
        await scheduleService.cancelEvent(eventId, 'Cancelled by administrator');
        loadEvents();
      } catch (error) {
        console.error('Failed to cancel event:', error);
      }
    }
  };

  const handleExportSchedule = async () => {
    try {
      const blob = await scheduleService.exportSchedule(filters, 'ics');
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'schedule.ics';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to export schedule:', error);
    }
  };

  const weekDays = getWeekDays(currentDate);
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Enhanced Schedule Management</h1>
          <p className="text-gray-600 mt-1">Advanced scheduling with conflict detection and analytics</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
          <button 
            onClick={handleExportSchedule}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Create Event</span>
          </button>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Events</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalEvents}</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.upcomingEvents}</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.completedEvents}</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cancelled</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.cancelledEvents}</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-red-600">
                <XCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Room Usage</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {Math.round(stats.roomUtilization.reduce((sum, r) => sum + r.utilizationRate, 0) / stats.roomUtilization.length || 0)}%
                </p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600">
                <MapPin className="w-6 h-6 text-white" />
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
              <select
                value={filters.courseId || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, courseId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Courses</option>
                <option value="cs301">CS301 - Advanced Algorithms</option>
                <option value="cs205">CS205 - Database Systems</option>
                <option value="math201">MATH201 - Linear Algebra</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
              <select
                value={filters.type || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Types</option>
                <option value="lecture">Lecture</option>
                <option value="practical">Practical</option>
                <option value="tutorial">Tutorial</option>
                <option value="exam">Exam</option>
                <option value="meeting">Meeting</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filters.status || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="postponed">Postponed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Room</label>
              <select
                value={filters.room || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, room: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Rooms</option>
                <option value="Amphitheater A">Amphitheater A</option>
                <option value="Amphitheater C">Amphitheater C</option>
                <option value="Lab A-205">Lab A-205</option>
                <option value="Lab B-205">Lab B-205</option>
                <option value="Room B-101">Room B-101</option>
                <option value="Room C-301">Room C-301</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Calendar Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateWeek('prev')}
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold text-gray-900">
              {viewMode === 'month' 
                ? currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                : viewMode === 'week'
                ? `Week of ${weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                : currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
              }
            </h2>
            <button
              onClick={() => navigateWeek('next')}
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors font-medium"
            >
              Today
            </button>
            <div className="flex bg-gray-100 rounded-lg p-1">
              {['day', 'week', 'month'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode as any)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors capitalize ${
                    viewMode === mode 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Calendar View */}
        {viewMode === 'week' && (
          <div className="grid grid-cols-8 gap-px bg-gray-200 rounded-lg overflow-hidden">
            {/* Time Column Header */}
            <div className="bg-gray-50 p-4 font-medium text-gray-600 text-center">
              Time
            </div>
            
            {/* Day Headers */}
            {weekDays.map((day, index) => (
              <div key={day.toISOString()} className="bg-gray-50 p-4 text-center">
                <div className={`rounded-lg p-2 ${
                  day.toDateString() === new Date().toDateString()
                    ? 'bg-primary-100 text-primary-800'
                    : 'text-gray-900'
                }`}>
                  <div className="font-semibold">{dayNames[index]}</div>
                  <div className="text-sm mt-1">{day.getDate()}</div>
                </div>
              </div>
            ))}

            {/* Time Slots */}
            {Array.from({ length: 12 }, (_, hour) => {
              const timeSlot = hour + 8; // Start from 8 AM
              return (
                <React.Fragment key={timeSlot}>
                  {/* Time Label */}
                  <div className="bg-white p-4 text-center text-sm font-medium text-gray-600 border-r border-gray-200">
                    {timeSlot}:00
                  </div>
                  
                  {/* Day Columns */}
                  {weekDays.map(day => {
                    const dayEvents = getEventsForDay(day);
                    const hourEvents = dayEvents.filter(event => {
                      const eventHour = new Date(event.startTime).getHours();
                      return eventHour === timeSlot;
                    });

                    return (
                      <div key={`${day.toISOString()}-${timeSlot}`} className="bg-white p-2 min-h-[80px] relative">
                        {hourEvents.map(event => (
                          <div
                            key={event.id}
                            className={`${getTypeColor(event.type)} text-white text-xs p-2 rounded-md mb-1 cursor-pointer hover:opacity-90 transition-opacity`}
                            onClick={() => {
                              setSelectedEvent(event);
                              setShowEventDetails(true);
                            }}
                          >
                            <div className="font-medium truncate">{event.title}</div>
                            <div className="flex items-center space-x-1 mt-1 opacity-90">
                              {getTypeIcon(event.type)}
                              <span>{event.room}</span>
                            </div>
                            <div className="flex items-center space-x-1 mt-1 opacity-90">
                              {event.isVirtual && <Video className="w-3 h-3" />}
                              {getStatusIcon(event.status)}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </div>
        )}
      </div>

      {/* Today's Events */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Events</h2>
        <div className="space-y-4">
          {getEventsForDay(new Date()).map((event) => (
            <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className={`w-4 h-16 ${getTypeColor(event.type)} rounded-full`}></div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{event.title}</h3>
                      {event.isVirtual && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          Virtual
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{event.courseName} • {event.lecturerName}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{event.room}</span>
                      </div>
                      {event.enrolledCount && (
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{event.enrolledCount} enrolled</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(event.status)}
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(event.status)}`}>
                      {event.status.replace('_', ' ')}
                    </span>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    event.type === 'lecture' ? 'bg-blue-100 text-blue-800' :
                    event.type === 'practical' ? 'bg-green-100 text-green-800' :
                    event.type === 'tutorial' ? 'bg-yellow-100 text-yellow-800' :
                    event.type === 'exam' ? 'bg-red-100 text-red-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {event.type}
                  </span>
                  <div className="relative group">
                    <button className="text-gray-600 hover:text-gray-900 transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                      <button
                        onClick={() => {
                          setSelectedEvent(event);
                          setShowEventDetails(true);
                        }}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Details</span>
                      </button>
                      <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <Edit className="w-4 h-4" />
                        <span>Edit Event</span>
                      </button>
                      <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <Copy className="w-4 h-4" />
                        <span>Duplicate</span>
                      </button>
                      <button
                        onClick={() => handleCancelEvent(event.id)}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-yellow-600 hover:bg-yellow-50"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Cancel Event</span>
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete Event</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {getEventsForDay(new Date()).length === 0 && (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events today</h3>
            <p className="text-gray-600">Your schedule is clear for today. Time to catch up or plan ahead!</p>
          </div>
        )}
      </div>

      {/* Event Details Modal */}
      {showEventDetails && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Event Details</h3>
                <button
                  onClick={() => setShowEventDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-start space-x-4 mb-6">
                <div className={`w-12 h-12 ${getTypeColor(selectedEvent.type)} rounded-xl flex items-center justify-center`}>
                  {getTypeIcon(selectedEvent.type)}
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-semibold text-gray-900 mb-1">{selectedEvent.title}</h4>
                  <p className="text-gray-600">{selectedEvent.courseName}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    {getStatusIcon(selectedEvent.status)}
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedEvent.status)}`}>
                      {selectedEvent.status.replace('_', ' ')}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      selectedEvent.type === 'lecture' ? 'bg-blue-100 text-blue-800' :
                      selectedEvent.type === 'practical' ? 'bg-green-100 text-green-800' :
                      selectedEvent.type === 'tutorial' ? 'bg-yellow-100 text-yellow-800' :
                      selectedEvent.type === 'exam' ? 'bg-red-100 text-red-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {selectedEvent.type}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Schedule Information</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Time:</span>
                      <span className="text-gray-900">
                        {formatTime(selectedEvent.startTime)} - {formatTime(selectedEvent.endTime)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Date:</span>
                      <span className="text-gray-900">
                        {new Date(selectedEvent.startTime).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Location:</span>
                      <span className="text-gray-900">{selectedEvent.room}</span>
                    </div>
                    {selectedEvent.isVirtual && (
                      <div className="flex items-center space-x-2">
                        <Video className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Virtual Room:</span>
                        <span className="text-gray-900">{selectedEvent.virtualRoomId || 'Available'}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Course Information</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Lecturer:</span>
                      <span className="text-gray-900">{selectedEvent.lecturerName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Course:</span>
                      <span className="text-gray-900">{selectedEvent.courseName}</span>
                    </div>
                    {selectedEvent.enrolledCount && (
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Enrolled:</span>
                        <span className="text-gray-900">{selectedEvent.enrolledCount} students</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {selectedEvent.description && (
                <div className="mt-6">
                  <h5 className="font-medium text-gray-900 mb-3">Description</h5>
                  <p className="text-sm text-gray-700">{selectedEvent.description}</p>
                </div>
              )}

              {selectedEvent.notes && (
                <div className="mt-6">
                  <h5 className="font-medium text-gray-900 mb-3">Notes</h5>
                  <p className="text-sm text-gray-700">{selectedEvent.notes}</p>
                </div>
              )}

              <div className="mt-6 flex space-x-3">
                <button className="flex items-center space-x-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors">
                  <Edit className="w-4 h-4" />
                  <span>Edit Event</span>
                </button>
                {selectedEvent.isVirtual && (
                  <button className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                    <Video className="w-4 h-4" />
                    <span>Join Virtual Room</span>
                  </button>
                )}
                <button className="flex items-center space-x-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors">
                  <Bell className="w-4 h-4" />
                  <span>Send Reminder</span>
                </button>
                <button 
                  onClick={() => handleCancelEvent(selectedEvent.id)}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Cancel Event</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
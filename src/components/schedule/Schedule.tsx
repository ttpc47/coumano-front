import React, { useState } from 'react';
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
  Download
} from 'lucide-react';

interface ScheduleEvent {
  id: string;
  title: string;
  course: string;
  lecturer: string;
  type: 'lecture' | 'practical' | 'tutorial' | 'exam';
  startTime: string;
  endTime: string;
  room: string;
  color: string;
}

export const Schedule: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const mockEvents: ScheduleEvent[] = [
    {
      id: '1',
      title: 'Advanced Algorithms',
      course: 'CS301',
      lecturer: 'Dr. Paul Mbarga',
      type: 'lecture',
      startTime: '2024-03-15T08:00:00',
      endTime: '2024-03-15T10:00:00',
      room: 'Amphitheater C',
      color: 'bg-blue-500'
    },
    {
      id: '2',
      title: 'Database Systems Practical',
      course: 'CS205',
      lecturer: 'Prof. Marie Nkomo',
      type: 'practical',
      startTime: '2024-03-15T14:00:00',
      endTime: '2024-03-15T17:00:00',
      room: 'Lab B-205',
      color: 'bg-green-500'
    },
    {
      id: '3',
      title: 'Linear Algebra Tutorial',
      course: 'MATH201',
      lecturer: 'Dr. Jean Fotso',
      type: 'tutorial',
      startTime: '2024-03-16T10:00:00',
      endTime: '2024-03-16T12:00:00',
      room: 'Room C-301',
      color: 'bg-yellow-500'
    },
    {
      id: '4',
      title: 'Software Engineering',
      course: 'CS302',
      lecturer: 'Dr. Sarah Biya',
      type: 'lecture',
      startTime: '2024-03-16T14:00:00',
      endTime: '2024-03-16T16:00:00',
      room: 'Amphitheater A',
      color: 'bg-purple-500'
    },
    {
      id: '5',
      title: 'Midterm Exam - Algorithms',
      course: 'CS301',
      lecturer: 'Dr. Paul Mbarga',
      type: 'exam',
      startTime: '2024-03-17T09:00:00',
      endTime: '2024-03-17T12:00:00',
      room: 'Exam Hall 1',
      color: 'bg-red-500'
    }
  ];

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
    return mockEvents.filter(event => 
      event.startTime.startsWith(dayStr)
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lecture': return <BookOpen className="w-4 h-4" />;
      case 'practical': return <Clock className="w-4 h-4" />;
      case 'tutorial': return <User className="w-4 h-4" />;
      case 'exam': return <Calendar className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  const weekDays = getWeekDays(currentDate);
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Schedule</h1>
          <p className="text-gray-600 mt-1">View and manage your academic timetable</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all duration-200">
            <Plus className="w-4 h-4" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

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
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
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
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'week' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'month' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Month
              </button>
            </div>
          </div>
        </div>

        {/* Week View */}
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
                    <div key={`${day.toISOString()}-${timeSlot}`} className="bg-white p-2 min-h-[60px] relative">
                      {hourEvents.map(event => (
                        <div
                          key={event.id}
                          className={`${event.color} text-white text-xs p-2 rounded-md mb-1 cursor-pointer hover:opacity-90 transition-opacity`}
                        >
                          <div className="font-medium truncate">{event.title}</div>
                          <div className="flex items-center space-x-1 mt-1 opacity-90">
                            {getTypeIcon(event.type)}
                            <span>{event.room}</span>
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
      </div>

      {/* Today's Events */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Events</h2>
        <div className="space-y-4">
          {getEventsForDay(new Date()).map((event) => (
            <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className={`w-4 h-12 ${event.color} rounded-full`}></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{event.title}</h3>
                    <p className="text-sm text-gray-600">{event.course} • {event.lecturer}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{event.room}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    event.type === 'lecture' ? 'bg-blue-100 text-blue-800' :
                    event.type === 'practical' ? 'bg-green-100 text-green-800' :
                    event.type === 'tutorial' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {event.type}
                  </span>
                  <button className="text-primary-600 hover:text-primary-800 text-sm font-medium">
                    View Details
                  </button>
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

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockEvents.filter(e => {
                  const eventDate = new Date(e.startTime);
                  const weekStart = new Date(currentDate);
                  weekStart.setDate(currentDate.getDate() - currentDate.getDay() + 1);
                  const weekEnd = new Date(weekStart);
                  weekEnd.setDate(weekStart.getDate() + 6);
                  return eventDate >= weekStart && eventDate <= weekEnd;
                }).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-xl">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Practicals</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockEvents.filter(e => e.type === 'practical').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-100 rounded-xl">
              <User className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Tutorials</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockEvents.filter(e => e.type === 'tutorial').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-100 rounded-xl">
              <Calendar className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Exams</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockEvents.filter(e => e.type === 'exam').length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
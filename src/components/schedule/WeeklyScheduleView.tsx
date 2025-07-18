import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Edit, Trash2, Plus, Eye } from 'lucide-react';
import { Course, CourseSchedule } from '../../types';

interface WeeklyScheduleViewProps {
  courses: Course[];
  onEditSchedule: (course: Course, schedule: CourseSchedule) => void;
  onDeleteSchedule: (course: Course, scheduleId: string) => void;
  onAddSchedule: (course: Course) => void;
  onViewDetails: (course: Course, schedule: CourseSchedule) => void;
}

export const WeeklyScheduleView: React.FC<WeeklyScheduleViewProps> = ({
  courses,
  onEditSchedule,
  onDeleteSchedule,
  onAddSchedule,
  onViewDetails
}) => {
  const [selectedCourse, setSelectedCourse] = useState<string>('all');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

  const filteredCourses = selectedCourse === 'all' 
    ? courses 
    : courses.filter(course => course.id === selectedCourse);

  const getSchedulesForDayAndHour = (day: string, hour: number) => {
    const schedules: Array<{ course: Course; schedule: CourseSchedule }> = [];
    
    filteredCourses.forEach(course => {
      course.schedule.forEach(schedule => {
        if (schedule.day === day) {
          const startHour = parseInt(schedule.startTime.split(':')[0]);
          const endHour = parseInt(schedule.endTime.split(':')[0]);
          
          if (hour >= startHour && hour < endHour) {
            schedules.push({ course, schedule });
          }
        }
      });
    });
    
    return schedules;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lecture': return 'bg-blue-500 hover:bg-blue-600';
      case 'practical': return 'bg-green-500 hover:bg-green-600';
      case 'tutorial': return 'bg-yellow-500 hover:bg-yellow-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const calculateScheduleHeight = (schedule: CourseSchedule) => {
    const startMinutes = parseInt(schedule.startTime.split(':')[0]) * 60 + parseInt(schedule.startTime.split(':')[1]);
    const endMinutes = parseInt(schedule.endTime.split(':')[0]) * 60 + parseInt(schedule.endTime.split(':')[1]);
    const duration = endMinutes - startMinutes;
    return Math.max(60, (duration / 60) * 60); // Minimum 60px height
  };

  return (
    <div className="space-y-6">
      {/* Course Filter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filter by Course:</label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Courses</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.code} - {course.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="text-sm text-gray-600">
          Total Sessions: {filteredCourses.reduce((sum, course) => sum + course.schedule.length, 0)}
        </div>
      </div>

      {/* Weekly Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-8 gap-px bg-gray-200">
          {/* Time Column Header */}
          <div className="bg-gray-50 p-4 font-medium text-gray-600 text-center">
            Time
          </div>
          
          {/* Day Headers */}
          {daysOfWeek.map((day) => (
            <div key={day} className="bg-gray-50 p-4 text-center">
              <div className="font-semibold text-gray-900">{day}</div>
              <div className="text-sm text-gray-500 mt-1">
                {getSchedulesForDayAndHour(day, 8).length + 
                 getSchedulesForDayAndHour(day, 12).length + 
                 getSchedulesForDayAndHour(day, 16).length} sessions
              </div>
            </div>
          ))}

          {/* Time Slots */}
          {timeSlots.map(hour => (
            <React.Fragment key={hour}>
              {/* Time Label */}
              <div className="bg-white p-4 text-center text-sm font-medium text-gray-600 border-r border-gray-200">
                {hour}:00
              </div>
              
              {/* Day Columns */}
              {daysOfWeek.map(day => {
                const daySchedules = getSchedulesForDayAndHour(day, hour);
                
                return (
                  <div key={`${day}-${hour}`} className="bg-white p-2 min-h-[80px] relative">
                    {daySchedules.map(({ course, schedule }, index) => (
                      <div
                        key={`${course.id}-${schedule.id}-${index}`}
                        className={`${getTypeColor(schedule.type)} text-white text-xs p-2 rounded-md mb-1 cursor-pointer transition-all duration-200 group relative`}
                        style={{ 
                          height: `${Math.min(calculateScheduleHeight(schedule), 76)}px`,
                          zIndex: 10 + index
                        }}
                        onClick={() => onViewDetails(course, schedule)}
                      >
                        <div className="font-medium truncate">{course.code}</div>
                        <div className="truncate opacity-90">{course.name}</div>
                        <div className="flex items-center space-x-1 mt-1 opacity-90">
                          <Clock className="w-3 h-3" />
                          <span>{schedule.startTime}-{schedule.endTime}</span>
                        </div>
                        <div className="flex items-center space-x-1 opacity-90">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{schedule.room}</span>
                        </div>
                        
                        {/* Action Buttons - Show on Hover */}
                        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex space-x-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditSchedule(course, schedule);
                              }}
                              className="p-1 bg-white bg-opacity-20 rounded hover:bg-opacity-30 transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteSchedule(course, schedule.id);
                              }}
                              className="p-1 bg-white bg-opacity-20 rounded hover:bg-opacity-30 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Add Schedule Button - Show on Empty Slots */}
                    {daySchedules.length === 0 && (
                      <button
                        onClick={() => {
                          if (selectedCourse !== 'all') {
                            const course = courses.find(c => c.id === selectedCourse);
                            if (course) onAddSchedule(course);
                          }
                        }}
                        className="w-full h-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-md transition-colors group"
                        disabled={selectedCourse === 'all'}
                      >
                        <Plus className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Types</h3>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-700">Lecture</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-700">Practical</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-sm text-gray-700">Tutorial</span>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-3">
          Click on a session to view details. Hover over sessions to see edit and delete options.
          {selectedCourse === 'all' && ' Select a specific course to add new schedules.'}
        </p>
      </div>
    </div>
  );
};
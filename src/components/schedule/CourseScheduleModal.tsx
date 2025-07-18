import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, User, BookOpen, AlertTriangle, CheckCircle, Plus, Trash2 } from 'lucide-react';
import { Course, CourseSchedule } from '../../types';

interface CourseScheduleModalProps {
  course?: Course;
  schedule?: CourseSchedule;
  onClose: () => void;
  onSubmit: (scheduleData: Omit<CourseSchedule, 'id'>) => void;
  existingSchedules: CourseSchedule[];
  isEdit?: boolean;
}

interface TimeSlot {
  start: string;
  end: string;
}

interface ConflictCheck {
  hasConflict: boolean;
  conflictingSchedules: CourseSchedule[];
  message: string;
}

export const CourseScheduleModal: React.FC<CourseScheduleModalProps> = ({
  course,
  schedule,
  onClose,
  onSubmit,
  existingSchedules,
  isEdit = false
}) => {
  const [formData, setFormData] = useState({
    day: schedule?.day || '',
    startTime: schedule?.startTime || '',
    endTime: schedule?.endTime || '',
    room: schedule?.room || '',
    type: schedule?.type || 'lecture' as 'lecture' | 'practical' | 'tutorial'
  });

  const [conflicts, setConflicts] = useState<ConflictCheck>({
    hasConflict: false,
    conflictingSchedules: [],
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  const rooms = [
    'Amphitheater A', 'Amphitheater B', 'Amphitheater C',
    'Lab A-101', 'Lab A-205', 'Lab B-101', 'Lab B-205',
    'Room C-301', 'Room C-302', 'Room D-101', 'Room D-102',
    'Conference Room 1', 'Conference Room 2'
  ];

  const timeSlots: TimeSlot[] = [
    { start: '07:00', end: '08:00' },
    { start: '08:00', end: '09:00' },
    { start: '09:00', end: '10:00' },
    { start: '10:00', end: '11:00' },
    { start: '11:00', end: '12:00' },
    { start: '12:00', end: '13:00' },
    { start: '13:00', end: '14:00' },
    { start: '14:00', end: '15:00' },
    { start: '15:00', end: '16:00' },
    { start: '16:00', end: '17:00' },
    { start: '17:00', end: '18:00' },
    { start: '18:00', end: '19:00' }
  ];

  useEffect(() => {
    checkForConflicts();
  }, [formData.day, formData.startTime, formData.endTime, formData.room]);

  const checkForConflicts = () => {
    if (!formData.day || !formData.startTime || !formData.endTime || !formData.room) {
      setConflicts({ hasConflict: false, conflictingSchedules: [], message: '' });
      return;
    }

    const conflictingSchedules = existingSchedules.filter(existingSchedule => {
      // Skip self when editing
      if (isEdit && schedule && existingSchedule.id === schedule.id) {
        return false;
      }

      // Check same day and room
      if (existingSchedule.day === formData.day && existingSchedule.room === formData.room) {
        // Check time overlap
        const newStart = timeToMinutes(formData.startTime);
        const newEnd = timeToMinutes(formData.endTime);
        const existingStart = timeToMinutes(existingSchedule.startTime);
        const existingEnd = timeToMinutes(existingSchedule.endTime);

        return (newStart < existingEnd && newEnd > existingStart);
      }

      return false;
    });

    if (conflictingSchedules.length > 0) {
      setConflicts({
        hasConflict: true,
        conflictingSchedules,
        message: `Room ${formData.room} is already booked on ${formData.day} during this time.`
      });
    } else {
      setConflicts({ hasConflict: false, conflictingSchedules: [], message: '' });
    }
  };

  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.day) newErrors.day = 'Day is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.endTime) newErrors.endTime = 'End time is required';
    if (!formData.room) newErrors.room = 'Room is required';

    if (formData.startTime && formData.endTime) {
      const startMinutes = timeToMinutes(formData.startTime);
      const endMinutes = timeToMinutes(formData.endTime);
      
      if (endMinutes <= startMinutes) {
        newErrors.endTime = 'End time must be after start time';
      }

      const duration = endMinutes - startMinutes;
      if (duration < 30) {
        newErrors.endTime = 'Minimum duration is 30 minutes';
      }
      if (duration > 240) {
        newErrors.endTime = 'Maximum duration is 4 hours';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (conflicts.hasConflict) {
      if (!window.confirm('There are scheduling conflicts. Do you want to proceed anyway?')) {
        return;
      }
    }

    onSubmit(formData);
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 7; hour <= 19; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        options.push(time);
      }
    }
    return options;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lecture': return 'bg-blue-100 text-blue-800';
      case 'practical': return 'bg-green-100 text-green-800';
      case 'tutorial': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {isEdit ? 'Edit Schedule' : 'Add Schedule'}
              </h2>
              <p className="text-sm text-gray-600">
                {course ? `${course.code} - ${course.name}` : 'Course Schedule'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Conflict Warning */}
          {conflicts.hasConflict && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-red-800">Scheduling Conflict</h4>
                  <p className="text-sm text-red-700 mt-1">{conflicts.message}</p>
                  <div className="mt-2 space-y-1">
                    {conflicts.conflictingSchedules.map((conflictSchedule, index) => (
                      <p key={index} className="text-xs text-red-600">
                        • {conflictSchedule.startTime} - {conflictSchedule.endTime} ({conflictSchedule.type})
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Day Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Day of Week *
              </label>
              <select
                value={formData.day}
                onChange={(e) => setFormData(prev => ({ ...prev, day: e.target.value }))}
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.day ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select Day</option>
                {daysOfWeek.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
              {errors.day && <p className="text-red-600 text-sm mt-1">{errors.day}</p>}
            </div>

            {/* Session Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="lecture">Lecture</option>
                <option value="practical">Practical</option>
                <option value="tutorial">Tutorial</option>
              </select>
            </div>

            {/* Start Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time *
              </label>
              <select
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.startTime ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select Start Time</option>
                {generateTimeOptions().map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
              {errors.startTime && <p className="text-red-600 text-sm mt-1">{errors.startTime}</p>}
            </div>

            {/* End Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Time *
              </label>
              <select
                value={formData.endTime}
                onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.endTime ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select End Time</option>
                {generateTimeOptions().map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
              {errors.endTime && <p className="text-red-600 text-sm mt-1">{errors.endTime}</p>}
            </div>

            {/* Room Selection */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room/Location *
              </label>
              <select
                value={formData.room}
                onChange={(e) => setFormData(prev => ({ ...prev, room: e.target.value }))}
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.room ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select Room</option>
                {rooms.map(room => (
                  <option key={room} value={room}>{room}</option>
                ))}
              </select>
              {errors.room && <p className="text-red-600 text-sm mt-1">{errors.room}</p>}
            </div>
          </div>

          {/* Duration Info */}
          {formData.startTime && formData.endTime && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <div>
                  <h4 className="text-sm font-medium text-blue-800">Session Duration</h4>
                  <p className="text-sm text-blue-700">
                    {Math.round((timeToMinutes(formData.endTime) - timeToMinutes(formData.startTime)) / 60 * 10) / 10} hours
                    ({timeToMinutes(formData.endTime) - timeToMinutes(formData.startTime)} minutes)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Schedule Preview */}
          {formData.day && formData.startTime && formData.endTime && formData.room && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Schedule Preview</h4>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className={`w-4 h-12 bg-blue-500 rounded-full`}></div>
                  <div>
                    <h5 className="font-semibold text-gray-900">
                      {course?.name || 'Course Name'}
                    </h5>
                    <p className="text-sm text-gray-600">
                      {course?.code || 'Course Code'} • {course?.lecturer?.name || 'Lecturer'}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formData.day}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{formData.startTime} - {formData.endTime}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{formData.room}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(formData.type)}`}>
                  {formData.type}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={conflicts.hasConflict && !window.confirm}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isEdit ? 'Update Schedule' : 'Add Schedule'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
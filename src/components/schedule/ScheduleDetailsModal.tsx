import React from 'react';
import { X, Calendar, Clock, MapPin, User, BookOpen, Edit, Trash2, Copy } from 'lucide-react';
import { Course, CourseSchedule } from '../../types';

interface ScheduleDetailsModalProps {
  course: Course;
  schedule: CourseSchedule;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export const ScheduleDetailsModal: React.FC<ScheduleDetailsModalProps> = ({
  course,
  schedule,
  onClose,
  onEdit,
  onDelete,
  onDuplicate
}) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lecture': return 'bg-blue-100 text-blue-800';
      case 'practical': return 'bg-green-100 text-green-800';
      case 'tutorial': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateDuration = () => {
    const startMinutes = parseInt(schedule.startTime.split(':')[0]) * 60 + parseInt(schedule.startTime.split(':')[1]);
    const endMinutes = parseInt(schedule.endTime.split(':')[0]) * 60 + parseInt(schedule.endTime.split(':')[1]);
    const duration = endMinutes - startMinutes;
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <Calendar className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Schedule Details</h2>
              <div className="flex items-center space-x-3 mt-1">
                <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-primary-50 text-primary-800">
                  {course.code}
                </span>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getTypeColor(schedule.type)}`}>
                  {schedule.type}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onEdit}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>Edit</span>
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
        <div className="p-6 space-y-6">
          {/* Course Information */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <BookOpen className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Course Name</p>
                  <p className="font-medium text-gray-900">{course.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Lecturer</p>
                  <p className="font-medium text-gray-900">{course.lecturer?.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <BookOpen className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Credits</p>
                  <p className="font-medium text-gray-900">{course.credits}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Department</p>
                  <p className="font-medium text-gray-900">{course.lecturer?.department || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Schedule Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-600">Day of Week</p>
                    <p className="font-medium text-gray-900">{schedule.day}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-sm text-gray-600">Time</p>
                    <p className="font-medium text-gray-900">
                      {schedule.startTime} - {schedule.endTime}
                    </p>
                    <p className="text-xs text-gray-500">Duration: {calculateDuration()}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium text-gray-900">{schedule.room}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-5 h-5 text-orange-400" />
                  <div>
                    <p className="text-sm text-gray-600">Session Type</p>
                    <span className={`inline-flex px-2 py-1 text-sm font-medium rounded-full ${getTypeColor(schedule.type)}`}>
                      {schedule.type}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Specialties */}
          {course.specialties && course.specialties.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Target Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {course.specialties.map((specialty, index) => (
                  <span key={index} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{calculateDuration()}</div>
              <div className="text-sm text-blue-700">Session Duration</div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{course.credits}</div>
              <div className="text-sm text-green-700">Course Credits</div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {course.specialties?.length || 0}
              </div>
              <div className="text-sm text-purple-700">Specialties</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="flex space-x-3">
              <button
                onClick={onEdit}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Schedule</span>
              </button>
              
              <button
                onClick={onDuplicate}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Copy className="w-4 h-4" />
                <span>Duplicate</span>
              </button>
            </div>
            
            <button
              onClick={onDelete}
              className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Schedule</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
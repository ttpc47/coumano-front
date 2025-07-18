import React from 'react';
import { X, BookOpen, User, Calendar, Edit } from 'lucide-react';
import { Course } from '../../types/index.ts';

interface CourseDetailModalProps {
  course: Course;
  onClose: () => void;
  onEdit: () => void;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  course,
  onClose,
  onEdit
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">{course.name}</h2>
              <div className="flex items-center space-x-3 mt-1">
                <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-primary-50 text-primary-800">
                  {course.code}
                </span>
                {/* <span className="inline-flex px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-800">
                  {course.department}
                </span> */}
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
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Information</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Lecturer</p>
                  <p className="font-medium text-gray-900">{course.lecturer.lastName}</p>
                  <p className="text-xs text-gray-500">{course.lecturer.email}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <BookOpen className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-sm text-gray-600">Credits</p>
                  <p className="font-medium text-gray-900">{course.credits}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Description</p>
                <p className="text-gray-900">{course.description}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule</h3>
            <div className="space-y-2">
              {course.schedule.map((slot, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs bg-gray-50 rounded p-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    <span>{slot.day} {slot.startTime}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">{slot.room}</span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {slot.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
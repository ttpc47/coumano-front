import React from 'react';
import { 
  X, 
  GraduationCap, 
  Building, 
  User, 
  Edit 
} from 'lucide-react';

interface SpecialtyType {
  name: string;
  code: string;
  department: string;
  description?: string;
  head?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface SpecialtyDetailsModalProps {
  specialty: SpecialtyType;
  onClose: () => void;
  onEdit: () => void;
}

export const SpecialtyDetailsModal: React.FC<SpecialtyDetailsModalProps> = ({
  specialty,
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">{specialty.name}</h2>
              <div className="flex items-center space-x-3 mt-1">
                <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-50 text-blue-800">
                  {specialty.code}
                </span>
                <span className="inline-flex px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-800">
                  {specialty.department}
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
          {/* Basic Information */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Specialty Information</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Building className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Department</p>
                  <p className="font-medium text-gray-900">{specialty.department}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <GraduationCap className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-sm text-gray-600">Specialty Code</p>
                  <p className="font-medium text-gray-900">{specialty.code}</p>
                </div>
              </div>
              {specialty.head && (
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-sm text-gray-600">Head of Specialty</p>
                    <p className="font-medium text-gray-900">{specialty.head}</p>
                  </div>
                </div>
              )}
              {specialty.description && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Description</p>
                  <p className="text-gray-900">{specialty.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Metadata</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Created At</span>
                <span className="font-medium text-gray-900">{formatDate(specialty.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Updated</span>
                <span className="font-medium text-gray-900">{formatDate(specialty.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
  )};
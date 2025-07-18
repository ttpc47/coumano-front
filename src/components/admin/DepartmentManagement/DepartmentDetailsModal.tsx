import React from 'react';
import { 
  X, 
  Building2, 
  Users, 
  BookOpen, 
  GraduationCap, 
  Edit 
} from 'lucide-react';

interface DepartmentDetailsModalProps {
  department: {
    id: string;
    name: string;
    code: string;
    head: string;
    description: string;
    specialtyCount: number;
    studentCount: number;
    lecturerCount: number;
    established: string;
  };
  onClose: () => void;
  onEdit: () => void;
}

export const DepartmentDetailsModal: React.FC<DepartmentDetailsModalProps> = ({
  department,
  onClose,
  onEdit
}) => {
  return (
    // Wrap all JSX in a single parent element (a React fragment or a div)
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <Building2 className="w-8 h-8 text-primary-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">{department.name}</h2>
                <div className="flex items-center space-x-3 mt-1">
                  <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-primary-50 text-primary-800">
                    {department.code}
                  </span>
                  <span className="inline-flex px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-800">
                    Established: {department.established}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={onEdit}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
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

          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Building2 className="w-5 h-5 text-primary-400" />
                  <div>
                    <p className="text-sm text-gray-600">Department Name</p>
                    <p className="font-medium text-gray-900">{department.name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <GraduationCap className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-sm text-gray-600">Department Code</p>
                    <p className="font-medium text-gray-900">{department.code}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-secondary-400" />
                  <div>
                    <p className="text-sm text-gray-600">Head of Department</p>
                    <p className="font-medium text-gray-900">{department.head}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Description</p>
                  <p className="text-gray-900">{department.description}</p>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <GraduationCap className="w-6 h-6 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Specialties</p>
                    <p className="font-bold text-gray-900">{department.specialtyCount}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-6 h-6 text-secondary-600" />
                  <div>
                    <p className="text-sm text-gray-600">Students</p>
                    <p className="font-bold text-gray-900">{department.studentCount}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-6 h-6 text-accent-600" />
                  <div>
                    <p className="text-sm text-gray-600">Lecturers</p>
                    <p className="font-bold text-gray-900">{department.lecturerCount}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
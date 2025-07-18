import React, { useState } from 'react';
import { X, Edit, User } from 'lucide-react';

interface EditDepartmentModalProps {
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
  onSubmit: (updatedDepartment: {
    id: string;
    name: string;
    code: string;
    head: string;
    description: string;
    specialtyCount: number;
    studentCount: number;
    lecturerCount: number;
    established: string;
  }) => void;
  heads: string[];
}

export const EditDepartmentModal: React.FC<EditDepartmentModalProps> = ({
  department,
  onClose,
  onSubmit,
  heads
}) => {
  const [formData, setFormData] = useState({
    id: department.id,
    name: department.name,
    code: department.code,
    head: department.head,
    description: department.description,
    specialtyCount: department.specialtyCount,
    studentCount: department.studentCount,
    lecturerCount: department.lecturerCount,
    established: department.established,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Department name is required';
    if (!formData.code.trim()) newErrors.code = 'Department code is required';
    if (!formData.head) newErrors.head = 'Department head is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Edit className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Edit Department</h2>
              <p className="text-sm text-gray-600">Update department information</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter department name"
              />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department Code *
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={e => setFormData(prev => ({ ...prev, code: e.target.value }))}
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.code ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter department code"
              />
              {errors.code && <p className="text-red-600 text-sm mt-1">{errors.code}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Department Head *
              </label>
              <select
                value={formData.head}
                onChange={e => setFormData(prev => ({ ...prev, head: e.target.value }))}
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.head ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select Department Head</option>
                {heads.map(head => (
                  <option key={head} value={head}>{head}</option>
                ))}
              </select>
              {errors.head && <p className="text-red-600 text-sm mt-1">{errors.head}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter department description"
                rows={3}
              />
              {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Established *
              </label>
              <input
                type="text"
                value={formData.established}
                onChange={e => setFormData(prev => ({ ...prev, established: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300"
                placeholder="e.g. 1998"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specialties
              </label>
              <input
                type="number"
                value={formData.specialtyCount}
                onChange={e => setFormData(prev => ({ ...prev, specialtyCount: Number(e.target.value) }))}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300"
                min={0}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Students
              </label>
              <input
                type="number"
                value={formData.studentCount}
                onChange={e => setFormData(prev => ({ ...prev, studentCount: Number(e.target.value) }))}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300"
                min={0}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lecturers
              </label>
              <input
                type="number"
                value={formData.lecturerCount}
                onChange={e => setFormData(prev => ({ ...prev, lecturerCount: Number(e.target.value) }))}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300"
                min={0}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Course, User } from '../../types';

interface CreateCourseModalProps {
  onClose: () => void;
  onSubmit: (course: Course) => void;
  departments: string[];
  specialties: string[];
}

export const CreateCourseModal: React.FC<CreateCourseModalProps> = ({
  onClose,
  onSubmit,
  departments,
  specialties
}) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    credits: 3,
    lecturerName: '',
    lecturerEmail: '',
    department: '',
    specialties: [] as string[],
    description: '',
    isShared: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Course name is required';
    if (!formData.code.trim()) newErrors.code = 'Course code is required';
    if (!formData.specialties.length) newErrors.specialties = 'At least one specialty is required';
    if (!formData.lecturerName.trim()) newErrors.lecturerName = 'Lecturer is required';
    if (!formData.department) newErrors.department = 'Department is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const lecturer: User = {
        id: '',
        matricule: '',
        firstName: formData.lecturerName.split(' ')[0] || '',
        lastName: formData.lecturerName.split(' ').slice(1).join(' ') || '',
        email: formData.lecturerEmail,
        phone: '',
        isActive: true,
        role: 'lecturer',
        isFirstLogin: false,
        createdAt: '',
        name: formData.lecturerName,
        department: formData.department,
      };
      const course: Course = {
        id: '', // Will be set by parent
        name: formData.name,
        code: formData.code,
        credits: formData.credits,
        lecturer,
        specialties: formData.specialties,
        schedule: [],
        materials: [],
        isShared: formData.isShared,
        description: formData.description,
      };
      onSubmit(course);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Plus className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Create Course</h2>
              <p className="text-sm text-gray-600">Add a new course</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full border rounded-lg px-3 py-2 ${errors.name ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="Enter course name"
              />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course Code *</label>
              <input
                type="text"
                value={formData.code}
                onChange={e => setFormData(prev => ({ ...prev, code: e.target.value }))}
                className={`w-full border rounded-lg px-3 py-2 ${errors.code ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="Enter course code"
              />
              {errors.code && <p className="text-red-600 text-sm mt-1">{errors.code}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Credits</label>
              <input
                type="number"
                value={formData.credits}
                min={1}
                max={10}
                onChange={e => setFormData(prev => ({ ...prev, credits: Number(e.target.value) }))}
                className="w-full border rounded-lg px-3 py-2 border-gray-300"
                placeholder="Credits"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lecturer *</label>
              <input
                type="text"
                value={formData.lecturerName}
                onChange={e => setFormData(prev => ({ ...prev, lecturerName: e.target.value }))}
                className={`w-full border rounded-lg px-3 py-2 ${errors.lecturerName ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="Lecturer name"
              />
              {errors.lecturerName && <p className="text-red-600 text-sm mt-1">{errors.lecturerName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lecturer Email</label>
              <input
                type="email"
                value={formData.lecturerEmail}
                onChange={e => setFormData(prev => ({ ...prev, lecturerEmail: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 border-gray-300"
                placeholder="Lecturer email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
              <select
                value={formData.department}
                onChange={e => setFormData(prev => ({ ...prev, department: e.target.value }))}
                className={`w-full border rounded-lg px-3 py-2 ${errors.department ? 'border-red-300' : 'border-gray-300'}`}
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              {errors.department && <p className="text-red-600 text-sm mt-1">{errors.department}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Specialties *</label>
              <div className="w-full border rounded-lg px-3 py-2 border-gray-300 bg-white">
                {specialties
                  .filter(spec => !formData.department || spec.startsWith(formData.department))
                  .map(spec => (
                    <label key={spec} className="flex items-center space-x-2 py-1">
                      <input
                        type="checkbox"
                        checked={formData.specialties.includes(spec)}
                        onChange={e => {
                          setFormData(prev => ({
                            ...prev,
                            specialties: e.target.checked
                              ? [...prev.specialties, spec]
                              : prev.specialties.filter(s => s !== spec)
                          }));
                        }}
                        className="rounded text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">{spec}</span>
                    </label>
                  ))}
                {formData.department && specialties.filter(spec => spec.startsWith(formData.department)).length === 0 && (
                  <span className="text-gray-400 text-sm">No specialties for this department</span>
                )}
              </div>
              {errors.specialties && <p className="text-red-600 text-sm mt-1">{errors.specialties}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2 border-gray-300"
              placeholder="Course description"
              rows={3}
            />
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
              Create Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
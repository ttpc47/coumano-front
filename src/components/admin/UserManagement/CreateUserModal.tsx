/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { X, User, Mail, Building, Key, Phone, Calendar, GraduationCap } from 'lucide-react';
import { User as UserType } from '../../../types';
import { userService } from '../../../services/userService';

interface CreateUserModalProps {
  onClose: () => void;
  onSubmit: (userData: Partial<UserType>) => void;
  departments: string[];
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({
  onClose,
  onSubmit,
  departments
}) => {
  const [formData, setFormData] = useState({
    name:'',
    firstName: '',
    lastName:'',
    email: '',
    role: 'student' as UserType['role'],
    department: '',
    matriculeNumber: '',
    phone: '',
    yearOfStudy: 1,
    specialization: ''
  });

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({});

  const generateMatriculeNumber = (role: string, department: string) => {
    const rolePrefix = {
      student: 'STU',
      Lecturer: 'LEC',
      admin: 'ADM',
    }[role] || 'USR';
    
    const year = new Date().getFullYear();
    const str = year.toString();
    const yearsuffix = str.substring((str.length)-2)
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${yearsuffix}${rolePrefix}${random}`;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
     if (!formData.firstName.trim()) {
      newErrors.firstName = 'first name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'first name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.department) {
      newErrors.department = 'Department is required';
    }

    if (!formData.matriculeNumber.trim()) {
      newErrors.matriculeNumber = 'Matricule number is required';
    }

    if (formData.role === 'student' && (!formData.yearOfStudy || formData.yearOfStudy < 1 || formData.yearOfStudy > 6)) {
      newErrors.yearOfStudy = 'Year of study must be between 1 and 6';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateUser = async() =>{
    try{
      setLoading(true);
      await userService.createUser(formData);
    }catch(error){
    console.log("user creation error");
    }finally{
      setLoading(False)
    }
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleRoleChange = (role: UserType['role']) => {
    setFormData(prev => ({
      ...prev,
      role,
      matriculeNumber: generateMatriculeNumber(role, prev.department)
    }));
  };

  const handleDepartmentChange = (department: string) => {
    setFormData(prev => ({
      ...prev,
      department,
      matriculeNumber: generateMatriculeNumber(prev.role, prev.department)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Create New User</h2>
              <p className="text-sm text-gray-600">Add a new user to the system</p>
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
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter full name"
                />
                {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter email address"
                />
                {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => handleRoleChange(e.target.value as UserType['role'])}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="student">Student</option>
                  <option value="lecturer">Lecturer</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Building className="w-4 h-4 inline mr-1" />
                  Department *
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => handleDepartmentChange(e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.department ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                {errors.department && <p className="text-red-600 text-sm mt-1">{errors.department}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Key className="w-4 h-4 inline mr-1" />
                  Matricule Number *
                </label>
                <input
                  type="text"
                  value={formData.matriculeNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, matriculeNumber: e.target.value }))}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.matriculeNumber ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Auto-generated or custom"
                />
                {errors.matriculeNumber && <p className="text-red-600 text-sm mt-1">{errors.matriculeNumber}</p>}
                <p className="text-xs text-gray-500 mt-1">
                  Auto-generated based on role and department, or enter custom number
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter phone number"
                />
              </div>
            </div>
          </div>

          {/* Role-specific fields */}
          {formData.role === 'student' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Student Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <GraduationCap className="w-4 h-4 inline mr-1" />
                    Year of Study *
                  </label>
                  <select
                    value={formData.yearOfStudy}
                    onChange={(e) => setFormData(prev => ({ ...prev, yearOfStudy: parseInt(e.target.value) }))}
                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.yearOfStudy ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value={1}>1st Year</option>
                    <option value={2}>2nd Year</option>
                    <option value={3}>3rd Year</option>
                    <option value={4}>4th Year</option>
                    <option value={5}>5th Year</option>
                    <option value={6}>6th Year</option>
                  </select>
                  {errors.yearOfStudy && <p className="text-red-600 text-sm mt-1">{errors.yearOfStudy}</p>}
                </div>
              </div>
            </div>
          )}

          {formData.role === 'lecturer' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Lecturer Information</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialization
                  </label>
                  <input
                    type="text"
                    value={formData.specialization}
                    onChange={(e) => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Medieval Studies, Digital Humanities"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Default Password Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Key className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800">Default Password</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  A default password will be generated for this user. They will be required to change it upon first login.
                </p>
              </div>
            </div>
          </div>

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
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
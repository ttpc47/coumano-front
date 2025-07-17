import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Users,
  BookOpen,
  GraduationCap,
  ChevronRight
} from 'lucide-react';

interface Department {
  id: string;
  name: string;
  code: string;
  head: string;
  description: string;
  specialtyCount: number;
  studentCount: number;
  lecturerCount: number;
  established: string;
}

export const DepartmentManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const mockDepartments: Department[] = [
    {
      id: '1',
      name: 'Computer Science',
      code: 'CS',
      head: 'Prof. Marie Nkomo',
      description: 'Advanced computing, software development, and information systems',
      specialtyCount: 4,
      studentCount: 347,
      lecturerCount: 12,
      established: '1995'
    },
    {
      id: '2',
      name: 'Mathematics',
      code: 'MATH',
      head: 'Dr. Jean Fotso',
      description: 'Pure and applied mathematics, statistics, and mathematical modeling',
      specialtyCount: 3,
      studentCount: 198,
      lecturerCount: 8,
      established: '1987'
    },
    {
      id: '3',
      name: 'Physics',
      code: 'PHYS',
      head: 'Prof. Amadou Diallo',
      description: 'Theoretical and experimental physics, materials science',
      specialtyCount: 2,
      studentCount: 156,
      lecturerCount: 6,
      established: '1990'
    },
    {
      id: '4',
      name: 'Engineering',
      code: 'ENG',
      head: 'Dr. Sarah Biya',
      description: 'Civil, mechanical, and electrical engineering programs',
      specialtyCount: 5,
      studentCount: 421,
      lecturerCount: 15,
      established: '1998'
    }
  ];

  const filteredDepartments = mockDepartments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.head.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Department Management</h1>
          <p className="text-gray-600 mt-1">Manage university departments and academic structure</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Create Department</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search departments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Departments</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{mockDepartments.length}</p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600">
              <Building2 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {mockDepartments.reduce((sum, dept) => sum + dept.studentCount, 0)}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-secondary-500 to-secondary-600">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Lecturers</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {mockDepartments.reduce((sum, dept) => sum + dept.lecturerCount, 0)}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Specialties</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {mockDepartments.reduce((sum, dept) => sum + dept.specialtyCount, 0)}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDepartments.map((department) => (
          <div key={department.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{department.code}</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{department.name}</h3>
                  <p className="text-sm text-gray-600">Established {department.established}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="text-secondary-600 hover:text-secondary-900 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="text-red-600 hover:text-red-900 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-gray-700 mb-4">{department.description}</p>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Department Head:</span>
                <span className="font-medium text-gray-900">{department.head}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-600">{department.specialtyCount}</p>
                <p className="text-xs text-gray-600">Specialties</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-secondary-600">{department.studentCount}</p>
                <p className="text-xs text-gray-600">Students</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-accent-600">{department.lecturerCount}</p>
                <p className="text-xs text-gray-600">Lecturers</p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors">
                <GraduationCap className="w-4 h-4" />
                <span>Manage Specialties</span>
              </button>
              <button className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredDepartments.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No departments found</h3>
          <p className="text-gray-600 mb-4">No departments match your search criteria.</p>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all duration-200"
          >
            Create First Department
          </button>
        </div>
      )}
    </div>
  );
};
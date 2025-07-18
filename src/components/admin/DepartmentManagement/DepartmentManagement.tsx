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
  // ChevronRight
} from 'lucide-react';
import {CreateDepartmentModal} from './CreateDepartmentModal';
import { DepartmentDetailsModal } from './DepartmentDetailsModal';
import { EditDepartmentModal } from './EditDepartmentModal'; // You must create this component if it doesn't exist

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

export const DepartmentManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [showStats, setShowStats] = useState(true);
  const [showFilters, setShowFilters] = useState(true);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

  // Function to handle department creation
  const handleCreateDepartment = (departmentData: {
    name: string;
    code: string;
    head: string;
    description: string;
  }) => {
    const newDepartment: Department = {
      id: Date.now().toString(),
      name: departmentData.name,
      code: departmentData.code,
      head: departmentData.head,
      description: departmentData.description,
      specialtyCount: 0,
      studentCount: 0,
      lecturerCount: 0,
      established: new Date().getFullYear().toString(),
    };
    setDepartments([...departments, newDepartment]);
    setShowCreateModal(false);
  };

  // Edit handler
  const handleEditDepartment = (departmentData: Partial<Department>) => {
    if (!selectedDepartment) return;
    setDepartments(departments.map(dept =>
      dept.id === selectedDepartment.id
        ? { ...dept, ...departmentData }
        : dept
    ));
    setShowEditModal(false);
    setSelectedDepartment(null);
  };

  // Delete handler
  const handleDeleteDepartment = (departmentId: string) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      setDepartments(departments.filter(dept => dept.id !== departmentId));
    }
  };

  const filteredDepartments = departments.filter(dept =>
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
        <div className="flex space-x-2">
          <button
            onClick={() => setShowStats((prev) => !prev)}
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {showStats ? 'Hide Stats' : 'Show Stats'}
          </button>
          <button
            onClick={() => setShowFilters((prev) => !prev)}
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Create Department</span>
          </button>
        </div>
      </div>

      {/* Search/Filters */}
      {showFilters && (
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
      )}

      {/* Stats Overview */}
      {showStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Departments</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{departments.length}</p>
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
                  {departments.reduce((sum, dept) => sum + dept.studentCount, 0)}
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
                  {departments.reduce((sum, dept) => sum + dept.lecturerCount, 0)}
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
                  {departments.reduce((sum, dept) => sum + dept.specialtyCount, 0)}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Departments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Established</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Head</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Specialties</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Students</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Lecturers</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredDepartments.map((department) => (
              <tr key={department.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-2 font-semibold text-primary-700">{department.code}</td>
                <td className="px-4 py-2 font-medium text-gray-900">{department.name}</td>
                <td className="px-4 py-2 text-gray-700">{department.established}</td>
                <td className="px-4 py-2 text-gray-700">{department.head}</td>
                <td className="px-4 py-2 text-gray-600">{department.description}</td>
                <td className="px-4 py-2 text-primary-600 font-bold text-center">{department.specialtyCount}</td>
                <td className="px-4 py-2 text-secondary-600 font-bold text-center">{department.studentCount}</td>
                <td className="px-4 py-2 text-accent-600 font-bold text-center">{department.lecturerCount}</td>
                <td className="px-4 py-2 flex space-x-2">
                  <button
                    className="text-primary-600 hover:text-primary-900 transition-colors"
                    onClick={() => {
                      console.log('Details clicked', department);
                      setSelectedDepartment(department);
                      setShowDetailsModal(true);
                    }}
                    title="View Details"
                  >
                    <Building2 className="w-4 h-4" />
                  </button>
                  <button
                    className="text-secondary-600 hover:text-secondary-900 transition-colors"
                    onClick={() => {
                      setSelectedDepartment(department);
                      setShowEditModal(true);
                    }}
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900 transition-colors"
                    onClick={() => handleDeleteDepartment(department.id)}
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredDepartments.length === 0 && (
              <tr>
                <td colSpan={9} className="py-12 text-center">
                  <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No departments found</h3>
                  <p className="text-gray-600 mb-4">No departments match your search criteria.</p>
                  <button 
                    onClick={() => setShowCreateModal(true)}
                    className="px-4 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all duration-200"
                  >
                    Create First Department
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showCreateModal && (
        <CreateDepartmentModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateDepartment}
          heads={departments.map(dept => dept.head)}
        />
      )}

      {showDetailsModal && selectedDepartment && (
        <DepartmentDetailsModal
          department={selectedDepartment}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedDepartment(null);
          }}
          onEdit={() => {
            setShowDetailsModal(false);
            setShowEditModal(true);
          }}
        />
      )}

      {showEditModal && selectedDepartment && (
        <EditDepartmentModal
          department={selectedDepartment}
          heads={departments.map(dept => dept.head)}
          onClose={() => {
            setShowEditModal(false);
            setSelectedDepartment(null);
          }}
          onSubmit={handleEditDepartment}
        />
      )}
    </div>
  );
};
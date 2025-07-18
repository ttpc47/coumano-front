import React, { useState } from 'react';
import { 
  GraduationCap, 
  Plus, 
  Search,
  Filter,
  Edit, 
  Trash2, 
  Users,
  BookOpen,
  Building2,
} from 'lucide-react';
import { CreateSpecialtyModal } from './CreateSpecialtyModal';
import { SpecialtyDetailsModal } from './SpecialtyDetailsModal';
import { EditSpecialtyModal } from './EditSpecialtyModal';

interface Specialty {
  id: string;
  name: string;
  code: string;
  department: string;
  departmentCode: string;
  level: number;
  duration: string;
  studentCount: number;
  courseCount: number;
  description: string;
  requirements: string[];
}

export const SpecialtyManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [showFilters, setShowFilters] = useState(true);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null);
  const [specialties, setSpecialties] = useState<Specialty[]>([
    {
      id: '1',
      name: 'Software Engineering',
      code: 'SE',
      department: 'Computer Science',
      departmentCode: 'CS',
      level: 3,
      duration: '3 years',
      studentCount: 87,
      courseCount: 12,
      description: 'Design and development of software systems and applications',
      requirements: ['Mathematics II', 'Programming Fundamentals', 'Data Structures']
    },
    {
      id: '2',
      name: 'Data Science',
      code: 'DS',
      department: 'Computer Science',
      departmentCode: 'CS',
      level: 3,
      duration: '3 years',
      studentCount: 64,
      courseCount: 10,
      description: 'Statistical analysis, machine learning, and big data processing',
      requirements: ['Statistics', 'Programming', 'Linear Algebra']
    },
    {
      id: '3',
      name: 'Cybersecurity',
      code: 'CYB',
      department: 'Computer Science',
      departmentCode: 'CS',
      level: 3,
      duration: '3 years',
      studentCount: 45,
      courseCount: 11,
      description: 'Information security, network protection, and digital forensics',
      requirements: ['Networks', 'Cryptography', 'Operating Systems']
    },
    {
      id: '4',
      name: 'Applied Mathematics',
      code: 'AM',
      department: 'Mathematics',
      departmentCode: 'MATH',
      level: 3,
      duration: '3 years',
      studentCount: 73,
      courseCount: 9,
      description: 'Mathematical modeling and computational mathematics',
      requirements: ['Calculus III', 'Differential Equations', 'Numerical Analysis']
    },
    {
      id: '5',
      name: 'Civil Engineering',
      code: 'CE',
      department: 'Engineering',
      departmentCode: 'ENG',
      level: 5,
      duration: '5 years',
      studentCount: 156,
      courseCount: 18,
      description: 'Infrastructure design, construction, and project management',
      requirements: ['Physics', 'Materials Science', 'Structural Analysis']
    }
  ]);

  const departments = ['Computer Science', 'Mathematics', 'Physics', 'Engineering'];
  const levels = [1, 2, 3, 4, 5];

  // Handle create specialty
  const handleCreateSpecialty = (specialtyData: {
    name: string;
    code: string;
    department: string;
    description: string;
  }) => {
    const newSpecialty: Specialty = {
      id: Date.now().toString(),
      name: specialtyData.name,
      code: specialtyData.code,
      department: specialtyData.department,
      departmentCode: specialtyData.department.slice(0, 4).toUpperCase(),
      level: 3,
      duration: '3 years',
      studentCount: 0,
      courseCount: 0,
      description: specialtyData.description,
      requirements: [],
    };
    setSpecialties([...specialties, newSpecialty]);
    setShowCreateModal(false);
  };

  const filteredSpecialties = specialties.filter(specialty => {
    const matchesSearch = specialty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         specialty.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         specialty.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || specialty.department === selectedDepartment;
    const matchesLevel = selectedLevel === 'all' || specialty.level.toString() === selectedLevel;
    return matchesSearch && matchesDepartment && matchesLevel;
  });

  const getLevelColor = (level: number) => {
    const colors = [
      'bg-green-100 text-green-800',
      'bg-blue-100 text-blue-800', 
      'bg-purple-100 text-purple-800',
      'bg-yellow-100 text-yellow-800',
      'bg-red-100 text-red-800'
    ];
    return colors[level - 1] || 'bg-gray-100 text-gray-800';
  };

  // Edit handler
  const handleEditSpecialty = (specialtyData: Partial<Specialty>) => {
    if (!selectedSpecialty) return;
    setSpecialties(specialties.map(spec =>
      spec.id === selectedSpecialty.id
        ? { ...spec, ...specialtyData }
        : spec
    ));
    setShowEditModal(false);
    setSelectedSpecialty(null);
  };

  // Delete handler
  const handleDeleteSpecialty = (specialtyId: string) => {
    if (window.confirm('Are you sure you want to delete this specialty?')) {
      setSpecialties(specialties.filter(spec => spec.id !== specialtyId));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Specialty Management</h1>
          <p className="text-gray-600 mt-1">Manage academic specialties and programs</p>
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
            <span>Create Specialty</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search specialties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Levels</option>
              {levels.map(level => (
                <option key={level} value={level.toString()}>Level {level}</option>
              ))}
            </select>

            <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <Filter className="w-4 h-4" />
              <span>More Filters</span>
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      {showStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Specialties</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{specialties.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Enrolled Students</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {specialties.reduce((sum, spec) => sum + spec.studentCount, 0)}
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
                <p className="text-sm font-medium text-gray-600">Total Courses</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {specialties.reduce((sum, spec) => sum + spec.courseCount, 0)}
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
                <p className="text-sm font-medium text-gray-600">Departments</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {new Set(specialties.map(s => s.department)).size}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600">
                <Building2 className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Specialties Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Level</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Students</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Courses</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredSpecialties.map((specialty) => (
              <tr key={specialty.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-2 font-semibold text-primary-700">{specialty.code}</td>
                <td className="px-4 py-2 font-medium text-gray-900">{specialty.name}</td>
                <td className="px-4 py-2 text-gray-700">{specialty.department}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(specialty.level)}`}>
                    Level {specialty.level}
                  </span>
                </td>
                <td className="px-4 py-2 text-gray-700">{specialty.duration}</td>
                <td className="px-4 py-2 text-secondary-600 font-bold text-center">{specialty.studentCount}</td>
                <td className="px-4 py-2 text-accent-600 font-bold text-center">{specialty.courseCount}</td>
                <td className="px-4 py-2 text-gray-600">{specialty.description}</td>
                <td className="px-4 py-2 flex space-x-2">
                  <button
                    className="text-primary-600 hover:text-primary-900 transition-colors"
                    onClick={() => {
                      setSelectedSpecialty(specialty);
                      setShowDetailsModal(true);
                    }}
                    title="View Details"
                  >
                    <GraduationCap className="w-4 h-4" />
                  </button>
                  <button
                    className="text-secondary-600 hover:text-secondary-900 transition-colors"
                    onClick={() => {
                      setSelectedSpecialty(specialty);
                      setShowEditModal(true);
                    }}
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900 transition-colors"
                    onClick={() => handleDeleteSpecialty(specialty.id)}
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredSpecialties.length === 0 && (
              <tr>
                <td colSpan={9} className="py-12 text-center">
                  <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No specialties found</h3>
                  <p className="text-gray-600 mb-4">No specialties match your search criteria.</p>
                  <button 
                    onClick={() => setShowCreateModal(true)}
                    className="px-4 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all duration-200"
                  >
                    Create First Specialty
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create Specialty Modal */}
      {showCreateModal && (
        <CreateSpecialtyModal 
          onClose={() => setShowCreateModal(false)} 
          onSubmit={handleCreateSpecialty}
          departments={departments}
        />
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedSpecialty && (
        <SpecialtyDetailsModal
          specialty={selectedSpecialty}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedSpecialty(null);
          }}
          onEdit={() => {
            setShowDetailsModal(false);
            setShowEditModal(true);
          }}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && selectedSpecialty && (
        <EditSpecialtyModal
          specialty={selectedSpecialty}
          onClose={() => {
            setShowEditModal(false);
            setSelectedSpecialty(null);
          }}
          onSubmit={handleEditSpecialty}
          departments={departments}
        />
      )}
    </div>
  );
};
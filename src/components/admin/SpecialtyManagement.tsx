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
  ChevronRight
} from 'lucide-react';

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

  const mockSpecialties: Specialty[] = [
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
  ];

  const departments = ['Computer Science', 'Mathematics', 'Physics', 'Engineering'];
  const levels = [1, 2, 3, 4, 5];

  const filteredSpecialties = mockSpecialties.filter(specialty => {
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Specialty Management</h1>
          <p className="text-gray-600 mt-1">Manage academic specialties and programs</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Create Specialty</span>
        </button>
      </div>

      {/* Filters */}
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Specialties</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{mockSpecialties.length}</p>
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
                {mockSpecialties.reduce((sum, spec) => sum + spec.studentCount, 0)}
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
                {mockSpecialties.reduce((sum, spec) => sum + spec.courseCount, 0)}
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
                {new Set(mockSpecialties.map(s => s.department)).size}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600">
              <Building2 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Specialties Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSpecialties.map((specialty) => (
          <div key={specialty.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{specialty.code}</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{specialty.name}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-gray-600">{specialty.department}</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(specialty.level)}`}>
                      Level {specialty.level}
                    </span>
                  </div>
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

            <p className="text-gray-700 mb-4">{specialty.description}</p>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Duration:</span>
                <span className="font-medium text-gray-900">{specialty.duration}</span>
              </div>
              <div className="text-sm text-gray-600">
                <span>Prerequisites:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {specialty.requirements.map((req, index) => (
                    <span key={index} className="px-2 py-1 bg-primary-100 text-primary-700 rounded-md text-xs">
                      {req}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-secondary-600">{specialty.studentCount}</p>
                <p className="text-xs text-gray-600">Students</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-accent-600">{specialty.courseCount}</p>
                <p className="text-xs text-gray-600">Courses</p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors">
                <BookOpen className="w-4 h-4" />
                <span>Manage Courses</span>
              </button>
              <button className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredSpecialties.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No specialties found</h3>
          <p className="text-gray-600 mb-4">No specialties match your search criteria.</p>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all duration-200"
          >
            Create First Specialty
          </button>
        </div>
      )}
    </div>
  );
};
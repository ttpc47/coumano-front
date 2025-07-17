import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search,
  Filter,
  Edit, 
  Trash2, 
  Users,
  Clock,
  Share2,
  Calendar,
  User,
  GraduationCap
} from 'lucide-react';

interface Course {
  id: string;
  name: string;
  code: string;
  credits: number;
  lecturer: string;
  lecturerEmail: string;
  department: string;
  specialties: string[];
  schedule: {
    day: string;
    time: string;
    room: string;
    type: 'lecture' | 'practical' | 'tutorial';
  }[];
  enrolledStudents: number;
  maxStudents: number;
  isShared: boolean;
  semester: string;
  year: number;
  description: string;
}

export const CourseManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedSemester, setSelectedSemester] = useState<string>('all');
  const [showSharedOnly, setShowSharedOnly] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const mockCourses: Course[] = [
    {
      id: '1',
      name: 'Advanced Algorithms',
      code: 'CS301',
      credits: 4,
      lecturer: 'Dr. Paul Mbarga',
      lecturerEmail: 'p.mbarga@university.cm',
      department: 'Computer Science',
      specialties: ['Software Engineering', 'Data Science'],
      schedule: [
        { day: 'Monday', time: '08:00-10:00', room: 'Lab A-205', type: 'practical' },
        { day: 'Wednesday', time: '14:00-16:00', room: 'Amphitheater C', type: 'lecture' }
      ],
      enrolledStudents: 67,
      maxStudents: 80,
      isShared: true,
      semester: 'Fall',
      year: 2024,
      description: 'Advanced algorithmic techniques and complexity analysis'
    },
    {
      id: '2',
      name: 'Database Systems',
      code: 'CS205',
      credits: 3,
      lecturer: 'Prof. Marie Nkomo',
      lecturerEmail: 'm.nkomo@university.cm',
      department: 'Computer Science',
      specialties: ['Software Engineering'],
      schedule: [
        { day: 'Tuesday', time: '10:00-12:00', room: 'Room B-101', type: 'lecture' },
        { day: 'Thursday', time: '14:00-17:00', room: 'Lab B-205', type: 'practical' }
      ],
      enrolledStudents: 45,
      maxStudents: 50,
      isShared: false,
      semester: 'Fall',
      year: 2024,
      description: 'Relational databases, SQL, and database design principles'
    },
    {
      id: '3',
      name: 'Linear Algebra',
      code: 'MATH201',
      credits: 3,
      lecturer: 'Dr. Jean Fotso',
      lecturerEmail: 'j.fotso@university.cm',
      department: 'Mathematics',
      specialties: ['Applied Mathematics', 'Data Science', 'Physics'],
      schedule: [
        { day: 'Monday', time: '10:00-12:00', room: 'Room C-301', type: 'lecture' },
        { day: 'Friday', time: '08:00-10:00', room: 'Room C-301', type: 'tutorial' }
      ],
      enrolledStudents: 89,
      maxStudents: 100,
      isShared: true,
      semester: 'Fall',
      year: 2024,
      description: 'Vector spaces, matrices, eigenvalues and linear transformations'
    },
    {
      id: '4',
      name: 'Software Engineering',
      code: 'CS302',
      credits: 4,
      lecturer: 'Dr. Sarah Biya',
      lecturerEmail: 's.biya@university.cm',
      department: 'Computer Science',
      specialties: ['Software Engineering'],
      schedule: [
        { day: 'Tuesday', time: '14:00-16:00', room: 'Amphitheater A', type: 'lecture' },
        { day: 'Thursday', time: '08:00-11:00', room: 'Lab A-101', type: 'practical' }
      ],
      enrolledStudents: 42,
      maxStudents: 45,
      isShared: false,
      semester: 'Fall',
      year: 2024,
      description: 'Software development lifecycle, project management and quality assurance'
    }
  ];

  const departments = ['Computer Science', 'Mathematics', 'Physics', 'Engineering'];
  const semesters = ['Fall', 'Spring', 'Summer'];

  const filteredCourses = mockCourses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.lecturer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || course.department === selectedDepartment;
    const matchesSemester = selectedSemester === 'all' || course.semester === selectedSemester;
    const matchesShared = !showSharedOnly || course.isShared;
    
    return matchesSearch && matchesDepartment && matchesSemester && matchesShared;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lecture': return 'bg-blue-100 text-blue-800';
      case 'practical': return 'bg-green-100 text-green-800';
      case 'tutorial': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEnrollmentColor = (enrolled: number, max: number) => {
    const percentage = (enrolled / max) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
          <p className="text-gray-600 mt-1">Manage courses, assignments, and enrollments</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Create Course</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search courses..."
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
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Semesters</option>
            {semesters.map(sem => (
              <option key={sem} value={sem}>{sem} 2024</option>
            ))}
          </select>

          <label className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg">
            <input
              type="checkbox"
              checked={showSharedOnly}
              onChange={(e) => setShowSharedOnly(e.target.checked)}
              className="rounded text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">Shared only</span>
          </label>

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
              <p className="text-sm font-medium text-gray-600">Total Courses</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{mockCourses.length}</p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Enrolled Students</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {mockCourses.reduce((sum, course) => sum + course.enrolledStudents, 0)}
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
              <p className="text-sm font-medium text-gray-600">Shared Courses</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {mockCourses.filter(c => c.isShared).length}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600">
              <Share2 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Credits</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {mockCourses.reduce((sum, course) => sum + course.credits, 0)}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCourses.map((course) => (
          <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{course.code}</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{course.name}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-gray-600">{course.department}</span>
                    {course.isShared && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        Shared
                      </span>
                    )}
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

            <p className="text-gray-700 mb-4">{course.description}</p>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Credits:</span>
                  <span className="font-medium text-gray-900 ml-2">{course.credits}</span>
                </div>
                <div>
                  <span className="text-gray-600">Semester:</span>
                  <span className="font-medium text-gray-900 ml-2">{course.semester} {course.year}</span>
                </div>
              </div>
              <div className="mt-2">
                <div className="flex items-center space-x-2 text-sm">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Lecturer:</span>
                  <span className="font-medium text-gray-900">{course.lecturer}</span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Enrollment:</span>
                <span className={`font-medium ${getEnrollmentColor(course.enrolledStudents, course.maxStudents)}`}>
                  {course.enrolledStudents}/{course.maxStudents}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full" 
                  style={{width: `${(course.enrolledStudents / course.maxStudents) * 100}%`}}
                ></div>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-2">Specialties:</div>
              <div className="flex flex-wrap gap-1">
                {course.specialties.map((specialty, index) => (
                  <span key={index} className="px-2 py-1 bg-primary-100 text-primary-700 rounded-md text-xs">
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-2">Schedule:</div>
              <div className="space-y-1">
                {course.schedule.map((slot, index) => (
                  <div key={index} className="flex items-center justify-between text-xs bg-gray-50 rounded p-2">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span>{slot.day} {slot.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">{slot.room}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(slot.type)}`}>
                        {slot.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-3">
              <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors">
                <Users className="w-4 h-4" />
                <span>Manage Students</span>
              </button>
              <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors">
                <Clock className="w-4 h-4" />
                <span>Schedule</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-600 mb-4">No courses match your search criteria.</p>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all duration-200"
          >
            Create First Course
          </button>
        </div>
      )}
    </div>
  );
};
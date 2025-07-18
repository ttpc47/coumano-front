import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search,
  Filter,
  Edit, 
  Trash2, 
  Share2,
  Calendar,
  User,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { CreateCourseModal } from './CreateCourseModal';
import { EditCourseModal } from './EditCourseModal';
import { CourseDetailModal } from './CourseDetailModal';

import { Course } from '../../types';

export const CourseManagement: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedSemester, setSelectedSemester] = useState<string>('all');
  const [showSharedOnly, setShowSharedOnly] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // For demonstration, use state for courses (replace with API in real app)
  const [courses, setCourses] = useState<Course[]>([
    {
      id: '1',
      name: 'Advanced Algorithms',
      code: 'CS301',
      credits: 4,
      lecturer: {
        id: 'l1',
        matricule: '',
        firstName: 'Paul',
        lastName: 'Mbarga',
        email: 'p.mbarga@university.cm',
        phone: '',
        isActive: true,
        role: 'lecturer',
        isFirstLogin: false,
        createdAt: '',
        name: 'Paul Mbarga'
      },
      specialties: ['Software Engineering', 'Data Science'],
      schedule: [
        { id: 's1', day: 'Monday', startTime: '08:00', endTime: '10:00', room: 'Lab A-205', type: 'practical' },
        { id: 's2', day: 'Wednesday', startTime: '14:00', endTime: '16:00', room: 'Amphitheater C', type: 'lecture' }
      ],
      materials: [],
      isShared: true,
      description: 'Advanced algorithmic techniques and complexity analysis'
    },
    {
      id: '2',
      name: 'Database Systems',
      code: 'CS205',
      credits: 3,
      lecturer: {
        id: 'l2',
        matricule: '',
        firstName: 'Marie',
        lastName: 'Nkomo',
        email: 'm.nkomo@university.cm',
        phone: '',
        isActive: true,
        role: 'lecturer',
        isFirstLogin: false,
        createdAt: '',
        name: 'Marie Nkomo'
      },
      specialties: ['Software Engineering'],
      schedule: [
        { id: 's3', day: 'Tuesday', startTime: '10:00', endTime: '12:00', room: 'Room B-101', type: 'lecture' },
        { id: 's4', day: 'Thursday', startTime: '14:00', endTime: '17:00', room: 'Lab B-205', type: 'practical' }
      ],
      materials: [],
      isShared: false,
      description: 'Relational databases, SQL, and database design principles'
    },
    {
      id: '3',
      name: 'Linear Algebra',
      code: 'MATH201',
      credits: 3,
      lecturer: {
        id: 'l3',
        matricule: '',
        firstName: 'Jean',
        lastName: 'Fotso',
        email: 'j.fotso@university.cm',
        phone: '',
        isActive: true,
        role: 'lecturer',
        isFirstLogin: false,
        createdAt: '',
        name: 'Jean Fotso'
      },
      specialties: ['Applied Mathematics', 'Data Science', 'Physics'],
      schedule: [
        { id: 's5', day: 'Monday', startTime: '10:00', endTime: '12:00', room: 'Room C-301', type: 'lecture' },
        { id: 's6', day: 'Friday', startTime: '08:00', endTime: '10:00', room: 'Room C-301', type: 'tutorial' }
      ],
      materials: [],
      isShared: true,
      description: 'Vector spaces, matrices, eigenvalues and linear transformations'
    },
    {
      id: '4',
      name: 'Software Engineering',
      code: 'CS302',
      credits: 4,
      lecturer: {
        id: 'l4',
        matricule: '',
        firstName: 'Sarah',
        lastName: 'Biya',
        email: 's.biya@university.cm',
        phone: '',
        isActive: true,
        role: 'lecturer',
        isFirstLogin: false,
        createdAt: '',
        name: 'Sarah Biya'
      },
      specialties: ['Software Engineering'],
      schedule: [
        { id: 's7', day: 'Tuesday', startTime: '14:00', endTime: '16:00', room: 'Amphitheater A', type: 'lecture' },
        { id: 's8', day: 'Thursday', startTime: '08:00', endTime: '11:00', room: 'Lab A-101', type: 'practical' }
      ],
      materials: [],
      isShared: false,
      description: 'Software development lifecycle, project management and quality assurance'
    }
  ]);

  const departments = ['Computer Science', 'Mathematics', 'Physics', 'Engineering'];
  const semesters = ['Fall', 'Spring', 'Summer'];
  const specialties = [
    'Software Engineering',
    'Data Science',
    'Applied Mathematics',
    'Physics',
    'Civil Engineering'
  ];

  // Filter logic for students: only courses in their specialties
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (course.lecturer && course.lecturer.name?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDepartment = selectedDepartment === 'all' || (course.lecturer && course.lecturer.department === selectedDepartment);
    const matchesSemester = selectedSemester === 'all'; // No semester property in Course, adjust if needed
    const matchesShared = !showSharedOnly || course.isShared;

    // Students: only courses matching their single specialty
    if (user?.role === 'student' && typeof user.specialty === 'string') {
      const hasSpecialty = course.specialties.includes(user.specialty);
      return matchesSearch && matchesDepartment && matchesSemester && matchesShared && hasSpecialty;
    }

    // Lecturers: only courses assigned to them
    if (user?.role === 'lecturer' && (user.lastName || user.email)) {
      const isLecturer = course.lecturer.lastName === user.lastName || course.lecturer.email === user.email;
      return matchesSearch && matchesDepartment && matchesSemester && matchesShared && isLecturer;
    }

    // Other roles: show all filtered courses
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

  // Modal handlers
  const handleCreateCourse = (courseData: Course) => {
    const newCourse: Course = {
      ...courseData,
      id: Date.now().toString(),
      materials: [],
      isShared: false
    };
    setCourses(prev => [...prev, newCourse]);
    setShowCreateModal(false);
  };

  const handleEditCourse = (updatedCourse: Course) => {
    setCourses(prev =>
      prev.map(course => (course.id === updatedCourse.id ? { ...course, ...updatedCourse } : course))
    );
    setShowEditModal(false);
    setSelectedCourse(null);
  };

  const handleDeleteCourse = (courseId: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      setCourses(prev => prev.filter(course => course.id !== courseId));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
          <p className="text-gray-600 mt-1">Manage courses, assignments, and specialties</p>
        </div>
        {user?.role !== 'student' && (
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Create Course</span>
          </button>
        )}
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
              <p className="text-3xl font-bold text-gray-900 mt-2">{courses.length}</p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Shared Courses</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {courses.filter(c => c.isShared).length}
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
                {courses.reduce((sum, course) => sum + course.credits, 0)}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Lecturer</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Credits</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Specialties</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Schedule</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredCourses.map((course) => (
              <tr key={course.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 font-mono text-sm text-gray-900">{course.code}</td>
                <td className="px-4 py-2 text-gray-900">{course.name}</td>
                <td className="px-4 py-2 text-gray-700">{course.lecturer?.department ?? ''}</td>
                <td className="px-4 py-2 text-gray-700">{course.lecturer?.name}</td>
                <td className="px-4 py-2 text-gray-700">{course.credits}</td>
                <td className="px-4 py-2">
                  <div className="flex flex-wrap gap-1">
                    {course.specialties.map((specialty, idx) => (
                      <span key={idx} className="px-2 py-1 bg-primary-100 text-primary-700 rounded-md text-xs">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-2">
                  <div className="flex flex-col gap-1">
                    {course.schedule.map((slot) => (
                      <div key={slot.id} className="flex items-center gap-2 text-xs">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span>{slot.day} {slot.startTime}-{slot.endTime}</span>
                        <span className="text-gray-600">{slot.room}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(slot.type)}`}>
                          {slot.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-2">
                  <div className="flex space-x-2">
                    <button
                      className="text-primary-600 hover:text-primary-900 transition-colors"
                      onClick={() => {
                        setSelectedCourse(course);
                        setShowDetailModal(true);
                      }}
                      title="View Details"
                    >
                      <BookOpen className="w-4 h-4" />
                    </button>
                    <button
                      className="text-secondary-600 hover:text-secondary-900 transition-colors"
                      onClick={() => {
                        setSelectedCourse(course);
                        setShowEditModal(true);
                      }}
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900 transition-colors"
                      onClick={() => handleDeleteCourse(course.id)}
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredCourses.length === 0 && (
              <tr>
                <td colSpan={8} className="py-12 text-center">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
                  <p className="text-gray-600 mb-4">No courses match your search criteria.</p>
                  {user?.role !== 'student' && (
                    <button 
                      onClick={() => setShowCreateModal(true)}
                      className="px-4 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all duration-200"
                    >
                      Create First Course
                    </button>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create Course Modal */}
      {showCreateModal && (
        <CreateCourseModal 
          onClose={() => setShowCreateModal(false)} 
          onSubmit={handleCreateCourse}
          departments={departments}
          specialties={specialties}
        />
      )}

      {/* Edit Course Modal */}
      {showEditModal && selectedCourse && (
        <EditCourseModal 
          onClose={() => {
            setShowEditModal(false);
            setSelectedCourse(null);
          }}
          onSubmit={handleEditCourse}
          course={selectedCourse}
          departments={departments}
          specialties={specialties}
        />
      )}

      {/* Course Detail Modal */}
      {showDetailModal && selectedCourse && (
        <CourseDetailModal 
          onClose={() => {
            setShowDetailModal(false);
            setSelectedCourse(null);
          }}
          course={selectedCourse}
          onEdit={() => {
            setShowDetailModal(false);
            setShowEditModal(true);
          }}
        />
      )}
    </div>
  );
};

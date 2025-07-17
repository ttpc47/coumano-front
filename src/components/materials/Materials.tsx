import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Upload, 
  Search,
  Filter,
  Folder,
  File,
  Video,
  Image,
  Archive,
  Plus,
  Eye,
  Share2,
  Trash2,
  Calendar
} from 'lucide-react';

interface Material {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'document' | 'image' | 'archive' | 'link';
  course: string;
  lecturer: string;
  size: string;
  uploadedAt: string;
  downloads: number;
  isShared: boolean;
  url: string;
  description?: string;
}

export const Materials: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const mockMaterials: Material[] = [
    {
      id: '1',
      title: 'Advanced Algorithms - Lecture 5 Slides',
      type: 'pdf',
      course: 'CS301',
      lecturer: 'Dr. Paul Mbarga',
      size: '2.4 MB',
      uploadedAt: '2024-03-10T10:00:00Z',
      downloads: 45,
      isShared: true,
      url: '/materials/cs301-lecture5.pdf',
      description: 'Dynamic programming algorithms and complexity analysis'
    },
    {
      id: '2',
      title: 'Database Design Tutorial Video',
      type: 'video',
      course: 'CS205',
      lecturer: 'Prof. Marie Nkomo',
      size: '156 MB',
      uploadedAt: '2024-03-08T14:30:00Z',
      downloads: 78,
      isShared: false,
      url: '/materials/db-tutorial.mp4',
      description: 'Complete walkthrough of database normalization process'
    },
    {
      id: '3',
      title: 'Linear Algebra Problem Set Solutions',
      type: 'document',
      course: 'MATH201',
      lecturer: 'Dr. Jean Fotso',
      size: '1.8 MB',
      uploadedAt: '2024-03-07T09:15:00Z',
      downloads: 92,
      isShared: true,
      url: '/materials/math201-solutions.docx'
    },
    {
      id: '4',
      title: 'Software Engineering Lab Materials',
      type: 'archive',
      course: 'CS302',
      lecturer: 'Dr. Sarah Biya',
      size: '45.2 MB',
      uploadedAt: '2024-03-05T16:45:00Z',
      downloads: 34,
      isShared: false,
      url: '/materials/se-lab-materials.zip',
      description: 'Complete source code and documentation for lab exercises'
    },
    {
      id: '5',
      title: 'UML Diagram Examples',
      type: 'image',
      course: 'CS302',
      lecturer: 'Dr. Sarah Biya',
      size: '3.1 MB',
      uploadedAt: '2024-03-03T11:20:00Z',
      downloads: 67,
      isShared: true,
      url: '/materials/uml-examples.png',
      description: 'Class diagrams and sequence diagrams for reference'
    },
    {
      id: '6',
      title: 'Online Resources for Data Structures',
      type: 'link',
      course: 'CS301',
      lecturer: 'Dr. Paul Mbarga',
      size: 'N/A',
      uploadedAt: '2024-03-01T08:30:00Z',
      downloads: 23,
      isShared: true,
      url: 'https://example.com/data-structures',
      description: 'Curated list of online tutorials and practice problems'
    }
  ];

  const courses = ['CS301', 'CS205', 'CS302', 'MATH201', 'PHYS101'];
  const types = ['pdf', 'video', 'document', 'image', 'archive', 'link'];

  const filteredMaterials = mockMaterials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.lecturer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = selectedCourse === 'all' || material.course === selectedCourse;
    const matchesType = selectedType === 'all' || material.type === selectedType;
    
    return matchesSearch && matchesCourse && matchesType;
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="w-6 h-6 text-red-500" />;
      case 'video': return <Video className="w-6 h-6 text-purple-500" />;
      case 'document': return <File className="w-6 h-6 text-blue-500" />;
      case 'image': return <Image className="w-6 h-6 text-green-500" />;
      case 'archive': return <Archive className="w-6 h-6 text-yellow-500" />;
      case 'link': return <Share2 className="w-6 h-6 text-gray-500" />;
      default: return <File className="w-6 h-6 text-gray-500" />;
    }
  };

  const getFileColor = (type: string) => {
    switch (type) {
      case 'pdf': return 'bg-red-50 border-red-200';
      case 'video': return 'bg-purple-50 border-purple-200';
      case 'document': return 'bg-blue-50 border-blue-200';
      case 'image': return 'bg-green-50 border-green-200';
      case 'archive': return 'bg-yellow-50 border-yellow-200';
      case 'link': return 'bg-gray-50 border-gray-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Course Materials</h1>
          <p className="text-gray-600 mt-1">Access and manage course resources and documents</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all duration-200">
          <Upload className="w-4 h-4" />
          <span>Upload Material</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search materials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Courses</option>
            {courses.map(course => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Types</option>
            {types.map(type => (
              <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
            ))}
          </select>

          <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Filter className="w-4 h-4" />
            <span>More Filters</span>
          </button>

          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex-1 py-1 px-3 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex-1 py-1 px-3 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-primary-100 rounded-xl">
              <FileText className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Files</p>
              <p className="text-2xl font-bold text-gray-900">{mockMaterials.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-secondary-100 rounded-xl">
              <Download className="w-6 h-6 text-secondary-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Downloads</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockMaterials.reduce((sum, m) => sum + m.downloads, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-accent-100 rounded-xl">
              <Share2 className="w-6 h-6 text-accent-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Shared</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockMaterials.filter(m => m.isShared).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Folder className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Courses</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(mockMaterials.map(m => m.course)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Materials Grid/List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Materials ({filteredMaterials.length})
          </h2>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials.map((material) => (
              <div key={material.id} className={`border-2 rounded-xl p-6 hover:shadow-lg transition-all duration-200 ${getFileColor(material.type)}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getFileIcon(material.type)}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{material.title}</h3>
                      <p className="text-sm text-gray-600">{material.course}</p>
                    </div>
                  </div>
                  {material.isShared && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      Shared
                    </span>
                  )}
                </div>

                {material.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{material.description}</p>
                )}

                <div className="space-y-2 text-sm text-gray-500 mb-4">
                  <div className="flex items-center justify-between">
                    <span>Size:</span>
                    <span className="font-medium">{material.size}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Downloads:</span>
                    <span className="font-medium">{material.downloads}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Uploaded:</span>
                    <span className="font-medium">{formatDate(material.uploadedAt)}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors text-sm">
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                  <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredMaterials.map((material) => (
              <div key={material.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                <div className="flex items-center space-x-4">
                  {getFileIcon(material.type)}
                  <div>
                    <h3 className="font-semibold text-gray-900">{material.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{material.course}</span>
                      <span>{material.lecturer}</span>
                      <span>{material.size}</span>
                      <span>{formatDate(material.uploadedAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {material.isShared && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      Shared
                    </span>
                  )}
                  <span className="text-sm text-gray-500">{material.downloads} downloads</span>
                  <div className="flex space-x-2">
                    <button className="text-primary-600 hover:text-primary-800 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-secondary-600 hover:text-secondary-800 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-800 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredMaterials.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No materials found</h3>
            <p className="text-gray-600 mb-4">No materials match your search criteria.</p>
            <button className="px-4 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all duration-200">
              Upload First Material
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
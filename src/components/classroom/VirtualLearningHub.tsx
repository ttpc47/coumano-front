import React, { useState, useEffect } from 'react';
import { 
  Video, 
  Calendar, 
  Users, 
  BookOpen, 
  Play, 
  Clock, 
  Star,
  TrendingUp,
  Award,
  Target,
  Brain,
  Headphones,
  Monitor,
  Wifi,
  Download,
  Share2,
  MessageCircle,
  Settings,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface LearningSession {
  id: string;
  title: string;
  course: string;
  instructor: string;
  type: 'live' | 'recorded' | 'interactive';
  duration: number;
  participants: number;
  rating: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  thumbnail: string;
  description: string;
  scheduledTime?: string;
  recordingUrl?: string;
  transcriptionAvailable: boolean;
  interactiveElements: number;
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  totalSessions: number;
  completedSessions: number;
  estimatedHours: number;
  difficulty: string;
  category: string;
  progress: number;
}

export const VirtualLearningHub: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'live' | 'recorded' | 'paths' | 'analytics'>('live');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const mockSessions: LearningSession[] = [
    {
      id: '1',
      title: 'Advanced Algorithm Design Patterns',
      course: 'CS301',
      instructor: 'Dr. Paul Mbarga',
      type: 'live',
      duration: 120,
      participants: 45,
      rating: 4.8,
      difficulty: 'advanced',
      tags: ['algorithms', 'design-patterns', 'optimization'],
      thumbnail: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Deep dive into advanced algorithmic design patterns and optimization techniques',
      scheduledTime: '2024-03-15T14:00:00',
      transcriptionAvailable: true,
      interactiveElements: 8
    },
    {
      id: '2',
      title: 'Database Optimization Masterclass',
      course: 'CS205',
      instructor: 'Prof. Marie Nkomo',
      type: 'recorded',
      duration: 90,
      participants: 67,
      rating: 4.9,
      difficulty: 'intermediate',
      tags: ['database', 'sql', 'performance'],
      thumbnail: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Learn advanced database optimization techniques and query performance tuning',
      recordingUrl: '/recordings/db-optimization',
      transcriptionAvailable: true,
      interactiveElements: 12
    },
    {
      id: '3',
      title: 'Interactive Linear Algebra Workshop',
      course: 'MATH201',
      instructor: 'Dr. Jean Fotso',
      type: 'interactive',
      duration: 75,
      participants: 89,
      rating: 4.7,
      difficulty: 'beginner',
      tags: ['mathematics', 'linear-algebra', 'interactive'],
      thumbnail: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Hands-on workshop with interactive visualizations and real-time problem solving',
      transcriptionAvailable: false,
      interactiveElements: 15
    }
  ];

  const mockLearningPaths: LearningPath[] = [
    {
      id: '1',
      title: 'Full-Stack Development Mastery',
      description: 'Complete journey from frontend to backend development',
      totalSessions: 24,
      completedSessions: 8,
      estimatedHours: 48,
      difficulty: 'intermediate',
      category: 'Programming',
      progress: 33
    },
    {
      id: '2',
      title: 'Data Science Fundamentals',
      description: 'Master the basics of data analysis and machine learning',
      totalSessions: 18,
      completedSessions: 12,
      estimatedHours: 36,
      difficulty: 'beginner',
      category: 'Data Science',
      progress: 67
    },
    {
      id: '3',
      title: 'Advanced Mathematics for Engineers',
      description: 'Mathematical concepts essential for engineering applications',
      totalSessions: 20,
      completedSessions: 5,
      estimatedHours: 40,
      difficulty: 'advanced',
      category: 'Mathematics',
      progress: 25
    }
  ];

  const categories = ['Programming', 'Data Science', 'Mathematics', 'Engineering', 'Physics'];
  const difficulties = ['beginner', 'intermediate', 'advanced'];

  const filteredSessions = mockSessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || session.tags.some(tag => 
      tag.toLowerCase().includes(selectedCategory.toLowerCase())
    );
    const matchesDifficulty = selectedDifficulty === 'all' || session.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'live': return <Video className="w-4 h-4 text-red-600" />;
      case 'recorded': return <Play className="w-4 h-4 text-blue-600" />;
      case 'interactive': return <Brain className="w-4 h-4 text-purple-600" />;
      default: return <BookOpen className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Virtual Learning Hub</h1>
          <p className="text-gray-600 mt-1">Immersive learning experiences with AI-powered features</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Settings className="w-4 h-4" />
            <span>Preferences</span>
          </button>
          {user?.role !== 'student' && (
            <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all duration-200">
              <Plus className="w-4 h-4" />
              <span>Create Session</span>
            </button>
          )}
        </div>
      </div>

      {/* Learning Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Video className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Sessions Attended</p>
              <p className="text-2xl font-bold text-gray-900">47</p>
              <p className="text-sm text-green-600">+12 this week</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-xl">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Learning Hours</p>
              <p className="text-2xl font-bold text-gray-900">156</p>
              <p className="text-sm text-blue-600">This semester</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Skill Level</p>
              <p className="text-2xl font-bold text-gray-900">Advanced</p>
              <p className="text-sm text-purple-600">Top 15%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-100 rounded-xl">
              <Award className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Achievements</p>
              <p className="text-2xl font-bold text-gray-900">23</p>
              <p className="text-sm text-yellow-600">Badges earned</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'live', label: 'Live Sessions', icon: Video },
              { id: 'recorded', label: 'Recorded Content', icon: Play },
              { id: 'paths', label: 'Learning Paths', icon: Target },
              { id: 'analytics', label: 'My Progress', icon: TrendingUp }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search sessions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Difficulties</option>
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </option>
              ))}
            </select>

            <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <Filter className="w-4 h-4" />
              <span>More Filters</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {(activeTab === 'live' || activeTab === 'recorded') && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSessions
                .filter(session => activeTab === 'live' ? session.type === 'live' : session.type !== 'live')
                .map((session) => (
                <div key={session.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200">
                  <div className="relative">
                    <img 
                      src={session.thumbnail} 
                      alt={session.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 left-3 flex items-center space-x-2">
                      <span className={`flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full ${
                        session.type === 'live' ? 'bg-red-100 text-red-800' :
                        session.type === 'recorded' ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {getTypeIcon(session.type)}
                        <span>{session.type}</span>
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(session.difficulty)}`}>
                        {session.difficulty}
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                      {formatDuration(session.duration)}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{session.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{session.description}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <span>{session.course}</span>
                      <span>{session.instructor}</span>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{session.participants}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {renderStars(session.rating)}
                        <span className="ml-1">{session.rating}</span>
                      </div>
                      {session.transcriptionAvailable && (
                        <div className="flex items-center space-x-1">
                          <Headphones className="w-4 h-4" />
                          <span>CC</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {session.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex space-x-2">
                      <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                        {session.type === 'live' ? <Video className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        <span>{session.type === 'live' ? 'Join Live' : 'Watch'}</span>
                      </button>
                      <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'paths' && (
            <div className="space-y-6">
              {mockLearningPaths.map((path) => (
                <div key={path.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{path.title}</h3>
                      <p className="text-gray-600 mb-3">{path.description}</p>
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <span>{path.totalSessions} sessions</span>
                        <span>{path.estimatedHours} hours</span>
                        <span className="capitalize">{path.difficulty}</span>
                        <span>{path.category}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary-600">{path.progress}%</div>
                      <div className="text-sm text-gray-500">Complete</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>Progress: {path.completedSessions}/{path.totalSessions} sessions</span>
                      <span>{path.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full" 
                        style={{width: `${path.progress}%`}}
                      ></div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors">
                      <Play className="w-4 h-4" />
                      <span>Continue Learning</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      <BookOpen className="w-4 h-4" />
                      <span>View Curriculum</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Learning Streak</h3>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary-600 mb-2">12</div>
                    <div className="text-sm text-gray-600">Days in a row</div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Engagement Score</h3>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">94%</div>
                    <div className="text-sm text-gray-600">Above average</div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Weekly Learning Activity</h3>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Learning analytics chart would be displayed here</p>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Skill Development</h3>
                <div className="space-y-4">
                  {[
                    { skill: 'Algorithm Design', level: 85, growth: '+12%' },
                    { skill: 'Database Management', level: 78, growth: '+8%' },
                    { skill: 'Software Architecture', level: 92, growth: '+15%' },
                    { skill: 'Problem Solving', level: 88, growth: '+10%' }
                  ].map((skill, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900">{skill.skill}</span>
                          <span className="text-sm text-green-600">{skill.growth}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full" 
                            style={{width: `${skill.level}%`}}
                          ></div>
                        </div>
                      </div>
                      <span className="ml-4 text-sm font-bold text-gray-900">{skill.level}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Learning Assistant */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">AI Learning Assistant</h3>
            <p className="text-gray-600">Personalized recommendations based on your learning patterns</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Recommended for You</h4>
            <p className="text-sm text-gray-600 mb-3">Advanced Data Structures Workshop</p>
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              Start Learning →
            </button>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Study Reminder</h4>
            <p className="text-sm text-gray-600 mb-3">Review Linear Algebra concepts</p>
            <button className="text-sm text-secondary-600 hover:text-secondary-700 font-medium">
              Review Now →
            </button>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Skill Gap Analysis</h4>
            <p className="text-sm text-gray-600 mb-3">Focus on Database Optimization</p>
            <button className="text-sm text-accent-600 hover:text-accent-700 font-medium">
              View Plan →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
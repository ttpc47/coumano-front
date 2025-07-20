import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Zap, 
  Award,
  Clock,
  BarChart3,
  Lightbulb,
  Users,
  BookOpen,
  CheckCircle,
  AlertCircle,
  Star,
  ArrowRight,
  RefreshCw,
  Settings,
  Eye,
  Download
} from 'lucide-react';

interface LearningProfile {
  userId: string;
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  pace: 'slow' | 'moderate' | 'fast';
  preferredDifficulty: 'easy' | 'medium' | 'hard';
  strengths: string[];
  weaknesses: string[];
  interests: string[];
  goals: LearningGoal[];
  currentLevel: number;
  totalXP: number;
  streak: number;
  achievements: Achievement[];
}

interface LearningGoal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  progress: number;
  milestones: Milestone[];
  priority: 'low' | 'medium' | 'high';
}

interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: string;
  xpReward: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
}

interface AdaptiveRecommendation {
  id: string;
  type: 'content' | 'exercise' | 'review' | 'challenge' | 'collaboration';
  title: string;
  description: string;
  reasoning: string;
  confidence: number;
  estimatedTime: number;
  difficulty: string;
  xpReward: number;
  prerequisites: string[];
  tags: string[];
}

interface LearningMetrics {
  sessionTime: number;
  focusScore: number;
  comprehensionRate: number;
  retentionRate: number;
  engagementLevel: number;
  collaborationScore: number;
  problemSolvingSpeed: number;
  accuracyRate: number;
}

export const AdaptiveLearningEngine: React.FC = () => {
  const [learningProfile, setLearningProfile] = useState<LearningProfile | null>(null);
  const [recommendations, setRecommendations] = useState<AdaptiveRecommendation[]>([]);
  const [metrics, setMetrics] = useState<LearningMetrics | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'goals' | 'recommendations' | 'analytics'>('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLearningProfile();
    loadRecommendations();
    loadMetrics();
  }, []);

  const loadLearningProfile = async () => {
    // Mock data - replace with actual API call
    const mockProfile: LearningProfile = {
      userId: 'user123',
      learningStyle: 'visual',
      pace: 'moderate',
      preferredDifficulty: 'medium',
      strengths: ['Problem Solving', 'Logical Thinking', 'Pattern Recognition'],
      weaknesses: ['Database Design', 'System Architecture'],
      interests: ['Machine Learning', 'Web Development', 'Data Science'],
      goals: [
        {
          id: '1',
          title: 'Master Advanced Algorithms',
          description: 'Complete advanced algorithm course with 90% score',
          targetDate: '2024-06-01',
          progress: 65,
          priority: 'high',
          milestones: [
            { id: '1', title: 'Complete Dynamic Programming', completed: true, completedAt: '2024-03-01', xpReward: 100 },
            { id: '2', title: 'Master Graph Algorithms', completed: true, completedAt: '2024-03-10', xpReward: 150 },
            { id: '3', title: 'Advanced Tree Structures', completed: false, xpReward: 200 },
            { id: '4', title: 'Final Project', completed: false, xpReward: 300 }
          ]
        },
        {
          id: '2',
          title: 'Database Expertise',
          description: 'Improve database design and optimization skills',
          targetDate: '2024-05-15',
          progress: 30,
          priority: 'medium',
          milestones: [
            { id: '1', title: 'SQL Fundamentals', completed: true, completedAt: '2024-02-15', xpReward: 80 },
            { id: '2', title: 'Database Design', completed: false, xpReward: 120 },
            { id: '3', title: 'Query Optimization', completed: false, xpReward: 150 },
            { id: '4', title: 'Advanced Topics', completed: false, xpReward: 200 }
          ]
        }
      ],
      currentLevel: 12,
      totalXP: 2450,
      streak: 7,
      achievements: [
        {
          id: '1',
          title: 'Algorithm Master',
          description: 'Solved 100 algorithm problems',
          icon: '🧠',
          unlockedAt: '2024-03-01',
          rarity: 'rare',
          xpReward: 200
        },
        {
          id: '2',
          title: 'Consistent Learner',
          description: '7-day learning streak',
          icon: '🔥',
          unlockedAt: '2024-03-15',
          rarity: 'common',
          xpReward: 50
        }
      ]
    };
    setLearningProfile(mockProfile);
  };

  const loadRecommendations = async () => {
    // Mock data - replace with actual API call
    const mockRecommendations: AdaptiveRecommendation[] = [
      {
        id: '1',
        type: 'content',
        title: 'Advanced Graph Algorithms Workshop',
        description: 'Interactive session on shortest path algorithms and network flow',
        reasoning: 'Based on your strong performance in basic algorithms and interest in optimization',
        confidence: 92,
        estimatedTime: 45,
        difficulty: 'medium',
        xpReward: 150,
        prerequisites: ['Basic Graph Theory'],
        tags: ['algorithms', 'graphs', 'optimization']
      },
      {
        id: '2',
        type: 'review',
        title: 'Database Normalization Review',
        description: 'Quick review session to strengthen your database design skills',
        reasoning: 'Identified as a weak area that needs reinforcement before advanced topics',
        confidence: 87,
        estimatedTime: 20,
        difficulty: 'easy',
        xpReward: 75,
        prerequisites: [],
        tags: ['database', 'normalization', 'design']
      },
      {
        id: '3',
        type: 'challenge',
        title: 'Coding Challenge: Dynamic Programming',
        description: 'Solve complex DP problems to test your understanding',
        reasoning: 'You excel at problem-solving and are ready for advanced challenges',
        confidence: 95,
        estimatedTime: 60,
        difficulty: 'hard',
        xpReward: 250,
        prerequisites: ['Dynamic Programming Basics'],
        tags: ['challenge', 'dynamic-programming', 'problem-solving']
      }
    ];
    setRecommendations(mockRecommendations);
  };

  const loadMetrics = async () => {
    // Mock data - replace with actual API call
    const mockMetrics: LearningMetrics = {
      sessionTime: 125, // minutes this week
      focusScore: 87,
      comprehensionRate: 92,
      retentionRate: 85,
      engagementLevel: 89,
      collaborationScore: 76,
      problemSolvingSpeed: 83,
      accuracyRate: 91
    };
    setMetrics(mockMetrics);
    setLoading(false);
  };

  const getXPToNextLevel = () => {
    if (!learningProfile) return 0;
    const currentLevelXP = learningProfile.currentLevel * 200;
    const nextLevelXP = (learningProfile.currentLevel + 1) * 200;
    return nextLevelXP - learningProfile.totalXP;
  };

  const getLevelProgress = () => {
    if (!learningProfile) return 0;
    const currentLevelXP = learningProfile.currentLevel * 200;
    const nextLevelXP = (learningProfile.currentLevel + 1) * 200;
    const progressXP = learningProfile.totalXP - currentLevelXP;
    return (progressXP / (nextLevelXP - currentLevelXP)) * 100;
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800';
      case 'rare': return 'bg-blue-100 text-blue-800';
      case 'epic': return 'bg-purple-100 text-purple-800';
      case 'legendary': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMetricColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading || !learningProfile || !metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Adaptive Learning Engine</h1>
          <p className="text-gray-600 mt-1">Personalized learning experience powered by AI</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Settings className="w-4 h-4" />
            <span>Preferences</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export Progress</span>
          </button>
        </div>
      </div>

      {/* Learning Profile Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">{learningProfile.currentLevel}</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Level {learningProfile.currentLevel}</h3>
              <p className="text-sm text-gray-600">{getXPToNextLevel()} XP to next level</p>
            </div>
          </div>
          <div className="w-full bg-primary-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-500" 
              style={{width: `${getLevelProgress()}%`}}
            ></div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-600 rounded-xl">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Learning Streak</p>
              <p className="text-2xl font-bold text-gray-900">{learningProfile.streak}</p>
              <p className="text-sm text-green-600">days in a row</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-600 rounded-xl">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Achievements</p>
              <p className="text-2xl font-bold text-gray-900">{learningProfile.achievements.length}</p>
              <p className="text-sm text-yellow-600">badges earned</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-600 rounded-xl">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total XP</p>
              <p className="text-2xl font-bold text-gray-900">{learningProfile.totalXP}</p>
              <p className="text-sm text-purple-600">experience points</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'goals', label: 'Learning Goals', icon: Target },
              { id: 'recommendations', label: 'AI Recommendations', icon: Lightbulb },
              { id: 'analytics', label: 'Performance Analytics', icon: TrendingUp }
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

        <div className="p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Learning Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { label: 'Focus Score', value: metrics.focusScore, icon: Target },
                  { label: 'Comprehension', value: metrics.comprehensionRate, icon: Brain },
                  { label: 'Retention', value: metrics.retentionRate, icon: BookOpen },
                  { label: 'Engagement', value: metrics.engagementLevel, icon: Zap }
                ].map((metric, index) => {
                  const Icon = metric.icon;
                  return (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Icon className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-600">{metric.label}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-2xl font-bold ${getMetricColor(metric.value)}`}>
                          {metric.value}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Recent Achievements */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {learningProfile.achievements.map((achievement) => (
                    <div key={achievement.id} className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{achievement.icon}</span>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRarityColor(achievement.rarity)}`}>
                              {achievement.rarity}
                            </span>
                            <span className="text-xs text-gray-500">+{achievement.xpReward} XP</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'goals' && (
            <div className="space-y-6">
              {learningProfile.goals.map((goal) => (
                <div key={goal.id} className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
                      <p className="text-gray-600 mt-1">{goal.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>Target: {new Date(goal.targetDate).toLocaleDateString()}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          goal.priority === 'high' ? 'bg-red-100 text-red-800' :
                          goal.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {goal.priority} priority
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary-600">{goal.progress}%</div>
                      <div className="text-sm text-gray-500">Complete</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full" 
                        style={{width: `${goal.progress}%`}}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {goal.milestones.map((milestone) => (
                      <div key={milestone.id} className={`flex items-center space-x-3 p-3 rounded-lg ${
                        milestone.completed ? 'bg-green-50 border border-green-200' : 'bg-white border border-gray-200'
                      }`}>
                        {milestone.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                        )}
                        <div className="flex-1">
                          <h4 className={`font-medium ${milestone.completed ? 'text-green-900' : 'text-gray-900'}`}>
                            {milestone.title}
                          </h4>
                          <div className="flex items-center space-x-2 text-sm">
                            <span className="text-gray-500">+{milestone.xpReward} XP</span>
                            {milestone.completedAt && (
                              <span className="text-green-600">
                                Completed {new Date(milestone.completedAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div className="space-y-6">
              {recommendations.map((rec) => (
                <div key={rec.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{rec.title}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          rec.type === 'content' ? 'bg-blue-100 text-blue-800' :
                          rec.type === 'exercise' ? 'bg-green-100 text-green-800' :
                          rec.type === 'review' ? 'bg-yellow-100 text-yellow-800' :
                          rec.type === 'challenge' ? 'bg-red-100 text-red-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {rec.type}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{rec.description}</p>
                      <div className="bg-blue-50 rounded-lg p-3 mb-3">
                        <p className="text-sm text-blue-800">
                          <strong>AI Reasoning:</strong> {rec.reasoning}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span><Clock className="w-4 h-4 inline mr-1" />{rec.estimatedTime}m</span>
                        <span>+{rec.xpReward} XP</span>
                        <span>Confidence: {rec.confidence}%</span>
                      </div>
                    </div>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                      <span>Start Learning</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {rec.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Velocity</h3>
                  <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Learning velocity chart would be displayed here</p>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Skill Development</h3>
                  <div className="space-y-4">
                    {[
                      { skill: 'Algorithm Design', current: 85, target: 95 },
                      { skill: 'Database Management', current: 65, target: 85 },
                      { skill: 'Problem Solving', current: 92, target: 95 },
                      { skill: 'Code Quality', current: 78, target: 90 }
                    ].map((skill, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900">{skill.skill}</span>
                          <span className="text-sm text-gray-600">{skill.current}% / {skill.target}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full" 
                            style={{width: `${skill.current}%`}}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Performance Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: 'Problem Solving Speed', value: metrics.problemSolvingSpeed, trend: '+5%' },
                    { label: 'Accuracy Rate', value: metrics.accuracyRate, trend: '+2%' },
                    { label: 'Collaboration Score', value: metrics.collaborationScore, trend: '+8%' }
                  ].map((metric, index) => (
                    <div key={index} className="text-center">
                      <div className={`text-3xl font-bold mb-2 ${getMetricColor(metric.value)}`}>
                        {metric.value}%
                      </div>
                      <div className="text-sm text-gray-600 mb-1">{metric.label}</div>
                      <div className="text-xs text-green-600">{metric.trend} this week</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
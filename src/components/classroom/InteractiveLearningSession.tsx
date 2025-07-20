import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Users, 
  MessageCircle, 
  Poll, 
  Target, 
  Award,
  Clock,
  CheckCircle,
  XCircle,
  BarChart3,
  Lightbulb,
  Zap,
  Heart,
  ThumbsUp,
  Share2,
  Download,
  Settings,
  Maximize,
  Volume2,
  VolumeX
} from 'lucide-react';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface PollQuestion {
  id: string;
  question: string;
  options: string[];
  responses: number[];
  totalResponses: number;
}

interface InteractiveElement {
  id: string;
  type: 'quiz' | 'poll' | 'discussion' | 'breakout' | 'whiteboard';
  title: string;
  timestamp: number;
  duration: number;
  participants: number;
  isActive: boolean;
}

export const InteractiveLearningSession: React.FC = () => {
  const [currentElement, setCurrentElement] = useState<InteractiveElement | null>(null);
  const [sessionTime, setSessionTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [engagement, setEngagement] = useState(85);
  const [myScore, setMyScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const mockQuiz: QuizQuestion = {
    id: '1',
    question: 'What is the time complexity of binary search in a sorted array?',
    options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'],
    correctAnswer: 1,
    explanation: 'Binary search divides the search space in half with each comparison, resulting in O(log n) time complexity.',
    difficulty: 'medium'
  };

  const mockPoll: PollQuestion = {
    id: '1',
    question: 'Which programming language do you prefer for data analysis?',
    options: ['Python', 'R', 'Julia', 'Scala'],
    responses: [45, 23, 8, 12],
    totalResponses: 88
  };

  const mockElements: InteractiveElement[] = [
    {
      id: '1',
      type: 'quiz',
      title: 'Algorithm Complexity Quiz',
      timestamp: 15,
      duration: 5,
      participants: 67,
      isActive: true
    },
    {
      id: '2',
      type: 'poll',
      title: 'Language Preference Poll',
      timestamp: 25,
      duration: 3,
      participants: 67,
      isActive: false
    },
    {
      id: '3',
      type: 'breakout',
      title: 'Problem Solving Groups',
      timestamp: 35,
      duration: 10,
      participants: 67,
      isActive: false
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getEngagementColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const renderQuizInterface = () => (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Quick Quiz</h3>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
          Question {myScore + 1} of {totalQuestions || 5}
        </span>
      </div>
      
      <div className="mb-6">
        <h4 className="text-gray-900 font-medium mb-4">{mockQuiz.question}</h4>
        <div className="space-y-3">
          {mockQuiz.options.map((option, index) => (
            <button
              key={index}
              className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-primary-300 transition-colors"
            >
              <span className="font-medium text-gray-700">{String.fromCharCode(65 + index)}.</span>
              <span className="ml-2 text-gray-900">{option}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span>Difficulty: {mockQuiz.difficulty}</span>
          <span>Time left: 2:30</span>
        </div>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          Submit Answer
        </button>
      </div>
    </div>
  );

  const renderPollInterface = () => (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Live Poll</h3>
        <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
          {mockPoll.totalResponses} responses
        </span>
      </div>
      
      <h4 className="text-gray-900 font-medium mb-4">{mockPoll.question}</h4>
      
      <div className="space-y-3 mb-6">
        {mockPoll.options.map((option, index) => {
          const percentage = Math.round((mockPoll.responses[index] / mockPoll.totalResponses) * 100);
          return (
            <div key={index} className="relative">
              <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-gray-900">{option}</span>
                  <span className="text-sm font-medium text-gray-600">{percentage}%</span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-500" 
                    style={{width: `${percentage}%`}}
                  ></div>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      <button className="w-full px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors">
        Submit Vote
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Session Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900">Interactive Algorithm Design Session</h1>
            <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span>LIVE</span>
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{formatTime(sessionTime)}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span>67 participants</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Maximize className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Main Content Area */}
        <div className="flex-1 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            {/* Video/Content Area */}
            <div className="lg:col-span-2 bg-black rounded-xl relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <Brain className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Interactive Learning Session</p>
                  <p className="text-sm opacity-75 mt-2">Enhanced with AI-powered features</p>
                </div>
              </div>

              {/* Interactive Overlay */}
              <div className="absolute top-4 left-4 right-4">
                <div className="bg-black bg-opacity-75 rounded-lg p-4 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Session Engagement</span>
                    <span className={`text-sm font-bold ${getEngagementColor(engagement)}`}>
                      {engagement}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full transition-all duration-500" 
                      style={{width: `${engagement}%`}}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Interactive Elements Timeline */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-black bg-opacity-75 rounded-lg p-4">
                  <div className="flex items-center space-x-4">
                    {mockElements.map((element) => (
                      <button
                        key={element.id}
                        onClick={() => setCurrentElement(element)}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          element.isActive 
                            ? 'bg-primary-600 text-white' 
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {element.type === 'quiz' && <Brain className="w-4 h-4" />}
                        {element.type === 'poll' && <Poll className="w-4 h-4" />}
                        {element.type === 'breakout' && <Users className="w-4 h-4" />}
                        <span>{element.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Panel */}
            <div className="space-y-6">
              {/* Current Interactive Element */}
              {currentElement?.type === 'quiz' && renderQuizInterface()}
              {currentElement?.type === 'poll' && renderPollInterface()}
              
              {!currentElement && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Overview</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Your Score</span>
                      <span className="font-bold text-primary-600">{myScore}/5</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Participation</span>
                      <span className="font-bold text-green-600">Active</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Next Activity</span>
                      <span className="font-bold text-gray-900">2:30</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Engagement Tools */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center space-x-2 p-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    <span>Like</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 p-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                    <Heart className="w-4 h-4" />
                    <span>Love</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 p-3 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors">
                    <Lightbulb className="w-4 h-4" />
                    <span>Idea</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 p-3 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors">
                    <Zap className="w-4 h-4" />
                    <span>Wow</span>
                  </button>
                </div>
              </div>

              {/* Live Chat */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Live Discussion</h3>
                  <MessageCircle className="w-5 h-5 text-gray-400" />
                </div>
                
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {[
                    { user: 'Aminata F.', message: 'Great explanation of binary search!', time: '2m ago' },
                    { user: 'Claude N.', message: 'Can you show the recursive implementation?', time: '1m ago' },
                    { user: 'Dr. Mbarga', message: 'Good question! Let me demonstrate...', time: '30s ago' }
                  ].map((chat, index) => (
                    <div key={index} className="text-sm">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900">{chat.user}</span>
                        <span className="text-gray-500 text-xs">{chat.time}</span>
                      </div>
                      <p className="text-gray-700">{chat.message}</p>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
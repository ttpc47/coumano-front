import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  MessageCircle, 
  Lightbulb, 
  Target, 
  TrendingUp,
  BookOpen,
  Clock,
  Star,
  Zap,
  ChevronRight,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Settings,
  RefreshCw,
  Download,
  Share2
} from 'lucide-react';

interface AIRecommendation {
  id: string;
  type: 'concept' | 'practice' | 'review' | 'challenge';
  title: string;
  description: string;
  confidence: number;
  estimatedTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  relevanceScore: number;
}

interface LearningInsight {
  id: string;
  category: 'strength' | 'weakness' | 'opportunity' | 'trend';
  title: string;
  description: string;
  actionable: boolean;
  impact: 'low' | 'medium' | 'high';
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
  attachments?: string[];
  suggestions?: string[];
}

export const AILearningAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'insights' | 'recommendations'>('chat');
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const mockRecommendations: AIRecommendation[] = [
    {
      id: '1',
      type: 'concept',
      title: 'Dynamic Programming Fundamentals',
      description: 'Based on your recent quiz performance, reviewing DP concepts would strengthen your algorithm skills.',
      confidence: 92,
      estimatedTime: 25,
      difficulty: 'medium',
      relevanceScore: 95
    },
    {
      id: '2',
      type: 'practice',
      title: 'SQL Query Optimization Exercises',
      description: 'Practice advanced SQL queries to improve your database management skills.',
      confidence: 87,
      estimatedTime: 40,
      difficulty: 'hard',
      relevanceScore: 88
    },
    {
      id: '3',
      type: 'review',
      title: 'Linear Algebra Review Session',
      description: 'Quick review of matrix operations before the upcoming advanced topics.',
      confidence: 78,
      estimatedTime: 15,
      difficulty: 'easy',
      relevanceScore: 82
    }
  ];

  const mockInsights: LearningInsight[] = [
    {
      id: '1',
      category: 'strength',
      title: 'Excellent Problem-Solving Pattern',
      description: 'You consistently perform well on algorithmic challenges, showing strong analytical thinking.',
      actionable: false,
      impact: 'high'
    },
    {
      id: '2',
      category: 'weakness',
      title: 'Database Concepts Need Attention',
      description: 'Your performance in database-related topics is below your usual standard.',
      actionable: true,
      impact: 'medium'
    },
    {
      id: '3',
      category: 'opportunity',
      title: 'Advanced Mathematics Readiness',
      description: 'Your foundation is strong enough to tackle more advanced mathematical concepts.',
      actionable: true,
      impact: 'high'
    }
  ];

  const mockChatMessages: ChatMessage[] = [
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI learning assistant. I can help you understand concepts, suggest study materials, and track your progress. What would you like to learn about today?',
      timestamp: '10:30 AM',
      suggestions: ['Explain algorithms', 'Study plan', 'Quiz me', 'Show progress']
    },
    {
      id: '2',
      type: 'user',
      content: 'Can you explain dynamic programming in simple terms?',
      timestamp: '10:32 AM'
    },
    {
      id: '3',
      type: 'ai',
      content: 'Dynamic Programming is like solving a complex puzzle by breaking it into smaller, manageable pieces and remembering the solutions to avoid solving the same piece twice. Think of it as an optimization technique that stores results of expensive function calls.',
      timestamp: '10:32 AM',
      suggestions: ['Show examples', 'Practice problems', 'Related concepts']
    }
  ];

  useEffect(() => {
    setChatMessages(mockChatMessages);
  }, []);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, newMessage]);
    setMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'I understand your question. Let me provide you with a detailed explanation and some helpful resources.',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        suggestions: ['More details', 'Examples', 'Practice']
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'concept': return <BookOpen className="w-5 h-5 text-blue-600" />;
      case 'practice': return <Target className="w-5 h-5 text-green-600" />;
      case 'review': return <RefreshCw className="w-5 h-5 text-yellow-600" />;
      case 'challenge': return <Zap className="w-5 h-5 text-purple-600" />;
      default: return <Lightbulb className="w-5 h-5 text-gray-600" />;
    }
  };

  const getInsightIcon = (category: string) => {
    switch (category) {
      case 'strength': return <Star className="w-5 h-5 text-green-600" />;
      case 'weakness': return <Target className="w-5 h-5 text-red-600" />;
      case 'opportunity': return <TrendingUp className="w-5 h-5 text-blue-600" />;
      case 'trend': return <BarChart3 className="w-5 h-5 text-purple-600" />;
      default: return <Lightbulb className="w-5 h-5 text-gray-600" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-accent-500 to-primary-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-50 hover:scale-110"
      >
        <Brain className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-xl shadow-2xl border border-neutral-200 flex flex-col z-50">
      {/* Header */}
      <div className="p-4 border-b border-neutral-200 bg-gradient-to-r from-accent-500 to-primary-500 text-white rounded-t-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Brain className="w-6 h-6" />
            <div>
              <h3 className="font-semibold">AI Learning Assistant</h3>
              <p className="text-xs opacity-90">Powered by advanced ML</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsSpeaking(!isSpeaking)}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
            >
              <ChevronRight className="w-4 h-4 rotate-90" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-200">
        {[
          { id: 'chat', label: 'Chat', icon: MessageCircle },
          { id: 'insights', label: 'Insights', icon: TrendingUp },
          { id: 'recommendations', label: 'Recommendations', icon: Lightbulb }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-1 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-accent-600 border-b-2 border-accent-600'
                  : 'text-neutral-600 hover:text-neutral-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'chat' && (
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-lg p-3 ${
                    msg.type === 'user' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm">{msg.content}</p>
                    <p className={`text-xs mt-1 ${
                      msg.type === 'user' ? 'text-purple-200' : 'text-gray-500'
                    }`}>
                      {msg.timestamp}
                    </p>
                    {msg.suggestions && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {msg.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            className="px-2 py-1 bg-white bg-opacity-20 text-xs rounded hover:bg-opacity-30 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsListening(!isListening)}
                  className={`p-2 rounded-lg transition-colors ${
                    isListening ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask me anything..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="p-4 space-y-4 overflow-y-auto h-full">
            {mockInsights.map((insight) => (
              <div key={insight.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  {getInsightIcon(insight.category)}
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">{insight.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        insight.impact === 'high' ? 'bg-red-100 text-red-800' :
                        insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {insight.impact} impact
                      </span>
                      {insight.actionable && (
                        <button className="text-xs text-purple-600 hover:text-purple-700 font-medium">
                          Take Action →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="p-4 space-y-4 overflow-y-auto h-full">
            {mockRecommendations.map((rec) => (
              <div key={rec.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  {getRecommendationIcon(rec.type)}
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">{rec.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(rec.difficulty)}`}>
                          {rec.difficulty}
                        </span>
                        <span className="text-xs text-gray-500">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {rec.estimatedTime}m
                        </span>
                      </div>
                      <button className="text-xs text-purple-600 hover:text-purple-700 font-medium">
                        Start Learning →
                      </button>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>Relevance</span>
                        <span>{rec.relevanceScore}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-blue-500 h-1 rounded-full" 
                          style={{width: `${rec.relevanceScore}%`}}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
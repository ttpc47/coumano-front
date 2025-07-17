import React, { useState } from 'react';
import { 
  MessageCircle, 
  Send, 
  Search,
  Plus,
  Paperclip,
  MoreVertical,
  Star,
  Archive,
  Trash2,
  User,
  Clock
} from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'admin' | 'lecturer' | 'student';
  recipientId: string;
  subject: string;
  content: string;
  isRead: boolean;
  isStarred: boolean;
  sentAt: string;
  hasAttachment: boolean;
}

interface Conversation {
  id: string;
  participants: {
    id: string;
    name: string;
    role: string;
  }[];
  lastMessage: Message;
  unreadCount: number;
}

export const Messages: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [showCompose, setShowCompose] = useState(false);

  const mockMessages: Message[] = [
    {
      id: '1',
      senderId: 'STU2024001',
      senderName: 'Aminata Fouda',
      senderRole: 'student',
      recipientId: 'LEC001',
      subject: 'Question about Assignment 3',
      content: 'Hello Dr. Mbarga, I have a question about the dynamic programming assignment. Could you clarify the time complexity requirements for problem 2?',
      isRead: false,
      isStarred: false,
      sentAt: '2024-03-15T10:30:00Z',
      hasAttachment: false
    },
    {
      id: '2',
      senderId: 'LEC001',
      senderName: 'Dr. Paul Mbarga',
      senderRole: 'lecturer',
      recipientId: 'STU2024001',
      subject: 'Re: Question about Assignment 3',
      content: 'Hi Aminata, for problem 2, you should aim for O(n²) time complexity. The space complexity should be O(n). Let me know if you need further clarification.',
      isRead: true,
      isStarred: true,
      sentAt: '2024-03-15T11:15:00Z',
      hasAttachment: false
    },
    {
      id: '3',
      senderId: 'STU2024002',
      senderName: 'Claude Njomo',
      senderRole: 'student',
      recipientId: 'LEC002',
      subject: 'Request for makeup exam',
      content: 'Dear Prof. Nkomo, I was unable to attend the midterm exam due to illness. I have attached my medical certificate. Could we schedule a makeup exam?',
      isRead: false,
      isStarred: false,
      sentAt: '2024-03-15T09:45:00Z',
      hasAttachment: true
    },
    {
      id: '4',
      senderId: 'ADM001',
      senderName: 'Marie Ngozi',
      senderRole: 'admin',
      recipientId: 'ALL',
      subject: 'System Maintenance Notice',
      content: 'The university system will undergo scheduled maintenance this weekend from Saturday 10 PM to Sunday 6 AM. Please save your work accordingly.',
      isRead: true,
      isStarred: false,
      sentAt: '2024-03-14T16:00:00Z',
      hasAttachment: false
    }
  ];

  const mockConversations: Conversation[] = [
    {
      id: '1',
      participants: [
        { id: 'STU2024001', name: 'Aminata Fouda', role: 'Student' },
        { id: 'LEC001', name: 'Dr. Paul Mbarga', role: 'Lecturer' }
      ],
      lastMessage: mockMessages[1],
      unreadCount: 0
    },
    {
      id: '2',
      participants: [
        { id: 'STU2024002', name: 'Claude Njomo', role: 'Student' },
        { id: 'LEC002', name: 'Prof. Marie Nkomo', role: 'Lecturer' }
      ],
      lastMessage: mockMessages[2],
      unreadCount: 1
    },
    {
      id: '3',
      participants: [
        { id: 'ADM001', name: 'Marie Ngozi', role: 'Admin' }
      ],
      lastMessage: mockMessages[3],
      unreadCount: 0
    }
  ];

  const filteredConversations = mockConversations.filter(conv =>
    conv.participants.some(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || conv.lastMessage.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin': return 'text-red-600';
      case 'lecturer': return 'text-blue-600';
      case 'student': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const selectedConv = selectedConversation 
    ? mockConversations.find(c => c.id === selectedConversation)
    : null;

  const conversationMessages = selectedConv 
    ? mockMessages.filter(m => 
        selectedConv.participants.some(p => p.id === m.senderId || p.id === m.recipientId)
      )
    : [];

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Sidebar */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
            <button 
              onClick={() => setShowCompose(true)}
              className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation.id)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedConversation === conversation.id ? 'bg-primary-50 border-primary-200' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {conversation.participants[0].name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-medium truncate ${
                      conversation.unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'
                    }`}>
                      {conversation.participants.length === 1 
                        ? conversation.participants[0].name
                        : conversation.participants.map(p => p.name).join(', ')
                      }
                    </h3>
                    <div className="flex items-center space-x-2">
                      {conversation.unreadCount > 0 && (
                        <span className="bg-primary-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                          {conversation.unreadCount}
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        {formatTime(conversation.lastMessage.sentAt)}
                      </span>
                    </div>
                  </div>
                  <p className={`text-sm truncate mt-1 ${
                    conversation.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-600'
                  }`}>
                    {conversation.lastMessage.subject}
                  </p>
                  <p className="text-xs text-gray-500 truncate mt-1">
                    {conversation.lastMessage.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {selectedConv ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {selectedConv.participants[0].name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">
                      {selectedConv.participants.length === 1 
                        ? selectedConv.participants[0].name
                        : selectedConv.participants.map(p => p.name).join(', ')
                      }
                    </h2>
                    <p className={`text-sm ${getRoleColor(selectedConv.participants[0].role)}`}>
                      {selectedConv.participants[0].role}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                    <Star className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                    <Archive className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {conversationMessages.map((message) => (
                <div key={message.id} className={`flex ${message.senderId === 'current-user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                    message.senderId === 'current-user' 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-sm">{message.senderName}</span>
                      {message.hasAttachment && (
                        <Paperclip className="w-3 h-3" />
                      )}
                    </div>
                    <p className="text-sm font-medium mb-1">{message.subject}</p>
                    <p className="text-sm">{message.content}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-xs ${
                        message.senderId === 'current-user' ? 'text-primary-200' : 'text-gray-500'
                      }`}>
                        {formatTime(message.sentAt)}
                      </span>
                      {message.isStarred && (
                        <Star className="w-3 h-3 fill-current text-yellow-400" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-end space-x-3">
                <button className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                  <Paperclip className="w-4 h-4" />
                </button>
                <div className="flex-1">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                    rows={2}
                  />
                </div>
                <button 
                  disabled={!newMessage.trim()}
                  className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-600">Choose a conversation from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
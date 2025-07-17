import React, { useState, useEffect } from 'react';
import { Bell, Calendar, AlertCircle, CheckCircle, Clock, X, Settings, Filter, BookMarked as MarkAsRead, Trash2 } from 'lucide-react';
import { notificationService, Notification } from '../../services/notificationService';

export const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'session' | 'assignment'>('all');
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, [filter]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const params = {
        unreadOnly: filter === 'unread',
        type: filter === 'session' ? 'session_' : filter === 'assignment' ? 'assignment_' : undefined
      };
      const data = await notificationService.getNotifications(params);
      setNotifications(data.results || []);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, isRead: true, readAt: new Date().toISOString() } : n)
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => 
        prev.map(n => ({ ...n, isRead: true, readAt: new Date().toISOString() }))
      );
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'session_scheduled':
      case 'session_modified':
      case 'session_starting':
        return <Calendar className="w-5 h-5 text-blue-600" />;
      case 'session_cancelled':
        return <X className="w-5 h-5 text-red-600" />;
      case 'assignment_due':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'grade_posted':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-l-red-500 bg-red-50';
      case 'high': return 'border-l-orange-500 bg-orange-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      default: return 'border-l-blue-500 bg-blue-50';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-sm font-medium px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Mark All Read</span>
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <div className="flex space-x-2">
            {[
              { id: 'all', label: 'All' },
              { id: 'unread', label: 'Unread' },
              { id: 'session', label: 'Sessions' },
              { id: 'assignment', label: 'Assignments' }
            ].map((filterOption) => (
              <button
                key={filterOption.id}
                onClick={() => setFilter(filterOption.id as any)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  filter === filterOption.id
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {filterOption.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Recent Notifications ({notifications.length})
          </h2>
        </div>

        <div className="divide-y divide-gray-200">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-6 hover:bg-gray-50 transition-colors border-l-4 ${
                !notification.isRead ? 'bg-blue-50' : ''
              } ${getPriorityColor(notification.priority)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                        {notification.title}
                      </h3>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        notification.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                        notification.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {notification.priority}
                      </span>
                    </div>
                    <p className={`text-sm ${!notification.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
                      {notification.message}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>{formatTime(notification.createdAt)}</span>
                      {notification.readAt && (
                        <span>Read {formatTime(notification.readAt)}</span>
                      )}
                      <div className="flex items-center space-x-1">
                        <span>via</span>
                        {notification.channels.map((channel, index) => (
                          <span key={channel} className="capitalize">
                            {channel}{index < notification.channels.length - 1 ? ',' : ''}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {!notification.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      title="Mark as read"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteNotification(notification.id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                    title="Delete notification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {notifications.length === 0 && !loading && (
          <div className="p-12 text-center">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-600">You're all caught up! No new notifications to show.</p>
          </div>
        )}
      </div>

      {/* Notification Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Notification Settings</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Delivery Methods</h4>
                <div className="space-y-2">
                  {[
                    { id: 'email', label: 'Email notifications' },
                    { id: 'push', label: 'Push notifications' },
                    { id: 'sms', label: 'SMS notifications' }
                  ].map((method) => (
                    <label key={method.id} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        defaultChecked={method.id === 'email'}
                        className="rounded text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Notification Types</h4>
                <div className="space-y-2">
                  {[
                    { id: 'sessions', label: 'Session updates' },
                    { id: 'assignments', label: 'Assignment reminders' },
                    { id: 'grades', label: 'Grade notifications' },
                    { id: 'announcements', label: 'Announcements' }
                  ].map((type) => (
                    <label key={type.id} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setShowSettings(false)}
                className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
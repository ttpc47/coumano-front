import React, { useState } from 'react';
import { Bell, MessageCircle, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="bg-gradient-to-br from-gray-800 to-gray-900 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 rounded-xl transition-transform">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-secondary-100 rounded-xl flex items-center justify-center">
                <span className="text-blue-600 font-extrabold text-lg">CM</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-blue-600">COUMANO</h1>
                <p className="text-xs text-blue-200">University System</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent-500 rounded-full"></span>
            </button>

            <button className="relative p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
              <MessageCircle className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-secondary-500 rounded-full"></span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user?.firstName[0]}{user?.lastName[0]}
                  </span>
                </div>
                <div className="text-left hidden sm:block bg-gray-100 p-2.5 rounded-lg">
                  <p className="text-sm font-medium text-gray-900 ">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user?.matricule}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </button>
                  <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
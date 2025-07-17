import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AdminDashboard } from './AdminDashboard';
import { LecturerDashboard } from './LecturerDashboard';
import { StudentDashboard } from './StudentDashboard';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const getDashboardComponent = () => {
    switch (user?.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'lecturer':
        return <LecturerDashboard />;
      case 'student':
        return <StudentDashboard />;
      default:
        return <div>Invalid user role</div>;
    }
  };

  return (
    <div className="space-y-6 ml-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {user?.firstName}!
          </h1>
          <p className="text-gray-600 mt-1">
            Here's is the status in your {user?.role === 'admin' ? 'university' : 'courses'} today.
          </p>
        </div>
      </div>
      
      {getDashboardComponent()}
    </div>
  );
};
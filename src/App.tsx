import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
import { PasswordChangeForm } from './components/auth/PasswordChangeForm';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './components/dashboard/Dashboard';
import { UserManagement } from './components/admin/UserManagement/UserManagement';
import { DepartmentManagement } from './components/admin/DepartmentManagement/DepartmentManagement';
import { SpecialtyManagement } from './components/admin/SpecialtyManagement/SpecialtyManagement';
import { SystemAnalytics } from './components/admin/SystemAnalytics';
import { BulkUserImport } from './components/admin/BulkUserImport';
import { SystemSettings } from './components/admin/SystemSettings';
import { CourseManagement } from './components/courses/CourseManagement';
import { CourseScheduleManagement } from './components/schedule/CourseScheduleManagement';
import { EnhancedJitsiClassroom } from './components/classroom/EnhancedJitsiClassroom';
import { EnhancedSchedule } from './components/schedule/EnhancedSchedule';
import { Materials } from './components/materials/Materials';
import { Messages } from './components/messages/Messages';
import { EnhancedAttendanceManagement } from './components/attendance/EnhancedAttendanceManagement';
import { RecordingManagement } from './components/recordings/RecordingManagement';
import { NotificationCenter } from './components/notifications/NotificationCenter';
import { Settings } from './components/settings/Settings';
import { Menu } from 'lucide-react'; // Add this import

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [activeItem, setActiveItem] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-18 h-20 bg-gradient-to-br from-red-600 to-secondary-100 rounded-xl flex items-center justify-center mx-auto mb-4 animate-bounce-subtle">
                <span className="text-blue-600 font-extrabold text-lg">CM</span>
           </div>
          <p className="text-gray-600 font-medium">Loading COUMANO...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  if (user.isFirstLogin) {
    return <PasswordChangeForm />;
  }

  const renderContent = () => {
    switch (activeItem) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <UserManagement />;
      case 'departments':
        return <DepartmentManagement />;
      case 'specialties':
        return <SpecialtyManagement />;
      case 'analytics':
        return <SystemAnalytics />;
      case 'bulk-import':
        return <BulkUserImport />;
      case 'system-settings':
        return <SystemSettings />;
      case 'courses':
        return <CourseManagement />;
      case 'course-schedules':
        return <CourseScheduleManagement />;
      case 'schedule':
        return <EnhancedSchedule />;
      case 'virtual-classroom':
        return <EnhancedJitsiClassroom />;
      case 'materials':
        return <Materials />;
      case 'recordings':
        return <RecordingManagement />;
      case 'messages':
        return <Messages />;
      case 'attendance':
        return <EnhancedAttendanceManagement />;
      case 'notifications':
        return <NotificationCenter />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <Header />
      {/* Hamburger for mobile */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-white rounded-full p-2 shadow"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        <Menu className="w-6 h-6 text-blue-700" />
      </button>
      <div className="flex flex-1 h-full">
        <Sidebar
          activeItem={activeItem}
          onItemClick={setActiveItem}
          showSidebar={sidebarOpen || window.innerWidth >= 1024}
          onCloseSidebar={() => setSidebarOpen(false)}
        />
        <main className="flex-1 p-6 overflow-auto ml-0 scrollbar-hide  h-full">
          <div className="animate-fade-in">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
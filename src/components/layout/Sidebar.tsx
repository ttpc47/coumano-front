import React from 'react';
import { 
  Home, 
  Users, 
  BookOpen, 
  Calendar, 
  Video, 
  FileText, 
  MessageSquare, 
  Settings,
  GraduationCap,
  Building2,
  UserCheck,
  PlayCircle,
  Bell,
  BarChart3,
  Upload,
  Cog,
  Monitor
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
  showSidebar?: boolean; // NEW
  onCloseSidebar?: () => void; // NEW
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeItem,
  onItemClick,
  showSidebar = true,
  onCloseSidebar,
}) => {
  const { user } = useAuth();

  const getMenuItems = () => {
    const commonItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
      { id: 'courses', label: 'Courses', icon: BookOpen },
      { id: 'course-schedules', label: 'Course Schedules', icon: Calendar },
      { id: 'schedule', label: 'Schedule', icon: Calendar },
      { id: 'virtual-classroom', label: 'Virtual Classroom', icon: Video },
      { id: 'jitsi-classroom', label: 'Jitsi Classroom', icon: Monitor },
      { id: 'virtual-learning-hub', label: 'Learning Hub', icon: BookOpen },
      { id: 'interactive-session', label: 'Interactive Sessions', icon: Users },
      { id: 'virtual-lab', label: 'Virtual Lab', icon: Settings },
      { id: 'adaptive-learning', label: 'Adaptive Learning', icon: GraduationCap },
      { id: 'materials', label: 'Materials', icon: FileText },
      { id: 'recordings', label: 'Recordings', icon: PlayCircle },
      { id: 'messages', label: 'Messages', icon: MessageSquare },
      { id: 'notifications', label: 'Notifications', icon: Bell },
    ];

    if (user?.role === 'admin') {
      return [
        ...commonItems.slice(0, 1), // Dashboard only
        { id: 'analytics', label: 'System Analytics', icon: BarChart3 },
        { id: 'users', label: 'User Management', icon: Users },
        { id: 'bulk-import', label: 'Bulk Import', icon: Upload },
        { id: 'departments', label: 'Departments', icon: Building2 },
        { id: 'specialties', label: 'Specialties', icon: GraduationCap },
        ...commonItems.slice(1), // Rest of common items
        { id: 'attendance', label: 'Attendance', icon: UserCheck },
        { id: 'system-settings', label: 'System Settings', icon: Cog },
        { id: 'settings', label: 'Profile Settings', icon: Settings },
      ];
    }

    if (user?.role === 'lecturer') {
      return [
        ...commonItems,
        { id: 'attendance', label: 'Attendance', icon: UserCheck },
        { id: 'settings', label: 'Settings', icon: Settings },
      ];
    }

    return [
      ...commonItems,
      { id: 'settings', label: 'Settings', icon: Settings },
    ];
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden transition-opacity ${
          showSidebar ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onCloseSidebar}
      />
      <aside
        className={`
          bg-blue-700 border-r-2 border-blue-400 w-64 h-screen sticky top-20 left-0 z-50
          transition-transform duration-300
          ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:block
        `}
      >
        <nav className="p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onItemClick(item.id);
                  if (onCloseSidebar) onCloseSidebar();
                }}
                className={`
                  w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200
                  ${isActive 
                    ? 'bg-gradient-to-l from-primary-100 to-secondary-400 text-gray-900 shadow-lg scale-105' 
                    : 'text-white hover:bg-gray-100 hover:text-primary-600'
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
};
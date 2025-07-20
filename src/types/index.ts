export interface User {
  id: string;
  matricule: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isActive: boolean;
  role: 'admin' | 'lecturer' | 'student';
  avatar?: string;
  department?: string;
  specialty?: string;
  level?: number; // For students - their current level (1-6)
  isFirstLogin: boolean;
  createdAt: string;
  password?: string;
  name: string; // Concat of firstName and lastName
  lastLogin?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  head: string;
  description: string;
  specialties: Specialty[];
}

export interface Specialty {
  id: string;
  name: string;
  code: string;
  departmentId: string;
  level: number;
  courses: Course[];
}

export interface Course {
  id: string;
  name: string;
  code: string;
  credits: number;
  lecturer: User;
  specialties: string[];
  schedule: CourseSchedule[];
  materials: CourseMaterial[];
  isShared: boolean;
  description?:string;
  targetLevel?: number; // Target level for the course
}

export interface CourseSchedule {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
  type: 'lecture' | 'practical' | 'tutorial';
}

export interface CourseMaterial {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'document' | 'link';
  url: string;
  uploadedAt: string;
  size?: string;
}

export interface VirtualClassroom {
  id: string;
  courseId: string;
  title: string;
  jitsiRoomId: string;
  isActive: boolean;
  startTime: string;
  endTime?: string;
  participants: string[];
  targetSpecialties: string[];
  targetLevel?: number;
  createdBy: string; // User ID who created the session
  instructorId: string; // Instructor assigned to the session
}

export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  subject: string;
  content: string;
  isRead: boolean;
  sentAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: User;
  target: 'all' | 'students' | 'lecturers' | 'department';
  isUrgent: boolean;
  createdAt: string;
}

export interface SessionPermissions {
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canCancel: boolean;
  canJoin: boolean;
  canStartRecording: boolean;
  canStopRecording: boolean;
export function getSessionPermissions(user: User, session?: VirtualClassroom): SessionPermissions {
  const isAdmin = user.role === 'admin';
  const isInstructor = session?.instructorId === user.matricule;
  const isStudent = user.role === 'student';
  
  // Check if student can access this session
  const studentCanAccess = isStudent && session ? 
    (user.specialty && session.targetSpecialties.includes(user.specialty) &&
     (!session.targetLevel || session.targetLevel === (user.level || 3))) : false;

  return {
    canCreate: isAdmin,
    canEdit: isAdmin || isInstructor,
    canDelete: isAdmin,
    canCancel: isAdmin || isInstructor,
    canJoin: isAdmin || isInstructor || studentCanAccess,
    canStartRecording: isAdmin || isInstructor,
    canStopRecording: isAdmin || isInstructor
  };
}
}
export function getUserFullName(user: User): string {
  return `${user.firstName} ${user.lastName}`;
}
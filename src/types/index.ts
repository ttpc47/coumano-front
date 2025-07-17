export interface User {
  id: string;
  matricule: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'lecturer' | 'student';
  avatar?: string;
  department?: string;
  specialty?: string;
  isFirstLogin: boolean;
  createdAt: string;
  password?: string;
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
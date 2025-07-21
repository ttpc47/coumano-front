/*
  # Initial COUMANO Database Schema

  1. New Tables
    - `users` - System users (admins, lecturers, students)
    - `departments` - University departments
    - `specialties` - Academic specialties within departments
    - `courses` - Academic courses
    - `course_schedules` - Course scheduling information
    - `course_materials` - Course materials and resources
    - `virtual_classrooms` - Virtual classroom sessions
    - `session_recordings` - Recording metadata
    - `attendance_records` - Detailed attendance tracking
    - `transcription_segments` - Transcription data
    - `notifications` - System notifications

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for role-based access

  3. Functions
    - Auto-generate matricule numbers
    - Attendance calculation functions
    - Notification triggers
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  matricule TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'lecturer', 'student')),
  department TEXT,
  specialty TEXT,
  level INTEGER CHECK (level >= 1 AND level <= 6),
  is_active BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'pending')),
  is_first_login BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Departments table
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  code TEXT UNIQUE NOT NULL,
  head_id UUID REFERENCES users(id),
  description TEXT,
  established_year INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Specialties table
CREATE TABLE IF NOT EXISTS specialties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  level INTEGER NOT NULL CHECK (level >= 1 AND level <= 6),
  duration_years INTEGER DEFAULT 3,
  description TEXT,
  requirements TEXT[],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(department_id, code)
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  credits INTEGER NOT NULL CHECK (credits > 0),
  description TEXT,
  lecturer_id UUID REFERENCES users(id),
  specialties TEXT[] DEFAULT '{}',
  is_shared BOOLEAN DEFAULT false,
  target_level INTEGER CHECK (target_level >= 1 AND target_level <= 6),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Course schedules table
CREATE TABLE IF NOT EXISTS course_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  day TEXT NOT NULL CHECK (day IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  room TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('lecture', 'practical', 'tutorial')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CHECK (end_time > start_time)
);

-- Course materials table
CREATE TABLE IF NOT EXISTS course_materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  url TEXT NOT NULL,
  size_bytes BIGINT,
  uploaded_by UUID REFERENCES users(id),
  uploaded_at TIMESTAMPTZ DEFAULT now()
);

-- Virtual classrooms table
CREATE TABLE IF NOT EXISTS virtual_classrooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  course_id UUID REFERENCES courses(id),
  instructor_id UUID REFERENCES users(id),
  description TEXT,
  jitsi_room_id TEXT UNIQUE NOT NULL,
  scheduled_start TIMESTAMPTZ NOT NULL,
  scheduled_end TIMESTAMPTZ NOT NULL,
  actual_start TIMESTAMPTZ,
  actual_end TIMESTAMPTZ,
  max_participants INTEGER DEFAULT 100,
  participants INTEGER DEFAULT 0,
  target_specialties TEXT[] DEFAULT '{}',
  target_level INTEGER CHECK (target_level >= 1 AND target_level <= 6),
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'ended', 'cancelled')),
  is_recording BOOLEAN DEFAULT false,
  recording_id UUID,
  auto_attendance_enabled BOOLEAN DEFAULT true,
  notifications_enabled BOOLEAN DEFAULT true,
  transcription_enabled BOOLEAN DEFAULT true,
  subtitles_enabled BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CHECK (scheduled_end > scheduled_start)
);

-- Session recordings table
CREATE TABLE IF NOT EXISTS session_recordings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES virtual_classrooms(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  file_url TEXT,
  thumbnail_url TEXT,
  duration_seconds INTEGER DEFAULT 0,
  size_bytes BIGINT DEFAULT 0,
  quality TEXT DEFAULT 'HD' CHECK (quality IN ('HD', 'SD', 'Audio Only')),
  transcription_status TEXT DEFAULT 'pending' CHECK (transcription_status IN ('pending', 'processing', 'completed', 'failed')),
  transcription_url TEXT,
  summary_url TEXT,
  auto_transcribe BOOLEAN DEFAULT true,
  generate_summary BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'recording' CHECK (status IN ('recording', 'processing', 'completed', 'failed')),
  started_at TIMESTAMPTZ DEFAULT now(),
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Attendance records table
CREATE TABLE IF NOT EXISTS attendance_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES virtual_classrooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  connect_time TIMESTAMPTZ NOT NULL,
  disconnect_time TIMESTAMPTZ,
  total_duration_minutes INTEGER DEFAULT 0,
  ip_address INET,
  device TEXT,
  location TEXT,
  status TEXT DEFAULT 'present' CHECK (status IN ('present', 'absent', 'late', 'left_early')),
  connection_events JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Transcription segments table
CREATE TABLE IF NOT EXISTS transcription_segments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recording_id UUID REFERENCES session_recordings(id) ON DELETE CASCADE,
  start_time FLOAT NOT NULL,
  end_time FLOAT NOT NULL,
  speaker TEXT,
  speaker_id TEXT,
  text TEXT NOT NULL,
  confidence FLOAT DEFAULT 0.0 CHECK (confidence >= 0.0 AND confidence <= 1.0),
  language TEXT DEFAULT 'en',
  is_edited BOOLEAN DEFAULT false,
  edited_by UUID REFERENCES users(id),
  edited_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  channels TEXT[] DEFAULT '{"in_app"}',
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  scheduled_for TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE virtual_classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE transcription_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text OR 
                   EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'));

CREATE POLICY "Admins can manage all users" ON users
  FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'));

-- RLS Policies for courses table
CREATE POLICY "Students can read courses for their specialty" ON courses
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin') OR
    EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'lecturer') OR
    EXISTS (SELECT 1 FROM users u WHERE u.id::text = auth.uid()::text AND u.specialty = ANY(specialties))
  );

CREATE POLICY "Lecturers can manage their courses" ON courses
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin') OR
    lecturer_id::text = auth.uid()::text
  );

-- RLS Policies for virtual classrooms
CREATE POLICY "Users can access sessions for their specialty" ON virtual_classrooms
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin') OR
    EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'lecturer') OR
    EXISTS (SELECT 1 FROM users u WHERE u.id::text = auth.uid()::text AND u.specialty = ANY(target_specialties))
  );

CREATE POLICY "Admins and instructors can manage sessions" ON virtual_classrooms
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin') OR
    instructor_id::text = auth.uid()::text
  );

-- RLS Policies for attendance records
CREATE POLICY "Users can read own attendance" ON attendance_records
  FOR SELECT USING (
    user_id::text = auth.uid()::text OR
    EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role IN ('admin', 'lecturer'))
  );

-- RLS Policies for notifications
CREATE POLICY "Users can read own notifications" ON notifications
  FOR SELECT USING (user_id::text = auth.uid()::text);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (user_id::text = auth.uid()::text);

-- Functions and Triggers

-- Function to generate matricule numbers
CREATE OR REPLACE FUNCTION generate_matricule(user_role TEXT, department TEXT DEFAULT NULL)
RETURNS TEXT AS $$
DECLARE
  prefix TEXT;
  year_suffix TEXT;
  counter INTEGER;
  matricule TEXT;
BEGIN
  -- Get year suffix (last 2 digits)
  year_suffix := RIGHT(EXTRACT(YEAR FROM NOW())::TEXT, 2);
  
  -- Set prefix based on role
  CASE user_role
    WHEN 'admin' THEN prefix := year_suffix || 'ADM';
    WHEN 'lecturer' THEN prefix := year_suffix || 'LEC';
    WHEN 'student' THEN prefix := year_suffix || 'STU';
    ELSE prefix := year_suffix || 'USR';
  END CASE;
  
  -- Get next counter for this prefix
  SELECT COALESCE(MAX(RIGHT(matricule, 3)::INTEGER), 0) + 1
  INTO counter
  FROM users
  WHERE matricule LIKE prefix || '%';
  
  -- Generate matricule
  matricule := prefix || LPAD(counter::TEXT, 3, '0');
  
  RETURN matricule;
END;
$$ LANGUAGE plpgsql;

-- Function to update attendance duration
CREATE OR REPLACE FUNCTION update_attendance_duration()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.disconnect_time IS NOT NULL AND NEW.connect_time IS NOT NULL THEN
    NEW.total_duration_minutes := EXTRACT(EPOCH FROM (NEW.disconnect_time - NEW.connect_time)) / 60;
  END IF;
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for attendance duration calculation
CREATE TRIGGER update_attendance_duration_trigger
  BEFORE UPDATE ON attendance_records
  FOR EACH ROW
  EXECUTE FUNCTION update_attendance_duration();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_specialties_updated_at BEFORE UPDATE ON specialties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_course_schedules_updated_at BEFORE UPDATE ON course_schedules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_virtual_classrooms_updated_at BEFORE UPDATE ON virtual_classrooms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_session_recordings_updated_at BEFORE UPDATE ON session_recordings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_matricule ON users(matricule);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_department ON users(department);
CREATE INDEX IF NOT EXISTS idx_users_specialty ON users(specialty);

CREATE INDEX IF NOT EXISTS idx_courses_code ON courses(code);
CREATE INDEX IF NOT EXISTS idx_courses_lecturer ON courses(lecturer_id);
CREATE INDEX IF NOT EXISTS idx_courses_specialties ON courses USING GIN(specialties);

CREATE INDEX IF NOT EXISTS idx_course_schedules_course ON course_schedules(course_id);
CREATE INDEX IF NOT EXISTS idx_course_schedules_day_time ON course_schedules(day, start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_course_schedules_room ON course_schedules(room);

CREATE INDEX IF NOT EXISTS idx_virtual_classrooms_status ON virtual_classrooms(status);
CREATE INDEX IF NOT EXISTS idx_virtual_classrooms_instructor ON virtual_classrooms(instructor_id);
CREATE INDEX IF NOT EXISTS idx_virtual_classrooms_course ON virtual_classrooms(course_id);
CREATE INDEX IF NOT EXISTS idx_virtual_classrooms_scheduled_start ON virtual_classrooms(scheduled_start);
CREATE INDEX IF NOT EXISTS idx_virtual_classrooms_specialties ON virtual_classrooms USING GIN(target_specialties);

CREATE INDEX IF NOT EXISTS idx_attendance_session ON attendance_records(session_id);
CREATE INDEX IF NOT EXISTS idx_attendance_user ON attendance_records(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_connect_time ON attendance_records(connect_time);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at);
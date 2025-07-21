/*
  # Sample Data for COUMANO Development

  This migration adds sample data for development and testing purposes.
  
  1. Sample Users
    - Admin user
    - Lecturer users
    - Student users
  
  2. Sample Departments and Specialties
    - Computer Science department with specialties
    - Mathematics department with specialties
  
  3. Sample Courses
    - Courses with schedules
    - Course materials
  
  4. Sample Virtual Classroom Sessions
    - Scheduled sessions
    - Live sessions
*/

-- Insert sample departments
INSERT INTO departments (id, name, code, description, established_year) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Computer Science', 'CS', 'Advanced computing, software development, and information systems', 1995),
  ('550e8400-e29b-41d4-a716-446655440002', 'Mathematics', 'MATH', 'Pure and applied mathematics, statistics, and mathematical modeling', 1987),
  ('550e8400-e29b-41d4-a716-446655440003', 'Physics', 'PHYS', 'Theoretical and experimental physics, materials science', 1990),
  ('550e8400-e29b-41d4-a716-446655440004', 'Engineering', 'ENG', 'Civil, mechanical, and electrical engineering programs', 1998)
ON CONFLICT (id) DO NOTHING;

-- Insert sample specialties
INSERT INTO specialties (id, name, code, department_id, level, duration_years, description) VALUES
  ('550e8400-e29b-41d4-a716-446655440011', 'Software Engineering', 'SE', '550e8400-e29b-41d4-a716-446655440001', 3, 3, 'Design and development of software systems and applications'),
  ('550e8400-e29b-41d4-a716-446655440012', 'Data Science', 'DS', '550e8400-e29b-41d4-a716-446655440001', 3, 3, 'Statistical analysis, machine learning, and big data processing'),
  ('550e8400-e29b-41d4-a716-446655440013', 'Cybersecurity', 'CYB', '550e8400-e29b-41d4-a716-446655440001', 3, 3, 'Information security, network protection, and digital forensics'),
  ('550e8400-e29b-41d4-a716-446655440021', 'Applied Mathematics', 'AM', '550e8400-e29b-41d4-a716-446655440002', 3, 3, 'Mathematical modeling and computational mathematics'),
  ('550e8400-e29b-41d4-a716-446655440031', 'Theoretical Physics', 'TP', '550e8400-e29b-41d4-a716-446655440003', 3, 3, 'Advanced theoretical physics and quantum mechanics'),
  ('550e8400-e29b-41d4-a716-446655440041', 'Civil Engineering', 'CE', '550e8400-e29b-41d4-a716-446655440004', 5, 5, 'Infrastructure design, construction, and project management')
ON CONFLICT (id) DO NOTHING;

-- Insert sample users (passwords are hashed version of 'password123')
INSERT INTO users (id, matricule, first_name, last_name, email, password_hash, role, department, specialty, level, is_first_login) VALUES
  -- Admin user
  ('550e8400-e29b-41d4-a716-446655440101', '24ADM001', 'Marie', 'Ngozi', 'admin@university.cm', '$2b$12$LQv3c1yqBw2LeOI.nxW/.OU7tkABXp.VnnMfpdwh3LAks5wlbADyG', 'admin', NULL, NULL, NULL, false),
  
  -- Lecturer users
  ('550e8400-e29b-41d4-a716-446655440102', '24LEC001', 'Paul', 'Mbarga', 'p.mbarga@university.cm', '$2b$12$LQv3c1yqBw2LeOI.nxW/.OU7tkABXp.VnnMfpdwh3LAks5wlbADyG', 'lecturer', 'Computer Science', NULL, NULL, false),
  ('550e8400-e29b-41d4-a716-446655440103', '24LEC002', 'Marie', 'Nkomo', 'm.nkomo@university.cm', '$2b$12$LQv3c1yqBw2LeOI.nxW/.OU7tkABXp.VnnMfpdwh3LAks5wlbADyG', 'lecturer', 'Computer Science', NULL, NULL, false),
  ('550e8400-e29b-41d4-a716-446655440104', '24LEC003', 'Jean', 'Fotso', 'j.fotso@university.cm', '$2b$12$LQv3c1yqBw2LeOI.nxW/.OU7tkABXp.VnnMfpdwh3LAks5wlbADyG', 'lecturer', 'Mathematics', NULL, NULL, false),
  
  -- Student users
  ('550e8400-e29b-41d4-a716-446655440201', '24STU001', 'Aminata', 'Fouda', 'a.fouda@student.university.cm', '$2b$12$LQv3c1yqBw2LeOI.nxW/.OU7tkABXp.VnnMfpdwh3LAks5wlbADyG', 'student', 'Computer Science', 'Software Engineering', 3, true),
  ('550e8400-e29b-41d4-a716-446655440202', '24STU002', 'Claude', 'Njomo', 'c.njomo@student.university.cm', '$2b$12$LQv3c1yqBw2LeOI.nxW/.OU7tkABXp.VnnMfpdwh3LAks5wlbADyG', 'student', 'Computer Science', 'Data Science', 3, false),
  ('550e8400-e29b-41d4-a716-446655440203', '24STU003', 'Sarah', 'Biya', 's.biya@student.university.cm', '$2b$12$LQv3c1yqBw2LeOI.nxW/.OU7tkABXp.VnnMfpdwh3LAks5wlbADyG', 'student', 'Computer Science', 'Software Engineering', 3, false),
  ('550e8400-e29b-41d4-a716-446655440204', '24STU004', 'Emmanuel', 'Talla', 'e.talla@student.university.cm', '$2b$12$LQv3c1yqBw2LeOI.nxW/.OU7tkABXp.VnnMfpdwh3LAks5wlbADyG', 'student', 'Mathematics', 'Applied Mathematics', 3, false)
ON CONFLICT (id) DO NOTHING;

-- Update department heads
UPDATE departments SET head_id = '550e8400-e29b-41d4-a716-446655440102' WHERE code = 'CS';
UPDATE departments SET head_id = '550e8400-e29b-41d4-a716-446655440104' WHERE code = 'MATH';

-- Insert sample courses
INSERT INTO courses (id, name, code, credits, description, lecturer_id, specialties, is_shared, target_level, created_by) VALUES
  ('550e8400-e29b-41d4-a716-446655440301', 'Advanced Algorithms', 'CS301', 4, 'Advanced algorithmic techniques and complexity analysis', '550e8400-e29b-41d4-a716-446655440102', '{"Software Engineering", "Data Science"}', true, 3, '550e8400-e29b-41d4-a716-446655440101'),
  ('550e8400-e29b-41d4-a716-446655440302', 'Database Systems', 'CS205', 3, 'Relational databases, SQL, and database design principles', '550e8400-e29b-41d4-a716-446655440103', '{"Software Engineering"}', false, 2, '550e8400-e29b-41d4-a716-446655440101'),
  ('550e8400-e29b-41d4-a716-446655440303', 'Linear Algebra', 'MATH201', 3, 'Vector spaces, matrices, eigenvalues and linear transformations', '550e8400-e29b-41d4-a716-446655440104', '{"Applied Mathematics", "Data Science", "Theoretical Physics"}', true, 2, '550e8400-e29b-41d4-a716-446655440101'),
  ('550e8400-e29b-41d4-a716-446655440304', 'Software Engineering', 'CS302', 4, 'Software development lifecycle, project management and quality assurance', '550e8400-e29b-41d4-a716-446655440103', '{"Software Engineering"}', false, 3, '550e8400-e29b-41d4-a716-446655440101')
ON CONFLICT (id) DO NOTHING;

-- Insert sample course schedules
INSERT INTO course_schedules (id, course_id, day, start_time, end_time, room, type) VALUES
  ('550e8400-e29b-41d4-a716-446655440401', '550e8400-e29b-41d4-a716-446655440301', 'Monday', '08:00:00', '10:00:00', 'Amphitheater C', 'lecture'),
  ('550e8400-e29b-41d4-a716-446655440402', '550e8400-e29b-41d4-a716-446655440301', 'Wednesday', '14:00:00', '17:00:00', 'Lab A-205', 'practical'),
  ('550e8400-e29b-41d4-a716-446655440403', '550e8400-e29b-41d4-a716-446655440302', 'Tuesday', '10:00:00', '12:00:00', 'Room B-101', 'lecture'),
  ('550e8400-e29b-41d4-a716-446655440404', '550e8400-e29b-41d4-a716-446655440302', 'Thursday', '14:00:00', '17:00:00', 'Lab B-205', 'practical'),
  ('550e8400-e29b-41d4-a716-446655440405', '550e8400-e29b-41d4-a716-446655440303', 'Monday', '10:00:00', '12:00:00', 'Room C-301', 'lecture'),
  ('550e8400-e29b-41d4-a716-446655440406', '550e8400-e29b-41d4-a716-446655440303', 'Friday', '08:00:00', '10:00:00', 'Room C-301', 'tutorial'),
  ('550e8400-e29b-41d4-a716-446655440407', '550e8400-e29b-41d4-a716-446655440304', 'Tuesday', '14:00:00', '16:00:00', 'Amphitheater A', 'lecture'),
  ('550e8400-e29b-41d4-a716-446655440408', '550e8400-e29b-41d4-a716-446655440304', 'Thursday', '08:00:00', '11:00:00', 'Lab A-101', 'practical')
ON CONFLICT (id) DO NOTHING;

-- Insert sample virtual classroom sessions
INSERT INTO virtual_classrooms (
  id, title, course_id, instructor_id, description, jitsi_room_id,
  scheduled_start, scheduled_end, max_participants, target_specialties, target_level,
  status, participants, auto_attendance_enabled, notifications_enabled,
  transcription_enabled, subtitles_enabled, created_by
) VALUES
  (
    '550e8400-e29b-41d4-a716-446655440501',
    'Advanced Algorithms - Dynamic Programming',
    '550e8400-e29b-41d4-a716-446655440301',
    '550e8400-e29b-41d4-a716-446655440102',
    'Deep dive into dynamic programming algorithms with practical examples',
    'cs301-algo-dp-20240315',
    '2024-03-15 08:00:00+00',
    '2024-03-15 10:00:00+00',
    80,
    '{"Software Engineering", "Data Science"}',
    3,
    'live',
    34,
    true,
    true,
    true,
    true,
    '550e8400-e29b-41d4-a716-446655440101'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440502',
    'Database Systems - Query Optimization',
    '550e8400-e29b-41d4-a716-446655440302',
    '550e8400-e29b-41d4-a716-446655440103',
    'Advanced techniques for optimizing database queries and performance tuning',
    'cs205-db-optimization-20240315',
    '2024-03-15 14:00:00+00',
    '2024-03-15 17:00:00+00',
    50,
    '{"Software Engineering"}',
    2,
    'scheduled',
    0,
    true,
    true,
    true,
    false,
    '550e8400-e29b-41d4-a716-446655440101'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440503',
    'Linear Algebra - Matrix Operations',
    '550e8400-e29b-41d4-a716-446655440303',
    '550e8400-e29b-41d4-a716-446655440104',
    'Comprehensive coverage of matrix operations and their applications',
    'math201-matrices-20240314',
    '2024-03-14 10:00:00+00',
    '2024-03-14 12:00:00+00',
    100,
    '{"Applied Mathematics", "Data Science", "Theoretical Physics"}',
    2,
    'ended',
    67,
    true,
    true,
    true,
    true,
    '550e8400-e29b-41d4-a716-446655440101'
  )
ON CONFLICT (id) DO NOTHING;

-- Insert sample course materials
INSERT INTO course_materials (id, course_id, title, type, url, size_bytes, uploaded_by) VALUES
  ('550e8400-e29b-41d4-a716-446655440601', '550e8400-e29b-41d4-a716-446655440301', 'Advanced Algorithms - Lecture 5 Slides', 'pdf', '/materials/cs301-lecture5.pdf', 2516582, '550e8400-e29b-41d4-a716-446655440102'),
  ('550e8400-e29b-41d4-a716-446655440602', '550e8400-e29b-41d4-a716-446655440302', 'Database Design Tutorial Video', 'video', '/materials/db-tutorial.mp4', 163577856, '550e8400-e29b-41d4-a716-446655440103'),
  ('550e8400-e29b-41d4-a716-446655440603', '550e8400-e29b-41d4-a716-446655440303', 'Linear Algebra Problem Set Solutions', 'document', '/materials/math201-solutions.docx', 1887436, '550e8400-e29b-41d4-a716-446655440104'),
  ('550e8400-e29b-41d4-a716-446655440604', '550e8400-e29b-41d4-a716-446655440304', 'Software Engineering Lab Materials', 'archive', '/materials/se-lab-materials.zip', 47448064, '550e8400-e29b-41d4-a716-446655440103')
ON CONFLICT (id) DO NOTHING;

-- Insert sample attendance records
INSERT INTO attendance_records (
  id, session_id, user_id, connect_time, disconnect_time, 
  total_duration_minutes, ip_address, device, location, status
) VALUES
  (
    '550e8400-e29b-41d4-a716-446655440701',
    '550e8400-e29b-41d4-a716-446655440503',
    '550e8400-e29b-41d4-a716-446655440201',
    '2024-03-14 10:03:00+00',
    '2024-03-14 11:57:00+00',
    114,
    '192.168.1.100',
    'Chrome on Windows',
    'Yaoundé, Cameroon',
    'present'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440702',
    '550e8400-e29b-41d4-a716-446655440503',
    '550e8400-e29b-41d4-a716-446655440202',
    '2024-03-14 10:15:00+00',
    '2024-03-14 11:58:00+00',
    103,
    '192.168.1.101',
    'Safari on iPhone',
    'Douala, Cameroon',
    'late'
  )
ON CONFLICT (id) DO NOTHING;

-- Insert sample session recordings
INSERT INTO session_recordings (
  id, session_id, title, file_url, duration_seconds, size_bytes,
  quality, transcription_status, status, started_at, ended_at
) VALUES
  (
    '550e8400-e29b-41d4-a716-446655440801',
    '550e8400-e29b-41d4-a716-446655440503',
    'Linear Algebra - Matrix Operations Recording',
    '/recordings/math201-matrices-20240314.mp4',
    7080,
    524288000,
    'HD',
    'completed',
    'completed',
    '2024-03-14 10:00:00+00',
    '2024-03-14 12:00:00+00'
  )
ON CONFLICT (id) DO NOTHING;

-- Insert sample notifications
INSERT INTO notifications (
  id, user_id, type, title, message, priority, channels, is_read
) VALUES
  (
    '550e8400-e29b-41d4-a716-446655440901',
    '550e8400-e29b-41d4-a716-446655440201',
    'session_starting',
    'Session Starting Soon',
    'Your Advanced Algorithms session will start in 15 minutes',
    'high',
    '{"in_app", "email"}',
    false
  ),
  (
    '550e8400-e29b-41d4-a716-446655440902',
    '550e8400-e29b-41d4-a716-446655440202',
    'grade_posted',
    'New Grade Available',
    'Your grade for Linear Algebra assignment has been posted',
    'medium',
    '{"in_app"}',
    true
  )
ON CONFLICT (id) DO NOTHING;
# 🎓 COUMANO - Cameroon-Oriented University Management System (Full-Stack)

A comprehensive, web-based academic management and e-learning platform designed specifically for Cameroonian universities. COUMANO provides a complete digital ecosystem for managing departments, specialties, courses, virtual learning, and administrative workflows.

## 🌟 Features

### 🏫 Academic Structure Management
- **Hierarchical Organization**: Departments → Specialties → Courses
- **Cross-Department Course Sharing**: Support for interdisciplinary courses
- **Automatic Student Enrollment**: Students automatically enrolled in specialty-required courses
- **Flexible Course Assignment**: Lecturers can teach across multiple specialties

### 👥 User Management
- **Role-Based Access Control**: Admin, Lecturer, Student roles
- **Centralized Account Creation**: Admin-generated accounts with auto-matricules
- **Bulk User Import**: CSV-based bulk user creation with validation
- **First-Login Password Change**: Mandatory password update on first login

### 🎥 Virtual Learning
- **Jitsi Meet Integration**: Seamless video conferencing for live classes
- **Automatic Session Recording**: All sessions recorded and stored
- **AI-Powered Transcription**: Automatic speech-to-text with speaker identification
- **Real-time Attendance Tracking**: Automatic attendance with connection timestamps

### 📊 Analytics & Monitoring
- **System Analytics Dashboard**: Real-time usage statistics and performance metrics
- **Attendance Analytics**: Detailed attendance patterns and engagement insights
- **User Activity Monitoring**: Track system usage and participation
- **Performance Metrics**: System uptime, response times, and resource usage

### 🔔 Smart Notifications
- **Multi-Channel Notifications**: Email, Push, SMS, and In-App notifications
- **Automated Session Alerts**: Notifications for scheduled, modified, or canceled sessions
- **Customizable Reminders**: Configurable reminder times for sessions and deadlines
- **Real-time Updates**: Instant notifications for important events

### 📁 Content Management
- **Material Upload & Sharing**: Support for various file types with compression
- **Recording Management**: Organized storage and access to session recordings
- **Transcription Access**: Searchable transcripts with timestamps
- **File Organization**: Course-based material organization with sharing controls

## 🚀 Technology Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | React 18 + TypeScript |
| **Styling** | Tailwind CSS |
| **Icons** | Lucide React |
| **Routing** | React Router DOM |
| **State Management** | React Context API |
| **HTTP Client** | Fetch API |
| **Video Conferencing** | Jitsi Meet API |
| **Build Tool** | Vite |
| **Backend** | FastAPI + Python |
| **Database** | Supabase (PostgreSQL) |

## 📋 Prerequisites

- Node.js 18+ and npm
- Modern web browser with WebRTC support
- Backend API server (Django recommended)
- Python 3.9+ (for backend)
- Supabase account (for database)

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/coumano-frontend.git
cd coumano-frontend
```

### 2. Install Dependencies

#### Frontend Setup
```bash
npm install
```

#### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Environment Configuration

#### Frontend Environment
```bash
cp .env.example .env
```

Edit frontend `.env` file:
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_JITSI_DOMAIN=meet.jit.si
VITE_JITSI_APP_ID=coumano-university
# ... other configurations
```

#### Backend Environment
```bash
cd backend
cp .env.example .env
```

Edit backend `.env` file:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
SECRET_KEY=your_super_secret_jwt_key_here
# ... other configurations
```

### 4. Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Go to SQL Editor in your Supabase dashboard
3. Copy and run the migration from `backend/supabase/migrations/001_initial_schema.sql`
4. Update your `.env` files with Supabase credentials

### 4. Start Development Server

#### Start Backend Server
```bash
cd backend
python run.py
# Backend will run on http://localhost:8000
```

#### Start Frontend Server
```bash
npm run dev
# Frontend will run on http://localhost:5173
```

The complete application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🔧 Configuration

### Frontend Configuration

### API Integration
Configure your backend API endpoints in the environment file:
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

### Jitsi Meet Setup
For custom Jitsi deployment:
```env
VITE_JITSI_DOMAIN=your-jitsi-domain.com
VITE_JITSI_APP_ID=your-app-id
```

### Feature Flags
Enable/disable features as needed:
```env
VITE_ENABLE_RECORDING=true
VITE_ENABLE_TRANSCRIPTION=true
VITE_ENABLE_AUTO_ATTENDANCE=true
VITE_ENABLE_BULK_IMPORT=true
```

### Backend Configuration

#### Database Configuration
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
```

#### Authentication Configuration
```env
SECRET_KEY=your_super_secret_jwt_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=480
```

#### Email Configuration (Optional)
Configure SMTP settings for email notifications and password resets.

## 👤 User Roles & Permissions

### 🔴 Administrator
- Complete system access and configuration
- User account creation and management
- Department and specialty configuration
- System analytics and monitoring
- Bulk operations and data import/export

### 🔵 Lecturer
- Course management and content upload
- Virtual classroom hosting
- Attendance tracking and management
- Student communication and grading
- Session recording and transcription access

### 🟢 Student
- Course enrollment and material access
- Virtual classroom participation
- Assignment submission and grade viewing
- Communication with lecturers
- Personal attendance and progress tracking

## 📱 Key Components

### Dashboard
- Role-specific overview and quick actions
- Recent activity and upcoming events
- Real-time analytics and system metrics
- Performance metrics and notifications

### Virtual Classroom
- Jitsi Meet integration with custom UI
- Automatic recording and transcription
- Real-time attendance tracking
- Session management and controls
- Live subtitles and multi-language support

### User Management
- Comprehensive user CRUD operations
- Bulk import with CSV validation
- Role assignment and permissions
- Account status and activity monitoring

### Analytics
- System performance monitoring
- Usage statistics and trends
- Attendance analytics
- Real-time system health monitoring

### Course Scheduling
- Advanced scheduling with conflict detection
- Room availability management
- Export capabilities for reports

## 🔌 API Integration

The frontend expects a REST API with the following endpoints:

### Authentication

#### Frontend Expected Endpoints
```
POST /auth/login/
POST /auth/logout/
POST /auth/change-password/
```

### User Management

#### Backend Provided Endpoints
```
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/change-password
GET  /api/auth/me
```

```
GET /users/
POST /users/
PATCH /users/{id}/
DELETE /users/{id}/
POST /users/bulk-import/
```

### Academic Structure
#### Course Management
```
GET /departments/
POST /departments/
GET /specialties/
POST /specialties/
GET /courses/
POST /courses/
```

#### Virtual Classroom
```
GET    /api/virtual-classroom/sessions
POST   /api/virtual-classroom/sessions
POST   /api/virtual-classroom/sessions/{id}/join
POST   /api/virtual-classroom/sessions/{id}/recording/start
```

### Sessions & Recordings
```
GET /sessions/
GET /sessions/
POST /sessions/
GET /recordings/
POST /recordings/{id}/transcription/
```

### Analytics & Settings
```
GET /analytics/
GET /settings/
PATCH /settings/
```

## 🏗️ Architecture Overview

### Frontend Architecture
- **React 18** with TypeScript for type safety
- **Tailwind CSS** for responsive design
- **React Router** for client-side routing
- **Context API** for state management
- **Jitsi Meet External API** for video conferencing

### Backend Architecture
- **FastAPI** for high-performance API
- **Supabase** for database and real-time features
- **JWT Authentication** with role-based access control
- **Pydantic** for data validation
- **Row Level Security** for data protection

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Build Backend
```bash
cd backend
pip install gunicorn
```

### Deploy to Static Hosting
The `dist` folder can be deployed to any static hosting service:
- Netlify
- Vercel
- AWS S3 + CloudFront
- GitHub Pages

### Docker Deployment

#### Frontend Dockerfile
```dockerfile
FROM node:18-alpine as build
# ... build steps
```

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Backend Dockerfile
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "app.main:app", "-w", "4", "-k", "uvicorn.workers.UvicornWorker"]
```

## 🧪 Testing

### Run Tests
```bash
npm run test
```

### Backend Tests
```bash
cd backend
pytest
```

### Linting
```bash
npm run lint
```

### Type Checking
```bash
npm run type-check
```

### API Testing
```bash
# Test API endpoints
curl http://localhost:8000/health
```

## 📊 Performance Optimization

- **Code Splitting**: Automatic route-based code splitting
- **Lazy Loading**: Components loaded on demand
- **Image Optimization**: Responsive images with proper formats
- **Bundle Analysis**: Use `npm run build -- --analyze` to analyze bundle size
- **Database Optimization**: Indexed queries and efficient data fetching
- **Caching**: Redis caching for frequently accessed data

## 🔒 Security Features

- **JWT Token Management**: Automatic token refresh and secure storage
- **Role-Based Access Control**: Component-level permission checking
- **Input Validation**: Client-side validation with server-side verification
- **Secure File Upload**: File type and size validation
- **Row Level Security**: Database-level access control
- **Password Hashing**: Secure bcrypt password storage
- **CORS Protection**: Configurable cross-origin resource sharing

## 🌍 Internationalization

The system supports multiple languages:
- English (default)
- French
- Local Cameroonian languages (configurable)

## 📞 Support & Documentation

### Project Structure
```
coumano/
├── frontend/          # React frontend application
├── backend/           # FastAPI backend application
├── docs/             # Additional documentation
└── README.md         # This file
```

### Getting Help
- Check the [Issues](https://github.com/your-org/coumano-frontend/issues) page
- Review the [API Documentation](https://api-docs.your-domain.com)
- Contact support at `support@university.cm`

### Contributing
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes (frontend and/or backend)
4. Add tests for new functionality
5. Run tests: `npm test` (frontend) and `pytest` (backend)
6. Commit changes: `git commit -m 'Add amazing feature'`
7. Push to branch: `git push origin feature/amazing-feature`
8. Submit a pull request

### Development Guidelines
- **Frontend**: Follow React best practices and TypeScript conventions
- **Backend**: Follow FastAPI patterns and Python PEP 8
- **Database**: Use migrations for schema changes
- **Testing**: Write tests for both frontend and backend
- **Documentation**: Update README and API docs for changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for Cameroonian universities with love ❤️
- **FastAPI**: For the excellent Python web framework
- Built for Cameroonian universities with love ❤️
- Powered by modern web technologies
- Designed for African educational excellence

---

**COUMANO** - Empowering Cameroonian Universities with Digital Excellence 🇨🇲
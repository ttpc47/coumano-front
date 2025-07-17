# 🎓 COUMANO - Cameroon-Oriented University Management System

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

## 📋 Prerequisites

- Node.js 18+ and npm
- Modern web browser with WebRTC support
- Backend API server (Django recommended)

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/coumano-frontend.git
cd coumano-frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_JITSI_DOMAIN=meet.jit.si
VITE_JITSI_APP_ID=coumano-university
# ... other configurations
```

### 4. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🔧 Configuration

### API Integration
Configure your backend API endpoints in the environment file:
```env
VITE_API_BASE_URL=https://your-api-domain.com/api
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
- Performance metrics and notifications

### Virtual Classroom
- Jitsi Meet integration with custom UI
- Automatic recording and transcription
- Real-time attendance tracking
- Session management and controls

### User Management
- Comprehensive user CRUD operations
- Bulk import with CSV validation
- Role assignment and permissions
- Account status and activity monitoring

### Analytics
- System performance monitoring
- Usage statistics and trends
- Attendance analytics
- Export capabilities for reports

## 🔌 API Integration

The frontend expects a REST API with the following endpoints:

### Authentication
```
POST /auth/login/
POST /auth/logout/
POST /auth/change-password/
```

### User Management
```
GET /users/
POST /users/
PATCH /users/{id}/
DELETE /users/{id}/
POST /users/bulk-import/
```

### Academic Structure
```
GET /departments/
POST /departments/
GET /specialties/
POST /specialties/
GET /courses/
POST /courses/
```

### Sessions & Recordings
```
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

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Static Hosting
The `dist` folder can be deployed to any static hosting service:
- Netlify
- Vercel
- AWS S3 + CloudFront
- GitHub Pages

### Docker Deployment
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

## 🧪 Testing

### Run Tests
```bash
npm run test
```

### Linting
```bash
npm run lint
```

### Type Checking
```bash
npm run type-check
```

## 📊 Performance Optimization

- **Code Splitting**: Automatic route-based code splitting
- **Lazy Loading**: Components loaded on demand
- **Image Optimization**: Responsive images with proper formats
- **Bundle Analysis**: Use `npm run build -- --analyze` to analyze bundle size

## 🔒 Security Features

- **JWT Token Management**: Automatic token refresh and secure storage
- **Role-Based Access Control**: Component-level permission checking
- **Input Validation**: Client-side validation with server-side verification
- **Secure File Upload**: File type and size validation

## 🌍 Internationalization

The system supports multiple languages:
- English (default)
- French
- Local Cameroonian languages (configurable)

## 📞 Support & Documentation

### Getting Help
- Check the [Issues](https://github.com/your-org/coumano-frontend/issues) page
- Review the [API Documentation](https://api-docs.your-domain.com)
- Contact support at `support@university.cm`

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for Cameroonian universities with love ❤️
- Powered by modern web technologies
- Designed for African educational excellence

---

**COUMANO** - Empowering Cameroonian Universities with Digital Excellence 🇨🇲
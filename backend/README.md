# COUMANO Backend API

A comprehensive Python backend for the COUMANO (Cameroon-Oriented University Management System) built with FastAPI and Supabase.

## 🚀 Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin, Lecturer, Student)
- Secure password hashing with bcrypt
- First-login password change enforcement

### 🎓 Academic Management
- **Course Management**: Create, update, and manage courses
- **Schedule Management**: Advanced scheduling with conflict detection
- **Department & Specialty Management**: Hierarchical academic structure
- **User Management**: Comprehensive user administration

### 🎥 Virtual Classroom Integration
- **Jitsi Meet Integration**: Seamless video conferencing
- **Session Management**: Create, join, and manage virtual sessions
- **Recording Support**: Automatic session recording with metadata
- **Real-time Attendance**: Automatic attendance tracking with connection logs
- **Transcription Support**: AI-powered speech-to-text with speaker identification

### 📊 Analytics & Monitoring
- **Attendance Analytics**: Detailed attendance patterns and insights
- **Session Analytics**: Engagement metrics and participation data
- **System Monitoring**: Health checks and performance metrics

## 🛠️ Technology Stack

- **Framework**: FastAPI 0.104+
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT with python-jose
- **Password Hashing**: bcrypt via passlib
- **Validation**: Pydantic v2
- **File Handling**: aiofiles
- **Email**: SMTP with Jinja2 templates
- **Background Tasks**: Celery with Redis
- **Testing**: pytest with async support

## 📋 Prerequisites

- Python 3.9+
- Supabase account and project
- Redis server (for background tasks)
- SMTP server access (for emails)

## 🚀 Quick Start

### 1. Clone and Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
nano .env
```

Required environment variables:
```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key

# JWT Configuration
SECRET_KEY=your_super_secret_jwt_key_here

# Email Configuration (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

### 3. Database Setup

The backend uses Supabase as the database. Run the migration to set up the schema:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and run the migration from `supabase/migrations/001_initial_schema.sql`

### 4. Run the Server

```bash
# Development server with auto-reload
python run.py

# Or using uvicorn directly
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at:
- **API**: http://localhost:8000
- **Documentation**: http://localhost:8000/docs
- **Alternative Docs**: http://localhost:8000/redoc

## 📚 API Documentation

### Authentication Endpoints

```http
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/change-password
GET  /api/auth/me
```

### Virtual Classroom Endpoints

```http
GET    /api/virtual-classroom/sessions
POST   /api/virtual-classroom/sessions
GET    /api/virtual-classroom/sessions/{id}
POST   /api/virtual-classroom/sessions/{id}/join
POST   /api/virtual-classroom/sessions/{id}/leave
POST   /api/virtual-classroom/sessions/{id}/recording/start
POST   /api/virtual-classroom/sessions/{id}/recording/stop
```

### Course Management Endpoints

```http
GET    /api/courses
POST   /api/courses
GET    /api/courses/{id}
POST   /api/courses/{id}/schedules
PUT    /api/courses/schedules/{id}
DELETE /api/courses/schedules/{id}
POST   /api/courses/{id}/schedules/check-conflicts
```

## 🔒 Security Features

### Role-Based Access Control

- **Admins**: Full system access
- **Lecturers**: Manage their courses and sessions
- **Students**: Access courses for their specialty and level

### Database Security

- Row Level Security (RLS) enabled on all tables
- Policies enforce role-based data access
- Secure password storage with bcrypt
- JWT token validation for all protected endpoints

### Data Validation

- Comprehensive input validation with Pydantic
- SQL injection prevention through parameterized queries
- File upload validation and size limits
- Email format validation

## 🏗️ Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application
│   ├── config.py            # Configuration settings
│   ├── database.py          # Supabase client setup
│   ├── api/                 # API route modules
│   │   ├── __init__.py
│   │   ├── auth.py          # Authentication routes
│   │   ├── virtual_classroom.py  # Virtual classroom routes
│   │   └── courses.py       # Course management routes
│   ├── models/              # Pydantic models
│   │   ├── user.py          # User models
│   │   ├── course.py        # Course models
│   │   └── virtual_classroom.py  # Virtual classroom models
│   └── services/            # Business logic
│       ├── auth_service.py  # Authentication service
│       ├── course_service.py # Course management service
│       └── virtual_classroom_service.py  # Virtual classroom service
├── supabase/
│   └── migrations/          # Database migrations
├── requirements.txt         # Python dependencies
├── .env.example            # Environment template
├── run.py                  # Development server script
└── README.md               # This file
```

## 🧪 Testing

```bash
# Run tests
pytest

# Run tests with coverage
pytest --cov=app

# Run specific test file
pytest tests/test_auth.py
```

## 🚀 Deployment

### Production Setup

1. **Environment Variables**: Set production environment variables
2. **Database**: Use production Supabase instance
3. **Security**: 
   - Set `DEBUG=False`
   - Use strong `SECRET_KEY`
   - Configure proper CORS origins
4. **Server**: Use production ASGI server like Gunicorn

```bash
# Install production dependencies
pip install gunicorn

# Run with Gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Docker Deployment

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["gunicorn", "app.main:app", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000"]
```

## 🔧 Configuration

### Key Settings

- **JWT_SECRET_KEY**: Used for token signing (keep secret!)
- **ACCESS_TOKEN_EXPIRE_MINUTES**: Token expiration time (default: 480 minutes)
- **MAX_FILE_SIZE**: Maximum upload file size (default: 100MB)
- **ALLOWED_FILE_TYPES**: Permitted file extensions for uploads

### Database Configuration

The system uses Supabase with the following key features:
- **Row Level Security**: Automatic data access control
- **Real-time subscriptions**: For live updates
- **File storage**: For course materials and recordings
- **Edge functions**: For serverless operations

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Add tests** for new functionality
5. **Run tests**: `pytest`
6. **Commit changes**: `git commit -m 'Add amazing feature'`
7. **Push to branch**: `git push origin feature/amazing-feature`
8. **Open a Pull Request**

### Code Standards

- **PEP 8**: Follow Python style guidelines
- **Type Hints**: Use type annotations
- **Docstrings**: Document all functions and classes
- **Tests**: Write tests for new features
- **Security**: Follow security best practices

### Database Changes

1. Create new migration file in `supabase/migrations/`
2. Use descriptive names: `002_add_feature_name.sql`
3. Include rollback instructions in comments
4. Test migrations on development database first

## 📞 Support

### Getting Help

- **Documentation**: Check the API docs at `/docs`
- **Issues**: Create GitHub issues for bugs
- **Discussions**: Use GitHub discussions for questions
- **Email**: Contact `dev@university.cm` for urgent issues

### Common Issues

1. **Database Connection**: Verify Supabase credentials
2. **Authentication**: Check JWT secret key configuration
3. **CORS Errors**: Verify allowed origins in settings
4. **File Uploads**: Check file size and type restrictions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🙏 Acknowledgments

- **FastAPI**: For the excellent web framework
- **Supabase**: For the powerful backend-as-a-service
- **Jitsi Meet**: For video conferencing capabilities
- **COUMANO Team**: For the vision and requirements

---

**COUMANO Backend** - Empowering Cameroonian Universities with Digital Excellence 🇨🇲
from typing import List, Optional, Dict, Any
from datetime import datetime
from fastapi import HTTPException, status
from app.database import get_database
from app.models.virtual_classroom import (
    VirtualClassroomCreate, VirtualClassroomUpdate, VirtualClassroomResponse,
    SessionStatus, AttendanceRecord, SessionRecordingRequest
)
from app.models.user import UserResponse
import uuid
import hashlib

class VirtualClassroomService:
    def __init__(self):
        self.db = get_database()
    
    def generate_room_id(self, course_code: str, title: str) -> str:
        """Generate unique Jitsi room ID"""
        timestamp = datetime.now().strftime("%Y%m%d%H%M")
        content = f"{course_code}-{title}-{timestamp}"
        # Create URL-safe room ID
        room_id = content.lower().replace(" ", "-").replace("_", "-")
        # Remove special characters
        room_id = ''.join(c for c in room_id if c.isalnum() or c == '-')
        return room_id[:50]  # Limit length
    
    async def create_session(self, session_data: VirtualClassroomCreate, created_by: str) -> VirtualClassroomResponse:
        """Create a new virtual classroom session"""
        try:
            # Get course information
            course_result = self.db.supabase.table('courses').select('*').eq('id', session_data.course_id).execute()
            if not course_result.data:
                raise HTTPException(status_code=404, detail="Course not found")
            
            course = course_result.data[0]
            
            # Generate unique room ID
            room_id = self.generate_room_id(course['code'], session_data.title)
            
            # Create session in database
            session_dict = {
                'id': str(uuid.uuid4()),
                'title': session_data.title,
                'course_id': session_data.course_id,
                'instructor_id': session_data.instructor_id,
                'description': session_data.description,
                'scheduled_start': session_data.scheduled_start.isoformat(),
                'scheduled_end': session_data.scheduled_end.isoformat(),
                'max_participants': session_data.max_participants,
                'target_specialties': session_data.target_specialties,
                'target_level': session_data.target_level,
                'auto_attendance_enabled': session_data.auto_attendance_enabled,
                'notifications_enabled': session_data.notifications_enabled,
                'transcription_enabled': session_data.transcription_enabled,
                'subtitles_enabled': session_data.subtitles_enabled,
                'jitsi_room_id': room_id,
                'status': SessionStatus.SCHEDULED,
                'participants': 0,
                'is_recording': False,
                'created_by': created_by,
                'created_at': datetime.utcnow().isoformat(),
                'updated_at': datetime.utcnow().isoformat()
            }
            
            result = self.db.supabase.table('virtual_classrooms').insert(session_dict).execute()
            
            if not result.data:
                raise HTTPException(status_code=500, detail="Failed to create session")
            
            return await self.get_session(result.data[0]['id'])
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error creating session: {str(e)}")
    
    async def get_session(self, session_id: str) -> VirtualClassroomResponse:
        """Get session by ID with related data"""
        try:
            # Get session with course and instructor data
            result = self.db.supabase.table('virtual_classrooms').select('''
                *,
                courses:course_id(*),
                instructors:instructor_id(*)
            ''').eq('id', session_id).execute()
            
            if not result.data:
                raise HTTPException(status_code=404, detail="Session not found")
            
            session_data = result.data[0]
            
            return VirtualClassroomResponse(
                id=session_data['id'],
                title=session_data['title'],
                course_id=session_data['course_id'],
                instructor_id=session_data['instructor_id'],
                description=session_data.get('description'),
                scheduled_start=session_data['scheduled_start'],
                scheduled_end=session_data['scheduled_end'],
                max_participants=session_data['max_participants'],
                target_specialties=session_data.get('target_specialties', []),
                target_level=session_data.get('target_level'),
                auto_attendance_enabled=session_data['auto_attendance_enabled'],
                notifications_enabled=session_data['notifications_enabled'],
                transcription_enabled=session_data['transcription_enabled'],
                subtitles_enabled=session_data['subtitles_enabled'],
                jitsi_room_id=session_data['jitsi_room_id'],
                status=session_data['status'],
                actual_start=session_data.get('actual_start'),
                actual_end=session_data.get('actual_end'),
                participants=session_data['participants'],
                is_recording=session_data['is_recording'],
                recording_id=session_data.get('recording_id'),
                created_by=session_data['created_by'],
                created_at=session_data['created_at'],
                updated_at=session_data['updated_at'],
                course=session_data.get('courses'),
                instructor=session_data.get('instructors')
            )
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error fetching session: {str(e)}")
    
    async def get_sessions(self, 
                          user: UserResponse,
                          status: Optional[str] = None,
                          course_id: Optional[str] = None,
                          limit: int = 50,
                          offset: int = 0) -> List[VirtualClassroomResponse]:
        """Get sessions based on user role and filters"""
        try:
            query = self.db.supabase.table('virtual_classrooms').select('''
                *,
                courses:course_id(*),
                instructors:instructor_id(*)
            ''')
            
            # Apply role-based filtering
            if user.role == "student":
                # Students see sessions for their specialty and level
                if user.specialty:
                    query = query.contains('target_specialties', [user.specialty])
                if user.level:
                    query = query.eq('target_level', user.level)
            elif user.role == "lecturer":
                # Lecturers see all sessions but can only manage their own
                pass  # No additional filtering for lecturers
            # Admins see all sessions
            
            # Apply additional filters
            if status:
                query = query.eq('status', status)
            if course_id:
                query = query.eq('course_id', course_id)
            
            # Apply pagination
            query = query.range(offset, offset + limit - 1)
            query = query.order('scheduled_start', desc=True)
            
            result = query.execute()
            
            sessions = []
            for session_data in result.data:
                sessions.append(VirtualClassroomResponse(
                    id=session_data['id'],
                    title=session_data['title'],
                    course_id=session_data['course_id'],
                    instructor_id=session_data['instructor_id'],
                    description=session_data.get('description'),
                    scheduled_start=session_data['scheduled_start'],
                    scheduled_end=session_data['scheduled_end'],
                    max_participants=session_data['max_participants'],
                    target_specialties=session_data.get('target_specialties', []),
                    target_level=session_data.get('target_level'),
                    auto_attendance_enabled=session_data['auto_attendance_enabled'],
                    notifications_enabled=session_data['notifications_enabled'],
                    transcription_enabled=session_data['transcription_enabled'],
                    subtitles_enabled=session_data['subtitles_enabled'],
                    jitsi_room_id=session_data['jitsi_room_id'],
                    status=session_data['status'],
                    actual_start=session_data.get('actual_start'),
                    actual_end=session_data.get('actual_end'),
                    participants=session_data['participants'],
                    is_recording=session_data['is_recording'],
                    recording_id=session_data.get('recording_id'),
                    created_by=session_data['created_by'],
                    created_at=session_data['created_at'],
                    updated_at=session_data['updated_at'],
                    course=session_data.get('courses'),
                    instructor=session_data.get('instructors')
                ))
            
            return sessions
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error fetching sessions: {str(e)}")
    
    async def join_session(self, session_id: str, user_id: str, device_info: Optional[Dict] = None) -> Dict[str, Any]:
        """Handle user joining a session"""
        try:
            # Get session
            session = await self.get_session(session_id)
            
            # Update session status if it's the first participant
            if session.participants == 0 and session.status == SessionStatus.SCHEDULED:
                self.db.supabase.table('virtual_classrooms').update({
                    'status': SessionStatus.LIVE,
                    'actual_start': datetime.utcnow().isoformat(),
                    'updated_at': datetime.utcnow().isoformat()
                }).eq('id', session_id).execute()
            
            # Record attendance
            attendance_record = {
                'id': str(uuid.uuid4()),
                'session_id': session_id,
                'user_id': user_id,
                'connect_time': datetime.utcnow().isoformat(),
                'ip_address': device_info.get('ip_address') if device_info else None,
                'device': device_info.get('device') if device_info else None,
                'location': device_info.get('location') if device_info else None,
                'status': 'present',
                'created_at': datetime.utcnow().isoformat()
            }
            
            self.db.supabase.table('attendance_records').insert(attendance_record).execute()
            
            # Update participant count
            self.db.supabase.table('virtual_classrooms').update({
                'participants': session.participants + 1,
                'updated_at': datetime.utcnow().isoformat()
            }).eq('id', session_id).execute()
            
            return {
                'session_id': session_id,
                'jitsi_room_id': session.jitsi_room_id,
                'status': 'joined',
                'participant_count': session.participants + 1
            }
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error joining session: {str(e)}")
    
    async def leave_session(self, session_id: str, user_id: str) -> Dict[str, Any]:
        """Handle user leaving a session"""
        try:
            # Update attendance record
            self.db.supabase.table('attendance_records').update({
                'disconnect_time': datetime.utcnow().isoformat(),
                'updated_at': datetime.utcnow().isoformat()
            }).eq('session_id', session_id).eq('user_id', user_id).is_('disconnect_time', 'null').execute()
            
            # Get current session
            session = await self.get_session(session_id)
            
            # Update participant count
            new_count = max(0, session.participants - 1)
            update_data = {
                'participants': new_count,
                'updated_at': datetime.utcnow().isoformat()
            }
            
            # End session if no participants left
            if new_count == 0 and session.status == SessionStatus.LIVE:
                update_data.update({
                    'status': SessionStatus.ENDED,
                    'actual_end': datetime.utcnow().isoformat()
                })
            
            self.db.supabase.table('virtual_classrooms').update(update_data).eq('id', session_id).execute()
            
            return {
                'session_id': session_id,
                'status': 'left',
                'participant_count': new_count
            }
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error leaving session: {str(e)}")
    
    async def start_recording(self, session_id: str, recording_request: SessionRecordingRequest) -> Dict[str, Any]:
        """Start recording a session"""
        try:
            recording_id = str(uuid.uuid4())
            
            # Update session with recording info
            self.db.supabase.table('virtual_classrooms').update({
                'is_recording': True,
                'recording_id': recording_id,
                'updated_at': datetime.utcnow().isoformat()
            }).eq('id', session_id).execute()
            
            # Create recording record
            recording_record = {
                'id': recording_id,
                'session_id': session_id,
                'quality': recording_request.quality,
                'auto_transcribe': recording_request.auto_transcribe,
                'generate_summary': recording_request.generate_summary,
                'status': 'recording',
                'started_at': datetime.utcnow().isoformat(),
                'created_at': datetime.utcnow().isoformat()
            }
            
            self.db.supabase.table('session_recordings').insert(recording_record).execute()
            
            return {
                'recording_id': recording_id,
                'status': 'started',
                'quality': recording_request.quality
            }
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error starting recording: {str(e)}")
    
    async def stop_recording(self, session_id: str) -> Dict[str, Any]:
        """Stop recording a session"""
        try:
            # Get current recording
            recording_result = self.db.supabase.table('session_recordings').select('*').eq('session_id', session_id).eq('status', 'recording').execute()
            
            if not recording_result.data:
                raise HTTPException(status_code=404, detail="No active recording found")
            
            recording = recording_result.data[0]
            
            # Update recording status
            self.db.supabase.table('session_recordings').update({
                'status': 'completed',
                'ended_at': datetime.utcnow().isoformat(),
                'updated_at': datetime.utcnow().isoformat()
            }).eq('id', recording['id']).execute()
            
            # Update session
            self.db.supabase.table('virtual_classrooms').update({
                'is_recording': False,
                'updated_at': datetime.utcnow().isoformat()
            }).eq('id', session_id).execute()
            
            return {
                'recording_id': recording['id'],
                'status': 'stopped'
            }
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error stopping recording: {str(e)}")

virtual_classroom_service = VirtualClassroomService()
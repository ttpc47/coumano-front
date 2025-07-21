from pydantic import BaseModel, validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

class SessionStatus(str, Enum):
    SCHEDULED = "scheduled"
    LIVE = "live"
    ENDED = "ended"
    CANCELLED = "cancelled"

class VirtualClassroomBase(BaseModel):
    title: str
    course_id: str
    instructor_id: str
    description: Optional[str] = None
    scheduled_start: datetime
    scheduled_end: datetime
    max_participants: int = 100
    target_specialties: List[str] = []
    target_level: Optional[int] = None
    auto_attendance_enabled: bool = True
    notifications_enabled: bool = True
    transcription_enabled: bool = True
    subtitles_enabled: bool = True

class VirtualClassroomCreate(VirtualClassroomBase):
    pass

class VirtualClassroomUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    scheduled_start: Optional[datetime] = None
    scheduled_end: Optional[datetime] = None
    max_participants: Optional[int] = None
    target_specialties: Optional[List[str]] = None
    target_level: Optional[int] = None
    auto_attendance_enabled: Optional[bool] = None
    notifications_enabled: Optional[bool] = None
    transcription_enabled: Optional[bool] = None
    subtitles_enabled: Optional[bool] = None

class VirtualClassroomResponse(VirtualClassroomBase):
    id: str
    jitsi_room_id: str
    status: SessionStatus
    actual_start: Optional[datetime] = None
    actual_end: Optional[datetime] = None
    participants: int = 0
    is_recording: bool = False
    recording_id: Optional[str] = None
    created_by: str
    created_at: datetime
    updated_at: datetime
    
    # Related data
    course: Optional[Dict[str, Any]] = None
    instructor: Optional[Dict[str, Any]] = None

class SessionJoinRequest(BaseModel):
    device_info: Optional[Dict[str, Any]] = None

class SessionRecordingRequest(BaseModel):
    quality: str = "HD"  # HD, SD, Audio Only
    auto_transcribe: bool = True
    generate_summary: bool = True

class AttendanceRecord(BaseModel):
    user_id: str
    connect_time: datetime
    disconnect_time: Optional[datetime] = None
    ip_address: Optional[str] = None
    device: Optional[str] = None
    location: Optional[str] = None
    total_duration: int = 0  # minutes
    status: str = "present"  # present, absent, late, left_early

class TranscriptionSegment(BaseModel):
    start_time: float
    end_time: float
    speaker: str
    text: str
    confidence: float
    language: str = "en"

class SessionRecording(BaseModel):
    id: str
    session_id: str
    title: str
    file_url: str
    thumbnail_url: Optional[str] = None
    duration: int  # seconds
    size: int  # bytes
    quality: str
    transcription_status: str = "pending"
    transcription_url: Optional[str] = None
    created_at: datetime
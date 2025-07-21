from pydantic import BaseModel, validator
from typing import Optional, List
from datetime import datetime, time
from enum import Enum

class SessionType(str, Enum):
    LECTURE = "lecture"
    PRACTICAL = "practical"
    TUTORIAL = "tutorial"

class CourseScheduleBase(BaseModel):
    day: str
    start_time: time
    end_time: time
    room: str
    type: SessionType

class CourseScheduleCreate(CourseScheduleBase):
    pass

class CourseScheduleUpdate(BaseModel):
    day: Optional[str] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    room: Optional[str] = None
    type: Optional[SessionType] = None

class CourseScheduleResponse(CourseScheduleBase):
    id: str
    course_id: str
    created_at: datetime
    updated_at: datetime

class CourseMaterialBase(BaseModel):
    title: str
    type: str
    url: str
    size: Optional[str] = None

class CourseMaterialCreate(CourseMaterialBase):
    pass

class CourseMaterialResponse(CourseMaterialBase):
    id: str
    course_id: str
    uploaded_at: datetime

class CourseBase(BaseModel):
    name: str
    code: str
    credits: int
    description: Optional[str] = None
    is_shared: bool = False
    target_level: Optional[int] = None

class CourseCreate(CourseBase):
    lecturer_id: str
    specialties: List[str]

class CourseUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    credits: Optional[int] = None
    description: Optional[str] = None
    is_shared: Optional[bool] = None
    target_level: Optional[int] = None
    lecturer_id: Optional[str] = None
    specialties: Optional[List[str]] = None

class CourseResponse(CourseBase):
    id: str
    lecturer_id: str
    lecturer: Optional[dict] = None
    specialties: List[str]
    schedule: List[CourseScheduleResponse] = []
    materials: List[CourseMaterialResponse] = []
    created_at: datetime
    updated_at: datetime

class ScheduleConflict(BaseModel):
    type: str  # 'room', 'lecturer', 'time'
    severity: str  # 'high', 'medium', 'low'
    conflicting_schedules: List[dict]
    suggested_solutions: List[dict]
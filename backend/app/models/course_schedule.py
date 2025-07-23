from pydantic import BaseModel, validator
from typing import Optional, List, Dict, Any
from datetime import datetime, time
from enum import Enum

class SessionType(str, Enum):
    LECTURE = "lecture"
    PRACTICAL = "practical"
    TUTORIAL = "tutorial"
    EXAM = "exam"

class ScheduleStatus(str, Enum):
    SCHEDULED = "scheduled"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class DayOfWeek(str, Enum):
    MONDAY = "Monday"
    TUESDAY = "Tuesday"
    WEDNESDAY = "Wednesday"
    THURSDAY = "Thursday"
    FRIDAY = "Friday"
    SATURDAY = "Saturday"
    SUNDAY = "Sunday"

class RecurrenceType(str, Enum):
    WEEKLY = "weekly"
    BIWEEKLY = "biweekly"
    MONTHLY = "monthly"

class CourseScheduleBase(BaseModel):
    course_id: str
    day: DayOfWeek
    start_time: time
    end_time: time
    room: str
    building: Optional[str] = None
    type: SessionType
    capacity: Optional[int] = None
    notes: Optional[str] = None

    @validator('end_time')
    def end_time_after_start_time(cls, v, values):
        if 'start_time' in values and v <= values['start_time']:
            raise ValueError('End time must be after start time')
        return v

class CourseScheduleCreate(CourseScheduleBase):
    is_recurring: bool = False
    recurrence_pattern: Optional[Dict[str, Any]] = None

class CourseScheduleUpdate(BaseModel):
    day: Optional[DayOfWeek] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    room: Optional[str] = None
    building: Optional[str] = None
    type: Optional[SessionType] = None
    status: Optional[ScheduleStatus] = None
    capacity: Optional[int] = None
    notes: Optional[str] = None

    @validator('end_time')
    def end_time_after_start_time(cls, v, values):
        if 'start_time' in values and v and values['start_time'] and v <= values['start_time']:
            raise ValueError('End time must be after start time')
        return v

class CourseScheduleResponse(CourseScheduleBase):
    id: str
    lecturer_id: str
    lecturer_name: Optional[str] = None
    course_name: Optional[str] = None
    course_code: Optional[str] = None
    status: ScheduleStatus = ScheduleStatus.SCHEDULED
    enrolled_count: Optional[int] = 0
    is_recurring: bool = False
    recurrence_pattern: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: datetime

class ScheduleConflictCheck(BaseModel):
    course_id: str
    day: DayOfWeek
    start_time: time
    end_time: time
    room: str
    building: Optional[str] = None
    exclude_id: Optional[str] = None

class ConflictType(str, Enum):
    ROOM = "room"
    LECTURER = "lecturer"
    TIME = "time"

class ConflictSeverity(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"

class SuggestedSolution(BaseModel):
    id: str
    type: str
    description: str
    new_room: Optional[str] = None
    new_start_time: Optional[time] = None
    new_end_time: Optional[time] = None
    impact: str

class ScheduleConflict(BaseModel):
    type: ConflictType
    severity: ConflictSeverity
    conflicting_schedules: List[Dict[str, Any]]
    suggested_solutions: List[SuggestedSolution]

class RoomAvailability(BaseModel):
    room: str
    building: str
    is_available: bool
    conflicting_schedules: List[Dict[str, Any]]

class ScheduleOptimizationRequest(BaseModel):
    preferred_days: Optional[List[DayOfWeek]] = []
    preferred_times: Optional[List[str]] = []
    room_preferences: Optional[List[str]] = []
    avoid_conflicts: bool = True
    optimize_for: str = "efficiency"  # efficiency, convenience, balance

class BulkScheduleCreate(BaseModel):
    schedules: List[CourseScheduleCreate]

class ScheduleTemplate(BaseModel):
    id: str
    name: str
    description: str
    schedule_pattern: Dict[str, Any]
    created_at: datetime

class ScheduleStats(BaseModel):
    total_schedules: int
    schedules_this_week: int
    room_utilization: List[Dict[str, Any]]
    lecturer_workload: List[Dict[str, Any]]
    peak_hours: List[Dict[str, Any]]
    conflict_count: int

class OptimalScheduleSuggestion(BaseModel):
    course_id: str
    suggested_schedules: List[CourseScheduleCreate]
    optimization_score: float
    reasoning: str
    conflicts_avoided: int
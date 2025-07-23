from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File
from typing import List, Optional, Dict, Any
from datetime import datetime, time
from app.models.course_schedule import (
    CourseScheduleCreate, CourseScheduleUpdate, CourseScheduleResponse,
    ScheduleConflictCheck, ScheduleOptimizationRequest, BulkScheduleCreate
)
from app.models.user import UserResponse
from app.services.course_schedule_service import course_schedule_service
from app.api.auth import get_current_user

router = APIRouter(prefix="/course-schedules", tags=["course schedules"])

@router.post("", response_model=CourseScheduleResponse)
async def create_schedule(
    schedule_data: CourseScheduleCreate,
    current_user: UserResponse = Depends(get_current_user)
):
    """Create a new course schedule"""
    # Check permissions
    if current_user.role not in ["admin", "lecturer"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators and lecturers can create schedules"
        )
    
    return await course_schedule_service.create_schedule(schedule_data, current_user.id)

@router.get("", response_model=List[CourseScheduleResponse])
async def get_schedules(
    current_user: UserResponse = Depends(get_current_user),
    course_id: Optional[str] = Query(None),
    lecturer_id: Optional[str] = Query(None),
    day: Optional[str] = Query(None),
    room: Optional[str] = Query(None),
    building: Optional[str] = Query(None),
    type: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    date_from: Optional[str] = Query(None),
    date_to: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0)
):
    """Get course schedules with filters"""
    filters = {
        "course_id": course_id,
        "lecturer_id": lecturer_id,
        "day": day,
        "room": room,
        "building": building,
        "type": type,
        "status": status,
        "date_from": date_from,
        "date_to": date_to,
        "limit": limit,
        "offset": offset
    }
    
    return await course_schedule_service.get_schedules(current_user, filters)

@router.get("/{schedule_id}", response_model=CourseScheduleResponse)
async def get_schedule(
    schedule_id: str,
    current_user: UserResponse = Depends(get_current_user)
):
    """Get a specific schedule"""
    return await course_schedule_service.get_schedule(schedule_id)

@router.patch("/{schedule_id}", response_model=CourseScheduleResponse)
async def update_schedule(
    schedule_id: str,
    schedule_data: CourseScheduleUpdate,
    current_user: UserResponse = Depends(get_current_user)
):
    """Update a course schedule"""
    # Check permissions
    schedule = await course_schedule_service.get_schedule(schedule_id)
    
    if (current_user.role != "admin" and 
        current_user.id != schedule.lecturer_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators and course lecturers can update schedules"
        )
    
    return await course_schedule_service.update_schedule(schedule_id, schedule_data)

@router.delete("/{schedule_id}")
async def delete_schedule(
    schedule_id: str,
    current_user: UserResponse = Depends(get_current_user)
):
    """Delete a course schedule"""
    # Check permissions
    schedule = await course_schedule_service.get_schedule(schedule_id)
    
    if (current_user.role != "admin" and 
        current_user.id != schedule.lecturer_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators and course lecturers can delete schedules"
        )
    
    return await course_schedule_service.delete_schedule(schedule_id)

@router.post("/check-conflicts")
async def check_conflicts(
    conflict_check: ScheduleConflictCheck,
    current_user: UserResponse = Depends(get_current_user)
):
    """Check for schedule conflicts"""
    return await course_schedule_service.check_conflicts(conflict_check)

@router.get("/room-availability")
async def check_room_availability(
    room: str = Query(...),
    building: str = Query(None),
    day: str = Query(...),
    start_time: str = Query(...),
    end_time: str = Query(...),
    current_user: UserResponse = Depends(get_current_user)
):
    """Check room availability for a specific time slot"""
    return await course_schedule_service.check_room_availability(
        room, building, day, start_time, end_time
    )

@router.get("/available-rooms")
async def get_available_rooms(
    day: str = Query(...),
    start_time: str = Query(...),
    end_time: str = Query(...),
    building: Optional[str] = Query(None),
    current_user: UserResponse = Depends(get_current_user)
):
    """Get available rooms for a time slot"""
    return await course_schedule_service.get_available_rooms(
        day, start_time, end_time, building
    )

@router.get("/lecturer/{lecturer_id}")
async def get_lecturer_schedule(
    lecturer_id: str,
    date_from: Optional[str] = Query(None),
    date_to: Optional[str] = Query(None),
    current_user: UserResponse = Depends(get_current_user)
):
    """Get lecturer's schedule"""
    return await course_schedule_service.get_lecturer_schedule(
        lecturer_id, date_from, date_to
    )

@router.get("/course/{course_id}")
async def get_course_schedules(
    course_id: str,
    current_user: UserResponse = Depends(get_current_user)
):
    """Get all schedules for a course"""
    return await course_schedule_service.get_course_schedules(course_id)

@router.post("/bulk")
async def bulk_create_schedules(
    bulk_data: BulkScheduleCreate,
    current_user: UserResponse = Depends(get_current_user)
):
    """Create multiple schedules at once"""
    if current_user.role not in ["admin", "lecturer"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators and lecturers can create schedules"
        )
    
    return await course_schedule_service.bulk_create_schedules(bulk_data.schedules, current_user.id)

@router.post("/{schedule_id}/generate-recurring")
async def generate_recurring_schedules(
    schedule_id: str,
    recurrence_pattern: Dict[str, Any],
    current_user: UserResponse = Depends(get_current_user)
):
    """Generate recurring schedules from a base schedule"""
    schedule = await course_schedule_service.get_schedule(schedule_id)
    
    if (current_user.role != "admin" and 
        current_user.id != schedule.lecturer_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators and course lecturers can generate recurring schedules"
        )
    
    return await course_schedule_service.generate_recurring_schedules(
        schedule_id, recurrence_pattern
    )

@router.get("/stats")
async def get_schedule_stats(
    date_from: Optional[str] = Query(None),
    date_to: Optional[str] = Query(None),
    current_user: UserResponse = Depends(get_current_user)
):
    """Get schedule statistics"""
    return await course_schedule_service.get_schedule_stats(date_from, date_to)

@router.get("/export")
async def export_schedules(
    format: str = Query("csv", regex="^(csv|excel|ics)$"),
    course_id: Optional[str] = Query(None),
    lecturer_id: Optional[str] = Query(None),
    date_from: Optional[str] = Query(None),
    date_to: Optional[str] = Query(None),
    current_user: UserResponse = Depends(get_current_user)
):
    """Export schedules in various formats"""
    filters = {
        "course_id": course_id,
        "lecturer_id": lecturer_id,
        "date_from": date_from,
        "date_to": date_to
    }
    
    return await course_schedule_service.export_schedules(filters, format)

@router.post("/import")
async def import_schedules(
    file: UploadFile = File(...),
    current_user: UserResponse = Depends(get_current_user)
):
    """Import schedules from file"""
    if current_user.role not in ["admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can import schedules"
        )
    
    return await course_schedule_service.import_schedules(file, current_user.id)

@router.post("/conflicts/{conflict_id}/resolve")
async def resolve_conflict(
    conflict_id: str,
    solution: Dict[str, Any],
    current_user: UserResponse = Depends(get_current_user)
):
    """Resolve a schedule conflict"""
    if current_user.role not in ["admin", "lecturer"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators and lecturers can resolve conflicts"
        )
    
    return await course_schedule_service.resolve_conflict(conflict_id, solution)

@router.post("/optimize/{course_id}")
async def optimize_schedule(
    course_id: str,
    optimization_request: ScheduleOptimizationRequest,
    current_user: UserResponse = Depends(get_current_user)
):
    """Get optimal schedule suggestions for a course"""
    if current_user.role not in ["admin", "lecturer"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators and lecturers can optimize schedules"
        )
    
    return await course_schedule_service.optimize_schedule(course_id, optimization_request)

@router.post("/validate")
async def validate_schedule(
    schedule_data: CourseScheduleCreate,
    current_user: UserResponse = Depends(get_current_user)
):
    """Validate schedule data"""
    return await course_schedule_service.validate_schedule(schedule_data)

@router.get("/templates")
async def get_schedule_templates(
    current_user: UserResponse = Depends(get_current_user)
):
    """Get available schedule templates"""
    return await course_schedule_service.get_schedule_templates()

@router.post("/from-template")
async def create_from_template(
    template_data: Dict[str, Any],
    current_user: UserResponse = Depends(get_current_user)
):
    """Create schedule from template"""
    if current_user.role not in ["admin", "lecturer"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators and lecturers can create schedules"
        )
    
    return await course_schedule_service.create_from_template(
        template_data["template_id"],
        template_data["course_id"],
        template_data.get("customizations"),
        current_user.id
    )
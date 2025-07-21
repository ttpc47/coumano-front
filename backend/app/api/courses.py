from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
from app.models.course import (
    CourseCreate, CourseUpdate, CourseResponse,
    CourseScheduleCreate, CourseScheduleUpdate, CourseScheduleResponse
)
from app.models.user import UserResponse
from app.services.course_service import course_service
from app.api.auth import get_current_user

router = APIRouter(prefix="/courses", tags=["courses"])

@router.post("", response_model=CourseResponse)
async def create_course(
    course_data: CourseCreate,
    current_user: UserResponse = Depends(get_current_user)
):
    """Create a new course"""
    # Only admins and lecturers can create courses
    if current_user.role not in ["admin", "lecturer"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators and lecturers can create courses"
        )
    
    return await course_service.create_course(course_data, current_user.id)

@router.get("", response_model=List[CourseResponse])
async def get_courses(
    current_user: UserResponse = Depends(get_current_user),
    specialty: Optional[str] = Query(None, description="Filter by specialty"),
    department: Optional[str] = Query(None, description="Filter by department"),
    lecturer_id: Optional[str] = Query(None, description="Filter by lecturer"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0)
):
    """Get courses based on user role and filters"""
    return await course_service.get_courses(
        user=current_user,
        specialty=specialty,
        department=department,
        lecturer_id=lecturer_id,
        limit=limit,
        offset=offset
    )

@router.get("/{course_id}", response_model=CourseResponse)
async def get_course(
    course_id: str,
    current_user: UserResponse = Depends(get_current_user)
):
    """Get a specific course"""
    course = await course_service.get_course(course_id)
    
    # Check if student can access this course
    if current_user.role == "student":
        if current_user.specialty not in course.specialties:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have access to this course"
            )
    
    return course

@router.post("/{course_id}/schedules", response_model=CourseScheduleResponse)
async def add_course_schedule(
    course_id: str,
    schedule_data: CourseScheduleCreate,
    current_user: UserResponse = Depends(get_current_user)
):
    """Add a schedule to a course"""
    # Check permissions
    course = await course_service.get_course(course_id)
    
    if (current_user.role != "admin" and 
        current_user.id != course.lecturer_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators and course lecturers can add schedules"
        )
    
    return await course_service.add_schedule(course_id, schedule_data)

@router.put("/schedules/{schedule_id}", response_model=CourseScheduleResponse)
async def update_course_schedule(
    schedule_id: str,
    schedule_data: CourseScheduleUpdate,
    current_user: UserResponse = Depends(get_current_user)
):
    """Update a course schedule"""
    # Get schedule to check permissions
    schedule_result = course_service.db.supabase.table('course_schedules').select('course_id').eq('id', schedule_id).execute()
    
    if not schedule_result.data:
        raise HTTPException(status_code=404, detail="Schedule not found")
    
    course = await course_service.get_course(schedule_result.data[0]['course_id'])
    
    if (current_user.role != "admin" and 
        current_user.id != course.lecturer_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators and course lecturers can update schedules"
        )
    
    return await course_service.update_schedule(schedule_id, schedule_data)

@router.delete("/schedules/{schedule_id}")
async def delete_course_schedule(
    schedule_id: str,
    current_user: UserResponse = Depends(get_current_user)
):
    """Delete a course schedule"""
    # Get schedule to check permissions
    schedule_result = course_service.db.supabase.table('course_schedules').select('course_id').eq('id', schedule_id).execute()
    
    if not schedule_result.data:
        raise HTTPException(status_code=404, detail="Schedule not found")
    
    course = await course_service.get_course(schedule_result.data[0]['course_id'])
    
    if (current_user.role != "admin" and 
        current_user.id != course.lecturer_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators and course lecturers can delete schedules"
        )
    
    return await course_service.delete_schedule(schedule_id)

@router.post("/{course_id}/schedules/check-conflicts")
async def check_schedule_conflicts(
    course_id: str,
    schedule_data: CourseScheduleCreate,
    current_user: UserResponse = Depends(get_current_user)
):
    """Check for schedule conflicts"""
    return await course_service.check_schedule_conflicts(course_id, schedule_data)
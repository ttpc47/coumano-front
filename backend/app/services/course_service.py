from typing import List, Optional, Dict, Any
from datetime import datetime, time
from fastapi import HTTPException, status
from app.database import get_database
from app.models.course import (
    CourseCreate, CourseUpdate, CourseResponse,
    CourseScheduleCreate, CourseScheduleUpdate, CourseScheduleResponse,
    ScheduleConflict
)
from app.models.user import UserResponse
import uuid

class CourseService:
    def __init__(self):
        self.db = get_database()
    
    async def create_course(self, course_data: CourseCreate, created_by: str) -> CourseResponse:
        """Create a new course"""
        try:
            course_dict = {
                'id': str(uuid.uuid4()),
                'name': course_data.name,
                'code': course_data.code,
                'credits': course_data.credits,
                'description': course_data.description,
                'is_shared': course_data.is_shared,
                'target_level': course_data.target_level,
                'lecturer_id': course_data.lecturer_id,
                'specialties': course_data.specialties,
                'created_by': created_by,
                'created_at': datetime.utcnow().isoformat(),
                'updated_at': datetime.utcnow().isoformat()
            }
            
            result = self.db.supabase.table('courses').insert(course_dict).execute()
            
            if not result.data:
                raise HTTPException(status_code=500, detail="Failed to create course")
            
            return await self.get_course(result.data[0]['id'])
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error creating course: {str(e)}")
    
    async def get_course(self, course_id: str) -> CourseResponse:
        """Get course by ID with related data"""
        try:
            # Get course with lecturer data
            result = self.db.supabase.table('courses').select('''
                *,
                lecturers:lecturer_id(*)
            ''').eq('id', course_id).execute()
            
            if not result.data:
                raise HTTPException(status_code=404, detail="Course not found")
            
            course_data = result.data[0]
            
            # Get schedules
            schedule_result = self.db.supabase.table('course_schedules').select('*').eq('course_id', course_id).execute()
            schedules = [CourseScheduleResponse(**schedule) for schedule in schedule_result.data]
            
            # Get materials
            materials_result = self.db.supabase.table('course_materials').select('*').eq('course_id', course_id).execute()
            materials = materials_result.data
            
            return CourseResponse(
                id=course_data['id'],
                name=course_data['name'],
                code=course_data['code'],
                credits=course_data['credits'],
                description=course_data.get('description'),
                is_shared=course_data['is_shared'],
                target_level=course_data.get('target_level'),
                lecturer_id=course_data['lecturer_id'],
                lecturer=course_data.get('lecturers'),
                specialties=course_data.get('specialties', []),
                schedule=schedules,
                materials=materials,
                created_at=course_data['created_at'],
                updated_at=course_data['updated_at']
            )
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error fetching course: {str(e)}")
    
    async def get_courses(self, 
                         user: UserResponse,
                         specialty: Optional[str] = None,
                         department: Optional[str] = None,
                         lecturer_id: Optional[str] = None,
                         limit: int = 50,
                         offset: int = 0) -> List[CourseResponse]:
        """Get courses based on user role and filters"""
        try:
            query = self.db.supabase.table('courses').select('''
                *,
                lecturers:lecturer_id(*)
            ''')
            
            # Apply role-based filtering
            if user.role == "student":
                # Students see courses for their specialty
                if user.specialty:
                    query = query.contains('specialties', [user.specialty])
            elif user.role == "lecturer":
                # Lecturers see courses they teach or all if admin privileges
                if not lecturer_id:
                    query = query.eq('lecturer_id', user.id)
            
            # Apply additional filters
            if specialty:
                query = query.contains('specialties', [specialty])
            if lecturer_id:
                query = query.eq('lecturer_id', lecturer_id)
            
            # Apply pagination
            query = query.range(offset, offset + limit - 1)
            query = query.order('name')
            
            result = query.execute()
            
            courses = []
            for course_data in result.data:
                # Get schedules for each course
                schedule_result = self.db.supabase.table('course_schedules').select('*').eq('course_id', course_data['id']).execute()
                schedules = [CourseScheduleResponse(**schedule) for schedule in schedule_result.data]
                
                # Get materials for each course
                materials_result = self.db.supabase.table('course_materials').select('*').eq('course_id', course_data['id']).execute()
                materials = materials_result.data
                
                courses.append(CourseResponse(
                    id=course_data['id'],
                    name=course_data['name'],
                    code=course_data['code'],
                    credits=course_data['credits'],
                    description=course_data.get('description'),
                    is_shared=course_data['is_shared'],
                    target_level=course_data.get('target_level'),
                    lecturer_id=course_data['lecturer_id'],
                    lecturer=course_data.get('lecturers'),
                    specialties=course_data.get('specialties', []),
                    schedule=schedules,
                    materials=materials,
                    created_at=course_data['created_at'],
                    updated_at=course_data['updated_at']
                ))
            
            return courses
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error fetching courses: {str(e)}")
    
    async def add_schedule(self, course_id: str, schedule_data: CourseScheduleCreate) -> CourseScheduleResponse:
        """Add schedule to a course"""
        try:
            # Check for conflicts
            conflicts = await self.check_schedule_conflicts(course_id, schedule_data)
            if conflicts:
                raise HTTPException(
                    status_code=409, 
                    detail=f"Schedule conflict detected: {conflicts[0]['type']}"
                )
            
            schedule_dict = {
                'id': str(uuid.uuid4()),
                'course_id': course_id,
                'day': schedule_data.day,
                'start_time': schedule_data.start_time.isoformat(),
                'end_time': schedule_data.end_time.isoformat(),
                'room': schedule_data.room,
                'type': schedule_data.type,
                'created_at': datetime.utcnow().isoformat(),
                'updated_at': datetime.utcnow().isoformat()
            }
            
            result = self.db.supabase.table('course_schedules').insert(schedule_dict).execute()
            
            if not result.data:
                raise HTTPException(status_code=500, detail="Failed to create schedule")
            
            return CourseScheduleResponse(**result.data[0])
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error adding schedule: {str(e)}")
    
    async def check_schedule_conflicts(self, course_id: str, schedule_data: CourseScheduleCreate, exclude_id: Optional[str] = None) -> List[ScheduleConflict]:
        """Check for scheduling conflicts"""
        try:
            conflicts = []
            
            # Check room conflicts
            room_query = self.db.supabase.table('course_schedules').select('*').eq('day', schedule_data.day).eq('room', schedule_data.room)
            
            if exclude_id:
                room_query = room_query.neq('id', exclude_id)
            
            room_result = room_query.execute()
            
            for existing_schedule in room_result.data:
                existing_start = datetime.strptime(existing_schedule['start_time'], '%H:%M:%S').time()
                existing_end = datetime.strptime(existing_schedule['end_time'], '%H:%M:%S').time()
                
                # Check for time overlap
                if (schedule_data.start_time < existing_end and schedule_data.end_time > existing_start):
                    conflicts.append(ScheduleConflict(
                        type="room",
                        severity="high",
                        conflicting_schedules=[existing_schedule],
                        suggested_solutions=[
                            {
                                "type": "change_room",
                                "description": f"Move to available room",
                                "impact": "low"
                            },
                            {
                                "type": "change_time",
                                "description": f"Reschedule to avoid conflict",
                                "impact": "medium"
                            }
                        ]
                    ))
            
            return conflicts
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error checking conflicts: {str(e)}")
    
    async def update_schedule(self, schedule_id: str, schedule_data: CourseScheduleUpdate) -> CourseScheduleResponse:
        """Update a course schedule"""
        try:
            # Get existing schedule
            existing_result = self.db.supabase.table('course_schedules').select('*').eq('id', schedule_id).execute()
            
            if not existing_result.data:
                raise HTTPException(status_code=404, detail="Schedule not found")
            
            existing_schedule = existing_result.data[0]
            
            # Prepare update data
            update_data = {
                'updated_at': datetime.utcnow().isoformat()
            }
            
            if schedule_data.day is not None:
                update_data['day'] = schedule_data.day
            if schedule_data.start_time is not None:
                update_data['start_time'] = schedule_data.start_time.isoformat()
            if schedule_data.end_time is not None:
                update_data['end_time'] = schedule_data.end_time.isoformat()
            if schedule_data.room is not None:
                update_data['room'] = schedule_data.room
            if schedule_data.type is not None:
                update_data['type'] = schedule_data.type
            
            # Check for conflicts if time/room changed
            if any(key in update_data for key in ['day', 'start_time', 'end_time', 'room']):
                # Create temporary schedule data for conflict checking
                temp_schedule = CourseScheduleCreate(
                    day=update_data.get('day', existing_schedule['day']),
                    start_time=datetime.strptime(update_data.get('start_time', existing_schedule['start_time']), '%H:%M:%S').time(),
                    end_time=datetime.strptime(update_data.get('end_time', existing_schedule['end_time']), '%H:%M:%S').time(),
                    room=update_data.get('room', existing_schedule['room']),
                    type=update_data.get('type', existing_schedule['type'])
                )
                
                conflicts = await self.check_schedule_conflicts(existing_schedule['course_id'], temp_schedule, schedule_id)
                if conflicts:
                    raise HTTPException(
                        status_code=409,
                        detail=f"Schedule conflict detected: {conflicts[0]['type']}"
                    )
            
            # Update schedule
            result = self.db.supabase.table('course_schedules').update(update_data).eq('id', schedule_id).execute()
            
            if not result.data:
                raise HTTPException(status_code=500, detail="Failed to update schedule")
            
            return CourseScheduleResponse(**result.data[0])
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error updating schedule: {str(e)}")
    
    async def delete_schedule(self, schedule_id: str) -> Dict[str, str]:
        """Delete a course schedule"""
        try:
            result = self.db.supabase.table('course_schedules').delete().eq('id', schedule_id).execute()
            
            if not result.data:
                raise HTTPException(status_code=404, detail="Schedule not found")
            
            return {"message": "Schedule deleted successfully"}
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error deleting schedule: {str(e)}")

course_service = CourseService()
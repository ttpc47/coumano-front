from typing import List, Optional, Dict, Any
from datetime import datetime, time, timedelta
from fastapi import HTTPException, status, UploadFile
from app.database import get_database
from app.models.course_schedule import (
    CourseScheduleCreate, CourseScheduleUpdate, CourseScheduleResponse,
    ScheduleConflictCheck, ScheduleConflict, RoomAvailability,
    ScheduleOptimizationRequest, ScheduleStats, OptimalScheduleSuggestion
)
from app.models.user import UserResponse
import uuid
import csv
import io
import pandas as pd

class CourseScheduleService:
    def __init__(self):
        self.db = get_database()
    
    async def create_schedule(self, schedule_data: CourseScheduleCreate, created_by: str) -> CourseScheduleResponse:
        """Create a new course schedule"""
        try:
            # Check for conflicts first
            conflict_check = ScheduleConflictCheck(
                course_id=schedule_data.course_id,
                day=schedule_data.day,
                start_time=schedule_data.start_time,
                end_time=schedule_data.end_time,
                room=schedule_data.room,
                building=schedule_data.building
            )
            
            conflicts = await self.check_conflicts(conflict_check)
            if conflicts and len(conflicts) > 0:
                # Log conflicts but allow creation (can be overridden)
                print(f"Warning: Creating schedule with {len(conflicts)} conflicts")
            
            schedule_dict = {
                'id': str(uuid.uuid4()),
                'course_id': schedule_data.course_id,
                'day': schedule_data.day,
                'start_time': schedule_data.start_time.isoformat(),
                'end_time': schedule_data.end_time.isoformat(),
                'room': schedule_data.room,
                'building': schedule_data.building,
                'type': schedule_data.type,
                'capacity': schedule_data.capacity,
                'notes': schedule_data.notes,
                'status': 'scheduled',
                'is_recurring': schedule_data.is_recurring,
                'recurrence_pattern': schedule_data.recurrence_pattern,
                'created_by': created_by,
                'created_at': datetime.utcnow().isoformat(),
                'updated_at': datetime.utcnow().isoformat()
            }
            
            result = self.db.supabase.table('course_schedules').insert(schedule_dict).execute()
            
            if not result.data:
                raise HTTPException(status_code=500, detail="Failed to create schedule")
            
            return await self.get_schedule(result.data[0]['id'])
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error creating schedule: {str(e)}")
    
    async def get_schedule(self, schedule_id: str) -> CourseScheduleResponse:
        """Get schedule by ID with related data"""
        try:
            result = self.db.supabase.table('course_schedules').select('''
                *,
                courses:course_id(name, code, lecturer_id),
                lecturers:courses(lecturer_id)
            ''').eq('id', schedule_id).execute()
            
            if not result.data:
                raise HTTPException(status_code=404, detail="Schedule not found")
            
            schedule_data = result.data[0]
            
            return CourseScheduleResponse(
                id=schedule_data['id'],
                course_id=schedule_data['course_id'],
                day=schedule_data['day'],
                start_time=schedule_data['start_time'],
                end_time=schedule_data['end_time'],
                room=schedule_data['room'],
                building=schedule_data.get('building'),
                type=schedule_data['type'],
                capacity=schedule_data.get('capacity'),
                notes=schedule_data.get('notes'),
                status=schedule_data.get('status', 'scheduled'),
                lecturer_id=schedule_data.get('courses', {}).get('lecturer_id', ''),
                lecturer_name=schedule_data.get('lecturer_name'),
                course_name=schedule_data.get('courses', {}).get('name'),
                course_code=schedule_data.get('courses', {}).get('code'),
                enrolled_count=schedule_data.get('enrolled_count', 0),
                is_recurring=schedule_data.get('is_recurring', False),
                recurrence_pattern=schedule_data.get('recurrence_pattern'),
                created_at=schedule_data['created_at'],
                updated_at=schedule_data['updated_at']
            )
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error fetching schedule: {str(e)}")
    
    async def get_schedules(self, user: UserResponse, filters: Dict[str, Any]) -> List[CourseScheduleResponse]:
        """Get schedules with filters based on user role"""
        try:
            query = self.db.supabase.table('course_schedules').select('''
                *,
                courses:course_id(name, code, lecturer_id),
                lecturers:courses(lecturer_id)
            ''')
            
            # Apply role-based filtering
            if user.role == "lecturer":
                # Lecturers see only their schedules
                query = query.eq('courses.lecturer_id', user.id)
            elif user.role == "student":
                # Students see schedules for their courses
                # This would need to be implemented based on enrollment
                pass
            
            # Apply filters
            if filters.get('course_id'):
                query = query.eq('course_id', filters['course_id'])
            if filters.get('lecturer_id'):
                query = query.eq('courses.lecturer_id', filters['lecturer_id'])
            if filters.get('day'):
                query = query.eq('day', filters['day'])
            if filters.get('room'):
                query = query.eq('room', filters['room'])
            if filters.get('building'):
                query = query.eq('building', filters['building'])
            if filters.get('type'):
                query = query.eq('type', filters['type'])
            if filters.get('status'):
                query = query.eq('status', filters['status'])
            
            # Apply pagination
            limit = filters.get('limit', 50)
            offset = filters.get('offset', 0)
            query = query.range(offset, offset + limit - 1)
            query = query.order('day, start_time')
            
            result = query.execute()
            
            schedules = []
            for schedule_data in result.data:
                schedules.append(CourseScheduleResponse(
                    id=schedule_data['id'],
                    course_id=schedule_data['course_id'],
                    day=schedule_data['day'],
                    start_time=schedule_data['start_time'],
                    end_time=schedule_data['end_time'],
                    room=schedule_data['room'],
                    building=schedule_data.get('building'),
                    type=schedule_data['type'],
                    capacity=schedule_data.get('capacity'),
                    notes=schedule_data.get('notes'),
                    status=schedule_data.get('status', 'scheduled'),
                    lecturer_id=schedule_data.get('courses', {}).get('lecturer_id', ''),
                    course_name=schedule_data.get('courses', {}).get('name'),
                    course_code=schedule_data.get('courses', {}).get('code'),
                    enrolled_count=schedule_data.get('enrolled_count', 0),
                    is_recurring=schedule_data.get('is_recurring', False),
                    recurrence_pattern=schedule_data.get('recurrence_pattern'),
                    created_at=schedule_data['created_at'],
                    updated_at=schedule_data['updated_at']
                ))
            
            return schedules
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error fetching schedules: {str(e)}")
    
    async def update_schedule(self, schedule_id: str, schedule_data: CourseScheduleUpdate) -> CourseScheduleResponse:
        """Update a course schedule"""
        try:
            # Get existing schedule
            existing = await self.get_schedule(schedule_id)
            
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
            if schedule_data.building is not None:
                update_data['building'] = schedule_data.building
            if schedule_data.type is not None:
                update_data['type'] = schedule_data.type
            if schedule_data.status is not None:
                update_data['status'] = schedule_data.status
            if schedule_data.capacity is not None:
                update_data['capacity'] = schedule_data.capacity
            if schedule_data.notes is not None:
                update_data['notes'] = schedule_data.notes
            
            # Check for conflicts if time/room changed
            if any(key in update_data for key in ['day', 'start_time', 'end_time', 'room']):
                conflict_check = ScheduleConflictCheck(
                    course_id=existing.course_id,
                    day=schedule_data.day or existing.day,
                    start_time=schedule_data.start_time or existing.start_time,
                    end_time=schedule_data.end_time or existing.end_time,
                    room=schedule_data.room or existing.room,
                    building=schedule_data.building or existing.building,
                    exclude_id=schedule_id
                )
                
                conflicts = await self.check_conflicts(conflict_check)
                if conflicts and len(conflicts) > 0:
                    print(f"Warning: Updating schedule with {len(conflicts)} conflicts")
            
            # Update schedule
            result = self.db.supabase.table('course_schedules').update(update_data).eq('id', schedule_id).execute()
            
            if not result.data:
                raise HTTPException(status_code=500, detail="Failed to update schedule")
            
            return await self.get_schedule(schedule_id)
            
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
    
    async def check_conflicts(self, conflict_check: ScheduleConflictCheck) -> List[ScheduleConflict]:
        """Check for schedule conflicts"""
        try:
            conflicts = []
            
            # Check room conflicts
            room_query = self.db.supabase.table('course_schedules').select('*').eq('day', conflict_check.day).eq('room', conflict_check.room)
            
            if conflict_check.exclude_id:
                room_query = room_query.neq('id', conflict_check.exclude_id)
            
            room_result = room_query.execute()
            
            for existing_schedule in room_result.data:
                existing_start = datetime.strptime(existing_schedule['start_time'], '%H:%M:%S').time()
                existing_end = datetime.strptime(existing_schedule['end_time'], '%H:%M:%S').time()
                
                # Check for time overlap
                if (conflict_check.start_time < existing_end and conflict_check.end_time > existing_start):
                    conflicts.append({
                        "type": "room",
                        "severity": "high",
                        "conflicting_schedules": [existing_schedule],
                        "suggested_solutions": [
                            {
                                "id": str(uuid.uuid4()),
                                "type": "change_room",
                                "description": "Move to available room",
                                "impact": "low"
                            },
                            {
                                "id": str(uuid.uuid4()),
                                "type": "change_time",
                                "description": "Reschedule to avoid conflict",
                                "impact": "medium"
                            }
                        ]
                    })
            
            return conflicts
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error checking conflicts: {str(e)}")
    
    async def check_room_availability(self, room: str, building: Optional[str], day: str, start_time: str, end_time: str) -> RoomAvailability:
        """Check if a room is available for a specific time slot"""
        try:
            query = self.db.supabase.table('course_schedules').select('*').eq('room', room).eq('day', day)
            
            if building:
                query = query.eq('building', building)
            
            result = query.execute()
            
            conflicting_schedules = []
            start_dt = datetime.strptime(start_time, '%H:%M').time()
            end_dt = datetime.strptime(end_time, '%H:%M').time()
            
            for schedule in result.data:
                existing_start = datetime.strptime(schedule['start_time'], '%H:%M:%S').time()
                existing_end = datetime.strptime(schedule['end_time'], '%H:%M:%S').time()
                
                if start_dt < existing_end and end_dt > existing_start:
                    conflicting_schedules.append(schedule)
            
            return RoomAvailability(
                room=room,
                building=building or "",
                is_available=len(conflicting_schedules) == 0,
                conflicting_schedules=conflicting_schedules
            )
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error checking room availability: {str(e)}")
    
    async def get_available_rooms(self, day: str, start_time: str, end_time: str, building: Optional[str] = None) -> List[str]:
        """Get list of available rooms for a time slot"""
        try:
            # This would check against a rooms table and existing schedules
            all_rooms = ['Amphitheater A', 'Amphitheater B', 'Lab A-205', 'Lab B-205', 'Room C-301']
            available_rooms = []
            
            for room in all_rooms:
                availability = await self.check_room_availability(room, building, day, start_time, end_time)
                if availability.is_available:
                    available_rooms.append(room)
            
            return available_rooms
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error getting available rooms: {str(e)}")
    
    async def get_schedule_stats(self, date_from: Optional[str] = None, date_to: Optional[str] = None) -> ScheduleStats:
        """Get schedule statistics"""
        try:
            # Get total schedules
            total_result = self.db.supabase.table('course_schedules').select('id', count='exact').execute()
            total_schedules = total_result.count or 0
            
            # Get this week's schedules (simplified)
            schedules_this_week = 15  # Mock data
            
            # Mock room utilization data
            room_utilization = [
                {"room": "Amphitheater A", "utilizationRate": 85},
                {"room": "Lab A-205", "utilizationRate": 72},
                {"room": "Room C-301", "utilizationRate": 68}
            ]
            
            # Mock lecturer workload
            lecturer_workload = [
                {"lecturerId": "lec001", "lecturerName": "Dr. Paul Mbarga", "hoursPerWeek": 12},
                {"lecturerId": "lec002", "lecturerName": "Prof. Marie Nkomo", "hoursPerWeek": 10}
            ]
            
            # Mock peak hours
            peak_hours = [
                {"hour": "10:00", "scheduleCount": 8},
                {"hour": "14:00", "scheduleCount": 7}
            ]
            
            return ScheduleStats(
                total_schedules=total_schedules,
                schedules_this_week=schedules_this_week,
                room_utilization=room_utilization,
                lecturer_workload=lecturer_workload,
                peak_hours=peak_hours,
                conflict_count=0
            )
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error getting schedule stats: {str(e)}")
    
    async def bulk_create_schedules(self, schedules: List[CourseScheduleCreate], created_by: str) -> List[CourseScheduleResponse]:
        """Create multiple schedules at once"""
        try:
            created_schedules = []
            
            for schedule_data in schedules:
                schedule = await self.create_schedule(schedule_data, created_by)
                created_schedules.append(schedule)
            
            return created_schedules
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error bulk creating schedules: {str(e)}")
    
    async def export_schedules(self, filters: Dict[str, Any], format: str) -> bytes:
        """Export schedules in various formats"""
        try:
            # This would implement actual export logic
            # For now, return mock CSV data
            csv_data = "Course,Day,Start Time,End Time,Room,Type\n"
            csv_data += "CS301,Monday,08:00,10:00,Amphitheater A,Lecture\n"
            csv_data += "CS205,Tuesday,14:00,16:00,Lab B-205,Practical\n"
            
            return csv_data.encode('utf-8')
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error exporting schedules: {str(e)}")
    
    async def import_schedules(self, file: UploadFile, created_by: str) -> Dict[str, Any]:
        """Import schedules from file"""
        try:
            # Read file content
            content = await file.read()
            
            # Parse CSV
            csv_reader = csv.DictReader(io.StringIO(content.decode('utf-8')))
            
            created_count = 0
            errors = []
            
            for row_num, row in enumerate(csv_reader, start=2):
                try:
                    # Create schedule from row data
                    schedule_data = CourseScheduleCreate(
                        course_id=row['course_id'],
                        day=row['day'],
                        start_time=datetime.strptime(row['start_time'], '%H:%M').time(),
                        end_time=datetime.strptime(row['end_time'], '%H:%M').time(),
                        room=row['room'],
                        building=row.get('building'),
                        type=row['type'],
                        notes=row.get('notes')
                    )
                    
                    await self.create_schedule(schedule_data, created_by)
                    created_count += 1
                    
                except Exception as e:
                    errors.append({
                        "row": row_num,
                        "error": str(e)
                    })
            
            return {
                "success": True,
                "created_count": created_count,
                "error_count": len(errors),
                "errors": errors
            }
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error importing schedules: {str(e)}")

course_schedule_service = CourseScheduleService()
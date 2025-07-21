from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional, Dict, Any
from app.models.virtual_classroom import (
    VirtualClassroomCreate, VirtualClassroomUpdate, VirtualClassroomResponse,
    SessionJoinRequest, SessionRecordingRequest
)
from app.models.user import UserResponse
from app.services.virtual_classroom_service import virtual_classroom_service
from app.api.auth import get_current_user

router = APIRouter(prefix="/virtual-classroom", tags=["virtual classroom"])

@router.post("/sessions", response_model=VirtualClassroomResponse)
async def create_session(
    session_data: VirtualClassroomCreate,
    current_user: UserResponse = Depends(get_current_user)
):
    """Create a new virtual classroom session"""
    # Only admins can create sessions
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can create sessions"
        )
    
    return await virtual_classroom_service.create_session(session_data, current_user.id)

@router.get("/sessions", response_model=List[VirtualClassroomResponse])
async def get_sessions(
    current_user: UserResponse = Depends(get_current_user),
    status: Optional[str] = Query(None, description="Filter by session status"),
    course_id: Optional[str] = Query(None, description="Filter by course ID"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0)
):
    """Get virtual classroom sessions based on user role"""
    return await virtual_classroom_service.get_sessions(
        user=current_user,
        status=status,
        course_id=course_id,
        limit=limit,
        offset=offset
    )

@router.get("/sessions/{session_id}", response_model=VirtualClassroomResponse)
async def get_session(
    session_id: str,
    current_user: UserResponse = Depends(get_current_user)
):
    """Get a specific virtual classroom session"""
    session = await virtual_classroom_service.get_session(session_id)
    
    # Check if user can access this session
    if current_user.role == "student":
        if (current_user.specialty not in session.target_specialties or 
            (session.target_level and session.target_level != current_user.level)):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have access to this session"
            )
    
    return session

@router.post("/sessions/{session_id}/join")
async def join_session(
    session_id: str,
    join_request: SessionJoinRequest,
    current_user: UserResponse = Depends(get_current_user)
):
    """Join a virtual classroom session"""
    # Check session access permissions
    session = await virtual_classroom_service.get_session(session_id)
    
    if current_user.role == "student":
        if (current_user.specialty not in session.target_specialties or 
            (session.target_level and session.target_level != current_user.level)):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have access to this session"
            )
    
    return await virtual_classroom_service.join_session(
        session_id, 
        current_user.id, 
        join_request.device_info
    )

@router.post("/sessions/{session_id}/leave")
async def leave_session(
    session_id: str,
    current_user: UserResponse = Depends(get_current_user)
):
    """Leave a virtual classroom session"""
    return await virtual_classroom_service.leave_session(session_id, current_user.id)

@router.post("/sessions/{session_id}/recording/start")
async def start_recording(
    session_id: str,
    recording_request: SessionRecordingRequest,
    current_user: UserResponse = Depends(get_current_user)
):
    """Start recording a session"""
    # Check permissions
    session = await virtual_classroom_service.get_session(session_id)
    
    if (current_user.role != "admin" and 
        current_user.id != session.instructor_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators and session instructors can start recording"
        )
    
    return await virtual_classroom_service.start_recording(session_id, recording_request)

@router.post("/sessions/{session_id}/recording/stop")
async def stop_recording(
    session_id: str,
    current_user: UserResponse = Depends(get_current_user)
):
    """Stop recording a session"""
    # Check permissions
    session = await virtual_classroom_service.get_session(session_id)
    
    if (current_user.role != "admin" and 
        current_user.id != session.instructor_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators and session instructors can stop recording"
        )
    
    return await virtual_classroom_service.stop_recording(session_id)

@router.put("/sessions/{session_id}", response_model=VirtualClassroomResponse)
async def update_session(
    session_id: str,
    session_data: VirtualClassroomUpdate,
    current_user: UserResponse = Depends(get_current_user)
):
    """Update a virtual classroom session"""
    # Check permissions
    session = await virtual_classroom_service.get_session(session_id)
    
    if (current_user.role != "admin" and 
        current_user.id != session.instructor_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators and session instructors can update sessions"
        )
    
    # Implementation for update would go here
    raise HTTPException(status_code=501, detail="Update functionality not yet implemented")

@router.delete("/sessions/{session_id}")
async def delete_session(
    session_id: str,
    current_user: UserResponse = Depends(get_current_user)
):
    """Delete a virtual classroom session"""
    # Only admins can delete sessions
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can delete sessions"
        )
    
    # Implementation for delete would go here
    raise HTTPException(status_code=501, detail="Delete functionality not yet implemented")
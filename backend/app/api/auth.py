from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.models.user import UserLogin, Token, UserPasswordChange, UserResponse
from app.services.auth_service import auth_service

router = APIRouter(prefix="/auth", tags=["authentication"])
security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> UserResponse:
    """Dependency to get current authenticated user"""
    return await auth_service.get_current_user(credentials.credentials)

@router.post("/login", response_model=Token)
async def login(login_data: UserLogin):
    """Authenticate user and return access token"""
    return await auth_service.login(login_data)

@router.post("/logout")
async def logout(current_user: UserResponse = Depends(get_current_user)):
    """Logout user (client should remove token)"""
    return {"message": "Successfully logged out"}

@router.post("/change-password")
async def change_password(
    password_data: UserPasswordChange,
    current_user: UserResponse = Depends(get_current_user)
):
    """Change user password"""
    # Verify current password
    user_login = UserLogin(matricule=current_user.matricule, password=password_data.current_password)
    authenticated_user = await auth_service.authenticate_user(user_login)
    
    if not authenticated_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    # Update password
    password_hash = auth_service.get_password_hash(password_data.new_password)
    
    auth_service.db.supabase.table('users').update({
        'password_hash': password_hash,
        'is_first_login': False,
        'updated_at': datetime.utcnow().isoformat()
    }).eq('id', current_user.id).execute()
    
    return {"message": "Password changed successfully"}

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: UserResponse = Depends(get_current_user)):
    """Get current user information"""
    return current_user
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status
from app.config import settings
from app.database import get_database
from app.models.user import UserLogin, UserResponse, Token
import secrets
import string

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class AuthService:
    def __init__(self):
        self.db = get_database()
    
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verify a password against its hash"""
        return pwd_context.verify(plain_password, hashed_password)
    
    def get_password_hash(self, password: str) -> str:
        """Hash a password"""
        return pwd_context.hash(password)
    
    def generate_password(self, length: int = 12) -> str:
        """Generate a random password"""
        alphabet = string.ascii_letters + string.digits + "!@#$%^&*"
        return ''.join(secrets.choice(alphabet) for _ in range(length))
    
    def create_access_token(self, data: dict, expires_delta: Optional[timedelta] = None):
        """Create JWT access token"""
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
        
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)
        return encoded_jwt
    
    def verify_token(self, token: str) -> dict:
        """Verify and decode JWT token"""
        try:
            payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
            return payload
        except JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
    
    async def authenticate_user(self, login_data: UserLogin) -> Optional[UserResponse]:
        """Authenticate user with matricule and password"""
        try:
            # Get user from database
            result = self.db.supabase.table('users').select('*').eq('matricule', login_data.matricule).execute()
            
            if not result.data:
                return None
            
            user_data = result.data[0]
            
            # Verify password
            if not self.verify_password(login_data.password, user_data['password_hash']):
                return None
            
            # Update last login
            self.db.supabase.table('users').update({
                'last_login': datetime.utcnow().isoformat()
            }).eq('id', user_data['id']).execute()
            
            # Convert to UserResponse
            return UserResponse(
                id=user_data['id'],
                matricule=user_data['matricule'],
                first_name=user_data['first_name'],
                last_name=user_data['last_name'],
                email=user_data['email'],
                phone=user_data.get('phone'),
                role=user_data['role'],
                department=user_data.get('department'),
                specialty=user_data.get('specialty'),
                level=user_data.get('level'),
                is_active=user_data['is_active'],
                status=user_data['status'],
                is_first_login=user_data['is_first_login'],
                last_login=user_data.get('last_login'),
                created_at=user_data['created_at'],
                updated_at=user_data['updated_at']
            )
            
        except Exception as e:
            print(f"Authentication error: {e}")
            return None
    
    async def login(self, login_data: UserLogin) -> Token:
        """Login user and return token"""
        user = await self.authenticate_user(login_data)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect matricule or password"
            )
        
        access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
        access_token = self.create_access_token(
            data={"sub": user.matricule, "user_id": user.id},
            expires_delta=access_token_expires
        )
        
        return Token(
            access_token=access_token,
            user=user
        )
    
    async def get_current_user(self, token: str) -> UserResponse:
        """Get current user from token"""
        payload = self.verify_token(token)
        matricule: str = payload.get("sub")
        
        if matricule is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials"
            )
        
        # Get user from database
        result = self.db.supabase.table('users').select('*').eq('matricule', matricule).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )
        
        user_data = result.data[0]
        return UserResponse(
            id=user_data['id'],
            matricule=user_data['matricule'],
            first_name=user_data['first_name'],
            last_name=user_data['last_name'],
            email=user_data['email'],
            phone=user_data.get('phone'),
            role=user_data['role'],
            department=user_data.get('department'),
            specialty=user_data.get('specialty'),
            level=user_data.get('level'),
            is_active=user_data['is_active'],
            status=user_data['status'],
            is_first_login=user_data['is_first_login'],
            last_login=user_data.get('last_login'),
            created_at=user_data['created_at'],
            updated_at=user_data['updated_at']
        )

auth_service = AuthService()
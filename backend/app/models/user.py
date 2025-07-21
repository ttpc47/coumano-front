from pydantic import BaseModel, EmailStr, validator
from typing import Optional, List
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    ADMIN = "admin"
    LECTURER = "lecturer"
    STUDENT = "student"

class UserStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"
    PENDING = "pending"

class UserBase(BaseModel):
    matricule: str
    first_name: str
    last_name: str
    email: EmailStr
    phone: Optional[str] = None
    role: UserRole
    department: Optional[str] = None
    specialty: Optional[str] = None
    level: Optional[int] = None
    is_active: bool = True
    status: UserStatus = UserStatus.ACTIVE

class UserCreate(UserBase):
    password: Optional[str] = None
    generate_matricule: bool = False
    send_welcome_email: bool = True

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    department: Optional[str] = None
    specialty: Optional[str] = None
    level: Optional[int] = None
    is_active: Optional[bool] = None
    status: Optional[UserStatus] = None

class UserResponse(UserBase):
    id: str
    name: str
    is_first_login: bool
    last_login: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    @validator('name', always=True)
    def compute_name(cls, v, values):
        return f"{values.get('first_name', '')} {values.get('last_name', '')}".strip()

class UserLogin(BaseModel):
    matricule: str
    password: str

class UserPasswordChange(BaseModel):
    current_password: str
    new_password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class BulkImportResult(BaseModel):
    success: bool
    total_rows: int
    success_count: int
    error_count: int
    errors: List[dict]
    created_users: List[dict]
import os
from typing import List
from pydantic_settings import BaseSettings
from pydantic import validator

class Settings(BaseSettings):
    # Supabase Configuration
    supabase_url: str
    supabase_key: str
    supabase_service_key: str
    
    # JWT Configuration
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 480
    
    # Email Configuration
    smtp_host: str = "smtp.gmail.com"
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    from_email: str = "noreply@university.cm"
    from_name: str = "COUMANO System"
    
    # Jitsi Configuration
    jitsi_domain: str = "meet.jit.si"
    jitsi_app_id: str = "coumano-university"
    jitsi_secret: str = ""
    
    # File Upload Configuration
    max_file_size: int = 104857600  # 100MB
    upload_dir: str = "uploads"
    allowed_file_types: List[str] = ["pdf", "doc", "docx", "ppt", "pptx", "mp4", "mp3", "jpg", "jpeg", "png"]
    
    # Redis Configuration
    redis_url: str = "redis://localhost:6379/0"
    
    # Development Configuration
    debug: bool = True
    environment: str = "development"
    
    # CORS Configuration
    allowed_origins: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173"
    ]
    
    @validator('allowed_file_types', pre=True)
    def parse_file_types(cls, v):
        if isinstance(v, str):
            return [ext.strip() for ext in v.split(',')]
        return v
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()
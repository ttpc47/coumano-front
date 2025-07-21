from supabase import create_client, Client
from app.config import settings
import logging

logger = logging.getLogger(__name__)

class Database:
    def __init__(self):
        self.supabase: Client = create_client(
            settings.supabase_url,
            settings.supabase_key
        )
        self.admin_client: Client = create_client(
            settings.supabase_url,
            settings.supabase_service_key
        )
    
    def get_client(self, admin: bool = False) -> Client:
        """Get Supabase client (admin or regular)"""
        return self.admin_client if admin else self.supabase
    
    async def health_check(self) -> bool:
        """Check database connection health"""
        try:
            result = self.supabase.table('users').select('id').limit(1).execute()
            return True
        except Exception as e:
            logger.error(f"Database health check failed: {e}")
            return False

# Global database instance
db = Database()

def get_database() -> Database:
    return db
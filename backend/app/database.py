from supabase import create_client, Client

from app.config import settings

supabase: Client | None = None

if settings.supabase_url and settings.supabase_key:
    supabase = create_client(settings.supabase_url, settings.supabase_key)
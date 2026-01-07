import os
from typing import Optional

class Settings:
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/dbname")
    BETTER_AUTH_SECRET: str = os.getenv("BETTER_AUTH_SECRET", "your-default-secret-key-here-change-in-production")
    DB_ECHO: bool = os.getenv("DB_ECHO", "False").lower() == "true"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "43200"))  # 30 days

settings = Settings()
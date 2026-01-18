from sqlmodel import create_engine
from ..core.config import settings
import urllib.parse

# Determine if using SQLite (for local testing) or PostgreSQL
is_sqlite = settings.DATABASE_URL.startswith("sqlite")
is_postgres = settings.DATABASE_URL.startswith("postgresql")

# Prepare connect_args based on database type
connect_args = {}
if is_sqlite:
    connect_args = {"check_same_thread": False}  # Required for SQLite
elif is_postgres:
    # For PostgreSQL, we need to check if it's a local dev instance (no SSL) or production (SSL required)
    # For Docker containers, we typically don't use SSL for internal connections
    connect_args = {
        "sslmode": "disable",  # Disable SSL for local Docker setup
        "connect_timeout": 10,  # Set connection timeout
    }
else:
    # Default for other databases
    connect_args = {"connect_timeout": 10}

# Create database engine with appropriate settings
engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.DB_ECHO,  # Set to True for debugging SQL queries
    pool_pre_ping=True,  # Verify connections before use
    pool_recycle=300,    # Recycle connections every 5 minutes
    connect_args=connect_args
)
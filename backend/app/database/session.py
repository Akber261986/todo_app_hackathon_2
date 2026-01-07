from sqlmodel import create_engine
from ..core.config import settings

# Create database engine with Neon URL
engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.DB_ECHO,  # Set to True for debugging SQL queries
    pool_pre_ping=True,  # Verify connections before use
    pool_recycle=300,    # Recycle connections every 5 minutes
    connect_args={
        "sslmode": "require",  # Ensure SSL is required
        "connect_timeout": 10,  # Set connection timeout
    }
)
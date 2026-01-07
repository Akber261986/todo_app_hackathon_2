import asyncpg
import os
from typing import Optional
from ..models.task import Task
from ..models.conversation import Conversation
from ..models.message import Message

# Database connection pool
pool = None

async def create_db_pool():
    """Create database connection pool"""
    global pool
    db_url = os.getenv("DATABASE_URL", "postgresql://localhost:5432/todo_chatbot")
    pool = await asyncpg.create_pool(dsn=db_url)
    return pool

async def get_db():
    """Get database connection from pool"""
    global pool
    if pool is None:
        await create_db_pool()
    return pool

async def init_db():
    """Initialize the database and create tables if they don't exist"""
    global pool
    if pool is None:
        await create_db_pool()

    # Create tables if they don't exist
    async with pool.acquire() as conn:
        # Create tasks table
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS tasks (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                completed BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # Create conversations table
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS conversations (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # Create messages table
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS messages (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                conversation_id INTEGER REFERENCES conversations(id),
                role VARCHAR(20) NOT NULL,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

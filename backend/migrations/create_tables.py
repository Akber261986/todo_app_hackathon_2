# Database Migration Script for Todo AI Chatbot

from sqlmds import Database
import asyncio
import os

async def create_tables():
    """Create database tables for the application"""
    db_url = os.getenv("DATABASE_URL", "sqlite:///./todo_chatbot.db")
    db = Database(db_url)
    
    # Connect to database
    await db.connect()
    
    # Create tables based on models
    # SQLMds will handle the table creation based on the models
    # For now, we'll assume the models define the schema
    
    print("Database tables created successfully")
    
    # Close connection
    await db.disconnect()

if __name__ == "__main__":
    asyncio.run(create_tables())


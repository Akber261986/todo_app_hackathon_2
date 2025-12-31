import os
import sys
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv('../.env')

# Add the backend directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__)))

from sqlmodel import SQLModel, create_engine
from app.database.session import engine
from app.models.user import User
from app.models.task import Task

def test_db_connection():
    print("Testing database connection...")

    try:
        # Try to create tables
        print("Creating tables...")
        SQLModel.metadata.create_all(bind=engine)
        print("Tables created successfully!")

        # Test a simple query
        from sqlmodel import Session, select
        with Session(engine) as session:
            result = session.exec(select(User).limit(1)).first()
            print(f"Query test result: {result}")

        print("Database connection test completed successfully!")
    except Exception as e:
        print(f"Database connection test failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_db_connection()
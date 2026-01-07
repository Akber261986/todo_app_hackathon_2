import os
import sys
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv('../.env')

# Add the backend directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__)))

from passlib.context import CryptContext
from sqlmodel import SQLModel, Field, Session, select
from app.database.session import engine
from app.models.user import User
from app.auth.jwt import get_password_hash, pwd_context

def test_password_hashing():
    print("Testing password hashing...")

    # Test with a short password
    test_password = "pass123"
    print(f"Original password: {test_password}")
    print(f"Password length in bytes: {len(test_password.encode('utf-8'))}")

    try:
        hashed = get_password_hash(test_password)
        print(f"Password hashed successfully: {hashed[:20]}...")
    except Exception as e:
        print(f"Password hashing failed: {e}")
        import traceback
        traceback.print_exc()
        return False

    # Test with a long password
    long_password = "a" * 80  # 80 characters, definitely over 72 bytes
    print(f"\nTesting with long password (length: {len(long_password)} bytes)")

    try:
        hashed_long = get_password_hash(long_password)
        print(f"Long password hashed successfully: {hashed_long[:20]}...")
    except Exception as e:
        print(f"Long password hashing failed: {e}")
        import traceback
        traceback.print_exc()
        return False

    return True

def test_database():
    print("\nTesting database operations...")

    try:
        # Create tables
        SQLModel.metadata.create_all(bind=engine)
        print("Tables created successfully")

        # Test inserting a user
        with Session(engine) as session:
            # Check if user already exists
            existing_user = session.exec(select(User).where(User.email == "test@example.com")).first()
            if existing_user:
                print("User already exists, skipping creation")
                return True

            # Create a new user
            hashed_password = get_password_hash("pass123")
            new_user = User(
                email="test@example.com",
                hashed_password=hashed_password
            )

            session.add(new_user)
            session.commit()
            session.refresh(new_user)

            print(f"User created successfully with ID: {new_user.id}")
            return True
    except Exception as e:
        print(f"Database operation failed: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("Running password hashing and database tests...")

    hash_success = test_password_hashing()
    if hash_success:
        db_success = test_database()
        if db_success:
            print("\nAll tests passed!")
        else:
            print("\nDatabase test failed!")
    else:
        print("\nPassword hashing test failed!")
# Data Model: Phase II Multi-User Todo App

## Overview

This document defines the data models for the multi-user Todo application using SQLModel with Neon DB. The models include User and Task entities with proper relationships to support user isolation and authentication.

## Entity: User

**Description**: Represents a registered user in the system

### Fields
- **id**: UUID (Primary Key)
  - Type: `uuid.UUID`
  - Default: `uuid.uuid4()`
  - Required: Yes
  - Unique: Yes
  - Purpose: Unique identifier for the user

- **email**: String
  - Type: `str`
  - Max length: 255 characters
  - Required: Yes
  - Unique: Yes
  - Indexed: Yes
  - Purpose: User's email address for authentication

- **hashed_password**: String
  - Type: `str`
  - Max length: 255 characters
  - Required: Yes
  - Purpose: BCrypt hashed password for authentication

- **created_at**: DateTime
  - Type: `datetime`
  - Default: `datetime.utcnow()`
  - Required: Yes
  - Purpose: Timestamp when the user account was created

- **updated_at**: DateTime
  - Type: `datetime`
  - Default: `datetime.utcnow()`
  - Required: Yes
  - Purpose: Timestamp when the user account was last updated

- **is_active**: Boolean
  - Type: `bool`
  - Default: `True`
  - Required: Yes
  - Purpose: Whether the user account is active

### Relationships
- **tasks**: One-to-Many relationship with Task model
  - Back reference: `tasks` property on User model
  - Cascade delete: Yes (when user is deleted, all tasks are deleted)

### Validation Rules
- Email must be valid email format
- Email must be unique across all users
- Email length must be between 5 and 255 characters
- Hashed password must be properly formatted bcrypt hash
- created_at and updated_at must be valid timestamps

## Entity: Task

**Description**: Represents a todo task associated with a specific user

### Fields
- **id**: UUID (Primary Key)
  - Type: `uuid.UUID`
  - Default: `uuid.uuid4()`
  - Required: Yes
  - Unique: Yes
  - Purpose: Unique identifier for the task

- **title**: String
  - Type: `str`
  - Max length: 255 characters
  - Required: Yes
  - Indexed: Yes
  - Purpose: Title of the task

- **description**: String (Optional)
  - Type: `Optional[str]`
  - Max length: 5000 characters
  - Required: No (nullable)
  - Purpose: Optional description of the task

- **complete**: Boolean
  - Type: `bool`
  - Default: `False`
  - Required: Yes
  - Purpose: Whether the task is completed

- **user_id**: UUID (Foreign Key)
  - Type: `uuid.UUID`
  - Required: Yes
  - Foreign Key: References `users.id` with CASCADE delete
  - Indexed: Yes
  - Purpose: Links the task to its owner user

- **created_at**: DateTime
  - Type: `datetime`
  - Default: `datetime.utcnow()`
  - Required: Yes
  - Purpose: Timestamp when the task was created

- **updated_at**: DateTime
  - Type: `datetime`
  - Default: `datetime.utcnow()`
  - Required: Yes
  - Purpose: Timestamp when the task was last updated

### Relationships
- **user**: Many-to-One relationship with User model
  - Back reference: `user` property on Task model
  - Purpose: Reference to the user who owns this task

### Validation Rules
- Title must be between 1 and 255 characters
- Description can be null or up to 5000 characters if provided
- user_id must reference an existing User record
- complete status can be toggled between true/false
- created_at and updated_at must be valid timestamps

## SQLModel Implementation

```python
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, TYPE_CHECKING
import uuid
from datetime import datetime

if TYPE_CHECKING:
    from typing import List
    from models.user import User


class User(SQLModel, table=True):
    __tablename__ = "users"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    email: str = Field(unique=True, nullable=False, max_length=255, sa_column_kwargs={"index": True})
    hashed_password: str = Field(nullable=False, max_length=255)
    created_at: datetime = Field(default=datetime.utcnow())
    updated_at: datetime = Field(default=datetime.utcnow())
    is_active: bool = Field(default=True)

    # Relationship to tasks
    tasks: List["Task"] = Relationship(back_populates="user")


class Task(SQLModel, table=True):
    __tablename__ = "tasks"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    title: str = Field(nullable=False, max_length=255, sa_column_kwargs={"index": True})
    description: Optional[str] = Field(default=None, max_length=5000)
    complete: bool = Field(default=False)
    user_id: uuid.UUID = Field(foreign_key="users.id", ondelete="CASCADE", sa_column_kwargs={"index": True})
    created_at: datetime = Field(default=datetime.utcnow())
    updated_at: datetime = Field(default=datetime.utcnow())

    # Relationship to user
    user: User = Relationship(back_populates="tasks")
```

## Relationship Between Entities

### User-Task Relationship
- **Type**: One-to-Many (One User can have many Tasks)
- **Implementation**: Foreign key `user_id` in Task table references `id` in User table
- **Behavior**: When a User is deleted, all associated Tasks are automatically deleted (CASCADE delete)
- **Access**:
  - From User: `user.tasks` provides list of associated tasks
  - From Task: `task.user` provides reference to owning user

## Migration from Phase I

### Changes from In-Memory Model
- Added `user_id` foreign key to establish user ownership
- Changed ID type from integer to UUID for security (prevents enumeration)
- Added timestamps for audit trail
- Added relationships for proper ORM functionality
- Maintained core task properties (title, description, completion status)

### Data Migration Strategy
1. Phase I in-memory tasks will be lost during migration (acceptable for prototype)
2. New users will create tasks in persistent storage
3. Future enhancement: Import functionality could migrate Phase I data if needed
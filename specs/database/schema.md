# Database Schema Specification: Multi-User Todo App

## Overview

This specification defines the database schema for the multi-user Todo application using SQLModel with Neon DB as the persistent storage. The schema includes User and Task models with proper relationships to support user isolation and authentication.

## Database Models

### User Model

**User**: Represents a registered user in the system

- **id**: UUID - Primary key, unique identifier for the user
- **email**: str - Unique email address for user identification (indexed)
- **hashed_password**: str - BCrypt hashed password for authentication
- **created_at**: datetime - Timestamp when the user account was created
- **updated_at**: datetime - Timestamp when the user account was last updated
- **is_active**: bool - Whether the user account is active (default: true)

**Validation rules**:
- email must be a valid email format
- email must be unique across all users
- email length must be between 5 and 255 characters
- hashed_password must be properly formatted bcrypt hash
- created_at and updated_at must be valid timestamps

### Task Model

**Task**: Represents a todo task associated with a specific user

- **id**: UUID - Primary key, unique identifier for the task
- **title**: str - Required title of the task (indexed)
- **description**: str - Optional description of the task (nullable)
- **complete**: bool - Whether the task is completed (default: false)
- **user_id**: UUID - Foreign key linking the task to its owner user
- **created_at**: datetime - Timestamp when the task was created
- **updated_at**: datetime - Timestamp when the task was last updated

**Validation rules**:
- title must be between 1 and 255 characters
- user_id must reference an existing User record
- complete status can be toggled between true/false
- created_at and updated_at must be valid timestamps

## Relationships

### User-Task Relationship

The relationship between User and Task models is defined as:
- One User can have many Tasks (one-to-many relationship)
- Tasks are linked to Users via the user_id foreign key
- When a User is deleted, all associated Tasks should be deleted (cascade delete)
- Each Task belongs to exactly one User

## SQL Schema Definition

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_users_email ON users(email);

CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    complete BOOLEAN DEFAULT FALSE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_complete ON tasks(complete);
```

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

## Migration Strategy

### From In-Memory to Persistent Storage

1. **Phase 1**: Set up the new Neon DB with the defined schema
2. **Phase 2**: Create migration scripts to transfer existing data if needed
3. **Phase 3**: Update all service layer methods to use SQLModel/SQLAlchemy
4. **Phase 4**: Implement proper connection pooling and transaction management
5. **Phase 5**: Ensure all existing functionality works with persistent storage

## Security Considerations

- Passwords must be hashed using BCrypt with appropriate salt
- User email uniqueness prevents account confusion
- Cascade delete ensures data integrity when users are removed
- Proper indexing for performance while maintaining security

## Constraints and Indexes

- Email uniqueness constraint prevents duplicate accounts
- Indexed user_id for efficient task filtering by user
- Indexed complete status for efficient task status queries
- UUID primary keys provide security against enumeration attacks
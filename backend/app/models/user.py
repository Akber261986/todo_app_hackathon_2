from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, TYPE_CHECKING, List
import uuid
from datetime import datetime
from sqlalchemy import Column, DateTime
from sqlalchemy.sql import func

if TYPE_CHECKING:
    from .task import Task


class UserBase(SQLModel):
    email: str = Field(unique=True, nullable=False, max_length=255, sa_column_kwargs={"index": True})
    is_active: bool = Field(default=True)


class User(UserBase, table=True):
    __tablename__ = "users"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    email: str = Field(unique=True, nullable=False, max_length=255, sa_column_kwargs={"index": True})
    hashed_password: str = Field(nullable=False, max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow, sa_column=Column(DateTime(timezone=True), server_default=func.now()))
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column=Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now()))
    is_active: bool = Field(default=True)

    # Relationship to tasks
    tasks: List["Task"] = Relationship(back_populates="user")
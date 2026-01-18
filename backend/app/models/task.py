from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, TYPE_CHECKING
import uuid
from datetime import datetime
from sqlalchemy import Column, DateTime, ForeignKey
from sqlalchemy.sql import func

if TYPE_CHECKING:
    from .user import User
    from typing import List


class TaskBase(SQLModel):
    title: str = Field(nullable=False, max_length=255, sa_column_kwargs={"index": True})
    description: Optional[str] = Field(default=None, max_length=5000)
    complete: bool = Field(default=False)


class Task(TaskBase, table=True):
    __tablename__ = "tasks"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    title: str = Field(nullable=False, max_length=255, sa_column_kwargs={"index": True})
    description: Optional[str] = Field(default=None, max_length=5000)
    complete: bool = Field(default=False)
    user_id: uuid.UUID = Field(sa_column=Column(ForeignKey("users.id", ondelete="CASCADE"), index=True))
    created_at: datetime = Field(default_factory=datetime.utcnow, sa_column=Column(DateTime(timezone=True), server_default=func.now()))
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column=Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now()))

    # Relationship to user
    user: "User" = Relationship(back_populates="tasks")
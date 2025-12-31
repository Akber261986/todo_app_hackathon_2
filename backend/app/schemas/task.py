from pydantic import BaseModel
from typing import Optional
import uuid
from datetime import datetime


class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    complete: bool = False


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    complete: Optional[bool] = None


class TaskInDB(TaskBase):
    id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TaskResponse(TaskInDB):
    pass
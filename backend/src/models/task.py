from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class Task(BaseModel):
    id: Optional[int] = None
    user_id: str
    title: str
    description: Optional[str] = None
    completed: bool = False
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
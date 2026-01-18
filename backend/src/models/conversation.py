from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class Conversation(BaseModel):
    id: Optional[int] = None
    user_id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
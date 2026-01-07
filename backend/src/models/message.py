from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class Message(BaseModel):
    id: Optional[int] = None
    user_id: str
    conversation_id: int
    role: str  # "user" or "assistant"
    content: str
    created_at: Optional[datetime] = None
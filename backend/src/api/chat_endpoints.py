# Chat API Endpoints for Todo AI Chatbot

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from ..services.ai_agent import AIAgentService
from ..services.task_service import TaskService
from ..middleware.auth import JWTBearer, TokenData
import asyncio


router = APIRouter()

class ChatRequest(BaseModel):
    conversation_id: Optional[int] = None
    message: str

class ChatResponse(BaseModel):
    conversation_id: int
    response: str
    tool_calls: List[Dict[str, Any]]


@router.post("/{user_id}/chat", response_model=ChatResponse)
async def chat(user_id: str, request: ChatRequest, token_data: TokenData = Depends(JWTBearer())):
    """Send message and get AI response"""
    # Verify that the authenticated user matches the user_id in the path
    if token_data.user_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to access this user's data")
    
    # Initialize AI agent service
    ai_agent_service = AIAgentService()
    await ai_agent_service.initialize()
    
    # Process the message
    result = await ai_agent_service.process_message(
        user_id=user_id,
        conversation_id=request.conversation_id,
        message=request.message
    )
    
    return ChatResponse(
        conversation_id=result["conversation_id"],
        response=result["response"],
        tool_calls=result["tool_calls"]
    )

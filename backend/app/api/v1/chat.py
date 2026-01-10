from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
import os
import uuid
from typing import Optional, List
from sqlmodel import Session, select
from datetime import datetime

from ...auth.jwt import get_current_user_id
from ...models.user import User
from ...models.task import Task
from ...schemas.task import TaskCreate, TaskUpdate, TaskResponse
from ...database.session import engine
from ...services.conversation_manager import get_conversation_manager

# Only import if the required dependencies are available
try:
    from agents import Agent, Runner, function_tool
    from agents.extensions.models.litellm_model import LitellmModel

    # Check if GEMINI_API_KEY is available
    gemini_api_key = os.getenv("GEMINI_API_KEY")
    if not gemini_api_key:
        print("Warning: GEMINI_API_KEY environment variable is not set")
        raise ImportError("GEMINI_API_KEY not set")

    # Configure Gemini model via LiteLLM
    gemini_model = LitellmModel(
        model="gemini/gemini-2.5-flash",
        api_key=gemini_api_key,
    )

    # Define tools that the agent can use

    @function_tool
    def get_user_tasks(user_id: str) -> List[dict]:
        """Get all tasks for the current user.

        Args:
            user_id: The UUID of the user whose tasks to retrieve.
        """
        try:
            with Session(engine) as session:
                # Convert string user_id to UUID
                user_uuid = uuid.UUID(user_id)

                # Query tasks for the specific user
                statement = select(Task).where(Task.user_id == user_uuid)
                tasks = session.exec(statement).all()

                # Convert tasks to dictionary format
                tasks_list = []
                for task in tasks:
                    tasks_list.append({
                        "id": str(task.id),
                        "title": task.title,
                        "description": task.description,
                        "complete": task.complete,
                        "created_at": task.created_at.isoformat() if task.created_at else None,
                        "updated_at": task.updated_at.isoformat() if task.updated_at else None
                    })

                return tasks_list
        except Exception as e:
            return {"error": f"Error retrieving tasks: {str(e)}"}

    @function_tool
    def create_task(user_id: str, title: str, description: str = None, complete: bool = False) -> dict:
        """Create a new task for the user.

        Args:
            user_id: The UUID of the user who owns the task.
            title: The title of the task.
            description: Optional description of the task.
            complete: Whether the task is initially marked as complete (default: False).
        """
        try:
            with Session(engine) as session:
                # Convert string user_id to UUID
                user_uuid = uuid.UUID(user_id)

                # Create new task
                task = Task(
                    title=title,
                    description=description,
                    complete=complete,
                    user_id=user_uuid
                )

                session.add(task)
                session.commit()
                session.refresh(task)

                return {
                    "id": str(task.id),
                    "title": task.title,
                    "description": task.description,
                    "complete": task.complete,
                    "created_at": task.created_at.isoformat() if task.created_at else None,
                    "updated_at": task.updated_at.isoformat() if task.updated_at else None
                }
        except Exception as e:
            return {"error": f"Error creating task: {str(e)}"}

    @function_tool
    def update_task(task_id: str, title: str = None, description: str = None, complete: bool = None) -> dict:
        """Update an existing task.

        Args:
            task_id: The UUID of the task to update.
            title: New title for the task (optional).
            description: New description for the task (optional).
            complete: New completion status for the task (optional).
        """
        try:
            with Session(engine) as session:
                # Convert string task_id to UUID
                task_uuid = uuid.UUID(task_id)

                # Get the task
                task = session.get(Task, task_uuid)
                if not task:
                    return {"error": "Task not found"}

                # Update task fields if provided
                if title is not None:
                    task.title = title
                if description is not None:
                    task.description = description
                if complete is not None:
                    task.complete = complete

                session.add(task)
                session.commit()
                session.refresh(task)

                return {
                    "id": str(task.id),
                    "title": task.title,
                    "description": task.description,
                    "complete": task.complete,
                    "created_at": task.created_at.isoformat() if task.created_at else None,
                    "updated_at": task.updated_at.isoformat() if task.updated_at else None
                }
        except Exception as e:
            return {"error": f"Error updating task: {str(e)}"}

    @function_tool
    def delete_task(task_id: str) -> dict:
        """Delete a task.

        Args:
            task_id: The UUID of the task to delete.
        """
        try:
            with Session(engine) as session:
                # Convert string task_id to UUID
                task_uuid = uuid.UUID(task_id)

                # Get the task
                task = session.get(Task, task_uuid)
                if not task:
                    return {"error": "Task not found"}

                # Delete the task
                session.delete(task)
                session.commit()

                return {"message": "Task deleted successfully", "task_id": str(task_uuid)}
        except Exception as e:
            return {"error": f"Error deleting task: {str(e)}"}

    # Global variable to store current user context
    current_user_context = {}

    # Enhanced tools with automatic user ID injection
    @function_tool
    def get_user_tasks_enhanced() -> List[dict]:
        """Get all tasks for the current user.

        Args:
            None - automatically uses the authenticated user's context
        """
        user_id = current_user_context.get('user_id')
        if not user_id:
            return {"error": "User context not available"}

        try:
            with Session(engine) as session:
                # Convert string user_id to UUID
                user_uuid = uuid.UUID(user_id)

                # Query tasks for the specific user
                statement = select(Task).where(Task.user_id == user_uuid)
                tasks = session.exec(statement).all()

                # Convert tasks to dictionary format
                tasks_list = []
                for task in tasks:
                    tasks_list.append({
                        "id": str(task.id),
                        "title": task.title,
                        "description": task.description,
                        "complete": task.complete,
                        "created_at": task.created_at.isoformat() if task.created_at else None,
                        "updated_at": task.updated_at.isoformat() if task.updated_at else None
                    })

                return tasks_list
        except Exception as e:
            return {"error": f"Error retrieving tasks: {str(e)}"}

    @function_tool
    def create_task_enhanced(title: str, description: str = None, complete: bool = False) -> dict:
        """Create a new task for the current user.

        Args:
            title: The title of the task.
            description: Optional description of the task.
            complete: Whether the task is initially marked as complete (default: False).
        """
        user_id = current_user_context.get('user_id')
        if not user_id:
            return {"error": "User context not available"}

        try:
            with Session(engine) as session:
                # Convert string user_id to UUID
                user_uuid = uuid.UUID(user_id)

                # Create new task
                task = Task(
                    title=title,
                    description=description,
                    complete=complete,
                    user_id=user_uuid
                )

                session.add(task)
                session.commit()
                session.refresh(task)

                return {
                    "id": str(task.id),
                    "title": task.title,
                    "description": task.description,
                    "complete": task.complete,
                    "created_at": task.created_at.isoformat() if task.created_at else None,
                    "updated_at": task.updated_at.isoformat() if task.updated_at else None
                }
        except Exception as e:
            return {"error": f"Error creating task: {str(e)}"}

    @function_tool
    def update_task_enhanced(task_id: str, title: str = None, description: str = None, complete: bool = None) -> dict:
        """Update an existing task for the current user.

        Args:
            task_id: The UUID of the task to update.
            title: New title for the task (optional).
            description: New description for the task (optional).
            complete: New completion status for the task (optional).
        """
        user_id = current_user_context.get('user_id')
        if not user_id:
            return {"error": "User context not available"}

        try:
            with Session(engine) as session:
                # Convert string task_id to UUID
                task_uuid = uuid.UUID(task_id)

                # Get the task and verify it belongs to the user
                task = session.get(Task, task_uuid)
                if not task:
                    return {"error": "Task not found"}

                # Verify task belongs to user
                if str(task.user_id) != user_id:
                    return {"error": "Task does not belong to user"}

                # Update task fields if provided
                if title is not None:
                    task.title = title
                if description is not None:
                    task.description = description
                if complete is not None:
                    task.complete = complete

                session.add(task)
                session.commit()
                session.refresh(task)

                return {
                    "id": str(task.id),
                    "title": task.title,
                    "description": task.description,
                    "complete": task.complete,
                    "created_at": task.created_at.isoformat() if task.created_at else None,
                    "updated_at": task.updated_at.isoformat() if task.updated_at else None
                }
        except Exception as e:
            return {"error": f"Error updating task: {str(e)}"}

    @function_tool
    def delete_task_enhanced(task_id: str) -> dict:
        """Delete a task for the current user.

        Args:
            task_id: The UUID of the task to delete.
        """
        user_id = current_user_context.get('user_id')
        if not user_id:
            return {"error": "User context not available"}

        try:
            with Session(engine) as session:
                # Convert string task_id to UUID
                task_uuid = uuid.UUID(task_id)

                # Get the task and verify it belongs to the user
                task = session.get(Task, task_uuid)
                if not task:
                    return {"error": "Task not found"}

                # Verify task belongs to user
                if str(task.user_id) != user_id:
                    return {"error": "Task does not belong to user"}

                # Delete the task
                session.delete(task)
                session.commit()

                return {"message": "Task deleted successfully", "task_id": str(task_uuid)}
        except Exception as e:
            return {"error": f"Error deleting task: {str(e)}"}

    # Create the agent with Gemini model and enhanced task management tools
    try:
        assistant_agent = Agent(
            name="Todo Assistant",
            instructions="""You are a helpful Todo AI assistant powered by Google Gemini. You help users manage their tasks and productivity. You can:
- Answer questions about task management and productivity
- Create, update, delete, and list tasks for users
- Provide productivity tips and time management advice
- Suggest task prioritization strategies
- Help users plan their day and set goals
- Answer questions about the todo app features

Be concise, helpful, and if user ask something else reply a short answer then focused on productivity and task management in your responses. If asked about capabilities beyond task management, politely redirect to productivity topics.

When users ask to create, update, delete, or list tasks, use the appropriate tools to perform these actions. You have access to the user context automatically, so you don't need to ask for user IDs.""",
            model=gemini_model,
            tools=[get_user_tasks_enhanced, create_task_enhanced, update_task_enhanced, delete_task_enhanced],
        )
        AGENTS_AVAILABLE = True
    except Exception as e:
        print(f"Error creating assistant agent: {str(e)}")
        AGENTS_AVAILABLE = False
        assistant_agent = None
except ImportError as e:
    print(f"Import error in chat module: {str(e)}")
    AGENTS_AVAILABLE = False
    assistant_agent = None

router = APIRouter()

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None  # New field for conversation tracking
    conversation_history: Optional[List[Message]] = None
    stream: bool = False

class ChatResponse(BaseModel):
    response: str
    conversation_id: str  # Return conversation ID for continuity

@router.post("/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    current_user_id: uuid.UUID = Depends(get_current_user_id)
):
    """Send a message to the AI agent and get a response with conversation state maintained."""
    if not AGENTS_AVAILABLE:
        # Return a helpful error message instead of a generic 500 error
        error_response = "I'm sorry, but the AI assistant is currently unavailable. Please try again later."
        return ChatResponse(response=error_response, conversation_id=str(uuid.uuid4()))

    try:
        # Set the global user context for the function tools
        current_user_context['user_id'] = str(current_user_id)

        # Get the conversation manager
        conversation_manager = get_conversation_manager(assistant_agent)

        # Process the message with conversation context
        response, conversation_id = await conversation_manager.process_message(
            user_id=str(current_user_id),
            message=request.message,
            conversation_id=request.conversation_id
        )

        return ChatResponse(response=response, conversation_id=conversation_id)
    except Exception as e:
        # Log the actual error for debugging purposes
        print(f"Chat endpoint error: {str(e)}")
        error_response = "I'm sorry, I encountered an error processing your request. Please try again."
        return ChatResponse(response=error_response, conversation_id=str(uuid.uuid4()))

@router.delete("/chat/{conversation_id}")
async def end_conversation(
    conversation_id: str,
    current_user_id: uuid.UUID = Depends(get_current_user_id)
):
    """End a conversation and clean up resources"""
    try:
        # In a real implementation, you would remove the conversation from the manager
        # For now, we'll just return a success message
        # The conversation manager handles cleanup automatically based on TTL

        return {"message": "Conversation ended successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
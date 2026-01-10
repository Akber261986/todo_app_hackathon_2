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

# Try to import Google Generative AI library for direct Gemini API access
try:
    import google.generativeai as genai
    from typing import Dict, Any

    # Check if GEMINI_API_KEY is available
    gemini_api_key = os.getenv("GEMINI_API_KEY")
    if not gemini_api_key:
        print("Warning: GEMINI_API_KEY environment variable is not set")
        raise ImportError("GEMINI_API_KEY not set")

    # Configure the Gemini API
    genai.configure(api_key=gemini_api_key)

    # Initialize the Gemini model
    gemini_model = genai.GenerativeModel('gemini-2.5-flash')

    # Global variable to store current user context
    current_user_context = {}

    # Function to interact with the Gemini model (synchronous version for better compatibility)
    def call_gemini_api_sync(prompt: str) -> str:
        try:
            response = gemini_model.generate_content(prompt)
            return response.text if response.text else "I couldn't generate a response. Please try again."
        except Exception as e:
            print(f"Error calling Gemini API with library: {str(e)}")
            return f"I'm having trouble connecting to the AI service. Error: {str(e)}"

    # Async wrapper for compatibility
    import asyncio
    from concurrent.futures import ThreadPoolExecutor

    executor = ThreadPoolExecutor(max_workers=4)

    async def call_gemini_api(prompt: str) -> str:
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(executor, call_gemini_api_sync, prompt)

except ImportError:
    # Fallback implementation using direct HTTP requests to Gemini API
    import json
    import httpx
    import asyncio
    from concurrent.futures import ThreadPoolExecutor

    gemini_api_key = os.getenv("GEMINI_API_KEY")
    if not gemini_api_key:
        print("Warning: GEMINI_API_KEY environment variable is not set")
        gemini_api_key = None

    executor = ThreadPoolExecutor(max_workers=4)

    def call_gemini_api_sync_http(prompt: str) -> str:
        if not gemini_api_key:
            return "Gemini API key is not configured. Please contact the administrator."

        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={gemini_api_key}"

            headers = {
                "Content-Type": "application/json"
            }

            payload = {
                "contents": [{
                    "parts": [{
                        "text": prompt
                    }]
                }],
                "generationConfig": {
                    "temperature": 0.7,
                    "maxOutputTokens": 1000,
                    "topK": 40,
                    "topP": 0.95
                }
            }

            response = httpx.post(url, headers=headers, json=payload, timeout=30.0)

            if response.status_code == 200:
                data = response.json()
                candidates = data.get('candidates', [])

                if candidates:
                    content = candidates[0].get('content', {})
                    parts = content.get('parts', [])

                    if parts:
                        return parts[0].get('text', "I couldn't generate a response. Please try again.")

                return "I couldn't generate a complete response. Please try again."
            else:
                error_detail = response.text if response.text else f"HTTP {response.status_code}"
                print(f"Gemini API error: {response.status_code} - {error_detail}")
                return f"I'm having trouble connecting to the AI service. Status: {response.status_code}"

        except httpx.TimeoutException:
            print("Gemini API timeout error")
            return "The AI service is taking too long to respond. Please try again."
        except Exception as e:
            print(f"Error calling Gemini API with HTTP: {str(e)}")
            return f"I'm having trouble connecting to the AI service. Error: {str(e)}"

    async def call_gemini_api(prompt: str) -> str:
        if gemini_api_key:
            loop = asyncio.get_event_loop()
            return await loop.run_in_executor(executor, call_gemini_api_sync_http, prompt)
        else:
            return "Gemini API key is not configured. Please contact the administrator."

    # Global variable to store current user context
    current_user_context = {}

    AGENTS_AVAILABLE = True

    # Enhanced functions for task management
    def get_user_tasks_enhanced(user_id: str) -> List[dict]:
        """Get all tasks for the current user."""
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

    def create_task_enhanced(user_id: str, title: str, description: str = None, complete: bool = False) -> dict:
        """Create a new task for the current user."""
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

    def update_task_enhanced(user_id: str, task_id: str, title: str = None, description: str = None, complete: bool = None) -> dict:
        """Update an existing task for the current user."""
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

    def delete_task_enhanced(user_id: str, task_id: str) -> dict:
        """Delete a task for the current user."""
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

    # Function to process user commands using natural language
    def process_task_command(user_input: str, user_id: str) -> str:
        """Process natural language commands to interact with tasks."""
        import re

        # Convert user input to lowercase for easier parsing
        lower_input = user_input.lower()

        # Handle task listing
        if any(keyword in lower_input for keyword in ['list', 'show', 'view', 'all', 'my', 'tasks']):
            tasks = get_user_tasks_enhanced(user_id)
            if isinstance(tasks, dict) and "error" in tasks:
                return f"Error retrieving tasks: {tasks['error']}"

            if not tasks or (isinstance(tasks, list) and len(tasks) == 0):
                return "You don't have any tasks yet. You can create a new task by saying something like 'Create a task to buy groceries'."

            task_list = "Here are your tasks:\n"
            for task in tasks:
                if isinstance(task, dict) and 'title' in task:
                    status = "✓ Completed" if task.get('complete') else "○ Pending"
                    task_list += f"- {status}: {task['title']}"
                    if task.get('description'):
                        task_list += f" - {task['description']}"
                    task_list += f" (ID: {task['id']})\n"

            return task_list.strip()

        # Handle task creation
        elif any(keyword in lower_input for keyword in ['create', 'add', 'new', 'make']):
            # Extract task title and description from user input
            # Look for common patterns like "create task to..." or "create a task to..."
            create_patterns = [
                r'create\s+(?:a\s+)?(?:task|todo)\s+to\s+(.+?)(?:\s+and\s+.*)?$',
                r'add\s+(?:a\s+)?(?:task|todo)\s+to\s+(.+?)(?:\s+and\s+.*)?$',
                r'make\s+(?:a\s+)?(?:task|todo)\s+to\s+(.+?)(?:\s+and\s+.*)?$',
                r'new\s+(?:task|todo)\s+(?:to|for)\s+(.+?)(?:\s+and\s+.*)?$'
            ]

            title = None
            for pattern in create_patterns:
                match = re.search(pattern, user_input, re.IGNORECASE)
                if match:
                    title = match.group(1).strip()
                    break

            if not title:
                # If we can't extract a title, ask the user for clarification
                return "I'd be happy to create a task for you. Please specify what task you'd like to create. For example: 'Create a task to buy groceries'"

            result = create_task_enhanced(user_id, title=title)
            if isinstance(result, dict) and "error" in result:
                return f"Error creating task: {result['error']}"

            return f"I've created the task '{result['title']}' for you (ID: {result['id']})."

        # Handle task updates
        elif any(keyword in lower_input for keyword in ['update', 'change', 'modify', 'complete', 'done', 'finish']):
            # First, try to find a proper UUID in the input
            uuid_pattern = r'[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}'
            id_match = re.search(uuid_pattern, user_input, re.IGNORECASE)

            if id_match:
                task_id = id_match.group(0)

                # Check if user wants to mark as complete
                if any(word in lower_input for word in ['complete', 'done', 'finish', 'completed']):
                    result = update_task_enhanced(user_id, task_id, complete=True)
                else:
                    return "To update a task, please specify what you'd like to change. For example: 'Update task 123 to mark as complete' or 'Change task 123 title to new title'"

                if isinstance(result, dict) and "error" in result:
                    return f"Error updating task: {result['error']}"
                return f"Task {result['id']} has been updated successfully."
            else:
                # If no UUID found, try to find by title
                # Extract potential title after update/change/modify keywords
                title_patterns = [
                    r'(?:update|change|modify)\s+(?:task\s+)?(?:named\s+|with\s+name\s+|name:\s*)?(.+?)(?:\s+(?:to|and)|$)',
                    r'(?:update|change|modify)\s+(?:the\s+)?(?:task\s+)?(?:named\s+|with\s+name\s+|name:\s*)?(.+?)(?:\s+(?:to|and)|$)'
                ]

                extracted_title = None
                for pattern in title_patterns:
                    match = re.search(pattern, user_input, re.IGNORECASE)
                    if match:
                        extracted_title = match.group(1).strip()
                        break

                if not extracted_title:
                    # Check for completion request without explicit title
                    if any(word in lower_input for word in ['complete', 'done', 'finish', 'completed']):
                        # Try to find the most recent incomplete task
                        tasks = get_user_tasks_enhanced(user_id)
                        if isinstance(tasks, list) and len(tasks) > 0:
                            # Find the most recent incomplete task
                            for task in reversed(tasks):
                                if isinstance(task, dict) and not task.get('complete', False):
                                    result = update_task_enhanced(user_id, task['id'], complete=True)
                                    if isinstance(result, dict) and "error" in result:
                                        return f"Error updating task: {result['error']}"
                                    return f"Task '{task['title']}' has been marked as complete."

                if extracted_title:
                    # Find the task by title
                    tasks = get_user_tasks_enhanced(user_id)
                    if isinstance(tasks, list):
                        matching_task = None
                        for task in tasks:
                            if isinstance(task, dict) and task.get('title', '').lower() == extracted_title.lower():
                                matching_task = task
                                break

                        if matching_task:
                            # Check if user wants to mark as complete
                            if any(word in lower_input for word in ['complete', 'done', 'finish', 'completed']):
                                result = update_task_enhanced(user_id, matching_task['id'], complete=True)
                                if isinstance(result, dict) and "error" in result:
                                    return f"Error updating task: {result['error']}"
                                return f"Task '{matching_task['title']}' has been marked as complete."
                            else:
                                return f"To update task '{matching_task['title']}', please specify what you'd like to change. For example: 'Update task {matching_task['title']} to mark as complete'"
                        else:
                            return f"I couldn't find a task titled '{extracted_title}'. Could you please specify the exact task title or provide the task ID?"
                    else:
                        return f"Error accessing your tasks: {tasks.get('error', 'Unknown error')}"

                return "To update a task, please specify the task ID or exact title. For example: 'Update task 123 to mark as complete'"

        # Handle task deletion
        elif any(keyword in lower_input for keyword in ['delete', 'remove', 'cancel']):
            # First, try to find a proper UUID in the input
            uuid_pattern = r'[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}'
            id_match = re.search(uuid_pattern, user_input, re.IGNORECASE)

            if id_match:
                task_id = id_match.group(0)
                result = delete_task_enhanced(user_id, task_id)
                if isinstance(result, dict) and "error" in result:
                    return f"Error deleting task: {result['error']}"
                return f"{result['message']}."
            else:
                # If no UUID found, try to find by title
                # Extract potential title after delete/remove/cancel keywords
                title_patterns = [
                    r'(?:delete|remove|cancel)\s+(?:task\s+)?(?:named\s+|with\s+name\s+|name:\s*)?(.+)',
                    r'(?:delete|remove|cancel)\s+(?:the\s+)?(?:task\s+)?(?:named\s+|with\s+name\s+|name:\s*)?(.+)'
                ]

                extracted_title = None
                for pattern in title_patterns:
                    match = re.search(pattern, user_input, re.IGNORECASE)
                    if match:
                        extracted_title = match.group(1).strip()
                        break

                if extracted_title:
                    # Find the task by title
                    tasks = get_user_tasks_enhanced(user_id)
                    if isinstance(tasks, list):
                        matching_task = None
                        for task in tasks:
                            if isinstance(task, dict) and task.get('title', '').lower() == extracted_title.lower():
                                matching_task = task
                                break

                        if matching_task:
                            result = delete_task_enhanced(user_id, matching_task['id'])
                            if isinstance(result, dict) and "error" in result:
                                return f"Error deleting task: {result['error']}"
                            return f"{result['message']}."
                        else:
                            return f"I couldn't find a task titled '{extracted_title}'. Could you please specify the exact task title or provide the task ID?"
                    else:
                        return f"Error accessing your tasks: {tasks.get('error', 'Unknown error')}"

                return "To delete a task, please specify the task ID or exact title. For example: 'Delete task 123' or 'Delete task buy groceries'"

        # If none of the above, return None to indicate it's not a task-related command
        return None

    AGENTS_AVAILABLE = True
except ImportError as e:
    print(f"Google Generative AI library not available: {str(e)}")
    AGENTS_AVAILABLE = False

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
    """Send a message to the AI and get a response with conversation state maintained."""
    if not AGENTS_AVAILABLE:
        # Return a helpful error message instead of a generic 500 error
        error_response = "I'm sorry, but the AI assistant is currently unavailable. Please try again later."
        return ChatResponse(response=error_response, conversation_id=str(uuid.uuid4()))

    try:
        user_id_str = str(current_user_id)

        # Check if this is a task management command
        task_response = process_task_command(request.message, user_id_str)
        if task_response is not None and not task_response.startswith("I'd be happy") and not task_response.startswith("To "):
            # This was a recognized task command and processed
            return ChatResponse(response=task_response, conversation_id=request.conversation_id or str(uuid.uuid4()))

        # For non-task commands, use the Gemini API
        # Create a prompt that includes context about the task management system
        prompt = f"""
        You are a helpful Todo AI assistant powered by Google Gemini. You help users manage their tasks and productivity.

        The user has the following message: "{request.message}"

        If the user is asking about tasks, productivity, or wants to manage their tasks, you can help with:
        - Listing their tasks
        - Creating new tasks
        - Updating existing tasks
        - Deleting tasks

        For other questions, provide helpful responses related to productivity, time management, and general assistance.

        Keep your responses concise and helpful.
        """

        response_text = await call_gemini_api(prompt)

        return ChatResponse(
            response=response_text,
            conversation_id=request.conversation_id or str(uuid.uuid4())
        )
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
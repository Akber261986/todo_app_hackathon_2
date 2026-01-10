# AI Agent Service for Todo AI Chatbot

from typing import Dict, Any, Optional
from .task_service import TaskService
from .conversation_service import ConversationService
from ..models.task import Task
from ..models.conversation import Conversation
from agents import Agent, Runner
from agents.extensions.models.litellm_model import LitellmModel
import os


class AIAgentService:
    def __init__(self):
        self.task_service = TaskService()
        self.conversation_service = ConversationService()
        self.agent = None
        self.runner = Runner

    async def initialize(self):
        # Initialize services
        await self.task_service.initialize()
        await self.conversation_service.initialize()
        
        # Initialize the AI agent with Gemini model
        gemini_model = LitellmModel(
            model="gemini/gemini-2.5-flash",
            api_key=os.getenv("GEMINI_API_KEY"),
        )
        
        # Create the agent with instructions and tools
        self.agent = Agent(
            name="TodoAssistant",
            instructions="""You are a helpful, friendly, and efficient AI assistant specialized in managing the user's Todo list.

            You can help with the following actions using the appropriate tools:
            - Add new tasks
            - List all current tasks
            - Mark tasks as complete (or incomplete)
            - Update task details (title, description, etc.)
            - Delete tasks

            **Important guidelines:**
            - Always use the correct tool for each operation.
            - Be precise, polite, concise, and encouraging in your responses.
            - After successfully adding, updating, completing, or deleting a task, always include this reminder at the end of your reply:
            "I've updated your list! Please refresh or reload the page to see the latest changes."
            - **Greeting handling**: If the user greets you (e.g., "hi", "hello", "good morning", "salam", "hey", etc.), respond warmly with a matching greeting first, then gently guide the conversation back to tasks. Examples:
            - User: "Hi" → You: "Hi there! 😊 How can I help you with your tasks today?"
            - User: "Good morning" → You: "Good morning! ☀️ Ready to organize your day? What would you like to do with your Todo list?"
            - User: "Salam" → You: "Wa alaikum assalam! 😊 Let's get your tasks sorted — what would you like to do?"
            - If the user asks about anything unrelated to Todo management (jokes, weather, general chat, etc.), politely redirect:
            "I'm your personal Todo manager today! 😊 How can I help you with your tasks?"
            - Use clear, natural language. When confirming actions, include important details (e.g., task title, ID, or new status).
            - If the user's request is unclear, ask for clarification before using any tool.

            Your goal is to make task management simple, fast, and stress-free!""",
            model=gemini_model,
            # Tools will be added later when MCP server is implemented
        )

    async def process_message(self, user_id: str, conversation_id: Optional[int], message: str) -> Dict[str, Any]:
        """Process a user message and return the AI response"""
        if not self.agent:
            await self.initialize()
        
        # If no conversation ID provided, create a new one
        if not conversation_id:
            conversation = await self.conversation_service.create_conversation(user_id)
            conversation_id = conversation.id
        
        # Add user message to conversation
        await self.conversation_service.add_message(user_id, conversation_id, "user", message)
        
        # Get conversation history for context
        messages = await self.conversation_service.get_conversation_messages(conversation_id)
        
        # For now, return a simple response - in a real implementation,
        # this would call the AI agent with proper context
        response = f"Echo: {message}"
        
        # Add AI response to conversation
        await self.conversation_service.add_message(user_id, conversation_id, "assistant", response)
        
        return {
            "conversation_id": conversation_id,
            "response": response,
            "tool_calls": []
        }

    async def run_agent_with_tools(self, user_message: str) -> str:
        """Run the agent with MCP tools to process the user message"""
        if not self.agent:
            await self.initialize()
        
        # Run the agent with the user's message
        result = await self.runner.run(self.agent, user_message)
        return result.final_output

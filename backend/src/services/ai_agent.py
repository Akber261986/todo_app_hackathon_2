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
            instructions="You are a helpful assistant for managing todos. You can add, list, complete, update, and delete tasks. Use the appropriate tools for each operation.",
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

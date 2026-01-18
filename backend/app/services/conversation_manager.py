"""Conversation Manager for maintaining stateful AI agent conversations."""

import asyncio
import time
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, field
from datetime import datetime

try:
    from agents import Agent, Runner
    AGENTS_AVAILABLE = True
except ImportError:
    AGENTS_AVAILABLE = False
    Agent = None
    Runner = None


@dataclass
class Message:
    """Represents a message in the conversation."""
    role: str  # 'user' or 'assistant'
    content: str
    timestamp: float = field(default_factory=time.time)


@dataclass
class Conversation:
    """Represents a conversation with message history."""
    conversation_id: str
    user_id: str
    messages: List[Message] = field(default_factory=list)
    created_at: float = field(default_factory=time.time)
    last_accessed: float = field(default_factory=time.time)

    def add_message(self, role: str, content: str):
        """Add a message to the conversation."""
        message = Message(role=role, content=content)
        self.messages.append(message)
        self.last_accessed = time.time()

    def get_formatted_history(self) -> str:
        """Get the conversation history formatted for the AI agent."""
        if not self.messages:
            return ""

        formatted_messages = []
        for msg in self.messages:
            formatted_messages.append(f"[{msg.role.upper()}]: {msg.content}")

        return "\n".join(formatted_messages)


class ConversationManager:
    """Manages multiple conversations and maintains their state."""

    def __init__(self, agent: Any):
        self.agent = agent
        self.conversations: Dict[str, Conversation] = {}
        self._locks: Dict[str, asyncio.Lock] = {}

    def get_conversation_key(self, user_id: str, conversation_id: Optional[str] = None) -> str:
        """Generate a unique key for conversation tracking."""
        if conversation_id:
            return f"{user_id}:{conversation_id}"
        else:
            # Create a new conversation ID based on timestamp
            return f"{user_id}:{int(time.time() * 1000000)}"  # microseconds for uniqueness

    def get_or_create_conversation(self, user_id: str, conversation_id: Optional[str] = None) -> Conversation:
        """Get existing conversation or create a new one."""
        key = self.get_conversation_key(user_id, conversation_id)

        if key not in self.conversations:
            # Extract conversation ID from key
            conv_id = key.split(':')[1]
            self.conversations[key] = Conversation(
                conversation_id=conv_id,
                user_id=user_id
            )

        # Update last accessed time
        self.conversations[key].last_accessed = time.time()
        return self.conversations[key]

    def get_lock(self, key: str) -> asyncio.Lock:
        """Get or create a lock for a specific conversation."""
        if key not in self._locks:
            self._locks[key] = asyncio.Lock()
        return self._locks[key]

    async def process_message(self, user_id: str, message: str, conversation_id: Optional[str] = None) -> tuple[str, str]:
        """
        Process a message in the context of a conversation.

        Returns:
            Tuple of (response, conversation_id)
        """
        if not AGENTS_AVAILABLE or self.agent is None:
            return "AI agents library not available", conversation_id or str(int(time.time()))

        # Get or create conversation
        key = self.get_conversation_key(user_id, conversation_id)
        conversation = self.get_or_create_conversation(user_id, conversation_id)

        # Add user message to conversation
        conversation.add_message("user", message)

        # Get lock for this conversation to prevent race conditions
        lock = self.get_lock(key)

        async with lock:
            try:
                # Format the conversation history to provide context to the agent
                conversation_context = conversation.get_formatted_history()

                # For agents that maintain state, we would use the runner instance
                # that was initialized with the agent. However, if the agent doesn't
                # maintain conversation history internally, we need to provide the
                # full context each time.
                #
                # In this implementation, we'll provide the full conversation context
                # to ensure the agent has the necessary context for a coherent response
                full_prompt = f"{conversation_context}\n[USER]: {message}\n[ASSISTANT]:"

                # Run the agent with the full context using the static method
                result = await Runner.run(self.agent, full_prompt)
                response = result.final_output

                # Add assistant response to conversation
                conversation.add_message("assistant", response)

                return response, conversation.conversation_id

            except Exception as e:
                # Add error message to conversation
                error_msg = f"Sorry, I encountered an error: {str(e)}"
                conversation.add_message("assistant", error_msg)
                return error_msg, conversation.conversation_id

    async def cleanup_old_conversations(self, max_age_seconds: int = 3600):
        """Remove conversations older than max_age_seconds."""
        current_time = time.time()
        keys_to_remove = []

        for key, conversation in self.conversations.items():
            if current_time - conversation.last_accessed > max_age_seconds:
                keys_to_remove.append(key)

        for key in keys_to_remove:
            del self.conversations[key]
            if key in self._locks:
                del self._locks[key]


# Global conversation manager instance
conversation_manager: Optional[ConversationManager] = None


def get_conversation_manager(agent: Any) -> ConversationManager:
    """Get or create the global conversation manager."""
    global conversation_manager
    if conversation_manager is None:
        conversation_manager = ConversationManager(agent)
    return conversation_manager
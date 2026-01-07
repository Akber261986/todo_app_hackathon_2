# Conversation Service for Todo AI Chatbot

from typing import List, Optional
from ..models.conversation import Conversation
from ..models.message import Message
from ..database import get_db
import asyncpg
import datetime


class ConversationService:
    def __init__(self):
        self.pool = None

    async def initialize(self):
        self.pool = await get_db()

    async def create_conversation(self, user_id: str) -> Conversation:
        """Create a new conversation"""
        if not self.pool:
            await self.initialize()

        async with self.pool.acquire() as conn:
            result = await conn.fetchrow(
                """
                INSERT INTO conversations (user_id, created_at, updated_at)
                VALUES ($1, $2, $3)
                RETURNING id, user_id, created_at, updated_at
                """,
                user_id, datetime.datetime.utcnow(), datetime.datetime.utcnow()
            )

            return Conversation(
                id=result['id'],
                user_id=result['user_id'],
                created_at=result['created_at'],
                updated_at=result['updated_at']
            )

    async def get_conversation(self, conversation_id: int) -> Optional[Conversation]:
        """Get a conversation by ID"""
        if not self.pool:
            await self.initialize()

        async with self.pool.acquire() as conn:
            result = await conn.fetchrow(
                "SELECT id, user_id, created_at, updated_at FROM conversations WHERE id = $1",
                conversation_id
            )
            if result:
                return Conversation(
                    id=result['id'],
                    user_id=result['user_id'],
                    created_at=result['created_at'],
                    updated_at=result['updated_at']
                )
        return None

    async def get_user_conversations(self, user_id: str) -> List[Conversation]:
        """Get all conversations for a user"""
        if not self.pool:
            await self.initialize()

        async with self.pool.acquire() as conn:
            results = await conn.fetch(
                "SELECT id, user_id, created_at, updated_at FROM conversations WHERE user_id = $1 ORDER BY created_at DESC",
                user_id
            )

        conversations = []
        for result in results:
            conversation = Conversation(
                id=result['id'],
                user_id=result['user_id'],
                created_at=result['created_at'],
                updated_at=result['updated_at']
            )
            conversations.append(conversation)

        return conversations

    async def add_message(self, user_id: str, conversation_id: int, role: str, content: str) -> Message:
        """Add a message to a conversation"""
        if not self.pool:
            await self.initialize()

        async with self.pool.acquire() as conn:
            result = await conn.fetchrow(
                """
                INSERT INTO messages (user_id, conversation_id, role, content, created_at)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id, user_id, conversation_id, role, content, created_at
                """,
                user_id, conversation_id, role, content, datetime.datetime.utcnow()
            )

        return Message(
            id=result['id'],
            user_id=result['user_id'],
            conversation_id=result['conversation_id'],
            role=result['role'],
            content=result['content'],
            created_at=result['created_at']
        )

    async def get_conversation_messages(self, conversation_id: int) -> List[Message]:
        """Get all messages for a conversation"""
        if not self.pool:
            await self.initialize()

        async with self.pool.acquire() as conn:
            results = await conn.fetch(
                "SELECT id, user_id, conversation_id, role, content, created_at FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC",
                conversation_id
            )

        messages = []
        for result in results:
            message = Message(
                id=result['id'],
                user_id=result['user_id'],
                conversation_id=result['conversation_id'],
                role=result['role'],
                content=result['content'],
                created_at=result['created_at']
            )
            messages.append(message)

        return messages

    async def update_conversation(self, conversation_id: int) -> Optional[Conversation]:
        """Update a conversation's timestamp"""
        if not self.pool:
            await self.initialize()

        async with self.pool.acquire() as conn:
            result = await conn.fetchrow(
                """
                UPDATE conversations SET updated_at = $1 WHERE id = $2
                RETURNING id, user_id, created_at, updated_at
                """,
                datetime.datetime.utcnow(), conversation_id
            )

        if result:
            return Conversation(
                id=result['id'],
                user_id=result['user_id'],
                created_at=result['created_at'],
                updated_at=result['updated_at']
            )

        return None

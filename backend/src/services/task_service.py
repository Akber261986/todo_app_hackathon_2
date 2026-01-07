# Task Service for Todo AI Chatbot

from typing import List, Optional
from ..models.task import Task
from ..database import get_db
import asyncpg
import datetime


class TaskService:
    def __init__(self):
        self.pool = None

    async def initialize(self):
        self.pool = await get_db()

    async def create_task(self, user_id: str, title: str, description: Optional[str] = None) -> Task:
        """Create a new task"""
        if not self.pool:
            await self.initialize()

        async with self.pool.acquire() as conn:
            result = await conn.fetchrow(
                """
                INSERT INTO tasks (user_id, title, description, completed, created_at, updated_at)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id, user_id, title, description, completed, created_at, updated_at
                """,
                user_id, title, description, False, datetime.datetime.utcnow(), datetime.datetime.utcnow()
            )

            return Task(
                id=result['id'],
                user_id=result['user_id'],
                title=result['title'],
                description=result['description'],
                completed=result['completed'],
                created_at=result['created_at'],
                updated_at=result['updated_at']
            )

    async def get_task(self, task_id: int) -> Optional[Task]:
        """Get a task by ID"""
        if not self.pool:
            await self.initialize()

        async with self.pool.acquire() as conn:
            result = await conn.fetchrow(
                "SELECT id, user_id, title, description, completed, created_at, updated_at FROM tasks WHERE id = $1",
                task_id
            )
            if result:
                return Task(
                    id=result['id'],
                    user_id=result['user_id'],
                    title=result['title'],
                    description=result['description'],
                    completed=result['completed'],
                    created_at=result['created_at'],
                    updated_at=result['updated_at']
                )
        return None

    async def get_user_tasks(self, user_id: str, status: Optional[str] = None) -> List[Task]:
        """Get all tasks for a user, optionally filtered by status"""
        if not self.pool:
            await self.initialize()

        query = "SELECT id, user_id, title, description, completed, created_at, updated_at FROM tasks WHERE user_id = $1"
        params = [user_id]

        if status:
            if status == "completed":
                query += " AND completed = true"
            elif status == "pending":
                query += " AND completed = false"
            else:
                # For "all" status, no additional filter needed
                pass

        query += " ORDER BY created_at DESC"

        async with self.pool.acquire() as conn:
            results = await conn.fetch(query, *params)

        tasks = []
        for result in results:
            task = Task(
                id=result['id'],
                user_id=result['user_id'],
                title=result['title'],
                description=result['description'],
                completed=result['completed'],
                created_at=result['created_at'],
                updated_at=result['updated_at']
            )
            tasks.append(task)

        return tasks

    async def update_task(self, task_id: int, title: Optional[str] = None,
                         description: Optional[str] = None, completed: Optional[bool] = None) -> Optional[Task]:
        """Update a task"""
        if not self.pool:
            await self.initialize()

        # Get the current task to check if it exists
        current_task = await self.get_task(task_id)
        if not current_task:
            return None

        # Prepare update values
        update_fields = []
        params = []
        param_index = 1

        if title is not None:
            update_fields.append(f"title = ${param_index}")
            params.append(title)
            param_index += 1

        if description is not None:
            update_fields.append(f"description = ${param_index}")
            params.append(description)
            param_index += 1

        if completed is not None:
            update_fields.append(f"completed = ${param_index}")
            params.append(completed)
            param_index += 1

        # Always update the updated_at timestamp
        update_fields.append(f"updated_at = ${param_index}")
        params.append(datetime.datetime.utcnow())
        param_index += 1

        # Add the task_id for the WHERE clause
        update_fields_str = ", ".join(update_fields)
        params.append(task_id)

        async with self.pool.acquire() as conn:
            result = await conn.fetchrow(
                f"""
                UPDATE tasks SET {update_fields_str} WHERE id = ${param_index}
                RETURNING id, user_id, title, description, completed, created_at, updated_at
                """,
                *params
            )

        if result:
            return Task(
                id=result['id'],
                user_id=result['user_id'],
                title=result['title'],
                description=result['description'],
                completed=result['completed'],
                created_at=result['created_at'],
                updated_at=result['updated_at']
            )

        return None

    async def delete_task(self, task_id: int) -> bool:
        """Delete a task"""
        if not self.pool:
            await self.initialize()

        async with self.pool.acquire() as conn:
            result = await conn.fetchval(
                "DELETE FROM tasks WHERE id = $1 RETURNING 1",
                task_id
            )

        return result is not None

    async def complete_task(self, task_id: int) -> Optional[Task]:
        """Mark a task as completed"""
        return await self.update_task(task_id, completed=True)

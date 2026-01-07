# MCP Server for Todo AI Chatbot

import asyncio
from agents.mcp.server import MCPServer
from agents.mcp.util import create_tool_definition
from typing import Dict, Any


class TodoMCPServer:
    def __init__(self):
        self.server = MCPServer()
        self.register_tools()

    def register_tools(self):
        """Register all MCP tools"""
        # Register add_task tool
        self.server.register_tool(
            name="add_task",
            description="Create a new task",
            input_schema={
                "type": "object",
                "properties": {
                    "user_id": {"type": "string", "description": "The user's identifier"},
                    "title": {"type": "string", "description": "The title of the task"},
                    "description": {"type": "string", "description": "Optional description of the task"}
                },
                "required": ["user_id", "title"]
            },
            handler=self.add_task_handler
        )

        # Register list_tasks tool
        self.server.register_tool(
            name="list_tasks",
            description="Retrieve tasks from the list",
            input_schema={
                "type": "object",
                "properties": {
                    "user_id": {"type": "string", "description": "The user's identifier"},
                    "status": {"type": "string", "enum": ["all", "pending", "completed"], "default": "all"}
                },
                "required": ["user_id"]
            },
            handler=self.list_tasks_handler
        )

        # Register complete_task tool
        self.server.register_tool(
            name="complete_task",
            description="Mark a task as complete",
            input_schema={
                "type": "object",
                "properties": {
                    "user_id": {"type": "string", "description": "The user's identifier"},
                    "task_id": {"type": "integer", "description": "The ID of the task to complete"}
                },
                "required": ["user_id", "task_id"]
            },
            handler=self.complete_task_handler
        )

        # Register delete_task tool
        self.server.register_tool(
            name="delete_task",
            description="Remove a task from the list",
            input_schema={
                "type": "object",
                "properties": {
                    "user_id": {"type": "string", "description": "The user's identifier"},
                    "task_id": {"type": "integer", "description": "The ID of the task to delete"}
                },
                "required": ["user_id", "task_id"]
            },
            handler=self.delete_task_handler
        )

        # Register update_task tool
        self.server.register_tool(
            name="update_task",
            description="Modify task title or description",
            input_schema={
                "type": "object",
                "properties": {
                    "user_id": {"type": "string", "description": "The user's identifier"},
                    "task_id": {"type": "integer", "description": "The ID of the task to update"},
                    "title": {"type": "string", "description": "New title for the task (optional)"},
                    "description": {"type": "string", "description": "New description for the task (optional)"}
                },
                "required": ["user_id", "task_id"]
            },
            handler=self.update_task_handler
        )

    async def add_task_handler(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Handle add_task requests"""
        import sys
        import os
        sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', 'backend', 'src'))
        from services.task_service import TaskService

        task_service = TaskService()
        await task_service.initialize()

        user_id = params.get("user_id")
        title = params.get("title")
        description = params.get("description")

        task = await task_service.create_task(user_id, title, description)

        return {
            "task_id": task.id,
            "status": "created",
            "title": task.title
        }

    async def list_tasks_handler(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Handle list_tasks requests"""
        import sys
        import os
        sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', 'backend', 'src'))
        from services.task_service import TaskService

        task_service = TaskService()
        await task_service.initialize()

        user_id = params.get("user_id")
        status = params.get("status", "all")

        tasks = await task_service.get_user_tasks(user_id, status)

        return [
            {
                "id": task.id,
                "title": task.title,
                "completed": task.completed
            }
            for task in tasks
        ]

    async def complete_task_handler(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Handle complete_task requests"""
        import sys
        import os
        sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', 'backend', 'src'))
        from services.task_service import TaskService

        task_service = TaskService()
        await task_service.initialize()

        task_id = params.get("task_id")

        task = await task_service.complete_task(task_id)

        if task:
            return {
                "task_id": task.id,
                "status": "completed",
                "title": task.title
            }
        else:
            raise ValueError(f"Task with id {task_id} not found")

    async def delete_task_handler(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Handle delete_task requests"""
        import sys
        import os
        sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', 'backend', 'src'))
        from services.task_service import TaskService

        task_service = TaskService()
        await task_service.initialize()

        task_id = params.get("task_id")

        success = await task_service.delete_task(task_id)

        if success:
            # Get the deleted task to return its details
            # This is a simplified implementation
            return {
                "task_id": task_id,
                "status": "deleted",
                "title": "Deleted task"  # In a real implementation, you'd fetch the title before deletion
            }
        else:
            raise ValueError(f"Task with id {task_id} not found")

    async def update_task_handler(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Handle update_task requests"""
        import sys
        import os
        sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', 'backend', 'src'))
        from services.task_service import TaskService

        task_service = TaskService()
        await task_service.initialize()

        task_id = params.get("task_id")
        title = params.get("title")
        description = params.get("description")

        task = await task_service.update_task(task_id, title, description)

        if task:
            return {
                "task_id": task.id,
                "status": "updated",
                "title": task.title
            }
        else:
            raise ValueError(f"Task with id {task_id} not found")

    async def start(self, host: str = "localhost", port: int = 8001):
        """Start the MCP server"""
        await self.server.start(host, port)
        print(f"MCP Server running on {host}:{port}")

    async def stop(self):
        """Stop the MCP server"""
        await self.server.stop()


# For running the server directly
if __name__ == "__main__":
    server = TodoMCPServer()
    try:
        asyncio.run(server.start())
    except KeyboardInterrupt:
        print("Shutting down MCP server...")
        asyncio.run(server.stop())
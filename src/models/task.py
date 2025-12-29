"""
Task model for the Console Todo App.

This module defines the Task class which represents a single todo item
with validation rules as specified in the data model.
"""
from datetime import datetime
from typing import Optional


class Task:
    """
    The core entity representing a single todo item.

    Attributes:
        id (int): Auto-incremented unique identifier for the task
        title (str): Required title of the task (1-100 characters)
        description (str): Optional description of the task (0-500 characters)
        status (str): Status of the task, either "complete" or "incomplete"
        created_at (datetime): Timestamp when the task was created
    """

    def __init__(self, task_id: int, title: str, description: str = "", status: str = "incomplete"):
        """
        Initialize a new Task instance.

        Args:
            task_id (int): The unique identifier for the task
            title (str): The title of the task (1-100 characters)
            description (str): Optional description of the task (0-500 characters)
            status (str): Status of the task, either "complete" or "incomplete"

        Raises:
            ValueError: If validation rules are not met
        """
        self.id = self._validate_id(task_id)
        self.title = self._validate_title(title)
        self.description = self._validate_description(description)
        self.status = self._validate_status(status)
        self.created_at = datetime.now()

    def _validate_id(self, task_id: int) -> int:
        """Validate the task ID."""
        if not isinstance(task_id, int) or task_id <= 0:
            raise ValueError("Task ID must be a positive integer")
        return task_id

    def _validate_title(self, title: str) -> str:
        """Validate the task title."""
        if not isinstance(title, str):
            raise ValueError("Task title must be a string")
        if len(title) < 1 or len(title) > 100:
            raise ValueError("Task title must be between 1 and 100 characters")
        return title

    def _validate_description(self, description: str) -> str:
        """Validate the task description."""
        if not isinstance(description, str):
            raise ValueError("Task description must be a string")
        if len(description) > 500:
            raise ValueError("Task description must be 500 characters or less")
        return description

    def _validate_status(self, status: str) -> str:
        """Validate the task status."""
        if not isinstance(status, str):
            raise ValueError("Task status must be a string")
        if status not in ["complete", "incomplete"]:
            raise ValueError("Task status must be either 'complete' or 'incomplete'")
        return status

    def mark_complete(self):
        """Mark the task as complete."""
        self.status = "complete"

    def mark_incomplete(self):
        """Mark the task as incomplete."""
        self.status = "incomplete"

    def update(self, title: Optional[str] = None, description: Optional[str] = None):
        """
        Update the task title and/or description.

        Args:
            title (Optional[str]): New title for the task
            description (Optional[str]): New description for the task
        """
        if title is not None:
            self.title = self._validate_title(title)
        if description is not None:
            self.description = self._validate_description(description)

    def to_dict(self) -> dict:
        """
        Convert the task to a dictionary representation.

        Returns:
            dict: Dictionary representation of the task
        """
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "status": self.status,
            "created_at": self.created_at.isoformat()
        }

    def __repr__(self) -> str:
        """String representation of the task."""
        return f"Task(id={self.id}, title='{self.title}', status='{self.status}')"

    def __eq__(self, other) -> bool:
        """Check equality with another task."""
        if not isinstance(other, Task):
            return False
        return self.id == other.id
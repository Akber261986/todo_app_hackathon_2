"""
TodoList service for the Console Todo App.

This module defines the TodoList class which manages a collection
of Task objects in-memory with all required CRUD operations.
"""
from typing import List, Optional
from datetime import datetime
from ..models.task import Task


class TodoList:
    """
    Collection of Task entities stored in-memory with CRUD operations.

    Attributes:
        tasks (List[Task]): Collection of Task objects
        next_id (int): Counter for auto-incrementing task IDs
        max_title_length (int): Maximum allowed length for task titles (100)
        max_description_length (int): Maximum allowed length for task descriptions (500)
    """

    def __init__(self):
        """Initialize a new TodoList instance."""
        self.tasks: List[Task] = []
        self.next_id: int = 1
        self.max_title_length: int = 100
        self.max_description_length: int = 500

    def add_task(self, title: str, description: str = "") -> Task:
        """
        Add a new task to the list with auto-incremented ID.

        Args:
            title (str): Required title of the task (1-100 characters)
            description (str): Optional description of the task (0-500 characters)

        Returns:
            Task: The newly created Task object

        Raises:
            ValueError: If validation rules are not met
        """
        task = Task(
            task_id=self.next_id,
            title=title,
            description=description,
            status="incomplete"
        )
        self.tasks.append(task)
        self.next_id += 1
        return task

    def get_task_by_id(self, task_id: int) -> Optional[Task]:
        """
        Get a task by its ID.

        Args:
            task_id (int): The ID of the task to retrieve

        Returns:
            Optional[Task]: The task if found, None otherwise
        """
        for task in self.tasks:
            if task.id == task_id:
                return task
        return None

    def get_all_tasks(self) -> List[Task]:
        """
        Get all tasks in the list.

        Returns:
            List[Task]: List of all Task objects
        """
        return self.tasks.copy()

    def update_task(self, task_id: int, title: Optional[str] = None, description: Optional[str] = None) -> bool:
        """
        Update an existing task by ID with new title and/or description.

        Args:
            task_id (int): The ID of the task to update
            title (Optional[str]): New title for the task
            description (Optional[str]): New description for the task

        Returns:
            bool: True if task was updated, False if task was not found
        """
        task = self.get_task_by_id(task_id)
        if task is None:
            return False

        task.update(title, description)
        return True

    def mark_complete(self, task_id: int) -> bool:
        """
        Mark a task as complete by ID.

        Args:
            task_id (int): The ID of the task to mark as complete

        Returns:
            bool: True if task was marked complete, False if task was not found
        """
        task = self.get_task_by_id(task_id)
        if task is None:
            return False

        task.mark_complete()
        return True

    def mark_incomplete(self, task_id: int) -> bool:
        """
        Mark a task as incomplete by ID.

        Args:
            task_id (int): The ID of the task to mark as incomplete

        Returns:
            bool: True if task was marked incomplete, False if task was not found
        """
        task = self.get_task_by_id(task_id)
        if task is None:
            return False

        task.mark_incomplete()
        return True

    def delete_task(self, task_id: int) -> bool:
        """
        Delete a task by ID.

        Args:
            task_id (int): The ID of the task to delete

        Returns:
            bool: True if task was deleted, False if task was not found
        """
        task = self.get_task_by_id(task_id)
        if task is None:
            return False

        self.tasks.remove(task)
        return True

    def toggle_task_status(self, task_id: int) -> bool:
        """
        Toggle the status of a task between complete and incomplete.

        Args:
            task_id (int): The ID of the task to toggle

        Returns:
            bool: True if task status was toggled, False if task was not found
        """
        task = self.get_task_by_id(task_id)
        if task is None:
            return False

        if task.status == "complete":
            task.mark_incomplete()
        else:
            task.mark_complete()
        return True

    def get_task_count(self) -> int:
        """
        Get the total number of tasks.

        Returns:
            int: The number of tasks in the list
        """
        return len(self.tasks)

    def get_completed_tasks(self) -> List[Task]:
        """
        Get all completed tasks.

        Returns:
            List[Task]: List of completed Task objects
        """
        return [task for task in self.tasks if task.status == "complete"]

    def get_incomplete_tasks(self) -> List[Task]:
        """
        Get all incomplete tasks.

        Returns:
            List[Task]: List of incomplete Task objects
        """
        return [task for task in self.tasks if task.status == "incomplete"]
#!/usr/bin/env python3
"""
Test script to verify the Todo application functionality.
"""
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__)))

from src.ui.console_menu import ConsoleMenu
from src.services.todo_list import TodoList
from src.models.task import Task


def test_task_creation():
    """Test Task class functionality."""
    print("Testing Task creation...")
    task = Task(1, "Test task", "Test description", "incomplete")
    assert task.id == 1
    assert task.title == "Test task"
    assert task.description == "Test description"
    assert task.status == "incomplete"
    print("[PASS] Task creation works")


def test_todo_list():
    """Test TodoList functionality."""
    print("Testing TodoList operations...")
    todo_list = TodoList()

    # Test adding a task
    task = todo_list.add_task("Test task", "Test description")
    assert task.id == 1
    assert task.title == "Test task"
    assert task.status == "incomplete"

    # Test getting all tasks
    tasks = todo_list.get_all_tasks()
    assert len(tasks) == 1

    # Test updating a task
    success = todo_list.update_task(1, "Updated task", "Updated description")
    assert success == True
    updated_task = todo_list.get_task_by_id(1)
    assert updated_task.title == "Updated task"

    # Test marking complete
    success = todo_list.mark_complete(1)
    assert success == True
    completed_task = todo_list.get_task_by_id(1)
    assert completed_task.status == "complete"

    print("[PASS] TodoList operations work")


def test_console_menu():
    """Test ConsoleMenu structure."""
    print("Testing ConsoleMenu structure...")
    menu = ConsoleMenu()
    assert hasattr(menu, 'todo_list')
    assert hasattr(menu, 'running')
    assert hasattr(menu, 'add_task')
    assert hasattr(menu, 'delete_task')
    assert hasattr(menu, 'update_task')
    assert hasattr(menu, 'view_tasks')
    assert hasattr(menu, 'mark_task_status')
    print("[PASS] ConsoleMenu structure is correct")


if __name__ == "__main__":
    print("Running tests for Todo Application...")
    test_task_creation()
    test_todo_list()
    test_console_menu()
    print("All tests passed! [SUCCESS]")
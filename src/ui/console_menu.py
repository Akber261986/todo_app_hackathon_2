"""
Console Menu interface for the Todo App with rich and questionary.

This module provides an enhanced user interface for the console-based todo application
with beautiful UI using rich and questionary libraries.
"""
from typing import Optional
import questionary
from rich.console import Console
from rich.table import Table
from rich.prompt import Prompt, IntPrompt
from rich import print
from rich.panel import Panel
from rich.text import Text
from src.services.todo_list import TodoList


class ConsoleMenu:
    """
    Console-based menu interface for the Todo application using rich and questionary.

    Provides a beautiful menu-driven interface with options 1-6 for all required operations.
    """

    def __init__(self):
        """Initialize the console menu with a TodoList instance."""
        self.todo_list = TodoList()
        self.running = True
        self.console = Console()

    def display_menu(self):
        """Display the main menu options using rich."""
        self.console.print("\n", end="")
        self.console.rule("[bold blue]CONSOLE TODO APPLICATION[/bold blue]", style="bold blue")
        self.console.print(Panel(
            "[bold]Choose an option:[/bold]\n\n"
            "[1] Add Task\n"
            "[2] Delete Task\n"
            "[3] Update Task\n"
            "[4] View All Tasks\n"
            "[5] Mark Task Complete/Incomplete\n"
            "[6] Quit",
            title="[bold]Menu Options[/bold]",
            border_style="green"
        ))

    def get_user_choice(self) -> int:
        """
        Get user menu choice using questionary.

        Returns:
            int: Valid menu choice between 1-6
        """
        choice = questionary.select(
            "What would you like to do?",
            choices=[
                {"name": "Add Task", "value": 1},
                {"name": "Delete Task", "value": 2},
                {"name": "Update Task", "value": 3},
                {"name": "View All Tasks", "value": 4},
                {"name": "Mark Task Complete/Incomplete", "value": 5},
                {"name": "Quit", "value": 6}
            ]
        ).ask()

        return choice if choice is not None else 6  # Default to quit if cancelled

    def get_task_id(self) -> int:
        """
        Get and validate task ID from user using rich prompts.

        Returns:
            int: Valid task ID
        """
        while True:
            try:
                task_id = IntPrompt.ask("[bold green]Enter task ID[/bold green]", default=1)
                if task_id > 0:
                    return task_id
                else:
                    self.console.print("[bold red]Error: Task ID must be a positive integer.[/bold red]")
            except ValueError:
                self.console.print("[bold red]Error: Please enter a valid number for task ID.[/bold red]")

    def add_task(self):
        """Handle adding a new task with rich UI."""
        self.console.print(Panel("[bold]Add New Task[/bold]", border_style="blue"))

        title = Prompt.ask("[bold]Enter task title[/bold]")

        if not title.strip():
            self.console.print("[bold red]Error: Title is required.[/bold red]")
            return

        description = Prompt.ask("[bold]Enter task description (optional)[/bold]", default="")

        try:
            task = self.todo_list.add_task(title.strip(), description.strip())
            self.console.print(f"[bold green]✓ Success: Task added with ID {task.id}[/bold green]")
        except ValueError as e:
            self.console.print(f"[bold red]✗ Error: {e}[/bold red]")

    def delete_task(self):
        """Handle deleting a task with rich UI."""
        self.console.print(Panel("[bold]Delete Task[/bold]", border_style="red"))

        if self.todo_list.get_task_count() == 0:
            self.console.print("[bold yellow]No tasks available to delete.[/bold yellow]")
            return

        task_id = self.get_task_id()
        task = self.todo_list.get_task_by_id(task_id)

        if task is None:
            self.console.print(f"[bold red]✗ Error: Task with ID {task_id} not found.[/bold red]")
            return

        success = self.todo_list.delete_task(task_id)
        if success:
            self.console.print(f"[bold green]✓ Success: Task with ID {task_id} deleted.[/bold green]")
        else:
            self.console.print(f"[bold red]✗ Error: Failed to delete task with ID {task_id}.[/bold red]")

    def update_task(self):
        """Handle updating a task with rich UI."""
        self.console.print(Panel("[bold]Update Task[/bold]", border_style="yellow"))

        if self.todo_list.get_task_count() == 0:
            self.console.print("[bold yellow]No tasks available to update.[/bold yellow]")
            return

        task_id = self.get_task_id()
        task = self.todo_list.get_task_by_id(task_id)

        if task is None:
            self.console.print(f"[bold red]✗ Error: Task with ID {task_id} not found.[/bold red]")
            return

        self.console.print(f"[bold]Current task:[/bold] {task.title}")
        new_title = Prompt.ask(f"[bold]Enter new title (current: '{task.title}')[/bold]", default=task.title)

        if new_title == task.title:
            new_title = None  # Keep current title

        self.console.print(f"[bold]Current description:[/bold] {task.description}")
        new_description = Prompt.ask(f"[bold]Enter new description (current: '{task.description}')[/bold]", default=task.description)

        if new_description == task.description:
            new_description = None  # Keep current description

        success = self.todo_list.update_task(task_id, new_title, new_description)
        if success:
            self.console.print(f"[bold green]✓ Success: Task with ID {task_id} updated.[/bold green]")
        else:
            self.console.print(f"[bold red]✗ Error: Failed to update task with ID {task_id}.[/bold red]")

    def view_tasks(self):
        """Handle viewing all tasks with rich table."""
        self.console.print(Panel("[bold]All Tasks[/bold]", border_style="cyan"))
        tasks = self.todo_list.get_all_tasks()

        if not tasks:
            self.console.print("[bold yellow]No tasks available.[/bold yellow]")
            return

        # Create a rich table
        table = Table(title="Task List", show_header=True, header_style="bold magenta")
        table.add_column("ID", style="dim", width=5)
        table.add_column("Title", min_width=15)
        table.add_column("Description", min_width=20)
        table.add_column("Status", justify="center")

        # Add each task to the table
        for task in tasks:
            status_style = "green" if task.status == "complete" else "red"
            status_text = f"[{task.status.upper()}]"
            if task.status == "complete":
                status_text = f"[bold green]{status_text}[/bold green]"
            else:
                status_text = f"[bold red]{status_text}[/bold red]"

            table.add_row(
                str(task.id),
                task.title,
                task.description if task.description else "[italic]No description[/italic]",
                status_text
            )

        self.console.print(table)

    def mark_task_status(self):
        """Handle marking a task as complete/incomplete with rich UI."""
        self.console.print(Panel("[bold]Mark Task Complete/Incomplete[/bold]", border_style="magenta"))

        if self.todo_list.get_task_count() == 0:
            self.console.print("[bold yellow]No tasks available to mark.[/bold yellow]")
            return

        task_id = self.get_task_id()
        task = self.todo_list.get_task_by_id(task_id)

        if task is None:
            self.console.print(f"[bold red]✗ Error: Task with ID {task_id} not found.[/bold red]")
            return

        current_status = task.status
        new_status = "incomplete" if current_status == "complete" else "complete"

        success = self.todo_list.toggle_task_status(task_id)
        if success:
            self.console.print(f"[bold green]✓ Success: Task with ID {task_id} marked as {new_status}.[/bold green]")
        else:
            self.console.print(f"[bold red]✗ Error: Failed to update task status for ID {task_id}.[/bold red]")

    def run(self):
        """Run the main menu loop."""
        self.console.print(Panel("[bold green]Welcome to the Console Todo Application![/bold green]", border_style="green"))

        while self.running:
            self.display_menu()
            choice = self.get_user_choice()

            if choice == 1:
                self.add_task()
            elif choice == 2:
                self.delete_task()
            elif choice == 3:
                self.update_task()
            elif choice == 4:
                self.view_tasks()
            elif choice == 5:
                self.mark_task_status()
            elif choice == 6:
                self.console.print("[bold green]Thank you for using the Console Todo Application. Goodbye![/bold green]")
                self.running = False

            # Pause to let user see the result before showing menu again
            if choice != 6:  # Don't pause if quitting
                self.console.input("\n[bold]Press ENTER to continue...[/bold]")

    def quit(self):
        """Quit the application."""
        self.running = False
        self.console.print("[bold red]Application closed.[/bold red]")
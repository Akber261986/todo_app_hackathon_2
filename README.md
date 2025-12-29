# Console Todo Application - Hackathon Project

This is a console-based todo application developed as part of a hackathon project. It follows a specification-driven development approach with clean architecture principles.

## Features

- Add new tasks with title and optional description
- View all tasks in a formatted table
- Update existing tasks
- Delete tasks
- Mark tasks as complete/incomplete
- Menu-driven interface with options 1-6

## Architecture

The application follows a clean architecture pattern:

- `src/models/task.py` - Task entity with validation
- `src/services/todo_list.py` - Business logic for task operations
- `src/ui/console_menu.py` - Console interface
- `src/main.py` - Application entry point

## Requirements

- Python 3.13+
- Standard library only (no external dependencies for Phase I)

## How to Run

```bash
cd hackathon-todo
python src/main.py
```

## Project Structure

```
hackathon-todo/
├── specs/                 # Specification documents
│   ├── constitution.md    # Project constitution
│   ├── plan.md           # Implementation plan
│   ├── data-model.md     # Data model specification
│   ├── research.md       # Research decisions
│   └── features/         # Feature specifications
│       └── task-crud.md  # Task CRUD specification
├── src/                  # Source code
│   ├── models/           # Data models
│   │   └── task.py      # Task class
│   ├── services/         # Business logic
│   │   └── todo_list.py # TodoList class
│   ├── ui/              # User interface
│   │   └── console_menu.py # Console menu
│   └── main.py          # Application entry point
├── test_todo_app.py      # Test script
└── README.md            # This file
```

## Testing

To run the tests:

```bash
python test_todo_app.py
```

## Phase I Implementation

This implementation completes Phase I requirements with:

- Task model with validation (id, title, description, status)
- In-memory storage using TodoList class
- Menu-driven console interface with options 1-6
- Complete CRUD operations
- Error handling for invalid inputs
- Auto-incrementing task IDs
- Formatted table display of tasks
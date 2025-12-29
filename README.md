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

- Python 3.11+
- Dependencies listed in `pyproject.toml`

## How to Run

There are two ways to run the application:

### Method 1: Using run_app.py (Recommended)
```bash
python run_app.py
```

### Method 2: Using main.py directly
```bash
python src/main.py
```

## Project Structure

```
todo_app_hackathon_2/
├── .claude/               # Claude Code configuration
├── .specify/              # Specification kit templates
├── .spec-kit/             # Specification kit files
├── history/               # Prompt history records
├── specs/                 # Specification documents
│   ├── constitution.md    # Project constitution
│   ├── data-model.md      # Data model specification
│   ├── overview.md        # Project overview
│   ├── plan.md            # Implementation plan
│   ├── research.md        # Research decisions
│   └── features/          # Feature specifications
├── src/                   # Source code
│   ├── __init__.py
│   ├── main.py            # Application entry point
│   ├── models/            # Data models
│   │   ├── __init__.py
│   │   └── task.py        # Task class
│   ├── services/          # Business logic
│   │   ├── __init__.py
│   │   └── todo_list.py   # TodoList class
│   └── ui/                # User interface
│       ├── __init__.py
│       └── console_menu.py # Console menu interface
├── test_todo_app.py       # Test script
├── run_app.py             # Application runner script
├── pyproject.toml         # Project dependencies and configuration
└── README.md              # This file
```

## Dependencies

The project uses the following dependencies (defined in `pyproject.toml`):
- FastAPI
- uvicorn
- SQLAlchemy
- asyncpg
- Pydantic
- python-multipart
- passlib[bcrypt]
- python-jose[cryptography]
- pytest
- httpx
- And development tools (black, flake8, mypy, etc.)

## Testing

To run the tests:

```bash
python test_todo_app.py
```

Or using pytest:
```bash
pytest test_todo_app.py
```

## Project Status

This implementation includes:

- Task model with validation (id, title, description, status)
- In-memory storage using TodoList class
- Menu-driven console interface with options 1-6
- Complete CRUD operations
- Error handling for invalid inputs
- Auto-incrementing task IDs
- Formatted table display of tasks
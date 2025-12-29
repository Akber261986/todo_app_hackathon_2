# Data Model: Phase I Console Todo App

## Task Entity

**Task**: The core entity representing a single todo item

- **id**: int - Auto-incremented unique identifier for the task
- **title**: str - Required title of the task (1-100 characters)
- **description**: str - Optional description of the task (0-500 characters)
- **status**: str - Status of the task, either "complete" or "incomplete"
- **created_at**: datetime - Timestamp when the task was created

**Validation rules**:
- id must be a positive integer
- title must be between 1 and 100 characters
- description can be empty or between 1 and 500 characters
- status must be either "complete" or "incomplete"

## TaskList Entity

**TaskList**: Collection of Task entities stored in-memory

- **tasks**: List[Task] - Collection of Task objects
- **next_id**: int - Counter for auto-incrementing task IDs
- **max_title_length**: int - Maximum allowed length for task titles (100)
- **max_description_length**: int - Maximum allowed length for task descriptions (500)

**Validation rules**:
- next_id must be incremented for each new task
- TaskList operations must maintain data integrity
- All operations must be thread-safe (if needed in future phases)

## Relationship between entities

The TaskList contains multiple Task entities and manages their lifecycle (creation, retrieval, update, deletion). Each Task has a unique ID within the TaskList and follows the validation rules defined above.

## State transitions

- Task status can transition from "incomplete" to "complete" and vice versa through the mark complete/incomplete functionality
- Task properties can be updated while maintaining the validation rules
- Tasks can be added (with auto-incremented ID) or removed from the TaskList
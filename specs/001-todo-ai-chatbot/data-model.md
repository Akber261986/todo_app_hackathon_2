# Data Model: Todo AI Chatbot

## Entity: Task
**Description**: Represents a user's to-do item

**Fields**:
- `id` (integer): Unique identifier for the task
- `user_id` (string): Identifier for the user who owns the task
- `title` (string): Title of the task (required)
- `description` (string): Optional description of the task
- `completed` (boolean): Status of the task (default: false)
- `created_at` (datetime): Timestamp when task was created
- `updated_at` (datetime): Timestamp when task was last updated

**Validation Rules**:
- `user_id` is required and must match authenticated user
- `title` is required and must be 1-255 characters
- `completed` defaults to false if not specified
- `created_at` is automatically set on creation
- `updated_at` is automatically updated on modification

## Entity: Conversation
**Description**: Represents a chat session between user and AI assistant

**Fields**:
- `id` (integer): Unique identifier for the conversation
- `user_id` (string): Identifier for the user who owns the conversation
- `created_at` (datetime): Timestamp when conversation was started
- `updated_at` (datetime): Timestamp when conversation was last updated

**Validation Rules**:
- `user_id` is required and must match authenticated user
- `created_at` is automatically set on creation
- `updated_at` is automatically updated on any message addition

## Entity: Message
**Description**: Represents a message in a conversation

**Fields**:
- `id` (integer): Unique identifier for the message
- `user_id` (string): Identifier for the user who owns the message
- `conversation_id` (integer): Reference to the conversation this message belongs to
- `role` (string): Role of the message sender ("user" or "assistant")
- `content` (string): Content of the message
- `created_at` (datetime): Timestamp when message was created

**Validation Rules**:
- `user_id` is required and must match authenticated user
- `conversation_id` is required and must reference existing conversation
- `role` must be either "user" or "assistant"
- `content` is required and must be 1-10000 characters
- `created_at` is automatically set on creation

## Relationships
- One Conversation can have many Messages (1 to many)
- One User can have many Conversations (1 to many)
- One User can have many Tasks (1 to many)
- One Conversation can have many Messages (1 to many)

## Constraints
- All entities are isolated by `user_id` to ensure data privacy between users
- Foreign key constraints ensure referential integrity
- All timestamps are stored in UTC
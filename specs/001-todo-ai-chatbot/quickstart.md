# Quickstart Guide: Todo AI Chatbot

## Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL database
- OpenAI API key
- Better Auth secret key

## Setup Instructions

### 1. Clone and Navigate to Repository
```bash
git clone <repository-url>
cd <repository-name>
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
```

### 3. Database Setup
```bash
# Run database migrations
python -m src.database.migrate

# Or set up PostgreSQL manually with the required schema
```

### 4. MCP Server Setup
```bash
# Navigate to MCP server directory
cd mcp-server

# Install dependencies
pip install -r requirements.txt

# Start the MCP server
python -m src.server
```

### 5. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start the development server
npm run dev
```

### 6. Environment Variables

#### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/todo_chatbot
OPENAI_API_KEY=your_openai_api_key
BETTER_AUTH_SECRET=your_auth_secret
```

#### Frontend (.env)
```
NEXT_PUBLIC_OPENAI_DOMAIN_KEY=your_domain_key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Running the Application

### 1. Start MCP Server
```bash
cd mcp-server
python -m src.server
```

### 2. Start Backend
```bash
cd backend
python -m src.main
```

### 3. Start Frontend
```bash
cd frontend
npm run dev
```

## API Endpoints

### Chat API
- `POST /api/{user_id}/chat` - Send message and get AI response

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

## Testing
```bash
# Backend tests
cd backend
python -m pytest tests/

# Frontend tests
cd frontend
npm test
```

## MCP Tools Available
- `add_task` - Create a new task
- `list_tasks` - Retrieve tasks from the list
- `complete_task` - Mark a task as complete
- `delete_task` - Remove a task from the list
- `update_task` - Modify task title or description
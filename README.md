# Full-Stack Todo Application - Hackathon II Project

This is a multi-user full-stack todo application developed as part of a hackathon project. It follows a specification-driven development approach with clean architecture principles. The application features a Next.js frontend, FastAPI backend, Neon DB storage, and JWT authentication with Better Auth.

## Features

- Multi-user support with authentication and user isolation
- JWT-based authentication with Better Auth
- Task management with CRUD operations
- Responsive UI with Next.js App Router
- Persistent storage with Neon DB
- User registration and login
- Create, read, update, and delete tasks
- Mark tasks as complete/incomplete
- Secure token-based authentication

## Architecture

The application follows a clean architecture pattern:

- `frontend/` - Next.js frontend with App Router
- `backend/` - FastAPI backend with SQLModel ORM
- `backend/app/models/` - SQLModel database models
- `backend/app/schemas/` - Pydantic schemas for request/response validation
- `backend/app/api/v1/` - API routes for authentication and tasks
- `backend/app/auth/` - JWT authentication middleware
- `frontend/app/(auth)/` - Authentication pages (signup/signin)
- `frontend/app/dashboard/` - Main dashboard with task management
- `frontend/components/ui/` - Reusable UI components
- `frontend/lib/` - Shared utilities and types

## Requirements

- Node.js 18+ (for frontend)
- Python 3.11+ (for backend)
- PostgreSQL-compatible database (Neon DB recommended)
- Docker and Docker Compose (for containerized deployment)

## How to Run

### Method 1: Using Docker Compose (Recommended)

1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your database URL and other configurations

3. Run the application:
   ```bash
   docker-compose up --build
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Backend docs: http://localhost:8000/docs

### Method 2: Running Manually

#### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set environment variables:
   ```bash
   export DATABASE_URL="postgresql://user:password@localhost/dbname"
   export BETTER_AUTH_SECRET="your-secret-key"
   ```

5. Run the backend:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

#### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with your API configuration:
   ```
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
   ```

4. Run the frontend:
   ```bash
   npm run dev
   ```

## Project Structure

```
todo_app_hackathon_2/
├── backend/                 # FastAPI backend
│   ├── app/                # Application code
│   │   ├── main.py         # Application entry point
│   │   ├── api/            # API routes
│   │   │   └── v1/         # API version 1
│   │   │       ├── auth.py # Authentication endpoints
│   │   │       └── tasks.py # Task endpoints
│   │   ├── models/         # Database models
│   │   │   ├── user.py    # User model
│   │   │   └── task.py    # Task model
│   │   ├── schemas/        # Pydantic schemas
│   │   │   ├── user.py    # User schemas
│   │   │   └── task.py    # Task schemas
│   │   ├── database/       # Database configuration
│   │   ├── auth/           # Authentication utilities
│   │   └── core/           # Core configuration
│   ├── requirements.txt    # Backend dependencies
│   └── alembic/            # Database migrations
├── frontend/               # Next.js frontend
│   ├── app/               # App Router pages
│   │   ├── (auth)/        # Authentication pages
│   │   │   ├── signup/    # Signup page
│   │   │   └── signin/    # Signin page
│   │   ├── dashboard/     # Dashboard pages
│   │   │   ├── tasks/     # Tasks page
│   │   │   └── layout.tsx # Dashboard layout
│   │   ├── layout.tsx     # Root layout
│   │   └── page.tsx       # Home page
│   ├── components/        # Reusable components
│   │   ├── ui/           # UI components
│   │   └── auth/         # Authentication components
│   ├── lib/               # Shared utilities
│   │   ├── auth.ts       # Authentication context
│   │   ├── api.ts        # API client
│   │   └── types.ts      # Type definitions
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
├── docker-compose.yml     # Docker configuration
├── .env.example          # Environment variables template
└── README.md             # This file
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - Create new user
- `POST /api/v1/auth/signin` - User login
- `POST /api/v1/auth/signout` - User logout

### Tasks
- `GET /api/v1/tasks` - Get all user's tasks
- `POST /api/v1/tasks` - Create new task
- `GET /api/v1/tasks/{task_id}` - Get specific task
- `PUT /api/v1/tasks/{task_id}` - Update task
- `PATCH /api/v1/tasks/{task_id}` - Update task status
- `DELETE /api/v1/tasks/{task_id}` - Delete task

## Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Deployment

For production deployment, ensure the following environment variables are set:
- `DATABASE_URL` - PostgreSQL-compatible database URL
- `BETTER_AUTH_SECRET` - Strong secret for JWT signing (32+ characters)
- `NEXT_PUBLIC_API_BASE_URL` - Backend API URL for frontend
- `NEXTAUTH_URL` - Application base URL
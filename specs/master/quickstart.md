# Quickstart Guide: Phase II Multi-User Todo App

## Overview

This guide provides quick instructions to set up and run the multi-user Todo application with Next.js frontend, FastAPI backend, and Neon DB.

## Prerequisites

- Node.js 18+ (for frontend)
- Python 3.11+ (for backend)
- Docker and Docker Compose (for containerized deployment)
- A Neon DB account (free tier available)

## Environment Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd todo-app-fullstack
```

### 2. Set up environment variables

Create a `.env` file in the backend directory:

```env
# Backend Configuration
DATABASE_URL="postgresql://<user>:<password>@<neon-db-host>:5432/<database-name>"
BETTER_AUTH_SECRET="your-super-secret-jwt-key-here-32-characters-minimum"
BETTER_AUTH_URL="http://localhost:8000"
ACCESS_TOKEN_EXPIRE_MINUTES=43200  # 30 days

# Frontend Configuration (in frontend .env.local)
NEXT_PUBLIC_API_BASE_URL="http://localhost:8000/api/v1"
NEXTAUTH_URL="http://localhost:3000"
```

## Local Development Setup

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations
alembic upgrade head

# Start the backend server
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the frontend development server
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Backend docs: http://localhost:8000/docs

## Docker Setup

### 1. Build and run with Docker Compose

```bash
# Create .env file with your configuration
cp .env.example .env
# Edit .env with your actual values

# Build and start all services
docker-compose up --build
```

The application will be available at http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - Create new user
- `POST /api/v1/auth/signin` - User login
- `POST /api/v1/auth/signout` - User logout

### User Management
- `GET /api/v1/users/me` - Get current user info

### Task Management
- `GET /api/v1/tasks` - Get all user's tasks
- `POST /api/v1/tasks` - Create new task
- `GET /api/v1/tasks/{task_id}` - Get specific task
- `PUT /api/v1/tasks/{task_id}` - Update task
- `PATCH /api/v1/tasks/{task_id}` - Update task status
- `DELETE /api/v1/tasks/{task_id}` - Delete task

## Database Migrations

```bash
# Generate new migration (backend directory)
alembic revision --autogenerate -m "migration description"

# Apply migrations
alembic upgrade head

# Downgrade (if needed)
alembic downgrade -1
```

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

### Production Build

```bash
# Build frontend for production
cd frontend
npm run build

# Build backend (Docker image will be built via Dockerfile)
cd backend
# Dockerfile already configured for production
```

### Environment Variables for Production

Ensure the following environment variables are set:
- `BETTER_AUTH_SECRET`: Strong secret for JWT signing (32+ characters)
- `DATABASE_URL`: Neon DB connection string
- `NEXT_PUBLIC_API_BASE_URL`: Backend API URL for frontend
- `NEXTAUTH_URL`: Application base URL
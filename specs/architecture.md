# Architecture Specification: Multi-User Todo App

## Overview

This specification defines the architecture for the multi-user Todo application with a clear separation between frontend and backend components. The architecture follows a full-stack approach with Next.js frontend communicating with FastAPI backend through REST APIs, using JWT tokens for authentication and Neon DB for persistent storage.

## Architecture Layers

### Frontend Architecture (Next.js App Router)

#### Technology Stack
- **Framework**: Next.js 14+ with App Router
- **Runtime**: Node.js
- **Styling**: Tailwind CSS or similar CSS framework
- **State Management**: React Context API or Zustand
- **HTTP Client**: Axios or fetch API
- **Authentication**: Better Auth client integration

#### Directory Structure
```
/frontend/
├── app/
│   ├── (auth)/
│   │   ├── signup/page.tsx
│   │   └── signin/page.tsx
│   ├── dashboard/
│   │   ├── page.tsx
│   │   ├── tasks/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── error.tsx
├── components/
│   ├── ui/
│   │   ├── TaskCard.tsx
│   │   ├── TaskForm.tsx
│   │   ├── Navbar.tsx
│   │   └── Sidebar.tsx
│   └── auth/
│       ├── AuthForm.tsx
│       └── ProtectedRoute.tsx
├── lib/
│   ├── auth.ts
│   ├── api.ts
│   └── types.ts
├── public/
└── package.json
```

#### Key Components
- **ProtectedRoute Component**: Ensures authentication before accessing protected pages
- **API Client**: Handles all HTTP requests with JWT token attachment
- **Auth Context**: Manages authentication state across the application
- **Task Components**: Reusable components for task management UI

### Backend Architecture (FastAPI)

#### Technology Stack
- **Framework**: FastAPI
- **Runtime**: Python 3.11+
- **Database ORM**: SQLModel (SQLAlchemy + Pydantic)
- **Database**: Neon DB (PostgreSQL-compatible)
- **Authentication**: Better Auth with JWT
- **Password Hashing**: passlib[bcrypt]
- **Validation**: Pydantic

#### Directory Structure
```
/backend/
├── app/
│   ├── main.py
│   ├── api/
│   │   ├── __init__.py
│   │   ├── v1/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   ├── users.py
│   │   │   └── tasks.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   └── task.py
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   └── task.py
│   ├── database/
│   │   ├── __init__.py
│   │   └── session.py
│   ├── auth/
│   │   ├── __init__.py
│   │   └── jwt.py
│   └── core/
│   │   ├── __init__.py
│   │   └── config.py
├── requirements.txt
└── alembic/
    ├── env.py
    ├── script.py.mako
    └── versions/
```

#### Key Components
- **API Routers**: Separate routers for auth, users, and tasks
- **Database Models**: SQLModel definitions for User and Task
- **Pydantic Schemas**: Request/response validation models
- **JWT Middleware**: Token verification and user extraction
- **Database Session**: Connection pooling and session management

## Authentication Flow Architecture

### JWT Token Flow

1. **Frontend Authentication**:
   - User enters credentials in signup/signin forms
   - Credentials sent to backend authentication endpoints
   - Backend validates credentials and generates JWT token
   - JWT token returned to frontend and stored securely

2. **API Request Authentication**:
   - Frontend attaches JWT token to Authorization header: `Authorization: Bearer <token>`
   - Backend JWT middleware intercepts requests
   - Middleware verifies token signature using BETTER_AUTH_SECRET
   - Middleware extracts user_id from token payload
   - Request processed with authenticated user context

3. **Authorization**:
   - All user-specific endpoints filter data by authenticated user_id
   - Backend ensures user can only access their own data
   - Proper isolation between different users' data

## Data Flow Architecture

### Frontend to Backend Communication

```
Frontend Component → API Client → HTTP Request → Backend Endpoint → Database → Backend Response → API Client → Frontend State Update
```

### Database Access Pattern

```
Backend Endpoint → JWT Middleware (extracts user_id) → Database Query (filtered by user_id) → SQLModel → Neon DB → SQLModel → Backend Response
```

## Security Architecture

### Authentication Security
- JWT tokens signed with shared BETTER_AUTH_SECRET
- Passwords hashed with BCrypt (minimum 12 rounds)
- Secure token storage (httpOnly cookies or secure local storage)
- HTTPS required in production

### Data Isolation
- All database queries filtered by authenticated user_id
- Backend verifies resource ownership before operations
- No cross-user data access possible

### Input Validation
- Frontend validation for user experience
- Backend validation for security
- Pydantic models for request/response validation
- SQL injection prevention through ORM

## Deployment Architecture

### Docker Compose Configuration

```
/docker-compose.yml
├── frontend service (Next.js app)
├── backend service (FastAPI app)
├── database service (Neon DB connection)
└── optional: nginx reverse proxy
```

### Environment Configuration
- Separate environment files for development, staging, production
- Secure handling of BETTER_AUTH_SECRET and database credentials
- CORS configuration for frontend-backend communication

## API Communication Architecture

### Frontend API Client Implementation

```typescript
// Example API client setup
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add JWT token to requests
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken(); // Retrieve from secure storage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Backend JWT Middleware Implementation

```python
# Example JWT middleware
def verify_token(token: str = Security(HTTPBearer())):
    try:
        # Decode JWT using BETTER_AUTH_SECRET
        payload = jwt.decode(token, BETTER_AUTH_SECRET, algorithms=["HS256"])
        user_id = payload.get("user_id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
```

## Error Handling Architecture

### Frontend Error Handling
- Network error detection and user feedback
- Authentication error handling and redirect
- Validation error display
- Graceful degradation for unavailable services

### Backend Error Handling
- HTTP status code compliance
- Consistent error response format
- Proper authentication error responses
- Database error handling and rollback

## Performance Architecture

### Caching Strategy
- Frontend: React state caching for UI components
- Backend: Database query optimization with proper indexing
- HTTP caching headers where appropriate

### Database Optimization
- Proper indexing on user_id and frequently queried fields
- Connection pooling for database operations
- Query optimization with SQLAlchemy/SQLModel

## Monitoring and Observability

### Logging Strategy
- Structured logging in both frontend and backend
- Authentication event logging
- Error tracking and monitoring
- Performance monitoring for API endpoints

## Migration Strategy from Phase I

### In-Memory to Database Migration
1. **Database Setup**: Initialize Neon DB with proper schema
2. **Model Migration**: Convert in-memory Task class to SQLModel
3. **Service Layer Update**: Replace in-memory operations with database operations
4. **Authentication Integration**: Add user authentication and data isolation
5. **API Layer**: Create REST API endpoints
6. **Frontend Integration**: Connect frontend to backend API
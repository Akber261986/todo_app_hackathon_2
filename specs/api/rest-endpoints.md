# REST API Endpoints Specification: Multi-User Todo App

## Overview

This specification defines the REST API endpoints for the multi-user Todo application. The API follows REST conventions and requires JWT authentication for all endpoints that access user-specific data. Authentication endpoints are available without authentication for user signup/signin.

## Authentication

All API endpoints (except authentication routes) require JWT authentication using the Authorization header:

```
Authorization: Bearer <JWT_TOKEN>
```

The JWT token contains the user_id which is used to filter and validate access to resources.

## Base URL

`/api/v1`

## Authentication Endpoints

### POST /auth/signup

Create a new user account

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "secure_password"
}
```

**Validation**:
- Email must be valid format and unique
- Password must meet security requirements (min 8 chars)
- All fields required

**Response**:
```json
{
  "access_token": "jwt_token",
  "token_type": "bearer",
  "user": {
    "id": "user_uuid",
    "email": "user@example.com"
  }
}
```

**Status Codes**:
- 201: User created successfully
- 400: Invalid input data
- 409: Email already exists

### POST /auth/signin

Authenticate an existing user

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "secure_password"
}
```

**Validation**:
- Email must exist in the system
- Password must match stored hash
- All fields required

**Response**:
```json
{
  "access_token": "jwt_token",
  "token_type": "bearer",
  "user": {
    "id": "user_uuid",
    "email": "user@example.com"
  }
}
```

**Status Codes**:
- 200: Authentication successful
- 400: Invalid input data
- 401: Invalid credentials

### POST /auth/signout

Sign out the current user (invalidate token)

**Request Headers**:
```
Authorization: Bearer <JWT_TOKEN>
```

**Response**:
```json
{
  "message": "Successfully signed out"
}
```

**Status Codes**:
- 200: Sign out successful

## User Management Endpoints

### GET /users/me

Get current user's profile information

**Request Headers**:
```
Authorization: Bearer <JWT_TOKEN>
```

**Response**:
```json
{
  "id": "user_uuid",
  "email": "user@example.com",
  "created_at": "2023-12-29T10:00:00Z",
  "updated_at": "2023-12-29T10:00:00Z",
  "is_active": true
}
```

**Status Codes**:
- 200: User data retrieved successfully
- 401: Unauthorized (invalid/missing token)

## Task Management Endpoints

### GET /tasks

Retrieve all tasks for the authenticated user

**Request Headers**:
```
Authorization: Bearer <JWT_TOKEN>
```

**Query Parameters**:
- `completed` (optional): Filter by completion status (true/false)
- `limit` (optional): Limit number of results (default: 50, max: 100)
- `offset` (optional): Offset for pagination (default: 0)

**Response**:
```json
{
  "tasks": [
    {
      "id": "task_uuid",
      "title": "Sample Task",
      "description": "Task description",
      "complete": false,
      "user_id": "user_uuid",
      "created_at": "2023-12-29T10:00:00Z",
      "updated_at": "2023-12-29T10:00:00Z"
    }
  ],
  "total": 1,
  "limit": 50,
  "offset": 0
}
```

**Status Codes**:
- 200: Tasks retrieved successfully
- 401: Unauthorized (invalid/missing token)

### POST /tasks

Create a new task for the authenticated user

**Request Headers**:
```
Authorization: Bearer <JWT_TOKEN>
```

**Request Body**:
```json
{
  "title": "New Task",
  "description": "Task description (optional)",
  "complete": false
}
```

**Validation**:
- Title is required and must be 1-255 characters
- Description is optional, max 5000 characters
- Complete defaults to false if not provided

**Response**:
```json
{
  "id": "task_uuid",
  "title": "New Task",
  "description": "Task description",
  "complete": false,
  "user_id": "user_uuid",
  "created_at": "2023-12-29T10:00:00Z",
  "updated_at": "2023-12-29T10:00:00Z"
}
```

**Status Codes**:
- 201: Task created successfully
- 400: Invalid input data
- 401: Unauthorized (invalid/missing token)

### GET /tasks/{task_id}

Retrieve a specific task for the authenticated user

**Request Headers**:
```
Authorization: Bearer <JWT_TOKEN>
```

**Path Parameters**:
- `task_id`: UUID of the task to retrieve

**Response**:
```json
{
  "id": "task_uuid",
  "title": "Sample Task",
  "description": "Task description",
  "complete": false,
  "user_id": "user_uuid",
  "created_at": "2023-12-29T10:00:00Z",
  "updated_at": "2023-12-29T10:00:00Z"
}
```

**Status Codes**:
- 200: Task retrieved successfully
- 401: Unauthorized (invalid/missing token)
- 404: Task not found (or not owned by user)

### PUT /tasks/{task_id}

Update a specific task for the authenticated user

**Request Headers**:
```
Authorization: Bearer <JWT_TOKEN>
```

**Path Parameters**:
- `task_id`: UUID of the task to update

**Request Body**:
```json
{
  "title": "Updated Task Title",
  "description": "Updated description (optional)",
  "complete": true
}
```

**Validation**:
- At least one field must be provided
- Title must be 1-255 characters if provided
- Description max 5000 characters if provided

**Response**:
```json
{
  "id": "task_uuid",
  "title": "Updated Task Title",
  "description": "Updated description",
  "complete": true,
  "user_id": "user_uuid",
  "created_at": "2023-12-29T10:00:00Z",
  "updated_at": "2023-12-29T10:00:00Z"
}
```

**Status Codes**:
- 200: Task updated successfully
- 400: Invalid input data
- 401: Unauthorized (invalid/missing token)
- 404: Task not found (or not owned by user)

### PATCH /tasks/{task_id}

Partially update a specific task for the authenticated user (for toggling completion status)

**Request Headers**:
```
Authorization: Bearer <JWT_TOKEN>
```

**Path Parameters**:
- `task_id`: UUID of the task to update

**Request Body**:
```json
{
  "complete": true
}
```

**Response**:
```json
{
  "id": "task_uuid",
  "title": "Sample Task",
  "description": "Task description",
  "complete": true,
  "user_id": "user_uuid",
  "created_at": "2023-12-29T10:00:00Z",
  "updated_at": "2023-12-29T10:00:00Z"
}
```

**Status Codes**:
- 200: Task updated successfully
- 400: Invalid input data
- 401: Unauthorized (invalid/missing token)
- 404: Task not found (or not owned by user)

### DELETE /tasks/{task_id}

Delete a specific task for the authenticated user

**Request Headers**:
```
Authorization: Bearer <JWT_TOKEN>
```

**Path Parameters**:
- `task_id`: UUID of the task to delete

**Response**:
```json
{
  "message": "Task deleted successfully"
}
```

**Status Codes**:
- 200: Task deleted successfully
- 401: Unauthorized (invalid/missing token)
- 404: Task not found (or not owned by user)

## Error Response Format

All error responses follow this format:

```json
{
  "detail": "Human-readable error message"
}
```

## JWT Token Handling

- JWT tokens must be signed using the shared BETTER_AUTH_SECRET
- Tokens should include user_id in the payload for authorization
- Backend must verify token signature and extract user_id for all protected endpoints
- All endpoints that access user-specific data must filter by authenticated user_id
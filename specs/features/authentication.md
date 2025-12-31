# Authentication Specification: Multi-User Todo App

## Overview

This specification defines the authentication system for the multi-user Todo application using Better Auth with JWT plugin. The system ensures secure user registration, login, and session management with proper user isolation.

## Authentication Provider

### Better Auth Integration

The application will use Better Auth as the primary authentication provider with the following configuration:

- **Provider**: Better Auth with JWT plugin
- **Secret**: Shared BETTER_AUTH_SECRET environment variable
- **Session Management**: JWT-based stateless authentication
- **Password Hashing**: Built-in BCrypt hashing with configurable rounds

## Configuration Requirements

### Environment Variables

- `BETTER_AUTH_SECRET`: Shared secret key for JWT signing/verification (required)
- `BETTER_AUTH_URL`: Base URL for the auth service (for backend)
- `NEXTAUTH_URL`: Base URL for the application (for frontend)

### JWT Configuration

- **Algorithm**: HS256 (HMAC with SHA-256)
- **Expiration**: 7 days for access tokens
- **Payload**: Must include `user_id` for authorization
- **Signing**: Using the shared BETTER_AUTH_SECRET

## Authentication Flow

### User Registration (Sign Up)

1. User provides email and password through the frontend signup form
2. Frontend validates input format (email format, password strength)
3. Frontend sends credentials to backend `/auth/signup` endpoint
4. Backend validates credentials and checks for existing email
5. Backend creates new user with hashed password in database
6. Backend generates JWT token with user_id
7. Backend returns JWT token and user information to frontend
8. Frontend stores JWT token (preferably in secure httpOnly cookie or secure local storage)
9. Frontend redirects user to dashboard

### User Login (Sign In)

1. User provides email and password through the frontend signin form
2. Frontend validates input format
3. Frontend sends credentials to backend `/auth/signin` endpoint
4. Backend verifies credentials against stored hash
5. Backend generates JWT token with user_id
6. Backend returns JWT token and user information to frontend
7. Frontend stores JWT token
8. Frontend redirects user to dashboard

### User Logout

1. User clicks signout button in frontend
2. Frontend sends signout request to backend `/auth/signout` endpoint with JWT token
3. Backend invalidates the session (optional, depending on JWT stateless nature)
4. Frontend removes JWT token from storage
5. Frontend redirects user to login page

## JWT Token Handling

### Token Generation

- Backend generates JWT token upon successful authentication
- Token payload must include:
  - `user_id`: UUID of the authenticated user
  - `exp`: Expiration timestamp
  - `iat`: Issued at timestamp
  - `sub`: Subject (user_id)
- Token signed using BETTER_AUTH_SECRET

### Token Verification

- Backend verifies JWT signature using BETTER_AUTH_SECRET
- Backend extracts `user_id` from token payload for authorization
- Backend validates token expiration
- All protected API endpoints must verify JWT and extract user_id

### Token Usage in API Calls

- Frontend includes JWT in Authorization header: `Authorization: Bearer <token>`
- Backend middleware extracts and verifies token
- Backend uses extracted user_id to filter database queries
- All user-specific data access must be filtered by authenticated user_id

## Frontend Integration

### Authentication State Management

- Frontend maintains authentication state using React Context or similar
- JWT token is attached to all API requests automatically
- Authentication state is persisted across page refreshes
- Automatic redirection based on authentication status

### Protected Routes

- Routes requiring authentication check for valid JWT token
- Unauthenticated users are redirected to login page
- Session expiration triggers logout and redirect to login

### Sign Up Page

- Email input field with validation
- Password input field with strength requirements
- Form validation for required fields
- Error handling for duplicate emails

### Sign In Page

- Email input field with validation
- Password input field
- Form validation for required fields
- Error handling for invalid credentials

## Backend Implementation

### Authentication Middleware

- Middleware function to verify JWT tokens on protected endpoints
- Extracts user_id from verified token
- Attaches user_id to request context for authorization
- Returns 401 for invalid/missing tokens

### User Isolation

- All database queries must filter by authenticated user_id
- Backend verifies that requested resources belong to authenticated user
- Prevents cross-user data access

### Password Security

- Passwords must be hashed using BCrypt (minimum 12 rounds)
- Password strength requirements: minimum 8 characters
- No plain text passwords stored in database
- Secure password reset mechanism (future enhancement)

## Security Considerations

### Token Security

- JWT tokens must be signed with strong secret (BETTER_AUTH_SECRET)
- Tokens should have reasonable expiration times
- Use HTTPS in production to prevent token interception
- Consider using httpOnly cookies for token storage to prevent XSS attacks

### Input Validation

- Email format validation on both frontend and backend
- Password strength requirements
- Sanitize all user inputs to prevent injection attacks
- Rate limiting for authentication endpoints to prevent brute force

### User Data Isolation

- All API endpoints that access user data must filter by authenticated user_id
- No user should be able to access another user's data
- Database queries must always include user_id in WHERE clause
- Proper authorization checks before data access

## Error Handling

### Authentication Errors

- Invalid credentials return 401 Unauthorized
- Invalid JWT token returns 401 Unauthorized
- Expired token returns 401 Unauthorized
- All authentication errors return consistent error format

### Password Requirements

- Minimum 8 characters
- Should include uppercase, lowercase, number, and special character (recommended)
- No common passwords or dictionary words
- Clear error messages for validation failures

## Integration Points

### Frontend-Backend Communication

- Frontend sends authentication requests to backend API
- Backend returns JWT tokens upon successful authentication
- Frontend includes JWT in Authorization header for all API calls
- Backend verifies JWT and extracts user_id for authorization

### Database Integration

- Authentication system creates user records in users table
- JWT verification middleware provides user_id for database queries
- All task operations are filtered by authenticated user_id

## Testing Requirements

### Authentication Flow Testing

- Successful registration with valid credentials
- Successful login with valid credentials
- Proper error handling for invalid credentials
- JWT token generation and verification
- User data isolation verification
- Protected endpoint access with valid/invalid tokens
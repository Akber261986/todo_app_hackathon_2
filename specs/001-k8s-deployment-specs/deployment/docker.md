# Docker Specification: Todo Chatbot Containerization

**Feature**: 001-k8s-deployment-specs
**Created**: 2026-01-10
**Status**: Draft

## Overview

This specification defines the Docker containerization strategy for the Todo Chatbot application, including multi-stage builds for both frontend and backend components.

## Frontend Dockerfile Specification

### Multi-Stage Build Process
- **Builder Stage**: Node.js environment for building the React application
- **Production Stage**: Lightweight nginx container serving static assets

### Build Requirements
- Use Node 18 LTS for building
- Use nginx:alpine as the production base image
- Copy build artifacts from builder stage
- Expose port 3000
- Run as non-root user for security

### Environment Variables Support
- NODE_ENV: Controls build optimizations
- NEXT_PUBLIC_*: Public environment variables for the frontend

### Security Considerations
- Use non-root user in production stage
- Implement HEALTHCHECK instruction
- Limit image layers to reduce attack surface
- Scan for vulnerabilities during build

## Backend Dockerfile Specification

### Multi-Stage Build Process
- **Builder Stage**: Python 3.11 environment for installing dependencies
- **Production Stage**: Minimal Python 3.11 slim image with dependencies

### Build Requirements
- Use python:3.11-slim as base image
- Install system dependencies (gcc) in builder stage
- Copy application code and requirements separately for efficient caching
- Install dependencies with --no-cache-dir flag
- Create non-root user for execution
- Expose port 8000
- Use startup script for proper initialization

### Environment Variables Support
- DATABASE_URL: Connection string for the database
- BETTER_AUTH_SECRET: Secret key for JWT authentication
- OPENAI_API_KEY: API key for OpenAI services
- ENVIRONMENT: Development/production mode settings

### Security Considerations
- Run as non-root user
- Implement HEALTHCHECK instruction
- Scan dependencies for vulnerabilities
- Use multi-stage build to exclude build tools from final image

## Shared Requirements

### Base Image Standards
- Use official, well-maintained base images
- Pin base images to specific versions
- Regularly update base images for security patches

### Build Optimization
- Leverage Docker layer caching
- Copy dependencies separately from application code
- Use .dockerignore to exclude unnecessary files

### Size Optimization
- Use multi-stage builds to minimize final image size
- Remove unnecessary packages and caches
- Target final image size under 200MB for both components

### Security Standards
- Implement non-root execution
- Use minimal base images
- Scan images for vulnerabilities
- Implement HEALTHCHECK for runtime verification
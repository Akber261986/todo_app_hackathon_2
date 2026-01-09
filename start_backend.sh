#!/bin/bash
# Script to start the backend server
# Usage: ./start_backend.sh

echo "Starting Todo App Backend Server..."

# Navigate to backend directory
cd backend

# Start the FastAPI server
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
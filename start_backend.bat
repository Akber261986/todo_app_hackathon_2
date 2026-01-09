@echo off
REM Script to start the backend server
REM Usage: start_backend.bat

echo Starting Todo App Backend Server...

REM Navigate to backend directory
cd backend

REM Start the FastAPI server
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

pause
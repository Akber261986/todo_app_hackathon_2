#!/bin/bash

# Check if PORT environment variable is set
if [ -z "$PORT" ]; then
    echo "PORT environment variable is not set. Using default port 8000."
    PORT=8000
fi

echo "Starting application on port $PORT"

# Start the application with the PORT from environment variable
exec uvicorn app.main:app --host 0.0.0.0 --port $PORT
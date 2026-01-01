"""Main application entry point for Railway deployment."""
import os
from .app.main import app
import uvicorn

def start():
    """Start the application."""
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)

if __name__ == "__main__":
    start()
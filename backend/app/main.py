import os
from dotenv import load_dotenv
load_dotenv()  # Load environment variables from .env file

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, create_engine
from .api.v1 import auth, tasks, chat
from .core.config import settings
from .database.session import engine
import uvicorn

app = FastAPI(title="Todo App API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://todo-app-hackathon-2.vercel.app",
        "http://localhost:3000",  # Common Next.js dev port
        "http://localhost:3001",  # Alternative Next.js dev port
        "http://localhost:3002",  # Another common port
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:3002",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(auth.router, prefix="/api/v1", tags=["authentication"])
app.include_router(tasks.router, prefix="/api/v1", tags=["tasks"])
app.include_router(chat.router, prefix="/api/v1", tags=["chat"])

@app.on_event("startup")
async def startup_event():
    # Create database tables
    try:
        SQLModel.metadata.create_all(bind=engine)
    except Exception as e:
        print(f"Error creating database tables: {e}")
        raise

@app.get("/")
def read_root():
    return {"message": "Todo App Backend API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

def start_server():
    """Start the server with the PORT environment variable."""
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)

if __name__ == "__main__":
    start_server()
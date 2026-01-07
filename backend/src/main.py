from fastapi import FastAPI
from .api import chat_endpoints
from .middleware.auth import JWTBearer
import os

# Create FastAPI application instance
app = FastAPI(
    title="Todo AI Chatbot API",
    description="API for the AI-powered todo management chatbot",
    version="1.0.0"
)

# Include API routes
app.include_router(chat_endpoints.router, prefix="/api", tags=["chat"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Todo AI Chatbot API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

# Initialize database when the application starts
@app.on_event("startup")
async def startup_event():
    from .database import init_db
    await init_db()

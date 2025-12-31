from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, create_engine
from .api.v1 import auth, tasks
from .core.config import settings
from .database.session import engine

app = FastAPI(title="Todo App API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(auth.router, prefix="/api/v1", tags=["authentication"])
app.include_router(tasks.router, prefix="/api/v1", tags=["tasks"])

@app.on_event("startup")
async def startup_event():
    # Create database tables
    SQLModel.metadata.create_all(bind=engine)

@app.get("/")
def read_root():
    return {"message": "Todo App Backend API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
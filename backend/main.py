from fastapi import FastAPI
import os

app = FastAPI(title="Todo Chatbot Backend")

@app.get("/")
def read_root():
    return {"message": "Todo Chatbot Backend is running!"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "env_vars_set": bool(os.getenv("DATABASE_URL"))}

@app.get("/api/health")
def api_health():
    return {"status": "ok", "service": "backend"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
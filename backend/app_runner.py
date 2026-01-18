"""Application runner for Railway deployment."""
import os
from app.main import app
import uvicorn

def main():
    """Run the application."""
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)

if __name__ == "__main__":
    main()
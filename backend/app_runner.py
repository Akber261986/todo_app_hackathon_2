"""Application runner for Railway deployment."""
import os
<<<<<<< HEAD
from app.main import app
=======
from .app.main import app
>>>>>>> 36d2cf9fbc6319f638798696fbcb119bae3d9a9c
import uvicorn

def main():
    """Run the application."""
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)

if __name__ == "__main__":
    main()
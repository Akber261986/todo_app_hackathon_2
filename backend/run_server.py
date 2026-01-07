import os
import sys
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv('../.env')

# Add the backend directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__)))

# Now run the uvicorn server
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
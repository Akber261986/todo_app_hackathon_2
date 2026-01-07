FROM python:3.11-slim

# Set working directory to app root
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy the backend directory contents to the container
COPY backend/ .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Make the startup script executable
RUN chmod +x start.sh

# Expose port (this is just documentation, Railway will use $PORT)
EXPOSE 8000

# Use the PORT environment variable provided by Railway
CMD ["./start.sh"]
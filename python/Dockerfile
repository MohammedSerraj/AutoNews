# Use a lightweight Python base image
FROM python:3.10-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements file and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Ensure the .env file is not overwritten if you use Docker volumes, 
# but for a simple build, we expect it to be present in the directory.
# Note: In production, it's better to pass environment variables via Docker Compose or K8s.

# Command to run the application
CMD ["python", "main.py"]

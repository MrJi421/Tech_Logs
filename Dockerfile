FROM python:3.13.1-slim

WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Environment variables
ENV FLASK_APP=app
ENV FLASK_ENV=development
ENV MONGO_URI=mongodb://mongo:27017/mydb

# Expose port
EXPOSE 5000

# Run the application
CMD ["python", "-m", "flask", "run", "--host=0.0.0.0"]
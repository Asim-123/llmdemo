@echo off
REM SupportLens Startup Script for Windows

echo Starting SupportLens...

REM Check if .env exists
if not exist .env (
    echo .env file not found. Creating from .env.example...
    copy .env.example .env
    echo Please edit .env and add your ANTHROPIC_API_KEY
    exit /b 1
)

REM Start with Docker Compose
echo Starting Docker containers...
docker-compose up --build

echo SupportLens is running!
echo Frontend: http://localhost:5173
echo Backend: http://localhost:8000
echo API Docs: http://localhost:8000/docs

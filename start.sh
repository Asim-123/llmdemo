#!/bin/bash

# SupportLens Startup Script

echo "🚀 Starting SupportLens..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "📝 Please edit .env and add your ANTHROPIC_API_KEY"
    exit 1
fi

# Check if ANTHROPIC_API_KEY is set
if grep -q "your_key_here" .env; then
    echo "⚠️  Please set your ANTHROPIC_API_KEY in .env file"
    exit 1
fi

# Start with Docker Compose
echo "🐳 Starting Docker containers..."
docker-compose up --build

echo "✅ SupportLens is running!"
echo "📊 Frontend: http://localhost:5173"
echo "🔌 Backend: http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"

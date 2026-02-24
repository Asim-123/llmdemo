# SupportLens - Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Set up your API key

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your Anthropic API key
# Get your key from: https://console.anthropic.com/
```

Your `.env` file should look like:
```
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxx
```

### 2. Start the application

**Option A: Using Docker (Recommended)**
```bash
docker-compose up --build
```

**Option B: Using the startup script**

On Windows:
```bash
start.bat
```

On Mac/Linux:
```bash
chmod +x start.sh
./start.sh
```

### 3. Open the application

- **Frontend Dashboard**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 📊 What You'll See

1. **Analytics Bar** - Real-time metrics showing:
   - Total traces
   - Average response time
   - Category breakdown with color-coded cards

2. **Chatbot Panel** - Interactive chat interface:
   - Type a customer support question
   - Get an AI-powered response
   - Automatically saved and classified

3. **Trace Table** - All conversations:
   - Filter by category
   - Click rows to expand full details
   - Auto-refreshes every 10 seconds

## 🎯 Try These Sample Questions

- "Why was I charged twice this month?"
- "I can't log into my account"
- "I want to cancel my subscription"
- "Can I get a refund?"
- "What features are in the Pro plan?"

## 🛠️ Development Mode

### Backend Only
```bash
cd backend
pip install -r requirements.txt
python main.py
```

### Frontend Only
```bash
cd frontend
npm install
npm run dev
```

## 📝 Notes

- The database is automatically seeded with 20+ sample traces on first startup
- All data is stored in SQLite (`backend/supportlens.db`)
- The app uses Claude Haiku for cost-efficient AI responses
- Frontend polls the backend every 10 seconds for updates

## 🐛 Troubleshooting

**Port already in use?**
- Backend: Change port in `docker-compose.yml` (default: 8000)
- Frontend: Change port in `docker-compose.yml` (default: 5173)

**API key not working?**
- Make sure there are no quotes around the key in `.env`
- Verify the key is valid at https://console.groq.com/

**Docker issues?**
- Try: `docker-compose down -v` then `docker-compose up --build`
- Make sure Docker Desktop is running

## 📚 Learn More

See [README.md](README.md) for full documentation including:
- Complete API reference
- Architecture details
- Category classification rules
- Deployment guide

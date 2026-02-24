# SupportLens

A customer support analytics dashboard with AI-powered ticket classification. Built with FastAPI, React, and Claude AI.

## Features

- 🤖 **AI Chatbot**: Interactive customer support chatbot powered by Claude Haiku
- 📊 **Real-time Analytics**: Track support metrics and category distribution
- 🏷️ **Auto-Classification**: Automatically categorize support conversations into 5 categories
- 📈 **Response Time Tracking**: Monitor chatbot performance
- 🎨 **Dark Industrial UI**: Beautiful, terminal-inspired dashboard design

## Tech Stack

### Backend
- **FastAPI**: Modern Python web framework
- **SQLAlchemy**: SQL toolkit and ORM
- **SQLite**: Lightweight database (zero config)
- **Anthropic SDK**: Claude AI integration (claude-haiku-4-5-20251001)

### Frontend
- **React**: UI library
- **Vite**: Fast build tool
- **TailwindCSS**: Utility-first CSS framework
- **IBM Plex Fonts**: Professional monospace and sans-serif fonts

## Project Structure

```
supportlens/
├── backend/              # FastAPI Python backend
│   ├── main.py          # API endpoints
│   ├── models.py        # SQLAlchemy models
│   ├── database.py      # Database configuration
│   ├── llm_service.py   # Claude AI integration
│   ├── seed_data_init.py # Initial data seeding
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/            # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── App.jsx      # Main app component
│   │   └── index.css    # Tailwind styles
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Anthropic API key ([get one here](https://console.anthropic.com/))

### Setup

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd llmdemo
```

2. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env and add your Anthropic API key
```

3. **Start the application**
```bash
docker-compose up
```

4. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Development Setup (Without Docker)

### Backend

```bash
cd backend
pip install -r requirements.txt
python main.py
```

The backend will start on http://localhost:8000

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on http://localhost:5173

## API Endpoints

### `POST /chat`
Get a response from the chatbot.

**Request:**
```json
{
  "message": "Why was I charged twice?"
}
```

**Response:**
```json
{
  "response": "I apologize for the confusion. Let me check your billing history..."
}
```

### `POST /traces`
Create a new trace with automatic classification.

**Request:**
```json
{
  "user_message": "Why was I charged twice?",
  "bot_response": "I apologize for the confusion...",
  "response_time_ms": 1250
}
```

**Response:**
```json
{
  "id": "uuid",
  "user_message": "Why was I charged twice?",
  "bot_response": "I apologize for the confusion...",
  "category": "Billing",
  "timestamp": "2026-02-24T12:00:00",
  "response_time_ms": 1250
}
```

### `GET /traces`
Get all traces, optionally filtered by category.

**Query Parameters:**
- `category` (optional): Filter by category (Billing, Refund, Account Access, Cancellation, General Inquiry)

### `GET /analytics`
Get analytics summary.

**Response:**
```json
{
  "total": 42,
  "average_response_time_ms": 1234,
  "by_category": {
    "Billing": { "count": 10, "percentage": 23.8 },
    "Refund": { "count": 8, "percentage": 19.0 },
    ...
  }
}
```

## Categories

The system automatically classifies conversations into these categories:

1. **Billing** 🔵 - Questions about invoices, charges, payment methods
2. **Refund** 🟠 - Requests for refunds, disputes, credits
3. **Account Access** 🟣 - Login issues, password resets, locked accounts
4. **Cancellation** 🔴 - Subscription cancellations, downgrades, account closure
5. **General Inquiry** 🟢 - Feature questions, product info, how-to questions

## Seed Data

The application comes with 20+ pre-classified sample traces spanning all categories. The seed data is automatically loaded on first startup if the database is empty.

## Configuration

### Environment Variables

**Backend (.env)**
- `ANTHROPIC_API_KEY`: Your Anthropic API key (required)

**Frontend (frontend/.env)**
- `VITE_API_URL`: Backend API URL (default: http://localhost:8000)

## UI Features

- **Analytics Dashboard**: Real-time metrics with color-coded category cards
- **Interactive Chatbot**: Send messages and see responses instantly
- **Trace Table**: View all conversations with expandable details
- **Category Filtering**: Filter traces by category
- **Auto-refresh**: Data updates every 10 seconds
- **Manual Refresh**: Refresh button for immediate updates
- **Dark Theme**: Industrial-style dark UI with terminal aesthetics

## Error Handling

- LLM classification failures default to "General Inquiry"
- Chat errors display user-friendly error messages
- All errors are logged to console for debugging

## Performance

- Uses Claude Haiku for cost-efficient AI responses
- SQLite for fast, zero-config database
- Optimized frontend with React and Vite
- Automatic polling with 10-second intervals

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

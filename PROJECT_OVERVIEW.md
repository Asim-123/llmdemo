# SupportLens - Project Overview

## 🎯 What is SupportLens?

SupportLens is a real-time customer support analytics dashboard that uses AI to automatically classify and analyze support conversations. It combines an interactive chatbot with powerful analytics to help support teams understand their ticket distribution and response times.

## ✨ Key Features

### 1. AI-Powered Chatbot
- Interactive customer support agent powered by Claude Haiku
- Responds to billing, refund, account, cancellation, and general inquiries
- Professional, concise, and empathetic responses
- Real-time response time tracking

### 2. Automatic Classification
- Uses Claude AI to classify conversations into 5 categories
- Smart classification based on primary user intent
- Fallback to "General Inquiry" on errors
- No manual tagging required

### 3. Real-Time Analytics Dashboard
- **Total Traces**: Track total number of conversations
- **Average Response Time**: Monitor chatbot performance
- **Category Breakdown**: Visual distribution across all 5 categories
- **Color-Coded Cards**: Easy-to-read category metrics with percentages

### 4. Conversation Management
- View all support traces in a sortable table
- Filter by category with one click
- Expand rows to see full conversation details
- Auto-refresh every 10 seconds
- Manual refresh button for immediate updates

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (React)                     │
│  ┌──────────┐  ┌──────────┐  ┌────────────────────┐   │
│  │Analytics │  │ Chatbot  │  │   Trace Table      │   │
│  │Dashboard │  │  Panel   │  │  (with filters)    │   │
│  └──────────┘  └──────────┘  └────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                         │ HTTP/JSON
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   Backend (FastAPI)                      │
│  ┌──────────────────────────────────────────────────┐  │
│  │  API Endpoints                                    │  │
│  │  • POST /chat        - Get chatbot response      │  │
│  │  • POST /traces      - Save & classify trace     │  │
│  │  • GET  /traces      - Retrieve traces           │  │
│  │  • GET  /analytics   - Get analytics summary     │  │
│  └──────────────────────────────────────────────────┘  │
│                         │                                │
│  ┌──────────────────────┼────────────────────────────┐ │
│  │                      ▼                             │ │
│  │  ┌────────────┐  ┌─────────────┐  ┌───────────┐ │ │
│  │  │  SQLite DB │  │  LLM Service│  │Seed Data  │ │ │
│  │  │  (Traces)  │  │   (Claude)  │  │ (20+ rows)│ │ │
│  │  └────────────┘  └─────────────┘  └───────────┘ │ │
│  └──────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## 📊 Data Model

### Trace
```python
{
  "id": "uuid",                    # Unique identifier
  "user_message": "string",        # Customer's question
  "bot_response": "string",        # Bot's answer
  "category": "enum",              # One of 5 categories
  "timestamp": "datetime",         # When created
  "response_time_ms": "integer"    # Response time in ms
}
```

### Categories (5 types)
1. **Billing** 🔵 - Payment, invoices, charges
2. **Refund** 🟠 - Money back, disputes, credits
3. **Account Access** 🟣 - Login, passwords, MFA
4. **Cancellation** 🔴 - Cancel subscription, close account
5. **General Inquiry** 🟢 - Features, how-to, product info

## 🔄 User Flow

```
1. User types message in chatbot
         ↓
2. Frontend records start time
         ↓
3. POST /chat → Get AI response
         ↓
4. Calculate response_time_ms
         ↓
5. POST /traces → Save & classify
         ↓
6. Backend calls Claude to classify
         ↓
7. Save to SQLite with category
         ↓
8. Frontend refreshes analytics & table
         ↓
9. User sees updated dashboard
```

## 🎨 UI Design

### Design Philosophy
- **Dark Industrial**: Charcoal background (#0f1117)
- **Terminal Aesthetic**: Monospace fonts for data
- **Color-Coded**: Each category has a distinct color
- **Ops Dashboard**: Inspired by Datadog and monitoring tools

### Typography
- **IBM Plex Mono**: Data, labels, metrics
- **IBM Plex Sans**: Body text, descriptions

### Color Palette
```css
Background:      #0f1117 (dark charcoal)
Cards:           #111827 (gray-900)
Borders:         #1f2937 (gray-800)
Text Primary:    #e5e7eb (gray-200)
Text Secondary:  #9ca3af (gray-400)

Categories:
Billing:         #3b82f6 (blue)
Refund:          #f59e0b (amber)
Account Access:  #8b5cf6 (purple)
Cancellation:    #ef4444 (red)
General Inquiry: #10b981 (green)
```

## 🚀 Technology Choices

### Why FastAPI?
- Fast and modern Python framework
- Automatic API documentation (Swagger/OpenAPI)
- Built-in validation with Pydantic
- Async support for better performance

### Why SQLite?
- Zero configuration required
- File-based (no separate database server)
- Perfect for demos and small-scale deployments
- Easy to backup and migrate

### Why Claude Haiku?
- Cost-efficient for high-volume classification
- Fast response times (400-2500ms)
- Excellent at following strict instructions
- Reliable category classification

### Why React + Vite?
- Fast development with hot module replacement
- Modern build tool with excellent performance
- Great developer experience
- Easy to deploy

### Why TailwindCSS?
- Utility-first approach for rapid UI development
- Consistent design system
- Small bundle size with purging
- Easy to customize

## 📁 File Structure

```
supportlens/
├── backend/
│   ├── main.py              # FastAPI app & endpoints
│   ├── models.py            # SQLAlchemy models
│   ├── database.py          # DB configuration
│   ├── llm_service.py       # Claude integration
│   ├── seed_data_init.py    # Initial data
│   ├── requirements.txt     # Python dependencies
│   └── Dockerfile           # Backend container
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main component
│   │   ├── components/
│   │   │   ├── Analytics.jsx    # Analytics cards
│   │   │   ├── ChatPanel.jsx    # Chat interface
│   │   │   └── TraceTable.jsx   # Trace list
│   │   ├── index.css        # Tailwind styles
│   │   └── main.jsx         # Entry point
│   ├── package.json         # Node dependencies
│   ├── tailwind.config.js   # Tailwind config
│   └── Dockerfile           # Frontend container
│
├── docker-compose.yml       # Multi-container setup
├── .env.example             # Environment template
├── README.md                # Full documentation
├── QUICKSTART.md            # Quick start guide
├── start.sh / start.bat     # Startup scripts
└── .gitignore               # Git ignore rules
```

## 🔒 Security Considerations

- API key stored in environment variables (not in code)
- CORS configured for frontend access
- Input validation with Pydantic models
- SQL injection protection via SQLAlchemy ORM
- No sensitive data in logs

## 📈 Scalability

### Current Setup (Demo/Small Scale)
- SQLite database (file-based)
- Single backend instance
- Suitable for: demos, small teams, development

### Production Recommendations
- Migrate to PostgreSQL or MySQL
- Add Redis for caching
- Implement rate limiting
- Add authentication/authorization
- Use environment-specific configs
- Deploy behind a reverse proxy (nginx)
- Add monitoring and logging (Sentry, DataDog)

## 🧪 Testing Strategy

### Backend Testing
```bash
# Unit tests for models
pytest tests/test_models.py

# API endpoint tests
pytest tests/test_api.py

# LLM service tests (mocked)
pytest tests/test_llm_service.py
```

### Frontend Testing
```bash
# Component tests
npm run test

# E2E tests with Playwright
npm run test:e2e
```

## 🚢 Deployment Options

### Option 1: Docker Compose (Easiest)
```bash
docker-compose up -d
```

### Option 2: Separate Deployments
- Backend: Deploy to Railway, Render, or AWS ECS
- Frontend: Deploy to Vercel, Netlify, or Cloudflare Pages
- Database: Use managed PostgreSQL (AWS RDS, Supabase)

### Option 3: Kubernetes
- Create K8s manifests for backend and frontend
- Use Helm charts for easier management
- Add ingress for routing

## 📊 Monitoring & Observability

### Metrics to Track
- Total traces per day/week/month
- Average response time trends
- Category distribution over time
- Error rates
- API endpoint latency

### Recommended Tools
- **Application Monitoring**: DataDog, New Relic
- **Error Tracking**: Sentry
- **Logging**: ELK Stack, Loki
- **Uptime Monitoring**: UptimeRobot, Pingdom

## 🎓 Learning Resources

### FastAPI
- Official Docs: https://fastapi.tiangolo.com/
- Tutorial: FastAPI from scratch

### React
- Official Docs: https://react.dev/
- Vite Guide: https://vitejs.dev/

### Anthropic Claude
- API Docs: https://docs.anthropic.com/
- Prompt Engineering: https://docs.anthropic.com/claude/docs/prompt-engineering

### TailwindCSS
- Official Docs: https://tailwindcss.com/
- UI Components: https://tailwindui.com/

## 🤝 Contributing

Contributions are welcome! Areas for improvement:
- Add user authentication
- Implement trace search functionality
- Add export to CSV/JSON
- Create data visualization charts
- Add real-time updates with WebSockets
- Implement trace editing/deletion
- Add custom category creation
- Build admin dashboard

## 📝 License

MIT License - Feel free to use this project for learning or commercial purposes.

## 🙏 Acknowledgments

- Built with Claude AI assistance
- Inspired by modern ops dashboards
- Uses IBM Plex fonts (open source)
- Powered by Anthropic's Claude API

# SupportLens - Troubleshooting Guide

## 🐛 Common Issues and Solutions

### 1. "GROQ_API_KEY not found" Error

**Problem**: Backend can't find your API key

**Solutions**:
```bash
# Make sure .env file exists in the root directory
ls -la .env  # Linux/Mac
dir .env     # Windows

# Check the content
cat .env     # Should show: GROQ_API_KEY=gsk_...

# Make sure there are no quotes around the key
# ❌ Wrong: GROQ_API_KEY="gsk_..."
# ✅ Right: GROQ_API_KEY=gsk_...

# Restart Docker containers
docker-compose down
docker-compose up --build
```

### 2. Port Already in Use

**Problem**: `Error: Port 8000 (or 5173) is already in use`

**Solutions**:

**Option A: Kill the process using the port**
```bash
# On Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# On Linux/Mac
lsof -ti:8000 | xargs kill -9
```

**Option B: Change the port in docker-compose.yml**
```yaml
services:
  backend:
    ports:
      - "8001:8000"  # Change 8001 to any available port
  
  frontend:
    ports:
      - "3000:5173"  # Change 3000 to any available port
```

### 3. Frontend Can't Connect to Backend

**Problem**: `Failed to fetch` or `Network error` in browser console

**Solutions**:

1. **Check backend is running**:
```bash
curl http://localhost:8000
# Should return: {"message":"SupportLens API is running"}
```

2. **Check CORS settings** in `backend/main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Make sure this is present
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

3. **Check frontend API URL**:
- Create `frontend/.env` if it doesn't exist:
```bash
VITE_API_URL=http://localhost:8000
```

4. **Restart both services**:
```bash
docker-compose restart
```

### 4. Database Errors

**Problem**: `OperationalError: no such table: traces`

**Solutions**:
```bash
# Delete the database and restart
rm backend/supportlens.db
docker-compose restart backend

# The database will be recreated automatically with seed data
```

### 5. npm Install Fails (EBUSY, EPERM errors)

**Problem**: Windows file locking issues during npm install

**Solutions**:

1. **Close all terminals and IDEs**
2. **Delete node_modules and package-lock.json**:
```bash
cd frontend
rm -rf node_modules package-lock.json
```

3. **Run npm install with --force**:
```bash
npm install --force
```

4. **If still failing, try**:
```bash
npm cache clean --force
npm install
```

### 6. Docker Build Fails

**Problem**: `Error building image` or `Cannot connect to Docker daemon`

**Solutions**:

1. **Make sure Docker Desktop is running**
   - Windows: Check system tray
   - Mac: Check menu bar

2. **Check Docker is working**:
```bash
docker --version
docker ps
```

3. **Clean Docker cache**:
```bash
docker system prune -a
docker-compose build --no-cache
```

4. **Check disk space**:
```bash
docker system df
```

### 7. LLM Classification Returns "General Inquiry" for Everything

**Problem**: All traces are classified as "General Inquiry"

**Possible Causes**:
- Invalid API key
- API rate limits exceeded
- Network issues

**Solutions**:

1. **Check API key is valid**:
```bash
# Test the API key manually
curl https://api.groq.com/openai/v1/chat/completions \
  -H "Authorization: Bearer $GROQ_API_KEY" \
  -H "content-type: application/json" \
  -d '{"model":"llama-3.3-70b-versatile","messages":[{"role":"user","content":"Hi"}],"max_tokens":10}'
```

2. **Check backend logs**:
```bash
docker-compose logs backend
# Look for errors related to Groq API
```

3. **Check rate limits**:
- Free tier: 5 requests per minute
- Paid tier: Higher limits
- Wait a minute and try again

### 8. Chatbot Not Responding

**Problem**: Clicking "Send" does nothing or shows error

**Solutions**:

1. **Check browser console** (F12):
```javascript
// Look for errors like:
// "Failed to fetch"
// "Network error"
// "500 Internal Server Error"
```

2. **Check backend logs**:
```bash
docker-compose logs -f backend
```

3. **Test the chat endpoint manually**:
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello"}'
```

4. **Check API key is set**:
```bash
docker-compose exec backend env | grep GROQ
```

### 9. Traces Not Appearing in Table

**Problem**: Chatbot works but traces don't show in table

**Solutions**:

1. **Check browser console for fetch errors**

2. **Manually refresh**:
   - Click the "Refresh" button in the UI
   - Or refresh the browser (F5)

3. **Check database**:
```bash
# Access the backend container
docker-compose exec backend python

# In Python shell:
from database import SessionLocal
from models import Trace
db = SessionLocal()
traces = db.query(Trace).all()
print(f"Found {len(traces)} traces")
```

4. **Check API endpoint**:
```bash
curl http://localhost:8000/traces
# Should return JSON array of traces
```

### 10. Styling Looks Broken

**Problem**: UI looks unstyled or components are misaligned

**Solutions**:

1. **Clear browser cache**:
   - Chrome: Ctrl+Shift+Delete
   - Firefox: Ctrl+Shift+Delete
   - Safari: Cmd+Option+E

2. **Check Tailwind is loaded**:
   - Open browser DevTools (F12)
   - Go to Network tab
   - Refresh page
   - Look for `index.css` - should be loaded

3. **Rebuild frontend**:
```bash
cd frontend
npm run build
```

4. **Check PostCSS and Tailwind configs exist**:
```bash
ls frontend/postcss.config.js
ls frontend/tailwind.config.js
```

### 11. Seed Data Not Loading

**Problem**: Database is empty on first startup

**Solutions**:

1. **Check backend logs**:
```bash
docker-compose logs backend | grep -i seed
# Should see: "Seeding database with initial traces..."
```

2. **Manually trigger seed**:
```bash
docker-compose exec backend python

# In Python shell:
from database import SessionLocal
from seed_data_init import seed_database
db = SessionLocal()
seed_database(db)
```

3. **Delete DB and restart**:
```bash
rm backend/supportlens.db
docker-compose restart backend
```

### 12. Docker Compose Won't Start

**Problem**: `docker-compose up` fails immediately

**Solutions**:

1. **Check docker-compose.yml syntax**:
```bash
docker-compose config
# Should show parsed configuration
```

2. **Check for port conflicts**:
```bash
# Windows
netstat -ano | findstr :8000
netstat -ano | findstr :5173

# Linux/Mac
lsof -i :8000
lsof -i :5173
```

3. **Check .env file exists**:
```bash
ls -la .env
```

4. **View detailed logs**:
```bash
docker-compose up --build
# Don't use -d flag to see logs
```

## 🔍 Debugging Tips

### Enable Verbose Logging

**Backend** (`backend/main.py`):
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

**Frontend** (browser console):
```javascript
// Add to App.jsx
console.log('API_BASE_URL:', API_BASE_URL)
console.log('Analytics data:', analytics)
console.log('Traces:', traces)
```

### Check Service Health

```bash
# Backend health
curl http://localhost:8000

# Frontend health
curl http://localhost:5173

# Check all containers
docker-compose ps

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Test API Endpoints

```bash
# Test chat endpoint
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Why was I charged twice?"}'

# Test traces endpoint
curl -X POST http://localhost:8000/traces \
  -H "Content-Type: application/json" \
  -d '{
    "user_message":"Test message",
    "bot_response":"Test response",
    "response_time_ms":1000
  }'

# Get all traces
curl http://localhost:8000/traces

# Get analytics
curl http://localhost:8000/analytics
```

## 📞 Still Having Issues?

1. **Check the logs**:
```bash
docker-compose logs -f
```

2. **Search for error messages** in:
   - Browser console (F12)
   - Backend logs
   - Docker logs

3. **Verify environment**:
   - Docker version: `docker --version` (should be 20.10+)
   - Node version: `node --version` (should be 18+)
   - Python version: `python --version` (should be 3.11+)

4. **Start fresh**:
```bash
# Complete reset
docker-compose down -v
rm -rf frontend/node_modules
rm backend/supportlens.db
docker-compose up --build
```

5. **Check GitHub Issues**: Look for similar problems in the repository

## 💡 Pro Tips

- Always check logs first: `docker-compose logs -f`
- Use browser DevTools Network tab to see API calls
- Test API endpoints with curl before debugging frontend
- Keep Docker Desktop updated
- Use `--build` flag when making code changes
- Clear browser cache when CSS changes don't appear

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Anthropic API Documentation](https://docs.anthropic.com/)

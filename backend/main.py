from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

from database import init_db, get_db
from models import Trace, CategoryEnum
from llm_service import classify_trace, get_chatbot_response
from seed_data_init import seed_database

app = FastAPI(title="SupportLens API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response
class TraceCreate(BaseModel):
    user_message: str
    bot_response: str
    response_time_ms: int

class TraceResponse(BaseModel):
    id: str
    user_message: str
    bot_response: str
    category: str
    timestamp: str
    response_time_ms: int

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

class CategoryStats(BaseModel):
    count: int
    percentage: float

class AnalyticsResponse(BaseModel):
    total: int
    average_response_time_ms: int
    by_category: dict

@app.on_event("startup")
def startup_event():
    """Initialize database and seed data on startup."""
    init_db()
    db = next(get_db())
    try:
        seed_database(db)
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "SupportLens API is running"}

@app.post("/traces", response_model=TraceResponse)
def create_trace(trace_data: TraceCreate, db: Session = Depends(get_db)):
    """Create a new trace with LLM classification."""
    try:
        # Classify the conversation
        category_str = classify_trace(trace_data.user_message, trace_data.bot_response)
        category = CategoryEnum(category_str)
        
        # Create trace
        trace = Trace(
            user_message=trace_data.user_message,
            bot_response=trace_data.bot_response,
            category=category,
            response_time_ms=trace_data.response_time_ms
        )
        
        db.add(trace)
        db.commit()
        db.refresh(trace)
        
        return trace.to_dict()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error creating trace: {str(e)}")

@app.get("/traces")
def get_traces(category: Optional[str] = None, db: Session = Depends(get_db)):
    """Get all traces, optionally filtered by category."""
    try:
        query = db.query(Trace)
        
        if category:
            try:
                category_enum = CategoryEnum(category)
                query = query.filter(Trace.category == category_enum)
            except ValueError:
                raise HTTPException(status_code=400, detail=f"Invalid category: {category}")
        
        traces = query.order_by(Trace.timestamp.desc()).all()
        return [trace.to_dict() for trace in traces]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching traces: {str(e)}")

@app.get("/analytics", response_model=AnalyticsResponse)
def get_analytics(db: Session = Depends(get_db)):
    """Get analytics summary."""
    try:
        traces = db.query(Trace).all()
        total = len(traces)
        
        if total == 0:
            return {
                "total": 0,
                "average_response_time_ms": 0,
                "by_category": {}
            }
        
        # Calculate average response time
        avg_response_time = sum(t.response_time_ms for t in traces) // total
        
        # Calculate category breakdown
        by_category = {}
        for category in CategoryEnum:
            count = sum(1 for t in traces if t.category == category)
            percentage = round((count / total) * 100, 1) if total > 0 else 0
            by_category[category.value] = {
                "count": count,
                "percentage": percentage
            }
        
        return {
            "total": total,
            "average_response_time_ms": avg_response_time,
            "by_category": by_category
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching analytics: {str(e)}")

@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    """Get a response from the chatbot."""
    try:
        response = get_chatbot_response(request.message)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get chatbot response: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

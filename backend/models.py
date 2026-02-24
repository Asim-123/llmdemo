from sqlalchemy import Column, String, Integer, DateTime, Enum as SQLEnum
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
import enum
import uuid

Base = declarative_base()

class CategoryEnum(str, enum.Enum):
    BILLING = "Billing"
    REFUND = "Refund"
    ACCOUNT_ACCESS = "Account Access"
    CANCELLATION = "Cancellation"
    GENERAL_INQUIRY = "General Inquiry"

class Trace(Base):
    __tablename__ = "traces"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_message = Column(String, nullable=False)
    bot_response = Column(String, nullable=False)
    category = Column(SQLEnum(CategoryEnum), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)
    response_time_ms = Column(Integer, nullable=False)
    
    def to_dict(self):
        return {
            "id": self.id,
            "user_message": self.user_message,
            "bot_response": self.bot_response,
            "category": self.category.value,
            "timestamp": self.timestamp.isoformat(),
            "response_time_ms": self.response_time_ms
        }

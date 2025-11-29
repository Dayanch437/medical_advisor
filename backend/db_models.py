from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


class MedicalQuery(Base):
    """Müşderiniň lukmançylyk soraglary üçin tablitsa"""
    __tablename__ = "medical_queries"
    
    id = Column(Integer, primary_key=True, index=True)
    question = Column(Text, nullable=False)
    age = Column(Integer, nullable=True)
    gender = Column(String(10), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationship bilen AI jogaby
    response = relationship("AIResponse", back_populates="query", uselist=False)
    
    def __repr__(self):
        return f"<MedicalQuery(id={self.id}, question='{self.question[:30]}...', created_at={self.created_at})>"


class AIResponse(Base):
    """AI-den alnan jogaplar üçin tablitsa"""
    __tablename__ = "ai_responses"
    
    id = Column(Integer, primary_key=True, index=True)
    query_id = Column(Integer, ForeignKey("medical_queries.id"), nullable=False)
    advice = Column(Text, nullable=False)
    model_used = Column(String(50), nullable=False)  # Haýsy model ulanylandygy
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationship bilen sorag
    query = relationship("MedicalQuery", back_populates="response")
    
    def __repr__(self):
        return f"<AIResponse(id={self.id}, query_id={self.query_id}, model='{self.model_used}')>"

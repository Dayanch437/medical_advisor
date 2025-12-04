from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from database import Base


class MedicalQuery(Base):
    __tablename__ = "medical_queries"

    id = Column(Integer, primary_key=True, index=True)
    question = Column(Text, nullable=False)
    age = Column(Integer, nullable=True, index=True)
    gender = Column(String(10), nullable=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)

    response = relationship(
        "AIResponse", back_populates="query", uselist=False, lazy="joined"
    )

    def __repr__(self):
        return f"<MedicalQuery(id={self.id}, question='{self.question[:30]}...', created_at={self.created_at})>"


class AIResponse(Base):
    __tablename__ = "ai_responses"

    id = Column(Integer, primary_key=True, index=True)
    query_id = Column(
        Integer, ForeignKey("medical_queries.id"), nullable=False, index=True
    )
    advice = Column(Text, nullable=False)
    model_used = Column(String(50), nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)

    query = relationship("MedicalQuery", back_populates="response", lazy="joined")

    def __repr__(self):
        return f"<AIResponse(id={self.id}, query_id={self.query_id}, model='{self.model_used}')>"

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class MedicalQuestion(BaseModel):
    question: str = Field(
        ..., description="Hassanyň soragy", min_length=10, max_length=1000
    )
    age: Optional[int] = Field(None, description="Hassanyň ýaşy", ge=0, le=150)
    gender: Optional[str] = Field(None, description="Jyns: 'erkek' ýa-da 'aýal'")

    class Config:
        json_schema_extra = {
            "example": {
                "question": "Kelläm agyrýar we gyzzyrma bar, näme etmeli?",
                "age": 30,
                "gender": "erkek",
            }
        }


class MedicalAdvice(BaseModel):
    advice: str = Field(..., description="Gemini-den alnan maslahat")
    disclaimer: str = Field(..., description="Duýduryş haty")

    class Config:
        json_schema_extra = {
            "example": {
                "advice": "Siziň alamatlaryňyz...",
                "disclaimer": "Bu maslahat diňe maglumat maksady bilen berilýär. Hakyky lukmana ýüz tutmaly.",
            }
        }


class HealthStatus(BaseModel):
    """API ýagdaýy"""

    status: str
    message: str
    gemini_connected: bool


class QueryHistoryItem(BaseModel):
    id: int
    question: str
    age: Optional[int]
    gender: Optional[str]
    advice: str
    ai_model: str  # model_used -> ai_model (namespace conflict fix)
    created_at: datetime

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": 1,
                "question": "Kelläm agyrýar we gyzzyrma bar",
                "age": 30,
                "gender": "erkek",
                "advice": "Siziň alamatlaryňyz...",
                "ai_model": "gemini-2.5-flash",
                "created_at": "2025-11-29T10:30:00",
            }
        }


class QueryHistory(BaseModel):
    """Ähli soraglaryň we jogaplaryň sanawy"""

    total: int
    queries: list[QueryHistoryItem]

from pydantic import BaseModel, Field
from typing import Optional


class MedicalQuestion(BaseModel):
    """Lukmançylyk soragy üçin model"""
    question: str = Field(..., description="Hassanyň soragy", min_length=10, max_length=1000)
    age: Optional[int] = Field(None, description="Hassanyň ýaşy", ge=0, le=150)
    gender: Optional[str] = Field(None, description="Jyns: 'erkek' ýa-da 'aýal'")
    
    class Config:
        json_schema_extra = {
            "example": {
                "question": "Kelläm agyrýar we gyzzyrma bar, näme etmeli?",
                "age": 30,
                "gender": "erkek"
            }
        }


class MedicalAdvice(BaseModel):
    """Lukmançylyk maslahat jogaby üçin model"""
    advice: str = Field(..., description="Gemini-den alnan maslahat")
    disclaimer: str = Field(..., description="Duýduryş haty")
    
    class Config:
        json_schema_extra = {
            "example": {
                "advice": "Siziň alamatlaryňyz...",
                "disclaimer": "Bu maslahat diňe maglumat maksady bilen berilýär. Hakyky lukmana ýüz tutmaly."
            }
        }


class HealthStatus(BaseModel):
    """API ýagdaýy"""
    status: str
    message: str
    gemini_connected: bool

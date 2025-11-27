from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
from models import MedicalQuestion, MedicalAdvice, HealthStatus
from config import get_settings
import logging

# Logging sazlamak
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Sazlamalary ýüklemek
settings = get_settings()

# FastAPI programmasy
app = FastAPI(
    title="Türkmen Lukmançylyk Maslahat API",
    description="Gemini AI ulanyp, türkmen dilinde lukmançylyk maslahat berýän API",
    version="1.0.0"
)

# CORS sazlamak
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Gemini API-ni sazlamak
try:
    genai.configure(api_key=settings.gemini_api_key)
    model = genai.GenerativeModel('gemini-pro')
    logger.info("Gemini API üstünlikli birikdirildi")
except Exception as e:
    logger.error(f"Gemini API birikmesinde ýalňyşlyk: {str(e)}")
    model = None


def create_medical_prompt(question: str, age: int = None, gender: str = None) -> str:
    """Lukmançylyk soragy üçin prompt döretmek"""
    prompt = f"""Sen tejribeli türkmen lukman. Hassanyň soragyna jogap bermeli. 
Jogabyňy türkmen dilinde, aňsat we düşnükli dil bilen bermeli.

DUÝDURYŞ: Hassaň HÖKMANY SURATDA hakyky lukmana ýa-da keselhanä ýüz tutmalydygyny aýtmagy unutma.

"""
    
    if age:
        prompt += f"Hassanyň ýaşy: {age}\n"
    if gender:
        prompt += f"Jynsy: {gender}\n"
    
    prompt += f"\nHassanyň soragy: {question}\n\n"
    prompt += """Jogabyňda şulary goş:
1. Alamatlaryň mümkin sebäpleri
2. Öýde edilip bilinjek çäreler
3. Haçan HÖKMANY SURATDA lukmana gitmeli
4. Öňüni alyş maslahatlar

Jogabyňy türkmen dilinde we düşnükli ýaz."""
    
    return prompt


@app.get("/", response_model=HealthStatus)
async def root():
    """API baş sahypasy - ýagdaýy barlamak"""
    return HealthStatus(
        status="işleýär",
        message="Türkmen Lukmançylyk Maslahat API işleýär",
        gemini_connected=model is not None
    )


@app.get("/health", response_model=HealthStatus)
async def health_check():
    """API saglygy barlamak"""
    if model is None:
        return HealthStatus(
            status="ýalňyş",
            message="Gemini API birikdirilmedi",
            gemini_connected=False
        )
    
    return HealthStatus(
        status="sagdyn",
        message="Ähli hyzmatlar işleýär",
        gemini_connected=True
    )


@app.post("/advice", response_model=MedicalAdvice, status_code=status.HTTP_200_OK)
async def get_medical_advice(question: MedicalQuestion):
    """
    Lukmançylyk maslahat almak
    
    - **question**: Hassanyň soragy (10-1000 simwol)
    - **age**: Hassanyň ýaşy (hökmän däl)
    - **gender**: Jynsy - 'erkek' ýa-da 'aýal' (hökmän däl)
    """
    if model is None:
        logger.error("Gemini model elýeterli däl")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="AI hyzmat häzirki wagtda elýeterli däl. Soňrak synanyşyň."
        )
    
    try:
        # Prompt döretmek
        prompt = create_medical_prompt(
            question=question.question,
            age=question.age,
            gender=question.gender
        )
        
        logger.info(f"Sorag alyndy: {question.question[:50]}...")
        
        # Gemini-den jogap almak
        response = model.generate_content(prompt)
        
        if not response.text:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="AI-den jogap alynmady. Soňrak synanyşyň."
            )
        
        logger.info("Üstünlikli jogap berildi")
        
        # Duýduryş haty
        disclaimer = """
⚠️ MÖHÜM DUÝDURYŞ: 
Bu maslahat diňe maglumat maksady bilen berilýär we hakyky lukmançylyk diagnozyny ýa-da bejergini çalyşmaýar. 
Hassalyk ýüze çyksa ýa-da alamatlaryňyz dowam etse, HÖKMANY SURATDA ýerli lukmana ýa-da keselhanä ýüz tutuň.
Gyssagly ýagdaýlarda derrew tiz kömek çagyryň!
        """.strip()
        
        return MedicalAdvice(
            advice=response.text,
            disclaimer=disclaimer
        )
        
    except Exception as e:
        logger.error(f"Maslahat berişde ýalňyşlyk: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Maslahat berişde ýalňyşlyk ýüze çykdy: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=True
    )

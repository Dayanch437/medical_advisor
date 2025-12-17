import asyncio
import logging
from contextlib import asynccontextmanager

import google.generativeai as genai
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from config import get_settings
from database import get_db, init_db
from db_models import AIResponse, MedicalQuery
from models import (
    HealthStatus,
    MedicalAdvice,
    MedicalQuestion,
    QueryHistory,
    QueryHistoryItem,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    logger.info("Databaza üstünlikli işe girizildi")
    yield
    logger.info("Programma ýapylýar")


app = FastAPI(
    title="Türkmen Lukmançylyk Maslahat API",
    description="Gemini AI ulanyp, türkmen dilinde lukmançylyk maslahat berýän API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(GZipMiddleware, minimum_size=1000)

try:
    genai.configure(api_key=settings.gemini_api_key)
    
    safety_settings = [
        {
            "category": "HARM_CATEGORY_HARASSMENT",
            "threshold": "BLOCK_ONLY_HIGH",
        },
        {
            "category": "HARM_CATEGORY_HATE_SPEECH",
            "threshold": "BLOCK_ONLY_HIGH",
        },
        {
            "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            "threshold": "BLOCK_ONLY_HIGH",
        },
        {
            "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
            "threshold": "BLOCK_ONLY_HIGH",
        },
    ]
    
    model = genai.GenerativeModel(
        "gemini-2.5-flash",
        generation_config={
            "temperature": 0.9,
            "top_p": 0.95,
            "top_k": 64,
            "max_output_tokens": 8192,
        },
        safety_settings=safety_settings,
    )
    logger.info("API üstünlikli işe girizildi")
except Exception as e:
    logger.error(f"API başlatmakda ýalňyşlyk: {str(e)}")
    model = None


def create_medical_prompt(question: str, age: int = None, gender: str = None) -> str:
    prompt = f"""
Siz tejribeli we mylakatly türkmen lukman boluň. Aşakdaky adamyň saglyk barada soragyna düşnükli, 
ýönekeý we peýdaly maslahat beriň.

Maglumatlar:
- Ýaşy: {age if age else 'mälim däl'}
- Jynsy: {gender if gender else 'mälim däl'}

Soragy:
{question}

Jogabyňyzda aşakdakylary bermegiňizi haýyş edýäris:

1. Mümkin sebäpler:
   - Bu ýagdaýyň döräp biljek umumy sebäpleri näme?
   
2. Öý maslahatlary:
   - Öýde edilip bilinjek ýeňil çäreler we maslahatlar
   
3. Lukman maslahat:
   - Haçan lukmana gitmek gerek?
   - Näme alamatlarda gyssagly kömek gerek?

MÖHÜM: Soňunda hökman belläň: "Bu maslahatlar umumy maglumat üçin. Anyk diagnoz we bejeriş üçin 
lukmana ýüz tutmagyňyzy maslahat berýäris."

Türkmen dilinde, mylakatly we düşnükli ýazyň.
    """
    return prompt


@app.get("/", response_model=HealthStatus)
async def root():
    """API baş sahypasy - ýagdaýy barlamak"""
    return HealthStatus(
        status="işleýär",
        message="Türkmen Lukmançylyk Maslahat API işleýär",
        gemini_connected=model is not None,
    )


@app.get("/health", response_model=HealthStatus)
async def health_check():
    """API saglygy barlamak"""
    if model is None:
        return HealthStatus(
            status="ýalňyş", message="Hyzmat birikdirilmedi", gemini_connected=False
        )

    return HealthStatus(
        status="sagdyn", message="Ähli hyzmatlar işleýär", gemini_connected=True
    )


@app.post("/advice", response_model=MedicalAdvice, status_code=status.HTTP_200_OK)
async def get_medical_advice(
    question: MedicalQuestion, db: AsyncSession = Depends(get_db)
):
    """
    Lukmançylyk maslahat almak

    - **question**: Hassanyň soragy (10-1000 simwol)
    - **age**: Hassanyň ýaşy (hökmän däl)
    - **gender**: Jynsy - 'erkek' ýa-da 'aýal' (hökmän däl)
    """
    if model is None:
        logger.error("AI model elýeterli däl")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Hyzmat häzirki wagtda elýeterli däl. Soňrak synanyşyň.",
        )

    try:
        prompt = create_medical_prompt(
            question=question.question, age=question.age, gender=question.gender
        )

        logger.info(f"Sorag alyndy: {question.question[:50]}...")

        response = await asyncio.to_thread(model.generate_content, prompt)
        
        if not response.candidates:
            logger.warning("Jogap alynmady - kandidat ýok")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Soragy has ýönekeý ýazyp synanyşyň. Mysal: 'Kelläm agyrýar, näme etmeli?'",
            )
        
        candidate = response.candidates[0]
        
        if candidate.finish_reason != 1:
            finish_reason_messages = {
                2: "Soragy has umumy görnüşde ýazyň. Mysal: 'Kelläm agyrýar' ýerine 'Başym agyrýar, näme sebäp bolup biler?'",
                3: "Sorag gaty uzyn. Has gysga ýazyň.",
                4: "Sorag düşnüksiz. Has anyk düşündiriň.",
                5: "Ulgam ýalňyşlygy. Soňrak synanyşyň."
            }
            reason_code = candidate.finish_reason
            logger.warning(f"Jogap tamamlanmady. Sebäp: {reason_code}")
            
            detail_message = finish_reason_messages.get(
                reason_code, 
                "Soragy başgaça ýazyp synanyşyň."
            )
            
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=detail_message,
            )

        if not response.text:
            logger.warning("Boş jogap alyndy")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Jogap alynmady. Soňrak synanyşyň.",
            )

        logger.info("Üstünlikli jogap berildi")

        db_query = MedicalQuery(
            question=question.question, age=question.age, gender=question.gender
        )
        db.add(db_query)
        await db.flush()

        db_response = AIResponse(
            query_id=db_query.id, advice=response.text, model_used="gemini-2.5-flash"
        )
        db.add(db_response)
        await db.commit()

        logger.info(f"Sorag we jogap databaza saklandi (ID: {db_query.id})")

        disclaimer = """
⚠️ MÖHÜM DUÝDURYŞ: 
Bu maslahat diňe maglumat maksady bilen berilýär we hakyky lukmançylyk diagnozyny ýa-da bejergini çalyşmaýar. 
Hassalyk ýüze çyksa ýa-da alamatlaryňyz dowam etse, HÖKMANY SURATDA ýerli lukmana ýa-da keselhanä ýüz tutuň.
Gyssagly ýagdaýlarda derrew tiz kömek çagyryň!
        """.strip()

        return MedicalAdvice(advice=response.text, disclaimer=disclaimer)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Maslahat berişde ýalňyşlyk: {str(e)}")
        await db.rollback()
        
        error_message = str(e)
        
        # Check for API quota/rate limit errors
        if "429" in error_message or "quota" in error_message.lower() or "rate limit" in error_message.lower():
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Hyzmat häzirki wagtda elýeterli däl. Biraz wagtdan soň synanyşyň.",
            )
        
        if "response.text" in error_message or "finish_reason" in error_message:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Soragy başgaça ýazyp synanyşyň.",
            )
        
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Hyzmat häzirki wagtda elýeterli däl. Soňrak synanyşyň.",
        )


@app.get("/history", response_model=QueryHistory)
async def get_query_history(
    limit: int = 50, offset: int = 0, db: AsyncSession = Depends(get_db)
):
    """
    Müşderileriň soraglary we AI jogaplary taryhyny almak

    - **limit**: Bir gezekde näçe ýazgy görkermeli (deslapky: 50)
    - **offset**: Haýsy ýazgydan başlamaly (deslapky: 0)
    """
    try:
        stmt = (
            select(MedicalQuery, AIResponse)
            .join(AIResponse, MedicalQuery.id == AIResponse.query_id)
            .options(joinedload(MedicalQuery.response))
            .order_by(MedicalQuery.created_at.desc())
            .limit(limit)
            .offset(offset)
        )

        count_stmt = select(func.count(MedicalQuery.id))

        result = await db.execute(stmt)
        rows = result.all()
        
        count_result = await db.execute(count_stmt)
        total = count_result.scalar() or 0

        history_items = [
            QueryHistoryItem(
                id=query.id,
                question=query.question,
                age=query.age,
                gender=query.gender,
                advice=response.advice,
                ai_model=response.model_used,
                created_at=query.created_at,
            )
            for query, response in rows
        ]

        return QueryHistory(total=total, queries=history_items)

    except Exception as e:
        logger.error(f"Taryhy almakda ýalňyşlyk: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Taryhy almakda ýalňyşlyk: {str(e)}",
        )


@app.get("/history/{query_id}", response_model=QueryHistoryItem)
async def get_query_by_id(query_id: int, db: AsyncSession = Depends(get_db)):
    """
    Belli bir sorag we jogap ID boýunça almak

    - **query_id**: Soragyň ID belgisi
    """
    try:
        stmt = (
            select(MedicalQuery, AIResponse)
            .join(AIResponse, MedicalQuery.id == AIResponse.query_id)
            .where(MedicalQuery.id == query_id)
        )

        result = await db.execute(stmt)
        row = result.first()

        if not row:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"ID {query_id} bilen sorag tapylmady",
            )

        query, response = row

        return QueryHistoryItem(
            id=query.id,
            question=query.question,
            age=query.age,
            gender=query.gender,
            advice=response.advice,
            ai_model=response.model_used,
            created_at=query.created_at,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Soragy almakda ýalňyşlyk: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Soragy almakda ýalňyşlyk: {str(e)}",
        )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host=settings.host, port=settings.port, reload=True)

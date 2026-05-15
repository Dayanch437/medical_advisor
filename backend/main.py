import logging
import os
from contextlib import asynccontextmanager

from google import genai
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

GEMINI_MODEL = "gemini-2.5-flash"


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
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(GZipMiddleware, minimum_size=1000)

for _var in ["HTTPS_PROXY", "https_proxy", "HTTP_PROXY", "http_proxy", "ALL_PROXY", "all_proxy"]:
    _val = os.environ.get(_var, "")
    if _val.startswith("socks://"):
        os.environ[_var] = "socks5://" + _val[len("socks://"):]

try:
    gemini_client = genai.Client(api_key=settings.gemini_api_key)
    logger.info("Gemini API üstünlikli işe girizildi")
except Exception as e:
    logger.error(f"API başlatmakda ýalňyşlyk: {str(e)}")
    gemini_client = None


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
    return HealthStatus(
        status="işleýär",
        message="Türkmen Lukmançylyk Maslahat API işleýär",
        gemini_connected=gemini_client is not None,
    )


@app.get("/health", response_model=HealthStatus)
async def health_check():
    if gemini_client is None:
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
    if gemini_client is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Hyzmat häzirki wagtda elýeterli däl. Soňrak synanyşyň.",
        )

    try:
        prompt = create_medical_prompt(
            question=question.question, age=question.age, gender=question.gender
        )

        logger.info(f"Sorag alyndy: {question.question[:50]}...")

        response = await gemini_client.aio.models.generate_content(
            model=GEMINI_MODEL, contents=prompt
        )
        advice_text = response.text

        if not advice_text:
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
            query_id=db_query.id, advice=advice_text, model_used=GEMINI_MODEL
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

        return MedicalAdvice(advice=advice_text, disclaimer=disclaimer)

    except HTTPException:
        raise
    except Exception as e:
        err = str(e).lower()
        await db.rollback()
        logger.error(f"Maslahat berişde ýalňyşlyk: {str(e)}")

        if "api_key" in err or "permission" in err or "auth" in err:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="API açary nädogry. Administrator bilen habarlaşyň.",
            )
        if "quota" in err or "rate" in err or "resource_exhausted" in err:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Hyzmat häzirki wagtda elýeterli däl. Biraz wagtdan soň synanyşyň.",
            )
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Hyzmat häzirki wagtda elýeterli däl. Soňrak synanyşyň.",
        )


@app.get("/history", response_model=QueryHistory)
async def get_query_history(
    limit: int = 50, offset: int = 0, db: AsyncSession = Depends(get_db)
):
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

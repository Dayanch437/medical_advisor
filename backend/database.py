from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base, sessionmaker
from typing import AsyncGenerator

# SQLite databaza URL
DATABASE_URL = "sqlite+aiosqlite:///./medical_advice.db"

# Async engine we session
engine = create_async_engine(
    DATABASE_URL,
    echo=True,  # SQL sözlemlerini görkezmek üçin (development)
    future=True
)

# Async session maker
async_session_maker = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# Base class for models
Base = declarative_base()


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Databaza sessiýasyny almak üçin dependency"""
    async with async_session_maker() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def init_db():
    """Databazany işe girizmeк we tablitsalary döretmek"""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

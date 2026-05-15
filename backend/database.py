from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import declarative_base

from config import get_settings

DATABASE_URL = get_settings().database_url

_is_sqlite = DATABASE_URL.startswith("sqlite")

engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    future=True,
    pool_pre_ping=True,
    **({} if _is_sqlite else {"pool_size": 10, "max_overflow": 20}),
    connect_args={"check_same_thread": False} if _is_sqlite else {},
)

async_session_maker = async_sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

Base = declarative_base()


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise


async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

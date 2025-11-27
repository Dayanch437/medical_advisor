from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Programmanyň sazlamalary"""
    gemini_api_key: str
    host: str = "0.0.0.0"
    port: int = 8000
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


def get_settings() -> Settings:
    """Sazlamalary almak"""
    return Settings()

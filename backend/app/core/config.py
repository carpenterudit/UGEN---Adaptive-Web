"""Application configuration using Pydantic Settings."""
from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # App
    APP_ENV: str = "development"
    SECRET_KEY: str = "dev-secret-key-change-in-production"
    DEBUG: bool = True

    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./upgw.db"

    # CORS
    FRONTEND_URL: str = "http://localhost:5173"

    # AI
    AI_PROVIDER: str = "demo"
    OPENAI_API_KEY: str = ""
    ANTHROPIC_API_KEY: str = ""
    GOOGLE_API_KEY: str = ""
    AI_MODEL: str = "gpt-4o-mini"
    AI_TIMEOUT: int = 30

    # Rate limiting
    RATE_LIMIT_PER_MINUTE: int = 30

    # Extension
    EXTENSION_SECRET: str = "dev-extension-secret"


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

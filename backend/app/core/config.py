import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()


def get_default_database_url() -> str:
    db_env = os.getenv("DATABASE_URL")
    env = os.getenv("ENVIRONMENT", "development")
    if db_env:
        # If running in production cloud and DATABASE_URL mistakenly points to localhost,
        # fallback to SQLite so the application never crashes
        if env == "production" and ("localhost" in db_env or "127.0.0.1" in db_env):
            return "sqlite:///./family360.db"
        return db_env
    if env == "production":
        return "sqlite:///./family360.db"
    return "postgresql://family360_user:family360_pass@localhost:5432/family360"


class Settings(BaseSettings):
    PROJECT_NAME: str = "Family360"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DATABASE_URL: str = get_default_database_url()
    LLM_API_KEY: str = os.getenv("LLM_API_KEY", "")
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "openai")
    ALLOWED_ORIGINS: str = os.getenv("ALLOWED_ORIGINS", "")

    class Config:
        case_sensitive = True


settings = Settings()

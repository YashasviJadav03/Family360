import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    PROJECT_NAME: str = "Family360"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://family360_user:family360_pass@localhost:5432/family360",
    )
    LLM_API_KEY: str = os.getenv("LLM_API_KEY", "")
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "openai")
    ALLOWED_ORIGINS: str = os.getenv("ALLOWED_ORIGINS", "")

    class Config:
        case_sensitive = True


settings = Settings()

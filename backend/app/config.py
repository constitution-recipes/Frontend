from pydantic import BaseSettings
from typing import Optional
import os
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv()

class Settings(BaseSettings):
    """
    애플리케이션 설정
    환경 변수 또는 .env 파일에서 값을 가져옵니다.
    """
    # 일반 설정
    APP_NAME: str = "안식 API"
    APP_VERSION: str = "0.1.0"
    DEBUG: bool = True

    # 데이터베이스 설정
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./app.db")

    # 보안 설정
    SECRET_KEY: str = os.getenv("SECRET_KEY", "insecure_default_key_please_change_in_production")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

    # CORS 설정
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")

    class Config:
        env_file = ".env"

# 설정 인스턴스 생성
settings = Settings() 
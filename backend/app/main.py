from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from .config import settings
from .database import init_db
from .routers import auth_router, users_router

# 애플리케이션 생성
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="안식 애플리케이션을 위한 RESTful API",
)

# CORS 미들웨어 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(auth_router)
app.include_router(users_router)

# 애플리케이션 시작 시 데이터베이스 초기화
@app.on_event("startup")
def on_startup():
    init_db()

# 루트 엔드포인트
@app.get("/", tags=["health"])
def read_root():
    return {
        "app_name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "active",
    }

# 직접 실행 시 서버 시작
if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True) 
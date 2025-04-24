from sqlmodel import SQLModel, Session, create_engine
from .config import settings

# 데이터베이스 엔진 생성
engine = create_engine(
    settings.DATABASE_URL, 
    echo=settings.DEBUG,
    connect_args={"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}
)

# 데이터베이스 세션 생성 함수
def get_session():
    with Session(engine) as session:
        yield session

# 데이터베이스 초기화 함수
def init_db():
    SQLModel.metadata.create_all(engine) 
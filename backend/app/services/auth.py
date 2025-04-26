from datetime import timedelta
from sqlmodel import Session, select
from fastapi import HTTPException, status
from typing import Optional

from ..models.user import User
from ..schemas.user import UserCreate, UserResponse, Token
from ..utils.security import verify_password, get_password_hash, create_access_token
from ..config import settings

class AuthService:
    """
    인증 관련 서비스
    """
    def __init__(self, session: Session):
        self.session = session

    def register(self, user_data: UserCreate) -> User:
        """
        사용자 등록
        """
        # 이메일 중복 확인
        db_user = self.session.exec(select(User).where(User.email == user_data.email)).first()
        if db_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="이메일이 이미 등록되어 있습니다"
            )

        # 비밀번호 해싱
        hashed_password = get_password_hash(user_data.password)
        
        # 사용자 객체 생성
        db_user = User(
            email=user_data.email,
            password=hashed_password,
            name=user_data.name,
            phone_number=user_data.phone_number,
            allergies=user_data.allergies,
            health_goals=user_data.health_goals,
            current_health_status=user_data.current_health_status,
            existing_conditions=user_data.existing_conditions
        )
        
        # 데이터베이스에 저장
        self.session.add(db_user)
        self.session.commit()
        self.session.refresh(db_user)
        
        return db_user

    def authenticate(self, email: str, password: str) -> Optional[User]:
        """
        사용자 인증
        """
        # 이메일로 사용자 조회
        user = self.session.exec(select(User).where(User.email == email)).first()
        
        # 사용자가 없거나 비밀번호가 일치하지 않는 경우
        if not user or not verify_password(password, user.password):
            return None
            
        return user

    def create_token(self, user: User) -> Token:
        """
        토큰 생성
        """
        # 토큰에 포함될 데이터
        token_data = {"sub": user.email}
        
        # 액세스 토큰 생성
        expires_delta = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(token_data, expires_delta)
        
        # 사용자 정보 포함하여 토큰 반환
        user_response = UserResponse(
            id=user.id,
            email=user.email,
            name=user.name,
            phone_number=user.phone_number,
            allergies=user.allergies,
            health_goals=user.health_goals,
            current_health_status=user.current_health_status,
            existing_conditions=user.existing_conditions,
            created_at=user.created_at,
            updated_at=user.updated_at
        )
        
        return Token(
            access_token=access_token,
            token_type="bearer",
            user=user_response
        ) 
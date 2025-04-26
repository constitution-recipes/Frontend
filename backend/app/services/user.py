from sqlmodel import Session, select
from fastapi import HTTPException, status
from datetime import datetime

from ..models.user import User
from ..schemas.user import UserUpdate, UserResponse

class UserService:
    """
    사용자 관련 서비스
    """
    def __init__(self, session: Session):
        self.session = session

    def get_user_by_id(self, user_id: str) -> User:
        """
        ID로 사용자 조회
        """
        user = self.session.exec(select(User).where(User.id == user_id)).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="사용자를 찾을 수 없습니다"
            )
        return user

    def get_user_by_email(self, email: str) -> User:
        """
        이메일로 사용자 조회
        """
        user = self.session.exec(select(User).where(User.email == email)).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="사용자를 찾을 수 없습니다"
            )
        return user

    def update_user(self, user_id: str, user_data: UserUpdate) -> User:
        """
        사용자 정보 업데이트
        """
        # 사용자 조회
        user = self.get_user_by_id(user_id)
        
        # 업데이트할 데이터 적용
        user_data_dict = user_data.dict(exclude_unset=True)
        for key, value in user_data_dict.items():
            setattr(user, key, value)
            
        # 업데이트 시간 갱신
        user.updated_at = datetime.now()
        
        # 데이터베이스에 저장
        self.session.add(user)
        self.session.commit()
        self.session.refresh(user)
        
        return user

    def delete_user(self, user_id: str) -> None:
        """
        사용자 삭제
        """
        # 사용자 조회
        user = self.get_user_by_id(user_id)
        
        # 데이터베이스에서 삭제
        self.session.delete(user)
        self.session.commit()
        
    def get_user_response(self, user: User) -> UserResponse:
        """
        UserResponse 형태로 변환
        """
        return UserResponse(
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
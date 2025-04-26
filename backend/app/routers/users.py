from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from ..database import get_session
from ..models.user import User
from ..schemas.user import UserResponse, UserUpdate
from ..services.user import UserService
from ..utils.security import get_current_user

router = APIRouter(
    prefix="/users",
    tags=["users"],
)

@router.get("/me", response_model=UserResponse)
def get_current_user_info(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    현재 로그인한 사용자 정보 조회
    """
    user_service = UserService(session)
    return user_service.get_user_response(current_user)

@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    user_id: str,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    특정 사용자 정보 조회
    """
    # 관리자 기능 또는 본인 정보 조회 기능을 위한 예시
    # 현재는 자신의 정보만 조회 가능하도록 구현
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="다른 사용자의 정보를 조회할 권한이 없습니다"
        )
    
    user_service = UserService(session)
    user = user_service.get_user_by_id(user_id)
    return user_service.get_user_response(user)

@router.put("/{user_id}", response_model=UserResponse)
def update_user(
    user_id: str,
    user_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    사용자 정보 업데이트
    """
    # 본인 정보만 업데이트 가능하도록 구현
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="다른 사용자의 정보를 수정할 권한이 없습니다"
        )
    
    user_service = UserService(session)
    updated_user = user_service.update_user(user_id, user_data)
    return user_service.get_user_response(updated_user)

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: str,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    사용자 계정 삭제
    """
    # 본인 계정만 삭제 가능하도록 구현
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="다른 사용자의 계정을 삭제할 권한이 없습니다"
        )
    
    user_service = UserService(session)
    user_service.delete_user(user_id) 
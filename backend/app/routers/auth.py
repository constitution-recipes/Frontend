from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session

from ..database import get_session
from ..schemas.user import UserCreate, Token
from ..services.auth import AuthService

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)

@router.post("/signup", response_model=dict, status_code=status.HTTP_201_CREATED)
def signup(
    user_data: UserCreate,
    session: Session = Depends(get_session)
):
    """
    새 사용자 등록
    """
    auth_service = AuthService(session)
    try:
        auth_service.register(user_data)
        return {"message": "회원가입이 성공적으로 완료되었습니다"}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"회원가입 처리 중 오류가 발생했습니다: {str(e)}"
        )

@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_session)
):
    """
    사용자 로그인 및 토큰 발급
    """
    auth_service = AuthService(session)
    
    # 사용자 인증
    user = auth_service.authenticate(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="이메일 또는 비밀번호가 올바르지 않습니다",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # 토큰 생성
    token = auth_service.create_token(user)
    return token 
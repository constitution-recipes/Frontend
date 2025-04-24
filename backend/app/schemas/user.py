from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    """
    사용자 기본 스키마
    """
    email: EmailStr
    name: Optional[str] = None
    phone_number: Optional[str] = None
    allergies: Optional[str] = None
    health_goals: Optional[str] = None
    current_health_status: Optional[str] = None
    existing_conditions: Optional[str] = None

class UserCreate(UserBase):
    """
    사용자 생성 스키마
    """
    password: str

    @validator('password')
    def password_min_length(cls, v):
        if len(v) < 6:
            raise ValueError('비밀번호는 최소 6자 이상이어야 합니다')
        return v

class UserUpdate(BaseModel):
    """
    사용자 정보 업데이트 스키마
    """
    name: Optional[str] = None
    phone_number: Optional[str] = None
    allergies: Optional[str] = None
    health_goals: Optional[str] = None
    current_health_status: Optional[str] = None
    existing_conditions: Optional[str] = None
    
class UserResponse(UserBase):
    """
    사용자 응답 스키마
    """
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class Token(BaseModel):
    """
    토큰 스키마
    """
    access_token: str
    token_type: str
    user: UserResponse

class TokenData(BaseModel):
    """
    토큰 데이터 스키마
    """
    email: Optional[str] = None 
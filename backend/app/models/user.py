from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
import uuid

class User(SQLModel, table=True):
    """
    사용자 모델
    """
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    email: str = Field(unique=True, index=True)
    password: str
    name: Optional[str] = None
    phone_number: Optional[str] = None
    allergies: Optional[str] = None
    health_goals: Optional[str] = None
    current_health_status: Optional[str] = None
    existing_conditions: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    # 비밀번호를 JSON으로 반환하지 않도록 설정
    class Config:
        schema_extra = {
            "example": {
                "email": "user@example.com",
                "name": "홍길동",
                "phone_number": "010-1234-5678",
                "allergies": "peanuts,dairy",
                "health_goals": "weight_loss,energy",
                "current_health_status": "average",
                "existing_conditions": "None",
            }
        } 
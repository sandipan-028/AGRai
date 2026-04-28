from pydantic import BaseModel, EmailStr
from typing import Optional, List, Any
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    phone: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime
    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class CropPredictInput(BaseModel):
    lat: float
    lon: float
    n: float
    p: float
    k: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float

class FullAnalysisOutput(BaseModel):
    crop_recommendation: List[str]
    disease: str
    organic_solution: str
    care_plan: List[str]
    confidence: str

class YieldPredictInput(BaseModel):
    state: str
    crop: str
    season: str
    area: float
    annual_rainfall: float
    fertilizer: float
    pesticide: float

class YieldPredictOutput(BaseModel):
    predicted_yield: float
    unit: str = "Tons per Hectare"

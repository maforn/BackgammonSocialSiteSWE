from pydantic import BaseModel, Field, EmailStr
from services.database import default_id

class UserInDB(BaseModel):
    id: str = Field(default_factory=default_id, alias="_id")
    username: str
    email: EmailStr
    password: str

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    username: str
    password: str
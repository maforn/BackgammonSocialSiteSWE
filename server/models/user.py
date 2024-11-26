from pydantic import BaseModel, Field, EmailStr
from services.database import default_id
from services.rating import DEFAULT_RATING

class UserInDB(BaseModel):
    id: str = Field(default_factory=default_id, alias="_id")
    username: str
    email: EmailStr
    password: str
    rating: int = DEFAULT_RATING

class UserInLeaderboard(BaseModel):
    id: str = Field(default_factory=default_id, alias="_id")
    position: int = 0
    email: EmailStr
    rating: int = DEFAULT_RATING
    username: str

class UserOnline(BaseModel):
    id: str = Field(default_factory=default_id, alias="_id")
    username: str
    online: bool = False

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    username: str
    password: str
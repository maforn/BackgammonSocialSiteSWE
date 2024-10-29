from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from bson import ObjectId

def default_id():
    return str(ObjectId())

class UserInDB(BaseModel):
    id: str = Field(default_factory=default_id, alias="_id")
    username: str
    email: EmailStr
    password: str

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
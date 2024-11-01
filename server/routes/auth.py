from fastapi import APIRouter, HTTPException, Depends, status
from datetime import timedelta
from services.database import get_db
from models.user import UserCreate, LoginRequest
from services.auth import get_password_hash, authenticate_user, create_access_token
from services.database import default_id
from core.config import ACCESS_TOKEN_EXPIRE_MINUTES
from pymongo.errors import DuplicateKeyError

router = APIRouter()

@router.post("/register", response_model=UserCreate)
async def register_user(user: UserCreate):
    user_dict = user.dict(by_alias=True)
    user_dict["password"] = get_password_hash(user_dict.pop("password"))
    user_dict["_id"] = default_id()
    try:
        await get_db().users.insert_one(user_dict)
    except DuplicateKeyError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Username '{user_dict['username']}' or email '{user_dict['email']}' are already taken."
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/token")
async def login_for_access_token(login_request: LoginRequest):
    user = await authenticate_user(login_request.username, login_request.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
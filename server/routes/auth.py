from datetime import timedelta

from core.config import ACCESS_TOKEN_EXPIRE_MINUTES, GOOGLE_CLIENT_ID
from fastapi import APIRouter, HTTPException, status
from google.auth.transport.requests import Request
from google.oauth2 import id_token
from models.user import UserCreate, LoginRequest, DEFAULT_RATING, UserInDB
from pydantic import BaseModel
from pymongo.errors import DuplicateKeyError
from services.ai import is_ai
from services.auth import get_password_hash, authenticate_user, create_access_token, get_user_by_email, \
    send_password_reset_email, create_reset_token, verify_reset_token, update_user_password
from services.database import default_id, get_db

router = APIRouter()


class GoogleLoginRequest(BaseModel):
    code: str


@router.post("/google-login")
async def google_login(request: GoogleLoginRequest):
    try:
        id_info = id_token.verify_oauth2_token(request.code, Request(), GOOGLE_CLIENT_ID)
        email = id_info.get("email")
        if not email:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid Google token")

        user = await get_user_by_email(email)
        if not user:
            user = UserInDB(email=email, username=email.split('@')[0], password=None)
            get_db().users.insert_one(user.dict(by_alias=True))

        access_token = create_access_token(data={"sub": user.username})
        return {"access_token": access_token, "username": user.username}
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid Google token")


@router.post("/register")
async def register_user(user: UserCreate):
    user_dict = user.dict(by_alias=True)
    user_dict["password"] = get_password_hash(user_dict.pop("password"))
    user_dict["_id"] = default_id()
    user_dict["rating"] = DEFAULT_RATING

    if is_ai(user_dict["username"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username cannot be 'ai_easy', 'ai_medium', or 'ai_hard'.",
        )

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


class PasswordRecoveryRequest(BaseModel):
    email: str


class PasswordResetRequest(BaseModel):
    token: str
    new_password: str


@router.post("/password-recovery")
async def password_recovery(request: PasswordRecoveryRequest):
    user = await get_user_by_email(request.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    token = create_reset_token(user["_id"])
    await send_password_reset_email(user["email"], token)
    return {"message": "Password recovery email sent"}


@router.post("/password-reset")
async def password_reset(request: PasswordResetRequest):
    user_id = verify_reset_token(request.token)
    if not user_id:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
    await update_user_password(user_id, request.new_password)
    return {"message": "Password has been reset"}

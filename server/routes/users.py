from fastapi import APIRouter, HTTPException, Depends, status
from jose import JWTError, jwt
from models.user import UserInDB
from services.user import get_user
from core.config import SECRET_KEY, ALGORITHM
from services.auth import oauth2_scheme

from models.user import UserOnline
from routes.websocket import manager
from services.user import get_all_users

router = APIRouter()

@router.get("/users/me", response_model=UserInDB)
async def read_users_me(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = await get_user(username)
    if user is None:
        raise credentials_exception
    return user


@router.get("/users", response_model=list[UserOnline])
async def get_users():
    users = await get_all_users()
    for user in users:
        user.online = user.username in manager.online_users
    return users
from core.config import SECRET_KEY, ALGORITHM
from fastapi import APIRouter, HTTPException, Depends, status
from jose import JWTError, jwt
from models.user import UserInDB
from models.user import UserOnline, UserInLeaderboard
from services.auth import get_user_from_token
from services.auth import oauth2_scheme
from services.user import get_all_users, get_all_users_leaderboard
from services.user import get_user
from services.user import get_usernames_starting_with
from services.websocket import manager

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


@router.get("/users/search")
async def search_usernames(query: str):
    usernames = await get_usernames_starting_with(query)
    return usernames


@router.get("/users/top5_and_me")
async def get_top5_and_me(token: str = Depends(oauth2_scheme)):
    '''
    Returns data about the top 5 users (sorted by rating, descending) in the leaderboard + the user making the request. 
    The requester's data is ALWAYS the last element in the array.
    '''
    username = (await get_user_from_token(token)).username
    # Get top 5 users data, adding information about their position in the leaderboard we're creating
    users = await get_all_users_leaderboard()
    users = sorted(users, key=lambda u: u.rating, reverse=True)
    my_position = None
    for user in users:
        user.position = users.index(user) + 1  # Memorize for later, in case the user is not in the top 5
        if user.username == username:
            my_position = user.position
    users = users[:5]

    # Add info about the user making the request at the last position of the array
    me = await get_user(username)
    users.append(UserInLeaderboard(**me.dict(), position=my_position))

    return users

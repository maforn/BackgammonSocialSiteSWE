from models.user import UserInDB
from services.database import get_db

async def get_user(username: str):
    user = await get_db().users.find_one({"username": username})
    if user:
        return UserInDB(**user)

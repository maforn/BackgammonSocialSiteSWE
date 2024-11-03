from models.user import UserInDB, UserOnline
from services.database import get_db

async def get_user(username: str):
    user = await get_db().users.find_one({"username": username})
    if user:
        return UserInDB(**user)

async def get_all_users():
    users = await get_db().users.find().to_list(length=None)
    return [UserOnline(**user) for user in users]
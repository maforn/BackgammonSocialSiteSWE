from bson import ObjectId
from models.board_configuration import Match
from services.database import get_db


async def create_invite(player1: str, player2: str, first_to: int):
    match = Match(player1=player1, player2=player2, first_to=first_to)
    match_data = match.dict(by_alias=True)
    await get_db().matches.insert_one(match_data)


async def get_pending_invites(username: str):
    pending_invites = await get_db().matches.find({"player2": username, "status": "pending"}).to_list(length=None)
    return pending_invites


async def accept_invite(invite_id: str):
    await get_db().matches.update_one({"_id": invite_id}, {"$set": {"status": "started"}})

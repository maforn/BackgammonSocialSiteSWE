import random

from models.board_configuration import Match
from services.database import get_db


def throw_dice():
    die1 = random.randint(1, 6)
    die2 = random.randint(1, 6)
    return die1, die2


async def get_current_game(username: str) -> Match:
    match_data = await get_db().matches.find_one({
        "$or": [{"player1": username}, {"player2": username}],
        "status": "started"
    })
    if match_data:
        return Match(**match_data)
    return None


async def create_started_match(player1: str, player2: str, first_to: int=1):
    new_match = Match(player1=player1, player2=player2, status="started", first_to=first_to)
    match_data = new_match.dict(by_alias=True)
    await get_db().matches.insert_one(match_data)
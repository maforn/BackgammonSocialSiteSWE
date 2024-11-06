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
        "status": "pending"
    })
    if match_data:
        return Match(**match_data)
    return None

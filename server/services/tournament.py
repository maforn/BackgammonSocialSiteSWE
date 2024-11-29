from models.tournament import Tournament, CreateTournamentRequest
from typing import List
from services.database import get_db

async def get_current_tournament(username: str) -> Tournament:
    tournament_data = await get_db().tournaments.find_one({
        "participants": {"$in": [username]},
        "status": "started"
    })
    if tournament_data:
        return Tournament(**tournament_data)
    return None

async def get_available_tournaments(username: str) -> List[Tournament]:
    tournament_data = await get_db().tournaments.find({
        "$or": [
            {"participants": {"$in": [username]}},
            {"open": True}
        ]
    }).to_list(length=None)
    if tournament_data:
        return [Tournament(**tournament) for tournament in tournament_data]
    return None

async def create_new_tournament(request: CreateTournamentRequest, owner: str):
    new_tournament = Tournament(owner=owner, 
                                participants= [owner] if request.open else request.participants, 
                                open=request.open,
                                name=request.name,
                                match_ids=[],
                                status="pending",
                                rounds_to_win=request.rounds_to_win
                                )
    tournament_data = new_tournament.model_dump(by_alias=True)
    await get_db().tournaments.insert_one(tournament_data)
    print(new_tournament)
    return new_tournament
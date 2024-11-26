from models.tournament import Tournament, CreateTournamentRequest
from services.database import get_db

async def get_current_tournament(username: str) -> Tournament:
    tournament_data = await get_db().tournaments.find_one({
        "participants": {"$in": [username]}
    })
    if tournament_data:
        return Tournament(**tournament_data)
    return None

async def create_new_tournament(request: CreateTournamentRequest, owner: str):
    new_tournament = Tournament(owner=owner, 
                                participants=[owner], 
                                open=request.open,
                                name=request.name,
                                match_ids=[],
                                status="pending")
    tournament_data = new_tournament.model_dump(by_alias=True)
    await get_db().tournaments.insert_one(tournament_data)
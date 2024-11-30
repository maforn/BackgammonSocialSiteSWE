from models.tournament import Tournament, CreateTournamentRequest
from fastapi import HTTPException
from typing import List
from services.database import get_db

async def get_current_tournament(username: str) -> Tournament:
    tournament_data = await get_db().tournaments.find_one({
        "confirmed_participants": {"$in": [username]},
        "status": {"$in": ["pending", "started"]},
    })
    if tournament_data:
        return Tournament(**tournament_data)
    return None

async def get_available_tournaments(username: str) -> List[Tournament]:
    # Get all tournaments that are closed tournaments that the user is invited to OR open tournaments with less than 4 participants 
    tournament_data = await get_db().tournaments.find({
        "$and": [
        {"status": "pending"},
        {
            "$or": [
                {"participants": {"$in": [username]}},
                {"$and": [
                    {"open": True},
                    {"$expr": {"$lt": [{"$size": "$participants"}, 4]}}
                ]}
            ]
        }
    ]
    }).to_list(length=None)
    if tournament_data:
        return [Tournament(**tournament) for tournament in tournament_data]
    return None

async def create_new_tournament(request: CreateTournamentRequest, owner: str):
    new_tournament = Tournament(owner=owner, 
                                participants= [owner] if request.open else request.participants,
                                confirmed_participants=[owner], 
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

async def get_tournament_id_from_owner_and_name(owner: str, name: str) -> Tournament:
    tournament_data = await get_db().tournaments.find_one({
        "owner": owner,
        "name": name
    })
    if tournament_data:
        return tournament_data["_id"]
    return ""

async def add_participant_to_tournament(tournament_id: str, participant=str):
    tournament = await get_db().tournaments.find_one({"_id": tournament_id})

    if(not tournament):
        raise HTTPException(status_code=404, detail="No corresponding tournament found")
    
    is_open = tournament["open"]
    participants = tournament["participants"]
    confirmed_participants = tournament["confirmed_participants"]

    if(is_open):
        #Join open tournament. Check that there are less than 4 participants and that participant is not already in participants.
        #Finally, add participant to participants and confirmed_participants
        if(len(participants) >= 4 or participant in participants):
            raise HTTPException(status_code=400, detail="Cannot join tournament")
        else:
            await get_db().tournaments.update_one(
                {"_id": tournament_id},
                {
                    "$push": {
                        "participants": participant,
                        "confirmed_participants": participant
                    }
                }
            )
    else:
        #Join closed tournament. Check that participant is in participants (invited), then that participant is not already in confirmed_participants.
        #Finally, add participant to confirmed_participants
        if(not participant in participants):
            raise HTTPException(status_code=400, detail="Not invited to tournament")
        else:
            if(participant in confirmed_participants):
                raise HTTPException(status_code=400, detail="Already joined tournament")
            else:
                await get_db().tournaments.update_one(
                    {"_id": tournament_id},
                    {
                        "$push": {
                            "confirmed_participants": participant
                        }
                    }
                )
    return
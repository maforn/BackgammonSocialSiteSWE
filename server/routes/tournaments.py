from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from services.auth import oauth2_scheme, get_user_from_token
from models.tournament import CreateTournamentRequest
from services.tournament import get_current_tournament, get_available_tournaments, create_new_tournament
from routes.game import game_exists
from fastapi.encoders import jsonable_encoder

router = APIRouter()


@router.post("/tournaments")
async def create_tournament_endpoint(request: CreateTournamentRequest, token: str = Depends(oauth2_scheme)):
    if await tournament_exists(token=token):
        raise HTTPException(status_code=400, detail="You have already joined a tournament")
    elif await game_exists(token=token):
        raise HTTPException(status_code=400, detail="You cannot create a tournament while playing a game")
    else:
        user = await get_user_from_token(token)
        created_tournament = await create_new_tournament(request=request, owner=user.username)
        print(created_tournament)
        return JSONResponse(status_code=200, content={"tournament": jsonable_encoder(created_tournament)})


@router.get("/tournaments")
async def game(token: str = Depends(oauth2_scheme)):
    user = await get_user_from_token(token)
    current_tournament = await get_current_tournament(user.username)
    if not current_tournament:
        raise HTTPException(status_code=404, detail="No started tournament found")
    print(current_tournament)
    return current_tournament.model_dump(by_alias=True)

@router.get("/tournaments/available")
async def available_tournaments(token: str = Depends(oauth2_scheme)):
    user = await get_user_from_token(token)
    available_tournaments = await get_available_tournaments(user.username)
    if not available_tournaments:
        raise HTTPException(status_code=404, detail="No available tournaments found")
    return [tournament.model_dump(by_alias=True) for tournament in available_tournaments]


@router.get("/tournaments/exists")    
async def tournament_exists(token: str = Depends(oauth2_scheme)):
    user = await get_user_from_token(token)
    current_tournament = await get_current_tournament(user.username)
    if not current_tournament:
        return False
    return True
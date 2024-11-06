from fastapi import APIRouter, Depends, HTTPException
from models.board_configuration import Match
from services.auth import oauth2_scheme, get_user_from_token
from services.database import get_db
from services.game import throw_dice, get_current_game
from services.websocket import manager

router = APIRouter()


# DEBUG
async def create_match(player1: str, player2: str):
    new_match = Match(player1=player1, player2=player2)
    match_data = new_match.dict(by_alias=True)
    await get_db().matches.insert_one(match_data)


@router.get("/game")
async def game(token: str = Depends(oauth2_scheme)):
    user = await get_user_from_token(token)
    current_game = await get_current_game(user.username)
    if not current_game:
        raise HTTPException(status_code=400, detail="No pending game found")
    return current_game.dict(by_alias=True)


@router.post("/move_piece")
async def move(move_data: dict, token: str = Depends(oauth2_scheme)):
    user = await get_user_from_token(token)
    current_game = await get_current_game(user.username)

    if not current_game or current_game.status != "pending":
        raise HTTPException(status_code=400, detail="No ongoing game found")

    if (current_game.turn % 2 == 0 and current_game.player1 != user.username) or \
            (current_game.turn % 2 == 1 and current_game.player2 != user.username):
        raise HTTPException(status_code=400, detail="It's not your turn")

    board_value = move_data.get("board")
    dice_value = move_data.get("dice")

    current_game.board_configuration = board_value
    current_game.used.append(dice_value)

    if len(current_game.used) >= 2:
        current_game.turn += 1
        current_game.dice = []
        current_game.used = []

    await get_db().matches.update_one({"_id": current_game.id}, {
        "$set": {"board_configuration": current_game.board_configuration, "used": current_game.used,
                 "dice": current_game.dice,
                 "turn": current_game.turn}})

    websocket_player1 = await manager.get_user(current_game.player1)
    if websocket_player1:
        await manager.send_personal_message({"type": "move_piece", "match": current_game.dict(by_alias=True)},
                                            websocket_player1)
    websocket_player2 = await manager.get_user(current_game.player2)
    if websocket_player2:
        await manager.send_personal_message({"type": "move_piece", "match": current_game.dict(by_alias=True)},
                                            websocket_player2)


@router.get("/throw_dice")
async def dice_endpoint(token: str = Depends(oauth2_scheme)):
    await create_match("m", "a")
    user = await get_user_from_token(token)
    current_game = await get_current_game(user.username)

    if not current_game or current_game.status != "pending":
        raise HTTPException(status_code=400, detail="No pending game found")

    if (current_game.turn % 2 == 0 and current_game.player1 != user.username) or \
            (current_game.turn % 2 == 1 and current_game.player2 != user.username):
        raise HTTPException(status_code=400, detail="It's not your turn")

    if current_game.dice:
        raise HTTPException(status_code=400, detail="Dices already thrown")

    result = throw_dice()
    current_game.dice = result
    await get_db().matches.update_one({"_id": current_game.id}, {"$set": {"dice": result}})
    websocket_player1 = await manager.get_user(current_game.player1)
    if websocket_player1:
        await manager.send_personal_message({"type": "dice_roll", "result": result}, websocket_player1)
    websocket_player2 = await manager.get_user(current_game.player2)
    if websocket_player2:
        await manager.send_personal_message({"type": "dice_roll", "result": result}, websocket_player2)

from fastapi import APIRouter, Depends, HTTPException
from models.board_configuration import Match
from services.auth import oauth2_scheme, get_user_from_token
from services.database import get_db
from services.game import throw_dice, get_current_game
from services.websocket import manager

router = APIRouter()


@router.get("/game")
async def game(token: str = Depends(oauth2_scheme)):
    user = await get_user_from_token(token)
    current_game = await get_current_game(user.username)
    if not current_game:
        raise HTTPException(status_code=400, detail="No started game found")
    return current_game.dict(by_alias=True)

@router.get("/game/exists")
async def game_exists(token: str = Depends(oauth2_scheme)):
    user = await get_user_from_token(token)
    current_game = await get_current_game(user.username)
    if not current_game:
        return False
    return True


@router.post("/move_piece")
async def move(move_data: dict, token: str = Depends(oauth2_scheme)):
    user = await get_user_from_token(token)
    current_game = await get_current_game(user.username)

    if not current_game or current_game.status != "started":
        raise HTTPException(status_code=400, detail="No ongoing game found")

    if (current_game.turn % 2 == 0 and current_game.player1 != user.username) or \
            (current_game.turn % 2 == 1 and current_game.player2 != user.username):
        raise HTTPException(status_code=400, detail="It's not your turn")

    board_value = move_data.get("board")
    dice_value = move_data.get("dice")

    current_game.board_configuration = board_value
    if dice_value in current_game.available:
        current_game.available.remove(dice_value)

    if len(current_game.available) <= 0:
        current_game.turn += 1
        current_game.dice = []
        current_game.available = []

    await get_db().matches.update_one({"_id": current_game.id}, {
        "$set": {"board_configuration": current_game.board_configuration, "available": current_game.available,
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
    user = await get_user_from_token(token)
    current_game = await get_current_game(user.username)

    if not current_game or current_game.status != "started":
        raise HTTPException(status_code=400, detail="No started game found")

    if (current_game.turn % 2 == 0 and current_game.player1 != user.username) or \
            (current_game.turn % 2 == 1 and current_game.player2 != user.username):
        raise HTTPException(status_code=400, detail="It's not your turn")

    if current_game.dice:
        raise HTTPException(status_code=400, detail="Dices already thrown")

    result = throw_dice()
    current_game.dice = result
    if result[0] == result[1]:
        current_game.available = [result[0]] * 4
    else:
        current_game.available = result

    print(current_game.available)

    await get_db().matches.update_one({"_id": current_game.id}, {"$set": {"dice": result, "available": current_game.available}})
    websocket_player1 = await manager.get_user(current_game.player1)
    if websocket_player1:
        await manager.send_personal_message({"type": "dice_roll", "result": result, "available": current_game.available}, websocket_player1)
    websocket_player2 = await manager.get_user(current_game.player2)
    if websocket_player2:
        await manager.send_personal_message({"type": "dice_roll", "result": result, "available": current_game.available}, websocket_player2)

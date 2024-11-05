from fastapi import APIRouter
from fastapi import Depends
from services.auth import oauth2_scheme, get_user_from_token
from services.dice import throw_dice
from services.websocket import manager

router = APIRouter()


@router.get("/throw_dice")
async def dice_endpoint(token: str = Depends(oauth2_scheme)):
    # TODO: check and ws manager send to users playing
    result = throw_dice()
    # get user from JWT token
    user = await get_user_from_token(token)
    websocket = await manager.get_user(user.username)
    await manager.send_personal_message({"type": "dice_roll", "result": result}, websocket)

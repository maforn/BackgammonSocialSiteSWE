from fastapi import APIRouter
import random
from services.dice import throw_dice

router = APIRouter()

@router.get("/throw_dice")
async def dice_endpoint():
    result = throw_dice()
    return {"die1": result[0], "die2": result[1]}

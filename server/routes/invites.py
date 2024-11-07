from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from models.board_configuration import CreateInviteRequest, AcceptInviteRequest
from services.auth import oauth2_scheme, get_user_from_token
from services.database import get_db
from services.invite import create_invite, get_pending_invites, accept_invite
from services.websocket import manager

router = APIRouter()


def serialize_invite(invite):
    invite["_id"] = str(invite["_id"])
    return invite


@router.get("/invites")
async def receive_invite_endpoint(token: str = Depends(oauth2_scheme)):
    user = await get_user_from_token(token)
    pending_invites = await get_pending_invites(user.username)
    serialized_invites = [serialize_invite(invite) for invite in pending_invites]
    return JSONResponse(status_code=200, content={"pending_invites": serialized_invites})


@router.post("/invites")
async def create_invite_endpoint(request: CreateInviteRequest, token: str = Depends(oauth2_scheme)):
    user = await get_user_from_token(token)
    opponent_username = request.opponent_username
    if user.username == opponent_username:
        raise HTTPException(status_code=400, detail="You cannot invite yourself")
    await create_invite(user.username, opponent_username)
    websocket = await manager.get_user(opponent_username)
    if websocket:
        await manager.send_personal_message({"type": "invite", "from": user.username}, websocket)
    return JSONResponse(status_code=200, content={"message": "Invite created successfully"})


@router.post("/invites/accept")
async def accept_invite_endpoint(request: AcceptInviteRequest, token: str = Depends(oauth2_scheme)):
    user = await get_user_from_token(token)
    invite_id = request.invite_id
    invite = await get_db().matches.find_one({"_id": invite_id, "status": "pending"})
    already_started_matches = await get_db().matches.find(
        {"$or": [{"player1": user.username}, {"player2": user.username}], "status": "started"}).to_list(length=None)
    if len(already_started_matches) > 0:
        raise HTTPException(status_code=400, detail="You are already playing a match")
    if invite is None:
        raise HTTPException(status_code=404, detail="Invite not found")
    if invite["player2"] != user.username:
        raise HTTPException(status_code=403, detail="You are not the recipient of this invite")
    await accept_invite(invite_id)
    websocket = await manager.get_user(invite["player1"])
    if websocket:
        await manager.send_personal_message({"type": "invite-accepted", "from": user.username}, websocket)
    return JSONResponse(status_code=200, content={"message": "Invite accepted successfully"})

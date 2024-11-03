# server/routes/websocket.py
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException, status
from typing import List, Dict
from jose import JWTError, jwt
from core.config import SECRET_KEY, ALGORITHM
from services.auth import oauth2_scheme

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.online_users: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, username: str):
        await websocket.accept()
        self.active_connections.append(websocket)
        self.online_users[username] = websocket

    def disconnect(self, websocket: WebSocket, username: str):
        self.active_connections.remove(websocket)
        if username in self.online_users:
            del self.online_users[username]

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    return username

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, token: str = Depends(oauth2_scheme)):
    username = await get_current_user(token)
    await manager.connect(websocket, username)
    try:
        await manager.broadcast(f"{username} joined the chat")
        while True:
            data = await websocket.receive_text()
            await manager.broadcast(f"{username} says: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket, username)
        await manager.broadcast(f"{username} left the chat")
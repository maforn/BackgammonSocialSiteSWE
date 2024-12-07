import contextlib
import uvicorn
from fastapi import FastAPI
from starlette.exceptions import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.websockets import WebSocket, WebSocketDisconnect

from core import config
from middlewares.auth import AuthMiddleware
from routes import routers
from services.database import create_indexes, initialize_db_connection
from services.websocket import get_current_user, manager

app = FastAPI()
api_app = FastAPI()

api_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to your needs
    allow_credentials=True,
    allow_methods=["*"],  # This allows all methods, including OPTIONS
    allow_headers=["*"],
)


@contextlib.asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize the database connection
    initialize_db_connection()
    await create_indexes()
    yield
    # Add any shutdown tasks here if needed


app.router.lifespan_context = lifespan
api_app.add_middleware(AuthMiddleware)

# Include the routers in the sub-application
for router in routers:
    api_app.include_router(router)

# Mount the sub-application under the /api path
app.mount("/api", api_app)


class SPAStaticFiles(StaticFiles):
    async def get_response(self, path: str, scope):
        try:
            return await super().get_response(path, scope)
        except (HTTPException) as ex:
            if ex.status_code == 404:
                return await super().get_response("index.html", scope)
            else:
                raise ex


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, token: str):
    username = await get_current_user(token)
    await manager.connect(websocket, username)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.handle_message(data, websocket, username)
    except WebSocketDisconnect:
        manager.disconnect(websocket, username)


app.mount('/', SPAStaticFiles(directory=config.CLIENT_DIST,
          html=True), name='client')

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)

from .auth import router as auth_router
from .users import router as users_router
from .websocket import router as websocket_router

routers = [auth_router, users_router, websocket_router]
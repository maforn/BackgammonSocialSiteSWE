from .auth import router as auth_router
from .users import router as users_router
from .game import router as game_router

routers = [auth_router, users_router, game_router]
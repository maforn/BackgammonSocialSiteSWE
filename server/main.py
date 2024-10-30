from fastapi import FastAPI
import contextlib
import uvicorn
from services.database import create_indexes, initialize_db_connection
from routes import routers

app = FastAPI()

@contextlib.asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize the database connection
    initialize_db_connection()
    await create_indexes()
    yield
    # Add any shutdown tasks here if needed

app.router.lifespan_context = lifespan

# Include the routers
for router in routers:
    app.include_router(router)

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
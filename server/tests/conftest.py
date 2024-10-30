import pytest
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app
from services.database import initialize_db_connection, create_indexes, get_db
from httpx import AsyncClient

@pytest.fixture(scope="session")
def anyio_backend():
    return "asyncio"

@pytest.fixture(scope="session")
async def client():
    # Initialize the database connection
    initialize_db_connection()
    await create_indexes()

    # Remove the test user if it exists
    await clear_db()

    async with AsyncClient(app=app, base_url="http://test") as client:
        print("Client is ready")
        yield client

async def clear_db():
    db = get_db()
    await db.users.delete_one({"username": "testuser"})
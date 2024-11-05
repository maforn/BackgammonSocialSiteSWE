import os
import sys
from datetime import timedelta

import pytest

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app
from services.database import initialize_db_connection, create_indexes, get_db
from httpx import AsyncClient
from services.auth import create_access_token
from core.config import ACCESS_TOKEN_EXPIRE_MINUTES


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


@pytest.fixture(scope="session")
def token():
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    encoded_jwt = create_access_token(
        data={"sub": "testuser"}, expires_delta=access_token_expires
    )
    return encoded_jwt

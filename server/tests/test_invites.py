from venv import create

import pytest
from httpx import AsyncClient
from services.database import get_db
from services.invite import create_invite


@pytest.mark.anyio
async def test_receive_invite_endpoint(client: AsyncClient, token: str):
    response = await client.get("/api/invites", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert "pending_invites" in response.json()


@pytest.mark.anyio
async def test_create_invite_endpoint(client: AsyncClient, token: str):
    await get_db().matches.delete_many({"$or": [{"player1": "testuser"}, {"player2": "testuser"}]})
    response = await client.post("/api/invites", json={"opponent_username": "testuser2", "rounds_to_win": 1},
                                 headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json() == {"message": "Invite created successfully"}


@pytest.mark.anyio
async def test_accept_invite_endpoint(client: AsyncClient, token: str):
    await get_db().matches.delete_many({"$or": [{"player1": "testuser"}, {"player2": "testuser"}]})
    await create_invite("testuser1", "testuser", 1)
    response = await client.get("/api/invites", headers={"Authorization": f"Bearer {token}"})
    print(response.json())
    response = await client.post("/api/invites/accept", json={"invite_id": response.json()["pending_invites"][0]["_id"]},
                                 headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json() == {"message": "Invite accepted successfully"}
import pytest
from httpx import AsyncClient
from services.database import get_db
from services.invite import create_invite


@pytest.mark.anyio
async def test_receive_invite_endpoint(client: AsyncClient, token: str):
    response = await client.get("/invites", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert "pending_invites" in response.json()


@pytest.mark.anyio
async def test_create_invite_endpoint(client: AsyncClient, token: str):
    response = await client.post("/invites", json={"opponent_username": "opponent", "rounds_to_win": 1},
                                 headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json() == {"message": "Invite created successfully"}


@pytest.mark.anyio
async def test_create_invite_endpoint(client: AsyncClient, token: str):
    await get_db().matches.delete_many({"$or": [{"player1": "testuser"}, {"player2": "testuser"}]})
    response = await client.post("/invites", json={"opponent_username": "opponent", "rounds_to_win": 1},
                                 headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json() == {"message": "Invite created successfully"}
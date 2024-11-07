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
    response = await client.post("/api/invites", json={"opponent_username": "opponent"},
                                 headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json() == {"message": "Invite created successfully"}


@pytest.mark.anyio
async def test_accept_invite_endpoint(client: AsyncClient, token: str):
    await get_db().matches.delete_many({"$or": [{"player1": "testuser"}, {"player2": "testuser"}]})
    await create_invite("opponent", "testuser")
    invite = await get_db().matches.find_one({"status": "pending", "player2": "testuser"})
    assert invite is not None
    response = await client.post("/api/invites/accept", json={"invite_id": str(invite["_id"])},
                                 headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json() == {"message": "Invite accepted successfully"}

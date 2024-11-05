import pytest
from httpx import AsyncClient


@pytest.mark.anyio
async def test_read_users_me(client: AsyncClient, token: str):
    response = await client.get("/users/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json()["username"] == "testuser"

@pytest.mark.anyio
async def test_get_users(client: AsyncClient, token: str):
    response = await client.get("/users", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert isinstance(response.json(), list)
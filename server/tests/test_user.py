import pytest
from httpx import AsyncClient

@pytest.mark.anyio
async def test_register_user(client: AsyncClient):
    response = await client.post("/register", json={
        "username": "testuser",
        "email": "testuser@example.com",
        "password": "testpassword"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()

@pytest.mark.anyio
async def test_login_user(client: AsyncClient):
    response = await client.post("/token", json={
        "username": "testuser",
        "password": "testpassword"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()

@pytest.mark.anyio
async def test_read_users_me(client: AsyncClient, token: str):
    response = await client.get("/users/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json()["username"] == "testuser"
import pytest
from httpx import AsyncClient

@pytest.mark.anyio
async def test_throw_dice(client: AsyncClient, token: str):
    response = await client.get("/throw_dice", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()
    assert "die1" in data
    assert "die2" in data
    assert 1 <= data["die1"] <= 6
    assert 1 <= data["die2"] <= 6
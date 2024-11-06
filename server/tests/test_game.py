import pytest
from httpx import AsyncClient

from routes.game import create_match

from services.database import get_db


@pytest.mark.anyio
async def test_throw_dice(client: AsyncClient, token: str):
    await create_match("testuser", "a")
    old_match = await get_db().matches.find_one({"player1": "testuser"})
    response = await client.get("/throw_dice", headers={"Authorization": f"Bearer {token}"})
    updated_match = await get_db().matches.find_one({"player1": "testuser"})
    assert updated_match != old_match
    assert updated_match["dice"] != []
    assert response.status_code == 200


@pytest.mark.anyio
async def test_move_piece(client: AsyncClient, token: str):
    await create_match("testuser", "a")
    await get_db().matches.update_one({"player1": "testuser"}, {"$set": {"dice": [3, 5], "used": []}})
    move_data = {
        "board": {
            "points": [{"player1": 1, "player2": 0} for _ in range(24)],
            "bar": {"player1": 0, "player2": 0}
        },
        "dice": 3
    }
    response = await client.post("/move_piece", json=move_data, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    updated_game = await get_db().matches.find_one({"player1": "testuser"})
    assert updated_game is not None
    assert updated_game["board_configuration"]["points"][3]["player1"] == 1
    assert updated_game["used"] == [3]
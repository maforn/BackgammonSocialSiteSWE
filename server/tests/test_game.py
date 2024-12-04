import pytest
from httpx import AsyncClient
from services.database import get_db
from services.game import create_started_match, update_match

from tests.conftest import clear_matches


@pytest.mark.anyio
async def test_throw_start_dice(client: AsyncClient, token: str):
    await clear_matches()
    await create_started_match("testuser", "testuser2")
    response = await client.get("/throw_start_dice", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    match = await get_db().matches.find_one({"player1": "testuser"})
    assert match is not None
    assert match["startDice"]["roll1"] > 0
    assert match["startDice"]["roll2"] <= 0
    assert match["startDice"]["count1"] == 1
    assert match["startDice"]["count2"] == 0


@pytest.mark.anyio
async def test_throw_dice(client: AsyncClient, token: str):
    await clear_matches()
    await create_started_match("testuser", "testuser2")
    await update_match({"player1": "testuser"}, {"$set": {"turn": 0}})
    old_match = await get_db().matches.find_one({"player1": "testuser"})
    response = await client.get("/throw_dice", headers={"Authorization": f"Bearer {token}"})
    updated_match = await get_db().matches.find_one({"player1": "testuser"})
    assert updated_match != old_match
    assert updated_match["dice"] != []
    assert response.status_code == 200


@pytest.mark.anyio
async def test_move_piece(client: AsyncClient, token: str):
    await clear_matches()
    await create_started_match("testuser", "testuser2")
    await update_match({"player1": "testuser"}, {"$set": {"dice": [3, 5], "available": [3, 5], "turn": 0}})
    move_data = {
        "board": {
            "points": [{"player1": 1, "player2": 0} for _ in range(24)],
            "bar": {"player1": 0, "player2": 0}
        },
        "dice": 3
    }
    response = await client.post("/move/piece", json=move_data, headers={"Authorization": f"Bearer {token}"})
    updated_match = await get_db().matches.find_one({"player1": "testuser"})
    assert updated_match["dice"] != []
    assert response.status_code == 200


@pytest.mark.anyio
async def test_game(client: AsyncClient, token: str):
    await clear_matches()
    await create_started_match("testuser", "testuser2")
    response = await client.get("/game", headers={"Authorization": f"Bearer {token}"})
    assert "dice" in response.json()
    assert response.status_code == 200


@pytest.mark.anyio
async def test_move_piece(client: AsyncClient, token: str):
    await clear_matches()
    await create_started_match("testuser", "testuser2")
    await update_match({"player1": "testuser"}, {"$set": {"dice": [3, 5], "available": [3, 5], "turn": 0}})
    move_data = {
        "board": {
            "points": [{"player1": 1, "player2": 0} for _ in range(24)],
            "bar": {"player1": 0, "player2": 0}
        },
        "dice": 3
    }
    response = await client.post("/move/piece", json=move_data, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    updated_game = await get_db().matches.find_one({"player1": "testuser"})
    assert updated_game is not None
    assert updated_game["board_configuration"]["points"][3]["player1"] == 1
    assert updated_game["available"] == [5]


@pytest.mark.anyio
async def test_send_in_game_message(client: AsyncClient, token: str):
    await clear_matches()
    message_data = {
        "message": "Test message",
    }
    response = await client.post("/game/message", json=message_data, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 400

    await create_started_match("testuser", "testuser2")
    response = await client.post("/game/message", json=message_data, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200


@pytest.mark.anyio
async def test_move_ai(client: AsyncClient, token: str):
    await clear_matches()
    await create_started_match("testuser", "ai_easy")
    await update_match({"player1": "testuser"}, {"$set": {"dice": [3, 5], "available": [3, 5], "turn": 0}})
    move_data = {
        "board": {
            "points": [{"player1": 1, "player2": 0} for _ in range(24)],
            "bar": {"player1": 0, "player2": 0}
        }
    }
    response = await client.post("/move/ai", json=move_data, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    updated_game = await get_db().matches.find_one({"player1": "testuser"})
    assert updated_game is not None
    assert updated_game["board_configuration"]["points"][3]["player1"] == 1
    assert updated_game["turn"] == 1


@pytest.mark.anyio
async def test_round_progression(client: AsyncClient, token: str):
    await clear_matches()
    await create_started_match("testuser", "testuser2")
    await update_match({"player1": "testuser"}, {
        "$set": {"turn": 20, "dice": [3, 5], "available": [3, 5], "rounds_to_win": 3, "winsP1": 0, "winsP2": 0}})
    move_data = {
        "board": {
            "points": [{"player1": 1, "player2": 0}] + [{"player1": 0, "player2": 0} for _ in range(23)],
            "bar": {"player1": 0, "player2": 0}
        }
    }
    await client.post("/move/piece", json=move_data, headers={"Authorization": f"Bearer {token}"})
    updated_game = await get_db().matches.find_one({"player1": "testuser"})
    assert updated_game is not None
    assert updated_game["turn"] == 0
    assert updated_game["winsP2"] == 1


@pytest.mark.anyio
async def test_pass_turn(client: AsyncClient, token: str):
    await clear_matches()
    await create_started_match("testuser", "testuser2")
    await update_match({"player1": "testuser"},
                       {"$set": {"turn": 0, "dice": [3, 5], "available": [3, 5]}})

    response = await client.post("/game/pass_turn", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200

    updated_game = await get_db().matches.find_one({"player1": "testuser"})
    assert updated_game is not None
    assert updated_game["turn"] == 1
    assert updated_game["dice"] == []
    assert updated_game["available"] == []


@pytest.mark.anyio
async def test_throw_start_dice_already_thrown(client: AsyncClient, token: str):
    await clear_matches()
    await create_started_match("testuser", "testuser2")

    response = await client.get("/throw_start_dice", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200

    response = await client.get("/throw_start_dice", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 400
    assert response.json()["detail"] == "You have already thrown the start dice. Wait for the other player"


@pytest.mark.anyio
async def test_throw_start_dice_player2(client: AsyncClient, token: str):
    await clear_matches()
    await create_started_match("testuser2", "testuser")
    response = await client.get("/throw_start_dice", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    match = await get_db().matches.find_one({"player2": "testuser"})
    assert match is not None
    assert match["startDice"]["roll2"] > 0
    assert match["startDice"]["roll1"] == 0
    assert match["startDice"]["count2"] == 1
    assert match["startDice"]["count1"] == 0


@pytest.mark.anyio
async def test_throw_start_dice_ai(client: AsyncClient, token: str):
    await clear_matches()
    await create_started_match("testuser", "ai_easy")
    response = await client.get("/throw_start_dice", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    match = await get_db().matches.find_one({"player1": "testuser"})
    assert match is not None
    assert match["startDice"]["roll1"] > 0
    assert match["startDice"]["roll2"] > 0
    assert match["startDice"]["count1"] == 1
    assert match["startDice"]["count2"] == 1


@pytest.mark.anyio
async def test_request_timeout(client: AsyncClient, token: str):
    await clear_matches()
    await create_started_match("testuser", "testuser2")
    response = await client.post("/game/request_timeout", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 400

from time import sleep

@pytest.mark.anyio
async def test_update_match_last_updated(client: AsyncClient, token: str):
    await clear_matches()
    await create_started_match("testuser", "testuser2")

    # Get the initial match data
    initial_match = await get_db().matches.find_one({"player1": "testuser"})
    initial_last_updated = initial_match["last_updated"]

    sleep(1)
    # Perform an update
    await update_match({"player1": "testuser"}, {"$set": {"turn": 1}})

    # Get the updated match data
    updated_match = await get_db().matches.find_one({"player1": "testuser"})
    updated_last_updated = updated_match["last_updated"]

    # Check that the last_updated field has been updated
    assert initial_last_updated != updated_last_updated

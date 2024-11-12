import pytest
from httpx import AsyncClient
from services.game import create_started_match
from services.database import get_db
from services.game import create_started_match
from tests.conftest import clear_matches
from models.board_configuration import Match, BoardConfiguration, PointConfiguration
from services.game import check_win_condition

@pytest.mark.anyio
async def test_throw_dice(client: AsyncClient, token: str):
    await clear_matches()
    await create_started_match("testuser", "a")
    old_match = await get_db().matches.find_one({"player1": "testuser"})
    response = await client.get("/throw_dice", headers={"Authorization": f"Bearer {token}"})
    updated_match = await get_db().matches.find_one({"player1": "testuser"})
    assert updated_match != old_match
    assert updated_match["dice"] != []
    assert response.status_code == 200


@pytest.mark.anyio
async def test_move_piece(client: AsyncClient, token: str):
    await clear_matches()
    await create_started_match("testuser", "a")
    await get_db().matches.update_one({"player1": "testuser"}, {"$set": {"dice": [3, 5], "available": [3, 5]}})
    move_data = {
        "board": {
            "points": [{"player1": 1, "player2": 0} for _ in range(24)],
            "bar": {"player1": 0, "player2": 0}
        },
        "dice": 3
    }
    response = await client.post("/move_piece", json=move_data, headers={"Authorization": f"Bearer {token}"})
    updated_match = await get_db().matches.find_one({"player1": "testuser"})
    assert updated_match != old_match
    assert updated_match["dice"] != []
    assert response.status_code == 200


@pytest.mark.anyio
async def test_game(client: AsyncClient, token: str):
    await clear_matches()
    await create_started_match("testuser", "a")
    response = await client.get("/game", headers={"Authorization": f"Bearer {token}"})
    assert "dice" in response.json()
    assert response.status_code == 200


@pytest.mark.anyio
async def test_move_piece(client: AsyncClient, token: str):
    await clear_matches()
    await create_started_match("testuser", "a")
    await get_db().matches.update_one({"player1": "testuser"}, {"$set": {"dice": [3, 5], "available": [3, 5]}})
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
    assert updated_game["available"] == [5]


@pytest.mark.anyio
async def test_send_in_game_message(client: AsyncClient, token: str):
    await clear_matches()
    message_data = {
        "message": "Test message",
    }
    response = await client.post("/game/message", json=message_data, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 400

    await create_started_match("testuser", "a")
    response = await client.post("/game/message", json=message_data, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200


@pytest.mark.anyio
def test_check_win_condition_no_winner():
    board_configuration = BoardConfiguration(
        points=[PointConfiguration(player1=1, player2=1) for _ in range(24)],
        bar=PointConfiguration(player1=0, player2=0)
    )
    match = Match(
        player1="player1",
        player2="player2",
        board_configuration=board_configuration,
        dice=[],
        used=[],
        turn=0,
        status="started"
    )
    assert check_win_condition(match) == 0

@pytest.mark.anyio
def test_check_win_condition_player1_wins():
    board_configuration = BoardConfiguration(
        points=[PointConfiguration(player1=0, player2=1) for _ in range(24)],
        bar=PointConfiguration(player1=0, player2=0)
    )
    match = Match(
        player1="player1",
        player2="player2",
        board_configuration=board_configuration,
        dice=[],
        used=[],
        turn=0,
        status="started"
    )
    assert check_win_condition(match) == 1

@pytest.mark.anyio
def test_check_win_condition_player2_wins():
    board_configuration = BoardConfiguration(
        points=[PointConfiguration(player1=1, player2=0) for _ in range(24)],
        bar=PointConfiguration(player1=0, player2=0)
    )
    match = Match(
        player1="player1",
        player2="player2",
        board_configuration=board_configuration,
        dice=[],
        used=[],
        turn=0,
        status="started"
    )
    assert check_win_condition(match) == 2

@pytest.mark.anyio
def test_check_win_condition_both_players_have_pieces():
    board_configuration = BoardConfiguration(
        points=[PointConfiguration(player1=1, player2=1) for _ in range(24)],
        bar=PointConfiguration(player1=1, player2=1)
    )
    match = Match(
        player1="player1",
        player2="player2",
        board_configuration=board_configuration,
        dice=[],
        used=[],
        turn=0,
        status="started"
    )
    assert check_win_condition(match) == 0
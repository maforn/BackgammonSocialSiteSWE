import pytest
from httpx import AsyncClient
from services.database import get_db
from tests.conftest import clear_tournaments, clear_matches
from services.tournament import create_new_tournament, add_participant_to_tournament
from models.tournament import CreateTournamentRequest
from unittest.mock import AsyncMock, patch
from fastapi import HTTPException


mock_request_data = CreateTournamentRequest(
    name="test", 
    open=True, 
    participants=["testuser"], 
    rounds_to_win=2,
    type="round_robin"
)

mock_request_data_closed = CreateTournamentRequest(
    name="test", 
    open=False, 
    participants=["testuser", "testuser2", "testuser3", "newuser"], 
    rounds_to_win=2,
    type="round_robin"
)

mock_request_data_open_full = CreateTournamentRequest(
    name="test", 
    open=True, 
    participants=["testuser", "testuser2", "testuser3", "testuser4"], 
    rounds_to_win=2,
    type="round_robin"
)

mock_request_data_closed_not_invited = CreateTournamentRequest(
    name="test", 
    open=False, 
    participants=["testuser", "testuser2", "testuser3", "testuser4"], 
    rounds_to_win=2,
    type="round_robin"
)

tournaments_route = "/tournaments"

@pytest.mark.anyio
async def test_create_tournament(client: AsyncClient, token: str):
    await clear_tournaments()
    await clear_matches()

    response = await client.post(tournaments_route, json=mock_request_data.model_dump(),
                                 headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    res_data = response.json()
    assert "tournament" in res_data
    created_tournament = res_data['tournament']
    assert created_tournament['owner'] == 'testuser'
    assert created_tournament['name'] == "test"
    assert created_tournament['open'] == True
    assert created_tournament['participants'] == ['testuser']
    assert created_tournament['rounds_to_win'] == 2


@pytest.mark.anyio
async def test_get_tournament(client: AsyncClient, token: str):
    await clear_tournaments()
    response = await client.get(tournaments_route, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 404

    await create_new_tournament(mock_request_data, owner="testuser")
    response = await client.get(tournaments_route, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200

    res_data = response.json()
    assert res_data['owner'] == 'testuser'
    assert res_data['name'] == "test"
    assert res_data['open'] == True
    assert res_data['participants'] == ['testuser']
    assert res_data['rounds_to_win'] == 2


@pytest.mark.anyio
async def test_tournament_exists(client: AsyncClient, token: str):
    await clear_tournaments()
    response = await client.get(tournaments_route + "/exists", headers={"Authorization": f"Bearer {token}"})
    assert response.json() == False

    await create_new_tournament(mock_request_data, owner="testuser")
    response = await client.get(tournaments_route + "/exists", headers={"Authorization": f"Bearer {token}"})
    assert response.json() == True


@pytest.mark.anyio
async def test_add_participant_to_open_tournament():
    await clear_tournaments()
    await create_new_tournament(mock_request_data, owner="testuser")

    tournament = await get_db().tournaments.find_one({"owner": "testuser"})

    await add_participant_to_tournament(tournament["_id"], "newuser")

    updated_tournament = await get_db().tournaments.find_one({"owner": "testuser"})

    assert updated_tournament["participants"] == ["testuser", "newuser"]

@pytest.mark.anyio
async def test_add_participant_to_closed_tournament():
    await clear_tournaments()
    await create_new_tournament(mock_request_data_closed, owner="testuser")

    tournament = await get_db().tournaments.find_one({"owner": "testuser"})

    await add_participant_to_tournament(tournament["_id"], "newuser")

    updated_tournament = await get_db().tournaments.find_one({"owner": "testuser"})

    assert updated_tournament["confirmed_participants"] == ["testuser", "newuser"]
    

@pytest.mark.anyio
async def test_add_participant_to_nonexistent_tournament():
    await clear_tournaments()

    with pytest.raises(HTTPException) as exc_info:
        await add_participant_to_tournament("123", "newuser")
    assert exc_info.value.status_code == 404

@pytest.mark.anyio
async def test_add_participant_to_full_open_tournament():
    await clear_tournaments()
    await create_new_tournament(mock_request_data_open_full, owner="testuser")

    tournament = await get_db().tournaments.find_one({"owner": "testuser"})

    with pytest.raises(HTTPException) as exc_info:
        await add_participant_to_tournament(tournament["_id"], "newuser")
    assert exc_info.value.status_code == 400

@pytest.mark.anyio
async def test_add_participant_to_closed_tournament_not_invited():
    await clear_tournaments()
    await create_new_tournament(mock_request_data_closed_not_invited, owner="testuser")

    tournament = await get_db().tournaments.find_one({"owner": "testuser"})

    with pytest.raises(HTTPException) as exc_info:
        await add_participant_to_tournament(tournament["_id"], "newuser")
    assert exc_info.value.status_code == 400
    await clear_tournaments()


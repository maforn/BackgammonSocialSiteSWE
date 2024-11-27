import pytest
from httpx import AsyncClient
from services.database import get_db
from tests.conftest import clear_tournaments, clear_matches
from services.tournament import create_new_tournament
from models.tournament import CreateTournamentRequest


mock_request_data = CreateTournamentRequest(
    name="test", 
    open=True, 
    participants=["testuser"], 
    rounds_to_win=2)


@pytest.mark.anyio
async def test_create_tournament(client: AsyncClient, token: str):
    await clear_tournaments()
    await clear_matches()

    response = await client.post("/tournaments", json=mock_request_data.model_dump(),
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
    response = await client.get("/tournaments", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 404

    await create_new_tournament(mock_request_data, owner="testuser")
    response = await client.get("/tournaments", headers={"Authorization": f"Bearer {token}"})
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
    response = await client.get("/tournaments/exists", headers={"Authorization": f"Bearer {token}"})
    assert response.json() == False

    await create_new_tournament(mock_request_data, owner="testuser")
    response = await client.get("/tournaments/exists", headers={"Authorization": f"Bearer {token}"})
    assert response.json() == True
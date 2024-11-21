import random

from models.board_configuration import Match, BoardConfiguration
from services.database import get_db


def throw_dice():
    die1 = random.randint(1, 6)
    die2 = random.randint(1, 6)
    return die1, die2


async def get_current_game(username: str) -> Match:
    match_data = await get_db().matches.find_one({
        "$or": [{"player1": username}, {"player2": username}],
        "status": "started"
    })
    if match_data:
        return Match(**match_data)
    return None


async def create_started_match(player1: str, player2: str, rounds_to_win: int=1):
    new_match = Match(player1=player1, player2=player2, status="started", rounds_to_win=rounds_to_win)
    match_data = new_match.dict(by_alias=True)
    await get_db().matches.insert_one(match_data)


def check_win_condition(match :Match):
    player1_counter = match.board_configuration["bar"]["player1"]
    player2_counter = match.board_configuration["bar"]["player2"]

    for point in match.board_configuration["points"]:
        player1_counter += point["player1"]
        player2_counter += point["player2"]
        if player1_counter > 0 and player2_counter > 0:
            return {"winner": 0}

    return {"winner": 1} if player1_counter == 0 else {"winner": 2}

async def check_winner(current_game: Match, manager):
    winner = check_win_condition(current_game)
    winner = winner.get("winner")

    #Check if someone won the current round
    if winner != 0:

        if(winner == 1):
            #Player 1 won the current round
            current_game.winsP1 += 1
        else:
            #Player 2 won the current round
            current_game.winsP2 += 1
            
        #Check if someone won the entire match (won rounds_to_win rounds)
        if(current_game.winsP1 == current_game.rounds_to_win or current_game.winsP2 == current_game.rounds_to_win):
            current_game.status = "player_" + str(winner) + "_won" 

            #TODO: logic for match end (US #103)

            #Message for match end, US #103
            websocket_player1 = await manager.get_user(current_game.player1)
            if websocket_player1:
                await manager.send_personal_message({"type": "match_over", "winner": winner}, websocket_player1)
            websocket_player2 = await manager.get_user(current_game.player2)
            if websocket_player2:
                await manager.send_personal_message({"type": "match_over", "winner": winner}, websocket_player2)

        
        else:
            #Must proceed to next round
            #Reset the board configuration, turn, dice and available
            current_game.board_configuration = BoardConfiguration().dict(by_alias=True)
            current_game.available = []
            current_game.dice = []
            current_game.turn = 0

            #Message for round end
            websocket_player1 = await manager.get_user(current_game.player1)
            if websocket_player1:
                await manager.send_personal_message({"type": "round_over", "winner": winner}, websocket_player1)
            websocket_player2 = await manager.get_user(current_game.player2)
            if websocket_player2:
                await manager.send_personal_message({"type": "round_over", "winner": winner}, websocket_player2)
        
        await get_db().matches.update_one({"_id": current_game.id},
                                          {"$set": {"board_configuration": current_game.board_configuration,
                                                    "status": current_game.status,
                                                    "available": current_game.available,
                                                    "dice": current_game.dice,
                                                    "turn": current_game.turn,
                                                    "winsP1": current_game.winsP1,
                                                    "winsP2": current_game.winsP2}}) 

        
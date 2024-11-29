import random

from models.board_configuration import Match, BoardConfiguration, StartDice, DoublingCube
from services.ai import ai_names, ai_rating
from services.database import get_db
from services.rating import new_ratings_after_match


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


async def create_started_match(player1: str, player2: str, rounds_to_win: int = 1):
    new_match = Match(player1=player1, player2=player2, status="started", rounds_to_win=rounds_to_win)
    match_data = new_match.dict(by_alias=True)
    await get_db().matches.insert_one(match_data)


def check_win_condition(match: Match):
    player1_counter = match.board_configuration["bar"]["player1"]
    player2_counter = match.board_configuration["bar"]["player2"]

    for point in match.board_configuration["points"]:
        player1_counter += point["player1"]
        player2_counter += point["player2"]
        if player1_counter > 0 and player2_counter > 0:
            return {"winner": 0}

    return {"winner": 1} if player1_counter == 0 else {"winner": 2}


async def check_winner(current_game: Match, manager, winner = None):
    if winner is None:
        winner = check_win_condition(current_game)
        winner = winner.get("winner")

    p1_data = await get_db().users.find_one({
        "username": current_game.player1
    })
    p2_data = await get_db().users.find_one({
        "username": current_game.player2
    })
    p2_data = p2_data or {}
    if current_game.player2 in ai_names:
        p2_data["username"] = current_game.player2
        p2_data["rating"] = ai_rating[ai_names.index(current_game.player2)]

    # Check if someone won the current round
    if winner != 0:
        loser_username, old_loser_rating, old_winner_rating, winner_username = await update_rating(current_game,
                                                                                                   p1_data, p2_data,
                                                                                                   winner)

        # Check if someone won the entire match (won rounds_to_win rounds)
        if current_game.winsP1 == current_game.rounds_to_win or current_game.winsP2 == current_game.rounds_to_win:
            current_game.doublingCube.proposed = False
            current_game.doublingCube.proposer = 0
            await update_on_match_win(current_game, loser_username, manager, old_loser_rating, old_winner_rating,
                                      winner, winner_username)


        else:
            # Must proceed to next round
            # Reset the board configuration, turn, dice and available
            current_game.board_configuration = BoardConfiguration()
            current_game.available = []
            current_game.dice = []
            current_game.turn = -1
            current_game.starter = 0
            current_game.startDice = StartDice()
            current_game.doublingCube = DoublingCube()

            # Message for round end
            websocket_player1 = await manager.get_user(current_game.player1)
            if websocket_player1:
                await manager.send_personal_message({"type": "round_over", "winner": winner_username},
                                                    websocket_player1)
            websocket_player2 = await manager.get_user(current_game.player2)
            if websocket_player2:
                await manager.send_personal_message({"type": "round_over", "winner": winner_username},
                                                    websocket_player2)
                
        print('before save', current_game) 

        await get_db().matches.update_one({"_id": current_game.id},
                                          {"$set": {"board_configuration": current_game.board_configuration.model_dump(by_alias=True),
                                                    "status": current_game.status,
                                                    "available": current_game.available,
                                                    "dice": current_game.dice,
                                                    "turn": current_game.turn,
                                                    "startDice": current_game.startDice.model_dump(by_alias=True),
                                                    "doublingCube": current_game.doublingCube.model_dump(by_alias=True),
                                                    "winsP1": current_game.winsP1,
                                                    "winsP2": current_game.winsP2}})


async def update_rating(current_game, p1_data, p2_data, winner):

    if isinstance(current_game.doublingCube, DoublingCube):
        doubling_value = 2**current_game.doublingCube.count
    else:
        doubling_value = 2**int(current_game.doublingCube['count'])

    if winner == 1:
        # Player 1 won the current round
        current_game.winsP1 += 1 * doubling_value
        winner_username = p1_data["username"]
        loser_username = p2_data["username"]
        old_winner_rating = p1_data["rating"]
        old_loser_rating = p2_data["rating"]
    else:
        # Player 2 won the current round
        current_game.winsP2 += 1 * doubling_value
        winner_username = p2_data["username"]
        loser_username = p1_data["username"]
        old_winner_rating = p2_data["rating"]
        old_loser_rating = p1_data["rating"]
    return loser_username, old_loser_rating, old_winner_rating, winner_username


async def update_on_match_win(current_game, loser_username, manager, old_loser_rating, old_winner_rating, winner,
                              winner_username):
    current_game.status = "player_" + str(winner) + "_won"
    # Logic for player ratings update and match end
    (new_winner_rating, new_loser_rating) = new_ratings_after_match(old_winner_rating, old_loser_rating)
    await get_db().users.update_one({"username": winner_username},
                                    {"$set": {"rating": new_winner_rating}})
    await get_db().users.update_one({"username": loser_username},
                                    {"$set": {"rating": new_loser_rating}})
    # Message for match end, US #103
    websocket_player1 = await manager.get_user(current_game.player1)
    if websocket_player1:
        await manager.send_personal_message(
            {"type": "match_over", "winner": winner_username, "loser": loser_username,
             "old_winner_rating": old_winner_rating, "new_winner_rating": new_winner_rating,
             "old_loser_rating": old_loser_rating, "new_loser_rating": new_loser_rating},
            websocket_player1)
    websocket_player2 = await manager.get_user(current_game.player2)
    if websocket_player2:
        await manager.send_personal_message(
            {"type": "match_over", "winner": winner_username, "loser": loser_username,
             "old_winner_rating": old_winner_rating, "new_winner_rating": new_winner_rating,
             "old_loser_rating": old_loser_rating, "new_loser_rating": new_loser_rating}, websocket_player2)

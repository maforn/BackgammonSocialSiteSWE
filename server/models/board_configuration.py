from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
from typing import List

from pydantic import BaseModel, Field
from services.database import default_id


class Point(BaseModel):
    player1: int
    player2: int

    def __init__(self, player1: int = 0, player2: int = 0):
        super().__init__(player1=player1, player2=player2)


# Starting configuration of the board
DEFAULT_POINTS: List[Point] = [
    Point(0, 2),  # Point 1
    Point(0, 0),  # Point 2
    Point(0, 0),  # Point 3
    Point(0, 0),  # Point 4
    Point(0, 0),  # Point 5
    Point(5, 0),  # Point 6
    Point(0, 0),  # Point 7
    Point(3, 0),  # Point 8
    Point(0, 0),  # Point 9
    Point(0, 0),  # Point 10
    Point(0, 0),  # Point 11
    Point(0, 5),  # Point 12
    Point(5, 0),  # Point 13
    Point(0, 0),  # Point 14
    Point(0, 0),  # Point 15
    Point(0, 0),  # Point 16
    Point(0, 3),  # Point 17
    Point(0, 0),  # Point 18
    Point(0, 5),  # Point 19
    Point(0, 0),  # Point 20
    Point(0, 0),  # Point 21
    Point(0, 0),  # Point 22
    Point(0, 0),  # Point 23
    Point(2, 0)  # Point 24
]


class BoardConfiguration(BaseModel):
    points: List[Point] = DEFAULT_POINTS
    bar: Point = Point(player1=0, player2=0)

    def __init__(self, points: List[Point] = DEFAULT_POINTS, bar: Point = Point(player1=0, player2=0)):
        super().__init__(points=points, bar=bar)


class Match(BaseModel):
    id: str = Field(default_factory=default_id, alias="_id")
    player1: str
    player2: str
    board_configuration: BoardConfiguration = BoardConfiguration()
    dice: List[int] = []
    available: List[int] = []
    turn: int = 0
    status: str = "pending"
    rounds_to_win: int
    winsP1: int = 0
    winsP2: int = 0


class CreateInviteRequest(BaseModel):
    opponent_username: str
    rounds_to_win: int


class AcceptInviteRequest(BaseModel):
    invite_id: str

from src.models.game import Game
from src.models.engine import Engine

game = Game()
engine = Engine()


def reset_game_and_engine():
    global game, engine
    game, engine = Game(), Engine()

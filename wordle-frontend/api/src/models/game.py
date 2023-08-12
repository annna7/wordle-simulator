import src.helper as helper
from src.constants import INVALID_GUESS, LENGTH


class Game:
    def __init__(self):
        self.possible_words = helper.get_possible_words()
        self.target_word = helper.get_random_word()
        self.length = LENGTH

    def get_feedback(self, word):
        if not helper.is_valid_word(word):
            return INVALID_GUESS
        return helper.get_feedback(self.target_word, word)

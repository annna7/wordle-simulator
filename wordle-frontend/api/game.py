import helper

INVALID_GUESS = -1


class Game:
    def __init__(self):
        self.possible_words = helper.get_possible_words()
        self.target_word = helper.get_random_word()
        self.length = 5

    def is_valid_word(self, word):
        return word.lower() in helper.get_total_words()

    def get_feedback(self, word):
        if not self.is_valid_word(word):
            return INVALID_GUESS
        return helper.get_feedback(self.target_word, word)

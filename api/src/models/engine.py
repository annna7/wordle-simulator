import math
import src.helper as helper
from src.constants import LENGTH, STARTER_WORD, BUCKETS_COUNT


class Engine:
    def __init__(self):
        self.possible_words = helper.get_possible_words()
        self.length = LENGTH
        self.buckets_count = BUCKETS_COUNT
        self.starter_word = STARTER_WORD

    def compute_entropy(self, word):
        buckets = [0] * self.buckets_count
        for secret_candidate in self.possible_words:
            feedback = helper.feedback_to_number(helper.get_feedback(secret_candidate, word))
            buckets[feedback] += 1
        entropy = 0
        for bucket in buckets:
            if bucket == 0:
                continue
            probability = bucket / len(self.possible_words)
            entropy += probability * math.log2(probability)
        return -entropy
    
    def restrict_possible_words(self, best_word, feedback):
        self.possible_words = [word for word in self.possible_words if helper.get_feedback(word, best_word) == feedback]

    def get_best_word(self):
        if len(self.possible_words) >= 900:
            return self.starter_word
        if len(self.possible_words) == 1:
            return self.possible_words[0]
        if len(self.possible_words) == 0:
            return ''
        best_word = ''
        best_entropy = 0
        for word in self.possible_words:
            entropy = self.compute_entropy(word)
            if entropy > best_entropy:
                best_entropy = entropy
                best_word = word
        return best_word
    

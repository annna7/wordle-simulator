import os
from random import randint
from .constants import LENGTH, GRAY, YELLOW, GREEN, STATES


root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

common_words_path = os.path.join(root_dir, 'common_words.txt')

all_words_path = os.path.join(root_dir, 'words.txt')


def get_possible_words():
    return [word for word in open(common_words_path).read().split("\n")]


def get_total_words():
    return get_possible_words() + [word for word in open(all_words_path).read().split("\n")]


def get_random_word():
    possible_words = get_possible_words()
    return possible_words[randint(0, len(possible_words) - 1)]


def is_valid_word(word):
    return word.lower() in get_total_words()


def get_feedback(secret, guess):
    if guess.lower() == secret:
        return [GREEN] * LENGTH

    feedback = [GRAY] * LENGTH

    for i in range(LENGTH):
        if guess[i] == secret[i]:
            feedback[i] = GREEN

    for i in range(LENGTH):
        if feedback[i] != GREEN and guess[i] in secret:
            feedback[i] = YELLOW

    return feedback


def feedback_to_number(feedback):
    return sum([feedback[i] * STATES ** i for i in range(LENGTH)])

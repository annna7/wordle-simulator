from random import randint

GRAY = 0
YELLOW = 1
GREEN = 2
INVALID_GUESS = -1

LENGTH = 5

def get_possible_words():
    return [word for word in open("common_words.txt").read().split("\n")]

def get_total_words():
    return get_possible_words() + [word for word in open("words.txt").read().split("\n")]

def get_random_word():
    possible_words = get_possible_words()
    return possible_words[randint(0, len(possible_words) - 1)]

def get_feedback(secret, guess):
    if guess.lower() == secret:
        return [GREEN] * LENGTH
    feedback = [GRAY] * LENGTH
    for i in range(LENGTH):
        try:
            if guess[i] == secret[i]:
                feedback[i] = GREEN
        except:
            print(guess, secret)
    for i in range(LENGTH):
        if feedback[i] == GREEN:
            continue
        if guess[i] in secret:
            feedback[i] = YELLOW
    return feedback

def feedback_to_number(feedback):
    return sum([feedback[i] * 3 ** i for i in range(LENGTH)])
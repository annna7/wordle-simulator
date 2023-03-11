from game import Game 
from engine import Engine
import helper 

average_guesses = 0
with open("results.txt", "w") as f:
    for word in helper.get_possible_words():
        engine = Engine()
        game = Game()
        guesses = 0
        game.target_word = word
        while True:
            new_guess = engine.getBestWord()
            guesses += 1
            feedback = game.get_feedback(new_guess)
            print(new_guess, feedback, file=f)
            if new_guess == game.target_word or feedback == [2, 2, 2, 2, 2]:
                print(word, " ", guesses, file=f)
                average_guesses += guesses
                break
            engine.restrict_possible_words(new_guess, game.get_feedback(new_guess))
    print()
print(average_guesses / len(helper.get_possible_words()))


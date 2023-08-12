from flask import jsonify
from src.models.game import Game
from src.models.engine import Engine
from src.routes import main_bp


@main_bp.route('/simulate')
def simulate_game():
    return jsonify({"target_word": 'hello'})
    average_guesses = 0
    results = []
    for word in helper.get_possible_words():
        engine = Engine()
        game = Game()
        guesses = 0
        game.target_word = word
        while True:
            new_guess = engine.get_best_word()
            guesses += 1
            feedback = game.get_feedback(new_guess)
            results.append((new_guess, feedback))
            if new_guess == game.target_word or feedback == [GREEN] * LENGTH:
                results.append((word, guesses))
                average_guesses += guesses
                break
            engine.restrict_possible_words(new_guess, game.get_feedback(new_guess))
    return {'average_guesses': average_guesses / len(helper.get_possible_words()), 'results': results}

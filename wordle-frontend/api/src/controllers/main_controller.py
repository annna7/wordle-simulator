from src.models.game import Game
from src.models.engine import Engine
from flask import Blueprint, jsonify, request
from src.routes import main_bp
from src import helper
from src.constants import GREEN, LENGTH


game = Game()
engine = Engine()


@main_bp.route('/')
def index():
    return 'Welcome to Wordle!'


@main_bp.route('/optimal_guess', methods=['GET'])
def get_optimal_guess():
    global engine
    guess = engine.get_best_word()
    feedback = game.get_feedback(guess)
    engine.restrict_possible_words(guess, feedback)
    return jsonify({'optimal_guess': guess, 'feedback': feedback})


@main_bp.route('/reset_engine')
def reset_engine():
    global game
    global engine
    game = Game()
    engine = Engine()
    return jsonify({"target_word": game.target_word})


@main_bp.route('/simulate')
def simulate_game():
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

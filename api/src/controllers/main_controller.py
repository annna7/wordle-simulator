from src.models.game import Game
from src.models.engine import Engine
from flask import Blueprint, jsonify, request
from src.routes import main_bp


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



from flask import jsonify
from src.routes import main_bp
import src.menu as menu


@main_bp.route('/')
def index():
    return 'Welcome to Wordle!'


@main_bp.route('/optimal_guess', methods=['GET'])
def get_optimal_guess():
    guess = menu.engine.get_best_word()
    feedback = menu.game.get_feedback(guess)
    menu.engine.restrict_possible_words(guess, feedback)
    return jsonify({'optimal_guess': guess, 'feedback': feedback})


@main_bp.route('/reset_engine')
def reset_engine():
    menu.reset_game_and_engine()
    return jsonify({"target_word": menu.game.target_word})



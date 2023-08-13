from flask import jsonify, request
from src.routes import game_bp
from src.models.game import Game
from src.helper import is_valid_word

game = Game()


@game_bp.route('/valid_word', methods=['POST'])
def is_valid_word():
    global game
    word = request.get_json()['word']
    is_valid = is_valid_word(word)
    if is_valid:
        feedback = game.get_feedback(word)
    else:
        feedback = []
    return jsonify({'valid_word': is_valid, 'feedback': feedback})


@game_bp.route('/target', methods=['GET'])
def get_target():
    global game
    return jsonify({'target_word': game.target_word})

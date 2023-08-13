from flask import jsonify, request
from src.helper import is_valid_word
from src.routes import game_bp
import src.menu as menu


@game_bp.route('/valid_word', methods=['POST'])
def validate_word():
    word = request.get_json()['word']
    feedback = menu.game.get_feedback(word) if is_valid_word(word) else []
    return jsonify({'valid_word': is_valid_word(word), 'feedback': feedback})


@game_bp.route('/target', methods=['GET'])
def get_target():
    return jsonify({'target_word': menu.game.target_word})

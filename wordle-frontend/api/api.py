from flask import Flask, jsonify,request
from game import Game
from engine import Engine
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

game = Game()
engine = Engine()

@app.route('/get_optimal_guess', methods=['GET'])
@cross_origin()
def get_optimal_guess():
    global engine
    guess = engine.getBestWord()
    feedback = game.get_feedback(guess)
    engine.restrict_possible_words(guess, feedback)
    return jsonify({'optimal_guess': guess, 'feedback': feedback})

@app.route('/valid_word', methods=['POST'])
@cross_origin()
def is_valid_word():
    global game
    word = request.get_json()['word']
    is_valid = game.is_valid_word(word)
    if is_valid:
        feedback = game.get_feedback(word)
    else:
        feedback = []
    response = jsonify({'valid_word': is_valid, 'feedback': feedback})
    return response


@app.route('/get_target', methods=['GET'])
@cross_origin()
def get_target():
    global game
    print(game.target_word)
    return jsonify({'target_word': game.target_word})

@app.route('/reset_engine')
@cross_origin()
def reset_engine():
    global game
    global engine
    game = Game()
    engine = Engine()
    return jsonify({"target_word": game.target_word})

from flask import Flask
from src.routes import main_bp, game_bp, simulation_bp
from flask_cors import CORS


app = Flask(__name__)
CORS(app)


app.register_blueprint(main_bp)
app.register_blueprint(game_bp, url_prefix='/game')
app.register_blueprint(simulation_bp, url_prefix='/simulate')
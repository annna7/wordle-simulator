from flask import Flask
from src.routes import main_bp, game_bp, simulation_bp

app = Flask(__name__)

app.register_blueprint(main_bp)
app.register_blueprint(game_bp, url_prefix='/game')
app.register_blueprint(simulation_bp, url_prefix='/simulate')
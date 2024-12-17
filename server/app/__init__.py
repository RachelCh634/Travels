from flask import Flask
from flask_cors import CORS
from app.auth.routes import auth_bp
from app.config import SECRET_KEY
from app.travels.routes import travels_bp


def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config['SECRET_KEY'] = SECRET_KEY
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(travels_bp, url_prefix='/travels')
    return app

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager
from flask_bcrypt import Bcrypt
import os

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

app.secret_key = 'dd3344f'

db = SQLAlchemy(app)
migrate = Migrate(app, db)
bcrypt = Bcrypt(app)

login_manager = LoginManager()
login_manager.init_app(app)

from app import models, views

@login_manager.user_loader
def load_ser(userid):
    return models.User.query.filter(models.User.id==userid).first()

from app.auth.auth import auth_bp
from app.general.general import general_bp
from app.endpoint.endpoint import endpoint_bp

app.register_blueprint(auth_bp)
app.register_blueprint(general_bp)
app.register_blueprint(endpoint_bp)

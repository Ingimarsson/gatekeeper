from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

from app.auth.auth import auth_bp
from app.general.general import general_bp
from app.endpoint.endpoint import endpoint_bp

import os

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)

from app import models

app.register_blueprint(auth_bp)
app.register_blueprint(general_bp)
app.register_blueprint(endpoint_bp)

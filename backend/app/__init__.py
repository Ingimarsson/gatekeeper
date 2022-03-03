from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_apscheduler import APScheduler

db = SQLAlchemy()
migrate = Migrate()
bcrypt = Bcrypt()
jwt = JWTManager()
scheduler = APScheduler()

from . import models
from . import jobs

def init_app():
    app = Flask(__name__, instance_relative_config=False)
    app.config.from_object('app.config.Config')

    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    jwt.init_app(app)

    scheduler.init_app(app)
    scheduler.start()

    with app.app_context():
        from . import routes

        # Register Blueprints
        app.register_blueprint(routes.alert_bp)
        app.register_blueprint(routes.auth_bp)
        app.register_blueprint(routes.endpoint_bp)
        app.register_blueprint(routes.gate_bp)
        app.register_blueprint(routes.log_bp)
        app.register_blueprint(routes.system_bp)
        app.register_blueprint(routes.user_bp)

        return app

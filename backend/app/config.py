from datetime import timedelta

class Config:
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:////tmp/test.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = 'debug_secret'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=1)

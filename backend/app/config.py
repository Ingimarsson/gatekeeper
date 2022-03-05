from datetime import timedelta

class Config:
  DEBUG = True
  SQLALCHEMY_DATABASE_URI = 'sqlite:////tmp/test.db'
  SQLALCHEMY_TRACK_MODIFICATIONS = False
  JWT_SECRET_KEY = 'debug_secret'
  JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=1)
  STREAM_HOST = 'http://localhost:8001/'
  SMTP_EMAIL = ''
  SMTP_USER = ''
  SMTP_PASSWORD = ''
  SMTP_HOST = ''
  SMTP_POT = 0
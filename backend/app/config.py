from datetime import timedelta
import os

class Config:
  DEBUG = bool(os.getenv('DEBUG', False))
  SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URI', '')
  SQLALCHEMY_TRACK_MODIFICATIONS = False
  JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'debug_secret')
  JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES', 30)))
  STREAM_HOST = os.getenv('STREAM_HOST', '')
  SMTP_EMAIL = os.getenv('SMTP_EMAIL', '')
  SMTP_USER = os.getenv('SMTP_USER', '')
  SMTP_PASSWORD = os.getenv('SMTP_PASSWORD', '')
  SMTP_HOST = os.getenv('SMTP_HOST', '')
  SMTP_PORT = int(os.getenv('SMTP_PORT', 465))
  SNAPSHOT_KEEP_COUNT = int(os.getenv('SNAPSHOT_KEEP_COUNT', 40000))

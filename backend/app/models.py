from sqlalchemy import Column, ForeignKey, Integer, String, Boolean, DateTime

from app import db

from datetime import datetime

class User(db.Model):
    __tablename__ = 'user'
    id = Column(Integer, primary_key=True)
    username = Column(String(64), nullable=False)
    full_name = Column(String(128), nullable=False)
    password = Column(String(128), nullable=False)
    is_admin = Column(Boolean, default=False, nullable=False)


class Gate(db.Model):
    __tablename__ = 'gate'
    id = Column(Integer, primary_key=True)
    name = Column(String(64), nullable=False)
    uri_open = Column(String(256))
    uri_close = Column(String(256))
    uri_rtsp = Column(String(256))


class Endpoint(db.Model):
    __tablename__ = 'endpoint'
    id = Column(Integer, primary_key=True)
    name = Column(String(64), nullable=False)
    token = Column(String(64), nullable=False)
    type = Column(String(16), nullable=False)
    gate = Column(Integer, ForeignKey('gate.id'))

class Access(db.Model):
    __tablename__ = 'access'
    id = Column(Integer, primary_key=True)
    name = Column(String(64), nullable=False)
    code = Column(String(64), nullable=False)
    valid_from = Column(DateTime(timezone=True))
    valid_to = Column(DateTime(timezone=True))
    endpoint = Column(Integer, ForeignKey('endpoint.id'))


class Activity(db.Model):
    __tablename__ = 'activity'
    id = Column(Integer, primary_key=True)
    endpoint = Column(Integer, ForeignKey('endpoint.id'))
    access = Column(Integer, ForeignKey('access.id'))
    timestamp = Column(DateTime(timezone=True), default=datetime.now, nullable=False)
    success = Column(Boolean, default=False, nullable=False)
    snapshot = Column(String(64))


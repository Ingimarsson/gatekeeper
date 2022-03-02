from sqlalchemy import Column, ForeignKey, Integer, String, Boolean, DateTime, JSON

from app import db, bcrypt

from datetime import datetime

class User(db.Model):
    __tablename__ = 'user'

    id = Column(Integer, primary_key=True)
    name = Column(String(128), nullable=False)
    username = Column(String(64), nullable=False)
    email = Column(String(64))
    password = Column(String(128), nullable=False)
    token = Column(String(256))
    is_admin = Column(Boolean, default=False, nullable=False)
    is_enabled = Column(Boolean, default=True, nullable=False)
    has_web_access = Column(Boolean, default=True, nullable=False)

    def set_password(self, plaintext):
        self.password = bcrypt.generate_password_hash(plaintext).decode('utf-8')

    def verify_password(self, plaintext):
        return bcrypt.check_password_hash(self.password, plaintext)


class Gate(db.Model):
    __tablename__ = 'gate'

    id = Column(Integer, primary_key=True)
    name = Column(String(64), nullable=False)
    type = Column(String(64), nullable=False)
    controller_ip = Column(String(64))
    uri_open = Column(String(256))
    uri_close = Column(String(256))
    camera_uri = Column(String(256))
    http_trigger = Column(String(256))
    token = Column(String(64), nullable=False)
    settings = Column(JSON)


class Method(db.Model):
    __tablename__ = 'method'

    id = Column(Integer, primary_key=True)
    type = Column(String(16), nullable=False)
    code = Column(String(64))
    user = Column(Integer, ForeignKey('user.id'))
    gate = Column(Integer, ForeignKey('gate.id'))
    comment = Column(String(256), nullable=False)
    start_date = Column(DateTime(timezone=True))
    end_date = Column(DateTime(timezone=True))
    start_hour = Column(String(16), nullable=False)
    end_hour = Column(String(16), nullable=False)
    data = Column(JSON)
    is_enabled = Column(Boolean, default=True, nullable=False)


class Log(db.Model):
    __tablename__ = 'log'

    id = Column(Integer, primary_key=True)
    timestamp = Column(DateTime(timezone=True), default=datetime.now, nullable=False)
    gate = Column(Integer, ForeignKey('gate.id'))
    type = Column(String(16), nullable=False)
    method = Column(Integer, ForeignKey('method.id'))
    code = Column(String(64), nullable=False)
    operation = Column(String(16), nullable=False)
    image = Column(String(64))
    first_image = Column(String(64))
    last_image = Column(String(64))
    result = Column(Boolean, default=True, nullable=False)


class Alert(db.Model):
    __tablename__ = 'alert'

    id = Column(Integer, primary_key=True)
    owner = Column(Integer, ForeignKey('user.id'))
    gate = Column(Integer, ForeignKey('gate.id'))
    user = Column(Integer, ForeignKey('user.id'))
    type = Column(String(16))
    code = Column(String(64))
    time_limits = Column(Boolean, default=True, nullable=False)
    start_hour = Column(String(16))
    end_hour = Column(String(16))
    failed_attempts = Column(Boolean, default=False, nullable=False)
    is_enabled = Column(Boolean, default=True, nullable=False)


class CameraStatus(db.Model):
    __tablename__ = 'camera_status'

    id = Column(Integer, primary_key=True)
    timestamp = Column(DateTime(timezone=True), default=datetime.now, nullable=False)
    gate = Column(Integer, ForeignKey('gate.id'))
    uptime = Column(Integer)
    pid = Column(Integer)
    cpu_usage = Column(Integer)
    memory_usage = Column(Integer)
    disk_usage = Column(Integer)
    snapshot_count = Column(Integer)
    is_alive = Column(Boolean, default=True, nullable=False)


class ControllerStatus(db.Model):
    __tablename__ = 'controller_status'

    id = Column(Integer, primary_key=True)
    timestamp = Column(DateTime(timezone=True), default=datetime.now, nullable=False)
    gate = Column(Integer, ForeignKey('gate.id'))
    uptime = Column(Integer)
    type = Column(String(16))
    ip_address = Column(String(64))
    is_alive = Column(Boolean, default=True, nullable=False)

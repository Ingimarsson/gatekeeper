from sqlalchemy import Column, ForeignKey, Integer, String, Boolean, DateTime, JSON, BigInteger

from app import db, bcrypt
from app.utils import is_within_hours

from datetime import datetime

class User(db.Model):
    __tablename__ = 'user'

    id = Column(Integer, primary_key=True)
    name = Column(String(128), nullable=False)
    username = Column(String(64), nullable=False)
    email = Column(String(64))
    password = Column(String(128), nullable=False)
    token = Column(String(256))
    language = Column(String(64), default='en', nullable=False)
    is_admin = Column(Boolean, default=False, nullable=False)
    is_enabled = Column(Boolean, default=True, nullable=False)
    has_web_access = Column(Boolean, default=True, nullable=False)
    is_deleted = Column(Boolean, default=False, nullable=False)

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
    camera_general = Column(Integer, ForeignKey('camera.id'))
    camera_alpr = Column(Integer, ForeignKey('camera.id'))
    http_trigger = Column(String(256))
    token = Column(String(64), nullable=False)
    button_type = Column(String(16), nullable=False, default='disabled')
    button_start_hour = Column(String(16), nullable=False, default='08:00')
    button_end_hour = Column(String(16), nullable=False, default='20:00')
    settings = Column(JSON)
    is_deleted = Column(Boolean, default=False, nullable=False)


class Camera(db.Model):
    __tablename__ = 'camera'

    id = Column(Integer, primary_key=True)
    name = Column(String(64), nullable=False)
    camera_uri = Column(String(256))
    is_visible = Column(Boolean, default=False, nullable=False)


class Config(db.Model):
    __tablename__ = 'config'

    id = Column(Integer, primary_key=True)
    key = Column(String(64), nullable=False)
    value = Column(String(256), nullable=False)


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
    start_hour = Column(String(16))
    end_hour = Column(String(16))
    data = Column(JSON)
    is_enabled = Column(Boolean, default=True, nullable=False)
    is_deleted = Column(Boolean, default=False, nullable=False)

    def check_dates(self):
      if self.start_date and datetime.now(tz=self.start_date.tzinfo) < self.start_date:
        return False

      if self.end_date and datetime.now(tz=self.end_date.tzinfo) > self.end_date:
        return False

      if self.start_hour and self.end_hour:
        return is_within_hours(self.start_hour, self.end_hour)

      return True

class Log(db.Model):
    __tablename__ = 'log'

    id = Column(Integer, primary_key=True)
    timestamp = Column(DateTime(timezone=True), default=datetime.now, nullable=False)
    user = Column(Integer, ForeignKey('user.id'))
    gate = Column(Integer, ForeignKey('gate.id'))
    type = Column(String(16), nullable=False)
    type_label = Column(String(64))
    method = Column(Integer, ForeignKey('method.id'))
    code = Column(String(64), default='', nullable=False)
    operation = Column(String(16), nullable=False)
    image = Column(String(64))
    first_image = Column(String(64))
    last_image = Column(String(64))
    result = Column(Boolean, default=False, nullable=False)
    reason = Column(String(64)) # Allowed values: success, not_exist, expired, disabled, wrong_dir
    is_deleted = Column(Boolean, default=False, nullable=False)


class Alert(db.Model):
    __tablename__ = 'alert'

    id = Column(Integer, primary_key=True)
    name = Column(String(64))
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
    is_deleted = Column(Boolean, default=False, nullable=False)

class AlertEvent(db.Model):
    __tablename__ = 'alert_event'

    id = Column(Integer, primary_key=True)
    alert = Column(Integer, ForeignKey('alert.id'))
    log = Column(Integer, ForeignKey('log.id'))
    email_sent = Column(Boolean, default=False)


class CameraStatus(db.Model):
    __tablename__ = 'camera_status'

    id = Column(Integer, primary_key=True)
    timestamp = Column(DateTime(timezone=True), default=datetime.now, nullable=False)
    camera = Column(Integer, ForeignKey('camera.id'))
    uptime = Column(Integer)
    pid = Column(Integer)
    cpu_usage = Column(Integer)
    memory_usage = Column(Integer)
    disk_usage = Column(BigInteger)
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

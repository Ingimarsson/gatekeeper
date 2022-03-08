import smtplib, ssl
from email.mime.text import MIMEText
from datetime import timedelta, datetime

from app import db, logger
from app.models import Gate, User, Alert, AlertEvent, Log
from app.utils import is_within_hours

from sqlalchemy import or_
from sqlalchemy.orm import aliased

class EmailService:
  smtp_email = ''
  smtp_user = ''
  smtp_password = ''
  smtp_host = ''
  smtp_port = 0

  def init_app(self, app):
    self.smtp_email = app.config.get('SMTP_EMAIL')
    self.smtp_user = app.config.get('SMTP_USER')
    self.smtp_password = app.config.get('SMTP_PASSWORD')
    self.smtp_host = app.config.get('SMTP_HOST')
    self.smtp_port = app.config.get('SMTP_PORT')

  def register_alerts(self, log):
    # Map logged type to alert type
    if log.type in ['keypad-pin', 'keypad-card', 'keypad-both']:
      log_type = 'keypad'
    else:
      log_type = log.type

    alerts = Alert.query \
      .filter(or_(Alert.gate == log.gate, Alert.gate == None)) \
      .filter(or_(Alert.user == log.user, Alert.user == None)) \
      .filter(or_(Alert.type == log_type, Alert.type == None)) \
      .filter(or_(Alert.code == log.code, Alert.code == None)) \
      .filter(Alert.is_enabled == True, Alert.is_deleted == False) \
      .all()

    for a in alerts:
      # Ignore if not within time limits
      if a.time_limits and not is_within_hours(a.start_hour, a.end_hour):
        continue

      # Ignore if failed and alert is only for successful
      if log.result == False and not a.failed_attempts:
        continue

      event = AlertEvent(alert=a.id, log=log.id)

      db.session.add(event)
      db.session.commit()

    return

  def send_alerts(self):
    Owner = aliased(User)

    events = AlertEvent.query \
      .join(Log, AlertEvent.log == Log.id) \
      .join(Alert, AlertEvent.alert == Alert.id) \
      .join(Gate, Log.gate == Gate.id) \
      .join(Owner, Alert.owner == Owner.id) \
      .outerjoin(User, Log.user == User.id) \
      .filter(Log.timestamp > datetime.now() - timedelta(days=1), AlertEvent.email_sent == False) \
      .add_columns(Owner.email, Alert.name, Log.timestamp, Log.type, Gate.name, User.name) \
      .all()

    for e in events:
      try:
        self.send_alert(e[1], e[2], e[5], e[6], e[4], e[3])
        logger.info("Sent an alert to {} (id: {})".format(e[1], e[0].id))
        e[0].email_sent = True
        db.session.commit()
      except Exception as err:
        logger.error("Could not send email alert for event (id: {}) - {}".format(e[0].id, type(err).__name__))

    return

  def send_alert(self, to, name, gate, user, type, timestamp):
    msg = MIMEText(f"""
      <h1>Gatekeeper</h1>
      <h2>Alert: {name}</h2>
      <p>This alert is sent automatically from Gatekeeper. Details of event can be found in the Gatekeeper Cloud.</p>
      <p>Time: {timestamp.ctime()}</p>
      <p>Gate: {gate}</p>
      <p>User: {user}</p>
      <p>Type: {type}</p>
    """, "html")

    msg['Subject'] = 'Alert: ' + name
    msg['From'] = f'Gatekeeper <{self.smtp_email}>'
    msg['To'] = to

    context = ssl.create_default_context()

    with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
      server.starttls(context=context)
      server.login(self.smtp_user, self.smtp_password)
      server.sendmail(self.smtp_user, to, msg.as_string())

    return

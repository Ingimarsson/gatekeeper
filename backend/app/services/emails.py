import smtplib, ssl
from email.mime.text import MIMEText

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

  def send_alert(self, to, name, gate, user, method, timestamp, snapshot_path):
    msg = MIMEText("""
      <h1>Gatekeeper Alert</h1>
      <h2>{name}</h2>
      <p>{timestamp}</p>
      <p>Gate: {gate}</p>
      <p>User: {user}</p>
      <p>Method: {method}</p>
    """, "html")

    msg['Subject'] = 'Gatekeeper Alert: ' + name
    msg['From'] = f'Gatekeeper {self.smtp_email}'
    msg['To'] = to

    context = ssl.create_default_context()

    with smtplib.SMTP_SSL(self.smtp_host, self.smtp_port, context=context) as server:
      server.login(self.smtp_user, self.smtp_password)
      server.sendmail(self.smtp_user, receiver_email, msg.as_string())

    return

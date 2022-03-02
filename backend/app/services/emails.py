class EmailService:
    smtp_user = ''
    smtp_password = ''
    smtp_host = ''

    def init_app(self, app):
        self.smtp_user = app.config.get('SMTP_USER')
        self.smtp_password = app.config.get('SMTP_PASSWORD')
        self.smtp_host = app.config.get('SMTP_HOST')

    def send_alert(self, name = '', gate = '', user = '', method = '', timestamp  = '', snapshot_path = None):
        return
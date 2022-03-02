class StreamService:
    stream_host = ''

    def init_app(self, app):
        self.stream_host = app.config.get('STREAM_HOST')

    def get_status(self):
        return

    def save_image(self):
        return

    def get_snapshots(self):
        return

    def remove_old_snapshots(self):
        return

   def update_config(self):
       return
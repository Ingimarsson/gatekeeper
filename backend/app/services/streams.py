import requests

from app import db
from app.models import Gate

class StreamService:
  stream_host = ''
  db = None

  def init_app(self, app):
    self.stream_host = app.config.get('STREAM_HOST')

  def get_status(self):
    response = requests.get(f'{self.stream_host}/', timeout=2)

    return response.json()

  def save_image(self, camera_id):
    response = requests.get(f'{self.stream_host}/save/{camera_id}', timeout=2)

    return response.json()['image']

  def get_snapshots(self):
    response = requests.get(f'{self.stream_host}/latest_snapshots/{camera_id}', timeout=2)

    return response.json()

  def remove_old_snapshots(self, timestamp):
    response = requests.get(f'{self.stream_host}/remove_old_snapshots/{camera_id}', timeout=2)

    return

  def update_config(self):
    gates = Gate.query.filter(Gate.is_deleted == False).all()

    config = [{
      "id": g.id,
      "url": g.camera_uri
    } for g in gates if g.camera_uri != '']

    requests.post(f'{self.stream_host}/config', json=config, timeout=10)

    return
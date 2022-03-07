import requests

from app import db, logger
from app.models import Gate

class StreamService:
  stream_host = ''

  def init_app(self, app):
    self.stream_host = app.config.get('STREAM_HOST')

  def request(self, method, path, timeout=2, json=None):
    return requests.request(method, f'{self.stream_host}{path}', timeout=timeout, json=json)

  def get_status(self):
    response = self.request('GET', '/')
    return response.json()

  def save_image(self, camera_id):
    response = self.request('GET', f'/save/{camera_id}')
    return response.json()['image']

  def get_snapshots(self, camera_id):
    response = self.request('GET', f'/latest_snapshots/{camera_id}')
    return response.json()

  def remove_old_snapshots(self, timestamp):
    response = self.request('GET', f'/remove_old_snapshots/{timestamp}')
    return response.ok

  def update_config(self):
    gates = Gate.query.filter(Gate.is_deleted == False).all()

    config = [{
      "id": g.id,
      "url": g.camera_uri
    } for g in gates if g.camera_uri != '']

    response = self.request('POST', f'{self.stream_host}/config', json=config, timeout=10)
    return response.ok
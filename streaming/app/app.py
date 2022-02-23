from flask import Flask, request, json, send_file
import logging
import os

from config import config as configuration
from daemon import Daemon

app = Flask(__name__)

gunicorn_logger = logging.getLogger('gunicorn.error')
app.logger.handlers = gunicorn_logger.handlers
app.logger.setLevel(gunicorn_logger.level)

daemon = Daemon(app.logger)
daemon.start()

@app.route("/")
def status():
  """
  Return stream status and list of post-saves
  """
  global daemon
  return json.jsonify(daemon.get_status())


@app.route("/latest_snapshots/<int:id>")
def latest_snapshots(id):
  """
  Return stream status and list of post-saves
  """
  global daemon
  return json.jsonify(daemon.get_latest_snapshots(id))


@app.route("/latest_image/<int:id>")
def latest_jpeg(id):
  image = None
  for s in daemon.get_status():
    if s['id'] == id:
      image = s['latest_image']

  if not image:
    return "No image"

  path = os.path.join(configuration['DATA_PATH'], "camera_{}/live/".format(id), image)

  return send_file(path, mimetype='image/jpeg'), 200, {'Refresh': '1;url=/latest_image/{}'.format(id)}

@app.route("/save/<int:id>")
def save(id: int):
  """
  Tell a stream instance to save snapshot
  """
  return json.jsonify({"image": daemon.save_snapshot(id)})


@app.route("/config", methods=['POST'])
def config():
  """
  Update config and save in file.
  """
  global daemon
  daemon.write_config(request.json)

  daemon.stop()
  daemon.join()

  daemon = Daemon(app.logger)
  daemon.start()

  return "ok"


if __name__ == '__main__':
    app.run()

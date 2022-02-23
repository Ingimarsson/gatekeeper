from flask import Flask, request, json
import logging

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


@app.route("/save/<stream_id>")
def save(stream_id: int):
  """
  Tell a stream instance to save snapshot
  """
  return "ok"


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

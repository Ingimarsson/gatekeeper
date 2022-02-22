from flask import Flask, request
from tasks import uwsgi_task

from daemon import Daemon

app = Flask(__name__)

daemon = None

@app.route("/")
def status():
  """
  Return stream status and list of post-saves
  """
  return "ok"


@app.route("/save/<stream_id:int>")
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
  daemon.stop()
  daemon.join()

  # Update config file

  deamon = Daemon()
  daemon.start()

  return "ok"

@app.before_first_request
def start_thread():
  daemon = Daemon()
  daemon.start()


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4123)


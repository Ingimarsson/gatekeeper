from threading import Thread
from datetime import datetime
import time
import json
import os

from config import config as configuration
from stream import Stream

class Daemon(Thread):
  """
  This class is the background thread that manages all the Stream instances
  """
  config = []
  streams = []
  logger = None

  stop_signal = False

  def __init__(self, logger) -> None:
    Thread.__init__(self)
    self.daemon = True
    self.logger = logger
    self.streams = []

    try:
      with open(os.path.join(configuration['DATA_PATH'], "config.json")) as json_file:
        self.config = json.load(json_file)

      self.logger.info("Started daemon with {} streams".format(len(self.config)))

    except Exception:
      self.logger.warning("No config file found, starting daemon with no streams")
      self.streams = []

    for s in self.config:
      stream = Stream(self.logger, s['id'], s['url'])
      self.streams.append(stream)

    return


  def write_config(self, config) -> None:
    """
    Write dict config to a JSON file
    """
    with open(os.path.join(configuration['DATA_PATH'], "config.json"), 'w') as outfile:
      json.dump(config, outfile)


  def run(self) -> None:
    """
    Infinite loop that cleans up old snapshots and restarts streams if dead.
    """
    counter = 0

    while not self.stop_signal:
      self.logger.debug("Running loop")
      for s in self.streams:
        if counter % 5 == 0:
          s.get_stats()
          s.remove_old_images()
          s.complete_snapshots()

        if counter % 10 == 0 and counter != 0 and not s.is_alive():
          self.logger.warning("Process for camera %d dead, restarting", s.id)
          s.kill()

          stream = Stream(self.logger, s.id, s.url)

          self.streams.remove(s)
          self.streams.append(stream)

      counter = (counter + 1) % 60
      time.sleep(1)

    self.stop_streams()

  def save_snapshot(self, stream_id):
    stream = next((s for s in self.streams if s.id == stream_id), None)

    return stream.save_snapshot()

  def get_latest_snapshots(self, stream_id):
    stream = next((s for s in self.streams if s.id == stream_id), None)

    snapshots = os.listdir(os.path.join(configuration['DATA_PATH'], "camera_{}/snapshots/".format(stream.id)))
    result = []

    for s in snapshots[-50:]:
      images = sorted(os.listdir(os.path.join(configuration['DATA_PATH'], "camera_{}/snapshots/{}/".format(stream.id, s))))
      if not images:
        continue

      result.append({
        "snapshot": int(s), 
        "first_image": int(images[0].split(".")[0]),
        "last_image": int(images[-1].split(".")[0])
      })

    return result

  def get_status(self) -> None:
    """
    Return the status of each stream as dictionary.
    """
    return [{
      "id": s.id,
      "url": s.url,
      "created_at": s.created_at.astimezone().isoformat(),
      "uptime": int((datetime.now() - s.created_at).total_seconds()),
      "latest_image": s.get_latest_image(),
      "is_alive": s.is_alive(),
      "pid": s.process.pid,
      "cpu_percent": s.cpu_usage,
      "memory": s.mem_usage,

    } for s in self.streams]


  def stop(self):
    """
    Raise a stop signal for the run loop
    """
    self.stop_signal = True

    return


  def stop_streams(self):
    """
    Stop all the streaming processes.
    """
    for s in self.streams:
      s.kill()

    return
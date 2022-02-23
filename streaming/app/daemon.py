from threading import Thread
from datetime import datetime
import time
import json

from stream import Stream

class Daemon(Thread):
  """
  This class is the background thread that manages all the Stream instances
  """
  config = None
  logger = None
  streams = []

  stop_signal = False

  def __init__(self, logger) -> None:
    Thread.__init__(self)
    self.daemon = True
    self.logger = logger
    self.streams = []

    try:
      with open('config.json') as json_file:
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
    with open('config.json', 'w') as outfile:
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
          s.remove_old_images()

        if counter % 15 == 0 and not s.is_alive():
          s.restart()

      counter = (counter + 1) % 60
      time.sleep(1)

    self.stop_streams()


  def get_status(self) -> None:
    """
    Return the status of each stream as dictionary.
    """
    return [{
      "url": s.url,
      "created_at": s.created_at.astimezone().isoformat(),
      "uptime": int((datetime.now() - s.created_at).total_seconds()),
      "last_image": s.get_latest_image(),
      "is_alive": s.is_alive(),
      "pid": s.get_pid()
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
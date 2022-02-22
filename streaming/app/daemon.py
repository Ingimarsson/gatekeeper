from thread import Thread
import time

class Daemon(Thread):
  """
  This class is the background thread that manages all the Stream instances
  """
  streams = []

  def __init__(self, config: Dict) -> None:
    Thread.__init__(self)
    return


  def loop(self) -> None:
    """
    Infinite loop that cleans up old snapshots and restarts streams if dead.
    """
    while True:
      for s in streams:
        s.delete_old_images()

        if not s.is_alive():
          s.restart()

      time.sleep(10)


  def get_status(self) -> Dict:
    """
    Return the status of each stream as dictionary.
    """
    return [{
      "url": s.url,
      "started_at": s.started_at,
      "last_image": s.get_latest_image(),
      "is_alive": s.is_alive(),
      "pid": s.get_pid()
    } for s in streams]


  def stop_all(self):
    """
    Stop all the streaming processes.
    """
    for s in streams:
      s.kill()
      del s


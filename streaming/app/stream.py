from datetime import datetime

class Stream:
  """
  This class manages an ffmpeg process for a single camera, along with useful methods.
  """
  id = None
  url = None
  created_at = None
  process = None

  logger = None

  def __init__(self, logger, id: int, url: str) -> None:
    self.id = id
    self.logger = logger
    self.url = url
    self.created_at = datetime.now()
    self.start_ffmpeg()

    logger.info("Started stream {}: {}".format(id, url))
    return

  def start_ffmpeg(self) -> None:
    # self.process = process.spawn(self.url)
    return

  def get_latest_image(self) -> None:
    return
    
  def remove_old_images(self) -> None:
    self.logger.info("Removing for %s", self.url)
    return

  def get_pid(self) -> int:
    return 42

  def is_alive(self) -> bool:
    # process.is_alive() && latest_image is recent
    return True

  def kill(self) -> None:
    return

  def restart(self) -> None:
    return

class Stream:
  """
  This class manages an ffmpeg process for a single camera, along with useful methods.
  """
  url = None
  created_at = None
  process = None

  def __init__(self, url: string) -> None:
    self.url = url
    self.start_ffmpeg()
    return

  def start_ffmpeg(self) -> None:
    # self.process = process.spawn(self.url)
    return

  def get_latest_image(self) -> None:
    return
    
  def remove_old_images(self) -> None:
    return

  def is_alive(self) -> bool:
    # process.is_alive() && latest_image is recent
    return

  def kill(self) -> None:
    return

  def restart(self) -> None:
    return

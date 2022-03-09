from datetime import datetime
import os
import time
import subprocess
import psutil 
import shutil

from config import config

class Stream:
  """
  This class manages an ffmpeg process for a single camera, along with useful methods.
  """
  id = None
  url = None
  created_at = None
  process = None

  cpu_usage = 0
  mem_usage = 0
  disk_usage = 0
  snapshot_count = 0

  base_path = None
  live_path = None
  snapshot_path = None

  logger = None

  incomplete_snapshots = None

  def __init__(self, logger, id: int, url: str) -> None:
    self.id = id
    self.logger = logger
    self.url = url
    self.created_at = datetime.now()

    self.base_path = os.path.join(config['DATA_PATH'], 'camera_{}/'.format(id))
    self.live_path = os.path.join(self.base_path, "live/")
    self.snapshot_path = os.path.join(self.base_path, "snapshots/")

    self.incomplete_snapshots = []

    os.makedirs(self.base_path, exist_ok=True)
    os.makedirs(self.live_path, exist_ok=True)

    self.start_ffmpeg()

    logger.info("Started stream {}: {}".format(id, url))
    return


  def start_ffmpeg(self) -> None:
    """
    Start an ffmpeg process that saves timestamped images to the data directory.
    """
    command = "ffmpeg -i '{}' -f image2 -vf scale=w='min(1280\, iw*3/2):h=-1' -q:v 8 -r 2 -strftime 1 {}/%s.jpg".format(self.url, self.live_path)

    self.process = subprocess.Popen(command, shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    self.logger.info("Process for %d with PID %d", self.id, self.process.pid)

    return


  def get_stats(self):
    """
    Collect CPU and memory statistics for ffmpeg process.
    """
    try:
      p = psutil.Process(self.process.pid)
    except Except:
      pass

    if not p:
      return

    # Sometimes we get an /bin/sh instance first
    if p.name() != 'ffmpeg':
      p = p.children()[0]

    self.cpu_usage = p.cpu_percent(interval=0.5)
    self.mem_usage = p.memory_info().rss
    self.disk_usage = int(subprocess.check_output(['du','-s', self.base_path]).split()[0].decode('utf-8'))*1024
    self.snapshot_count = int(subprocess.check_output(['sh','-c', f'ls -lh {self.snapshot_path} | wc -l']))


  def get_latest_image(self) -> None:
    """
    Get the name of the latest live image.
    """
    images = sorted(os.listdir(self.live_path))

    if len(images):
      return images[-1]
    else:
      return ""
    

  def save_snapshot(self):
    """
    Save a snapshot.

    This creates a directory under camera_<id>/snapshots/<timestamp> and saves the
    snapshot there along with a sequence of 20 images before. Later, complete_snapshots
    is called and the 20 images after are collected.
    """

    images = sorted(os.listdir(self.live_path))

    if not images:
      return

    latest = int(images[-1].split(".")[0])

    path = os.path.join(self.snapshot_path, "{}/".format(latest))
    os.makedirs(path)

    files = []

    for i in range(10):
      src = os.path.join(self.live_path, "{}.jpg".format(latest - i))
      if os.path.exists(src):
        os.system("cp {} {}".format(src, path))
        files.append(latest - i)

    self.incomplete_snapshots.append(latest)

    return latest


  def complete_snapshots(self) -> None:
    """
    Save snapshots from 1 to 20 seconds after the event, which did not exist at save time.
    """
    for snapshot in self.incomplete_snapshots:
      if snapshot < datetime.now().timestamp() - 30:
        path = os.path.join(self.snapshot_path, "{}/".format(snapshot))

        for i in range(1, 15):
          src = os.path.join(self.live_path, "{}.jpg".format(snapshot + i))
          if os.path.exists(src):
            os.system("cp {} {}".format(src, path))

        #self.incomplete_snapshots.remove(snapshot)

    return


  def remove_old_snapshots(self, timestamp):
    """
    Remove all snapshots directories older than timestamp
    """
    for f in os.listdir(self.snapshot_path):
      if int(f) <= timestamp:
        shutil.rmtree(os.path.join(self.snapshot_path, f))

    return


  def remove_old_images(self) -> None:
    """
    Remove live images that are older than threshold (about 60 seconds)
    """
    self.logger.debug("Removing for %s", self.url)
    for f in os.listdir(self.live_path):
      full_path = os.path.join(self.live_path, f)
      if os.stat(full_path).st_mtime < time.time() - config['MAX_LIVE_AGE']:
        self.logger.debug("Removing %s", full_path)
        os.remove(full_path)

    return


  def is_alive(self) -> bool:
    """
    Check if ffmpeg is alive by checking if latest image is less than 10 seconds old.
    """
    latest_image = self.get_latest_image()
    if not latest_image:
      return False

    if os.stat(os.path.join(self.live_path, latest_image)).st_mtime < time.time() - 10:
      return False

    return True


  def kill(self) -> None:
    """
    Kill the ffmpeg process.
    """
    self.logger.info("Killing process for %d", self.id)
    self.process.kill()

    return

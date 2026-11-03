import os

config = {
  "MAX_LIVE_AGE": int(os.environ.get("GK_MAX_LIVE_AGE", 60)),
  "DATA_PATH": os.environ.get("GK_DATA_PATH", "/data/"),
  "DISK_STATS_INTERVAL": int(os.environ.get("GK_DISK_STATS_INTERVAL", 300)),
  "FFMPEG_HWACCEL": os.environ.get("GK_FFMPEG_HWACCEL", "")
}
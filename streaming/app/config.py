import os

config = {
  "MAX_LIVE_AGE": int(os.environ.get("GK_MAX_LIVE_AGE", 60)),
  "DATA_PATH": os.environ.get("GK_DATA_PATH", "/home/hamrar/streaming/data/")
}
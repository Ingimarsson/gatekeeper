from app import scheduler, streams, controllers, emails, redis, access, logger, db
from app.models import Gate, Log, CameraStatus, ControllerStatus, Config

from flask import current_app
from datetime import timedelta, datetime
from sqlalchemy import func
import requests

@scheduler.task('cron', id='delete_old_images', day='*')
def delete_old_images():
  """
  Send request to Streaming Service to delete snapshots that are old to save disk space.
  """
  with scheduler.app.app_context():
    keep_count = current_app.config['SNAPSHOT_KEEP_COUNT']

    latest = Log.query.order_by(Log.id.desc()).limit(1).first()
    log = Log.query.filter(Log.id <= latest.id - keep_count).order_by(Log.id.desc()).limit(1).first()

    if not log or not log.image:
      logger.info("Found no images to delete, keeping last {} snapshots".format(keep_count))
      return

    logger.info("Deleting images older than {}, keeping last {} snapshots".format(log.timestamp, keep_count))
    streams.remove_old_snapshots(log.image)
    Log.query.filter(Log.id <= log.id).update({'image': '', 'first_image': '', 'last_image': ''})
    db.session.commit()

    return


@scheduler.task('cron', id='collect_statistics', minute='*/5')
def collect_statistics():
  """
  Collect statistics about cameras and controllers
  """
  with scheduler.app.app_context():
    try:
      camera_status = streams.get_status()
    except:
      logger.error("Failed to get camera status from streaming service")
      return

    for c in camera_status:
      status = CameraStatus(
        camera=c['id'],
        uptime=c['uptime'],
        pid=c['pid'],
        cpu_usage=int(c['cpu_percent']*10),
        memory_usage=c['memory'],
        disk_usage=c['disk_size'],
        snapshot_count=c['snapshot_count'],
        is_alive=c['is_alive'],
      )
      db.session.add(status)
      db.session.commit()

    gates = Gate.query.filter(Gate.is_deleted == False).all()
    for g in gates:
      try:
        controller_status = controllers.get_status(g)
      except:
        logger.error("Failed to get status for controller of gate {} (id: {})".format(g.name, g.id))
        continue

      status = ControllerStatus(gate=g.id)

      if 'is_alive' in controller_status:
        status.is_alive = controller_status['is_alive']
      if 'controller_ip' in controller_status:
        status.ip_address = controller_status['controller_ip']
      if 'uptime' in controller_status:
        status.uptime = controller_status['uptime']

      db.session.add(status)
      db.session.commit()

    return


@scheduler.task('cron', id='send_alerts', minute='*')
def send_alerts():
  """
  Send email alerts
  """
  with scheduler.app.app_context():
    emails.send_alerts()

  return


@scheduler.task('cron', id='update_snapshots', minute='*')
def update_snapshots():
  """
  Update log snapshots to include +N seconds after event
  """
  with scheduler.app.app_context():
    access.update_snapshots()

  return

@scheduler.task('cron', id='fetch_external_screens', minute='*')
def fetch_external_screens():
  """
  Update locally cached HTML bodies for information display.
  """
  with scheduler.app.app_context():
    screen_1 = Config.query.filter(Config.key == 'screen_1_url').first()
    if screen_1:
      try:
        response = requests.get(screen_1.value, timeout=3)
        redis.r.set('screen_1:last_fetch', datetime.now().isoformat())
        redis.r.set('screen_1:body', response.content.decode('utf-8'))
      except:
        logger.error("Failed to fetch content for cockpit screen 1")

    screen_2 = Config.query.filter(Config.key == 'screen_2_url').first()
    if screen_2:
      try:
        response = requests.get(screen_2.value, timeout=3)
        redis.r.set('screen_2:last_fetch', datetime.now().isoformat())
        redis.r.set('screen_2:body', response.content.decode('utf-8'))
      except:
        logger.error("Failed to fetch content for cockpit screen 2")
  return
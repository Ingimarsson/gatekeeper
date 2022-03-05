from app import scheduler, streams, controllers, logger, db
from app.models import Gate, Log, CameraStatus, ControllerStatus

from sqlalchemy import func

@scheduler.task('cron', id='delete_old_images', day='*')
def delete_old_images():
  """
  Send request to Streaming Service to delete snapshots that are old to save disk space.
  """
  log = Log.query.filter(Log.id < func.max(Log.id) - 40000).first()

  if not log or not log.image:
    logger.info("Found no images to delete")
    return

  logger.info("Deleting images older than {}".format(log.timestamp))
  streams.delete_old_images(log.image)
  Log.query.filter(Log.id < log.id).update({'image': '', 'first_image': '', 'last_image': ''})

  return


@scheduler.task('cron', id='collect_statistics', minute='*/1')
def collect_statistics():
  """
  Collect statistics about cameras and controllers
  """
  camera_status = streams.get_status()
  for c in camera_status:
    status = CameraStatus(
      gate=c['id'],
      uptime=c['uptime'],
      pid=c['pid'],
      cpu_usage=c['cpu_usage'],
      memory_usage=c['memory_usage'],
      disk_usage=c['disk_usage'],
      snapshot_count=c['snapshot_count'],
      is_alive=c['is_alive'],
    )
    db.session.add(status)
    db.session.commit()

  gates = Gate.query.all()
  for g in gates:
    controller_status = controllers.get_status(g)

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
  return


@scheduler.task('cron', id='update_snapshots', minute='*')
def update_snapshots():
  """
  Update log snapshots to include +N seconds after event
  """
  return
from app import scheduler, logger

@scheduler.task('cron', id='delete_old_images', minute='*')
def delete_old_images():
    """
    Send request to Streaming Service to delete snapshots that are old to save disk space.
    """
    logger.info("Deleting old images")

    return


@scheduler.task('cron', id='collect_statistics', minute='*/5')
def collect_statistics():
    """
    Collect statistics about cameras and controllers
    """
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
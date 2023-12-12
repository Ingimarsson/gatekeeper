import requests
import json

from app import db, logger, matrix
from app.models import Gate, Log, Method, User
from app.utils import is_within_hours

from sqlalchemy import or_

from datetime import datetime, timedelta

class AccessService:
  AREA_THRESHOLD = 10000
  TIME_MATCH = 4
  TIME_COOLDOWN = 5

  streams = None
  controllers = None
  emails = None
  redis = None

  def init_app(self, app, streams, controllers, emails, redis):
    self.streams = streams
    self.controllers = controllers
    self.emails = emails
    self.redis = redis

    return

  def handle_gatekeeper_request(self, gate_id, type, code=''):
    """
    Handle a request from a Gatekeeper controller

    Returns a boolean, whether the request was successful or not
    """
    gate = Gate.query.filter(Gate.id == gate_id).first()
    settings = gate.settings if gate.settings else {}

    # Ignore button timer messages
    if type in ['button-8', 'button-9']:

      # Check if no recent log, then send message
      if type == 'button-9':
        count = Log.query.filter(Log.gate == gate.id) \
          .filter(Log.type == 'plate') \
          .filter(Log.timestamp > datetime.now() - timedelta(seconds=5)) \
          .count()
        
        if not count:
          matrix.send_detector_message()

      return True

    log = Log(gate=gate.id, result=False, operation='open', code=code, type=type)

    if type in ['keypad-pin', 'keypad-card', 'keypad-both']:
      # Looks up method and returns response (success, expired, etc.)
      method, reason = self.get_method(gate.id, type, code)

      log.reason = reason
      log.method = method.id if method else None
      log.result = True if reason == 'success' else False

      if method:
        user = User.query.filter(User.id == method.user).first()
        log.user = user.id

    # Buttons 1 and 2 always open the gate
    if type in ['button-1', 'button-2']:
      button_number = type.split('-')[1]
      log.type_label = settings.get('button_labels', {}).get(button_number, "")
      log.reason = 'success'
      log.result = True

    # Button 3 opens depending on its settings
    if type in ['button-3']:
      button_number = type.split('-')[1]
      log.type_label = settings.get('button_labels', {}).get(button_number, "")
      if gate.button_type == 'enabled':
        log.result = True

      if gate.button_type == 'disabled':
        log.result = False

      if gate.button_type == 'timer':
        log.result = is_within_hours(gate.button_start_hour, gate.button_end_hour)

      log.reason = 'success' if log.result else 'disabled'

    if gate.camera_general:
      log.image = self.save_snapshot(gate.camera_general)

    if gate.camera_alpr:
      log.alpr_image = self.save_snapshot(gate.camera_alpr)
      
    if gate.http_trigger:
      self.send_trigger_request(gate.http_trigger)

    # Gatekeeper opens if response is 200, no need to send an open request
    # if log.result:
    #   self.controllers.send_command(gate, 'open')

    db.session.add(log)
    db.session.commit()

    self.redis.publish_entry(log.gate, log.id)
    self.emails.register_alerts(log)

    return log.result

  def handle_openalpr_request(self, gate_id, request_body):
    """
    Handle a request from the OpenALPR service

    Returns a message and HTTP status code to respond with
    """
    gate = Gate.query.filter(Gate.id == gate_id).first()
    settings = gate.settings if gate.settings else {}
    type = request_body.get('data_type')

    # This type is sent for every frame from the video camera
    if type == 'alpr_results':
      result = self.openalpr_get_largest_plate(request_body.get('results', []))

      self.redis.put_plate(gate.id, result)

      plate = result['plate']
      area = result['area']

      if area < self.AREA_THRESHOLD:
        return {"message": "threshold"}, 200

      timestamp = int(datetime.now().timestamp())

      gate_timestamp = int(self.redis.r.get("gate:{}:timestamp".format(gate_id)) or 0)
      gate_cooldown = True if self.redis.r.get("gate:{}:cooldown".format(gate_id)) else False

      if timestamp == gate_timestamp:
        plates = json.loads(self.redis.r.get("gate:{}:plates".format(gate_id)) or "[]")
        plates.append(plate)

        self.redis.r.set("gate:{}:plates".format(gate_id), json.dumps(plates))

        return {"message": "timestamp"}, 200


      plates = json.loads(self.redis.r.get("gate:{}:plates".format(gate_id)) or "[]")

      self.redis.r.set("gate:{}:plates".format(gate_id), json.dumps([plate]))
      self.redis.r.set("gate:{}:timestamp".format(gate_id), timestamp)

      if len(plates) == 0:
        return {"message": "noplate"}, 200

      frequent_plate = max(set(plates), key=plates.count)

      logger.info("Found plate {} {} times in last second (area {})".format(frequent_plate, plates.count(frequent_plate), area))

      self.redis.r.set("gate:{}:plate_{}".format(gate_id, timestamp - 1), frequent_plate, 10)

      for i in range(1, self.TIME_MATCH + 1):
        p = self.redis.r.get("gate:{}:plate_{}".format(gate_id, timestamp - i)) or ""
        logger.info("plate " + p)
        if p != frequent_plate:
          matrix.send_processing_message(frequent_plate, i - 1, self.TIME_MATCH)

          return {"message": "nomatch"}, 200

      logger.info("Found {} sequential occurrences of plate {}".format(self.TIME_MATCH, frequent_plate))

      if self.redis.r.get("gate:{}:cooldown".format(gate_id)):
        logger.info("Cooldown enabled, doing nothing")
        return {"message": "cooldown"}, 200

      self.redis.r.set("gate:{}:cooldown".format(gate_id), "true", self.TIME_COOLDOWN)

      log = Log(
        gate=gate.id,
        result=False,
        operation='open',
        code=frequent_plate,
        type='plate'
      )

      # Looks up method and returns response (success, expired, etc.)
      method, reason = self.get_method(gate.id, 'plate', frequent_plate)

      log.reason = reason
      log.method = method.id if method else None
      log.result = True if reason == 'success' else False

      user = None

      if method:
        user = User.query.filter(User.id == method.user).first()
        log.user = user.id

      if gate.camera_general:
        log.image = self.save_snapshot(gate.camera_general)

      if gate.camera_alpr:
        log.alpr_image = self.save_snapshot(gate.camera_alpr)

      if gate.http_trigger:
        self.send_trigger_request(gate.http_trigger)

      if log.result:
        detector = self.controllers.send_command(gate, 'open', conditional=True)

        if not detector:
          log.reason = 'not_detected'
          log.result = False

      db.session.add(log)
      db.session.commit()

      matrix.send_result_message(log, method, user)

      self.redis.publish_entry(log.gate, log.id)
      self.emails.register_alerts(log)

      return {"message": "ok"}, 200

    # This type is sent only once for each plate seen (includes travel direction)
    if type == 'alpr_group':
      plate = request_body.get('best_plate_number')

      log = Log(
        gate=gate.id,
        result=False,
        operation='open',
        code=plate,
        type='plate'
      )

      # Looks up method and returns response (success, expired, etc.)
      method, reason = self.get_method(gate.id, 'plate', plate)

      log.reason = reason
      log.method = method.id if method else None
      log.result = True if reason == 'success' else False

      if method:
        user = User.query.filter(User.id == method.user).first()
        log.user = user.id

      # Check if travel direction matches
      travel_direction = request_body.get('travel_direction')
      if travel_direction < settings.get('min_angle', 0) or travel_direction > settings.get('max_angle', 360):
        log.result = False
        log.reason = "wrong_dir"

      c = request_body.get('best_plate')['coordinates']
      area = (max(c, key=lambda p:p['x'])['x'] - min(c, key=lambda p:p['x'])['x']) \
        * (max(c, key=lambda p:p['y'])['y'] - min(c, key=lambda p:p['y'])['y'])

      if area < self.AREA_THRESHOLD:
        logger.info("alpr_group below threshold {}".format(area))

        log.result = False
        log.reason = "observed"

      last_log = Log.query.filter(Log.gate == gate.id).order_by(Log.id.desc()).first()

      if last_log != None and last_log.code == plate:
        logger.info("alpr_group matches last plate {}".format(plate))

        log.result = False
        log.reason = "observed"

      if gate.camera_general:
        log.image = self.save_snapshot(gate.camera_general)

      if gate.camera_alpr:
        log.alpr_image = self.save_snapshot(gate.camera_alpr)

      if gate.http_trigger:
        self.send_trigger_request(gate.http_trigger)

      if log.result:
        self.controllers.send_command(gate, 'open', conditional=True)

      db.session.add(log)
      db.session.commit()

      self.redis.publish_entry(log.gate, log.id)
      self.emails.register_alerts(log)

      return {"message": "ok"}, 200

    return {"message": "type not recognized"}, 400

  def handle_web_request(self, gate_id, user_id, command='open'):
    """
    Handle a command from the web interface
    """
    gate = Gate.query.filter(Gate.id == gate_id).first()
    user = User.query.filter(User.id == user_id).first()

    log = Log(
      gate=gate.id,
      result=True,
      reason='success',
      operation=command,
      type='web',
      user=user.id,
    )

    if gate.camera_general:
      log.image = self.save_snapshot(gate.camera_general)

    if gate.camera_alpr:
      log.alpr_image = self.save_snapshot(gate.camera_alpr)
      
    if gate.http_trigger:
      self.send_trigger_request(gate.http_trigger)

    result = self.controllers.send_command(gate, command)

    db.session.add(log)
    db.session.commit()

    self.redis.publish_entry(log.gate, log.id)
    self.emails.register_alerts(log)

    return result

  def send_trigger_request(self, trigger_url):
    """
    Try to GET the trigger url that has been specified
    """
    try:
      requests.request('GET', trigger_url, timeout=2)
    except:
      logger.error("Could not call HTTP trigger {}".format(trigger_url))

    return

  def save_snapshot(self, camera_id):
    """
    Ask streaming service to save a snapshot for this camera
    """
    image = None
    try:
      image = self.streams.save_image(camera_id)
    except:
      logger.error("Could not save image for camera (id: {})".format(camera_id))

    return image

  def update_snapshots(self):
    """
    Update saved snapshots that only have one image to having a series of images
    """
    gates = Gate.query.filter(Gate.camera_general != None, Gate.is_deleted == False).all()
    logs = Log.query \
      .filter(Log.image != None, Log.first_image == None) \
      .filter(Log.timestamp < datetime.now() - timedelta(seconds=40)) \
      .filter(Log.timestamp > datetime.now() - timedelta(minutes=15)) \
      .all()

    if len(logs):
      logger.info("Found {} snapshots that need to be updated".format(len(logs)))
    else:
      return

    for g in gates:
      try:
        latest_snapshots = self.streams.get_snapshots(g.camera_general)
        for l in logs:
          if l.gate == g.id:
            for snapshot in latest_snapshots:
              if str(snapshot['snapshot']) == l.image:
                l.first_image = str(snapshot['first_image'])
                l.last_image = str(snapshot['last_image'])
                db.session.commit()
      except:
        logger.error("Could not update snapshots for gate {} (id: {})".format(g.name, g.id))

    return

  def get_method(self, gate_id, type, code):
    """
    Returns a method if it exists, and a reason

    Reason can be: success, not_exist, expired, disabled, wrong_dir or observed
    """
    method = Method.query \
      .filter(Method.type == type, Method.code == code, Method.is_deleted == False) \
      .filter(or_(Method.gate == None, Method.gate == gate_id)) \
      .first()

    if not method:
      return None, "not_exist"

    user = User.query.filter(User.id == Method.user, User.is_deleted == False).first()

    if not user:
      return None, "not_exist"

    if method.start_hour and method.end_hour and not is_within_hours(method.start_hour, method.end_hour):
      return method, "close_time"

    if not method.check_dates():
      return method, "expired"

    if not user.is_enabled or not method.is_enabled:
      return method, "disabled"

    return method, "success"


  def openalpr_get_largest_plate(self, results):
    """
    Takes a list of ALPR results, computes the area of each plate and returns biggest one
    """
    plates = []
    for r in results:
      c = r['coordinates']
      area = (max(c, key=lambda p:p['x'])['x'] - min(c, key=lambda p:p['x'])['x']) \
        * (max(c, key=lambda p:p['y'])['y'] - min(c, key=lambda p:p['y'])['y'])
      plates.append({"plate": r['plate'], "area": area})

    return max(plates, key=lambda p:p['area'])

from flask import Blueprint, jsonify, request
from flask.views import MethodView

from app import db, streams, controllers, logger, emails
from app.models import Alert, User, Gate, Method, Log
from app.utils import is_within_hours

from sqlalchemy import or_
import requests

endpoint_bp = Blueprint('endpoint_bp', __name__)

class GatekeeperView(MethodView):
  def get(self):
    token = request.args.get('token')
    button = request.args.get('button')
    pin = request.args.get('code')
    card = request.args.get('card')

    gate = Gate.query.filter(Gate.token != "", Gate.token == token).first_or_404()
    settings = gate.settings if gate.settings else {}

    logger.info("Got request from controller of gate {} (id: {}, button: {}, pin: {}, card: {})".format(gate.name, gate.id, button, pin, card))

    log = Log(gate=gate.id, result=False, operation='open')

    if button:
      log.type = 'button-' + str(button)

      log.type_label = settings.get('button_labels', {}).get(button, "")

      if gate.button_type == 'enabled':
        log.result = True

      if gate.button_type == 'timer':
        log.result = is_within_hours(gate.button_start_hour, gate.button_end_hour)

      # Buttons 1 and 2 open regardless of response, button 3 respects server decision
      if int(button) != 3:
        log.result = True

    elif pin or card:
      # Combine PIN and card into a code
      if pin and card:
        log.type = 'keypad-both'
        log.code = pin + "-" + card
      elif pin:
        log.type = 'keypad-pin'
        log.code = pin
      elif card:
        log.type = 'keypad-card'
        log.code = card

      method = Method.query \
        .filter(Method.code == log.code, Method.is_deleted == False) \
        .filter(or_(Method.gate == None, Method.gate == gate.id)) \
        .first()

      if method and method.is_enabled:
        user = User.query.filter(User.id == method.user).first()

        log.method = method.id
        log.user = user.id

        if method.check_dates() and user.is_enabled and not user.is_deleted:
          log.result = True

    # Ask streaming service to save an image
    if gate.camera_uri:
      try:
        log.image = streams.save_image(gate.id)
      except:
        logger.error("Could not save image for gate {} (id: {})".format(gate.name, gate.id))

    # Try to call HTTP trigger
    if gate.http_trigger:
      try:
        requests.request('GET', gate.http_trigger, timeout=2)
      except:
        logger.error("Could not call HTTP trigger for gate {} (id: {})".format(gate.name, gate.id))

    db.session.add(log)
    db.session.commit()

    # Handle alert emails if log matches user defined alerts
    emails.register_alerts(log)

    if log.result:
      return {"msg": "200 ok"}, 200
    else:
      return {"msg": "403 denied"}, 403


class OpenALPRView(MethodView):
  def post(self):
    # Ignore irrelevant OpenALPR messages
    if request.json.get('data_type') != 'alpr_group':
      return {"message": "request ignored"}, 200

    token = request.args.get('token')
    gate = Gate.query.filter(Gate.token != "", Gate.token == token).first_or_404()
    settings = gate.settings if gate.settings else {}

    plate = request.json.get('best_plate_number')

    log = Log(gate=gate.id, result=False, operation='open', code=plate, type='plate')

    method = Method.query \
      .filter(Method.type == 'plate', Method.code == plate, Method.is_deleted == False) \
      .filter(or_(Method.gate == None, Method.gate == gate.id)) \
      .first()

    if method and method.is_enabled:
      user = User.query.filter(User.id == method.user).first()

      log.method = method.id
      log.user = user.id

      if method.check_dates() and user.is_enabled and not user.is_deleted:
        log.result = True

    travel_direction = request.json.get('travel_direction')
    min_angle = settings.get('min_angle', 0)
    max_angle = settings.get('max_angle', 360)

    # Set result to false if direction is not within set range
    if travel_direction < min_angle or travel_direction > max_angle:
      log.result = False

    # Ask streaming service to save an image
    if gate.camera_uri:
      try:
        log.image = streams.save_image(gate.id)
      except:
        logger.error("Could not save image for gate {} (id: {})".format(gate.name, gate.id))

    # Try to call HTTP trigger
    if gate.http_trigger:
      try:
        requests.request('GET', gate.http_trigger, timeout=2)
      except:
        logger.error("Could not call HTTP trigger for gate {} (id: {})".format(gate.name, gate.id))

    # Tell controller to open gate if authorized
    if log.result:
      # Send conditional open, only open if car is in gate
      try:
        controllers.send_command(gate, 'open', conditional=True)
      except:
        logger.error("Could not get controller to open gate {} (id: {})".format(gate.name, gate.id))

    db.session.add(log)
    db.session.commit()

    # Handle alert emails if log matches user defined alerts
    emails.register_alerts(log)

    return {"message": "ok"}, 200

endpoint_bp.add_url_rule('/endpoint/gatekeeper', view_func=GatekeeperView.as_view('gatekeeper'))
endpoint_bp.add_url_rule('/endpoint/openalpr', view_func=OpenALPRView.as_view('openalpr'))

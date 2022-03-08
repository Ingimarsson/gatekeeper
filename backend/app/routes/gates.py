import string
import secrets

from flask import Blueprint, jsonify, request
from flask.views import MethodView
from flask_jwt_extended import jwt_required, get_jwt
from sqlalchemy import func
from cerberus import Validator
from datetime import timedelta, datetime

from app import db, streams, logger, emails, controllers
from app.utils import admin_required
from app.models import Gate, Log, User, ControllerStatus

gate_bp = Blueprint('gate_bp', __name__)

class GatesView(MethodView):
  @jwt_required()
  def get(self):
    gates = Gate.query.filter(Gate.is_deleted == False).all()

    result = [{
      'id': g.id,
      'name': g.name,
      'buttonStatus': g.button_type,
      'controllerStatus': 'offline',
      'cameraStatus': 'not-setup',
      'latestImage': '',
      'supportsOpen': g.type == 'gatekeeper' or g.uri_open != '',
      'supportsClose': g.type == 'gatekeeper' or g.uri_close != '',
    } for g in gates]

    # Add latest images from streaming service to response
    try:
      stream_status = streams.get_status()
    except:
      stream_status = []

    max_ids = db.session.query(func.max(ControllerStatus.id)).group_by(ControllerStatus.gate).all()

    controller_status = ControllerStatus.query \
      .filter(ControllerStatus.timestamp > datetime.now() - timedelta(minutes=15)) \
      .filter(ControllerStatus.id.in_([m[0] for m in max_ids])) \
      .all()

    for idx, r in enumerate(result):
      for c in controller_status:
        if c.gate == r['id']:
          result[idx]['controllerStatus'] = 'online' if c.is_alive else 'offline'

      for s in stream_status:
        if s['id'] == r['id']:
          result[idx]['latestImage'] = s['latest_image']
          result[idx]['cameraStatus'] = 'online' if s['is_alive'] else 'offline'

    return jsonify(result), 200

  @admin_required()
  def post(self):
    v = Validator({
      'name': {'type': 'string', 'required': True},
      'type': {'type': 'string', 'required': True, 'allowed': ['gatekeeper', 'generic']},
      'controller_ip': {'type': 'string', 'required': True},
      'uri_open': {'type': 'string', 'required': True},
      'uri_close': {'type': 'string', 'required': True},
      'camera_uri': {'type': 'string', 'required': True},
      'http_trigger': {'type': 'string', 'required': True},
    })

    if not v.validate(request.json):
      return jsonify({'message': 'Input validation failed'}), 400

    alphabet = string.ascii_letters + string.digits
    token = ''.join(secrets.choice(alphabet) for i in range(8))

    gate = Gate(
      name = request.json['name'],
      type = request.json['type'],
      controller_ip = request.json['controller_ip'],
      uri_open = request.json['uri_open'],
      uri_close = request.json['uri_close'],
      camera_uri = request.json['camera_uri'],
      http_trigger = request.json['http_trigger'],
      token = token
    )

    db.session.add(gate)
    db.session.commit()

    # Send update config command to streaming service
    streams.update_config()

    return jsonify({'message': 'Successful'}), 200


class GateDetailsView(MethodView):
  @jwt_required()
  def get(self, id):
    gate = Gate.query.filter(Gate.id == id).first_or_404()
    logs = Log.query.outerjoin(Gate, Log.gate == Gate.id) \
      .outerjoin(User, Log.user == User.id) \
      .order_by(Log.id.desc()) \
      .filter(Log.result == True, Log.is_deleted == False, Gate.id == id) \
      .limit(20) \
      .add_columns(Gate.name, User.name) \
      .all()

    # TODO: Join with status tables to get online/offline
    # TODO: Make call to streaming service to return latest images

    # Add latest images from streaming service to response
    try:
      stream_statuses = streams.get_status()
    except:
      stream_statuses = []

    controller_statuses = ControllerStatus.query \
      .filter(ControllerStatus.timestamp > datetime.now() - timedelta(minutes=15), ControllerStatus.gate == id) \
      .order_by(ControllerStatus.id.desc()) \
      .limit(1) \
      .first()

    controller_status = 'online' if controller_statuses and controller_statuses.is_alive else 'offline'
    stream_status = 'not-setup'
    latest_image = ''

    for s in stream_statuses:
      if s['id'] == gate.id:
          latest_image = s['latest_image']
          stream_status = 'online' if s['is_alive'] else 'offline'

    result = {
      "id": gate.id,
      "name": gate.name,
      "latestImage": latest_image,
      "cameraStatus": stream_status,
      "controllerStatus": controller_status,
      'supportsOpen': gate.type == 'gatekeeper' or gate.uri_open != '',
      'supportsClose': gate.type == 'gatekeeper' or gate.uri_close != '',
      'buttonStatus': gate.button_type,
      'buttonTime': {
        'startHour': gate.button_start_hour,
        'endHour': gate.button_end_hour
      },
      "logs": [{
        "id": l[0].id,
        "timestamp": l[0].timestamp.isoformat(),
        "gate": l[1],
        "user": l[2],
        "type": l[0].type,
        "typeLabel": l[0].type_label,
        "code": l[0].code,
        "operation": l[0].operation,
        "result": l[0].result,
      } for l in logs]
    }

    return jsonify(result), 200

  @admin_required()
  def put(self, id):
    v = Validator({
      'name': {'type': 'string', 'required': True},
      'type': {'type': 'string', 'required': True, 'allowed': ['gatekeeper', 'generic']},
      'controller_ip': {'type': 'string', 'required': True},
      'uri_open': {'type': 'string', 'required': True},
      'uri_close': {'type': 'string', 'required': True},
      'camera_uri': {'type': 'string', 'required': True},
      'http_trigger': {'type': 'string', 'required': True},
    })

    if not v.validate(request.json):
      return jsonify({'message': 'Input validation failed'}), 400

    gate = Gate.query.filter(Gate.id == id).first_or_404()
    gate.name = request.json['name']
    gate.type = request.json['type']
    gate.controller_ip = request.json['controller_ip']
    gate.uri_open = request.json['uri_open']
    gate.uri_close = request.json['uri_close']
    gate.camera_uri = request.json['camera_uri']
    gate.http_trigger = request.json['http_trigger']
    db.session.commit()

    # Send update config command to streaming service
    streams.update_config()

    return jsonify({'message': 'Successful'}), 200

  @admin_required()
  def delete(self, id):
    gate = Gate.query.filter(Gate.id == id).first_or_404()
    gate.is_deleted = True
    db.session.commit()

    # Send update config command to streaming service
    streams.update_config()

    return jsonify({'message': 'Successful'}), 200


class GateCommandView(MethodView):
  @jwt_required()
  def post(self, id):
    """
    Send a command to open or close the gate.
    """
    v = Validator({
      'command': {'type': 'string', 'required': True, 'allowed': ['open', 'close']},
    })

    if not v.validate(request.json):
      return jsonify({'message': 'Input validation failed'}), 400

    claims = get_jwt()
    user = User.query.filter(User.email == claims['email']).first_or_404()
    gate = Gate.query.filter(Gate.id == id).first_or_404()

    # TODO: Send command and make a log record
    log = Log(gate=gate.id, result=True, operation=request.json.get('command'), type='web', user=user.id)

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

    # Tell controller to open gate
    try:
      controllers.send_command(gate, request.json.get('command'))
    except:
      logger.error("Could not get controller to open gate {} (id: {})".format(gate.name, gate.id))

    db.session.add(log)
    db.session.commit()

    emails.register_alerts(log)

    return jsonify({'message': 'Successful'}), 200


class GateButtonView(MethodView):
  @admin_required()
  def post(self, id):
    """
    Update the button configuration of a gate. Button can be always enabled/disabled or timer controlled.
    """
    v = Validator({
      'type': {'type': 'string', 'required': True, 'allowed': ['enabled', 'disabled', 'timer']},
      'start_hour': {'type': 'string', 'required': True},
      'end_hour': {'type': 'string', 'required': True},
    })

    if not v.validate(request.json):
      return jsonify({'message': 'Input validation failed'}), 400

    gate = Gate.query.filter(Gate.id == id).first_or_404()
    gate.button_type = request.json['type']
    gate.button_start_hour = request.json['start_hour']
    gate.button_end_hour = request.json['end_hour']
    db.session.commit()

    return jsonify({'message': 'Successful'}), 200


gate_bp.add_url_rule('/gate', view_func=GatesView.as_view('gates'))
gate_bp.add_url_rule('/gate/<id>', view_func=GateDetailsView.as_view('gate_details'))
gate_bp.add_url_rule('/gate/<id>/command', view_func=GateCommandView.as_view('gate_command'))
gate_bp.add_url_rule('/gate/<id>/button', view_func=GateButtonView.as_view('gate_button'))

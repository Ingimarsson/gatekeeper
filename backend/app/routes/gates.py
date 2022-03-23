import string
import secrets
import requests

from flask import Blueprint, jsonify, request
from flask.views import MethodView
from flask_jwt_extended import jwt_required, get_jwt
from sqlalchemy import func
from cerberus import Validator
from datetime import timedelta, datetime

from app import db, streams, access, logger
from app.utils import admin_required
from app.models import Gate, Log, User, ControllerStatus

gate_bp = Blueprint('gate_bp', __name__)

class GatesView(MethodView):
  @jwt_required()
  def get(self):
    gates = Gate.query.filter(Gate.is_deleted == False).order_by(Gate.id).all()

    result = [{
      'id': g.id,
      'name': g.name,
      'buttonStatus': g.button_type,
      'controllerStatus': 'offline',
      'cameraStatus': 'not-setup',
      'cameraGeneral': g.camera_general,
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
        if s['id'] == r['cameraGeneral']:
          result[idx]['latestImage'] = s['latest_image']
          result[idx]['cameraStatus'] = 'online' if s['is_alive'] else 'offline'

    return jsonify(result), 200

  @admin_required()
  def post(self):
    v = Validator({
      'name': {'type': 'string', 'required': True},
      'type': {'type': 'string', 'required': True, 'allowed': ['gatekeeper', 'generic']},
      'controllerIP': {'type': 'string', 'required': True},
      'uriOpen': {'type': 'string', 'required': True},
      'uriClose': {'type': 'string', 'required': True},
      'cameraUri': {'type': 'string', 'required': True},
      'httpTrigger': {'type': 'string', 'required': True},
    })

    if not v.validate(request.json):
      return jsonify({'message': 'Input validation failed', 'errors': v.errors}), 400

    alphabet = string.ascii_letters + string.digits
    token = ''.join(secrets.choice(alphabet) for i in range(8))

    gate = Gate(
      name = request.json['name'],
      type = request.json['type'],
      controller_ip = request.json['controllerIP'],
      uri_open = request.json['uriOpen'],
      uri_close = request.json['uriClose'],
      camera_uri = request.json['cameraUri'],
      http_trigger = request.json['httpTrigger'],
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
      .filter(Log.is_deleted == False, Gate.id == id) \
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
      if s['id'] == gate.camera_general:
          latest_image = s['latest_image']
          stream_status = 'online' if s['is_alive'] else 'offline'

    # We only show sensitive information to admins
    claims = get_jwt()
    is_admin = claims['is_admin']

    result = {
      "id": gate.id,
      "name": gate.name,
      "latestImage": latest_image,
      "cameraStatus": stream_status,
      "controllerStatus": controller_status,
      'supportsOpen': gate.type == 'gatekeeper' or gate.uri_open != '',
      'supportsClose': gate.type == 'gatekeeper' or gate.uri_close != '',
      'cameraGeneral': gate.camera_general,
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
        "code": l[0].code if is_admin or l[0].type == "plate" else None,
        "operation": l[0].operation,
        "result": l[0].result,
        "reason": l[0].reason,
      } for l in logs],
      "settings": {
        'name': gate.name,
        'type': gate.type,
        'controllerIP': gate.controller_ip,
        'uriOpen': gate.uri_open,
        'uriClose': gate.uri_close,
        'httpTrigger': gate.http_trigger
      }
    }

    return jsonify(result), 200

  @admin_required()
  def put(self, id):
    v = Validator({
      'name': {'type': 'string', 'required': True},
      'type': {'type': 'string', 'required': True, 'allowed': ['gatekeeper', 'generic']},
      'controllerIP': {'type': 'string', 'required': True},
      'uriOpen': {'type': 'string', 'required': True},
      'uriClose': {'type': 'string', 'required': True},
      'cameraUri': {'type': 'string', 'required': True},
      'httpTrigger': {'type': 'string', 'required': True},
    })

    if not v.validate(request.json):
      return jsonify({'message': 'Input validation failed', 'errors': v.errors}), 400

    gate = Gate.query.filter(Gate.id == id).first_or_404()
    gate.name = request.json['name']
    gate.type = request.json['type']
    gate.controller_ip = request.json['controllerIP']
    gate.uri_open = request.json['uriOpen']
    gate.uri_close = request.json['uriClose']
    gate.camera_uri = request.json['cameraUri']
    gate.http_trigger = request.json['httpTrigger']
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

    result = access.handle_web_request(
      gate_id=gate.id,
      user_id=user.id,
      command=request.json.get('command')
    )

    if result:
      return jsonify({'message': 'Successful'}), 200
    else:
      return jsonify({'message': 'Could not send command'}), 400


class GateButtonView(MethodView):
  @admin_required()
  def post(self, id):
    """
    Update the button configuration of a gate. Button can be always enabled/disabled or timer controlled.
    """
    v = Validator({
      'type': {'type': 'string', 'required': True, 'allowed': ['enabled', 'disabled', 'timer']},
      'startHour': {'type': 'string', 'required': True},
      'endHour': {'type': 'string', 'required': True},
    })

    if not v.validate(request.json):
      return jsonify({'message': 'Input validation failed'}), 400

    gate = Gate.query.filter(Gate.id == id).first_or_404()
    gate.button_type = request.json['type']
    gate.button_start_hour = request.json['startHour']
    gate.button_end_hour = request.json['endHour']
    db.session.commit()

    return jsonify({'message': 'Successful'}), 200


gate_bp.add_url_rule('/gate', view_func=GatesView.as_view('gates'))
gate_bp.add_url_rule('/gate/<id>', view_func=GateDetailsView.as_view('gate_details'))
gate_bp.add_url_rule('/gate/<id>/command', view_func=GateCommandView.as_view('gate_command'))
gate_bp.add_url_rule('/gate/<id>/button', view_func=GateButtonView.as_view('gate_button'))

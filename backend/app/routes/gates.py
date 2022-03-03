import string
import secrets

from flask import Blueprint, jsonify, request
from flask.views import MethodView
from flask_jwt_extended import jwt_required
from cerberus import Validator

from app import db
from app.utils import admin_required
from app.models import Gate, Log, User

gate_bp = Blueprint('gate_bp', __name__)

class GatesView(MethodView):
  @jwt_required()
  def get(self):
    gates = Gate.query.all()

    # TODO: Join with status tables to get online/offline
    # TODO: Make call to streaming service to return latest images

    result = [{
      'id': g.id,
      'name': g.name
    } for g in gates]

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

    # TODO: Send update config command to streaming service

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

    result = {
      "id": gate.id,
      "name": gate.name,
      "logs": [{
        "id": l[0].id,
        "timestamp": l[0].timestamp,
        "gate": l[1],
        "user": l[2],
        "type": l[0].type,
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

    gate = Gate.query.filter(id=id).first_or_404()
    gate.name = request.json['name']
    gate.type = request.json['type']
    gate.controller_ip = request.json['controller_ip']
    gate.uri_open = request.json['uri_open']
    gate.uri_close = request.json['uri_close']
    gate.camera_uri = request.json['camera_uri']
    gate.http_trigger = request.json['http_trigger']
    db.session.commit()

    # TODO: Send update config command to streaming service

    return jsonify({'message': 'Successful'}), 200

  @admin_required()
  def delete(self, id):
    gate = Gate.query.filter(id=id).first_or_404()
    gate.is_deleted = is_deleted
    db.session.commit()

    # TODO: Send update config command to streaming service

    return jsonify({'message': 'Successful'}), 200


class GateCommandView(MethodView):
  def post(self, id):
    """
    Send a command to open or close the gate.
    """
    v = Validator({
      'command': {'type': 'string', 'required': True, 'allowed': ['open', 'close']},
    })

    if not v.validate(request.json):
      return jsonify({'message': 'Input validation failed'}), 400

    gate = Gate.query.filter(id=id).first_or_404()

    # TODO: Send command and make a log record

    return jsonify({'message': 'Successful'}), 200


class GateButtonView(MethodView):
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

    gate = Gate.query.filter(id=id).first_or_404()
    gate.button_type = request.json['type']
    gate.button_start_hour = request.json['start_hour']
    gate.button_end_hour = request.json['end_hour']
    db.session.commit()

    return jsonify({'message': 'Successful'}), 200


gate_bp.add_url_rule('/gate', view_func=GatesView.as_view('gates'))
gate_bp.add_url_rule('/gate/<id>', view_func=GateDetailsView.as_view('gate_details'))
gate_bp.add_url_rule('/gate/<id>/command', view_func=GateCommandView.as_view('gate_command'))
gate_bp.add_url_rule('/gate/<id>/button', view_func=GateButtonView.as_view('gate_button'))

from flask import Blueprint, jsonify, request
from flask.views import MethodView

from flask_jwt_extended import jwt_required, get_jwt
from sqlalchemy.orm import aliased
from cerberus import Validator

from app import db
from app.utils import admin_required
from app.models import Alert, User, Gate

alert_bp = Blueprint('alert_bp', __name__)

class AlertsView(MethodView):
  @jwt_required()
  def get(self):
    claims = get_jwt()
    user_email = claims['email']

    Owner = aliased(User)

    alerts = Alert.query \
      .join(Owner, Alert.owner == Owner.id) \
      .outerjoin(User, Alert.user == User.id) \
      .outerjoin(Gate) \
      .add_columns(Gate.id, Gate.name, User.id, User.name) \
      .filter(Owner.email == user_email, Alert.is_deleted == False).all()

    result = [{
      "id": a[0].id,
      "name": a[0].name,
      "gateId": a[1],
      "gate": a[2],
      "userId": a[3],
      "user": a[4],
      "type": a[0].type,
      "code": a[0].code,
      "timeLimits": a[0].time_limits,
      "startHour": a[0].start_hour,
      "endHour": a[0].end_hour,
      "failedAttempts": a[0].failed_attempts,
      "enabled": a[0].is_enabled
    } for a in alerts]

    return jsonify(result), 200

  @jwt_required()
  def post(self):
    v = Validator({
      'name': {'type': 'string', 'required': True, 'nullable': True},
      'gateId': {'type': 'integer', 'required': True, 'nullable': True},
      'userId': {'type': 'integer', 'required': True, 'nullable': True},
      'type': {'type': 'string', 'required': True, 'nullable': True},
      'code': {'type': 'string', 'required': True, 'nullable': True},
      'timeLimits': {'type': 'boolean', 'required': True},
      'startHour': {'type': 'string', 'required': True},
      'endHour': {'type': 'string', 'required': True},
      'failedAttempts': {'type': 'boolean', 'required': True},
      'enabled': {'type': 'boolean', 'required': True},
    })

    if not v.validate(request.json):
      return jsonify({'message': 'Input validation failed', 'errors': v.errors}), 400

    claims = get_jwt()
    user_email = claims['email']

    user = User.query.filter(User.email == user_email).first()

    alert = Alert(
      owner=user.id,
      name=request.json['name'],
      gate=request.json['gateId'],
      user=request.json['userId'],
      type=request.json['type'],
      code=request.json['code'],
      time_limits=request.json['timeLimits'],
      start_hour=request.json['startHour'],
      end_hour=request.json['endHour'],
      failed_attempts=request.json['failedAttempts'],
      is_enabled=request.json['enabled'],
    )

    db.session.add(alert)
    db.session.commit()

    return jsonify({'message': 'Successful'}), 200


class AlertDetailsView(MethodView):
  @jwt_required()
  def put(self, id):
    v = Validator({
      'name': {'type': 'string', 'required': True, 'nullable': True},
      'gateId': {'type': 'integer', 'required': True, 'nullable': True},
      'userId': {'type': 'integer', 'required': True, 'nullable': True},
      'type': {'type': 'string', 'required': True, 'nullable': True},
      'code': {'type': 'string', 'required': True, 'nullable': True},
      'timeLimits': {'type': 'boolean', 'required': True},
      'startHour': {'type': 'string', 'required': True},
      'endHour': {'type': 'string', 'required': True},
      'failedAttempts': {'type': 'boolean', 'required': True},
      'enabled': {'type': 'boolean', 'required': True},
    })

    if not v.validate(request.json):
      return jsonify({'message': 'Input validation failed', 'errors': v.errors}), 400

    claims = get_jwt()
    user_email = claims['email']

    user = User.query.filter(User.email == user_email).first()
    alert = Alert.query.filter(Alert.owner == user.id, Alert.id == id).first_or_404()

    alert.name = request.json['name']
    alert.gate = request.json['gateId']
    alert.user = request.json['userId']
    alert.type = request.json['type']
    alert.code = request.json['code']
    alert.time_limits = request.json['timeLimits']
    alert.start_hour = request.json['startHour']
    alert.end_hour = request.json['endHour']
    alert.failed_attempts = request.json['failedAttempts']
    alert.is_enabled = request.json['enabled']

    db.session.commit()

    return jsonify({'message': 'Successful'}), 200

  @jwt_required()
  def delete(self, id):
    claims = get_jwt()
    user_email = claims['email']

    user = User.query.filter(User.email == user_email).first()
    alert = Alert.query.filter(Alert.owner == user.id, Alert.id == id).first_or_404()

    alert.is_deleted = True

    db.session.commit()

    return jsonify({'message': 'Successful'}), 200

alert_bp.add_url_rule('/alert', view_func=AlertsView.as_view('alerts'))
alert_bp.add_url_rule('/alert/<id>', view_func=AlertDetailsView.as_view('alert_details'))
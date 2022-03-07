from flask import Blueprint, jsonify, request
from flask.views import MethodView

from flask_jwt_extended import jwt_required, get_jwt
from cerberus import Validator

from app import db, logger
from app.utils import admin_required
from app.models import User, Method, Gate, Log

log_bp = Blueprint('log_bp', __name__)

class LogsView(MethodView):
  @jwt_required()
  def get(self):
    gate = request.args.get('gate')
    user = request.args.get('user')
    search = request.args.get('search')
    type = request.args.get('type')
    start_at = request.args.get('start_at')
    show_failed = request.args.get('show_failed')

    query = Log.query

    if gate:
      query = query.filter(Log.gate == gate)
    if user:
      query = query.filter(Log.user == user)
    if search:
      query = query.filter(Log.type == 'plate', Log.code.ilike(f'%{search}%'))
    if type:
      query = query.filter(Log.type == type)
    if start_at:
      query = query.filter(Log.id <= start_at)
    if not show_failed:
      query = query.filter(Log.result == True)

    logs = query.outerjoin(Gate, Log.gate == Gate.id) \
      .outerjoin(User, Log.user == User.id) \
      .order_by(Log.id.desc()) \
      .filter(Log.is_deleted == False) \
      .limit(50) \
      .add_columns(Gate.name, User.name) \
      .all()

    result = [{
      "id": l[0].id,
      "timestamp": l[0].timestamp.isoformat(),
      "gate": l[1],
      "user": l[2],
      "type": l[0].type,
      "code": l[0].code,
      "operation": l[0].operation,
      "result": l[0].result,
    } for l in logs]

    return jsonify(result), 200


class LogDetailsView(MethodView):
  @jwt_required()
  def get(self, id):
    log = Log.query \
      .outerjoin(Gate, Log.gate == Gate.id) \
      .outerjoin(User, Log.user == User.id) \
      .filter(Log.id == id) \
      .add_columns(Gate.name, User.name) \
      .first_or_404()

    result = {
      "timestamp": log[0].timestamp.isoformat(),
      "gate": log[1],
      "user": log[2],
      "type": log[0].type,
      "code": log[0].code,
      "operation": log[0].operation,
      "result": log[0].result,
      "image": log[0].image,
      "first_image": log[0].first_image,
      "last_image": log[0].last_image,
    }

    return jsonify(result), 200

  @admin_required()
  def delete(self, id):
    log = Log.query.filter(Log.id == id).first_or_404()
    log.is_deleted = True
    db.session.commit()

    return jsonify({'message': 'Successful'}), 200

log_bp.add_url_rule('/log', view_func=LogsView.as_view('logs'))
log_bp.add_url_rule('/log/<id>', view_func=LogDetailsView.as_view('log_details'))
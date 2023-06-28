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
    limit = request.args.get('limit')
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
    if not show_failed == 'true':
      query = query.filter(Log.result == True)

    limit = int(limit) if limit else 50

    logs = query.outerjoin(Gate, Log.gate == Gate.id) \
      .outerjoin(User, Log.user == User.id) \
      .outerjoin(Method, Log.method == Method.id) \
      .order_by(Log.id.desc()) \
      .filter(Log.is_deleted == False) \
      .limit(limit) \
      .add_columns(Gate.name, User.name, Gate.camera_general, Method.comment) \
      .all()

    # We only show sensitive information to admins
    claims = get_jwt()
    is_admin = claims['is_admin']

    result = [{
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
      "image": l[0].image,
      "alprImage": l[0].alpr_image,
      "cameraGeneral": l[3],
      "methodComment": l[4],
    } for l in logs]

    return jsonify(result), 200


class LogDetailsView(MethodView):
  @jwt_required()
  def get(self, id):
    log = Log.query \
      .outerjoin(Gate, Log.gate == Gate.id) \
      .outerjoin(User, Log.user == User.id) \
      .outerjoin(Method, Log.method == Method.id) \
      .filter(Log.id == id) \
      .add_columns(Gate.name, User.name, Gate.camera_general, Method.start_date, Method.end_date, Method.comment, Method.data, Gate.camera_alpr) \
      .first_or_404()

    # We only show sensitive information to admins
    claims = get_jwt()
    is_admin = claims['is_admin']

    result = {
      "timestamp": log[0].timestamp.isoformat(),
      "gate": log[1],
      "gateId": log[0].gate,
      "user": log[2],
      "type": log[0].type,
      "typeLabel": log[0].type_label,
      "code": log[0].code if is_admin or log[0].type == "plate" else None,
      "operation": log[0].operation,
      "result": log[0].result,
      "reason": log[0].reason,
      "image": log[0].image,
      "firstImage": log[0].first_image,
      "lastImage": log[0].last_image,
      "alprImage": log[0].alpr_image,
      "cameraGeneral": log[3],
      "cameraAlpr": log[8],
      "method": {
        "startDate": log[4],
        "endDate": log[5],
        "comment": log[6],
        "data": log[7],
      }
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
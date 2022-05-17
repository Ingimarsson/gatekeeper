from flask import Blueprint, jsonify, request
from flask.views import MethodView

from flask_jwt_extended import jwt_required, get_jwt
from cerberus import Validator

from app import db, logger
from app.utils import admin_required
from app.models import User, Method, Gate, Log

user_bp = Blueprint('user_bp', __name__)

class UsersView(MethodView):
  @jwt_required()
  def get(self):
    users = User.query.filter(User.is_deleted == False).order_by(User.id).all()

    result = [{
      "id": u.id,
      "name": u.name,
      "username": u.username,
      "email": u.email,
      "language": u.language,
      "admin": u.is_admin,
      "webAccess": u.has_web_access,
      "enabled": u.is_enabled
    } for u in users]

    return jsonify(result), 200

  @admin_required()
  def post(self):
    v = Validator({
      'name': {'type': 'string', 'required': True},
      'username': {'type': 'string', 'required': True},
      'email': {'type': 'string', 'required': True},
      'password': {'type': 'string', 'required': True},
      'webAccess': {'type': 'boolean', 'required': True},
      'admin': {'type': 'boolean', 'required': True},
      'enabled': {'type': 'boolean', 'required': True},
    })

    if not v.validate(request.json):
      return jsonify({'message': 'Input validation failed', 'errors': v.errors}), 400

    user = User(
      name=request.json['name'],
      username=request.json['username'],
      email=request.json['email'],
      has_web_access=request.json['webAccess'],
      is_admin=request.json['admin'],
      is_enabled=request.json['enabled'],
    )

    if request.json['webAccess']:
      user.set_password(request.json['password'])
    else:
      user.password = ""

    db.session.add(user)
    db.session.commit()

    logger.info("Added user {} (ID: {})".format(user.username, user.id))

    return jsonify({'message': 'Successful'}), 200


class UserDetailsView(MethodView):
  @jwt_required()
  def get(self, id):
    user = User.query.filter(User.id == id).first_or_404()
    methods = Method.query.join(User) \
      .outerjoin(Gate) \
      .filter(User.id == id, Method.is_deleted == False) \
      .order_by(Method.id) \
      .add_columns(Gate.name) \
      .all()
    logs = Log.query.outerjoin(Gate, Log.gate == Gate.id) \
      .outerjoin(User, Log.user == User.id) \
      .order_by(Log.id.desc()) \
      .filter(Log.result == True, Log.is_deleted == False, User.id == id) \
      .limit(10) \
      .add_columns(Gate.name, User.name, Gate.camera_general) \
      .all()

    # We only show sensitive information to admins
    claims = get_jwt()
    is_admin = claims['is_admin']

    result = {
      "user": {
        "id": user.id,
        "name": user.name,
        "username": user.username,
        "email": user.email,
        "language": user.language,
        "webAccess": user.has_web_access,
        "admin": user.is_admin,
        "enabled": user.is_enabled
      },
      "methods": [{
        "id": m[0].id,
        "type": m[0].type,
        "gate": m[1],
        "gateId": m[0].gate,
        "code": m[0].code if is_admin or m[0].type == "plate" else None,
        "startDate": m[0].start_date.isoformat() if m[0].start_date else None,
        "endDate": m[0].end_date.isoformat() if m[0].end_date else None,
        "startHour": m[0].start_hour,
        "endHour": m[0].end_hour,
        "comment": m[0].comment,
        "enabled": m[0].is_enabled,
      } for m in methods],
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
        "image": l[0].image,
        "cameraGeneral": l[3],
      } for l in logs]
    }

    return jsonify(result), 200

  @admin_required()
  def put(self, id):
    v = Validator({
      'name': {'type': 'string', 'required': True},
      'username': {'type': 'string', 'required': True},
      'email': {'type': 'string', 'required': True},
      'webAccess': {'type': 'boolean', 'required': True},
      'admin': {'type': 'boolean', 'required': True},
      'enabled': {'type': 'boolean', 'required': True},
    })

    if not v.validate(request.json):
      return jsonify({'message': 'Input validation failed', 'errors': v.errors}), 400

    user = User.query.filter(User.id == id).first_or_404()

    user.name = request.json['name']
    user.username = request.json['username']
    user.email = request.json['email']
    user.has_web_access = request.json['webAccess']
    user.is_admin = request.json['admin']
    user.is_enabled = request.json['enabled']

    db.session.commit()

    return jsonify({'message': 'Successful'}), 200

  @admin_required()
  def delete(self, id):
    user = User.query.filter(User.id == id).first_or_404()
    user.is_deleted = True
    db.session.commit()

    logger.info("Deleted user {} (ID: {})".format(user.username, user.id))

    return jsonify({'message': 'Successful'}), 200


class UserPasswordView(MethodView):
  @admin_required()
  def post(self, id):
    v = Validator({
      'password': {'type': 'string', 'required': True}
    })

    if not v.validate(request.json):
      return jsonify({'message': 'Input validation failed', 'errors': v.errors}), 400

    user = User.query.filter(User.id == id).first_or_404()
    user.set_password(request.json['password'])
    db.session.commit()

    logger.info("Changed password for user {} (ID: {})".format(user.username, request.json['password']))

    return jsonify({'message': 'Successful'}), 200


class UserLanguageView(MethodView):
  @jwt_required()
  def post(self):
    v = Validator({
      'language': {'type': 'string', 'required': True, 'allowed': ['en', 'is']}
    })

    if not v.validate(request.json):
      return jsonify({'message': 'Input validation failed', 'errors': v.errors}), 400

    claims = get_jwt()
    user_email = claims['email']

    user = User.query.filter(User.email == user_email).first_or_404()
    user.language = request.json['language']
    db.session.commit()

    logger.info("Changed language for user {} (lang: {})".format(user.username, user.language))

    return jsonify({'message': 'Successful'}), 200


class UserMethodsView(MethodView):
  @admin_required()
  def post(self, id):
    v = Validator({
      'type': {'type': 'string', 'required': True, 'allowed': ['keypad-pin', 'keypad-card', 'keypad-both', 'plate']},
      'code': {'type': 'string', 'required': True},
      'gate': {'type': 'number', 'required': True, 'nullable': True},
      'startDate': {'type': 'string', 'required': True, 'nullable': True},
      'endDate': {'type': 'string', 'required': True, 'nullable': True},
      'startHour': {'type': 'string', 'required': True, 'nullable': True},
      'endHour': {'type': 'string', 'required': True, 'nullable': True},
      'comment': {'type': 'string', 'required': True},
      'enabled': {'type': 'boolean', 'required': True},
      'forceAdd': {'type': 'boolean', 'required': False},
    })

    if not v.validate(request.json):
      return jsonify({'message': 'Input validation failed', 'errors': v.errors}), 400

    user = User.query.filter(User.id == id).first_or_404()

    # Remove old codes if force adding
    if request.json.get('forceAdd', False):
      deleted_count = Method.query.filter(Method.code == request.json['code'], Method.type == request.json['type'], Method.is_deleted == False).update({'is_deleted': True})
      db.session.commit()
      if deleted_count > 0:
        logger.info("Deleted {} methods while force-adding method.".format(deleted_count))

    # Return an error if the code already exists
    existing_methods = Method.query.filter(Method.code == request.json['code'], Method.type == request.json['type'], Method.is_deleted == False).count()
    if existing_methods > 0:
      return jsonify({'message': 'A method with this type and code already exists.'}), 400

    method = Method(
      user=id,
      type=request.json['type'],
      code=request.json['code'],
      gate=request.json['gate'],
      start_date=request.json['startDate'],
      end_date=request.json['endDate'],
      start_hour=request.json['startHour'],
      end_hour=request.json['endHour'],
      comment=request.json['comment'],
      is_enabled=request.json['enabled'],
    )

    db.session.add(method)
    db.session.commit()

    logger.info("Added method (type: {}) for user {} (ID: {})".format(method.type, user.username, user.id))

    return jsonify({
      'message': 'Successful',
      'method_id': method.id,
    }), 200


class UserMethodDetailsView(MethodView):
  @admin_required()
  def put(self, id):
    v = Validator({
      'type': {'type': 'string', 'required': True, 'allowed': ['keypad-pin', 'keypad-card', 'keypad-both', 'plate']},
      'code': {'type': 'string', 'required': True},
      'gate': {'type': 'number', 'required': True, 'nullable': True},
      'startDate': {'type': 'string', 'required': True, 'nullable': True},
      'endDate': {'type': 'string', 'required': True, 'nullable': True},
      'startHour': {'type': 'string', 'required': True, 'nullable': True},
      'endHour': {'type': 'string', 'required': True, 'nullable': True},
      'comment': {'type': 'string', 'required': True},
      'enabled': {'type': 'boolean', 'required': True},
    })

    if not v.validate(request.json):
      return jsonify({'message': 'Input validation failed', 'errors': v.errors}), 400

    method = Method.query.filter(Method.id == id).first_or_404()

    # Return an error if the code already exists
    existing_methods = Method.query.filter(Method.code == request.json['code'], Method.type == request.json['type'], Method.id != method.id, Method.is_deleted == False).count()
    if existing_methods > 0:
      return jsonify({'message': 'A method with this type and code already exists.'}), 400

    method.type = request.json['type']
    method.code = request.json['code']
    method.gate = request.json['gate']
    method.start_date = request.json['startDate']
    method.end_date = request.json['endDate']
    method.start_hour = request.json['startHour']
    method.end_hour = request.json['endHour']
    method.comment = request.json['comment']
    method.is_enabled = request.json['enabled']

    db.session.commit()

    return jsonify({'message': 'Successful'}), 200

  @admin_required()
  def delete(self, id):
    method = Method.query.filter(Method.id == id).first_or_404()
    method.is_deleted = True
    db.session.commit()

    return jsonify({'message': 'Successful'}), 200

user_bp.add_url_rule('/user', view_func=UsersView.as_view('users'))
user_bp.add_url_rule('/user/<id>', view_func=UserDetailsView.as_view('user_details'))
user_bp.add_url_rule('/user/<id>/method', view_func=UserMethodsView.as_view('user_methods'))
user_bp.add_url_rule('/user/<id>/password', view_func=UserPasswordView.as_view('user_password'))
user_bp.add_url_rule('/user/language', view_func=UserLanguageView.as_view('user_language'))
user_bp.add_url_rule('/user/method/<id>', view_func=UserMethodDetailsView.as_view('user_method_details'))

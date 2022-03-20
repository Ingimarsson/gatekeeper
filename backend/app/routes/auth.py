from flask import Blueprint, jsonify, request
from flask.views import MethodView

from flask_jwt_extended import create_access_token, get_jwt, jwt_required
from cerberus import Validator

from app import logger
from app.models import User

auth_bp = Blueprint('auth_bp', __name__)

class LoginView(MethodView):
  def post(self):
    v = Validator({
      'email': {'type': 'string', 'required': True}, 
      'password': {'type': 'string', 'required': True}
    })

    if not v.validate(request.json):
      return jsonify({'message': 'Input validation failed'}), 400

    user = User.query.filter_by(email=request.json['email']).first()

    if not user or \
           not user.verify_password(request.json['password']) or \
           not user.is_enabled or \
           user.is_deleted or \
           not user.has_web_access:
      logger.info("Failed authentication attempt for {}".format(request.json['email']))

      return jsonify({'message': 'Invalid email or password'}), 400

    logger.info("Successful authentication attempt for {}".format(user.email))

    token = create_access_token(
      "user", additional_claims={
        "name": user.name,
        "email": user.email,
        "is_admin": user.is_admin,
      }
    )

    return jsonify({"token": token, "name": user.name, "email": user.email}), 200

class UserView(MethodView):
  @jwt_required()
  def get(self):
    claims = get_jwt()

    return {
      "name": claims['name'],
      "email": claims['email'],
      "is_admin": claims['is_admin']
    }, 200

auth_bp.add_url_rule('/auth/login', view_func=LoginView.as_view('login'))
auth_bp.add_url_rule('/auth/user', view_func=UserView.as_view('user'))

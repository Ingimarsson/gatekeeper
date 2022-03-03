from flask import Blueprint, jsonify, request
from flask.views import MethodView

from flask_jwt_extended import jwt_required, get_jwt
from cerberus import Validator

from app import db
from app.utils import admin_required
from app.models import Alert, User

alert_bp = Blueprint('alert_bp', __name__)

class AlertsView(MethodView):
  @jwt_required
  def get(self):
    claims = get_jwt()
    user_email = claims['email']

    alerts = Alert.query.join(User).filter(User.email = email).all()

    result = [{
      "name": a.name,
    } for a in alerts]

    return jsonify([]), 200

  @jwt_required
  def post(self):
    return jsonify({'message': 'Successful'}), 200

class AlertDetailsView(MethodView):
  @jwt_required
  def get(self):
    return "ok"

  @jwt_required
  def put(self):
    return jsonify({'message': 'Successful'}), 200

  @jwt_required
  def delete(self):
    return jsonify({'message': 'Successful'}), 200

alert_bp.add_url_rule('/alert', view_func=AlertsView.as_view('alerts'))
alert_bp.add_url_rule('/alert/<id>', view_func=AlertDetailsView.as_view('alert_details'))
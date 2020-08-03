from app.models import User
from app import db

from flask import Blueprint, jsonify, abort, request
from flask.views import MethodView
from flask_login import login_user, logout_user, login_required, current_user

auth_bp = Blueprint('auth_bp', __name__)

class LoginView(MethodView):
  def post(self):
    #try:
    content = request.get_json()

    user = User.query.filter_by(username=content.get('username')).first()

    if user and user.verify_password(content.get('password')):
      login_user(user)

      response = {
        'message': 'Logged in successfully.'
      }
      return jsonify(response), 200

    else:
      response = {
        'message': 'Invalid username or password.'
      }
      return jsonify(response), 401

    #except:
    #  abort(400)


class LogoutView(MethodView):
  def get(self):
    try:
      logout_user()
      
      response = {
        'message': 'Logged out successfully.'
      }
      return jsonify(response), 200

    except:
      abort(400)

class UserView(MethodView):
  @login_required
  def get(self):
    userid = current_user.id

    user = User.query.filter(User.id==userid).first_or_404()

    response = {
      'username': user.username,
      'full_name': user.full_name,
      'is_admin': user.is_admin
    }

    return jsonify(response), 200

auth_bp.add_url_rule('/auth/login', view_func=LoginView.as_view('login'))
auth_bp.add_url_rule('/auth/logout', view_func=LogoutView.as_view('logout'))
auth_bp.add_url_rule('/auth/user', view_func=UserView.as_view('user'))

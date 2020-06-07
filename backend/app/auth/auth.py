from app.models import User
from app import db

from flask import Blueprint, jsonify, abort
from flask.views import MethodView
from flask_login import login_user, logout_user

auth_bp = Blueprint('auth_bp', __name__)

class LoginView(MethodView):
  def post(self):
    try:
      user = User.query.filter_by(username=request.json['username']).first()

      if user and user.verify_password(request.json['password']):
        login_user(user)

        user.is_authenticated = True
        db.session.commit()
        
        response = {
          'message': 'Logged in successfully.'
        }
        return make_response(jsonify(response)), 200

      else:
        response = {
          'message': 'Invalid username or password.'
        }
        return make_response(jsonify(response)), 401

    except:
      abort(400)


class LogoutView(MethodView):
  def get(self):
    try:
      logout_user()
      
      response = {
        'message': 'Logged out successfully.'
      }
      return make_response(jsonify(response)), 200

    except:
      abort(400)


auth_bp.add_url_rule('/auth/login', view_func=LoginView.as_view('login'))
auth_bp.add_url_rule('/auth/logout', view_func=LogoutView.as_view('logout'))

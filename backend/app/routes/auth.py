from flask import Blueprint
from flask.views import MethodView

auth_bp = Blueprint('auth_bp', __name__)

class LoginView(MethodView):
  def post(self):
    return "ok"

class UserView(MethodView):
  def get(self):
    return "ok"

auth_bp.add_url_rule('/auth/login', view_func=LoginView.as_view('login'))
auth_bp.add_url_rule('/auth/user', view_func=UserView.as_view('user'))
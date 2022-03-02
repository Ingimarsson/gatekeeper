from flask import Blueprint
from flask.views import MethodView

user_bp = Blueprint('user_bp', __name__)

class UsersView(MethodView):
  def get(self):
    return "ok"

  def post(self):
    return "ok"

class UserDetailsView(MethodView):
  def get(self):
    return "ok"

  def put(self):
    return "ok"

  def delete(self):
    return "ok"

class UserPasswordView(MethodView):
  def post(self):
    return "ok"

class UserMethodsView(MethodView):
  def get(self):
    return "ok"

  def post(self):
    return "ok"

class UserMethodDetailsView(MethodView):
  def get(self):
    return "ok"

  def put(self):
    return "ok"

  def delete(self):
    return "ok"

user_bp.add_url_rule('/user', view_func=UsersView.as_view('users'))
user_bp.add_url_rule('/user/<id>', view_func=UserDetailsView.as_view('user_details'))
user_bp.add_url_rule('/user/<id>/method', view_func=UserPasswordView.as_view('user_methods'))
user_bp.add_url_rule('/user/<id>/password', view_func=UserMethodsView.as_view('user_password'))
user_bp.add_url_rule('/user/method/<id>', view_func=UserMethodDetailsView.as_view('user_method_details'))

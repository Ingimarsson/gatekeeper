from flask import Blueprint
from flask.views import MethodView

log_bp = Blueprint('log_bp', __name__)

class LogsView(MethodView):
  def get(self):
    return "ok"

class LogDetailsView(MethodView):
  def get(self):
    return "ok"

  def delete(self):
    return "ok"


log_bp.add_url_rule('/logs', view_func=LogsView.as_view('logs'))
log_bp.add_url_rule('/log/<id>', view_func=LogDetailsView.as_view('log_details'))
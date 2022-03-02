from flask import Blueprint
from flask.views import MethodView

alert_bp = Blueprint('alert_bp', __name__)

class AlertsView(MethodView):
  def get(self):
    return "ok"

  def post(self):
    return "ok"

class AlertDetailsView(MethodView):
  def get(self):
    return "ok"

  def put(self):
    return "ok"

  def delete(self):
    return "ok"

alert_bp.add_url_rule('/alert', view_func=AlertsView.as_view('alerts'))
alert_bp.add_url_rule('/alert/<id>', view_func=AlertDetailsView.as_view('alert_details'))
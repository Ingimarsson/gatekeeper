from flask import Blueprint
from flask.views import MethodView

gate_bp = Blueprint('gate_bp', __name__)

class GatesView(MethodView):
  def get(self):
    return "ok"

  def post(self):
    return "ok"

class GateDetailsView(MethodView):
  def get(self):
    return "ok"

  def put(self):
    return "ok"

  def delete(self):
    return "ok"

class GateCommandView(MethodView):
  def put(self):
    return "ok"

class GateButtonView(MethodView):
  def post(self):
    return "ok"


gate_bp.add_url_rule('/gate', view_func=GatesView.as_view('gates'))
gate_bp.add_url_rule('/gate/<id>', view_func=GateDetailsView.as_view('gate_details'))
gate_bp.add_url_rule('/gate/<id>/command', view_func=GateCommandView.as_view('gate_command'))
gate_bp.add_url_rule('/gate/<id>/button', view_func=GateButtonView.as_view('gate_button'))
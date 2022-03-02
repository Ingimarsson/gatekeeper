from flask import Blueprint
from flask.views import MethodView

system_bp = Blueprint('system_bp', __name__)

class SystemView(MethodView):
  def get(self):
    return "ok"

system_bp.add_url_rule('/system', view_func=SystemView.as_view('system'))

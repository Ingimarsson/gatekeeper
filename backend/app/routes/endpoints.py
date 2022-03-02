from flask import Blueprint
from flask.views import MethodView

endpoint_bp = Blueprint('endpoint_bp', __name__)

class GatekeeperView(MethodView):
  def get(self):
    return "ok"

  def post(self):
    return "ok"

class OpenALPRView(MethodView):
  def get(self):
    return "ok"

  def put(self):
    return "ok"

  def delete(self):
    return "ok"

endpoint_bp.add_url_rule('/endpoint/gatekeeper', view_func=GatekeeperView.as_view('gatekeeper'))
endpoint_bp.add_url_rule('/endpoint/openalpr', view_func=OpenALPRView.as_view('openalpr'))
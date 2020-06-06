from flask import Blueprint
from flask.views import MethodView

endpoint_bp = Blueprint('endpoint_bp', __name__)

class EndpointView(MethodView):
    """
    Endpoint for all external access systems (keypads, buttons etc.)
    """
    def post(self):
        return "ok"


endpoint_bp.add_url_rule('/endpoint', view_func=EndpointView.as_view('endpoint'))

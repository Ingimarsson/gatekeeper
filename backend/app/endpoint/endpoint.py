from flask import Blueprint, jsonify, abort, request
from flask.views import MethodView

from app import db, gates
from app.models import Access, Endpoint, Gate, Activity

import requests

endpoint_bp = Blueprint('endpoint_bp', __name__)

class EndpointView(MethodView):
    """
    Endpoint for all external access systems (keypads, buttons etc.)
    """
    def post(self):
        if 'token' not in request.args:
            abort(400)

        token = request.args['token']

        endpoint = Endpoint.query \
            .join(Gate) \
            .filter(Endpoint.token==token) \
            .add_columns(Gate.uri_open) \
            .add_columns(Gate.uri_nvr) \
            .add_columns(Gate.settings) \
            .add_columns(Gate.id) \
            .first_or_404()

        content = request.get_json()

        success = gates.handle_open(endpoint, content)

        if success:
            return jsonify({"response": "success"}), 200

        else:
            return jsonify({"response": "fail"}), 200

endpoint_bp.add_url_rule('/endpoint', view_func=EndpointView.as_view('endpoint'))

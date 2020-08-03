from flask import Blueprint, jsonify, abort, request
from flask.views import MethodView

from flask_login import current_user

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

        return jsonify({"response": "success" if success else "fail"}), 200


class GateCommandView(MethodView):
    """
    Endpoint for gate commands through web UI
    """
    def get(self, gate_id):
        command = request.args['cmd']

        gate = Gate.query.filter(Gate.id == gate_id).first_or_404()

        success = gates.open_gate(gate, current_user.id, command)

        return jsonify({"response": "success" if success else "fail"}), 200


endpoint_bp.add_url_rule('/endpoint', view_func=EndpointView.as_view('endpoint'))
endpoint_bp.add_url_rule('/gate/<gate_id>/command', view_func=GateCommandView.as_view('gate_command'))

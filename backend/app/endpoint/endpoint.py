from flask import Blueprint, jsonify, abort, request
from flask.views import MethodView

from app import db
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
            .first_or_404()

        content = request.get_json()

        code = ''
        # If travel direction is within range
        in_range = True

        if endpoint[0].type == 'openalpr':
            if content.get('data_type') != 'alpr_group':
                abort(400)

            # Getum notað 'travel_direction' í framtíðinni
            direction = content.get('travel_direction') 

            if direction < endpoint[3]['min_dir'] or direction > endpoint[3]['max_dir']:
              in_range = False

            code = content.get('best_plate_number')
            relay = endpoint[3]['sensor_open']

        else:
            code = content.get('code')
            relay = endpoint[1]

        access = Access.query.filter(Access.code==code, Access.endpoint==endpoint[0].id).first()

        a = Activity()
        a.endpoint = endpoint[0].id
        a.code = code

        # TODO: handle valid from/to timestamps
        if access and in_range:
            # Send gate open command
            requests.get(relay, timeout=5)
            a.success = True
            a.access = access.id
            
        # Send NVR trigger
        requests.get(endpoint[2], timeout=5)

        db.session.add(a)
        db.session.commit()

        return jsonify({"response": "success"}), 200

endpoint_bp.add_url_rule('/endpoint', view_func=EndpointView.as_view('endpoint'))

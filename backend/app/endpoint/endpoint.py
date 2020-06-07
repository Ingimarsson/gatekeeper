from flask import Blueprint, jsonify, abort, request
from flask.views import MethodView

from app import db
from app.models import Access, Endpoint, Gate, Activity

import urllib

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
            .first_or_404()

        content = request.get_json()

        code = ''

        if endpoint[0].type == 'openalpr':
            if content.get('data_type') != 'alpr_group':
                abort(400)

            # Getum notað 'travel_direction' í framtíðinni

            code = content.get('best_plate_number')

        else:
            code = content.get('code')

        access = Access.query.filter(Access.code==code, Access.endpoint==endpoint[0].id).first()

        a = Activity()
        a.endpoint = endpoint[0].id
        a.code = code

        # TODO: handle valid from/to timestamps
        if access:
            # Send gate open command
            urllib.request.urlopen(endpoint[1], timeout=5).read()
            a.success = True
            a.access = access.id

        db.session.add(a)
        db.session.commit()

        return jsonify({"response": "success"}), 200

endpoint_bp.add_url_rule('/endpoint', view_func=EndpointView.as_view('endpoint'))

from flask import Blueprint, request, jsonify, abort

from flask.views import MethodView
from flask_login import login_required, current_user

from app import db
from app.models import Gate, Endpoint, Access, Activity

general_bp = Blueprint('general_bp', __name__)

class GatesView(MethodView):
    """
    Get all the gates
    """
    @login_required
    def get(self):
        gates = Gate.query.all()

        result = [{
            'id': g.id,
            'name': g.name,
            'open_enabled': True if g.uri_open else False,
            'close_enabled': True if g.uri_close else False,
            'camera_enabled': True if g.uri_rtsp else False
        } for g in gates]
        
        return jsonify(result), 200


    """
    Add a new gate
    """
    @login_required
    def post(self):
        return "ok"



class GateView(MethodView):
    """
    Get gate details
    """
    @login_required
    def get(self, gate):
        gate = Gate.query.filter(Gate.id==gate).first_or_404()

        result = {
            'id': gate.id,
            'name': gate.name,
            'open_enabled': True if gate.uri_open else False,
            'close_enabled': True if gate.uri_close else False,
            'camera_enabled': True if gate.uri_rtsp else False
        }

        return jsonify(result), 200
 

    """
    Update gate settings
    """
    @login_required
    def put(self, gate):
        return "ok"


class GateEndpointsView(MethodView):
    """
    Get endpoints of a gate
    """
    @login_required
    def get(self, gate):
        endpoints = Endpoint.query.filter(Endpoint.gate==gate).all()

        result = [{
            'id': e.id,
            'name': e.name,
            'type': e.type
        } for e in endpoints]

        return jsonify(result), 200
 

    """
    Add endpoint for gate
    """
    @login_required
    def post(self, gate):
        return "ok"


class GateEndpointView(MethodView):
    """
    Update endpoint settings
    """
    @login_required
    def put(self, gate, endpoint):
        return "ok"


class GateCommandView(MethodView):
    """
    Send a command (open/close etc.) to a gate
    """
    @login_required
    def post(self, gate):
        return "ok"


class AccessView(MethodView):
    """
    Get all access entries
    """
    @login_required
    def get(self):
        accesses = Access.query.join(Endpoint) \
            .join(Gate, Endpoint.gate==Gate.id) \
            .add_columns(Endpoint.id, Endpoint.name, Gate.id, Gate.name) \
            .all()

        result = [{
            'id': a[0].id,
            'name': a[0].name,
            'code': a[0].code,
            'valid_from': a[0].valid_from,
            'valid_to': a[0].valid_to,
            'endpoint_id': a[1],
            'endpoint_name': a[2],
            'gate_id': a[3],
            'gate_name': a[4]
        } for a in accesses]
        
        return jsonify(result), 200



    """
    Create a new access entry
    """
    @login_required
    def post(self):
        return "ok"


class AccessDetailsView(MethodView):
    """
    Get access details
    """
    @login_required
    def get(self, access):
        return "ok"


    """
    Update access settings
    """
    @login_required
    def put(self, access):
        return "ok"


    """
    Delete access
    """
    @login_required
    def delete(self, access):
        return "ok"


class ActivityView(MethodView):
    """
    Get activity list
    """
    @login_required
    def get(self):
        activity = Activity.query.outerjoin(Access) \
            .join(Endpoint, Activity.endpoint==Endpoint.id) \
            .join(Gate, Endpoint.gate==Gate.id) \
            .add_columns(Access.id, Access.name, Endpoint.id, Endpoint.name, Gate.id, Gate.name) \
            .all()

        result = [{
            'id': a[0].id,
            'timestamp': a[0].timestamp,
            'success': a[0].success,
            'code': a[0].code,
            'command': a[0].command,
            'access_id': a[1],
            'access_name': a[2],
            'endpoint_id': a[3],
            'endpoint_name': a[4],
            'gate_id': a[5],
            'gate_name': a[6]
        } for a in activity]
        
        return jsonify(result), 200


class ActivityDetailsView(MethodView):
    """
    Get activity details
    """
    @login_required
    def get(self, activity):
        return "ok"


general_bp.add_url_rule('/gates', view_func=GatesView.as_view('gates'))
general_bp.add_url_rule('/gate/<gate>', view_func=GateView.as_view('gate'))
general_bp.add_url_rule('/gate/<gate>/endpoints', view_func=GateEndpointsView.as_view('gate_endpoints'))
general_bp.add_url_rule('/gate/<gate>/endpoint/<endpoint>', view_func=GateEndpointView.as_view('gate_endpoint'))
general_bp.add_url_rule('/gate/<gate>/command', view_func=GateCommandView.as_view('gate_command'))

general_bp.add_url_rule('/access', view_func=AccessView.as_view('access'))
general_bp.add_url_rule('/access/<access>', view_func=AccessDetailsView.as_view('access_details'))

general_bp.add_url_rule('/activity', view_func=ActivityView.as_view('activity'))
general_bp.add_url_rule('/activity/<activity>', view_func=ActivityDetailsView.as_view('activity_details'))


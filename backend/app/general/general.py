from flask import Blueprint, request, jsonify, abort

from flask.views import MethodView
from flask_login import login_required, current_user

general_bp = Blueprint('general_bp', __name__)

class GatesView(MethodView):
    """
    Get all the gates
    """
    @login_required
    def get(self):
        return "ok"


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
        return "ok"


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
        return "ok"


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


class AccessView(MethodView):
    """
    Get all access entries
    """
    @login_required
    def get(self):
        return "ok"


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
        return "ok"


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

general_bp.add_url_rule('/access', view_func=AccessView.as_view('access'))
general_bp.add_url_rule('/access/<access>', view_func=AccessDetailsView.as_view('access_details'))

general_bp.add_url_rule('/activity', view_func=ActivityView.as_view('activity'))
general_bp.add_url_rule('/activity/<activity>', view_func=ActivityDetailsView.as_view('activity_details'))


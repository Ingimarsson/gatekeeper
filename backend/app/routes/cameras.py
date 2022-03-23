from flask import Blueprint, jsonify, request
from flask.views import MethodView
from urllib.parse import urlparse

from flask_jwt_extended import jwt_required

from app import streams
from app.models import Camera
from app.utils import admin_required

camera_bp = Blueprint('camera_bp', __name__)

class CamerasView(MethodView):
  @jwt_required()
  def get(self):
    cameras = Camera.query.all()

    # Add latest images from streaming service to response
    try:
      stream_status = streams.get_status()
    except:
      stream_status = []

    result = [{
      "id": c.id,
      "name": c.name,
      "isVisible": c.is_visible,
      "ipAddress": urlparse(c.camera_uri).hostname,
    } for c in cameras]

    for r in result:
      for s in stream_status:
        if s['id'] == r['id']:
          r['isAlive'] = s['is_alive']
          r['latestImage'] = s['latest_image']
          r['cpuPercent'] = s['cpu_percent']

    return jsonify(result), 200

  @admin_required()
  def post(self):
    streams.update_config()

    return jsonify({"message": "ok"}), 200

camera_bp.add_url_rule('/camera', view_func=CamerasView.as_view('cameras'))

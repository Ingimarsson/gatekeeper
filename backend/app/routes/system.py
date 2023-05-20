from flask import Blueprint, jsonify
from flask.views import MethodView

from flask_jwt_extended import jwt_required
from sqlalchemy import func

from app import db
from app.models import Gate, Camera, ControllerStatus, CameraStatus

system_bp = Blueprint('system_bp', __name__)

class SystemView(MethodView):
  @jwt_required()
  def get(self):
    max_ids = db.session.query(func.max(ControllerStatus.id)).group_by(ControllerStatus.gate).all()

    controller_status = ControllerStatus.query \
      .join(Gate) \
      .filter(Gate.is_deleted == False) \
      .filter(ControllerStatus.id.in_([m[0] for m in max_ids])) \
      .order_by(Gate.id) \
      .add_columns(Gate.name) \
      .all()

    max_ids = db.session.query(func.max(CameraStatus.id)).group_by(CameraStatus.camera).all()

    stream_status = CameraStatus.query \
      .join(Camera) \
      .filter(CameraStatus.id.in_([m[0] for m in max_ids])) \
      .order_by(Camera.id) \
      .add_columns(Camera.name) \
      .all()

    result = {
      'controllers': [{
        'gate': c[1],
        'timestamp': c[0].timestamp,
        'alive': c[0].is_alive,
        'uptime': c[0].uptime if c[0].uptime else 0,
        'detectorTime': c[0].detector_time if c[0].detector_time else 0,
        'freeMemory': c[0].free_memory if c[0].free_memory else 0,
        'type': c[0].type,
        'ipAddress': c[0].ip_address
      } for c in controller_status],
      'streams': [{
        'gate': s[1],
        'timestamp': s[0].timestamp,
        'alive': s[0].is_alive,
        'uptime': s[0].uptime if s[0].uptime else 0,
        'pid': s[0].pid,
        'cpuUsage': s[0].cpu_usage,
        'memoryUsage': s[0].memory_usage,
        'diskUsage': s[0].disk_usage,
        'snapshotCount': s[0].snapshot_count,
      } for s in stream_status],
    }

    return jsonify(result), 200

system_bp.add_url_rule('/system', view_func=SystemView.as_view('system'))

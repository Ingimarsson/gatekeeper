from flask import Blueprint, jsonify, request
from flask.views import MethodView

from flask_jwt_extended import jwt_required

from app import redis
from app.models import Config

config_bp = Blueprint('config_bp', __name__)

class ConfigView(MethodView):
  @jwt_required()
  def get(self):
    config = {}

    # Get site name
    result = Config.query.filter(Config.key == 'site_name').first()
    if result:
        config['siteName'] = result.value

    # Get screen 1
    result_url = Config.query.filter(Config.key == 'screen_1_url').first()
    result_name = Config.query.filter(Config.key == 'screen_1_name').first()
    if result_url and result_name:
        config['screen1'] = {
            "url": result_url.value,
            "name": result_name.value,
            "lastFetch": redis.r.get('screen_1:last_fetch').decode('utf-8')
        }
    else:
        config['screen1'] = None

    # Get screen 2
    result_url = Config.query.filter(Config.key == 'screen_2_url').first()
    result_name = Config.query.filter(Config.key == 'screen_2_name').first()
    if result_url and result_name:
        config['screen2'] = {
            "url": result_url.value,
            "name": result_name.value,
            "lastFetch": redis.r.get('screen_2:last_fetch').decode('utf-8')
        }
    else:
        config['screen2'] = None

    return jsonify(config), 200

class ConfigScreenView(MethodView):
  @jwt_required()
  def get(self, id):
    body = redis.r.get('screen_{}:body'.format(id))
    last_fetch = redis.r.get('screen_{}:last_fetch'.format(id))

    if body:
        return jsonify({"body": body.decode('utf-8'), "lastFetch": last_fetch.decode('utf-8')}), 200
    else:
        return "", 200

config_bp.add_url_rule('/config', view_func=ConfigView.as_view('config'))
config_bp.add_url_rule('/config/screen/<id>', view_func=ConfigScreenView.as_view('config_screen'))
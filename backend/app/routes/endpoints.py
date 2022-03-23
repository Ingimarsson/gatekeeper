from flask import Blueprint, jsonify, request
from flask.views import MethodView

from app import db, logger, access
from app.models import Gate

endpoint_bp = Blueprint('endpoint_bp', __name__)

class GatekeeperView(MethodView):
  def get(self):
    token = request.args.get('token')
    button = request.args.get('button')
    pin = request.args.get('code')
    card = request.args.get('card')

    gate = Gate.query.filter(Gate.token != "", Gate.token == token).first_or_404()
    result = False

    logger.info("Got request from controller of gate {} (id: {}, button: {}, pin: {}, card: {})".format(gate.name, gate.id, button, pin, card))

    # The Gatekeeper controller has 4 different types of requests, buttons, pin, card, pin+card
    if button:
      result = access.handle_gatekeeper_request(gate.id, 'button-' + str(button))
    elif pin and card:
      result = access.handle_gatekeeper_request(gate.id, type='keypad-both', code="{}-{}".format(pin,card))
    elif pin:
      result = access.handle_gatekeeper_request(gate.id, type='keypad-pin', code=pin)
    elif card:
      result = access.handle_gatekeeper_request(gate.id, type='keypad-card', code=card)

    if result:
      return {"msg": "200 ok"}, 200
    else:
      return {"msg": "403 denied"}, 403


class OpenALPRView(MethodView):
  def post(self):
    token = request.args.get('token')
    gate = Gate.query.filter(Gate.token != "", Gate.token == token).first_or_404()

    result, code = access.handle_openalpr_request(gate.id, request.json)

    return jsonify(result), code

endpoint_bp.add_url_rule('/endpoint/gatekeeper', view_func=GatekeeperView.as_view('gatekeeper'))
endpoint_bp.add_url_rule('/endpoint/openalpr', view_func=OpenALPRView.as_view('openalpr'))

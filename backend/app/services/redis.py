import redis
import json
from datetime import datetime

class RedisService:
  r = None

  def __init__(self):
    self.r = redis.Redis(host='redis', port=6379, db=0)

  #
  def put_plate(self, gate_id, data):
    data['timestamp'] = datetime.now().timestamp()
    data['gate_id'] = gate_id
    data['type'] = 'plate'

    key = "gate_{}".format(gate_id)
    self.r.set(key, json.dumps(data))
    self.r.publish('alpr_feed', json.dumps(data))

    return

  def get_plate(self, gate_id, data):
    key = "gate_{}".format(gate_id)

    return json.loads(self.r.get(key))

  def publish_entry(self, gate_id, log_id):
    data = {
        'type': 'entry',
        'gate_id': gate_id,
        'log_id': log_id
    }
    self.r.publish('log_feed', json.dumps(data))
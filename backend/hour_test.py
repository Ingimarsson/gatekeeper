import re
from datetime import datetime

from flask import jsonify
from datetime import datetime
import re

from functools import wraps
from flask_jwt_extended import verify_jwt_in_request, get_jwt

def admin_required():
  def wrapper(fn):
    @wraps(fn)
    def decorator(*args, **kwargs):
      verify_jwt_in_request()
      claims = get_jwt()
      if claims["is_admin"]:
        return fn(*args, **kwargs)
      else:
        return jsonify(msg="This endpoint requires admin permissions"), 403

    return decorator

  return wrapper

def is_within_hours(start_hour, end_hour, current_hour = None):
  pattern = re.compile("^([01]?[0-9]|2[0-3]):([0-5][0-9])$")

  if not bool(pattern.match(start_hour)) or not bool(pattern.match(end_hour)):
    return False

  if not current_hour:
    current_hour = datetime.now().strftime('%H:%M')

  tmp = current_hour.split(':')
  current = int(tmp[0])*60 + int(tmp[1])

  tmp = start_hour.split(':')
  start = int(tmp[0])*60 + int(tmp[1])

  tmp = end_hour.split(':')
  end = int(tmp[0])*60 + int(tmp[1])

  if start < end:
    return current >= start and current <= end

  elif start > end:
    return current <= start and current >= end

  return False

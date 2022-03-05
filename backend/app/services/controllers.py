from urllib.parse import urlparse
import requests

class ControllerService:
  def init_app(self, app):
    return

  def send_command(self, gate, command='open', conditional=False):
    if gate.type == 'gatekeeper':
      if command == 'open' and not conditional:
        requests.get(f'http://{gate.controller_ip}/open', timeout=5)

      elif command == 'close' and not conditional:
        requests.get(f'http://{gate.controller_ip}/close', timeout=5)

      elif command == 'open' and conditional:
        requests.get(f'http://{gate.controller_ip}/grant', timeout=5)

      elif command == 'close' and conditional:
        requests.get(f'http://{gate.controller_ip}/deny', timeout=5)

    elif gate.type == 'generic':
      if command == 'open':
        requests.get(gate.uri_open, timeout=5)

      if command == 'close':
        requests.get(gate.uri_close, timeout=5)

  def get_status(self, gate):
    if gate.type == 'gatekeeper':
      response = requests.get(f'http://{gate.controller_ip}/json', timeout=2)

      if not response.ok:
        return {'is_alive': False, 'controller_ip': controller_ip}

      uptime = 0
      try:
        data = response.json()
        uptime = data['uptime']
      except:
        pass

      return {'is_alive': True, 'controller_ip': controller_ip, 'uptime': uptime}

    elif gate.type == 'generic':
      # If there is no open uri then we can't do much
      if gate.uri_open == '':
        return {'is_alive': False}

      controller_ip = urlparse(gate.uri_open).hostname
      response = requests.get(f'http://{controller_ip}/', timeout=2)

      if not response.ok:
        return {'is_alive': False, 'controller_ip': controller_ip}

      return {'is_alive': True, 'controller_ip': controller_ip}

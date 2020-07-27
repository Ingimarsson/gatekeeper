import requests
import time
import os
import shutil

from app import db
from app.models import Access, Endpoint, Gate, Activity

class GateService(object):
    def handle_open(self, endpoint, content):
        """Handle the opening of a gate by an endpoint.
        """
        if endpoint[0].type == 'openalpr':
            code, success, meta = self.read_openalpr(endpoint, content)

        else:
            code, success, meta = self.read_generic(endpoint, content)

        if code == '':
            return False

        access = Access.query.filter(Access.code==code, Access.endpoint==endpoint[0].id).first()
        snapshot = self.save_snapshot(endpoint[4])

        a = Activity()
        a.endpoint = endpoint[0].id
        a.code = code
        a.meta = meta
        a.snapshot = snapshot

        # TODO: handle valid from/to timestamps
        if access and success:
              # Send gate open command
              requests.get(endpoint[1], timeout=1)

              a.success = True
              a.access = access.id
            
        # Send NVR trigger
        requests.get(endpoint[2], timeout=1)

        db.session.add(a)
        db.session.commit()

        return a.success


    def read_openalpr(self, endpoint, content):
        """Read data from an OpenALPR endpoint.
        """
        if content.get('data_type') != 'alpr_group':
            return ('', False, '')

        direction = content.get('travel_direction') 

        success = True
        meta = {'direction': 'ingoing'}

        if direction < endpoint[3]['min_dir'] or direction > endpoint[3]['max_dir']:
            success = False
            meta['direction'] = 'outgoing'

        code = content.get('best_plate_number')

        return code, success, meta


    def read_generic(self, endpoint, content):
        """Read data from a generic endpoint.
        """
        code = content.get('code')

        return code


    def open_gate(self, gate, user_id, command='open'):
        """Handle gate opening via web interface.
        """
        if command == 'open':
            requests.get(gate.uri_open, timeout=1)

        elif command == 'close':
            requests.get(gate.uri_close, timeout=1)

        else:
            return None

        requests.get(gate.uri_nvr, timeout=1)

        snapshot = self.save_snapshot(gate.id)

        a = Activity()
        a.gate = gate.id
        a.snapshot = snapshot
        a.command = command
        a.success = True
        a.user = user_id

        db.session.add(a)
        db.session.commit()

        return


    def save_snapshot(self, gate_id):
        """Save a current snapshot from given gate and return filename.
        """
        # TODO: don't hardcode data path
        time_s = int(time.time())
        time_us = int(time.time()*1000000)

        for t in range(time_s, time_s-10, -1):
            source = '/data/live/{}/{}.jpg'.format(gate_id, t)
            filename = '{}.jpg'.format(time_us)

            if os.path.isfile(source):
                shutil.copy(source, '/data/snapshot/{}'.format(filename))
                return filename

        return None


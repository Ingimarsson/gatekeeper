import datetime
import socket
import json

from app import logger
from app.models import Log, Method, User

class MatrixService:
    CHARACTER_MAPPING = {'Á': 'A', 'Ð': 'D', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U', 'Ý': 'Y', 'Þ': 'TH', 'Æ': 'AE', 'Ö': 'O'}
    REASON_MAPPING = {'granted': 'granted', 'expired': 'expired', 'close_time': 'close time', 'not_found': 'not found', 'disabled': 'disabled'}

    COLOR_WHITE = 0
    COLOR_YELLOW = 1
    COLOR_GREEN = 2
    COLOR_RED = 3

    MATRIX_HOST = "192.168.1.147"
    MATRIX_PORT = 8185

    def send_message(self, ttl, priority, color, lines):
        message = {
            'ttl': ttl,
            'priority': priority,
            'color': color,
            'lines': map(lambda text: {'text': text}, lines)
        }

        payload = json.dumps(message).encode("ascii")

        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        sock.bind(('0.0.0.0', 28123))
        sock.sendto(payload, (self.MATRIX_HOST, self.MATRIX_PORT))

        logger.info("Sent to matrix '{}'".format(payload))

    def send_result_message(self, log_entry: Log, method: Method, user: User):
        if log_entry.reason == 'not_detected':
            lines = [
                self.format_matrix_text(log_entry.code),
                'too far'.upper(),
                'from gate'.upper()
            ]
            self.send_message(10, 30, self.COLOR_WHITE, lines)

            return

        lines = [
            self.format_matrix_text(log_entry.code),
            self.REASON_MAPPING['granted'].upper(),
            self.format_matrix_text(user.name),
        ]
        color = self.COLOR_WHITE

        if log_entry.reason not in self.REASON_MAPPING.keys():
            return
        
        if log_entry.reason in ['expired', 'close_time', 'not_found', 'disabled']:
            lines[1] = self.format_matrix_text(self.REASON_MAPPING[log_entry.reason])
            color = self.COLOR_RED

        if method.end_date:
            lines[2] = self.format_matrix_text('TIL {}'.format(method.end_date.strftime('%d %b')))

        # Show expiry hour instead of date if expires today
        if method.end_hour and method.end_date.date() == datetime.datetime.today().date():
            lines[2] = 'TIL {}'.format(method.end_hour.strftime('%H:%M'))

        if method.end_hour and log_entry.reason == 'close_time':
            lines[2] = 'OPEN {}'.format(method.start_hour.strftime('%H:%M'))
            lines[3] = ''

        self.send_message(10, 30, color, lines)

    def send_processing_message(self, plate: str, num: int, needed: int):
        lines = [
            self.format_matrix_text(plate),
            num * '.' + (needed - num) * '_'
        ]

        self.send_message(2, 20, self.COLOR_WHITE, lines)

    def send_detector_message(self):
        lines = [
            'stop in'.upper(),
            'front of'.upper(),
            'camera'.upper(),
        ]
        self.send_message(10, 10, self.COLOR_WHITE, lines)

    def format_matrix_text(self, text: str):
        mapping = str.maketrans(self.CHARACTER_MAPPING)

        return text.upper() \
            .translate(mapping) \
            .encode('ascii',errors='ignore') \
            .decode()[:10]
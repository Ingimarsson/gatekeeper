import time
import os
import subprocess

path = os.getcwd()

def make_cmd(url, path):
  return ['ffmpeg', '-i', url, '-f', 'image2', '-vf', "scale=w='min(800\, iw*3/2):h=-1' ", \
    '-r', '1', '-strftime', '1', '{}/%s.jpg'.format(path)]


def run():
  gates = [
    {'id': 1, 'rtsp': 'rtsp://admin:@192.168.1.102:554/h264Preview_01_main'},
    {'id': 2, 'rtsp': 'rtsp://admin:@192.168.1.104:554/h264Preview_01_main'}
  ]

  # First time setup
  for i,gate in enumerate(gates):
    gates[i]['path'] = os.path.join(path, str(gate['id']))

    if not os.path.isdir(gate['path']):
      os.mkdir(gate['path'])

    gates[i]['process'] = subprocess.Popen(make_cmd(gate['rtsp'], gate['path']))

  # Infinite loop
  while True:
    print("Working on something...")

    for i,gate in enumerate(gates):
      if gate['process'].poll() is None:
        print('Stream for gate {} is running'.format(gate['id']))

      else:
        print('Stream for gate {} dead with exit code {}, restarting'.format(gate['id'], gate['process'].poll()))
        gates[i]['process'] = subprocess.Popen(make_cmd(gate['rtsp'], gate['path']))


    time.sleep(5)


if __name__ == '__main__':
  run()

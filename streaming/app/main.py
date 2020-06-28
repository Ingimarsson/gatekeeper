import time
import os
import subprocess
import psycopg2

root = '/data'
path = os.path.join(root, 'live/')

sql_host = os.environ['SQL_HOST']
sql_user = os.environ['SQL_USER']
sql_pass = os.environ['SQL_PASS']
sql_db = os.environ['SQL_DB']

if not os.path.isdir(path):
  os.mkdir(path)

def make_cmd(url, path):
  return ['ffmpeg', '-rtsp_transport', 'tcp', '-i', url, '-f', 'image2', '-vf', "scale=w='min(800\, iw*3/2):h=-1' ", \
    '-r', '1', '-strftime', '1', '{}/%s.jpg'.format(path)]


def run():
  # Get gates from database
  try:
    conn = psycopg2.connect(host=sql_host, user=sql_user, password=sql_pass, dbname=sql_db)
  except:
    print("Unable to connect to the database")

  c = conn.cursor()
  c.execute("SELECT id, uri_rtsp FROM gate;")
  result = c.fetchall()

  gates = []

  for g in result:
    gates.append({'id': g[0], 'rtsp': g[1]})

  c.close()
  conn.close()
  
  """
  gates = [
    {'id': 1, 'rtsp': 'rtsp://admin:@192.168.1.102:554/h264Preview_01_main'},
    {'id': 2, 'rtsp': 'rtsp://admin:@192.168.1.104:554/h264Preview_01_main'}
  ]
  """

  # First time setup
  for i,gate in enumerate(gates):
    gates[i]['path'] = os.path.join(path, str(gate['id']))

    if not os.path.isdir(gate['path']):
      os.mkdir(gate['path'])

    time.sleep(2)
    gates[i]['process'] = subprocess.Popen(make_cmd(gate['rtsp'], gate['path']), stdout=subprocess.PIPE)

  # Infinite loop
  while True:
    print("Refreshing")

    for i,gate in enumerate(gates):
      if gate['process'].poll() is None:
        print('Stream for gate {} is running'.format(gate['id']))

      else:
        print('Stream for gate {} dead with exit code {}, restarting'.format(gate['id'], gate['process'].poll()))
        gates[i]['process'] = subprocess.Popen(make_cmd(gate['rtsp'], gate['path']))

    # Delete all snapshots older than one minute

    del_cmd = 'find %s -mmin +1 -type f -exec rm -fv {} \;' % (path)
    subprocess.Popen(del_cmd, shell=True)

    time.sleep(5)


if __name__ == '__main__':
  run()

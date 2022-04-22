import asyncio
import aioredis
import websockets
import json
import jwt
import os

async def subscribe_to_redis(path):
    conn = aioredis.from_url('redis://redis:6379')
    channel = conn.pubsub()
    await channel.subscribe('alpr_feed')
    await channel.subscribe('log_feed')

    return channel, conn

async def browser_server(websocket, path):
    secret = os.getenv('JWT_SECRET', 'debug_secret')

    await websocket.send(json.dumps({"type": "hello", "message": "Authentication required."}))

    message = await websocket.recv()
    token = json.loads(message)['token']

    try:
        jwt.decode(token, secret, algorithms=["HS256"])
        print("Successful authentication from {}".format(websocket.remote_address))

    except:
        await websocket.send(json.dumps({"type": "hello", "message": "Authentication failed."}))
        await websocket.close(1011, "authentication failed")
        print("Failed authentication from {}".format(websocket.remote_address))
        return

    await websocket.send(json.dumps({"type": "hello", "message": "Authentication successful."}))

    channel, conn = await subscribe_to_redis(path)

    try:
        while True:
            # Wait until data is published to this channel
            message = await channel.get_message(ignore_subscribe_messages=True, timeout=0.01)

            # Send unicode decoded data over to the websocket client
            if message is not None:
                await websocket.send(message['data'].decode('utf-8'))

    except websockets.exceptions.ConnectionClosed:
        # Free up channel if websocket goes down
        print("Closing connection from {}".format(websocket.remote_address))
        await channel.unsubscribe('alpr_feed')
        await channel.unsubscribe('log_feed')
        conn.close()

if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    loop.set_debug(True)
    ws_server = websockets.serve(browser_server, '0.0.0.0', 8767)
    loop.run_until_complete(ws_server)
    loop.run_forever()
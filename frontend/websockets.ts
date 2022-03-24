const WebsocketsClient = (token: string) => {
  const ws = new WebSocket(`ws://${window.location.hostname}:8767`);

  ws.addEventListener("open", () => {
    ws.send(JSON.stringify({ token: token }));
  });

  ws.addEventListener("message", (e) => {
    console.log("ws", e.data);
  });

  return ws;
};

export default WebsocketsClient;

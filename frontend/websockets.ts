const WebsocketsClient = (token: string) => {
  const server =
    window.location.protocol === "https:"
      ? `wss://${window.location.hostname}/ws`
      : `ws://${window.location.hostname}:8767`;

  const ws = new WebSocket(server);

  ws.addEventListener("open", () => {
    ws.send(JSON.stringify({ token: token }));
  });

  ws.addEventListener("message", (e) => {
    console.log("ws", e.data);
  });

  return ws;
};

export default WebsocketsClient;

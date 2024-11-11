const ws = require("ws");

const PORT = 3001;
const wss = new ws.WebSocketServer({ port: PORT });

const clients = new Set();

wss.on("connection", (ws) => {
  clients.add(ws);
  console.log("Client Connected");

  ws.on("close", () => {
    clients.delete(ws);
    console.log("Client Disconnected");
  });

  ws.on("message", (message) => {
    console.log("Received Message", message.toString());
    clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});

console.log(`Websocket server running on port ${PORT}`);

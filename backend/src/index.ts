import { WebSocketServer } from 'ws';


const PORT = 3001;
const wss = new WebSocketServer({ port: PORT });

const clients = new Map<any, any>();

wss.on("connection", (ws:WebSocket) => {
  clients.set(ws, "");
  console.log("Client Connected");

  // ws.on("close", () => {
  //   clients.delete(ws);
  //   console.log("Client Disconnected");
  // });

  ws.on("message", (message: any) => {
    console.log("Received Message", message.toString());
    const data = JSON.parse(message.toString());
    if(data.type === "new-user"){
      clients.set(ws, data.username);
      broadcast(JSON.stringify({
        type: 'status',
        message:`${data.username} has joined the chat`,
        timestamp: new Date().toISOString()
      }));
    }
  });

  ws.on("close",()=>{
    const username = clients.get(ws);
    clients.delete(ws);
    if(username){
      console.log("Client Disconnected");
      broadcast(JSON.stringify({
        type: 'status',
        message:`${username} has left the chat`,
        timestamp: new Date().toISOString()
      }));
    }
  })
});

function broadcast(data: any){
  clients.forEach((_, client)=>{
    if(client.readyState === WebSocket.OPEN){
      client.send(data);
    }
  });
  console.log("Notifications sent to all clients");
}

console.log(`Websocket server running on port ${PORT}`);

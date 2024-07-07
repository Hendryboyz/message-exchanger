import WebSocket from 'ws';
import { WebSocketMessageFactory } from './module/websocket.message-factory';

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws: WebSocket) => {
  const factory = new WebSocketMessageFactory(ws);
  const sender = factory.createSender();
  const receiver = factory.createReceiver();

  ws.on('message', (data: WebSocket.Data, isBinary: boolean) => {
    if (isBinary) {
      return;
    }
  
    const message = JSON.parse(data.toString());
    const isControlMessage = 'type' in message;
    if (!isControlMessage) {
      receiver.receive(message);
      return;
    }
    if (message.type === 'ack') {
      sender.handleAck(message.id);
    } else if (message.type === 'ack_received') {
      receiver.confirmAckReceived(message.messageId)
    }
  });

  sender.send('Hello from server!');
});

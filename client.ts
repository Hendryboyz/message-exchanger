import WebSocket from 'ws';
import { WebSocketMessageFactory } from './module/websocket.message-factory';

const ws = new WebSocket('ws://localhost:8080');
const factory = new WebSocketMessageFactory(ws);
const sender = factory.createSender();
const receiver = factory.createReceiver();
ws.on('open', () => {
  

  // Example of sending a message
  sender.send('Hello from client!');
});

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

import WebSocket from 'ws';
import { selectMessageExchanger } from './module/utils';


const ws = new WebSocket('ws://localhost:8080');
const exchanger = selectMessageExchanger(ws);
ws.on('open', () => {
  // Example of sending a message
  exchanger.send('Hello from client!');
});

ws.on('message', (data: WebSocket.Data, isBinary: boolean) => {
  if (isBinary) {
    return;
  }
  exchanger.handleMessage(data.toString());
});

import WebSocket from 'ws';
import { selectMessageExchanger } from './module/utils';

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws: WebSocket) => {
  const exchanger = selectMessageExchanger(ws);


  ws.on('message', (data: WebSocket.Data, isBinary: boolean) => {
    if (isBinary) {
      return;
    }
  
    exchanger.handleMessage(data.toString());
  });

  exchanger.send('Hello from server!');
});

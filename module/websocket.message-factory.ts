import WebSocket from "ws";
import { IMessageFactory, ISender, IReceiver } from "./interface";
import { WebSocketReceiver } from "./websocket.receiver";
import { WebSocketSender } from "./websocket.sender";


export class WebSocketMessageFactory implements IMessageFactory {
  constructor(private readonly ws: WebSocket) { }

  createSender(): ISender {
    return new WebSocketSender(this.ws);
  }
  createReceiver(): IReceiver {
    return new WebSocketReceiver(this.ws);
  }
}

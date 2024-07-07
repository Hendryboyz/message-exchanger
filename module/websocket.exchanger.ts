import WebSocket from "ws";
import { IExchanger, IReceiver, ISender } from "./interface";
import { WebSocketMessageFactory } from "./websocket.message-factory";

export class WebSocketExchanger implements IExchanger {
  private sender: ISender;
  private receiver: IReceiver;

  constructor(private ws: WebSocket) {
    const factory = new WebSocketMessageFactory(this.ws);
    this.sender = factory.createSender();
    this.receiver = factory.createReceiver();
  }

  send(data: any): void {
    this.sender.send(data);
  }

  handleMessage(data: string): void {
    const message = JSON.parse(data);
    const isControlMessage = 'type' in message;
    if (!isControlMessage) {
      this.receiver.receive(message);
      return;
    }
    if (message.type === 'ack') {
      this.sender.handleAck(message.id);
    } else if (message.type === 'ack_received') {
      this.receiver.confirmAckReceived(message.messageId)
    }
  }

}
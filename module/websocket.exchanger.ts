import { IExchanger, IMessageFactory, IReceiver, ISender } from "./interface";

export class WebSocketExchanger implements IExchanger {
  private sender: ISender;
  private receiver: IReceiver;

  constructor(private readonly factory: IMessageFactory) {
    this.sender = this.factory.createSender();
    this.receiver = this.factory.createReceiver();
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
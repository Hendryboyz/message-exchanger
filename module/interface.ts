import { Message } from "./dto";

  
export interface ISender {
  send(data: any): void;
  handleAck(messageId: string): void;
}

export interface IReceiver {
  receive(message: Message): void;
  confirmAckReceived(messageId: string): void;
}

export interface IMessageFactory {
  createSender(): ISender;
  createReceiver(): IReceiver;
}

export interface IExchanger {
  send(data: any): void;
  handleMessage(data: any): void;
}

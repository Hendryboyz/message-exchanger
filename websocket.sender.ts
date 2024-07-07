import { v4 as uuid } from 'uuid';
import { Message } from "./dto";
import { ISender } from "./interface";

type ProcessingMessage = {
  message: Message,
  timeout?: NodeJS.Timeout,
}

export class WebSocketSender implements ISender {
  private processingMessages: Map<string, ProcessingMessage> = new Map();

  constructor(
    private readonly ws: WebSocket,
    private retryInterval: number = 5000,
  ) { }
  
  send(data: any): void {
    const message: Message = {
      id: uuid(),
      data
    }
    this.processingMessages.set(message.id, {
      message
    });

    this.sendWithRetry(message.id);
  }
  
  private sendWithRetry(messageId: string) {
    if (this.processingMessages.has(messageId)) {
      return;
    }

    const processingMessage = this.processingMessages.get(messageId);
    if (!processingMessage) return;
    try {
      this.ws.send(JSON.stringify(processingMessage?.message));
      const ackTimeout = setTimeout(() => this.sendWithRetry(messageId), this.retryInterval);
      processingMessage.timeout = ackTimeout;
    } catch (error) {
      console.error(`Failed to send message[${processingMessage.message.id}]: ${processingMessage.message.data}`, error);
      const retryTimeout = setTimeout(() => this.sendWithRetry(messageId), this.retryInterval);
      processingMessage.timeout = retryTimeout;
    }
  }
  
  handleAck(messageId: string): void {
    if (!this.processingMessages.has(messageId)) {
      this.notifyReceiver(messageId);
      return;
    }
    const processingMessage = this.processingMessages.get(messageId);
    clearTimeout(processingMessage?.timeout);
    console.debug(`Message[${messageId}] has been received by receiver: ${processingMessage?.message.data}`);
    this.processingMessages.delete(messageId);
    this.notifyReceiver(messageId);
  }
  
  private notifyReceiver(messageId: string) {
    try {
      const message = {
        type: 'ack_received',
        messageId
      };
      this.ws.send(JSON.stringify(message));
    } catch (error) {
      console.error(`Fail to notify receiver: ${messageId}`);
    }
  }
}
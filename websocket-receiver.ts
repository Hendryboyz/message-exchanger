import { Message } from "./dto";
import { IReceiver } from "./interface";

export class WebSocketReceiver implements IReceiver {
  private processedMessages: Set<string> = new Set();
  private ackingMessages: Map<string, NodeJS.Timeout> = new Map();

  constructor(
    private readonly ws: WebSocket,
    private readonly retryInterval: number = 5000,
  ) { }
  
  receive(message: Message): void {
    if (this.processedMessages.has(message.id)) {
      return;
    }

    this.processedMessages.add(message.id);
  }

  private async sendAckWithRetry(messageId: string): Promise<void> {
    try {
      const ackMessage = {
        type: 'ack',
        messageId
      };
      this.ws.send(JSON.stringify(ackMessage));
      this.reAck(messageId);
    } catch (error) {
      console.error(`Fail to ack message: ${messageId}`);
      this.reAck(messageId);
    }
  }

  private reAck(messageId: string) {
    const ackTimeout = setTimeout(() => this.sendAckWithRetry(messageId), this.retryInterval);
    this.ackingMessages.set(messageId, ackTimeout);
  }

  confirmAckReceived(messageId: string): void {
    if (!this.ackingMessages.has(messageId)) {
      console.warn(`Duplicated message[${messageId}] ack confirmed`);
      return
    }
    clearTimeout(this.ackingMessages.get(messageId));
    this.ackingMessages.delete(messageId);
  }

}
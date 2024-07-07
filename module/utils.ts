import WebSocket from "ws";
import { IExchanger } from "./interface";
import { WebSocketExchanger } from "./websocket.exchanger";
import { WebSocketMessageFactory } from "./websocket.message-factory";

export const selectMessageExchanger = (client: any): IExchanger => {
  if (client instanceof WebSocket) {
    const factory = new WebSocketMessageFactory(client)
    return new WebSocketExchanger(factory);
  } else {
    throw new Error(`Not support message exchange client.`)
  }
}
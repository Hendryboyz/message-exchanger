import WebSocket from "ws";
import { IExchanger } from "./interface";
import { WebSocketExchanger } from "./websocket.exchanger";

export const selectMessageExchanger = (client: any): IExchanger => {
  if (client instanceof WebSocket) {
    return new WebSocketExchanger(client);
  } else {
    throw new Error(`Not support message exchange client.`)
  }
}
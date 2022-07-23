import { Injectable } from '@angular/core';
import initWebSocket from './websocket'
@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private _clientSocket: SocketIOClient.Socket;
  constructor() {
    this._clientSocket = initWebSocket();
  }

  get clientSocket(): SocketIOClient.Socket {
    return this._clientSocket;
  }
}

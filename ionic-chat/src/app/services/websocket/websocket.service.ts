import { WebsocketMessage, WebsocketMessageTypes } from 'src/app/models/models';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private websocket: WebSocket

  constructor() { }

  connect() {
    this.websocket = new WebSocket(`ws://${environment.base_url.split("//").pop()}/websocket/message`)
    const webSocketMessage = new WebsocketMessage();
    webSocketMessage.type = WebsocketMessageTypes.connection

    this.websocket.onclose = () => {
      this.connect()
    }

    this.websocket.onopen = () => {
      this.sendMessage(webSocketMessage)
    }

  }

  sendMessage(message: WebsocketMessage) {
    this.websocket.send(JSON.stringify(message))
  }

}

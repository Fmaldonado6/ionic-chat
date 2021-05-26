import { UsersService } from 'src/app/services/users/users.service';
import { Message, WebsocketMessage, WebsocketMessageTypes } from 'src/app/models/models';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private websocket: WebSocket

  message = new BehaviorSubject<Message>(null)

  constructor(private usersService: UsersService) { }

  connect() {

    let string = `ws://${environment.base_url.split("//").pop()}/websocket/message`

    if (environment.production)
      string = `wss://${environment.base_url.split("//").pop()}/websocket/message`
    this.websocket = new WebSocket(string)
    const webSocketMessage = new WebsocketMessage();
    webSocketMessage.type = WebsocketMessageTypes.connection
    webSocketMessage.message = this.usersService.loggedUser.id
    this.websocket.onclose = () => {
      this.connect()
    }

    this.websocket.onopen = () => {
      this.sendMessage(webSocketMessage)
    }

    this.websocket.onmessage = (msg: any) => {
      const wsMessage = JSON.parse(msg.data) as Message
      this.message.next(wsMessage)
    }


  }

  sendMessage(message: WebsocketMessage) {
    this.websocket.send(JSON.stringify(message))
  }

}

import { UsersService } from 'src/app/services/users/users.service';
import { Message, WebsocketMessage, WebsocketMessageTypes } from 'src/app/models/models';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  //Variable que guarda la conexión al websocket
  private websocket: WebSocket
  //Variable que notifica cuando llegue un mensaje nuevo
  message = new BehaviorSubject<Message>(null)

  constructor(private usersService: UsersService) { }

  connect() {
    console.log(environment.websocketUrl)
    //Se establece una nueva conexión al websocket y se crea un mensaje de conectado
    this.websocket = new WebSocket(environment.websocketUrl)
    const webSocketMessage = new WebsocketMessage();
    webSocketMessage.type = WebsocketMessageTypes.connection
    webSocketMessage.message = this.usersService.loggedUser.id

    //Al abrir la conexión enviamos un mensaje inicial para avisar al server de una nueva conexión
    this.websocket.onopen = () => {
      this.sendMessage(webSocketMessage)

    }

    //Si la conexión se cierra intentamos conectarnos otra vez
    this.websocket.onclose = () => {
      this.connect()
    }

    //Al recibir un mensaje convertimos el JSON a un objeto Message
    this.websocket.onmessage = (msg: any) => {
      const wsMessage = JSON.parse(msg.data) as Message
      this.message.next(wsMessage)
    }


  }

  //Mandamos un mensaje al websocket en JSON string
  sendMessage(message: WebsocketMessage) {
    this.websocket.send(JSON.stringify(message))
  }

}

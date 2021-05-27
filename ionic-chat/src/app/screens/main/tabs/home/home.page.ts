import { Subscription } from 'rxjs';
import { IonVirtualScroll, ViewWillEnter } from '@ionic/angular';
import { Component, OnInit, OnDestroy, Input, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Chat, ChatResource, FullChatInfo, Status, User } from 'src/app/models/models';
import { ChatsService } from 'src/app/services/chats/chats.service';
import { UsersService } from 'src/app/services/users/users.service';
import { WebsocketService } from 'src/app/services/websocket/websocket.service';
import { ChatsStatus } from '../../main.page';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements ViewWillEnter, OnDestroy, OnInit {

  Status = Status
  currentStatus = Status.loading

  chats: ChatResource[] = []
  subscription: Subscription

  loggedUser = new User()

  constructor(
    private chatService: ChatsService,
    private usersService: UsersService,
    private websocketService: WebsocketService
  ) { }

  ngOnInit(): void {


    //Obtenemos el usuario loggeado
    this.loggedUser = this.usersService.loggedUser

    //Nos suscribimos a los mensajes recibidos del websocket
    this.subscription = this.websocketService.message.asObservable().subscribe(e => {
      console.log(e)
      //Si el mensaje es nulo no hacemos nada
      if (!e)
        return

      //Si el mensaje tiene contenido buscamos en los chats activos el id de quien lo envía para saber
      //Si se debe agregar como chat nuevo o se debe actualizar uno ya existente
      for (let chat of this.chats) {
        //Si encontramos el id del remitente entonces actualizamos el chat
        //para mostrar el último mensaje enviado actualizamos el contador de mensajes nuevos
        if (chat.chatId == e.chatId) {
          const index = this.chats.indexOf(chat)
          chat.latestMessage = e
          chat.newMessages++

          //Cambiamos de posición el chat en la lista para que aparezca al inicio
          this.chats.unshift(this.chats.splice(index, 1).pop())

          return;
        }
      }

      //Si no se encuentra el id en los chats
      //Se crea un chat nuevo con la información del mensaje y se agrega a la lista de chats
      const newChat = new ChatResource()
      newChat.chatId = e.chatId
      newChat.receiverId = e.senderId
      newChat.receiverName = e.senderName
      newChat.latestMessage = e
      newChat.newMessages++
      this.chats.unshift(newChat)
      this.currentStatus = Status.loaded

    })
  }

  ngOnDestroy(): void {
    if (this.subscription)
      this.subscription.unsubscribe()
  }

  ionViewWillEnter(): void {
    //Obtenemos los chats al iniciar la vista
    this.getChats()

  }

  //Se usa para especificarle al ion-virtual-scroll que actualice su contenido 
  //si el elemento chatId cambia de valor
  trackById(index: number, item: ChatResource) {
    return item.chatId
  }

  getChats() {
    //Cambiamos el estado a cargando
    this.currentStatus = Status.loading
    //Obtenemos los chats desde el servicio
    this.chatService.getUserChats().subscribe(e => {

      this.chats = e
      //Si la longitud es 0 cambiamos el estado a vacío
      if (this.chats.length == 0)
        return this.currentStatus = Status.empty
      //Si no lo ponemos en cargado
      this.currentStatus = Status.loaded
    })
  }

}

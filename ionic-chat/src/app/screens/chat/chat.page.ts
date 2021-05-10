import { UsersService } from 'src/app/services/users/users.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { ChatsService } from 'src/app/services/chats/chats.service';
import { WebsocketService } from 'src/app/services/websocket/websocket.service';
import { Chat, FullChatInfo, Message, WebsocketMessage, WebsocketMessageTypes } from 'src/app/models/models';
import { Subscription } from 'rxjs';

interface FormData {
  message: string
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit, OnDestroy {

  form: FormGroup
  receiverId: string
  chat: FullChatInfo = new FullChatInfo()
  senderId: string
  subscription: Subscription
  constructor(
    private chatService: ChatsService,
    private usersService: UsersService,
    private route: ActivatedRoute,
    private websocketService: WebsocketService
  ) { }
  ngOnDestroy(): void {
    if (this.subscription)
      this.subscription.unsubscribe()
  }


  ngOnInit() {

    this.websocketService.connect()

    this.form = new FormGroup({
      message: new FormControl('')
    })

    this.senderId = this.usersService.loggedUser.id

    this.receiverId = this.route.snapshot.params.id
    this.chatService.getChatInfo(this.receiverId).subscribe(e => {
      this.chat = e
    })

    this.subscription = this.websocketService.message.subscribe(e => {
      if (e)
        this.chat.messages.push(e)
    })
  }

  sendMessage(value: FormData) {
    const message = new Message()
    message.message = value.message
    message.receiverId = this.receiverId
    message.senderId = this.usersService.loggedUser.id
    const websocketMessage = new WebsocketMessage()
    websocketMessage.type = WebsocketMessageTypes.send
    websocketMessage.message = JSON.stringify(message)
    this.websocketService.sendMessage(websocketMessage)
    this.chat.messages.push(message)
  }


}

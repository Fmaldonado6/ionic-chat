import { Subscription } from 'rxjs';
import { ViewWillEnter } from '@ionic/angular';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Chat, FullChatInfo, Status, User } from 'src/app/models/models';
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

  chats: FullChatInfo[] = []
  subscription: Subscription
  constructor(
    private chatService: ChatsService,
    private websocketService: WebsocketService
  ) { }

  ngOnInit(): void {
    this.subscription = this.websocketService.message.asObservable().subscribe(e => {
      if (e) {
        for (let chat of this.chats) {
          if (chat.chatId == e.chatId)
            return
        }

        const newChat = new FullChatInfo()

        newChat.chatId = e.chatId
        const receiver = new User()
        receiver.id = e.receiverId
        newChat.receiver = receiver
        this.chats.push(newChat)
      }
    })
  }

  ngOnDestroy(): void {
    if (this.subscription)
      this.subscription.unsubscribe()
  }

  ionViewWillEnter(): void {
    this.getChats()

  }

  getChats() {
    this.currentStatus = Status.loading
    this.chatService.getUserChats().subscribe(e => {


      this.chats = e

      if (this.chats.length == 0)
        return this.currentStatus = Status.empty

      this.currentStatus = Status.loaded
    })
  }

}
